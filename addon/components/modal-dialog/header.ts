import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/modal-dialog/header';
import { layout } from '@ember-decorators/component';

@layout(template)
export default class ModalDialogHeader extends Component {
    classNames = ['modal-header'];
};
