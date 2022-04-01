import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import Modal from '@gavant/ember-modals/services/modal';

interface currentModalData {
    name: string;
    config: object;
    actions: object;
}

interface ModalOutletArgs {}

export default class ModalOutlet extends Component<ModalOutletArgs> {
    @service declare modal: Modal;
    name: string = 'application';

    get currentData(): currentModalData | null {
        if (this.modal.current) {
            const path = this.modal.current.path;
            const config = this.modal.current.config ?? {};
            const outlet = this.modal.current.outlet;
            const actions = config.actions ?? {};

            if (path) {
                if (outlet && outlet === this.name) {
                    return Object.assign({ name: path }, config, actions);
                }
            }
        }

        return null;
    }

    get currentCmp(): string | null {
        const data = this.currentData;
        return !!data ? this.openModal(data) : null;
    }

    openModal(data: currentModalData): string {
        return `modal-dialogs/${data.name}`;
    }

    closeModal() {
        return this.modal.close();
    }

    /**
     * Gets the outlet name, and makes sure there isn't already another outlet with the same name.
     */
    didInsertElement() {
        super.didInsertElement();
        let name = this.name;
        let outlets = this.modal.outlets;
        assert(`A modal outlet named ${name} has already been declared`, !outlets.includes(name));

        outlets.pushObject(name);
    }

    /**
     * Remove the outlet from the outlets array in the modal service
     */
    willDestroy() {
        //if this outlet is currently showing a modal, tell the service to close it
        if (!!this.currentData) {
            this.closeModal();
        }
        let name = this.name;
        let outlets = this.modal.outlets;
        outlets.removeObject(name);
    }

    @action
    close() {
        return this.closeModal();
    }
}
