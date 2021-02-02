/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
        '"}'
    )
}

export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * 时间转换
 */
export function dateToString(number, type) { //toDate(时间戳,返回类型)
    if (!number) {
        return "";
    }
    var n = number;
    var date = new Date(parseInt(n));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (type == 'yyyy-mm-dd hh:mm:ss') {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
    if (type == 'yyyy-mm-dd hh:mm') {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    }
    if (type == 'mm-dd hh:mm:ss') {
        return m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
    if (type == 'yyyy-mm-dd') {
        return y + '-' + m + '-' + d;
    }
    if (type == 'yyyy-mm') {
        return y + '年' + m + '月';
    }
    if (type == 'yyyy/mm/dd') {
        return y + '/' + m + '/' + d;
    }
}