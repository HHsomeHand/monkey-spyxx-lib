>作者注:
>阅读本文，希望你具备以下基础：
>
>1. 掌握 JS 基础，熟悉 promise、await。若不熟悉，推荐观看 Coderwhy 的 JS 高级教程 “手撕await”: 从生成器演进到 await，纯 js 实现 await 语法糖：https://www.bilibili.com/video/BV1f44y187PS 。

## 前言 宣传稿

[油猴脚本库分享] [给油中开发者的礼物🎁]

这个库可以让你的脚本更加通用. 

增强脚本的复用性!

我花费了 7 天左右编写这个库，工作量还是挺大的。希望大家喜欢，如有任何问题，或是改进建议，欢迎反馈。

代码完全开源，欢迎 fork PR 或是提 issue，一起完善这个库!

这个脚本库的主要功能为：显示一个对话框。同时监听用户鼠标位置，实时获取用户鼠标位置的元素。

开发者可以获取一个 Promise，其结果为用户最终选择的元素的选择器。

注意这里是选择器，不仅仅是元素。返回选择器是为了方便开发者保存用户配置。

所以，这个库的功能为获取用户选择元素的选择器。

这个库的灵感来源于 adblock 的“拦截此广告”对话框，和 东方永页机 的“编辑此页面配置”对话框。

截图如下：

<img src="./img/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%95%E5%AF%BC/1.png" alt="e56dc649983c866bd9325cdacd6f7b2" style="zoom:50%;" />

<img src="./img/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%95%E5%AF%BC/2.png" alt="98bb7c7e7250a6562e3daba318b87c6" style="zoom: 25%;" />

![1f6e4d819938173ca8f778ca94a420f](./img/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%95%E5%AF%BC/3.png)

运行视频链接 B站: https://www.bilibili.com/video/BV1uKgbzMEfj

这个库的尝鲜演示 DEMO 脚本, 模拟 adblock 的拦截此广告 (视频中使用的 Demo 脚本)：https://scriptcat.org/zh-CN/script-show-page/3851

库发布地址 油猴中文: https://scriptcat.org/zh-CN/script-show-page/3847

开源地址: https://github.com/HHsomeHand/monkey-spyxx-lib

 

## 预检一 Preflight TypeScript Basic

> 本库不是只能通过 typescript 调用, javascript 也可以正常使用本库
>
> 但我想让你们也可以看懂接口定义, 这样使用起来比较方便.

typescript 就是给 javascript 定义类型.

```ts
let msg: string = "hello world"; // 这里定义了 msg 类型为 string 类型

// msg = 33 // 报错, 33 为 number 类型, 无法赋值给 string 类型的变量 msg

console.log(msg)
```

typescript 可以让 IDE 有更好的代码提示, 同时写出来的代码更加健壮, typescript 会强制让你处理各种边界情况, 如不可以直接调用可能为空的变量:

```typescript
const inputEl = document.querySelector("input");

// typescript 报错 'inputEl' is possibly 'null'.(18047)
inputEl.focus();

// 正确写法:
inputEl?.foucs();
```

typescript 最方便的地方就是 增强了 options 传参函数 的代码提示, 下面就是一个比较完善的例子:

```typescript
interface IShowToastOptions {
    // 持续时间, 默认值为 400ms
    duration?: number;

    // [样式控制] toast 的类名, 默认值为 ""
    className?: string | string[];

    // [样式控制] 是否鼠标放在 toast 上时, toast 不会消失.
    // 为 true: 鼠标放在 toast 上时, 恒显示 toast, toast 不会消失.
    // 为 false: 鼠标放在 toast 上时, toast 在 duration 时间后, 依然消失
    // 默认值为 true
    isHoverNoHidden?: boolean;
}

function showToast(msg: string, options?: IShowToastOptions = {}) {
    const {
        duration: paramDuration = 400,
        className: paramClassName = "",
        isHoverNoHidden: paramIsHoverNoHidden = true,
    } = options;

    // ....
}
```

使用 `paramDuration`  而不是 `duration` 的好处, 是规避了变量名冲突的问题. 

同时方便后期维护, 和代码阅读.

具体可以参考微软的匈牙利命名规范 (wiki 百科): https://zh.wikipedia.org/wiki/%E5%8C%88%E7%89%99%E5%88%A9%E5%91%BD%E5%90%8D%E6%B3%95

> 越顶层的作用域, 越容易命名冲突, 所以一般全局变量都会添加 g_ 前缀, 如 g_globalVar
>
> 函数顶层, 局部变量会添加 l_前缀, l_localVar
>
> 这在多层 for, switch, if 嵌套时, 更容易分辨变量来自于哪里

