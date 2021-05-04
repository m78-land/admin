import { AnyFunction, TupleNumber } from '@lxjx/utils';
import { WineInstance } from '@m78/wine';
import React, { ReactElement } from 'react';
import { ComponentBasePropsWithAny } from 'm78/types';
import { useScroll } from '@lxjx/hooks';

/*
 * #####################################################
 * ++++++++++++++++++++++++ 任务 ++++++++++++++++++++++++
 * #####################################################
 * */

/** 描述一项任务配置选项 */
export interface TaskOptItem {
  // ####### 基础设置 ####### //
  /** 标识此任务的唯一id */
  id: string;
  /** 描述此任务的名称，也可以是返回名称的函数 */
  name: string;
  /**
   * 任务组件
   * - 类似于传统路由开发中的路由组件, 接收TaskCtx作为props
   * - 支持使用React.lazy等方式进行懒加载
   * */
  component: AnyFunction;
  /** 图标 */
  icon?: React.ReactNode;
  /** 权限，此项需要配合 M78Admin 组件的 authSeed 配置使用  */
  auth?: AuthStrings;

  // ####### 窗口设置 ####### //
  /** 0.84 | 窗口占屏幕高度的比例, 取值为0 ~ 1, 如果未设置width，会根据此项计算得到的高度以合适比例设置宽度 */
  sizeRatio?: number;
  /** 宽度, 覆盖sizeRatio对应方向的配置 */
  width?: number;
  /** 高度, 覆盖sizeRatio对应方向的配置 */
  height?: number;
  /** [0.5, 0.5] | 弹窗在屏幕上的位置, 取值为0 ~ 1 */
  alignment?: TupleNumber;
  /** 初始化时最大化显示 */
  initFull?: boolean;

  // ####### 可选项 ####### //
  /** 作为隐藏任务，可以命令式打开，但不会显示在功能菜单中 */
  hide?: boolean;
  /**
   * 动态设置任务显示的名称(在任务栏、窗口顶部等位置), 不设置时使用name
   * - 由于会在窗口初始绘制阶段执行，所以此函数接收的TaskCtx可能是不完整的
   * - 一般用例为根据param动态设置标题，比如有param.id时显示`修改`, 没有时显示新增
   * */
  taskName?: (ctx: TaskCtx) => string;
}

/** 描述一项任务配置中的分类 */
export interface TaskItemCategory {
  /** 描述此分组的名称 */
  name: string;
  /** 此分组下的任务 */
  children: TaskOpt;
}

/**
 * 任务配置列表
 * */
export type TaskOpt = Array<TaskItemCategory | TaskOptItem>;

/** 全局task对象 */
export interface TaskGlobal {
  /** 打开一个指定id的任务窗口 */
  push: (id: string, param?: any) => void;
  /** 刷新指定id的任务，不传id时刷新全部 (不包含子任务) */
  refresh: (id?: string) => void;
  /** 打开指定id的任务，不传id时打开全部 (不包含子任务) */
  open: (id?: string) => void;
  /** 隐藏指定id的任务，不传id时隐藏全部 (不包含子任务) */
  hide: (id?: string) => void;
  /** 关闭指定id的任务，不传id时闭全部 (不包含子任务) */
  dispose: (id?: string) => void;
  /**
   * 关闭其他同id任务并开启新一个任务
   * - 如果历史任务包含useWillPop检测且用户主动阻止了关闭则不会关闭该历史任务
   * */
  replace: (id: string, param?: any) => void;
  /** 获取指定id的所有任务实例，不传id时获取全部实例 (不包含子任务) */
  get: (id?: string) => TaskCtxList;
  /**
   * 在窗口关闭时进行警告
   * @param ctx - 所属任务上下文对象
   * @param when - 一个boolean值或返回boolean值的函数，取值为true时会在任务关闭前执行弹窗提示是否要关闭
   * */
  useWillPop: (ctx: TaskCtx, when: boolean | (() => boolean)) => void;
}

/** 任务上下文对象(实例) */
export interface TaskCtx<Param = any> {
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
  /** 此任务对应的wine实例 */
  wine: WineInstance;
  /**
   * 在当前任务下打开子任务
   * - 此方法在子任务实例下无效
   * */
  push: (id: string, param?: any) => void;
  /**
   * 关闭该实例下的其他同id任务并开启新一个任务
   * - 此方法在子任务实例下无效
   * - 如果历史任务包含useWillPop检测且用户主动阻止了关闭则不会关闭该历史任务
   * */
  replace: (id: string, param?: any) => void;
  /** 刷新此任务, 子任务调用时，刷新所在窗口(包含父任务和其他子任务) */
  refresh: () => void;
  /** 打开当前窗口并置顶显示 */
  open: () => void;
  /** 隐藏当前窗口 */
  hide: () => void;
  /** 关闭当前窗口 */
  dispose: () => void;

