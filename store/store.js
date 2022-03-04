const { createStore, action } = require('easy-peasy');

const store = createStore({
    connection: {
        connected: null,
        setConnected: action((state, payload) => {
            state.connected = payload;
        }),
        stakeAddress: null,
        setStakeAddress: action((state, payload) => {
            state.stakeAddress = payload;
        })
    },
    balance: {
        adaBalance: null,
        setAdaBalance: action((state, payload) => {
            state.adaBalance = payload;
        }),
    },
    wallet: {
        connectedWallet: null,
        setConnectedWallet: action((state, payload) => {
            state.connectedWallet = payload;
        }),
    },
    loading: {
        isLoading: false,
        setIsLoading: action((state, payload) => {
            state.isLoading = payload;
        }),
    },
});

export default store;
