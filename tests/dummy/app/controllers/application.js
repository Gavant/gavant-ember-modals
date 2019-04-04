import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Controller.extend({
    modal: service(),
    actions: {
        openTestModal() {
            get(this, 'modal').open('test-modal');
        },
        save() {
            //Do nothing
        }
    }
});
