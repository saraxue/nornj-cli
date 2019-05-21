# 使用Mobx管理React组件状态

`React`技术栈中最常用的状态管理库是`Redux`，相关的技术生态也非常完善。但是`Redux`遵循严格的函数式编程规范，需要学习的相关技术很多上手较为困难，且在很多场景下需要进行额外的性能优化。

`Mobx`与`Vue`同样基于`响应式编程`设计，可作为`Redux`的首选替代方案。其API简单容易理解，更可让开发人员享受`响应式编程`的便捷开发体验，通常无需优化也可保证高性能，故可作为`NornJ-cli`的首选`React`状态管理库。

## 使用@observable装饰器创建可观察对象

`Mobx`为React开发提供的最核心的部分就是`observable`变量，使用它基本可以完全替代`setState`函数，用非常便捷的方式为React组件更新状态。

* 在React组件的class中使用observable变量更新数据

1. 在helloWorld.js中定义observable变量：

```js
import { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import tmpls from './helloWorld.t.html';
import styles from './helloWorld.m.scss';

@registerTmpl('HelloWorld')
@observer  //需要为React组件添加observer装饰器
export default class HelloWorld extends Component {
  @observable msg = 'Welcome to Your React.js App';

  @autobind
  onInputChange(e) {
    //在文本框内容变化事件中修改observable变量msg的值后，会自动触发模板中的渲染内容更新
    this.msg = e.target.value;
  }

  render() {
    return tmpls.helloWorld(this, {
      styles
    });
  }
}
```

2. 在helloWorld.t.html使用observable变量展示数据：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <input value={msg} onChange={onInputChange} />
  </div>
</template>
```

更多@observable的详细文档请查看[Mobx中文文档](http://cn.mobx.js.org/refguide/observable-decorator.html)。

## 使用@computed装饰器创建计算属性

如要将上例中的msg信息改为由多个部分拼接而成，则可以使用`computed`(计算属性)来返回计算结果。

* 在React组件的class中使用computed更新数据

1. 在helloWorld.js中定义computed：

```js
import { observable, computed } from 'mobx';
...

@registerTmpl('HelloWorld')
@observer
export default class HelloWorld extends Component {
  @observable framework = 'React';

  @computed get msg() {
    return 'Welcome to Your ' + this.framework + '.js App';
  }

  @autobind
  onInputChange(e) {
    //在文本框内容变化事件中修改observable变量framework的值后，会自动触发msg计算属性的更新，并触发模板中的渲染内容更新
    this.framework = e.target.value;
  }

  render() {
    return tmpls.helloWorld(this, {
      styles
    });
  }
}
```

2. 在helloWorld.t.html使用computed展示数据：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <!-- computed在使用时和observable变量的写法相同 -->
    <input value={msg} onChange={onInputChange} />
  </div>
</template>
```

