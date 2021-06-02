import { Seed } from 'm78/seed';
import { useEffect, useState } from 'react';
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

/** 接收一个state中包含auth的seed，并在其改变时触发更新 */
export function useSubscribeAuthChange(seed: Seed) {
  const [authKeyChangeFlag, setFlag] = useState(0);

  useEffect(() => {
    const subscribe = seed.subscribe;

    return subscribe(changes => {
      if ('auth' in changes) {
        setFlag(prev => prev + 1);
      }
    });
  }, []);

  return authKeyChangeFlag;
}
