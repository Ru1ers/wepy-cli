import axios from 'axios'
import Toast from '@/components/vant/toast/toast';
import { ProgressStart, ProgressEnd } from '@/components/axios-progress/progress';
import store from '@/store'
import { getToken } from '@/utils/auth'
import BASE_URL from '@/utils/config';
// create an axios instance
const service = axios.create({
    baseURL: BASE_URL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})
var loadingType = ""; //加载方式
// loadProgressBar(undefined, service);
// request interceptor
service.interceptors.request.use(
    config => {
        console.log(config)
        console.log(store)
            // do something before request is sent
        if (store.getters["user/token"]) {
            config.headers['Token'] = getToken()
        }
        if (config.showLoading) {
            if (config.showLoadingType == "loading") {
                loadingType = "loading";
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    loadingType: 'spinner',
                    duration: 0
                });
            } else if (config.showLoadingType == "progress") {
                console.log("进度条加载")
                loadingType = "progress";
                ProgressStart();
            }
        }

        return config
    },
    error => {
        // do something with request error
        console.log(error, 'err') // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {

        // wx.hideLoading();
        const res = response.data
        Toast.clear();
        if (loadingType == "progress") {
            ProgressEnd();
        }
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 100000) {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                // Toast.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                //     confirmButtonText: 'Re-Login',
                //     cancelButtonText: 'Cancel',
                //     type: 'warning'
                // }).then(() => {
                //     // store.dispatch('user/resetToken').then(() => {
                //     //     location.reload()
                //     // })
                // })
            } else {
                Toast.fail({
                        message: res.message,
                        duration: 1.5 * 1000
                    })
                    // Tips.error(res.message, false)
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        Toast.clear();
        if (loadingType == "progress") {
            ProgressEnd();
        }
        console.log('err' + error) // for debug
        Toast.fail({
            message: error.message,
            duration: 1.5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service