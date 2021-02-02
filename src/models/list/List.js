import request from '@/utils/request';

// 获取模拟列表
export function getList(pageIndex) {
    return request({
        url: '/getList',
        method: 'post',
        data: {
            pageIndex: pageIndex
        },
        showLoading: true, //是否显示loading
        showLoadingType: 'progress', //可选值:loading(loading弹窗)  progress(顶部进度条)
    })
}