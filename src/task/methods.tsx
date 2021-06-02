import React, { useEffect, useState } from 'react';
import Wine from '@m78/wine';
import { createRandString, isArray, isBoolean, isFunction, isObject } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import { message } from 'm78/message';
import { TaskCtx, TaskItemCategory, TaskOpt, TaskOptItem, TaskState } from '../types';
import { renderBuiltInHeader } from './render';
import { WILL_POP_MAP, WINE_OFFSET } from '../common/const';
import taskSeed from './task-seed';
import TaskWindowWrap from './task-window-wrap';
import { updateByKeyEvent } from './event';
import { adminWarn, configGetter, emitConfig } from '../common/common';
import task from './task';

/*
 * #####################################################
 * 任务的各种管理和操作方法, 这些方法不对外暴露
 * #####################################################
 * */

interface CreateTaskInstanceOpt {
  /** 参数 */
  param?: any;
  /** 如果是子任务，传入父级 */
  parent?: TaskCtx;
}

/**
 * wine关闭时同步关闭已失效的task
 * */
export function useSyncWineTask() {
  useEffect(() => {
    // 处理窗口点击关闭, _debounce用于保证有多个窗口同时关闭时减少状态更新次数
    const closeHandle = _debounce(
      () => {
        const instance = Wine.getInstances();
        const list = taskSeed.getState().taskList;

        const filterList = list.filter(item => {
          return instance.some(i => i === item.wine);
        });

        taskSeed.setState({
          taskList: filterList,
        });
      },
      10,
      { leading: false, trailing: true },
    );

    Wine.events.change.on(closeHandle);

    return () => Wine.events.change.off(closeHandle);
  }, []);
}

/**
 * 在接收到对应ctx的updateByKeyEvent更新通知时更新组件
 * */
export function useListenerKeyToUpdate(ctx: TaskCtx) {
  const [, update] = useState(0);

  // 监听变更并更新组件
  updateByKeyEvent.useEvent(key => {
    if (key === ctx.taskKey) update(prev => prev + 1);
  });
}

/**
 * 根据beforeTaskEach检测是是否符合条件
 * */
export function checkBeforeTaskEach(opt: TaskOptItem) {
  const checkFn = taskSeed.getState().adminProps.beforeTaskEach;
  if (!checkFn) return true;
  return checkFn(opt);
}

/**
 * 根据taskAuth检测是是否符合条件
 * */
export function checkTaskAuth(opt: TaskOptItem) {
  const AuthPro = taskSeed.getState().adminProps.authPro;
  if (!AuthPro || !isArray(opt.auth) || !opt.auth.length) return true;
  return !AuthPro.auth(opt.auth);
}

/**
 * 根据taskAuth检测是是否符合条件
 * */
export function checkTaskAuthAndTips(opt: TaskOptItem) {
  const check = checkTaskAuth(opt);

  if (!check) {
    message.tips({
      type: 'warning',
      content: (
        <span>
          <span className="bold">{opt.name}: </span>您没有此功能的访问权限
        </span>
      ),
      duration: 2000,
    });
  }

  return check;
}

/**
 * 接收TaskOptItem来创建task实例传入 opt.parent 时，在其内部创建子实例
 * */
export function createTaskInstance(taskOpt: TaskOptItem, opt?: CreateTaskInstanceOpt): TaskCtx {
  const { param, parent } = opt || {};

  // 通用实现
  const ctx = ({
    id: taskOpt.id,
    taskKey: createRandString(2),
    param: param || {},
    option: taskOpt,
    setParam: (_param: any) => {
      if (isObject(_param)) {
        ctx.param = { ..._param };
      }

      if (isArray(param)) {
        ctx.param = [..._param];
      }

      ctx.param = _param;

      updateByKeyEvent.emit((parent || ctx).taskKey);
    },
  } as any) as TaskCtx;

  if (!parent) {
    // 主实例实现
    createMainTaskCtx(taskOpt, ctx);
  } else {
    // 子实例实现
    createSubTaskCtx(taskOpt, { param, parent }, ctx);
  }

  return ctx;
}

/**
 * 生成TaskCtx的主实例功能
 * 💥 此函数参数中的ctx是未完成状态的ctx，部分功能并不存在
 * */
