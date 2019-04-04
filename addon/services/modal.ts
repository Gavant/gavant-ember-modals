import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { A } from '@ember/array';
import { set } from '@ember/object';
import { later } from '@ember/runloop';
import { notEmpty } from '@ember-decorators/object/computed';

interface ModalConfig {
    outlet: string | undefined;
}

export default class Modal extends Service.extend(Evented) {
    animation: string | undefined;
    animationIn: string = 'zoomIn';
    animationOut: string = 'zoomOut';
    animationDuration: number = 500;
    current: any;
    modals = A();
    outlets = A();

    @notEmpty('current') modalIsOpen!: boolean;

    /**
    * Opens a modal
    * @param path - The path to the modal component.
    * The addon assumes you have put the modal component inside a directory called `modal-dialogs`.
    * This means that all you need to pass is the path inside that folder seperated by slashes i.e. `accounts/new`
    * @param config - The config you want to pass to the modal. This should be an object, with any number of attributes inside
    */
    open(path: string, config: ModalConfig = { outlet: undefined }) {
        let outlet = config.outlet;
        delete config.outlet;
        this.modals.pushObject({
            path,
            outlet,
            config
        });
        this.processQueue();
    }

    /**
    * Closes the currently opened modal, and then calls `processQueue` which may open a different modal if there is one in the queue
    */
    close() {
        return new Promise((resolve) => {
            set(this, 'animation', this.animationOut);
            later(this, () => {
                const modal = this.current;
                //Set current modal to null, trigger closed event and resolve close promise
                set(this, 'current', null);
                this.trigger('closed', modal);
                resolve();
                this.processQueue();
            }, this.animationDuration);
        });
    }

    /**
    * This method shouldn't need to be called explicitly as this service manages the queue.
    */
    processQueue() {
        if(this.current) {
            return;
        }
        if (this.modals.length === 0) {
            return this.trigger('allClosed');
        }
        this.popFromQueue();
    }

    /**
    * This method shouldn't need to be called explicitly as this service manages the queue.
    */
    popFromQueue() {
        const modal = this.modals.shiftObject();
        set(this, 'animation', this.animationIn);
        set(this, 'current', modal);
        this.trigger('opened', modal);
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'modal': Modal;
  }
}
