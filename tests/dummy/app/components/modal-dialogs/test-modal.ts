import Component from '@glimmer/component';
// @ts-ignore: Ignore import of compiled template
import layout from '../../templates/components/modal-dialogs/test-modal';
import { action } from '@ember/object';

interface TestModalArgs {
    onClose: () => void;
    options: {
        actions: {
            save: () => void;
        };
    };
}

export default class TestModal extends Component<TestModalArgs> {
    layout = layout;

    @action
    save() {
        this.args.options.actions.save();
        this.args.onClose();
    }
}
