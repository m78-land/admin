import React from 'react';
import { TaskCtx } from '../types';
interface Props {
    children: React.ReactElement<TaskCtx>;
}
/**
 * 包裹所有渲染的任务组件(子实例和父实例), 用于执行渲染控制, 此组件用于为任务组件添加统一的渲染控制
 * 其子组件必须是接收TaskCtx的任务组件
 * */
declare const TaskComponentHandle: ({ children }: Props) => React.ReactElement<TaskCtx<any>, string | React.JSXElementConstructor<any>>;
export default TaskComponentHandle;
