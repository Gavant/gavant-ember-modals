import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
    @service modal;

    setupController() {
        super.setupController(...arguments);

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
