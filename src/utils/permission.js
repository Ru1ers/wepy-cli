// 路由白名单
const whiteList = ['pages/index/index']
    // 全局路由监听器
wx.onAppRoute(async function(res) {
    if (whiteList.indexOf(res.path) !== -1) {
        // 白名单中，无需验证
        // wx[res.openType]({
        //     url: res.path
        // })
        console.log("白名单中，无需验证")
    } else {
        // other pages that do not have permission to access are redirected to the login page.
        // wx[res.openType]({
        //     url: res.path
        // })
        // 应该去授权
        console.log("应该去授权")
            // next(`/login?redirect=${to.path}`)
    }

});