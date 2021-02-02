import { login, getInfo, loginCode, loginWorkNumber } from '@/models/login/Login.js';
import { getToken, setToken, removeToken } from '@/utils/auth';

const LOGIN = 'LOGIN' // 获取用户信息
const SetUserData = 'SetUserData' // 获取用户信息
const LOGOUT = 'LOGOUT' // 退出登录、清除用户数据
const USER_DATA = 'userDate' // 用户数据

export default {
    namespaced: true,
    state: {
        token: getToken() || '',
        user: wx.getStorageSync(USER_DATA) || null
    },
    mutations: {
        [LOGIN](state, data) {
            let userToken = data;
            console.log(userToken)
            state.token = userToken
            setToken(userToken)
        },
        [SetUserData](state, userData = {}) {
            state.user = userData
            wx.setStorageSync(USER_DATA, userData)
        },
        [LOGOUT](state) {
            state.user = null
            state.token = null
            removeToken()
            wx.removeStorageSync(USER_DATA)
            wx.reLaunch({
                url: 'pages/login'
            })
        }

    },
    actions: {
        // get user info
        getInfo({ commit, state }) {
            console.log(state)
            return new Promise((resolve, reject) => {
                getInfo().then(response => {
                    const { data } = response
                    if (!data) {
                        // eslint-disable-next-line
                        reject('Verification failed, please Login again.')
                    }
                    commit(SetUserData, data)
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
    getters: {
        token(state) {
            return state.token
        },
        user(state) {
            return state.user
        }
    }
}