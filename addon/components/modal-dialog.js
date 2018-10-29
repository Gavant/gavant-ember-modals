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
    size: 'md',
    layout,
    containerClass: 'modal fade show',
    overlayClass: computed('modal.animation', function() {
        return `modal-backdrop animated ${get(this, 'modal.animation') && get(this, 'modal.animation').includes('In') ? 'fadeIn' : 'fadeOut' }`;
    }),
    modalSize: computed('size', function() {
        return `modal-${get(this, 'size')}`;
    }),
    overlayPosition: 'sibling',
    targetAttachment: null,
    translucentOverlay: true,
    hasOverlay: true,
    closable: true,

    didInsertElement() {
        this._super(...arguments);
        $(document).on('keyup.modal-dialog', bind(this, '_escapeListener'));
        $(document).on('click.modal-dialog', '.modal', bind(this, '_modalClickListener'));
        $('body').addClass('modal-open');
    },
    willDestroyElement() {
        this._super(...arguments);
        $(document).off('.modal-dialog');
        later($('body'), 'removeClass', 'modal-open', get(this, 'modal.animationDuration'));
    },
    _escapeListener(event) {
        if (event.keyCode === ESC_KEY && get(this, 'closable')) {
            tryInvoke(this, 'onClose');
        }
    },
    _modalClickListener(event) {
        //clicks directly on the modal container should behave as clicks on the overlay backdrop
        //this is necessary because bootstrap's .modal container stretches to cover the entire viewport
        //and has a higher z-index ordering than the overlay backdrop
        if($(event.target).is('.modal') && get(this, 'closable')) {
            this.actions.onClickOverlay.apply(this, [event]);
        }
    }
});
