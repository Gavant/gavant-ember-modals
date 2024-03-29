import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | modal-dialog/body', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<Modal::Body />`);
        let element = this.element.textContent;

        assert.strictEqual(element?.trim(), '');

        // Template block usage:
        await render(hbs`
        <Modal::Body>
        template block text
        </Modal::Body>
    `);
        element = this.element.textContent;

        assert.strictEqual(element?.trim(), 'template block text');
    });
});
