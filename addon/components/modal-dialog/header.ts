import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from '../../templates/components/modal-dialog/header';

export default class ModalDialogHeader extends Component {
    layout = layout;
    classNames = ['modal-header'];
};
