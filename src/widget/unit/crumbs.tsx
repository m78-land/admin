import React from 'react';
import { CloseOutlined, DeleteOutlined, SyncOutlined } from 'm78/icon';
import clsx from 'clsx';
import { isNumber } from '@lxjx/utils';
import { Scroller } from 'm78/scroller';
import { Direction, Size } from 'm78/common';
import { ContextMenu } from 'm78/context-menu';
import { ListView, ListViewItem } from 'm78/list-view';
import { TaskCtx } from '../../types/types';
import { updateByKeyEvent } from '../../task/event';
import { useListenerKeyToUpdate } from '../../task/methods';

interface Props {
  ctx: TaskCtx;
}

/**
 * 控制子任务的列表显示、操作等
 * */
const Crumbs = ({ ctx }: Props) => {
  useListenerKeyToUpdate(ctx);

  /** 选中任务/子任务 */
  function changeTaskHandle(ind?: number) {
    if (ctx.currentChildIndex === ind) return;
    ctx.currentChildIndex = ind;
    updateByKeyEvent.emit(ctx.taskKey);
  }

  const childLen = ctx.children.length;
  const childInd = ctx.currentChildIndex;

  if (!childLen) return null;

  function renderWithMenu(el: React.ReactElement, currentCtx: TaskCtx) {
    return (
      <ContextMenu
        content={
          <ListView size={Size.small}>
            <ListViewItem
              leading={<SyncOutlined />}
              title="刷新任务"
              onClick={currentCtx.refresh}
            />
            {currentCtx !== ctx && (
              <ListViewItem
                leading={<DeleteOutlined />}
                title="关闭"
                onClick={currentCtx.dispose}
              />
            )}
          </ListView>
        }
      >
        {el}
      </ContextMenu>
    );
  }

  return (
    <Scroller
      scrollFlag
      hideScrollbar
      direction={Direction.horizontal}
      className="m78-admin_crumbs"
    >
      {renderWithMenu(
        <span
          className={clsx('m78-admin_crumbs-item ellipsis m78-admin_effect pr-8', {
            __active: !isNumber(childInd),
          })}
          onClick={() => changeTaskHandle()}
          onContextMenu={e => e.preventDefault()}
        >
          {ctx.option.name}
        </span>,
        ctx,
      )}
      <span className="color-disabled mlr-8">/</span>

      {ctx.children.map((item, index) => (
        <React.Fragment key={item.taskKey}>
          {renderWithMenu(
            <span
              className={clsx('m78-admin_crumbs-item ellipsis m78-admin_effect', {
                __active: index === childInd,
              })}
              onClick={() => changeTaskHandle(index)}
              onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {item.option.name}
              <span
                className="m78-admin_crumbs-close m78-admin_effect ml-4"
                title="关闭"
                onClick={e => {
                  e.stopPropagation();
                  item.dispose();
                }}
              >
                <CloseOutlined className="m78-close-icon color-disabled fs" />
              </span>
            </span>,
            item,
          )}
          {index !== childLen - 1 && <span className="color-disabled mlr-8">/</span>}
        </React.Fragment>
      ))}
    </Scroller>
  );
};

export default Crumbs;
