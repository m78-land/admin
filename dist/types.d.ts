import { AnyFunction, TupleNumber } from '@lxjx/utils';
import { WineInstance } from '@m78/wine';
import React from 'react';
import { ComponentBasePropsWithAny } from 'm78/types';
import { useScroll } from '@lxjx/hooks';
import { AuthProStrings, RCAuthPro } from 'm78/auth';
/** 描述一项任务配置选项 */
export interface TaskOptItem {
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
    auth?: AuthProStrings;
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
export declare type TaskOpt = Array<TaskItemCategory | TaskOptItem>;
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
    /** 是否是子任务 */
    parent?: TaskCtx;
    /** 子任务 */
    children: TaskCtx[];
    /** 当前打开的子任务索引 */
    currentChildIndex?: number;
}
/** 已打开的任务列表(按推入顺序排序) */
export declare type TaskCtxList = TaskCtx[];
/** Link组件的props */
export interface TaskLinkProps extends ComponentBasePropsWithAny {
    /** 任务id */
    id: string;
    /** 显示的内容元素, 如果是ReactElement, 该元素必须能够接收onClick事件 */
    children: React.ReactElement | string;
    /** 参数 */
    param?: any;
    /** 替换已存在的同id任务窗口而不是打开新的任务, 同 ctx.replace() */
    replace?: boolean;
    /** 当处于任务窗口时，默认行为是在当前页面开子任务，设置此项后任务会强制在新窗口打开 */
    blank?: boolean;
}
/** 配置 */
export interface M78AdminConfig {
    /** 常用功能id列表 */
    collectFunc?: string[];
    /** 黑暗模式 */
    darkMode?: boolean;
    /** 主题色 */
    color?: string;
    /** 次要主题色 */
    subColor?: string;
    /** 自定义logo */
    logo?: string;
    /** 显示在logo下方的名称 */
    name?: string;
    /** 全屏打开所以未明确指定尺寸的窗口 */
    initFull?: boolean;
    /** 12 | 最大窗口数量 */
    maxWindow?: number;
}
export interface M78AdminProps {
    /** 任务配置列表 */
    tasks: TaskOpt;
    /** 应用的AuthPro实例，用于控制菜单等部分的权限 */
    authPro: RCAuthPro;
    /** 配置, 这些配置通常情况是期望被持久化的 */
    config?: M78AdminConfig;
    /** 配置被组件内部改变的回调, 如果忽略此项，则内部改变不会生效 */
    onConfigChange?: (config: Partial<NonNullable<M78AdminProps['config']>>) => void;
    /** 加载状态 */
    loading?: boolean;
    /** 任务打开时触发，返回false可以阻止任务挂载 */
    beforeTaskEach?: (opt: TaskOptItem) => boolean;
    /** 任务栏额外节点 */
    taskBarExtraNode?: React.ReactNode;
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
/** 全局状态 */
export interface TaskState {
    /** 当前任务配置 */
    taskOptions: TaskOpt;
    /** 任务配置去目录的平铺列表 */
    taskOptionsFlat: TaskOptItem[];
    /** 用于快查当前TaskOptItem的map */
    taskOptionsIdMap: {
        [key: string]: TaskOptItem;
    };
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
export declare enum TaskWindowTopBarTypeKeys {
    toggle = "toggle",
    eclipse = "eclipse",
    always = "always"
}
/** 布局组件props */
export interface TaskWindowLayoutProps extends ComponentBasePropsWithAny {
    /** 内容区域, 传入特定类似的子项数组时，会产生不同的行为 */
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
