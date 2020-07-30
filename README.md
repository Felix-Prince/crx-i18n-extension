# Chrome Extension 问题

1. 如何实现数据的保存，怎么把翻译的结果保存到文件中，以键值对的形式
    项目中起一个nodejs 服务，读写文件
2. 如何在选中的文本处显示一个小按钮，点击后翻译
    [参考文章](https://segmentfault.com/a/1190000021553960?utm_source=tag-newest)
3. 如何进行翻译
    [translation.js](npmjs.com/package/translation.js)
4. 使用 create-react-app 开发 Chrome extension
    因为 create-react-app 默认是内联 js 文件，而由于谷歌插件引入了 [csp（内容安全策略）](https://crxdoc-zh.appspot.com/extensions/contentSecurityPolicy)。所以无法使用内联文件
    修改create-react-apppackage.json中build命令"build":"INLINE_RUNTIME_CHUNK=false react-scripts build"
    
5. 怎么把翻译的数据再次显示在界面上，所译即所见，还需要一个切换语言的操作
6. 如果选中的是两个标签包裹的文字，能否获取到两个节点的 data-key

7. create-react-app 使用 antd 需要自己单独引入样式文件`@import "~antd/dist/antd.css";`
8. create-react-app 中使用 css-module 需要把样式文件 css/less/sass 等文件改为 .module.css/.module.less/.module.sass 文件
9. [chrome 对象未定义问题](https://www.coder.work/article/3794220)
10. 翻译功能使用的包 [translation.js](https://www.npmjs.com/package/translation.js)
11. 如何把选中的内容显示在 popup 的文本框中
12. 在 background 中定义变量和函数的时候使用 var 和 function ，这样在 popup 中才能获取到 window 对象上面的属性和方法，使用 let 和 匿名函数的方式来定义变量和函数，在 popup 的 window 对象上是找不到的
13. 读取到的 yaml 文件与 json 的转换时用 js-yaml 这个包
```js
// yaml -> json
let json = JSON.stringify(jsyaml.load(yaml))
// obj -> yaml
const obj = {
    name:'zs',
    age:18,
    address:'zhejiang shanghai'
}
console.log(jsyaml.dump(obj))
```
14. 语言包的导出使用的是 FileSaver.js 这个插件包
15. 如何实现上传语言包，并且读取包里的翻译
    - 通过 fileReader 读取上传的文件内容，然后通过 chrome.storage.local.set 来存储，通过 get 来读取
    - 如果能读取到就直接显示读取的结果，没有则使用翻译
    - 导出语言包其实就是获取到所有的存储，然后通过 Blob 依旧 fileSaver 中的 saveAs 进行下载
16. 需要考虑的问题
    - 导入的时候如何区分英文包还是中文包等
    - 获取对应翻译的时候怎么去判断是从哪种包中获取
    - 如果语言包的文件太大在扩展的本地存储中无法存下时该怎么解决（可能还是需要通过调用接口的方式来获取，可以从主页面上进行上传，然后在 popup 页面中通过某种方式获取到上传的文件内容）
    - 下载的时候如何指定下载哪个包
    - 如何动态的设置读取标签的那个属性，目前是写死了 data-key 这个属性，之后需要有配置的地方
    
17. 新问题
    - 选中后的小图标需要能够用户控制，不然容易影响别的插件的使用，毕竟当前插件的用途相对来说比较局限
        - 配置指定网站才能使用该插件
    - 弹出框的修改保存功能还未完成

18. create-react-app 脚手架切换成多入口
    首先在修改 entry , CRA 是在 paths 文件中配置了相应的页面，所以在改动最小的情况下，我们也在那里追加我们的项目，然后就正常的配置就行
    其次修改 output，因为我们需要让特定路口的文件打包到特定的页面，也不是所有的页面都有所有的打包，因此这里我把filename改为和原文件名一样
    最后在 plugins 里增加一个 htmlwepackplugin ，修改输出的路径，以及通过 chunks 来设置哪些文件会被注入到页面中