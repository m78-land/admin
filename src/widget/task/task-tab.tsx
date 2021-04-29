import React from 'react';
import { CloseOutlined } from 'm78/icon';
import ContextMenu, { ContextMenuItem } from 'm78/context-menu';
import { TaskCtx } from '../../types';
import {
  closeLeftTaskByKey,
  closeOtherTaskByKey,
  closeRightTaskByKey,
  closeTaskByKey,
} from '../../task/methods';
import TaskNameDynamic from './task-name-dynamic';

interface Props {
  instance: TaskCtx;
}

/**
 * 任务列表中的任务选项
 * */
const TaskTab = ({ instance }: Props) => {
  const opt = instance.option;

  return (
    <ContextMenu
      content={
        <div>
          <ContextMenuItem title="刷新" onClick={instance.refresh} />
          <ContextMenuItem
            title="关闭其他窗口"
            onClick={() => closeOtherTaskByKey(instance.taskKey)}
          />
          <ContextMenuItem
            title="关闭左侧窗口"
            onClick={() => closeLeftTaskByKey(instance.taskKey)}
          />
          <ContextMenuItem
            title="关闭右侧窗口"
            onClick={() => closeRightTaskByKey(instance.taskKey)}
          />
          <ContextMenuItem title="关闭" onClick={instance.dispose} />
        </div>
      }
    >
      <span className="m78-admin_task-tab" onClick={instance.open}>
        {opt.icon} <TaskNameDynamic ctx={instance} />
        <span
          className="m78-admin_effect ml-4"
          title="关闭窗口"
          onClick={e => {
            e.stopPropagation();
            closeTaskByKey(instance.taskKey);
          }}
        >
          <CloseOutlined className="m78-close-icon color-second" />
        </span>
      </span>
    </ContextMenu>
  );
};

export default TaskTab;