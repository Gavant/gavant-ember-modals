import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import Modal, { ModalDialog } from '@gavant/ember-modals/services/modal';

interface ModalOutletArgs {}

export default class ModalOutlet extends Component<ModalOutletArgs> {
    @service declare modal: Modal;
    name: string = 'application';

    get currentData(): ModalDialog | null {
        if (this.modal.current) {
            const path = this.modal.current.path;
            // const config = this.modal.current.config ?? {};
            const outlet = this.modal.current.config.outlet;
            // const actions = config.actions ?? {};

            if (path) {
                if (outlet && outlet === this.name) {
                    return this.modal.current;
                    // return Object.assign({ name: path }, config, actions);
                }
            }
        }

        return null;
    }

    get currentCmp(): string | null {
        const modal = this.currentData;
        return !!modal ? this.openModal(modal) : null;
    }

    openModal(modal: ModalDialog): string {
        return `modal-dialogs/${modal.path}`;
    }

    closeModal() {
        return this.modal.close();
    }

    /**
     * Gets the outlet name, and makes sure there isn't already another outlet with the same name.
     */
    @action
    onDidInsert() {
        let name = this.name;
        let outlets = this.modal.outlets;
        assert(`A modal outlet named ${name} has already been declared`, !outlets.includes(name));

        outlets.push(name);
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
        this.modal.outlets = this.modal.outlets.filter((item) => item !== name);
    }

    @action
    close() {
        return this.closeModal();
    }
}
