import Component from '@ember/component';
import layout from '../../templates/components/modal-dialogs/test-modal';
import { tryInvoke } from '@ember/utils';
import SpreadMixin from 'ember-spread';

export default Component.extend(SpreadMixin, {
    layout,
    actions: {
        save() {
            tryInvoke(this, 'save');
        }
    }
});
