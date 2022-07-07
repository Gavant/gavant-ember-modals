import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import { ensureSafeComponent } from '@embroider/util';

import Modal, { ModalConfig, ModalDialog } from '../../services/modal';

interface ModalOutletArgs {}

type ModalDialogWithoutConfig<A> = Omit<ModalDialog<A>, 'config'>;

type ModalDialogComponent<A> = ModalDialogWithoutConfig<A> & A & { config: { outlet: ModalConfig<A>['outlet'] } };

export default class ModalOutlet extends Component<ModalOutletArgs> {
    @service declare modal: Modal;
    name: string = 'application';

    get currentData(): ModalDialogComponent<unknown> | null {
        if (this.modal.current) {
            const component = this.modal.current.component;
            const outlet = this.modal.current.config.outlet;

            if (component) {
                if (outlet && outlet === this.name) {
                    const actions = this.modal.current.config.actions ?? {};
                    const properties = { ...this.modal.current.config };
                    delete properties.actions;
                    delete properties.outlet;
                    const transformedComponent: ModalDialogComponent<unknown> = Object.assign(
                        this.modal.current,
                        { config: { outlet: this.modal.current.config.outlet } },
                        actions,
                        properties
                    );
                    return transformedComponent;
                }
            }
        }

        return null;
    }

    get currentCmp(): unknown | null {
        const modal = this.currentData;
        const safeComponent = modal ? ensureSafeComponent(modal.component, this) : null;
        return safeComponent;
    }

    closeModal() {
        return this.modal.close();
    }

    /**
     * Gets the outlet name, and makes sure there isn't already another outlet with the same name.
     */
    @action
    onDidInsert() {
        const name = this.name;
        const outlets = this.modal.outlets;
        assert(`A modal outlet named ${name} has already been declared`, !outlets.includes(name));

        outlets.push(name);
    }

    /**
     * Remove the outlet from the outlets array in the modal service
     */
    willDestroy() {
        super.willDestroy();
        //if this outlet is currently showing a modal, tell the service to close it
        if (this.currentData) {
            this.closeModal();
        }
        const name = this.name;
        this.modal.outlets = this.modal.outlets.filter((item) => item !== name);
    }

    @action
    close() {
        return this.closeModal();
    }
}
