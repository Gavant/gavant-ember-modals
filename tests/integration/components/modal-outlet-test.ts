import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal-outlet', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{modal-outlet}}`);
    let element = this.element.textContent;

    assert.equal(element && element.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#modal-outlet}}
        template block text
      {{/modal-outlet}}
    `);
    element = this.element.textContent;

    assert.equal(element && element.trim(), 'template block text');
  });
});
