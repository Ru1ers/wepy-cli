import request from '@/utils/request';


export function test() {
    return request({
        url: '/v1/agreement/getUserAgreement',
        method: 'post',
        data: {},
        showLoading: true
    })
}