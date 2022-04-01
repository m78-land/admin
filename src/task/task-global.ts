/**
 * 实现全局task实例
 * */

import { useEffect } from 'react';
import { TaskGlobal } from '../types/types';
import taskSeed from './task-seed';
import { checkBeforeTaskEach, checkTaskAuthAndTips, getTaskOpt } from './methods';
import { WILL_POP_MAP } from '../common/const';
import { createTaskInstance } from './create-task';

const get: TaskGlobal['get'] = ({ id, includeSubTask } = {}) => {
  const list = [...taskSeed.get().taskList];

  // 合并子任务
  if (includeSubTask) {
    list.forEach(item => {
      if (item.children?.length) {
        list.push(...item.children);
      }
    });
  }

  if (!id) return list;
  return list.filter(item => item.id === id);
};

const push: TaskGlobal['push'] = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt) return;

  if (!checkTaskAuthAndTips(currentOpt)) return;

  if (!checkBeforeTaskEach(currentOpt)) return;

  // 单例窗口处理
  if (currentOpt.singleton) {
    const exist = get({ id });
    const last = exist[exist.length - 1];

    if (last) {
      last.open();
      return;
    }
  }

  const instance = createTaskInstance(currentOpt, {
    param,
  });

  taskSeed.set({
    taskList: [...get(), instance],
  });
};

const refresh: TaskGlobal['refresh'] = opt => {
  const ls = get(opt);
  ls.forEach(item => item.refresh());
};

const open: TaskGlobal['open'] = id => {
  const ls = get({ id });
  ls.forEach(item => item.open());
};

const hide: TaskGlobal['hide'] = id => {
  const ls = get({ id });
  ls.forEach(item => item.hide());
};

const dispose: TaskGlobal['dispose'] = opt => {
  const ls = get(opt);
  ls.forEach(item => item.dispose());
};

const useWillPop: TaskGlobal['useWillPop'] = (ctx, when) => {
  WILL_POP_MAP[ctx.taskKey] = {
    when,
  };

  useEffect(
    () => () => {
      delete WILL_POP_MAP[ctx.taskKey];
    },
    [],
  );
};

const replace: TaskGlobal['replace'] = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt) return;

  if (!checkTaskAuthAndTips(currentOpt)) return;

  if (!checkBeforeTaskEach(currentOpt)) return;

  const sameList = get({ id });

  sameList.forEach(item => item.dispose());

  push(id, param);
};

const taskGlobal: TaskGlobal = {
  get,
  push,
  refresh,
  open,
  hide,
  dispose,
  useWillPop,
  replace,
};

export default taskGlobal;
