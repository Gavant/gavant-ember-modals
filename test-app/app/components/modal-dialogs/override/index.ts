import ModalComponent from '@gavant/ember-modals/components/modal';

export default class ModalDialogsOverride extends ModalComponent {
    clickOutsideToClose = false;
    /**
     * Computed property that watches for changes on `modal.animation`
     *
     * @returns Overlay class based on animation state
     */
    get overlayClass() {
        return `modal-backdrop animate__animated ${
            this.modal.animation && this.modal.animation.includes('In') ? 'animate__fadeIn' : 'animate__fadeOut'
        }`;
    }
}
