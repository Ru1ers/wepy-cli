import request from '@/utils/request';

// 登录
export function login(code) {
    return request({
        url: '/api/v1/web/user/login',
        method: 'get',
        params: {
            code: code
        },
        showLoading: true,
        showLoadingType: "loading"
    })
}

// 获取个人信息
export function getInfo() {
    return request({
        url: '/api/v1/web/user/getInfo',
        method: 'post',
        data: {},
        showLoading: true,
        showLoadingType: "loading"
    })
}

// 修改个人信息
export function updateUser(data) {
    return request({
        url: '/api/v1/web/user/update',
        method: 'post',
        data: data,
        showLoading: true
    })
}