import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/modal-outlet';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { getWithDefault } from '@ember/object';
import { assert } from '@ember/debug';
import { isNone } from '@ember/utils';
import Modal from '@gavant/ember-modals/services/modal';

interface currentModalData {
    name: string;
    config: object;
    actions: object;
}

export default class ModalOutlet extends Component {
    layout = layout;
    tagName = '';
    @service modal!: Modal;
    name: string = 'application';

    /**
     * Computed property that gets the current modal data from the `modal` service
     *
     * @param modal.current - The Modal services current modal
     */
    @computed('modal.current.{path,outlet,config}')
    get currentData(): currentModalData | null {
        if (this.modal.current) {
            const path = this.modal.current.path;
            const config = this.modal.current.config || {};
            const outlet = this.modal.current.outlet;
            const actions = getWithDefault(config, 'actions', {});

            if (path) {
                if (outlet && outlet === this.name) {
                    return Object.assign({ name: path }, config, actions);
                }
            }
        }

        return null;
    }

    /**
     * Computed property that gets the current modal component name
     *
     * @param currentData - The `currentData` computed property from above
     */
    @computed('currentData')
    get currentCmp(): string | null {
        const data = this.currentData;
        return !isNone(data) ? this.openModal(data) : null;
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
    willDestroyElement() {
        //if this outlet is currently showing a modal, tell the service to close it
        if (!isNone(this.currentData)) {
            this.closeModal();
        }
        let name = this.name;
        let outlets = this.modal.outlets;
        outlets.removeObject(name);
        super.willDestroyElement();
    }

    @action
    close() {
        return this.closeModal();
    }
}
