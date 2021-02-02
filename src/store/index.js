import wepy from '@wepy/core';
import Vuex from '@wepy/x';
wepy.use(Vuex);

// wepy2使用require.content方法未知

import user from '@/store/modules/user.js';
const modules = { user };
console.log(modules)
export default new Vuex.Store({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules
});