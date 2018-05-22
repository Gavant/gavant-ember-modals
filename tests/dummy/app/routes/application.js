import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
    modal: service(),

    setupController() {
        this._super(...arguments);
        
        //testing modal service events
        get(this, 'modal').on('opened', (modal) => {
            // eslint-disable-next-line no-console
            console.log('modal opened!', modal);

            get(this, 'modal').one('closed', (modal) => {
                // eslint-disable-next-line no-console
                console.log('modal closed!', modal);
            });
        });

        get(this, 'modal').on('allClosed', () => {
            // eslint-disable-next-line no-console
            console.log('all modals closed!');
        });
    }
});
