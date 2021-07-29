import React from 'react';
import { ContextMenu, ContextMenuItem, ContextMenuProps } from 'm78/context-menu';
import { PopperPropsCustom } from 'm78/popper';
import { isFunction } from '@lxjx/utils';
import { WineProps } from '@m78/wine/types';
import { DeleteOutlined, FullscreenExitOutlined, FullscreenOutlined, SyncOutlined } from 'm78/icon';
import { PageHeader } from 'm78/page-header';
import { Divider } from 'm78/layout';
import { keypressAndClick } from '@m78/wine';
import TaskNameDynamic from '../widget/task/task-name-dynamic';
import { TaskCtx } from '../types';
import Crumbs from '../widget/unit/crumbs';
import IconRender from '../widget/unit/icon-render';

/**
 * 对标contextMenu的popper样式，其通过点击触发
 * */
export function actionPopperCustomer(props: PopperPropsCustom) {
  const contRender = props.content as ContextMenuProps['content'];

  return (
    <div className="m78-context-menu" onClick={() => props.setShow(false)}>
      {isFunction(contRender) ? contRender(props) : contRender}
    </div>
  );
}

/**
 * 自定义任务窗口头部渲染
 * */
export const taskWindowHeaderCustomer: NonNullable<WineProps['state']['headerCustomer']> = (
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
            leading={<SyncOutlined />}
            title={<span className="color-red">刷新窗口</span>}
            desc="该窗口下所有任务将会被重置"
            onClick={ctx.wine.current?.refresh}
          />
          <ContextMenuItem
            leading={<FullscreenExitOutlined />}
            title="最小化"
            onClick={instance.hide}
          />
          <ContextMenuItem
            leading={<FullscreenOutlined />}
            title="最大化"
            onClick={instance.current?.full}
          />
          <ContextMenuItem leading={<DeleteOutlined />} title="关闭" onClick={ctx.dispose} />
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
                <span className="m78-admin_window-header_icon">
                  <IconRender className="mr-4" icon={taskOpt.icon} size={IconRender.large} />
                </span>
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
