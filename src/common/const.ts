/** 主窗口区域的偏移 */
import { TaskWillPopMeta } from '../types';

export const WINE_OFFSET_LEFT = 90;

/** 主窗口区域的偏移 */
export const WINE_OFFSET = {
  left: WINE_OFFSET_LEFT,
  top: 50,
};

/** 记录useWillPop的执行注册信息，用于任务关闭时进行检测 */
export const WILL_POP_MAP: TaskWillPopMeta = {};
