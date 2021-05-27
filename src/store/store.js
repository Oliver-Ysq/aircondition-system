import { makeAutoObservable } from "mobx";

export const HomeStore = makeAutoObservable({});

export const AccountStore = makeAutoObservable({
    charactor: null,
    setCharactor(charactor) {
        this.charactor = charactor;
    },

    hasLogin: false,
    setLogin(flag) {
        this.hasLogin = flag;
    },
});
