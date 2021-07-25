import React from 'react';
import { ContextMenu, ContextMenuItem } from 'm78/context-menu';
import { Divider } from 'm78/layout';
import { DND, DNDContext, DragFullEvent } from 'm78/dnd';
import clsx from 'clsx';
import { useFn } from '@lxjx/hooks';
import taskSeed from '../../task/task-seed';
import task from '../../task/task';
import { configGetter, emitConfig, useSubscribeAuthChange } from '../../common/common';
import { Badge } from '../../index';
import {
  closeTaskById,
  collectHandle,
  hideTaskById,
  isPassNode,
  openTaskById,
} from '../../task/methods';
import FuncItem from '../unit/func-item';

/**
 * 渲染的所有收藏功能列表
 * */
const FuncCollects = () => {
  const map = taskSeed.useState(state => state.taskOptionsIdMap);
  const taskList = taskSeed.useState(state => state.taskList);

  const AuthPro = taskSeed.useState(state => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const collect = config?.collectFunc || [];

  useSubscribeAuthChange(AuthPro.authInstance.seed);

  /** 拖动结束 */
  const acceptHandle = useFn((e: DragFullEvent<string>) => {
    const list = [...collect];

    const target = e.target.data; // 放置目标
    const source = e.source.data; // 拖动目标

    const sInd = list.indexOf(source);
    const tInd = list.indexOf(target);

    if (e.status.dragOver) {
      list.splice(tInd, 0, ...list.splice(sInd, 1));

      emitConfig({
        collectFunc: [...list],
      });
    }
  });

  return (
    <DNDContext onAccept={acceptHandle}>
      <div className="m78-admin_func-bar_main">
        {collect.map(id => {
          const item = map[id];

          if (!isPassNode(item)) return null;

          const tasks = taskList.filter(i => i.id === id);
          const length = tasks.length;

          const openTask = () => {
            if (!length) {
              task.push(item.id);
              return;
            }
            tasks[length - 1].open();
          };

          return (
            <DND key={item.id} data={item.id} enableDrop>
              {({ innerRef, status, enables }) => (
                <ContextMenu
                  content={
                    <div>
                      {length > 0 && (
                        <>
                          {tasks.map((i, ind) => (
                            <ContextMenuItem
                              key={i.taskKey}
                              title={`置顶任务${ind + 1}`}
                              onClick={i.open}
                            />
                          ))}
                          <Divider />
                        </>
                      )}
                      <ContextMenuItem
                        title={item.singleton ? '打开窗口' : '打开新窗口'}
                        onClick={() => task.push(item.id)}
                      />
                      <ContextMenuItem
                        title="从常用功能中移除"
                        onClick={() => collectHandle(item.id, config?.collectFunc || [])}
                      />
                      {length > 0 && (
                        <>
                          <ContextMenuItem
                            title="隐藏全部窗口"
                            onClick={() => hideTaskById(item.id)}
                          />
                          <ContextMenuItem
                            title="打开全部窗口"
                            onClick={() => openTaskById(item.id)}
                          />
                          <ContextMenuItem
                            title="关闭全部窗口"
                            onClick={() => closeTaskById(item.id)}
                          />
                        </>
                      )}
                    </div>
                  }
                >
                  <FuncItem
                    innerRef={innerRef}
                    icon={item.icon}
                    title={item.name}
                    trailing={length > 0 && <Badge>{length > 1 ? length : undefined}</Badge>}
                    className={clsx({
                      __active: status.dragOver,
                      __disabled: !enables.enable || status.dragging,
                    })}
                    onClick={openTask}
                  />
                </ContextMenu>
              )}
            </DND>
          );
        })}
      </div>
    </DNDContext>
  );
};

export default FuncCollects;
