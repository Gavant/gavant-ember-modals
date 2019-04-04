import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/modal-outlet';
import { inject as service } from '@ember-decorators/service';
import { action, computed } from '@ember-decorators/object';
import { tagName, layout } from '@ember-decorators/component';
import Modal from 'gavant-ember-modals/services/modal';
import { getWithDefault } from '@ember/object';
import { assert } from '@ember/debug';
import { isNone } from '@ember/utils';

@tagName('')
@layout(template)
export default class ModalOutlet extends Component {
    @service modal!: Modal;
    name: string = 'application';

    @computed('modal.current.{path,outlet,config}')
    get currentData() {
        const path = this.modal.current.path;
        const config = this.modal.current.config || {};
        const outlet = this.modal.current.outlet;
        const actions = getWithDefault(config, 'actions', {});

        if (path) {
            if (outlet && outlet === this.name) {
                return Object.assign({ name: path }, config, actions);
            } else if (!outlet && !this.name) {
                return Object.assign({ name: path }, config, actions);
            }
        }
        return null;
    }

    @computed('currentData')
    get currentCmp() {
        const data = this.get('currentData');
        return !isNone(data) ? this.openModal(data) : null;
    }

    openModal(data: { name: string; }) {
        return `modal-dialogs/${data.name}`;
    }

    closeModal() {
        return this.modal.close();
    }

    didInsertElement() {
        let name = this.name;
        let outlets = this.modal.outlets;
        assert(`A modal outlet named ${name} has already been declared`, !outlets.includes(name));

        outlets.pushObject(name);
        super.didInsertElement();
    }

    willDestroyElement() {
        //if this outlet is currently showing a modal, tell the service to close it
        if(!isNone(this.currentData)) {
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
};