  // ####### 父子任务 ####### //
  /** 是否是子任务 */
  parent?: TaskCtx;
  /** 子任务 */
  children: TaskCtx[];
  /** 当前打开的子任务索引 */
  currentChildIndex?: number;
}

/** 已打开的任务列表(按推入顺序排序) */
export type TaskCtxList = TaskCtx[];

/** Link组件的props */
export interface TaskLinkProps extends ComponentBasePropsWithAny {
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

/*
 * #####################################################
 * ++++++++++++++++++++++ 核心组件 ++++++++++++++++++++++
 * #####################################################
 * */

/** 配置 */
export interface M78AdminConfig {
  // ####### 必备配置 ####### //
  /** 常用功能id列表 */
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
  /** 桌面右下角的装饰图片(请使用带透明通道的图片/PNG) */
  desktopImage?: string;

  // ####### 性能优化 ####### //
  /** 12 | 最大窗口数量 */
  maxWindow?: number;
}

export interface M78AdminProps {
  // ####### 常用 ####### //
  /** 任务配置列表 */
  tasks: TaskOpt;
  /** 配置 */
  config?: M78AdminConfig;
  /** 配置被组件内部改变的回调, 如果忽略此项，则内部改变不会生效 */
  onConfigChange?: (config: Partial<NonNullable<M78AdminProps['config']>>) => void;

  // ####### 状态 ####### //
  /** 加载状态 */
  loading?: boolean;
  /** 任务打开时触发，返回false可以阻止任务挂载 */
  beforeTaskEach?: (opt: TaskOptItem) => boolean;

  // ####### 样式定制/扩展 ####### //
  /** 任务栏额外节点 */
  taskBarExtraNode?: React.ReactNode;
  /** 功能栏额外节点 */
  funcBarExtraNode?: React.ReactNode;
  /** 桌面显示的内容 */
  desktopNode?: React.ReactNode;
  /** 桌面底部的简要介绍，默认显示 powerBy 文本 */
  footerNode?: React.ReactNode;

  // ####### 权限 ####### //
  /**
   * 添加除`c r u d`以外的自定义权限key
   * - 如果设置了 c r u d 中的任意key，会将其内部设置重写
   * */
  customAuthKeysMap?: AuthKeysMap;
  /** 为权限限名添加文本映射, 比如将 user:crud 中的 user 映射为 '用户管理' */
  authNameMap?: String2StringMap;

