import React from 'react';
import clsx from 'clsx';
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
const FuncBtn = ({ icon, text, extraNode, small, circle, className, style, ...ppp }: Props) => {
  return (
    <div
      className={clsx(
        'm78-admin_func-bar_func',
        className,
        small && '__small',
        circle && '__circle',
      )}
      style={style}
      {...ppp}
    >
      {!circle && (
        <>
          {icon && <div className="m78-admin_func-bar_icon">{icon}</div>}
          <div className="m78-admin_func-bar_text ellipsis-2">{text}</div>
        </>
      )}
      {circle && <div className="ellipsis">{text}</div>}
      {extraNode}
    </div>
  );
};

export default FuncBtn;
