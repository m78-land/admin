import React from 'react';
import { Scroller } from 'm78/scroller';
import { ContextMenu, ContextMenuItem } from 'm78/context-menu';
import { Divider } from 'm78/layout';
import { DND, DNDContext, DragFullEvent } from 'm78/dnd';
import clsx from 'clsx';
import { useFn } from '@lxjx/hooks';
import taskSeed from '../../task/task-seed';
import task from '../../task/task';
import { configGetter, emitConfig, useSubscribeAuthChange } from '../../common/common';
import { Badge, FuncBtn } from '../../index';
import {
  closeTaskById,
  collectHandle,
  hideTaskById,
  isPassNode,
  openTaskById,
} from '../../task/methods';

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
      <Scroller className="m78-admin_func-bar_main" scrollFlag hideScrollbar>
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
                  key={item.id}
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
                      <ContextMenuItem title="打开新窗口" onClick={() => task.push(item.id)} />
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
                  <div ref={innerRef} className="m78-dnd-box-anime">
                    <FuncBtn
                      className={clsx('m78-dnd-box-anime_main', {
                        // 禁用、拖动到中间的状态
                        __active: status.dragOver,
                        __disabled: !enables.enable || status.dragging,
                        __left: status.dragLeft,
                        __top: status.dragTop,
                        __right: status.dragRight,
                        __bottom: status.dragBottom,
                      })}
                      text={item.name}
                      icon={item.icon}
                      onClick={openTask}
                      extraNode={length > 0 && <Badge>{length > 1 ? length : undefined}</Badge>}
                    />
                  </div>
                </ContextMenu>
              )}
            </DND>
          );
        })}
      </Scroller>
    </DNDContext>
  );
};

export default FuncCollects;
