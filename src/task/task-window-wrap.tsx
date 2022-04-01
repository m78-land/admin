import React from 'react';
import { AnyFunction, isNumber } from '@lxjx/utils';
import clsx from 'clsx';
import { Spin } from 'm78/spin';
import { MediaQueryContext } from 'm78/layout';
import { TaskCtx } from '../types/types';
import { useListenerKeyToUpdate } from './methods';
import linkContext from './link-context';
import TaskComponentHandle from './task-component-handle';

interface Props {
  /** 待渲染的任务组件 */
  Component: AnyFunction;
  /** 该任务组件所在的上下文实例 */
  ctx: TaskCtx;
}

const LinkProvider = linkContext.Provider;

const loadingNode = <Spin text="正在加载资源" className="m78-admin_fixed-center-text" />;

/**
 * 顶层任务窗口页面的包裹组件，用于控制入参、更新参数、实现嵌套窗口等
 * 💥 此组件接收的ctx并非完整的ctx
 * */
const TaskWindowWrap = ({ ctx, Component }: Props) => {
  useListenerKeyToUpdate(ctx);

  const hasChild = !!ctx.children.length;
  const hasIndex = isNumber(ctx.currentChildIndex);

  return (
    <MediaQueryContext>
      <LinkProvider value={{ parent: ctx }}>
        <div className={clsx({ hide: hasIndex })}>
          <React.Suspense fallback={loadingNode}>
            <TaskComponentHandle>
              <Component {...ctx} />
            </TaskComponentHandle>
          </React.Suspense>
        </div>
        {hasChild &&
          ctx.children.map((subTask, ind) => {
            const SubComponent = subTask.option.component;

            return (
              <div key={subTask.taskKey} className={clsx({ hide: ctx.currentChildIndex !== ind })}>
                <React.Suspense fallback={loadingNode}>
                  <TaskComponentHandle>
                    <SubComponent {...subTask} />
                  </TaskComponentHandle>
                </React.Suspense>
              </div>
            );
          })}
      </LinkProvider>
    </MediaQueryContext>
  );
};

export default TaskWindowWrap;
