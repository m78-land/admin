/// <reference types="react" />
import { M78AdminConfig, TaskCtx, TaskOptItem } from '../../types/types';
interface Props {
    /** 改任务所有已打开窗口的数组 */
    tasks: TaskCtx[];
    /** 当前任务 */
    taskOptItem: TaskOptItem;
    /** 配置 */
    config: M78AdminConfig | undefined;
    /** 是否收藏 */
    isCollectd: boolean;
}
/** 任务入口的上下文菜单主内容 */
declare const FuncContextMenuBuilder: ({ tasks, taskOptItem, config, isCollectd }: Props) => JSX.Element;
export default FuncContextMenuBuilder;
