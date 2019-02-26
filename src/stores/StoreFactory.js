import { StateManagement } from './Context';

const _data = new Map();
let index = 1;

const updateStore = (store) => {
    _data.set(store._id, store);
}

const updateState = () => {
    StateManagement.update(new Map(_data));
}

class Store {
    constructor() {
        // this._clazz = `Store_${index}`;
        this._id = Symbol();
        updateStore(this);
        // index++;
    }

    _notifyChange() {
        updateStore(this);
        updateState();
    }

    apply(data) {
        Object.getOwnPropertyNames(data).forEach((key) => {
            const item = data[key];
            if (typeof item !== 'function') {
                this[key] = item;
            }
        });
        this._notifyChange();
    }
}

const createStore = props => {
    const store = new Store();
    Object.getOwnPropertyNames(props).forEach(key => {
        if (!store[key]) {
            store[key] = props[key];
        }
    });

    const proxy = new Proxy(store, {
        get(target, key, receiver) {
            // console.log("get ", {target, key, receiver});
            // return _data.get(store)[key];
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            // console.log("set ", {target, key, receiver});
            const result = Reflect.set(target, key, value, receiver);
            target._notifyChange();
            return result;
        },
    });
    proxy.getTarget = () => store;
    return proxy;
};

export default createStore;
