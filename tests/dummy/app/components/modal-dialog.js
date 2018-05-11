import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import layout from '../templates/components/modal-dialog';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { later } from '@ember/runloop';
import $ from 'jquery';

const ESC_KEY = 27;

export default ModalDialog.extend({
  modal: service(),
  layout,
  containerClass: 'modal fade show',
  overlayClass: computed('modal.animation', function() {
    return `modal-backdrop animated ${get(this, 'modal.animation') && get(this, 'modal.animation').includes('In') ? 'fadeIn' : 'fadeOut' }`;
  }),
  overlayPosition: 'sibling',
  translucentOverlay: true,
  hasOverlay: true,
  closable: true,
  animationDuration: 1000,

  didInsertElement() {
    this._super(...arguments);
    this._initEscapeListener();
    $('body').addClass('modal-open');
  },
  willDestroyElement() {
    this._super(...arguments);
    $('body').off('keyup.modal-dialog');
    later($('body'), 'removeClass', 'modal-open', get(this, 'animationDuration'));
  },

  _initEscapeListener() {
    const closeOnEscapeKey = (ev) => {
      if (ev.keyCode === ESC_KEY && get(this, 'closeable')) {
        tryInvoke(this, 'onClose');
      }
    };

    $('body').on('keyup.modal-dialog', closeOnEscapeKey);
  }
});
