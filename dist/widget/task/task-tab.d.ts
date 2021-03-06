/// <reference types="react" />
import { TaskCtx } from '../../types/types';
interface Props {
    instance: TaskCtx;
}
/**
 * 任务列表中的任务选项
 * */
declare const TaskTab: ({ instance }: Props) => JSX.Element;
export default TaskTab;
