const defaultOptions = {
    selector: '#axios-progress',
};

let queue = [];
let currentOptions = Object.assign({}, defaultOptions);

function parseOptions(message) {
    return isObj(message) ? message : { message };
}

export function isObj(x) {
    const type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}

function getContext() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
}

export function ProgressStart(progressOptions) {
    console.log('进度条开始了');
    const options = Object.assign(
        Object.assign({}, currentOptions),
        parseOptions(progressOptions)
    );

    console.log(options)
    const context = options.context || getContext();
    const progress = context.selectComponent(options.selector);
    console.log(progress)
    if (!progress) {
        console.warn('未找到 progress 节点，请确认 selector 及 context 是否正确');
        return;
    }
    progress.$wepy.loadProgressClear();
    progress.$wepy.loadProgressStart();
    // delete options.context;
    // delete options.selector;
    // toast.clear = () => {
    //     toast.setData({ show: false });
    //     if (options.onClose) {
    //         options.onClose();
    //     }
    // };
    return progress;
}

export function ProgressEnd(progressOptions) {
    console.log('进度条结束了');
    const options = Object.assign(
        Object.assign({}, currentOptions),
        parseOptions(progressOptions)
    );

    console.log(options)
    const context = options.context || getContext();
    const progress = context.selectComponent(options.selector);
    console.log(progress)
    if (!progress) {
        console.warn('未找到 progress 节点，请确认 selector 及 context 是否正确');
        return;
    }
    progress.$wepy.loadProgressEnd();
    // delete options.context;
    // delete options.selector;
    // toast.clear = () => {
    //     toast.setData({ show: false });
    //     if (options.onClose) {
    //         options.onClose();
    //     }
    // };
    return progress;
}