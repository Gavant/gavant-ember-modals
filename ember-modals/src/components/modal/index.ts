import { bind, later } from '@ember/runloop';
import { inject as service } from '@ember/service';

import ModalDialog, { ModalDialogArgs as EmberModalDialogArgs } from 'ember-modal-dialog/components/modal-dialog';

import ModalDialogBody from 'components/modal/body';
import ModalDialogFooter from 'components/modal/footer';
import ModalDialogHeader from 'components/modal/header';

import { WithBoundArgs } from '@glint/template';

import Modal from '../../services/modal';

const ESC_KEY = 27;

export interface ModalDialogSignature {
    Args: EmberModalDialogArgs & {
        clickOutsideToClose?: boolean;
        closable?: boolean;
        size?: string;
    };
    Blocks: {
        default: [
            {
                header: WithBoundArgs<typeof ModalDialogHeader, 'onClose' | 'closable'>;
                body: typeof ModalDialogBody;
                footer: typeof ModalDialogFooter;
                close: () => void;
            }
        ];
    };
}

export default class ModalDialogClass extends ModalDialog {
    @service declare modal: Modal;

    declare onCloseAction: () => void;

    /**
     * @default 'md'
     */
    size = 'md';

    /**
     * @default 'modal fade show'
     */
    containerClass = 'modal fade show';

    /**
     * @default 'sibling'
     */
    overlayPosition: 'parent' | 'sibling' | undefined = 'sibling';
    targetAttachment = undefined;

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

    /**
     * @default true
     */
    clickOutsideToClose = true;

    keyupHandler: any;
    clickHandler: any;
    onMouseDownHandler: any;

    clickTarget: any;

    /**
     * Computed property that watches for changes on `modal.animation`
     *
     * @returns Overlay class based on animation state
     */
    get overlayClass() {
        return `modal-backdrop animated ${
            this.modal.animation && this.modal.animation.includes('In') ? 'fadeIn' : 'fadeOut'
        }`;
    }

    /**
     * Computed property that watches for changes on `size`
     *
     * @returns Class based on size
     */
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
        const onMouseDownHandler = bind(this, 'onMouseDown');
        document.addEventListener('keyup', keyupHandler);
        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mouseup', clickHandler);
        document.body.classList.add('modal-open');
        this.keyupHandler = keyupHandler;
        this.clickHandler = clickHandler;
        this.onMouseDownHandler = onMouseDownHandler;
    }

    /**
     * Tears down event listeners for `keyup` and `click`, as well as removes the `modal-open` class from the body after the `animationDuration`
     */
    willDestroyElement() {
        super.willDestroyElement();
        document.removeEventListener('keyup', this.keyupHandler);
        document.removeEventListener('mousedown', this.onMouseDownHandler);
        document.addEventListener('mouseup', this.clickHandler);

        later(this, this.removeModalOpenClass, this.modal.animationDuration);
    }

    /**
     * Removes modal open class. This was added due to closing another modal right before opening a new one.
     * When that happened the delay would remove the `modal-open` class after the other one was opened so
     * the modal would be open, but with no `modal-open` class on the body
     *
     * @memberof ModalDialogClass
     */
    removeModalOpenClass() {
        if (!this.modal.modalIsOpen) {
            document.body.classList.remove('modal-open');
        }
    }

    /**
     * Document KeyUp Event Listener
     *
     * It listens for any KeyUp on the document. If escape was pressed close the modal
     * @param event - The keyboard event
     */
    onDocumentKeyup(event: KeyboardEvent) {
        if (event.keyCode === ESC_KEY && this.closable) {
            this?.onCloseAction();
        }
    }

    onMouseDown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        this.clickTarget = target;
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
        if (
            target &&
            this.clickTarget === target &&
            target.matches('.modal') &&
            this.closable &&
            this.clickOutsideToClose
        ) {
            event.preventDefault();
            this?.onCloseAction();
        }
    }
}
