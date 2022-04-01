import React from 'react';
import { TaskCtx } from '../../types/types';
import { getTaskName, useListenerKeyToUpdate } from '../../task/methods';

interface Props {
  ctx: TaskCtx;
}

/**
 * 动态设置任务名称, 用于TaskOptItem.taskName选项实现
 * */
const TaskNameDynamic = ({ ctx }: Props) => {
  useListenerKeyToUpdate(ctx);

  return <span>{getTaskName(ctx)}</span>;
};

export default TaskNameDynamic;
