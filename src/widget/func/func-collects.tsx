import React from 'react';
import { DND, DNDContext, DragFullEvent } from 'm78/dnd';
import clsx from 'clsx';
import { useFn } from '@lxjx/hooks';
import taskSeed from '../../task/task-seed';
import taskGlobal from '../../task/task-global';
import { configGetter, emitConfig, useSubscribePermissionChange } from '../../common/common';
import { isPassNode, pushTaskOrOpenLastTask } from '../../task/methods';
import FuncItem from '../unit/func-item';
import { renderFuncActions } from './renders';

/**
 * 渲染的所有收藏功能列表
 * */
const FuncCollects = () => {
  const taskOptionsIdMap = taskSeed.useState(state => state.taskOptionsIdMap);

  // 任务列表变更时触发render
  taskSeed.useState(state => state.taskList);

  const permissionPro = taskSeed.useState(state => state.adminProps.permission);
  const config = taskSeed.useState(configGetter);
  const collectFunc = config?.collectFunc || [];

  useSubscribePermissionChange(permissionPro.permission.seed);

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

          const tasks = taskGlobal.get({ id });
          const isCollectd = collectFunc.includes(item.id);

          return (
            <DND key={item.id} data={item.id} enableDrop>
              {({ innerRef, status, enables }) => (
                <FuncItem
                  innerRef={innerRef}
                  icon={item.icon || <span className="m78-dot __small" />}
                  title={item.name}
                  trailing={renderFuncActions(tasks, isCollectd, item, config)}
                  className={clsx({
                    __active: status.dragOver,
                    __disabled: !enables.enable || status.dragging,
                  })}
                  onClick={() => pushTaskOrOpenLastTask(id)}
                />
              )}
            </DND>
          );
        })}
      </div>
    </DNDContext>
  );
};

export default FuncCollects;
