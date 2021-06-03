import { Seed } from 'm78/seed';
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
/** 接收一个state中包含auth的seed，并在其改变时触发更新 */
export declare function useSubscribeAuthChange(seed: Seed): number;
