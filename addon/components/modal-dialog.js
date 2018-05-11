import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import layout from '../templates/components/modal-dialog';
import { get } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import $ from 'jquery';

const ESC_KEY = 27;

export default ModalDialog.extend({
  layout,
  containerClassNames: 'modal',
  overlayClassNames: 'modal-backdrop fade show',
  overlayPosition: 'sibling',
  translucentOverlay: true,
  hasOverlay: true,
  closable: true,

  // onInsertElement: on('didInsertElement', function() {
  //     const clickListener = bind(this, 'onClick');
  //     $(document).on('click', clickListener);
  //     $('body').addClass('modal-open');
  //     this.set('clickListener', clickListener);
  // }),
  //
  // onDestroyElement: on('willDestroyElement', function() {
  //     $(document).off('click', this.get('clickListener'));
  //     later($('body'), 'removeClass', 'modal-open', this.get('animationDuration'));
  // }),
  didInsertElement() {
    this._super(...arguments);
    this._initEscapeListener();
  },
  willDestroyElement() {
    this._super(...arguments);
    $('body').off('keyup.modal-dialog');
  },

  _initEscapeListener() {
    const closeOnEscapeKey = (ev) => {
      if (ev.keyCode === ESC_KEY && get(this, 'closeable')) {
        tryInvoke(this, 'onClose');
      }
    };

    $('body').on('keyup.modal-dialog', closeOnEscapeKey);
  },
  // onClick(event) {
  //     if($(event.target).is('.modal') && this.get('closable')) {
  //         tryInvoke(this.attrs, 'onClose');
  //     }
  // }
});
