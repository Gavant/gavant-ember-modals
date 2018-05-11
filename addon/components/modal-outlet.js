import Component from '@ember/component';
import layout from '../templates/components/modal-outlet';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import { merge } from '@ember/polyfills';
import { isNone, isEmpty } from '@ember/utils';

const ModalOutlet = Component.extend({
  layout,
  modal: service(),
  tagName: '',

  currentData: computed('modals.[]', 'modal.current.{path,config}', function() {
      const path = this.get('modal.current.path');
      const config = this.get('modal.current.config');
      const modals = this.get('modals');
      if (isEmpty(modals) && path) {
        return merge({ name: path }, config);
      } else if (path) {
        const data = modals.findBy('name', path);
        return !isNone(data) ? merge(merge({}, data), config) : merge({ name: path }, config);
      } else {
        return null;
      }
  }),

  currentCmp: computed('currentData', function() {
      const data = this.get('currentData');
      return !isNone(data) ? this.openModal(data) : null;
  }),
  openModal(data) {
    return `modal-dialogs/${get(data, 'name')}`;
  },

  closeModal() {
      this.get('modal').close();
  },

  willDestroyElement() {
      //if this outlet is currently showing a modal, tell the service to close it
      if(!isNone(this.get('currentData'))) {
          this.closeModal();
      }

      this._super(...arguments);
  },

  actions: {
      close() {
          this.closeModal();
      }
  }
});

ModalOutlet.reopenClass({
    positionalParams: ['modals']
});

export default ModalOutlet;
