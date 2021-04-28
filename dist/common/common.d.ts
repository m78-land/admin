import { M78AdminConfig, TaskState } from '../types';
/**
 * 发送警告信息
 * */
export declare function adminWarn(str: string): void;
/**
 * 取配置对象
 * */
export declare function configGetter(state: TaskState): M78AdminConfig | undefined;
/**
 * 向外部发送配置变更通知
 * */
export declare function emitConfig(conf: Partial<M78AdminConfig>): void;
