/** 主窗口区域的偏移 */
import { TaskWillPopMeta } from '../types/types';

/** 窗口层级, 仅高于常规内容层即可 */
export const WINDOW_Z_INDEX = 100;

/** 功能菜单宽度 */
export const FUNC_BAR_WIDTH = 200;

/** 主窗口区域的偏移, 此对象可以动态更改值，用于调整窗口显示区域 */
export const WINE_OFFSET = {
  left: FUNC_BAR_WIDTH,
  top: 49 /* -1px 任务栏边框位置 */,
  right: -1 /* 去除最大化时窗口右边的1px空隙? */,
};

/** 记录useWillPop的执行注册信息，用于任务关闭时进行检测 */
export const WILL_POP_MAP: TaskWillPopMeta = {};
