import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import layout from '../templates/components/modal-dialog';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { later, bind } from '@ember/runloop';
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
    targetAttachment: null,
    translucentOverlay: true,
    hasOverlay: true,
    closable: true,

    didInsertElement() {
        this._super(...arguments);
        $(document).on('keyup.modal-dialog', bind(this, '_escapeListener'));
        $('body').addClass('modal-open');
    },
    willDestroyElement() {
        this._super(...arguments);
        $(document).off('keyup.modal-dialog');
        later($('body'), 'removeClass', 'modal-open', get(this, 'modal.animationDuration'));
    },
    _escapeListener(event) {
        if (event.keyCode === ESC_KEY && get(this, 'closable')) {
            tryInvoke(this, 'onClose');
        }
    }
});
