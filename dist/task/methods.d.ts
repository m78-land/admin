import { TaskCtx, TaskItemCategory, TaskOpt, TaskOptItem } from '../types';
interface CreateTaskInstanceOpt {
    /** 参数 */
    param?: any;
    /** 如果是子任务，传入父级 */
    parent?: TaskCtx;
}
/**
 * wine关闭时同步关闭已失效的task
 * */
export declare function useSyncWineTask(): void;
/**
 * 在接收到对应ctx的updateByKeyEvent更新通知时更新组件
 * */
export declare function useListenerKeyToUpdate(ctx: TaskCtx): void;
/**
 * 根据beforeTaskEach检测是是否符合条件
 * */
export declare function checkBeforeTaskEach(opt: TaskOptItem): boolean;
/**
 * 根据taskAuth检测是是否符合条件
 * */
export declare function checkTaskAuth(opt: TaskOptItem): boolean;
/**
 * 根据taskAuth检测是是否符合条件
 * */
export declare function checkTaskAuthAndTips(opt: TaskOptItem): boolean;
/**
 * 接收TaskOptItem来创建task实例传入 opt.parent 时，在其内部创建子实例
 * */
export declare function createTaskInstance(taskOpt: TaskOptItem, opt?: CreateTaskInstanceOpt): TaskCtx;
/**
 * 生成TaskCtx的主实例功能
 * 💥 此函数参数中的ctx是未完成状态的ctx，部分功能并不存在
 * */
export declare function createMainTaskCtx(taskOpt: TaskOptItem, ctx: TaskCtx): void;
/**
 * 生成TaskCtx的子实例功能
 * */
export declare function createSubTaskCtx(taskOpt: TaskOptItem, opt: CreateTaskInstanceOpt, ctx: TaskCtx): void;
/**
 * 根据id获取其task配置
 * */
export declare function getTaskOpt(id: string): TaskOptItem;
/**
 * 处理TaskOpt并生成taskOptions/taskOptionsFlat/taskOptionsIdMap
 * */
export declare function taskOptFormat(taskOpt: TaskOpt): {
    taskOptions: TaskOpt;
    taskOptionsFlat: TaskOptItem[];
    taskOptionsIdMap: {
        [key: string]: TaskOptItem;
    };
};
/**
 * 传入id来从收藏功能中将其移除或添加
 * */
export declare function collectHandle(id: string, collectFunc: string[]): void;
/**
 * 根据指定的检测函数从实例列表中批量关闭实例，所有关闭的方法都应该通过此方法实现，因为它会执行必要的前置操作
 * */
export declare function closeTaskList(checker: (ctx: TaskCtx, ind: number) => boolean): void;
/**
 * 根据Ctx中指定的properties对比来移除对应的任务, 支持传入be来决定是相等检测还是非相等检测
 * - 用于对比的properties必须时支持浅对比
 * */
export declare function closeTaskByProp(propName: keyof TaskCtx, prop: any, be?: boolean): void;
/**
 * 关闭指定id的所有任务
 * */
export declare function closeTaskById(id: string): void;
/**
 * 关闭指定key的所有任务
 * */
export declare function closeTaskByKey(key: string): void;
/**
 * 关闭指定key外的所有任务
 * */
export declare function closeOtherTaskByKey(key: string): void;
/**
 * 关闭指定key左侧或右侧的所有任务
 * */
export declare function closeSideTaskByKey(key: string, right?: boolean): void;
/**
 * 关闭指定key右侧的所有任务
 * */
export declare function closeRightTaskByKey(key: string): void;
/**
 * 关闭指定key左侧的所有任务
 * */
export declare function closeLeftTaskByKey(key: string): void;
/**
 * 隐藏指定id的所有任务
 * */
export declare function hideTaskById(id: string): void;
/**
 * 隐藏指定id的所有任务
 * */
export declare function openTaskById(id: string): void;
/** 检测指定key的任务是否可安全的关闭 */
export declare function checkPopCloseable(ctx: TaskCtx): boolean;
/** 关闭提示并返回结果 */
export declare function closeConfirm(ctx: TaskCtx): boolean;
/** 检测是否是非隐藏且有权限的task选项 */
export declare function isPassNode(item: TaskItemCategory | TaskOptItem): boolean;
export {};
