import React from 'react';
import { ComponentBasePropsWithAny } from '@lxjx/utils';
import { useScroll } from '@lxjx/hooks';
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
/** 布局块props */
export interface WindowLayoutSectionProps extends ComponentBasePropsWithAny {
    /** 当前块的标题, 此项的值不能与其他WindowLayoutSession的相同 */
    label: string;
    /** 内容 */
    children?: React.ReactNode;
    /** 当前块的描述 */
    desc?: string;
}
