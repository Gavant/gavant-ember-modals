import Controller from '@ember/controller';
import { action } from '@ember/object';
import Modal from '@gavant/ember-modals/services/modal';
import { inject as service } from '@ember/service';

export default class Application extends Controller {
    @service modal!: Modal;

    @action
    openTestModal() {
        this.modal.open('test-modal');
    }
    @action
    save() {
        //Do nothing
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
