import Service from '@ember/service';
import { set } from '@ember/object';

export default Service.extend({
  open(path, config = {}) {
      set(this, 'current', {
          path,
          config
      });
  },

  close() {
      set(this, 'current', null);
  }
});
