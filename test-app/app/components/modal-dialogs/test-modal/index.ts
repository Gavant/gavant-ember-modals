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

interface TestModalSignature {
    Args: TestModalArgs;
}

export default class TestModal extends Component<TestModalSignature> {
    @action
    save() {
        this.args.options.actions.save();
        this.args.onClose();
    }
}
