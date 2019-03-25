import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import layout from '../templates/components/modal-dialog';
import { inject as service } from '@ember/service';
import { get, computed, setProperties } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { later, bind } from '@ember/runloop';

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
        const keyupHandler = bind(this, 'onDocumentKeyup');
        const clickHandler = bind(this, 'onDocumentClick');
        document.addEventListener('keyup', keyupHandler);
        document.addEventListener('click', clickHandler);
        document.body.classList.add('modal-open');
        setProperties(this, {keyupHandler, clickHandler});
    },
    willDestroyElement() {
        this._super(...arguments);
        document.removeEventListener('keyup', get(this, 'keyupHandler'));
        document.removeEventListener('click', get(this, 'clickHandler'));
        later(document.body.classList, 'remove', 'modal-open', get(this, 'modal.animationDuration'));
    },
    onDocumentKeyup(event) {
        if (event.keyCode === ESC_KEY && get(this, 'closable')) {
            tryInvoke(this, 'onClose');
        }
    },
    onDocumentClick(event) {
        //clicks directly on the modal container should behave as clicks on the overlay backdrop
        //this is necessary because bootstrap's .modal container stretches to cover the entire viewport
        //and has a higher z-index ordering than the overlay backdrop
        if(event.target.matches('.modal') && get(this, 'closable')) {
            this.actions.onClickOverlay.apply(this, [event]);
        }
    }
});
