import { Seed } from 'm78/seed';
import { M78AdminConfig, TaskState } from '../types/types';
/**
 * 发送警告信息
 * */
export declare function adminWarn(str: string): void;
/**
 * 从传入的状态值中取配置对象
 * */
export declare function configGetter(state: TaskState): M78AdminConfig | undefined;
/**
 * 向外部发送配置变更通知
 * */
export declare function emitConfig(conf: Partial<M78AdminConfig>): void;
/** 接收一个state中包含permission的seed，并在其改变时触发更新 */
export declare function useSubscribePermissionChange(seed: Seed): number;
/** 根据录入的主题色和次要主题色生成用于注入tag的css变量字符 */
export declare function generateThemeColorRules(color?: string, subColor?: string): string;
/** 是否是img标签可渲染的图片地址 网络图片/base64等 */
export declare function isStringIcon(icon: any): icon is string;
