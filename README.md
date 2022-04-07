# gavant-ember-modals

DISCLAIMER: This addon is not actively maintained for public use. Pull requests are welcome, but we do not guarantee responses to bug submissions or feature requests, so use at your own risk.

## Compatibility

-   Ember.js v3.24 or above
-   Ember CLI v3.24 or above
-   Node.js v12 or above

```
ember install @gavant/ember-modals
```

## Usage

To use the addon styles, you must use SASS:

```
ember install ember-cli-sass
```

(Upon addon installation, an import statement will be added to your `app.scss`)

`gavant-ember-modals` gives you multiple different components for extensibility.

First you should add `modal-outlet` to your application template

```
<ModalOutlet />
```

Next create a component for your modal. By default we look for it under `modal-dialogs`.
So when you generate your component you would use something like This

```
ember g component modal-dialogs/add-email
```

Component

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalDialogsAddEmail extends Component {
    @action
    async save(changeset) {
        try {
            const result = await this.args.options.changeset.save();
            await this.args.onClose();
            await this.args.options.actions.onSave(result);
            return result;
        } catch (errors) {
            //Do something with error
        }
    }
}
```

Template

```hbs
<Modal @onClose={{@onClose}} @size='sm' as |Modal|>
    <Modal.header @title='Add Email' />
    <FormValidator @changeset={{@options.changeset}} @submit={{this.save}} as |changeset Validator|>
        <Validator.input>
            <FlInput @value={{changeset.emailAddress}} @placeholder='Email' />
        </Validator.input>
        <Modal.footer>
            <ButtonBasic @type='link' @link='Cancel' @action={{Modal.close}} />
            <ButtonSpinner @type='primary' label='Save' @action={{Validator.submit}} />
        </Modal.footer>
    </FormValidator>
</Modal>
```

and now open the modal by injecting the modal service provided into the controller that needs it
and call the modal services `open` method using the name of the modal you created earlier

```js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Validations from '...';

export default class MyController extends Controller {
    @service modal;

    @action
    addEmail() {
        const record = this.store.createRecord('email', {});
        const changeset = createChangeset(record, Validations);

        this.modal.open('add-email', {
            changeset,
            actions: {
                onSave: this.doSomethingElseOnSave
            }
        });
    }

    @action
    doSomethingElseOnSave() {
        //...
    }
}
```

Options
There are some different useful optional ways to use modals that might be of use to you.

1. `await this.args.onClose();`
   The onClose argument passed to all modal compoennts returns a promise when the modal is finished closing (after animating out) so if you need to do something afterwards, you can wait for that event to finish.
2. You can pass in actions to call inside the modal from the controller that is opening the modal. You do this by adding an `actions` hash to the open options i.e.

```
this.modal.open('add-email', {
    title: "Add Email",
    actions: {
        doSomething: this.doSomething
    }
});
```

(where `this.doSomething` is an `@action`)

Then in the modal, you can just call `await this.args.options.doSomething();`.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
