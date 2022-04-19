/** 主窗口区域的偏移 */
import { TaskWillPopMeta } from '../types/types';
/** 窗口层级, 仅高于常规内容层即可 */
export declare const WINDOW_Z_INDEX = 10;
/** 功能菜单宽度 */
export declare const FUNC_BAR_WIDTH = 200;
/** 主窗口区域的偏移, 此对象可以动态更改值，用于调整窗口显示区域 */
export declare const WINE_OFFSET: {
    left: number;
    top: number;
    right: number;
};
/** 记录useWillPop的执行注册信息，用于任务关闭时进行检测 */
export declare const WILL_POP_MAP: TaskWillPopMeta;
