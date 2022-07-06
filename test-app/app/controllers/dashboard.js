import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DashboardController extends Controller {
    @service modal;
    day = 2;

    @action
    openTestModal() {
        this.modal.open('test-modal', {
            outlet: 'dashboard',
            day: this.day,
            actions: {
                save: () => this.save()
            }
        });
        this.modal.open('test-modal', {
            outlet: 'dashboard'
        });
    }

    @action
    save() {
        //Do nothing
    }
}
