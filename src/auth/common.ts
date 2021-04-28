import { isArray } from '@lxjx/utils';
import { AuthKeysMap, AuthDetailMap, AuthStrings } from '../types';
import taskSeed from '../task/task-seed';

/** admin权限实现的主验证器key */
export const ADMIN_AUTH_NAME = 'ADMIN_AUTH';

/** 内置的所有权限key的完整名称映射 */
const builtInAuthKeysMap: AuthKeysMap = {
  c: {
    name: 'create',
    label: '创建',
  },
  r: {
    name: 'retrieve',
    label: '查询',
  },
  u: {
    name: 'update',
    label: '更新',
  },
  d: {
    name: 'delete',
    label: '删除',
  },
};

/** 获取所有(包含用户自定义)可用key组成的AuthKeyMap */
export function getAuthKeyMap(): AuthKeysMap {
  const customAuthKeysMap = taskSeed.getState().adminProps.customAuthKeysMap;
  return {
    ...builtInAuthKeysMap,
    ...customAuthKeysMap,
  };
}

/** 从getAuthKeyMap()的返回中获取以完整name为key的AuthKeysMap */
export function getAuthNameInfoMap(): AuthKeysMap {
  const keyMap = getAuthKeyMap();

  const obj: AuthKeysMap = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(keyMap).forEach(([_, infos]) => {
    obj[infos.name] = infos;
  });

  return obj;
}

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
export function parseAuthString(strArr: AuthStrings) {
  if (!isArray(strArr) || !strArr.length) return null;

  // 过滤无效权限
  const f = strArr.map(key => key.split(':')).filter(([k, a]) => k && k.length && a && a.length);

  if (!f.length) return null;

  const map: AuthDetailMap = {};

  const authKeyMap = getAuthKeyMap();

  f.forEach(([k, a]) => {
    const auths = a.split('');

    let cAuth: any;

    auths.forEach(authKey => {
      const current = authKeyMap[authKey];
      if (current) {
        if (!cAuth) cAuth = {};
        cAuth[current.name] = true;
      }
    });

    if (cAuth) {
      map[k] = cAuth;
    }
  });

  return map;
}
