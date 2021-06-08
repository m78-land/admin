import React, { useState } from 'react';
import { TaskCtx } from '../types';
import { refreshEvent } from './event';

interface Props {
  children: React.ReactElement<TaskCtx>;
}

/**
 * 包裹所有渲染的任务组件(子实例和父实例), 用于执行渲染控制, 此组件用于为任务组件添加统一的渲染控制
 * 其子组件必须是接收TaskCtx的任务组件
 * */
const TaskComponentHandle = ({ children }: Props) => {
  const props = children.props;

  // 控制任务组件刷新
  const [refreshKey, setKey] = useState(0);

  refreshEvent.useEvent(key => {
    if (key === props.taskKey) setKey(prev => prev + 1);
  });

  return React.cloneElement(children, { key: refreshKey, ...props });
};

export default TaskComponentHandle;
