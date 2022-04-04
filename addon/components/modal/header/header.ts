import Component from '@glimmer/component';

interface ModalDialogHeaderArgs {
    title: string;
    closable: boolean;
    onClose: () => void;
}

export default class ModalDialogHeader extends Component<ModalDialogHeaderArgs> {}
