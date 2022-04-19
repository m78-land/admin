/**
 * 创建task的方法
 * */
import { TaskCtx, TaskOptItem } from '../types/tasks';
interface CreateTaskInstanceOpt {
    /** 参数 */
    param?: any;
    /** 如果是子任务，传入父级 */
    parent?: TaskCtx;
}
/**
 * 接收TaskOptItem来创建task实例传入 opt.parent 时，在其内部创建子实例
 * */
export declare function createTaskInstance(taskOpt: TaskOptItem, opt?: CreateTaskInstanceOpt): TaskCtx;
export {};
