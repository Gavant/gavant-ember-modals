// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/using-glint/ember/authoring-addons
// eslint-disable-next-line ember/no-classic-components

import { ModalDialogSignature } from 'components/modal';
import ModalDialogBody from 'components/modal/body';
import ModalDialogFooter from 'components/modal/footer';
import ModalDialogHeader from 'components/modal/header';

import { ComponentLike } from '@glint/template';

import type ModalOutlet from './components/modal-outlet';
declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        Modal: ComponentLike<ModalDialogSignature>;
        ModalOutlet: typeof ModalOutlet;
        'Modal::Header': typeof ModalDialogHeader;
        'Modal::Body': typeof ModalDialogBody;
        'Modal::Footer': typeof ModalDialogFooter;
    }
}
