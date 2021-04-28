import { useEffect } from 'react';
import { TaskGlobal } from '../types';
import taskSeed from './task-seed';
import {
  checkBeforeTaskEach,
  checkTaskAuthAndTips,
  createTaskInstance,
  getTaskOpt,
} from './methods';
import { WILL_POP_MAP } from '../common/const';

/*
 * #####################################################
 * 实现全局任务实例 +++++++++++++++++++++++++++++++++++++++
 * #####################################################
 * */

const get: TaskGlobal['get'] = id => {
  const list = taskSeed.getState().taskList;
  if (!id) return list;
  return list.filter(item => item.id === id);
};

const push: TaskGlobal['push'] = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt) return;

  if (!checkTaskAuthAndTips(currentOpt)) return;

  if (!checkBeforeTaskEach(currentOpt)) return;

  const instance = createTaskInstance(currentOpt, {
    param,
  });

  taskSeed.setState({
    taskList: [...get(), instance],
  });
};

const refresh: TaskGlobal['refresh'] = id => {
  const ls = get(id);
  ls.forEach(item => item.refresh());
};

const open: TaskGlobal['open'] = id => {
  const ls = get(id);
  ls.forEach(item => item.open());
};

const hide: TaskGlobal['hide'] = id => {
  const ls = get(id);
  ls.forEach(item => item.hide());
};

const dispose: TaskGlobal['dispose'] = id => {
  const ls = get(id);
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

  const sameList = get(id);

  sameList.forEach(item => item.dispose());

  push(id, param);
};

const task: TaskGlobal = {
  get,
  push,
  refresh,
  open,
  hide,
  dispose,
  useWillPop,
  replace,
};

export default task;
