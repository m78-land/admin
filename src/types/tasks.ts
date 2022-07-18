import { AnyFunction, ComponentBasePropsWithAny, TupleNumber } from '@lxjx/utils';
import React from 'react';
import { PermissionProTplList } from 'm78/permission';
import { RenderApiComponentInstance } from '@m78/render-api';
import { WineInstance, WineState } from '@m78/wine';

/** 描述一项任务的配置选项 */
export interface TaskOptItem {
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
  /** 权限，此项需要配合 M78Admin 组件的 permission 配置使用  */
  permission?: PermissionProTplList;
  /** 未指定参数时, 以此项作为默认参数 */
  param?: any;

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

/** 用来组织一组任务的配置对象 */
export interface TaskItemCategory {
  /** 描述此分组的名称 */
  name: string;
  /** 此分组下的任务 */
  children: TaskOpt;
  /** 目录图标 */
  icon?: TaskOptItem['icon'];
  /** 同TaskOptItem.auth, 其作用于所有子级 */
  permission?: TaskOptItem['permission'];
}

/**
 * 任务配置列表
 * */
export type TaskOpt = Array<TaskItemCategory | TaskOptItem>;

/** 某些task方法接收的任务选项 */
export interface TaskArgOpt {
  /** 只针对指定id的任务 */
  id?: string;
  /** 是否包含子任务, 默认false */
  includeSubTask?: boolean;
}

/** 全局task对象 */
export interface TaskGlobal {
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
  /** 此任务对应的wine实例(一个多窗口库https://github.com/m78-core/wine) */
  wine: RenderApiComponentInstance<WineState, WineInstance>;
  /**
   * 主任务: 在当前任务下打开子任务,如果当前任务是子任务, 则在其所在窗口下打开新的任务 */
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
