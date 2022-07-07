import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import Modal from '@gavant/ember-modals/services/modal';

import TestModal from 'test-app/components/modal-dialogs/test-modal';

export default class Application extends Controller {
    @service modal!: Modal;

    @action
    openTestModal() {
        this.modal.open(TestModal, {
            foo: 'bar',
            actions: {
                save: this.save
            }
        });
    }

    @action
    save() {
        console.log('SAVE!');
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
