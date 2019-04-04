import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/modal-dialog';
import { inject as service } from '@ember-decorators/service';
import Modal from 'gavant-ember-modals/services/modal';
import { computed } from '@ember-decorators/object';
import { later, bind } from '@ember/runloop';
import { setProperties } from '@ember/object';
import { tryInvoke } from '@ember/utils';

const ESC_KEY = 27;

export default class ModalDialog extends Component {
    @service modal!: Modal;

    layout = layout;
    size = 'md';
    containerClass = 'modal fade show';
    overlayPosition = 'sibling';
    targetAttachment = null;
    translucentOverlay = true;
    hasOverlay = true;
    closable = true;
    keyupHandler: any;
    clickHandler: any;

    @computed('modal.animation')
    get overlayClass() {
        return `modal-backdrop animated ${this.modal.animation && this.modal.animation.includes('In') ? 'fadeIn' : 'fadeOut' }`;
    }

    @computed('size')
    get modalSize() {
        return `modal-${this.size}`;
    }

    didInsertElement() {
        super.didInsertElement();
        const keyupHandler = bind(this, 'onDocumentKeyup');
        const clickHandler = bind(this, 'onDocumentClick');
        document.addEventListener('keyup', keyupHandler);
        document.addEventListener('click', clickHandler);
        document.body.classList.add('modal-open');
        setProperties(this, { keyupHandler, clickHandler });
    }

    willDestroyElement() {
        this._super(...arguments);
        document.removeEventListener('keyup', this.keyupHandler);
        document.removeEventListener('click', this.clickHandler);
        later(document.body.classList, 'remove', 'modal-open', this.modal.animationDuration);
    }

    onDocumentKeyup(event: KeyboardEvent) {
        if (event.keyCode === ESC_KEY && this.closable) {
          tryInvoke(this, 'onClose');
        }
    }

    onDocumentClick(event: MouseEvent) {
        //clicks directly on the modal container should behave as clicks on the overlay backdrop
        //this is necessary because bootstrap's .modal container stretches to cover the entire viewport
        //and has a higher z-index ordering than the overlay backdrop
        const target = event.target as HTMLElement;
        if(target && target.matches('.modal') && this.closable) {
          this.actions.onClickOverlay.apply(this, [event]);
        }
    }
};
