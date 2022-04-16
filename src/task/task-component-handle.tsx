import React, { useState } from 'react';
import { PermissionProTplList } from 'm78/permission';
import { TaskCtx } from '../types/types';
import { refreshEvent } from './event';
import taskSeed from './task-seed';

interface Props {
  taskKey: string;
  permissionKeys?: PermissionProTplList;
  children: () => React.ReactElement<TaskCtx>;
}

/**
 * 包裹所有渲染的任务组件(子实例和父实例), 用于为任务组件添加统一的渲染控制
 * 其子组件必须是接收TaskCtx的任务组件
 * */
const TaskComponentHandle = ({ children, taskKey, permissionKeys }: Props) => {
  const PermissionPro = taskSeed.useState(state => state.adminProps.permission);

  // 控制任务组件刷新
  const [refreshKey, setKey] = useState(0);

  refreshEvent.useEvent(key => {
    if (key === taskKey) setKey(prev => prev + 1);
  });

  function render() {
    const child = children();
    const props = child.props;

    return React.cloneElement(child, { key: refreshKey, ...props });
  }

  if (!permissionKeys?.length) return render();

  return <PermissionPro keys={permissionKeys}>{render()}</PermissionPro>;
};

export default TaskComponentHandle;
