import { action } from '@ember/object';
import Component from '@glimmer/component';

interface TestModalArgs {
    onClose: () => void;
    options: {
        actions: {
            save: () => void;
        };
        acooltest: string;
    };
}

export default class TestModal extends Component<TestModalArgs> {
    @action
    save() {
        this.args.options.actions.save();
        this.args.onClose();
    }
}
