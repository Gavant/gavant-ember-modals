import Service from '@ember/service';
import { set, get } from '@ember/object';
import { later } from '@ember/runloop';

export default Service.extend({
  animationIn: 'zoomIn',
  animationOut: 'zoomOut',
  animationDuration: 500,
  open(path, config = {}) {
      set(this, 'animation', get(this, 'animationIn'));
      set(this, 'current', {
          path,
          config
      });
  },

  close() {
    set(this, 'animation', get(this, 'animationOut'));
    later(this, () => {
      set(this, 'current', null);
    }, get(this, 'animationDuration'));
  }
});