## 正文一

接口的概览, `global.d.ts`:

```ts
export interface SpyXXGetSelectorOptionsType {
    // 对话框标题, 默认值为 "请将光标放在目标元素上"
    title?: string;

    // 对话框提示信息, 默认值为空字符串
    description?: string;

    // 对话框提交按钮的文本内容, 默认值为 "提交"
    submitBtnText?: string;

    // 对话框关闭按钮的文本内容, 默认值为 "取消"
    cancelBtnText?: string;

    // 是否显示关闭按钮, 默认值为 true, 为显示关闭按钮
    isShowCancelBtn?: boolean;

    // 是否显示暂停状态, 默认值为 true
    // 当为 true 时, 对话框上会显示当前是否暂停
    // 为 false 时, 对话框不显示 是否暂停
    isShowPauseState?: boolean;

    // 是否显示感应器 (光标在上面滑动, 继续选择), 默认值为 true, 为显示
    isShowInductor?:  boolean;

    // 初始暂停状态, 默认值为 false, 一开始不暂停选择
    // 为 true, 则一开始暂停选择
    // 为 false, 则一开始不暂停选择
    initPauseState?: boolean;

    // 初始的选择器, 默认值为 ""
    initSelector?: string;

    // 是否使用 box shadow 标记选中元素, 默认值为 false
    // 为 false, 则使用方块来标记 当前鼠标选中的元素
    // 为 true, 则使用 box shadow 标记当前鼠标选中的元素
    // 推荐使用 false, box shadow 是第一版的代码遗留下来的 legacy, 可能适用于某些特殊场景
    isUseShadow?: boolean;

    // 事件回调, 当光标选择的元素发生变化的时候, 会调用这个回调函数
    // 默认值为 undefined
    // 返回值为清理函数, 在下一次调用 onCurrSelectElChange 前, 会调用清理函数
    // 具体使用案例可以参考: adblock demo https://scriptcat.org/zh-CN/script-show-page/3851
    onCurrSelectElChange?: ((el: HTMLElement) => (() => void));

    // 需要排除的选择器, 排除的元素将无法被选中
    // 默认值为 []
    excludeSelectors?: string[];

    // 如果 excludeSelectors 无法满足需求, 可以使用本 option
    // 该项的默认值为 undefined
    // 返回 true 为排除, 返回 false 为不排除
    // 排除的元素将无法被选中
    matchExcludeFn?: ((el: HTMLElement) => boolean);
}

export type SpyXXGetParentOptionsType = Omit<SpyXXGetSelectorOptionsType, "initSelector" | "isShowInductor" | "initPauseState" | "isShowPauseState">

export interface ISpyXX {
    /**
     * 如果用户选择了元素, 则返回元素的选择器.
     * 如果用户取消了选择, 则返回空字符串, Boolean("") === false.
     *
     * 设计成返回选择器, 是因为油猴开发者需要用 LocalStorage 或是 GM_SetValue 来保存配置
     * 直接返回元素反而不方便, 保存配置
     */
    getSelector: (options?: SpyXXGetSelectorOptionsType) => Promise<string>;

    /**
     * 让用户选择 selector 的父元素
     *
     * 模仿 adblock
     * @param selector
     */
    getParent: (selector: string, options?: SpyXXGetParentOptionsType) => Promise<string>;
}

declare global {
    interface Window {
        spyXX: ISpyXX;
    }
}

export {};

```

### to feel, not to think 

> “to feel, not to think.”（去感受，而非思考。）—— 李小龙
>
> https://www.quotationspage.com/quote/32052.html

下面这段代码, 表示 window 上面有一个 `spyxx` 属性, 我们可以通过  `window.spyXX` 或是 `spyXX` 来获取它.

```typescript
declare global {
    interface Window {
        spyXX: ISpyXX;
    }
}
```

下面这段代码, 表示 spyXX 有两个方法, 一个是 `getSelector`, 另一个是 `getParent`, 问号代表可传参, 也可以不传参, 为可选参数.

所以接口简化为:

```typescript
export interface ISpyXX {
    /**
     * 如果用户选择了元素, 则返回元素的选择器.
     * 如果用户取消了选择, 则返回空字符串, Boolean("") === false.
     *
     * 设计成返回选择器, 是因为油猴开发者需要用 LocalStorage 或是 GM_SetValue 来保存配置
     * 直接返回元素反而不方便, 保存配置
     */
    getSelector: () => Promise<string>;

    /**
     * 让用户选择 selector 的父元素
     *
     * 模仿 adblock
     * @param selector
     */
    getParent: (selector: string) => Promise<string>;
}
```

