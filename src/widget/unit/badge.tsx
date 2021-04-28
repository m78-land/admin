import React from 'react';
import clsx from 'clsx';
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
const Badge: React.FC<Props> = ({ children, out, color }) => {
  return (
    <span className={clsx('m78-admin_badge', out && '__out', color && `__${color}`)}>
      {children}
    </span>
  );
};

export default Badge;
