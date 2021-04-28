import React from 'react';
import { AnyFunction, isNumber } from '@lxjx/utils';
import clsx from 'clsx';
import { TaskCtx } from '../types';
import { useListenerKeyToUpdate } from './methods';
import linkContext from './link-context';

interface Props {
  /** 待渲染的任务组件 */
  Component: AnyFunction;
  /** 该任务组件所在的上下文实例 */
  ctx: TaskCtx;
}

const LinkProvider = linkContext.Provider;

/**
 * 每个任务窗口页面的包裹组件，用于控制入参、更新参数、嵌套窗口等
 * 💥 此组件接收的ctx并非完整的ctx
 * */
const TaskWindowWrap = ({ ctx, Component }: Props) => {
  useListenerKeyToUpdate(ctx);

  const hasChild = !!ctx.children.length;
  const hasIndex = isNumber(ctx.currentChildIndex);

  return (
    <LinkProvider value={{ parent: ctx }}>
      <div className={clsx({ hide: hasIndex })}>
        <Component {...ctx} />
      </div>
      {hasChild &&
        ctx.children.map((subTask, ind) => {
          const SubComponent = subTask.option.component;

          return (
            <div key={subTask.taskKey} className={clsx({ hide: ctx.currentChildIndex !== ind })}>
              <SubComponent {...subTask} />
            </div>
          );
        })}
    </LinkProvider>
  );
};

export default TaskWindowWrap;
