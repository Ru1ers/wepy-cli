# wepy-cli

**wepy-cli基于wepy2.0,在官方脚手架上进行二次封装及改造**

####  使用
下载

`git clone xxx`

安装依赖

`npm install`

启动

`npm run dev`

生成weapp文件夹后请使用小程序开发者工具导入此文件夹预览.


### 项目架构目录

```
wepy-cli
├─ src
│  ├─ app.wpy  --入口文件
│  ├─ assets   --静态资源文件
│  │  ├─ css   --css文件
│  │  └─ images  --图片文件
│  │     ├─ alert.png
│  │     └─ error.png
│  ├─ common  --eventHub
│  │  └─ eventHub.js
│  ├─ components  --组件目录
│  │  ├─ axios-progress  --axios进度条封装
│  │  │  ├─ axios-progress.wpy
│  │  │  └─ progress.js
│  │  ├─ scroll  --滚动封装
│  │  │  └─ scroll.wpy
│  ├─ mixins  --mixins
│  │  ├─ pagination.js  --分页mixins
│  │  └─ test.js  --测试
│  ├─ models  --接口文件夹
│  │  ├─ list
│  │  │  └─ List.js
│  │  ├─ login
│  │  │  └─ Login.js
│  │  └─ test
│  │     └─ test.js
│  ├─ pages
│  │  ├─ index
│  │  │  └─ index.wpy
│  │  ├─ list
│  │  │  └─ list.wpy
│  │  ├─ login
│  │  │  └─ login.wpy
│  │  └─ me
│  │     └─ me.wpy
│  ├─ store  --vuex
│  │  ├─ index.js  --入口文件
│  │  └─ modules
│  │     └─ user.js  --文件分类
│  └─ utils  --工具类
│     ├─ auth.js  --cookie改造缓存
│     ├─ config.js  --接口路径
│     ├─ index.js
│     ├─ permission.js  --路由监听
│     ├─ request.js  --axios封装
├─ static
│  └─ .gitignore
├─ .gitignore
├─ .prettierrc
├─ .wepycache
├─ .wepyignore
├─ package-lock.json
├─ package.json
├─ project.config.json
├─ README.md
└─ wepy.config.js

```

### 脚手架特性

- ##### 1.请求完全使用axios,抛弃了小程序的wx.request的请求方式,对于长期使用vue开发的小伙伴更友好.实例如下:

```
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
```

- ##### 2.强大的请求拦截封装,对axios做了一层拦截,在此代码块可以自定义加载状态或错误信息提示(项目基于vant toast和自定义进度条做了用户反馈,如果不喜欢可以自定义).

```javascript
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
```

- ##### 3.利用小程序自带的onAppRoute路由监听,实现简单拦截跳转(与vue-router有差距).

```javascript
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
```

- ##### 4.按需引入vant,项目里的components文件夹里导入了所有vant组件,但是在打包时只在weapp引入用到的.可在app.wpy全局引入.

- ##### 5.store模块化,并且内置了基本登录流程,节省了项目开发时间.

- ##### 6.自带好看的列表下拉加载与上拉刷新.列表统一使用scroll-view做滚动(小程序原生下拉刷新不支持自定义样式),使用方式如下(页面引入组件,页面混入js):

```javascript
//页面引入或全局引入
usingComponents: {
     "scroll": "components/scroll/scroll"
}

import pagination from '@/mixins/pagination.js';
wepy.page({
  data: {
    list: []
  },
  mixins: [pagination],
  ...
})
```
```css
.list-scroll-div {
  height: 100vh;
}
```
```html
<!-- 列表示例 -->
<template>
  <div class="list-scroll-div">
    <scroll
      :scrollOption="scrollJd"
      bindrefresh="refreshJd"
      bindloadMore="loadMoreJd"
      bindrefreshPulling="refreshPulling"
      bindrestore="restore"
    >
      <!-- 自定义内容 -->
      <div
        class="refresh"
        slot="refresh"
      >
        <div class="wapper">
          <van-loading color="#1989fa" />
        </div>
        <div class="text">{{scrollJd.upTitle}}</div>
      </div>
      <div slot="inner">
        <van-cell-group>
          <van-cell
            :title="item.title"
            value="内容"
            label="描述信息"
            :border="false"
            v-for="(item,index) in list"
            :key="index"
          />
        </van-cell-group>
      </div>
      
    </scroll>
    <progress id="axios-progress"></progress>
    <van-toast id="van-toast" />
  </div>
</template>
```

如果好用的话,请给个小星星哦~~

