import { keypressAndClick, WineState } from '@m78/wine';
import { ContextMenu } from 'm78/context-menu';
import { ListView, ListViewItem } from 'm78/list-view';
import { Size } from 'm78/common';
import { DeleteOutlined, FullscreenExitOutlined, FullscreenOutlined, SyncOutlined } from 'm78/icon';
import { PageHeader } from 'm78/page-header';
import { Divider, Row } from 'm78/layout';
import React from 'react';
import IconRender from '../widget/unit/icon-render';
import TaskNameDynamic from '../widget/task/task-name-dynamic';
import Crumbs from '../widget/unit/crumbs';
import { TaskCtx } from '../types/tasks';

/**
 * 自定义任务窗口头部渲染
 * */
export const taskWindowHeaderCustomer: NonNullable<WineState['headerCustomer']> = (
  props,
  state,
  instance,
  isFull,
) => {
  const taskOpt = (state as any).taskOption;
  const ctx: TaskCtx = (state as any).ctx;

  return (
    <ContextMenu
      content={
        <ListView size={Size.small}>
          <ListViewItem
            leading={<SyncOutlined />}
            crossAlign="start"
            title={<span className="color-red">刷新窗口</span>}
            desc="该窗口下所有任务将会被重置"
            onClick={instance.refresh}
          />
          <ListViewItem leading={<FullscreenExitOutlined />} title="最小化" onClick={ctx.hide} />
          <ListViewItem leading={<FullscreenOutlined />} title="最大化" onClick={instance.full} />
          <ListViewItem leading={<DeleteOutlined />} title="关闭" onClick={ctx.dispose} />
        </ListView>
      }
    >
      <div {...props}>
        <PageHeader
          className="m78-admin_window-header"
          title={
            <>
              <Row crossAlign="center">
                <span className="m78-admin_window-header_icon">
                  <IconRender className="mr-4" icon={taskOpt.icon} size={IconRender.large} />
                </span>
                <TaskNameDynamic ctx={ctx} />
              </Row>

              <Divider vertical />

              <Crumbs ctx={ctx} />
            </>
          }
          backIcon={null}
          actions={
            <div className="m78-wine_header-actions" onMouseDown={e => e.stopPropagation()}>
              <span tabIndex={1} className="m78-wine_btn" {...keypressAndClick(ctx.hide)}>
                <span className="m78-wine_hide-btn" />
              </span>
              {isFull && (
                <span tabIndex={1} className="m78-wine_btn" {...keypressAndClick(instance.resize)}>
                  <span className="m78-wine_resize-btn" />
                </span>
              )}
              {!isFull && (
                <span tabIndex={1} className="m78-wine_btn" {...keypressAndClick(instance.full)}>
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
