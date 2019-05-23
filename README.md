gavant-ember-modals
==============================================================================

DISCLAIMER: This addon is not actively maintained for public use. Pull requests are welcome, but we do not guarantee responses to bug submissions or feature requests, so use at your own risk.


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Installation
------------------------------------------------------------------------------

```
ember install @gavant/ember-modals
```


Usage
------------------------------------------------------------------------------
To use the addon styles, you must use SASS:
```
ember install ember-cli-sass
```

(Upon addon installation, an import statement will be added to your `app.scss`)

`gavant-ember-modals` gives you multiple different components for extensibility.

First you should add `modal-outlet` to your application template
```
{{modal-outlet}}
```

Next create a component for your modal. By default we look for it under `modal-dialogs`.
So when you generate your component you would use something like This
```
ember g component modal-dialogs/add-email
```

Component
```
import Component from '@ember/component';
import { tryInvoke } from '@ember/utils';
import SpreadMixin from 'ember-spread'
import { get } from '@ember/object';

export default Component.extend(SpreadMixin, {
    actions: {
        async save(changeset) {
            try {
                const result = await changeset.save();
                await tryInvoke(this, 'onClose');
                return result;
            } catch(errors) {
                //Do something with error
            }
        }
    }
});
```

Template
```
{{#modal-dialog onClose=onClose size="sm" as |modal|}}
    {{modal.header title=title}}
    {{#modal.body}}
        {{#form-validator
            changeset=changeset
            submit=(action "save")
            as |changeset validator|
        }}
            {{#input-validator target="emailAddress" text="Email"}}
                {{fl-input
                    value=changeset.emailAddress
                    type="text"
                    placeholder="Email"
                    maxlength="200"
                }}
            {{/input-validator}}
            {{#modal.footer}}
                {{button-basic
                    type="link"
                    label=(t "action.cancel")
                    action=modal.close
                }}
                {{button-spinner
                    type="primary"
                    class="px-4"
                    label=(t "action.save")
                    action=validator.submit
                }}
            {{/modal.footer}}
        {{/form-validator}}
    {{/modal.body}}
{{/modal-dialog}}
```

and now open the modal by injecting the modal service provided into the controller that needs it
and call the modal services `open` method using the name of the modal you created earlier

```
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    modal: service(),
    actions: {
        addEmail() {
            get(this, 'modal').open('add-email', {
                title: "Add Email"
            });
        }
    }
});

```

Options
There are some different useful optional ways to use modals that might be of use to you.

1) `await tryInvoke(this, 'onClose');` 
The onClose event returns a promise when the modal is finished closing (after animating out) so if you need to do something afterwards, you can wait for that event to finish.
2) You can pass in actions to call inside the modal from the controller that is opening the modal. You do this by adding an `actions` hash to the open options i.e.
```
get(this, 'modal').open('add-email', {
    title: "Add Email",
    actions: {
        doSomething: bind(this, 'doSomething')
    }
});
```
then in the modal you can just call `await tryInvoke(this, 'doSomething');`


Contributing
------------------------------------------------------------------------------

<<<<<<< HEAD
### Installation

* `git clone <repository-url>`
* `cd gavant-ember-modals`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).
=======
See the [Contributing](CONTRIBUTING.md) guide for details.
>>>>>>> 61bd70b... message


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
