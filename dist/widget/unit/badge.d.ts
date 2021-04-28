import React from 'react';
import { ButtonProps } from 'm78/button';
interface Props {
    /** 是佛显示在元素外 */
    out?: boolean;
    /** 状态色 */
    color?: ButtonProps['color'];
}
/**
 * 徽章角标的临时实现、等m78库中添加后进行转移
 * */
declare const Badge: React.FC<Props>;
export default Badge;
