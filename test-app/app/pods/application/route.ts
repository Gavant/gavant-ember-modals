import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';

import Modal from '@gavant/ember-modals/services/modal';

export default class ApplicationRoute extends Route {
    @service modal!: Modal;

    setupController(...args: [any, unknown, Transition]) {
        super.setupController(...args);

        //testing modal service events
        this.modal.on('opened', (modal) => {
            // eslint-disable-next-line no-console
            console.log('modal opened!', modal);

            this.modal.on('closed', (modal) => {
                // eslint-disable-next-line no-console
                console.log('modal closed!', modal);
            });
        });

        this.modal.on('allClosed', () => {
            // eslint-disable-next-line no-console
            console.log('all modals closed!');
        });
    }
}
