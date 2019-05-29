import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/modal-dialog';
import { inject as service } from '@ember-decorators/service';
import Modal from '@gavant/ember-modals/services/modal';
import { computed } from '@ember-decorators/object';
import { later, bind } from '@ember/runloop';
import { setProperties } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { layout } from '@ember-decorators/component';

const ESC_KEY = 27;

@layout(template)
export default class ModalDialogClass extends ModalDialog {
    @service modal!: Modal;

    /**
    * @default md
    */
    size = 'md';

    /**
    * @default modal fade show
    */
    containerClass = 'modal fade show';

    /**
    * @default sibling
    */
    overlayPosition = 'sibling';
    targetAttachment = null;

    /**
    * @default true
    */
    translucentOverlay = true;

    /**
    * @default true
    */
    hasOverlay = true;

    /**
    * @default true
    */
    closable = true;
    keyupHandler: any;
    clickHandler: any;

    /**
    * Computed property that watches for changes on `modal.animation`
    *
    * @returns Overlay class based on animation state
    */
    @computed('modal.animation')
    get overlayClass() {
        return `modal-backdrop animated ${this.modal.animation && this.modal.animation.includes('In') ? 'fadeIn' : 'fadeOut' }`;
    }

    /**
    * Computed property that watches for changes on `size`
    *
    * @returns Class based on size
    */
    @computed('size')
    get modalSize(): string {
        return `modal-${this.size}`;
    }

    /**
    * Sets up event listeners for `keyup` and `click`, as well as adds a `modal-open` class to the body
    */
    didInsertElement() {
        super.didInsertElement();
        const keyupHandler = bind(this, 'onDocumentKeyup');
        const clickHandler = bind(this, 'onDocumentClick');
        document.addEventListener('keyup', keyupHandler);
        document.addEventListener('click', clickHandler);
        document.body.classList.add('modal-open');
        setProperties(this, { keyupHandler, clickHandler });
    }

    /**
    * Tears down event listeners for `keyup` and `click`, as well as removes the `modal-open` class from the body after the `animationDuration`
    */
    willDestroyElement() {
        super.willDestroyElement();
        document.removeEventListener('keyup', this.keyupHandler);
        document.removeEventListener('click', this.clickHandler);
        later(document.body.classList, 'remove', 'modal-open', this.modal.animationDuration);
    }

    /**
    * Document KeyUp Event Listener
    *
    * It listens for any KeyUp on the document. If escape was pressed close the modal
    * @param event - The keyboard event
    */
    onDocumentKeyup(event: KeyboardEvent) {
        if (event.keyCode === ESC_KEY && this.closable) {
            tryInvoke(this, 'onClose');
        }
    }

    /**
    * Document Click Event Listener
    *
    * If the user clicked on the element with the `modal` class and the modal can be closed [[closable]] != false then `onClose` will be invoked
    * @param event - The click event
    */
    onDocumentClick(event: MouseEvent) {
        //clicks directly on the modal container should behave as clicks on the overlay backdrop
        //this is necessary because bootstrap's .modal container stretches to cover the entire viewport
        //and has a higher z-index ordering than the overlay backdrop
        const target = event.target as HTMLElement;
        if(target && target.matches('.modal') && this.closable) {
            event.preventDefault();
            tryInvoke(this, 'onClose');
        }
    }
}
