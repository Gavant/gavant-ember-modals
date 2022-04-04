import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | modal-dialog/footer', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<ModalDialog::Footer />`);
        let element = this.element.textContent;

        assert.equal(element && element.trim(), '');

        // Template block usage:
        await render(hbs`
        <ModalDialog::Footer>
        template block text
        </ModalDialog::Footer>
    `);
        element = this.element.textContent;

        assert.equal(element && element.trim(), 'template block text');
    });
});
