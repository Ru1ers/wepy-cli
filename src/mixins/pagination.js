const fetchType = {
    PULL_DOWN: 'PULL_DOWN',
    LOAD_MORE: 'LOAD_MORE',
    INIT_FETCH: 'INIT_FETCH'
};
export default {
    data: {
        pageNum: 0,
        currentData: [],
        noData: false,

        // 自定义项(自定义时直接在页面覆盖)
        loadMoreShow: true,
        scrollBar: true,
        unidirectional: false,
        bounce: true,
        pullDown: {},
        loadMore: {},
        dataField: "",
        check: true,
        initial: true,
        pageSize: 10,
        startPage: 1,
        triggered: false,
        _freshing: false,
        scrollJd: {
            pagination: {
                page: 1,
                haveMoreData: false,
                limit: 10,
                haveData: true,
                dataIsOne: false,
            },
            empty: {
                img: 'http://coolui.coolwl.cn/assets/mescroll-empty.png'
            },
            refresh: {
                type: 'diy',
                diyLevel: 2,
                refreshthreshold: 60,
                p: 0
            },
            loadmore: {
                type: 'default'
            },
            upTitle: ""
        },
    },
    computed: {
        isNoData: function() {
            return this.noData || this.currentData.length === 0;
        }
    },
    onLoad() {
        console.log(this)
        this.initial && this.fetchData(fetchType.INIT_FETCH);
    },
    moved() {},
    created() {
        this.pageNum = this.startPage;
    },
    methods: {
        refreshJd: function(e) {
            console.log("refreshJd", e)
            this.scrollJd.upTitle = e.$wx.detail.upTitle;
            this.getJdData('refresh', 1)
        },
        loadMoreJd: function() {
            console.log("loadMoreJd")
            this.getJdData('loadMore')
        },
        refreshPulling: function(e) {
            console.log("refreshPulling")
            this.scrollJd.refresh.p = e.$wx.detail.p;
            // this.setData({
            //     scrollJd: scrollJd
            // });
        },
        restore: function(e) {
            this.scrollJd.upTitle = e.$wx.detail.upTitle;
            console.log("重置文字为下拉刷新");
        },
        getJdData: function(type, page) {
            if (type == 'refresh') {
                this.refresherrefresh();
            } else {
                this.scrolltolower();
            }
        },
        scrolltolower() {
            if (this.loadMoreShow) {
                this.fetchData(fetchType.LOAD_MORE);
                // this.$emit('on-load-more');
            }
        },
        refresherrefresh() {
            if (this._freshing) return;
            this._freshing = true;
            // this.triggered = true;
            this.fetchData(fetchType.PULL_DOWN);
            //   this.$emit('on-pull-refresh');
        },
        scrollTo(target, time, limit) {
            console.log(target, time, limit);
            this.fm[0].scrollTo(target, time, limit);
            console.log(this.fm);
        },
        loadEnd() {
            // setTimeout(() => {
            //     this.fm[0].loadEnd();
            // }, 500);
            console.log("当前加载结束")
        },
        async refresh(callBack) {
            console.log(callBack)
            await callBack();
            console.log("下拉刷新回弹", this)
            this.triggered = false;
            this._freshing = false;
            // this.fm[0].refresh(callBack);
        },
        refreshSize() {
            this.fm[0].refreshSize();
            console.log('refreshSize');
        },
        getValueByField(res, field) {
            console.log(res, field);
            const fields = field.split('.');
            let finalValue = res;
            fields.forEach(key => {
                try {
                    finalValue = finalValue[key];
                } catch (e) {
                    console.error(`Error accessing '${field}': ` + e.toString());
                }
            });
            return finalValue;
        },
        commitData(data) {
            // const finalData = this.interceptor && this.interceptor(data);
            // if (finalData) {
            //     // this.$emit('set-data', finalData);
            // } else {
            //     // this.$emit('set-data', data);
            // }
            console.log(data)
            this.list = data;
        },
        fetchData(type) {
            this.noData = false;
            type = type || fetchType.INIT_FETCH;
            if (type === fetchType.INIT_FETCH || type === fetchType.PULL_DOWN) {
                // 重置页码为起始页码
                this.pageNum = this.startPage;
            }
            if (type === fetchType.LOAD_MORE) {
                this.pageNum += 1;
            }
            console.log(this.pageNum);
            return this.getListPage(this.pageNum)
                .then(res => {
                    console.log(res);
                    const dataFieldVal = this.getValueByField(res, "data");
                    if (res.code == 100000) {
                        console.log(dataFieldVal);
                        if (dataFieldVal.length === 0 && this.pageNum === this.startPage) {
                            // 一条数据都没有
                            this.noData = true; //这个是新加入的
                            //   this.$emit('on-nothing');
                            this.commitData(dataFieldVal);
                            this.scrollJd.pagination.haveData = false;
                            this.scrollJd.pagination.haveMoreData = false;
                            this.scrollJd.pagination.dataIsOne = false;
                        } else if (dataFieldVal.length < this.pageSize) {
                            this.scrollJd.pagination.haveMoreData = false;
                            //   this.$emit('on-having');
                            // 没有更多数据
                            this.noData = true;
                            // 第一页数据就不足一页
                            if (type === fetchType.INIT_FETCH) {
                                this.currentData = [];
                                this.commitData(dataFieldVal);
                                // this.$nextTick(() => {
                                //     console.log(dataFieldVal);
                                //     // this.scrollTo(0, 0);
                                // });
                                // 第一页数据就不足一页的时候，页码需要减1，因为下一次加载更多的时候页码会加1，这样就能保证仍然请求第一页数据
                                this.pageNum -= 1;
                            }
                            if (type === fetchType.LOAD_MORE) {
                                this.commitData(this.currentData.concat(dataFieldVal));
                                // 还原页码，保证下次请求仍然请求该页数据
                                this.pageNum -= 1;
                                this.loadEnd();
                                console.log("没有更多数据了");
                            }
                            if (type === fetchType.PULL_DOWN) {
                                this.pageNum -= 1;
                                this.refresh(() => {
                                    this.commitData(dataFieldVal);
                                });
                            }
                        } else {
                            //   this.$emit('on-having');
                            this.scrollJd.pagination.haveData = true;
                            this.scrollJd.pagination.haveMoreData = true;
                            this.scrollJd.pagination.dataIsOne = true;
                            console.log(this.scrollJd)
                            this.currentData =
                                type === fetchType.LOAD_MORE ?
                                this.currentData.concat(dataFieldVal) :
                                dataFieldVal;
                            if (type === fetchType.INIT_FETCH) {
                                console.log(this.currentData)
                                this.commitData(this.currentData);
                                console.log('INIT_FETCH');
                                // this.$nextTick(() => {
                                //     console.log('INIT_FETCH');
                                //     this.scrollTo(0, 0);
                                // });
                            }
                            if (type === fetchType.LOAD_MORE) {
                                this.commitData(this.currentData);
                                this.loadEnd();
                            }
                            if (type === fetchType.PULL_DOWN) {
                                this.refresh(() => {
                                    this.commitData(this.currentData);
                                });
                            }
                        }
                    } else {
                        // this.$emit('on-backend-error', res);
                        if (type === fetchType.LOAD_MORE) {
                            // 还原页码，保证下次请求仍然请求该页数据
                            this.pageNum -= 1;
                            this.loadEnd();
                        }
                        if (type === fetchType.PULL_DOWN) {
                            this.refresh();
                        }
                    }
                })
                .catch(err => {
                    //   this.$emit('on-network-error', err);
                    if (type === fetchType.LOAD_MORE) {
                        // 还原页码，保证下次请求仍然请求该页数据
                        this.pageNum -= 1;
                        this.loadEnd();
                    }
                    if (type === fetchType.PULL_DOWN) {
                        this.refresh();
                    }
                });
        }
    }
};