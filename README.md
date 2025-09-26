<h1 align="center">TUILiveKit</h1>

**TUILiveKit** 是腾讯云推出的在线直播 UI 组件。本文将指导您如何快速地将 TUILiveKit 组件集成到项目中，从而为您的应用程序提供直播功能。

<img src="https://web.sdk.qcloud.com/trtc/live/web/image/pc-layout-tip.png"/>

<img src="https://web.sdk.qcloud.com/trtc/live/web/image/h5-layout-tip.png"/>

## 💻 环境准备

- Node.js 版本: Node.js ≥ 16.19.1（推荐使用官方 LTS 版本，npm 版本请与 node 版本匹配）。
- 现代浏览器，支持 [WebRTC APIs](https://cloud.tencent.com/document/product/647/17249)。

## 🔗 接口文档

详细的 API 列表请参考文档: [客户端 API（TUILiveKit）](https://cloud.tencent.com/document/product/647/81969)。

## 👋 使用

### 步骤一：安装依赖

```bash
npm install @tencentcloud/livekit-web-vue3 pinia --save
```

### 步骤二：项目工程配置

**注册 pinia**: TUILive 使用 Pinia 进行房间数据管理，您需要在项目入口文件中注册 Pinia。项目入口文件为 src/main.ts 文件。

```js
// src/main.ts 文件
import { createPinia } from 'pinia';

const app = createApp(App);
// 注册 pinia
app.use(createPinia()); 
app.mount('#app')
```

### 步骤三：引入 TUILivekit 组件

```js
<template>
   <pre-live-view></pre-live-view>
</template>

<script setup>
import { PreLiveView } from '@tencentcloud/livekit-web-vue3';
</script>
```

### 步骤四：登陆 TUILiveKit 组件

开启直播前需要调用 [login](https://cloud.tencent.com/document/product/647/81969#5a429689-e07a-4c01-bfc6-bfb67f7f5b7f) 接口进行登陆。获取 sdkAppId、userId、userSig 可参见 [开通服务](https://cloud.tencent.com/document/product/647/104842)。

```js
import { liveRoom } from '@tencentcloud/livekit-web-vue3';

liveRoom.login({        
    // 获取 sdkAppId 可参考文档开通服务部分，https://cloud.tencent.com/document/product/647/104842    
    sdkAppId: 0,    // 用户在您业务中的唯一标示 Id    
    userId: '',    // 本地开发调试可在 https://console.cloud.tencent.com/trtc/usersigtool 页面快速生成 userSig, 注意 userSig 与 userId 为一一对应关系    
    userSig: '', 
});
```

### 步骤五：开启直播

主播可以通过调用 [start](https://cloud.tencent.com/document/product/647/81969#b0bf2a3b-428c-474f-9a0e-271c7c3b6bfd) 接口来开启直播，观众可以调用 [join](https://cloud.tencent.com/document/product/647/81969#b08d0951-c1f4-4db4-a84d-8414b853d0f1) 接口加入直播间。

```js
import { liveRoom } from '@tencentcloud/livekit-web-vue3';

const startLive = async () => {
    await liveRoom.login({    
        sdkAppId: 0,
        userId: '',
        userSig: '', 
    });
    await liveRoom.start('123456', {
      roomName: 'TestRoom',
      isOpenCamera: false,
      isOpenMicrophone: false,
    });
}
startLive()
```

### 步骤六：进入直播间

观众可以通过调用 [join](https://cloud.tencent.com/document/product/647/81969#b08d0951-c1f4-4db4-a84d-8414b853d0f1) 接口，填写对应的 roomId 参数来加入主播在 [步骤五](#步骤五开启直播) 中创建的直播间。

```js
import { liveRoom } from '@tencentcloud/livekit-web-vue3';

const joinLive = async () => {
    await liveRoom.login({    
        sdkAppId: 0,
        userId: '',
        userSig: '', 
    });
    await liveRoom.join('123456', {
      isOpenCamera: false,
      isOpenMicrophone: false,
    });
}
joinLive()
```

## 🏃 开发环境运行

1. 执行开发环境命令。（此处以 vue3 + vite 默认项目为例，不同项目 dev 指令可能不同，请根据您自己的项目进行调整）
   ```bash
   npm run dev
   ```
2. 根据控制台提示，在浏览器中打开页面 ，如：`http://localhost:5173/`。
3. 验 TUILiveKit 组件功能。

## 📦 生产环境部署

1. 打包 dist 文件.
   ```bash
     npm run build
   ```
2. 部署 dist 文件到服务器上。

## 📖 附录

- 如果您在示例代码中发现 bug，欢迎您提交 issue。
- 如果您在访问或使用过程中有任何需求或反馈，欢迎加入[腾讯云实时音视频 TRTC 技术交流群](https://zhiliao.qq.com/s/cWSPGIIM62CC/c3TPGIIM62CQ)进行技术交流和问题反馈。
