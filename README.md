一个通过多任务窗口来管理功能的中后台项目, 提供了开箱即用的布局和一套独特的任务系统, 让你的后台功能组织更为高效



本项目包含两个部分:

-  `m78-admin`: 基础库,  只提供了最基础和核心功能(任务和窗口、权限等)的库.
-  [`m78-admin-start`](https://github.com/m78-core/admin-starter) : 在 `m78-admin` 的基础上添加了很多启动代码和开发用例的库, 大部分情况下你都会使用这个库来进行开发, 当然, 你也可以选择使用 `m78-admin` 来作为底层开发, 它仅包含最核心的功能.



除此之外,  `m78-admin` 构建于 [m78](https://github.com/xianjie-li/m78) 组件库, 通常建议你使用它来进行开发, 不过你也可以选择使用任何你喜欢的组件库来开发业务代码.



## API总览

以下为核心库的所有对外导出, 通常, 只需要重点关注 `主要内容` 部分即可

```typescript
export { task, Link, M78Admin };	// 主要内容
export { FuncItem, Badge, Login, WindowLayout };	// 可选的布局组件
```





## \<M78Admin />

`admin`的渲染入口, 接收以下配置

```typescript
interface M78AdminProps {
  // ####### 常用 ####### //
  /** 任务配置列表 */
  tasks: TaskOpt;
  /** 应用的AuthPro实例，用于控制菜单等区域的权限 */
  authPro: RCAuthPro;
  /** 配置, 这些配置通常情况是期望被持久化的, 所以放在单独的属性中方便统一管理, 可以通过onConfigChange订阅变更并选择保存到接口或本地缓存 */
  config?: M78AdminConfig;
  /** 配置被组件内部改变的回调, 如果忽略此项，则内部改变不会生效 */
  onConfigChange?: (config: Partial<M78AdminConfig>) => void;

  // ####### 状态 ####### //
  /** 加载状态 */
  loading?: boolean;
  /** 任务打开时触发，返回false可以阻止任务挂载 */
  beforeTaskEach?: (opt: TaskOptItem) => boolean;

  // ####### 样式定制/扩展 ####### //
  /** 任务栏额外节点 */
  taskBarExtraNode?: React.ReactNode;
  /** 任务栏的前部额外节点 */
  taskBarLeadingExtraNode?: React.ReactNode;
  /** 功能栏额外节点 */
  funcBarExtraNode?: React.ReactNode;
  /** 桌面显示的内容 */
  desktopNode?: React.ReactNode;
  /** 桌面底部的简要介绍，默认显示 powerBy 文本 */
  footerNode?: React.ReactNode;
  /** 100vh | 高度 */
  height?: string;
  /** 100vw | 宽度 */
  width?: string;
}
```





## M78AdminConfig

传递给 `<M78Admin config={...} />` 的`config `对应的配置, 这些配置通常情况是期望被持久化的, 所以放在单独的属性中方便统一管理

```typescript
interface M78AdminConfig {
  // ####### 必备配置 ####### //
  /** 常用功能id列表, 显示在左侧收藏区域 */
  collectFunc?: string[];
  /** 黑暗模式 */
  darkMode?: boolean;

  // ####### 主题控制 ####### //
  /** 主题色 */
  color?: string;
  /** 次要主题色 */
  subColor?: string;

  // ####### 定制 ####### //
  /** 自定义logo */
  logo?: string;
  /** 显示在logo下方的名称 */
  name?: string;
  /** 全屏打开所所有明确指定尺寸的窗口 */
  initFull?: boolean;
  /** 使菜单悬浮 */
  funcBarFloat?: boolean;
  /** 菜单的收藏部分是否展开 */
  funcBarCollectToggle?: boolean;
  /** 菜单的功能菜单部分是否展开 */
  funcBarFuncToggle?: boolean;

  // ####### 性能优化 ####### //
  /** 12 | 最大窗口数量 */
  maxWindow?: number;
}
```







## task

### Task

一个根 `task`对象, 类似浏览器中的 `window.history` , 用来创建任务和控制已有任务.

```typescript
interface TaskGlobal {
  /** 打开一个指定id的任务窗口 */
  push: (id: string, param?: any) => void;
  /** 打开指定id的任务窗口，不传id时打开全部 */
  open: (id?: string) => void;
  /** 隐藏指定id的任务窗口，不传id时隐藏全部 */
  hide: (id?: string) => void;interface TaskGlobal {
  /** 打开一个指定id的任务窗口, param为携带的任务参数 */
  push: (id: string, param?: any) => void;
  /** 打开指定id的任务窗口，不传id时打开全部 */
  open: (id?: string) => void;
  /** 隐藏指定id的任务窗口，不传id时隐藏全部 */
  hide: (id?: string) => void;
  /**
   * 关闭指定id的所有任务并重新打开一个任务窗口
   * - 如果现有任务包含useWillPop检测且用户主动阻止了关闭则不会关闭该历史任务
   * */
  replace: (id: string, param?: any) => void;
  /**
   * 刷新任务组件
   * - 传入opt.id时刷新指定主任务，否则刷新全部主任务
   * - 传入opt.includeSubTask来将子任务包含到刷新列表中
   * */
  refresh: (opt?: TaskArgOpt) => void;
  /**
   * 关闭任务
   * - 传入opt.id时关闭指定主任务，否则关闭全部主任务
   * - 传入opt.includeSubTask来将子任务包含到关闭列表中
   * */
  dispose: (opt?: TaskArgOpt) => void;
  /**
   * 获取当前任务
   * - 传入opt.id时获取指定主任务，否则获取全部主任务
   * - 传入opt.includeSubTask来将子任务包含到获取列表中
   * */
  get: (opt?: TaskArgOpt) => TaskCtxList;
  /**
   * 一个hook, 用于在任务窗口关闭时进行提示警告
   * @param ctx - 所属任务上下文对象
   * @param when - 一个boolean值或返回boolean值的函数，取值为true时会在任务关闭前执行弹窗提示是否要关闭
   * */
  useWillPop: (ctx: TaskCtx, when: boolean | (() => boolean)) => void;
}
  /**
   * 关闭其他同id任务并新开启一个任务窗口
   * - 如果历史任务包含useWillPop检测且用户主动阻止了关闭则不会关闭该历史任务
   * */
  replace: (id: string, param?: any) => void;
  /**
   * 刷新任务组件
   * - 传入opt.id时刷新指定主任务，否则刷新全部主任务
   * - 传入opt.includeSubTask来将子任务包含到刷新列表中
   * */
  refresh: (opt?: TaskArgOpt) => void;
  /**
   * 关闭任务
   * - 传入opt.id时关闭指定主任务，否则关闭全部主任务
   * - 传入opt.includeSubTask来将子任务包含到关闭列表中
   * */
  dispose: (opt?: TaskArgOpt) => void;
  /**
   * 获取当前任务
   * - 传入opt.id时获取指定主任务，否则获取全部主任务
   * - 传入opt.includeSubTask来将子任务包含到获取列表中
   * */
  get: (opt?: TaskArgOpt) => TaskCtxList;
  /**
   * 在窗口关闭时进行警告
   * @param ctx - 所属任务上下文对象
   * @param when - 一个boolean值或返回boolean值的函数，取值为true时会在任务关闭前执行弹窗提示是否要关闭
   * */
  useWillPop: (ctx: TaskCtx, when: boolean | (() => boolean)) => void;
}
```





### TaskCtx

`TaskCtx` 表示一个任务上下文, 可以把它当做一个任务实例来看待, 通常会通过 `TaskGlobal` 或它本身来创建(子任务).

另外, 任务组件会接收 `TaskCtx` 作为 `props`

```typescript
interface TaskCtx<Param = any> {
  // ####### 常规 ####### //
  /** 配置中传递的标识id */
  id: string;
  /** 任务唯一key */
  taskKey: string;
  /** 参数 */
  param: Param;
  /** 更新当前窗口的param */
  setParam: (param: Param) => void;
  /** 注册时的配置项 */
  option: TaskOptItem;

  // ####### 窗口控制 ####### //
  /** 此任务对应的wine实例(一个多窗口库https://github.com/m78-core/wine) */
  wine: RenderApiComponentInstance<WineState, WineInstance>;
  /**
   * 主任务: 在当前任务下打开子任务, 如果当前任务是子任务, 则在其所在窗口下打开新的任务 */
  push: (id: string, param?: any) => void;
  /**
   * 关闭该实例下的其他同id任务并开启一个相同的新任务, 如果当前任务是子任务，则关闭所有兄弟任务窗口中同id的任务并打开新任务
   * - 如果被替换的任务包含useWillPop检测且用户主动阻止了关闭则不会关闭
   * */
  replace: (id: string, param?: any) => void;
  /** 刷新并重置任务组件 */
  refresh: () => void;
  /** 打开当前任务窗口并置顶显示, 子任务中执行时, 切换到当前任务 */
  open: () => void;
  /** 隐藏当前任务窗口 */
  hide: () => void;
  /** 关闭当前任务窗口 */
  dispose: () => void;

  // ####### 父子任务 ####### //
  /** 如果任务是子任务, 则parent是其所在的父任务 */
  parent?: TaskCtx;
  /** 子任务 */
  children: TaskCtx[];
  /** 当前打开的子任务索引 */
  currentChildIndex?: number;
}
```








### 任务配置

任务配置是由 `TaskOptItem `  或 `TaskItemCategory` 组成的数组, 类似于传统意义上的路由配置.

```typescript
const opt: TaskOpt = [
  // 一个任务配置, 由id、name、component三个最基础的属性组成
  {
    id: 'home',
    name: '欢迎页',
    component: Home,	// 任务组件是以TaskCtx为prop的react组件
  },
  // 一个分类配置, 由name和children两个必须属性组成
  {
    name: '用户',
    children: [
      {
        id: 'register',
        name: '注册',
        component: Register,
      },
      {
        id: 'login',
        name: '登录',
        component: Login,
      },
    ],
  },
];
```

TaskOpt是一个如下的类型声明:

```typescript
type TaskOpt = Array<TaskItemCategory | TaskOptItem>;
```





#### TaskOptItem 配置项

描述一项任务的配置选项

```typescript
interface TaskOptItem {
  // ####### 基础设置 ####### //
  /** 标识此任务的唯一id */
  id: string;
  /** 描述此任务的名称 */
  name: string;
  /**
   * 任务组件
   * - 类似于传统路由开发中的路由组件, 接收TaskCtx作为props
   * - 支持使用React.lazy等方式进行懒加载
   * */
  component: AnyFunction;
  /** 图标 */
  icon?: React.ReactNode | string;
  /** 权限，此项需要配合 M78Admin 组件的 authSeed 配置使用  */
  auth?: AuthProStrings;

  // ####### 窗口设置 这些配置继承至Wine ####### //
  /**
   *  0.84 | 以浏览器窗口大小的一定比例来设置一个适合的窗口尺寸, 取值为0 ~ 1
   *  - 如果屏幕宽度小于576, 会忽略尺寸设置强制全屏显示窗口
   *  */
  sizeRatio?: number;
  /** 宽度, 会覆盖sizeRatio对应方向的配置 */
  width?: number;
  /** 高度, 会覆盖sizeRatio对应方向的配置 */
  height?: number;
  /** [0.5, 0.5] | 弹窗在屏幕上的位置, 取值为0 ~ 1 */
  alignment?: TupleNumber;
  /** 初始化时最大化显示 */
  initFull?: boolean;

  // ####### 可选项 ####### //
  /**
   * false | 是否为单例任务窗口
   * - 设置此项时，窗口被多次打开时，只会开启一个窗口, 不同于replace, 它会复用而不是销毁存在的窗口
   * - 单例是基于窗口的，作为主任务时，只会存在一个，作为子任务时，其所在的任务窗口只会存在一个对应的任务
   * - 只作用于push(),使用replace()方法依然可以销毁并创建新窗口
   * */
  singleton?: boolean;
  /** 不会显示在功能菜单中, 但仍可通过命令方式打开 */
  hide?: boolean;
  /**
   * 动态设置任务显示的名称(在任务栏、窗口顶部等位置), 不设置时使用name
   * - 由于会在窗口初始绘制阶段执行，所以此函数接收的TaskCtx可能是不完整的
   * - 一般用例为根据param动态设置标题，比如有param.id时显示`修改`, 没有时显示新增
   * */
  taskName?: (ctx: TaskCtx) => string;
}
```



#### TaskItemCategory 配置分类

用来组织一组任务的配置对象

```typescript
interface TaskItemCategory {
  /** 描述此分组的名称 */
  name: string;
  /** 此分组下的任务 */
  children: TaskOpt;
  /** 目录图标 */
  icon?: TaskOptItem['icon'];
  /** 同TaskOptItem.auth, 其作用于所有子级 */
  auth?: TaskOptItem['auth'];
}
```





### \<Link />

提供类似html中 `<a />` 这样的跳转能力, 内部其实是`TaskCtx`的简单封装

```typescript
interface TaskLinkProps extends ComponentBasePropsWithAny {
  /** 任务id */
  id: string;
  /** 显示的内容元素, 如果是ReactElement, 该元素必须能够接收onClick事件 */
  children: React.ReactElement | string;
  /** 参数 */
  param?: any;

  // ####### 子任务配置 ####### //
  /** 替换已存在的同id任务窗口而不是打开新的任务, 同 ctx.replace() */
  replace?: boolean;
  /** 当处于任务窗口时，默认行为是在当前页面开子任务，设置此项后任务会强制在新窗口打开 */
  blank?: boolean;
}
```





## 组件

额外导出的一些布局组件, 用于简化常见布局场景



### \<Login />

一个预置的简单登录界面组件, 该组件是可选的, 你完全可以自己自己实现登录界面.

```typescript
interface TaskLoginProps {
  /** 定制logo */
  logo?: string;
  /** 定制表 */
  title?: string;
  /** 描述文本 */
  desc?: string;
  /** 内容区域 */
  content?: React.ReactNode;
}
```



### \<WindowLayout />

一个预置的任务窗口布局组件, 该组件是可选的, 你完全可以从空白窗口开始渲染.

```typescript
interface TaskWindowLayoutProps extends ComponentBasePropsWithAny {
  /** 内容区域 */
  children: React.ReactNode;
  /** 底部浮动内容，一般用来放置分页器、操作按钮等 */
  footer?: React.ReactNode;
  /**
   * 顶栏内容
   * - topBarType为eclipse时，可以传入一个render prop并接收toggle来控制展开和收起时显示的内容
   * */
  topBar?: React.ReactNode | ((toggle: boolean) => React.ReactNode);
  /**
   * 顶栏显示类型
   * - toggle, 正常的关闭展开型顶栏，可以通过topBarDefaultShow设置默认显示
   * - eclipse, 用来实现半展开、展开型顶栏，配合topBar的render prop参数使用
   * - always, 持续显示且不支持关闭
   * */
  topBarType?: TaskWindowTopBarTypeKeys | 'toggle' | 'eclipse' | 'always';
  /** topBarType为toggle时, 默认是否显示topBar */
  topBarDefaultShow?: boolean;
  /** 自定义topBar展开按钮的图标, toggle为当前展开状态 */
  topBarIconCustomer?: (toggle: boolean) => React.ReactNode;
  /** 左侧栏目内容，传入sideTabs时，此项被忽略 */
  side?: React.ReactNode;
  /** 生成侧栏tab，点击tab时会跳转到对应选择器的内容，并且滚动到对应区域时会同步到对应tab */
  sideTabs?: Array<{
    /** tab项的名称 */
    label: string;
    /** 点击时跳转到对应选择器的元素 */
    selector: string;
  }>;
  /** 控制滚动区域的scroller */
  scrollRef?: React.RefObject<ReturnType<typeof useScroll>>;
}
```



### \<LayoutSection />

```typescript
interface WindowLayoutSectionProps extends ComponentBasePropsWithAny {
  /** 当前块的标题, 此项的值不能与其他WindowLayoutSession的相同 */
  label: string;
  /** 内容 */
  children?: React.ReactNode;
  /** 当前块的描述 */
  desc?: string;
}
```



### \<FuncItem />

```typescript
interface Props extends TileProps {
  icon?: React.ReactNode;
  title: string;
}
```




### \<Badge />

```typescript
interface Props {
  /** 是佛显示在元素外 */
  out?: boolean;
  /** 状态色 */
  color?: ButtonProps['color'];
}
```



