// Types for compiled templates
import '@glint/environment-ember-loose';

import { TemplateFactory } from 'htmlbars-inline-precompile';

declare module '@gavant/ember-modals/templates/*' {
        const tmpl: TemplateFactory;
    export default tmpl;
}