利用computed(计算属性)也可以实现很多复杂的自动计算逻辑，更多文档请查看[Mobx中文文档](http://cn.mobx.js.org/refguide/computed-decorator.html)。

## 使用Mobx-state-tree构建store

`mobx-state-tree`是`Mobx`的状态容器方案，它以更加规范化的语法为`React`在独立的`store`中管理状态，作用类似于`Vue`生态中的`Vuex`，非常适合大型单页web应用。

在`NornJ-cli`的`react-mst`模板中，我们默认使用`mobx-state-tree`来创建`store`来管理从后端获取的各组件数据变量，存放在独立的`stores`文件目录内。

### stores目录结构

```
.
├── src                               # 源代码
    ├── stores                          # 数据集
        ├── pages                         # 功能页面Store
            ├── page1Store.js              # 页面1Store
            ├── page2Store.js              # 页面2Store
            ...       
        ├── commonStore.js                # 通用Store
        ├── headerStore.js                # 头部Store
        ├── siderStore.js                 # 侧边栏Store
        └── rootStore.js                  # 根Store
```

如上，在`src/stores`目录内存放了各类`store`，其中有：

* 各页面的store

各页面的`store`存放在pages目录内，每个页面会创建一个独立的`store`。

* commonStore、headerStore、siderStore

页面各部分通用功能的`store`。

* rootStore

根节点`store`，它里面引入了上述所有的`store`并做一些初始化配置，最终形成一棵`全局单一store树`：

```js
import { types } from "mobx-state-tree";
import { CommonStore } from "./commonStore";
import HeaderStore from "./headerStore";
import SiderStore from "./siderStore";
import Page1Store from "./pages/page1Store";
import Page2Store from "./pages/page2Store";
...

const RootStore = types.model("RootStore", {
  common: types.optional(CommonStore, {}),
  page1: types.optional(Page1Store, {}),
  ...
});

export default RootStore;
```

### 创建各页面的store

用[快速起步](https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/gettingStarted.md#%E8%BF%90%E8%A1%8C%E6%96%B0%E6%B7%BB%E5%8A%A0%E7%9A%84%E9%A1%B5%E9%9D%A2)一节中提到的`nj ap`命令创建新页面时，相应页面的`store`也会在`src/stores/pages`内一起创建。

每个`store`的结构大致如下：

```js
import { types } from "mobx-state-tree";
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import Notification from '../../utils/notification';

const Page1Store = types.model("Page1Store",  //store名称
  //此处可放置强制类型检测的observable变量
  {  
    isDisable: true,                                   //可直接填写简单类型值，会自动推断实际类型
    framework: types.optional(types.string, 'React'),  //限定为string类型值，默认值用"React"
  })
  //此处可放置不限类型的observable变量
  .volatile(self => ({
    tableData: [],  //通常可放置一些结构较复杂的数据类型
    menuIds: []
  }))
  //此处可放置计算属性
  .views(self => ({
    get msg() {
      return 'Welcome to Your ' + self.framework + '.js App';
    }
  }))
  //此处可放置各action
  .actions(self => ({
    setFramework(v) {
      self.framework = v;  //只有在action中才能改变store中的变量
    },

    //获取后端数据可统一都定义在store的action中
    getTableData(params) {
      return fetchData(`${__HOST}/page1/getTableData`,
        self.setTableData,  //将下面定义的setTableData作为fetch的回调方法
        params, { method: 'get' }).catch((ex) => {
        Notification.error({
          description: '获取表格数据异常:' + ex,
          duration: null
        });
      });
    },

    setTableData(result) {
      if (result.success) {
        self.tableData = result.data;  //使用后端获取的数据修改store中的相应变量
      } else {
        Notification.error({
          description: '获取表格数据错误:' + result.message,
          duration: null
        });
      }
    }
  }));
```

同`Redux`或`Vuex`比较类似，`mobx-state-tree`的store也只能在`action`中修改store中的变量。

### 在各页面的React组件中使用store中的变量

我们将上面使用@observable的例子改写为使用store中的数据。

1. 在helloWorld.js中获取store并使用：

```js
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
...

@registerTmpl('HelloWorld')
@inject('store')  //通过inject注入store
@observer
export default class HelloWorld extends Component {
  @autobind
  onInputChange(e) {
    //从组件的props中获取相应页面的store
    const { store: { page1 } } = this.props;  

    //调用store中的action修改值
    page1.setFramework(e.target.value);
  }

  render() {
    const { store: { page1 } } = this.props;

    return tmpls.helloWorld(this, {
      styles,
      page1  //将页面的store传入模板中
    });
  }
}
```

2. 在helloWorld.t.html使用store中的值展示数据：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <input value={page1.msg} onChange={onInputChange} />
  </div>
</template>
```

### 调用store中的action请求后端数据

1. 在helloWorld.js中调用action：

```js
import Message from 'flarej/lib/components/antd/message';
...

@registerTmpl('HelloWorld')
@inject('store')
@observer
export default class HelloWorld extends Component {
  componentDidMount() {
    const { store: { page1 } } = this.props;

    //在组件初始化时请求后端数据
    const closeLoading = Message.loading('正在获取数据...', 0);
    page1.getTableData.then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { page1 } } = this.props;

    return tmpls.helloWorld(this, {
      styles,
      page1
    });
  }
}
```

2. 在helloWorld.t.html使用store中的值展示数据：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <!-- 循环tr展示表格数据 -->
    <table>
      <#each {page1.tableData}>
        <tr>...</tr>
      <#each>
    </table>
  </div>
</template>
```

关于`mobx-state-tree`的更多详细使用方式请查看[MST官方文档](https://github.com/mobxjs/mobx-state-tree/blob/master/README.md)。

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="httpRequest.md"><b>使用fetch请求服务端数据</b></a> →</p>