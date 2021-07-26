import React from 'react';
import { ContextMenu } from 'm78/context-menu';
import { DND, DNDContext, DragFullEvent } from 'm78/dnd';
import clsx from 'clsx';
import { useFn } from '@lxjx/hooks';
import taskSeed from '../../task/task-seed';
import task from '../../task/task';
import { configGetter, emitConfig, useSubscribeAuthChange } from '../../common/common';
import { isPassNode, pushTaskOrOpenLastTask } from '../../task/methods';
import FuncItem from '../unit/func-item';
import FuncContextMenuBuilder from '../unit/func-context-menu-builder';
import FuncStatusFlagBuilder from '../unit/func-status-flag-builder';

/**
 * 渲染的所有收藏功能列表
 * */
const FuncCollects = () => {
  const taskOptionsIdMap = taskSeed.useState(state => state.taskOptionsIdMap);

  // 任务列表变更时触发render
  taskSeed.useState(state => state.taskList);

  const AuthPro = taskSeed.useState(state => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const collectFunc = config?.collectFunc || [];

  useSubscribeAuthChange(AuthPro.authInstance.seed);

  /** 拖动结束 */
  const acceptHandle = useFn((e: DragFullEvent<string>) => {
    const list = [...collectFunc];

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
        {collectFunc.map(id => {
          const item = taskOptionsIdMap[id];

          if (!isPassNode(item)) return null;

          const tasks = task.get({ id });
          const length = tasks.length;
          const isCollectd = collectFunc.includes(item.id);

          return (
            <DND key={item.id} data={item.id} enableDrop>
              {({ innerRef, status, enables }) => (
                <ContextMenu
                  content={
                    <FuncContextMenuBuilder
                      tasks={tasks}
                      taskOptItem={item}
                      config={config}
                      isCollectd={isCollectd}
                    />
                  }
                >
                  <FuncItem
                    innerRef={innerRef}
                    icon={item.icon}
                    title={item.name}
                    trailing={<FuncStatusFlagBuilder length={length} />}
                    className={clsx({
                      __active: status.dragOver,
                      __disabled: !enables.enable || status.dragging,
                    })}
                    onClick={() => pushTaskOrOpenLastTask(id)}
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
