const TokenKey = 'cj_token'
const Uid = 'cj_uid'

export function getToken() {
    return wx.getStorageSync(TokenKey)
}

export function setToken(token) {
    return wx.setStorageSync(TokenKey, token)
}

export function removeToken() {
    return wx.removeStorageSync(TokenKey)
}

export function getUid() {
    return wx.getStorageSync(Uid)
}

export function setUid(uid) {
    return wx.setStorageSync(Uid, uid)
}

export function removeUid() {
    return wx.removeStorageSync(Uid)
}