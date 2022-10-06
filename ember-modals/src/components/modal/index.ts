import { bind, later } from '@ember/runloop';
import { inject as service } from '@ember/service';

import ModalDialog, { positionCombinations } from 'ember-modal-dialog/components/modal-dialog';

import Modal from '../../services/modal';

const ESC_KEY = 27;

export interface ModalDialogArgs {
    /**
     * A boolean, when true makes modal animatable using liquid-fire (requires liquid-wormhole to be installed, and for tethering situations liquid-tether. Having these optional dependencies installed and not specifying animatable will make animatable=true be the default.)
     *
     * @type {boolean}
     * @memberof ModalDialogArgs
     */
    animatable?: boolean;
    /**
     * Only can be used if `tetherTarget` is specified.
     *
     * @type {positionCombinations}
     * @memberof ModalDialogArgs
     */
    attachment?: positionCombinations;
    /**
     * Indicates whether clicking outside a modal without an overlay should close the modal. Useful if your modal isn't the focus of interaction, and you want hover effects to still work outside the modal.
     *
     * @type {boolean}
     * @memberof ModalDialogArgs
     */
    clickOutsideToClose?: boolean;
    /**
     * Only can be used if `tetherTarget` is specified.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    constraints?: string;
    /**
     * CSS class name(s) to append to container divs. Set this from template.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    containerClass?: string;
    /**
     * CSS class names to append to container divs. This is a concatenated property, so it does not replace the default container class (default: 'ember-modal-dialog'. If you subclass this component, you may define this in your subclass.)
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    containerClassNames?: string;
    /**
     * Toggles presence of overlay div in DOM
     *
     * @type {boolean}
     * @memberof ModalDialogArgs
     */
    hasOverlay?: boolean;
    /**
     * Only can be used if `tetherTarget` is specified.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    offset?: string;
    /**
     * The action handler for the dialog's `onClose` action. This action triggers when the user clicks the modal overlay.
     *
     * @memberof ModalDialogArgs
     */
    onClose?: () => void;
    /**
     * An action to be called when the overlay is clicked. If this action is specified, clicking the overlay will invoke it instead of `onClose`.
     *
     * @memberof ModalDialogArgs
     */
    onClickOverlay?: () => void;
    /**
     * CSS class name(s) to append to overlay divs. Set this from template.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    overlayClass?: string;
    /**
     * CSS class names to append to overlay divs. This is a concatenated property, so it does not replace the default overlay class (default: 'ember-modal-overlay'. If you subclass this component, you may define this in your subclass.)
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    overlayClassNames?: string;
    /**
     * either 'parent' or 'sibling', to control whether the overlay div is rendered as a parent element of the container div or as a sibling to it (default: 'parent')
     *
     * @type {('parent' | 'sibling')}
     * @memberof ModalDialogArgs
     */
    overlayPosition?: 'parent' | 'sibling';
    /**
     * size of modal
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    size?: string;
    /**
     * A boolean, when true renders the modal without wormholing or tethering, useful for including a modal in a style guide
     *
     * @type {boolean}
     * @memberof ModalDialogArgs
     */
    renderInPlace?: boolean;
    /**
     * Only can be used if `tetherTarget` is specified.
     *
     * @type {positionCombinations}
     * @memberof ModalDialogArgs
     */
    targetAttachment?: positionCombinations;
    /**
     * Only can be used if `tetherTarget` is specified.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    targetOffset?: string;
    /**
     * Only can be used if `tetherTarget` is specified.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    tetherClassPrefix?: string;
    /**
     * Element selector or element reference for that serves as the reference for modal position
     *
     * If you specify a tetherTarget, you are opting into "tethering" behavior, and you must have either ember-tether or liquid-tether installed.
     * @type {string}
     * @memberof ModalDialogArgs
     */
    tetherTarget?: string;
    /**
     * Indicates translucence of overlay, toggles presence of `translucent` CSS selector
     *
     * @type {boolean}
     * @memberof ModalDialogArgs
     */
    translucentOverlay?: boolean;
    /**
     * CSS class name(s) to append to wrapper divs. Set this from template.
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    wrapperClass?: string;
    /**
     * CSS class names to append to wrapper divs. This is a concatenated property, so it does not replace the default container class (default: 'ember-modal-wrapper'. If you subclass this component, you may define this in your subclass.)
     *
     * @type {string}
     * @memberof ModalDialogArgs
     */
    wrapperClassNames?: string;
}

export interface ModalDialogSignature {
    Args: ModalDialogArgs;
    Blocks: {
        default: [{ header: any; body: any; footer: any; close: any }];
    };
}

export default class ModalDialogClass extends ModalDialog<
    { header: any; body: any; footer: any; close: any },
    ModalDialogSignature
> {
    @service declare modal: Modal;

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
        return `modal-${this.args.size ?? this.size}`;
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
