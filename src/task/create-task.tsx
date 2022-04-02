/**
 * 创建task的方法
 * */

import React from 'react';
import Wine from '@m78/wine';
import { createRandString, isArray, isObject } from '@lxjx/utils';
import { MediaQueryTypeValues } from 'm78/layout';
import { TaskCtx, TaskOptItem } from '../types/tasks';
import { refreshEvent, updateByKeyEvent } from './event';
import { configGetter } from '../common/common';
import taskSeed from './task-seed';
import TaskWindowWrap from './task-window-wrap';
import { WINDOW_Z_INDEX, WINE_OFFSET } from '../common/const';
import {
  checkBeforeTaskEach,
  checkPopCloseable,
  checkTaskAuthAndTips,
  closeConfirm,
  closeTaskByKey,
  getTaskOpt,
} from './methods';
import { taskWindowHeaderCustomer } from './task-window-header-customer';

interface CreateTaskInstanceOpt {
  /** 参数 */
  param?: any;
  /** 如果是子任务，传入父级 */
  parent?: TaskCtx;
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
function createMainTaskCtx(taskOpt: TaskOptItem, ctx: TaskCtx) {
  const {
    /* 这里将非wine的配置取出，反正后面api扩展时产生冲突 */
    id,
    name,
    component,
    icon,
    auth,
    taskName,
    initFull,
    singleton,
    hide,
    ...wineState
  } = taskOpt;

  const config = configGetter(taskSeed.get());

  const isDefaultFull =
    // 小于SM的设备全屏显示窗口
    window.innerWidth <= MediaQueryTypeValues.SM ||
    !(wineState.width || wineState.height || wineState.sizeRatio || !config?.initFull);

  ctx.children = [];

  // 主实例实现
  ctx.wine = Wine.render({
    zIndex: WINDOW_Z_INDEX,
    ...wineState,
    initFull: initFull || isDefaultFull,
    className: `J_task_${ctx.taskKey}`,
    content: <TaskWindowWrap Component={React.memo(component)} ctx={ctx} />,
    headerCustomer: taskWindowHeaderCustomer,
    limitBound: WINE_OFFSET,
    // @ts-ignore - 额外状态，交由renderBuiltInHeader使用
    taskOption: taskOpt,
    // 额外状态，交由renderBuiltInHeader使用
    ctx,
    onActive: () => {
      // 更新活动窗口
      taskSeed.set({
        activeTaskKey: ctx.taskKey,
      });
    },
  });

  ctx.refresh = () => refreshEvent.emit(ctx.taskKey);

  ctx.open = () => {
    ctx.wine.show();
    ctx.wine.current?.top();
  };

  ctx.hide = ctx.wine.hide;

  ctx.dispose = () => {
    closeTaskByKey(ctx.taskKey);
  };

  ctx.push = (_id, _param) => {
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt) return;

    if (!checkTaskAuthAndTips(currentOpt)) return;

    if (!checkBeforeTaskEach(currentOpt)) return;

    // 单例窗口处理
    if (currentOpt.singleton && ctx.children?.length) {
      const exist = ctx.children.find(item => item.id === _id);

      if (exist) {
        exist.open();
        return;
      }
    }

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
function createSubTaskCtx(taskOpt: TaskOptItem, opt: CreateTaskInstanceOpt, ctx: TaskCtx) {
  const parent = opt.parent!;

  // 子实例实现
  ctx.parent = parent;

  ctx.refresh = () => refreshEvent.emit(ctx.taskKey);

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
    // 执行实际的关闭操作
    const closeAction = () => {
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

    if (checkPopCloseable(ctx)) {
      closeAction();
      return;
    }

    closeConfirm(ctx, closeAction);
  };

  // 子实例的push/replace直接调用父实例
  ctx.push = parent.push;

  ctx.replace = parent.replace;
}
