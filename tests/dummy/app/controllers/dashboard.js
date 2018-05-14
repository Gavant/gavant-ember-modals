import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Controller.extend({
  modal: service(),
  day: 2,
  save() {
    console.log(get(this, 'day'));
  },
  actions: {
    openTestModal() {
      get(this, 'modal').open('test-modal', {
        outlet: 'dashboard',
        day: get(this, 'day'),
        actions: {
          save: () => this.save()
        }
      });
      get(this, 'modal').open('test-modal', {
        outlet: 'dashboard'
      });
    },
    save() {
      console.log("In save");
    }
  }
});
