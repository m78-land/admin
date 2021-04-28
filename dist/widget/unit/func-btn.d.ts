import React from 'react';
import { ComponentBaseProps } from 'm78/types';
interface Props extends ComponentBaseProps {
    /** 图标 */
    icon?: React.ReactNode;
    /** 文本 */
    text: React.ReactNode;
    /** 小型按钮 */
    small?: boolean;
    /** 圆形按钮 */
    circle?: boolean;
    /** 渲染到内部的额外节点 */
    extraNode?: React.ReactNode;
    /** 其他透传到根节点的属性 */
    [key: string]: any;
}
/**
 * 内部使用的功能按钮、为了方便同一样式，将其暴露出来
 * */
declare const FuncBtn: ({ icon, text, extraNode, small, circle, className, style, ...ppp }: Props) => JSX.Element;
export default FuncBtn;