export function createMainTaskCtx(taskOpt: TaskOptItem, ctx: TaskCtx) {
  const { id, name, component, icon, auth, taskName, initFull, ...wineState } = taskOpt;

  const config = configGetter(taskSeed.getState());
  const isDefaultFull = !(
    wineState.width ||
    wineState.height ||
    wineState.sizeRatio ||
    !config?.initFull
  );

  // 主实例实现
  ctx.wine = Wine.render({
    ...wineState,
    initFull: initFull || isDefaultFull,
    className: `J_task_${ctx.taskKey}`,
    content: <TaskWindowWrap Component={React.memo(component)} ctx={ctx} />,
    headerCustomer: renderBuiltInHeader,
    limitBound: WINE_OFFSET,
    // @ts-ignore - 额外状态，交由renderBuiltInHeader使用
    taskOption: taskOpt,
    // 额外状态，交由renderBuiltInHeader使用
    ctx,
  });

  ctx.children = [];
  ctx.refresh = () => ctx.wine.current?.refresh();

  ctx.open = () => {
    ctx.wine.show();
    ctx.wine.current?.top();
  };

  ctx.hide = ctx.wine.hide;

  ctx.dispose = () => {
    closeTaskByKey(ctx.taskKey);
  };

  // 此push用于添加子实例
  ctx.push = (_id, _param) => {
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt) return;

    if (!checkTaskAuthAndTips(currentOpt)) return;

    if (!checkBeforeTaskEach(currentOpt)) return;

    const instance = createTaskInstance(currentOpt, {
      param: _param,
      parent: ctx,
    });

    ctx.children.push(instance);
    ctx.currentChildIndex = ctx.children.length - 1;

    updateByKeyEvent.emit(ctx.taskKey);
  };

  ctx.replace = (_id, _param) => {
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt) return;

    if (!checkTaskAuthAndTips(currentOpt)) return;

    if (!checkBeforeTaskEach(currentOpt)) return;

    [...ctx.children].forEach(item => {
      if (item.id === _id) item.dispose();
    });

    ctx.push(_id, _param);
  };
}

/**
 * 生成TaskCtx的子实例功能
 * */
export function createSubTaskCtx(taskOpt: TaskOptItem, opt: CreateTaskInstanceOpt, ctx: TaskCtx) {
  const parent = opt.parent!;

  // 子实例实现
  ctx.parent = parent;

  // 刷新实例所在窗口
  ctx.refresh = parent.refresh;

  // open需要先将窗口索引切换到当前实例
  ctx.open = () => {
    const ind = parent.children.indexOf(ctx);
    if (ind !== -1) parent.currentChildIndex = ind;
    updateByKeyEvent.emit(parent.taskKey);
    parent.open();
  };

  // 隐藏子实例时，显示父实例
  ctx.hide = () => {
    parent.currentChildIndex = undefined;
    updateByKeyEvent.emit(parent.taskKey);
  };

  // 移除，需要同步处理currentChildIndex
  ctx.dispose = () => {
    if (!checkPopCloseable(ctx) && !closeConfirm(ctx)) return;

    const ind = parent.children.indexOf(ctx);

    if (ind === -1) return;

    parent.children.splice(ind, 1);

    const childInd = parent.currentChildIndex;

    // 同步currentChildIndex
    if (childInd && childInd > parent.children.length - 1) {
      parent.currentChildIndex = childInd - 1;
    }
    if (!parent.children.length) {
      parent.currentChildIndex = undefined;
    }

    updateByKeyEvent.emit(parent.taskKey);
  };

  // 子实例的push/replace不可用
  ctx.push = () => {
    if (parent) {
      adminWarn('push() of child ctx will be ignored');
    }
  };

  // 子实例的push不可用
  ctx.replace = () => {
    if (parent) {
      adminWarn('replace() of child ctx will be ignored');
    }
  };
}

/**
 * 根据id获取其task配置
 * */
export function getTaskOpt(id: string) {
  const map = taskSeed.getState().taskOptionsIdMap;
  return map[id];
}

/**
 * 处理TaskOpt并生成taskOptions/taskOptionsFlat/taskOptionsIdMap
 * */
export function taskOptFormat(taskOpt: TaskOpt) {
  // 清理无效选项后的配置
  const taskOptions: TaskOpt = [];
  // 平铺配置
  const taskOptionsFlat: TaskOptItem[] = [];
  // 快捷查询map
  const taskOptionsIdMap: TaskState['taskOptionsIdMap'] = {};

  // 深拷贝taskOptions剔除无效选项并生成平铺列表
  function flatTaskOptions(_taskOptions: TaskOpt, list?: TaskOpt) {
    _taskOptions.forEach(item => {
      if ('id' in item && item.component && item.name) {
        const c = { ...item };

        taskOptionsFlat.push(c);
        taskOptionsIdMap[c.id] = c;

        if (list) {
          list.push(c);
        }
      }

      if ('children' in item && item.name && item.children.length) {
        const c = {
          ...item,
          children: [],
        };

        if (list) {
          list.push(c);
        }

        flatTaskOptions(item.children, c.children);
      }
      // 不满足条件的选项直接忽略
    });
  }

  flatTaskOptions(taskOpt, taskOptions);

  return {
    taskOptions,
    taskOptionsFlat,
    taskOptionsIdMap,
  };
}