### 第一行代码

```js
// ==UserScript==
// @name         learn spyxx 01
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  learn spyxx
// @author       qq2402398917
// @match        *://*/*
// @require      https://scriptcat.org/lib/3847/1.0.6/spyxx-lib.js
// ==/UserScript==

async function main() {
    const selector = await spyXX.getSelector();

    console.log(selector);
}

main();
```

这就是最基础的使用了

```js
const selector = await spyXX.getSelector({title: "标题", description: "描述"});
```

剩下的, 就推荐大家自己看接口定义 `global.d.ts` 了, 每个接口都有注释.

### 其他的代码参考

源码的测试用例: https://github.com/HHsomeHand/monkey-spyxx-lib/blob/main/src/main.tsx

可以参考 `main.tsx` 的这几个测试用例, 下面是他们的名字:

```ts
if (import.meta.env.MODE === "development") {
    // 仅在开发环境运行的代码
    console.log(cornDebugModeHint);

    async function testSelectToLog()

    async function testSelectToRemove() 

    async function testSelectParent()

    async function testAdBlock() 

    async function testAdBlockAndExcludeFn() 

    async function testAdBlockStep() 
}
```

这个库的尝鲜演示 DEMO 脚本, 模拟 adblock 的拦截此广告 (视频中使用的 Demo 脚本)：https://scriptcat.org/zh-CN/script-show-page/3851

## 正文二 工程化指南

> 工程化可以参考: menuManager 的文档 https://bbs.tampermonkey.net.cn/thread-8789-1-1.html

将上面的 `global.d.ts` 复制到 `src` 的任意位置, 哪怕是不使用 typescript 都可以获得更好的代码提示.

```js
import { defineConfig } from 'vite';
import monkey, {util} from 'vite-plugin-monkey';
import path from "path";

function resolve(pathName: string) {
  return path.resolve(__dirname, pathName);
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        namespace: "npm/vite-plugin-monkey", // 不用管
        author: "QQ2402398917",
        version: "1.0.0",
        license: "MIT",
        icon: 'https://vitejs.dev/logo.svg',
        match: ['*://*/*'],
        require: [
          'https://scriptcat.org/lib/3847/1.0.6/spyxx-lib.js',

          'https://scriptcat.org/lib/2847/3.0.2/ElementGetter%20%E6%B0%B4%E6%9E%9C%E7%8E%89%E7%B1%B3%20%E9%AD%94%E6%94%B9%E7%89%88.js',
          util.dataUrl(`window.elmGetter=elmGetter`),
        ], // END of require
      }, // END of userscript
    }), // END of monkey
  ],
});

```

main.js

```js
import {monkeyWindow} from "vite-plugin-monkey/dist/client";


const win = monkeyWindow;

console.log(win.spyXX);
console.log(win.elmGetter);
```

> 参考引用 issue01:
>
> vite-plugin-monkey 在 pnpm run dev 模式下, 会直接把我们的脚本, 利用 script 注入到页面, 这里的 window 是实际页面的 window. 
>
> 而 require 的 spyxx 库, 会把 spyxx 放到 window 上, 这里的 window 是 unsafeWindow, 也就是油猴的 window
>
> 所以, 我们的脚本直接访问 window, 是获取不到 spyxx 的.
>
> 所以在 dev 模式下, 我们要通过 import {monkeyWindow} from "$"; 来获取 monkeyWindow.
>
> vite-plugin-monkey 双 window 导致的 require issue: https://github.com/lisonge/vite-plugin-monkey/issues/12
>
> issue: https://github.com/lisonge/vite-plugin-monkey/issues/113



> 参考引用 issue02:
>
> import {monkeyWindow} from "$"; 报错:
>
> TS2307: Cannot find module $ or its corresponding type declarations.
>
> issue 地址: https://github.com/lisonge/vite-plugin-monkey/issues/149
>
> 解决方案: 
>
> ```
> import {monkeyWindow} from "vite-plugin-monkey/dist/client";
> 
> const win = monkeyWindow;
> ```

## 尾声1 冰山之下

冰山是一个常见的比喻，因为冰山在水面上的部分只占其整体的10%左右，而水面下隐藏的部分（约90%）才是冰山的主体，体积庞大且不易被看到。

浏览器是一个庞大且复杂的系统, 是一套非常强大且灵活的渲染引擎, 可是代价是什么呢?

