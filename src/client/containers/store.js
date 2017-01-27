// Simple store with initial props
const store = {
    getState: () => store.state,
    update: (func, cb = f => f) => {
        store.state = func(store.state);
        cb(store.state);
    },
};

// Initial state of store
const initialState = {
    user: null,
};

// State property, not enumerable
Object.defineProperty(store, 'state', {
    __proto__: null,
    value: initialState,
    writable: true,
    enumerable: false,
    configurable: false,
});

export default store;