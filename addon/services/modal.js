import Service from '@ember/service';
import { set, get, setProperties } from '@ember/object';
import { later } from '@ember/runloop';
import { notEmpty } from '@ember/object/computed';
import { A } from '@ember/array';

export default Service.extend({
  animationIn: 'zoomIn',
  animationOut: 'zoomOut',
  animationDuration: 500,
  modalIsOpen: notEmpty('current'),
  open(path, config = {}) {
    let outlet = get(config, 'outlet');
    delete config.outlet;
    get(this, 'modals').pushObject({
      path,
      outlet,
      config
    });
    this.processQueue();
  },

  close() {
    set(this, 'animation', get(this, 'animationOut'));
    later(this, () => {
      set(this, 'current', null);
      this.processQueue();
    }, get(this, 'animationDuration'));
  },
  processQueue() {
    if(get(this, 'current')) {
      return;
    }
    if (this.get('modals.length') === 0) {
      get(this, 'eventBus').trigger('allModalsClosed');
      return;
    }
    this.popFromQueue();
  },
  popFromQueue() {
      const modal = this.get('modals').shiftObject();
      set(this, 'animation', get(this, 'animationIn'));
      set(this, 'current', modal);
  },
  init (){
    this._super(...arguments);
    setProperties(this, {
      outlets: A(),
      modals: A()
    });
  }
});