/**
 * 传入id来从收藏功能中将其移除或添加
 * */
export function collectHandle(id: string, collectFunc: string[]) {
  const index = collectFunc.indexOf(id);
  const clone = [...collectFunc];

  if (index === -1) {
    clone.push(id);
  } else {
    clone.splice(index, 1);
  }

  emitConfig({
    collectFunc: [...clone],
  });
}

/**
 * 根据指定的检测函数从实例列表中批量关闭实例，所有关闭的方法都应该通过此方法实现，因为它会执行必要的前置操作
 * */
export function closeTaskList(checker: (ctx: TaskCtx, ind: number) => boolean) {
  const list = taskSeed.getState().taskList;

  const nextList = list.filter((item, index) => {
    // 是否应该保留
    let keep = checker(item, index);

    if (!keep) {
      // 主实例是否可安全关闭
      const ctxIsSafe = checkPopCloseable(item);

      // 子实例是否可安全关闭
      const subCtxIsSafe = item.children?.length ? item.children.every(checkPopCloseable) : true;

      // 是否可安全关闭
      if (!ctxIsSafe || !subCtxIsSafe) {
        // 不可安全关闭时进行询问
        keep = !closeConfirm(item);
      }
    }

    if (!keep) {
      item.wine.dispose();
    }

    return keep;
  });

  taskSeed.setState({
    taskList: nextList,
  });
}

/**
 * 根据Ctx中指定的properties对比来移除对应的任务, 支持传入be来决定是相等检测还是非相等检测
 * - 用于对比的properties必须时支持浅对比
 * */
export function closeTaskByProp(propName: keyof TaskCtx, prop: any, be = false) {
  if (!prop) return;
  closeTaskList(ctx => (be ? ctx[propName] === prop : ctx[propName] !== prop));
}

/**
 * 关闭指定id的所有任务
 * */
export function closeTaskById(id: string) {
  closeTaskByProp('id', id);
}

/**
 * 关闭指定key的所有任务
 * */
export function closeTaskByKey(key: string) {
  closeTaskByProp('taskKey', key);
}

/**
 * 关闭指定key外的所有任务
 * */
export function closeOtherTaskByKey(key: string) {
  closeTaskByProp('taskKey', key, true);
}

/**
 * 关闭指定key左侧或右侧的所有任务
 * */
export function closeSideTaskByKey(key: string, right = true) {
  if (!key) return;
  const list = taskSeed.getState().taskList;

  const index = list.findIndex(item => item.taskKey === key);

  closeTaskList((ctx, ind) => (right ? ind <= index : ind >= index));
}

/**
 * 关闭指定key右侧的所有任务
 * */
export function closeRightTaskByKey(key: string) {
  closeSideTaskByKey(key);
}

/**
 * 关闭指定key左侧的所有任务
 * */
export function closeLeftTaskByKey(key: string) {
  closeSideTaskByKey(key, false);
}

/**
 * 隐藏指定id的所有任务
 * */
export function hideTaskById(id: string) {
  if (!id) return;
  const list = task.get(id);
  list.forEach(item => item.hide());
}

/**
 * 隐藏指定id的所有任务
 * */
export function openTaskById(id: string) {
  if (!id) return;
  const list = task.get(id);
  list.forEach(item => item.open());
}

/** 检测指定key的任务是否可安全的关闭 */
export function checkPopCloseable(ctx: TaskCtx) {
  const meta = WILL_POP_MAP[ctx.taskKey];

  if (meta) {
    let pass = true;

    if (isFunction(meta.when) && meta.when()) pass = false;
    if (isBoolean(meta.when) && meta.when) pass = false;

    return pass;
  }

  return true;
}

/** 关闭提示并返回结果 */
export function closeConfirm(ctx: TaskCtx) {
  return confirm(`您在 “${ctx.option.name}” 窗口进行的操作可能不会保存，确认要将其关闭吗?`);
}

/** 检测是否是非隐藏且有权限的task选项 */
export function isPassNode(item: TaskItemCategory | TaskOptItem): item is TaskOptItem {
  return item && 'id' in item && !item.hide && checkTaskAuth(item);
}
