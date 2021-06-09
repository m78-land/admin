/// <reference types="react" />
import { TaskCtx } from '../../types';
interface Props {
    ctx: TaskCtx;
}
/**
 * 动态设置任务名称, 用于TaskOptItem.taskName选项实现
 * */
declare const TaskNameDynamic: ({ ctx }: Props) => JSX.Element;
export default TaskNameDynamic;
