import { TaskCtx, TaskItemCategory, TaskOpt, TaskOptItem } from '../types/types';
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
 * 根据id获取其task配置
 * */
export declare function getTaskOpt(id: string): TaskOptItem;
/**
 * 处理TaskOpt并生成taskOptions/taskOptionsFlat/taskOptionsIdMap
 * - 每个节点都会被附加私有属性__parents?，表示该节点的所有父级按顺序组成的数组
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
 * 打开指定id的所有任务
 * */
export declare function openTaskById(id: string): void;
/**
 * 打开指定id的任务, 如果该任务已存在实例，则打开其最后一个实例
 * */
export declare function pushTaskOrOpenLastTask(id: string): void;
/** 检测指定key的任务是否可安全的关闭 */
export declare function checkPopCloseable(ctx: TaskCtx): boolean;
/** 关闭提示并返回结果 */
export declare function closeConfirm(ctx: TaskCtx | TaskCtx[], cb: Function): void;
export declare function isTaskOptItem(arg: any): arg is TaskOptItem;
export declare function isTaskItemCategory(arg: any): arg is TaskItemCategory;
/**
 * 检测选项是是否符满足权限
 * */
export declare function checkTaskAuth(opt: TaskOptItem | TaskItemCategory): boolean;
/**
 * 根据taskAuth检测是是否符合条件， 无权限是触发提示
 * */
export declare function checkTaskAuthAndTips(opt: TaskOptItem): boolean;
/** 检测是否是非隐藏且有权限的task选项 */
export declare function isPassNode(item: TaskItemCategory | TaskOptItem): item is TaskOptItem;
/** 检测是否是有权访问的节点或目录 */
export declare function isPassNodeOrCategory(item: TaskItemCategory | TaskOptItem): boolean;
/** 依次从task的taskName()和name获取窗口名 */
export declare function getTaskName(ctx: TaskCtx): string;
