import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { set, get, setProperties } from '@ember/object';
import { later } from '@ember/runloop';
import { notEmpty } from '@ember/object/computed';
import { A } from '@ember/array';
import { Promise } from 'rsvp';

export default Service.extend(Evented, {
    animationIn: 'zoomIn',
    animationOut: 'zoomOut',
    animationDuration: 500,
    modalIsOpen: notEmpty('current'),

    open(path, config = {}) {
        let outlet = get(config, 'outlet');
        delete config.outlet;
        get(this, 'modals').pushObject({
            path,
            outlet,
            config
        });
        this.processQueue();
    },

    close() {
        return Promise(resolve => {
            set(this, 'animation', get(this, 'animationOut'));
            later(this, () => {
                const modal = get(this, 'current');
                //Set current modal to null, trigger closed event and resolve close promise
                set(this, 'current', null);
                this.trigger('closed', modal);
                resolve();
                this.processQueue();
            }, get(this, 'animationDuration'));
        });
    },

    processQueue() {
        if(get(this, 'current')) {
            return;
        }
        if (this.get('modals.length') === 0) {
            return this.trigger('allClosed');
        }
        this.popFromQueue();
    },

    popFromQueue() {
        const modal = this.get('modals').shiftObject();
        set(this, 'animation', get(this, 'animationIn'));
        set(this, 'current', modal);
        this.trigger('opened', modal);
    },

    init (){
        this._super(...arguments);
        setProperties(this, {
            outlets: A(),
            modals: A()
        });
    }
});
