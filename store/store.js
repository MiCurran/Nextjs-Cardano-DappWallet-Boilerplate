const { createStore, action } = require('easy-peasy');

const store = createStore({
    wallet: {
      wallet: {
        address: "",
        walletName: "",
        sessionTime: null,
      },
      setWallet: action((state, payload) => {
        state.wallet = payload;
      }),
      resetWallet: action((state, payload) => {
        state.wallet = {
          address: "",
          walletName: "",
          icon: "",
          sessionTime: null,
        };
      }),
    },
});

export default store;