  // ####### 不建议使用 ####### //
  /** 100vh | 高度 */
  height?: string;
  /** 100vw | 宽度 */
  width?: string;
}

/** 全局状态 */
export interface TaskState {
  /** 当前任务配置 */
  taskOptions: TaskOpt;
  /** 任务配置去目录的平铺列表 */
  taskOptionsFlat: TaskOptItem[];
  /** 用于快查当前TaskOptItem的map */
  taskOptionsIdMap: { [key: string]: TaskOptItem };
  /** 所有已打开的任务实例 */
  taskList: TaskCtxList;
  /** 接收的AdminProps */
  adminProps: M78AdminProps;
}

/** 用于useWillPop的元数据 */
export interface TaskWillPopMeta {
  [key: string]: {
    when: boolean | (() => boolean);
  };
}

/*
 * #####################################################
 * +++++++++++++++++++++ 部分内置组件 ++++++++++++++++++++
 * #####################################################
 * */

/** 登录组件props */
export interface TaskLoginProps {
  /** 定制logo */
  logo?: string;
  /** 定制表 */
  title?: string;
  /** 描述文本 */
  desc?: string;
  /** 内容区域 */
  content?: React.ReactNode;
}

/** 布局组件props */
export interface TaskWindowLayoutProps extends ComponentBasePropsWithAny {
  /** 内容区域, 传入特定类似的子项数组时，会产生不同的行为 */
  children: React.ReactNode;
  /** 底部浮动内容，一般用来放置分页器、操作按钮等 */
  footer?: React.ReactNode;
  /** 顶栏内容 */
  topBar?: React.ReactNode;
  /** 一直显示topBar，不需要点击展开按钮 */
  topBarAlwaysShow?: boolean;
  /** 自定义topBar展开按钮的图标 */
  topBarIcon?: React.ReactNode;
  /** 左侧栏目内容，传入sideTabs时，此项被忽略 */
  side?: React.ReactNode;
  /** 生成侧栏tab，点击tab时会跳转到对应选择器的内容，滚动到对应区域时会同步到对应tab */
  sideTabs?: Array<{
    /** tab项的名称 */
    label: string;
    /** 点击时跳转到对应选择器的元素 */
    selector: string;
  }>;
  /** 控制滚动区域的scroller */
  scrollRef?: React.RefObject<ReturnType<typeof useScroll>>;
}

/** 布局块props */
export interface WindowLayoutSectionProps extends ComponentBasePropsWithAny {
  /** 当前块的标题, 此项的值不能与其他WindowLayoutSession的相同 */
  label: string;
  /** 内容 */
  children?: React.ReactNode;
  /** 当前块的描述 */
  desc?: string;
}

/*
 * #####################################################
 * +++++++++++++++++++++++ 媒体查询 ++++++++++++++++++++++
 * #####################################################
 * */

/**
 * MediaQuery context结构
 * */
export interface _MediaQueryTypeContext {
  /** 派发通知到useMediaQuery.onChange的方法 */
  onChange: (sizeMeta: MediaQuerySizeMete) => void;
  /** useMediaQuery挂载的所有监听函数 */
  changeListeners: Array<(meta: MediaQueryMete) => void>;
  /** 当前meta信息 */
  meta: MediaQueryMete | null;
}

/**
 * MediaQuery的所有类型
 * 判断是否在某一类型的方式为 当前宽度大于等于该类型的值且小于下一类型的值
 * */
export enum MediaQueryTypeValues {
  XS = 0,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

/**
 * MediaQuery的所有类型
 * 判断是否在某一类型的方式为 当前宽度大于等于该类型的值且小于下一类型的值
 * */
export enum MediaQueryTypeKey {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

/** MediaQuery type元信息 */
export interface MediaQueryTypeMete {
  /** 当前类型 */
  type: MediaQueryTypeKey;
  /** 检测是否为指定类型 */
  isXS: () => boolean;
  isSM: () => boolean;
  isMD: () => boolean;
  isLG: () => boolean;
  isXL: () => boolean;
  isXXL: () => boolean;
  /** 当前尺寸是 xs或sm */
  isSmall: () => boolean;
  /** 当前尺寸是 md或lg */
  isMedium: () => boolean;
  /** 当前尺寸大于 lg */
  isLarge: () => boolean;
}

/** MediaQuery size元信息 */
export interface MediaQuerySizeMete {
  width: number;
  height: number;
}

/** MediaQuery 完整元信息 */
export interface MediaQueryMete extends MediaQueryTypeMete, MediaQuerySizeMete {}

export interface MediaQueryProps {
  onChange: (meta: MediaQueryMete) => void;
}

export interface MediaQuerySizeProps {
  children: (sizeMeta: MediaQuerySizeMete) => ReactElement<any, any> | null;
}

export interface MediaQueryTypeProps {
  children: (sizeMeta: MediaQueryTypeMete) => ReactElement<any, any> | null;
}

/*
 * #####################################################
 * ++++++++++++++++++++++ 权限类型 ++++++++++++++++++++++
 * #####################################################
 * */

/**
 * 包含格式如 `authName:keys` 的权限数组
 * authName部分表示能代表某个权限的唯一名称
 * keys部分为`crud`类似的字符，表示对此功能的 增加(Create)、检索(Retrieve)、更新(Update)和删除(Delete)权限，keys中也可能包含用户自定义的key
 * */
export type AuthStrings = string[];

/** 表示crud中的c、r、u、d等简写字符的完整名称和详细信息的map */
export interface AuthKeysMap {
  [key: string]: {
    /** 表示该简写的完整名称, 如 c 的完整 name 为 create */
    name: string;
    /** 标题 */
    label: string;
    /** 详细描述 */
    desc?: string;
  };
}

/** 表示crud中的c、r、u、d等简写字符的完整名称的映射map */
export interface String2StringMap {
  [key: string]: string;
}

/**
 * 由权限描述字符转换得到的详情对象, 用户自定义了key时可以扩展此类型
 * */
export interface AuthDetail {
  create?: boolean;
  retrieve?: boolean;
  update?: boolean;
  delete?: boolean;
  [key: string]: boolean | undefined;
}

/** 一组AuthSchemaMapItem */
export interface AuthDetailMap {
  [key: string]: AuthDetail;
}

/** 权限状态 */
export interface AuthSeedState {
  /** 用户当前的权限 */
  auth: AuthStrings;
  /** 根据当前auth转换得到的AuthSchemaMap, 此属性变更不触发subscribe订阅的函数 */
  authDetailMap: AuthDetailMap | null;
}
