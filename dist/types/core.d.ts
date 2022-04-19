import React from 'react';
import { RCPermissionPro } from 'm78/permission';
import { TaskCtxList, TaskOpt, TaskOptItem } from './tasks';
/** 配置 */
export interface M78AdminConfig {
    /** 常用功能id列表, 显示在左侧收藏区域 */
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
    /** 全屏打开所所有明确指定尺寸的窗口 */
    initFull?: boolean;
    /** 使菜单悬浮 */
    funcBarFloat?: boolean;
    /** 菜单的收藏部分是否展开 */
    funcBarCollectToggle?: boolean;
    /** 菜单的功能菜单部分是否展开 */
    funcBarFuncToggle?: boolean;
    /** 12 | 最大窗口数量 */
    maxWindow?: number;
}
export interface M78AdminProps {
    /** 任务配置列表 */
    tasks: TaskOpt;
    /** 应用的PermissionPro实例，用于控制菜单和任务的权限 */
    permission: RCPermissionPro;
    /** 配置, 这些配置通常情况是期望被持久化的, 所以放在单独的属性中方便统一管理, 可以通过onConfigChange订阅变更并选择保存到接口或本地缓存 */
    config?: M78AdminConfig;
    /** 配置被组件内部改变的回调, 如果忽略此项，则内部改变不会生效 */
    onConfigChange?: (config: Partial<M78AdminConfig>) => void;
    /** 加载状态 */
    loading?: boolean;
    /** 任务打开时触发，返回false可以阻止任务挂载 */
    beforeTaskEach?: (opt: TaskOptItem) => boolean;
    /** 任务栏额外节点 */
    taskBarExtra?: React.ReactNode;
    /** 任务栏的前部额外节点 */
    taskBarLeadingExtra?: React.ReactNode;
    /** 功能栏额外节点 */
    funcBarExtra?: React.ReactNode;
    /** 桌面显示的内容 */
    desktop?: React.ReactNode;
    /** 桌面底部的简要介绍，默认显示 powerBy 文本 */
    footer?: React.ReactNode;
    /** 使用自定义的内容来替换框架渲染主体, 可用来渲染骨架屏或<Login />组件等 */
    body?: React.ReactNode;
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
    /** 所有已打开的任务实例(主任务) */
    taskList: TaskCtxList;
    /** 当前活动任务的key */
    activeTaskKey?: string;
    /** 接收的AdminProps */
    adminProps: M78AdminProps;
    /** 内部的菜单浮动控制状态, 和config.funcBarFloat共同控制菜单的浮动状态, 但其拥有更高的控制权限 */
    funcBarFloat?: boolean;
}
/** 用于useWillPop的元数据 */
export interface TaskWillPopMeta {
    [key: string]: {
        when: boolean | (() => boolean);
    };
}
