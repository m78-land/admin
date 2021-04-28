import React from 'react';
import { TaskCtx } from '../../types';
import { useListenerKeyToUpdate } from '../../task/methods';

interface Props {
  ctx: TaskCtx;
}

/**
 * 动态设置任务名称, 用于TaskOptItem.taskName选项实现
 * */
const TaskNameDynamic = ({ ctx }: Props) => {
  useListenerKeyToUpdate(ctx);

  const opt = ctx.option;
  return <span>{opt.taskName ? opt.taskName(ctx) : opt.name}</span>;
};

export default TaskNameDynamic;
