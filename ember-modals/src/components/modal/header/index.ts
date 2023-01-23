import Component from '@glimmer/component';

interface ModalDialogHeaderArgs {
    title: string;
    closable: boolean;
    onClose: () => void;
}

interface ModalDialogHeaderSignature {
    Args: ModalDialogHeaderArgs;
    Blocks: {
        default: [];
    };
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class ModalDialogHeader extends Component<ModalDialogHeaderSignature> {}
