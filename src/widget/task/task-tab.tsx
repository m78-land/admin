import React from 'react';
import {
  CloseOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  SplitCellsOutlined,
  SyncOutlined,
} from 'm78/icon';
import { ContextMenu, ContextMenuItem } from 'm78/context-menu';
import clsx from 'clsx';
import { TaskCtx } from '../../types';
import {
  closeLeftTaskByKey,
  closeOtherTaskByKey,
  closeRightTaskByKey,
  closeTaskByKey,
} from '../../task/methods';
import TaskNameDynamic from './task-name-dynamic';
import taskSeed from '../../task/task-seed';
import IconRender from '../unit/icon-render';

interface Props {
  instance: TaskCtx;
}

/**
 * 任务列表中的任务选项
 * */
const TaskTab = ({ instance }: Props) => {
  const opt = instance.option;

  const activeTaskKey = taskSeed.useState(state => state.activeTaskKey);

  return (
    <ContextMenu
      content={
        <div>
          <ContextMenuItem
            leading={<SyncOutlined />}
            title="刷新窗口"
            onClick={instance.wine.current?.refresh}
          />
          <ContextMenuItem
            leading={<SplitCellsOutlined />}
            title="关闭其他窗口"
            onClick={() => closeOtherTaskByKey(instance.taskKey)}
          />
          <ContextMenuItem
            leading={<ImportOutlined />}
            title="关闭左侧窗口"
            onClick={() => closeLeftTaskByKey(instance.taskKey)}
          />
          <ContextMenuItem
            leading={<ExportOutlined />}
            title="关闭右侧窗口"
            onClick={() => closeRightTaskByKey(instance.taskKey)}
          />
          <ContextMenuItem leading={<DeleteOutlined />} title="关闭" onClick={instance.dispose} />
        </div>
      }
    >
      <span
        className={clsx('m78-admin_task-tab', activeTaskKey === instance.taskKey && '__active')}
        onClick={instance.open}
      >
        <IconRender icon={opt.icon} className="mr-4" />
        <TaskNameDynamic ctx={instance} />
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
