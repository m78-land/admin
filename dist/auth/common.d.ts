import { AuthKeysMap, AuthDetailMap, AuthStrings } from '../types';
/** admin权限实现的主验证器key */
export declare const ADMIN_AUTH_NAME = "ADMIN_AUTH";
/** 获取所有(包含用户自定义)可用key组成的AuthKeyMap */
export declare function getAuthKeyMap(): AuthKeysMap;
/** 从getAuthKeyMap()的返回中获取以完整name为key的AuthKeysMap */
export declare function getAuthNameInfoMap(): AuthKeysMap;
/**
 * 解析AuthStrings字符数组, 无效有效权限时返回null, 解析后的格式为:
 * ['user:crud', 'setting:c']
 *      =>
 * {
 *   user: {
 *     create: true,
 *     retrieve: true,
 *     update: true,
 *     delete: true,
 *   },
 *   setting: {
 *     create: true,
 *   }
 * }
 *
 * - 未知的权限key会被忽略
 * */
export declare function parseAuthString(strArr: AuthStrings): AuthDetailMap | null;
