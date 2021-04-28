import React, { useContext } from 'react';
import { useFn } from '@lxjx/hooks';
import clsx from 'clsx';
import { TaskLinkProps } from '../types';
import linkContext from './link-context';
import task from './task';

/**
 * 开启任务的快捷方式，其底层是ctx.push/ctx.replace等方法
 * - 如果组件处理一个任务窗口实例内部，会在该窗口打开子任务，如果在实例外则会通过新任务窗口打开任务
 * - 根据子项类型不同会有不同的行为:
 *    * 子项为string时，会渲染一个内联节点，并且会透接收到的props(style/className等)
 *    * 子项为ReactElement时，其必须是能接收onClick事件的元素
 * */
const Link = ({ children, replace, id, param, blank, className, style, ...ppp }: TaskLinkProps) => {
  const ctx = useContext(linkContext);

  const openHandle = useFn(() => {
    if (blank) {
      replace ? task.replace(id, param) : task.push(id, param);
      return;
    }

    if (replace) {
      ctx.parent ? ctx.parent.replace(id, param) : task.replace(id, param);
      return;
    }

    ctx.parent ? ctx.parent.push(id, param) : task.push(id, param);
  });

  if (typeof children === 'string') {
    return (
      <span
        {...ppp}
        className={clsx('m78-admin_link', className)}
        style={style}
        onClick={openHandle}
      >
        {children}
      </span>
    );
  }

  return React.cloneElement(children, {
    onClick: openHandle,
  });
};

export default Link;