<img src="./img/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E5%BC%95%E5%AF%BC/4.png" alt="30bfe34e1eca1b901dcc820cd6df5db" style="zoom:50%;" />

代价就是实在是太复杂了.

### id 的潜规则

html 中, id 使用数字开头, 是不会报错的, 可以正常解析和渲染

```html
    <label for="33">i am label</label>

    <input id="33"/>
```

点击 `i am label` 可以正常聚焦到 `input` 上

但 js 代码就歇菜了:

```js
console.log(document.querySelector("#33"))

/*
Uncaught SyntaxError: Failed to execute 'querySelector' on 'Document': '#33' is not a valid selector.
    at script.js:1:22
*/
```

`querySelector	` 的 `id selector` 不可以以数字开头

### className 的潜规则

```html
<style>
  :root {
    --color-current: skyblue;
  }

  .bg-\[--color-current\] {
    background-color: var(--color-current);
  }
</style>

<div class="bg-[--color-current]">
  我是海豹
</div>
```

这里可以正常解析和渲染, 而且这种类名, 在使用了 tailwind 的网页非常常见.

```js
console.log(document.querySelector(".bg-\[--color-current\]")) // null

console.log(document.querySelector(".bg-[--color-current]")) // null

console.log(document.querySelector(`.${CSS.escape("bg-[--color-current]")}`)) // 元素

console.log(document.querySelector(".bg-\\[--color-current\\]")); // 元素
```

各种陷阱, 非常荒唐.

1. `CSS.escape` 可以把非法 类名 或 id 名, 变成合法名字, 但是传入的字符串不可以包含 `.` `#`

2. 传入的字符串, 不是用转义字符转义, 而是要传入`\`字符, 所以要用 `\\`

### :nth-child 的潜规则

```html
<body>
    <div class="tag">content</div>
    <span></span>
    <div class="tag">请找到我</div>

    <script src="./script.js"></script>
</body>
```

```js
{
    const el = document.querySelector("div.tag:nth-child(2)")

    console.log(el); // null
}

{
    const el = document.querySelector("div.tag:nth-child(3)")

    console.log(el); // 找到了 <div class="tag">请找到我</div>
}

```

`:nth-child` 指的是父元素下的第几个子元素, 而不是相同选择器的第几个元素.

### 小结

spyxx 需要处理这些奇葩的边界情况, 当然还有很多的 edge case (边界情况) 是在我的意识之外的, 还请大家多多反馈, 一起做大做强, 把库完善起来!

> 俗话说，治大国如烙大饼，一面快糊了，就换另外一面继续烙。
>
> 写代码也是一样，好的代码是调出来的，完美的接口设计并不存在，除非开发者可以预知未来。
>
> 兵来将挡、水来土掩，代码的鲁棒性和健壮性都是在遵循当前最佳实践的前提下，不断地调试和试错，慢慢改出来的。
>
> ===========

> 最后一个 spyXX 没有解决的边界情况: 
>
> spyXX 无法选中 shadowDOM 内的子元素, 东方永页机也没处理这种边界情况.
>
> 我也在想解决方案, 毕竟在不直接获取 shadowRoot 的情况下，通过 querySelector 访问 Shadow DOM 的子元素是不可能的.
>
> 所以没有选择器可以表示 shadowDOM 的子元素.
>
> 我目前想到的办法是 spyXX 和 elmGetter 联动, 拓展选择器语法, 让 elmGetter 的 get 支持搜索 shadowDOM子元素.
>
> 如果是这样, 我得等后面有时间和精力再继续折腾了.
>
> 当然如果你有好的想法, 欢迎联系我!

## 尾声2 spyXX

本库名字 spyXX，源自于微软 visual studio 附带工具 spyXX。

这个工具是用来窗口查找的。

除去正常开发，这个工具具体的应用场景便是软件绿化。

通过查找子窗口 id，也就是广告控件的 id。然后用 resource hacker 修改 exe 的资源表。

修改对话框资源，把对应 id 的控件删掉，然后再保存就 ok 了。

整体流程，和我们油猴开发者，找广告控件选择器，然后删掉的流程差不多，只是浏览器端的这个需求，都被 adblock 包办了。

当然，这个桌面端的绿化方式不是通解，随着商业软件都用 directui 自绘 或是 libcef 嵌入浏览器，这招就废了。

对付 directui 自绘，尤其是 duilib库，可以试着找 xml，xml 往往都打成加密 zip 附到 exe 上了。然后结合逆向，找解压密码，和控件 id 来改。变成非常繁琐。这里就不展开了。



## 结语

文章到这里就结束了，山高路远，江湖再会。