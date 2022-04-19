import React from 'react';
import { PermissionProTplList } from 'm78/permission';
import { TaskCtx } from '../types/types';
interface Props {
    taskKey: string;
    permissionKeys?: PermissionProTplList;
    children: () => React.ReactElement<TaskCtx>;
}
/**
 * 包裹所有渲染的任务组件(子实例和父实例), 用于为任务组件添加统一的渲染控制
 * 其子组件必须是接收TaskCtx的任务组件
 * */
declare const TaskComponentHandle: ({ children, taskKey, permissionKeys }: Props) => JSX.Element;
export default TaskComponentHandle;
