import { AnyFunction } from '@lxjx/utils';
import { TaskCtx } from '../types';
interface Props {
    /** 待渲染的任务组件 */
    Component: AnyFunction;
    /** 该任务组件所在的上下文实例 */
    ctx: TaskCtx;
}
/**
 * 顶层任务窗口页面的包裹组件，用于控制入参、更新参数、实现嵌套窗口等
 * 💥 此组件接收的ctx并非完整的ctx
 * */
declare const TaskWindowWrap: ({ ctx, Component }: Props) => JSX.Element;
export default TaskWindowWrap;
