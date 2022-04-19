import React from 'react';
import { ComponentBaseProps } from '@lxjx/utils';
interface Props extends ComponentBaseProps {
    /**
     * 用于渲染的图标，可以是网络图片(暂不支持带查询条件)、可渲染的节点、base64
     * - 图标建议为宽高相等的矢量图形
     * */
    icon: string | React.ReactNode;
    /** 图标尺寸, 默认为16 */
    size?: number;
}
/**
 * 统一icon的渲染, 方便的支持图片、文字、字体icon渲染
 * */
declare const IconRender: {
    ({ icon, size, className, style }: Props): JSX.Element | null;
    large: number;
    regular: number;
};
export default IconRender;
