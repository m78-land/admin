import React from 'react';
import clsx from 'clsx';
import { ComponentBaseProps } from '@lxjx/utils';
import { isStringIcon } from '../../common/common';

interface Props extends ComponentBaseProps {
  /**
   * 用于渲染的图标，可以是网络图片(暂不支持带查询条件)、可渲染的节点、base64
   * - 图标建议为宽高相等的矢量图形
   * */
  icon: string | React.ReactNode;
  /** 图标尺寸, 默认为16 */
  size?: number;
}

const large = 20;
const regular = 16;

/**
 * 统一icon的渲染, 方便的支持图片、文字、字体icon渲染
 * */
const IconRender = ({ icon, size = regular, className, style }: Props) => {
  if (!icon) return null;

  function render() {
    if (isStringIcon(icon)) {
      return <img src={icon} alt="🖼" />;
    }

    return icon;
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size, ...style }}
      className={clsx('m78-admin_icon-render', className)}
    >
      {render()}
    </span>
  );
};

IconRender.large = large;
IconRender.regular = regular;

export default IconRender;
