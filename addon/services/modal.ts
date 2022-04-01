import Evented from '@ember/object/evented';
import { later } from '@ember/runloop';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface ModalConfig {
    outlet: string | undefined;
}

/**
 * Class that handles opening and closing of modals
 *
 * @class modal
 * @extends Ember.Service
 */

export default class Modal extends Service.extend(Evented) {
    /**
     * Default modal config values used for open()
     */
    defaultModalConfig: ModalConfig = {
        outlet: 'application'
    };

    /**
     * Animation CSS classes
     */
    animation: string | undefined;
    animationIn: string = 'zoomIn';
    animationOut: string = 'zoomOut';

    /**
     * Animation duration
     * @default 500ms
     */
    animationDuration: number = 500;

    /**
     * The currently opened modal
     */
    @tracked current: any;

    /**
     * The modal queue. When you call open a modal it gets added into this queue
     */
    @tracked modals = [];
    @tracked outlets = [];

    get modalIsOpen() {
        return !!this.current;
    }

    /**
     * Opens a modal
     *
     * @param path - The path to the modal component.
     * The addon assumes you have put the modal component inside a directory called `modal-dialogs`.
     * This means that all you need to pass is the path inside that folder seperated by slashes i.e. `accounts/new`
     * @param config - The config you want to pass to the modal. This should be an object, with any number of attributes inside
     */
    open(path: string, modalConfig: object = {}) {
        const config = { ...this.defaultModalConfig, ...modalConfig };
        const outlet = config.outlet;
        delete config.outlet;
        this.modals.push({
            path,
            outlet,
            config
        });
        this.processQueue();
    }

    /**
     * Closes the currently opened modal, and then calls `processQueue` which may open a different modal if there is one in the queue
     *
     * @method close
     * @returns Promise which resolves after `animationDuration`
     */
    close(): Promise<any> {
        return new Promise((resolve) => {
            this.animation = this.animationOut;
            later(
                this,
                () => {
                    const modal = this.current;
                    //Set current modal to null, trigger closed event and resolve close promise
                    this.current = null;
                    this.trigger('closed', modal);
                    resolve();
                    this.processQueue();
                },
                this.animationDuration
            );
        });
    }

    /**
     * This method shouldn't need to be called explicitly as this service manages the queue.
     */
    processQueue() {
        if (this.current) {
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
        this.animation = this.animationIn;
        this.current = modal;
        this.trigger('opened', modal);
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
    interface Registry {
        modal: Modal;
    }
}
