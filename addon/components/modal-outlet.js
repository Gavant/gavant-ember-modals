import Component from '@ember/component';
import layout from '../templates/components/modal-outlet';
import { inject as service } from '@ember/service';
import { computed, get, getWithDefault } from '@ember/object';
import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';

const ModalOutlet = Component.extend({
    layout,
    modal: service(),
    tagName: '',

    currentData: computed('modal.current.{path,outlet,config}', function() {
        const path = this.get('modal.current.path');
        const config = this.get('modal.current.config') || {};
        const outlet = get(this, 'modal.current.outlet');
        const actions = getWithDefault(config, 'actions', {});

        if (path) {
            if (outlet && outlet === get(this, 'name')) {
                return Object.assign({ name: path }, config, actions);
            } else if (!outlet && !get(this, 'name')) {
                return Object.assign({ name: path }, config, actions);
            }
        }
        return null;
    }),

    currentCmp: computed('currentData', function() {
        const data = this.get('currentData');
        return !isNone(data) ? this.openModal(data) : null;
    }),
    openModal(data) {
        return `modal-dialogs/${get(data, 'name')}`;
    },

    closeModal() {
        this.get('modal').close();
    },

    willDestroyElement() {
        //if this outlet is currently showing a modal, tell the service to close it
        if(!isNone(this.get('currentData'))) {
            this.closeModal();
        }
        let name = getWithDefault(this, 'name', 'application')
        let outlets = get(this, 'modal.outlets');
        outlets.removeObject(name);
        this._super(...arguments);
    },

    //Prevent the user from accidentatly declaring outlets with the same name
    didInsertElement() {
        this._super(...arguments);
        let name = getWithDefault(this, 'name', 'application');
        let outlets = get(this, 'modal.outlets');
        assert(`A modal outlet named ${name} has already been declared`, !outlets.includes(name));

        outlets.pushObject(name);
    },

    actions: {
        close() {
            this.closeModal();
        }
    }
});

ModalOutlet.reopenClass({
    positionalParams: ['name']
});

export default ModalOutlet;
