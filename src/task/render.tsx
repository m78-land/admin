import { WineProps } from '@m78/wine/types';
import { PageHeader } from 'm78/page-header';
import { ContextMenu, ContextMenuItem } from 'm78/context-menu';
import { keypressAndClick } from '@m78/wine';
import React from 'react';
import { Divider } from 'm78/layout';
import Crumbs from '../widget/unit/crumbs';
import TaskNameDynamic from '../widget/task/task-name-dynamic';
import { TaskCtx } from '../types';

/**
 * 自定义渲染任务窗口头部
 * */
export const renderBuiltInHeader: NonNullable<WineProps['state']['headerCustomer']> = (
  props,
  instance,
  isFull,
) => {
  const taskOpt = (instance.state as any).taskOption;
  const ctx: TaskCtx = (instance.state as any).ctx;

  return (
    <ContextMenu
      content={
        <div>
          <ContextMenuItem
            title="刷新窗口"
            desc="该窗口下所有任务将会被重置"
            onClick={ctx.wine.current?.refresh}
          />
          <ContextMenuItem title="最小化" onClick={instance.hide} />
          <ContextMenuItem title="最大化" onClick={instance.current?.full} />
          <ContextMenuItem title="关闭" onClick={ctx.dispose} />
        </div>
      }
    >
      <div {...props}>
        <PageHeader
          className="m78-admin_window-header"
          border
          title={
            <>
              <span className="vm">
                <span className="m78-admin_window-header_icon">{taskOpt.icon}</span>{' '}
                <TaskNameDynamic ctx={ctx} />
              </span>

              <Divider vertical />

              <Crumbs ctx={ctx} />
            </>
          }
          backIcon={null}
          actions={
            <div className="m78-wine_header-actions" onMouseDown={e => e.stopPropagation()}>
              <span tabIndex={1} className="m78-wine_btn" {...keypressAndClick(instance.hide)}>
                <span className="m78-wine_hide-btn" />
              </span>
              {isFull && (
                <span
                  tabIndex={1}
                  className="m78-wine_btn"
                  {...keypressAndClick(instance.current!.resize)}
                >
                  <span className="m78-wine_resize-btn" />
                </span>
              )}
              {!isFull && (
                <span
                  tabIndex={1}
                  className="m78-wine_btn"
                  {...keypressAndClick(instance.current!.full)}
                >
                  <span className="m78-wine_max-btn" />
                </span>
              )}
              <span
                tabIndex={1}
                className="m78-wine_btn __warning"
                {...keypressAndClick(ctx.dispose)}
              >
                <span className="m78-wine_dispose-btn" />
              </span>
            </div>
          }
        />
      </div>
    </ContextMenu>
  );
};
