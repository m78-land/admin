import taskSeed from '../task/task-seed';
import { M78AdminConfig, TaskState } from '../types';

/**
 * 发送警告信息
 * */
export function adminWarn(str: string) {
  console.warn('m78-admin: ', str);
}

/**
 * 取配置对象
 * */
export function configGetter(state: TaskState) {
  return state.adminProps?.config;
}

/**
 * 向外部发送配置变更通知
 * */
export function emitConfig(conf: Partial<M78AdminConfig>) {
  const callback = taskSeed.getState().adminProps.onConfigChange;
  callback && callback(conf);
}
