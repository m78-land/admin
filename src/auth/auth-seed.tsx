import create from 'm78/seed';
import { isArray } from '@lxjx/utils';
import React from 'react';
import { AuthSeedState, AuthStrings } from '../types';
import { ADMIN_AUTH_NAME, getAuthNameInfoMap, parseAuthString } from './common';
import taskSeed from '../task/task-seed';

/**
 * 管理权限相关状态，实现核心验证器
 * */
const authSeed = create<AuthSeedState>({
  state: {
    auth: [],
    authDetailMap: null,
  },
  validators: {
    [ADMIN_AUTH_NAME]: ({ authDetailMap }, extra?: AuthStrings) => {
      const authNameMap = taskSeed.getState().adminProps.authNameMap;

      // 没有任何权限
      if (!authDetailMap) {
        return {
          label: '😥 没有任何权限~',
        };
      }
      // 没有传入要验证的权限
      if (!isArray(extra) || !extra.length) return;

      const beTestAuthMap = parseAuthString(extra);

      if (!beTestAuthMap) return;

      let rejectData: any;

      const infosMap = getAuthNameInfoMap();

      for (const [key, beTestAuth] of Object.entries(beTestAuthMap)) {
        const userAuth = authDetailMap[key];

        const keys = Object.keys(beTestAuth);

        // 取出不满足的权限
        const rejectKeys = keys.filter(k => !(beTestAuth[k] && userAuth && userAuth[k]));

        if (rejectKeys.length) {
          // 根据key获取其文本
          const labelKeys = rejectKeys.map(item => (infosMap[item] ? infosMap[item].label : item));

          if (!rejectData) rejectData = {};

          rejectData[key] = labelKeys.join(', ');
        }
      }

      if (rejectData) {
        return {
          label: '没有访问权限',
          desc: (
            <div className="lh-2">
              {Object.entries(rejectData).map(([key, str], ind) => (
                <div key={ind}>
                  <span className="color-title">{authNameMap?.[key] || key}: </span> 缺少
                  <span className="color-error"> {str as string} </span>权限
                </div>
              ))}
            </div>
          ) as any,
          rejectData,
        };
      }
    },
  },
});

// auth变更时计算currentSchemaMap
authSeed.subscribe(({ auth }) => {
  if (auth) {
    authSeed.getState().authDetailMap = parseAuthString(auth);
  }
});

export default authSeed;
