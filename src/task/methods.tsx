/*
 * 任务的各种管理和操作方法, 这些方法不对外暴露
 * */

import React, { useEffect, useState } from 'react';
import Wine from '@m78/wine';
import { ensureArray, isArray, isBoolean, isFunction } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import { Dialog } from 'm78/dialog';
import { notify } from 'm78/notify';
import { Status } from 'm78/common';
import { TaskCtx, TaskItemCategory, TaskOpt, TaskOptItem, TaskState } from '../types/types';
import { WILL_POP_MAP } from '../common/const';
import taskSeed from './task-seed';
import { updateByKeyEvent } from './event';
import { emitConfig } from '../common/common';
import taskGlobal from './task-global';

/**
 * wine关闭时同步关闭已失效的task
 * */
export function useSyncWineTask() {
  useEffect(() => {
    // 处理窗口点击关闭, _debounce用于保证有多个窗口同时关闭时减少状态更新次数
    const closeHandle = _debounce(
      () => {
        const instance = Wine.getInstances();
        const list = taskSeed.get().taskList;

        const filterList = list.filter(item => {
          return instance.some(i => i === item.wine);
        });

        taskSeed.set({
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
  const checkFn = taskSeed.get().adminProps.beforeTaskEach;
  if (!checkFn) return true;
  return checkFn(opt);
}

/**
 * 根据id获取其task配置
 * */
export function getTaskOpt(id: string) {
  const map = taskSeed.get().taskOptionsIdMap;
  return map[id];
}

/**
 * 处理TaskOpt并生成taskOptions/taskOptionsFlat/taskOptionsIdMap
 * - 每个节点都会被附加私有属性__parents?，表示该节点的所有父级按顺序组成的数组
 * */
export function taskOptFormat(taskOpt: TaskOpt) {
  // 清理无效选项后的配置
  const taskOptions: TaskOpt = [];
  // 平铺配置
  const taskOptionsFlat: TaskOptItem[] = [];
  // 快捷查询map
  const taskOptionsIdMap: TaskState['taskOptionsIdMap'] = {};

  // 深拷贝taskOptions剔除无效选项并生成平铺列表
  function flatTaskOptions(_taskOptions: TaskOpt, list?: TaskOpt, parents?: TaskItemCategory[]) {
    _taskOptions.forEach(item => {
      if (isTaskOptItem(item)) {
        const c = { ...item, __parents: parents };

        taskOptionsFlat.push(c);
        taskOptionsIdMap[c.id] = c;

        if (list) {
          list.push(c);
        }
      }

      if (isTaskItemCategory(item)) {
        const c = {
          ...item,
          children: [],
          __parents: parents,
        };

        if (list) {
          list.push(c);
        }

        flatTaskOptions(item.children, c.children, [...(parents || []), c]);
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
  const list = taskSeed.get().taskList;

  // 应该保留的列表
  const nextList: TaskCtx[] = [];
  // 不应该保留的列表
  const removeList: TaskCtx[] = [];

  list.forEach((item, index) => {
    if (checker(item, index)) {
      nextList.push(item);
    } else {
      removeList.push(item);
    }
  });

  // 执行实际的关闭操作
  const actionClose = () => {
    removeList.forEach(item => {
      item.wine.dispose();
    });

    taskSeed.set({
      taskList: nextList,
    });
  };

  // 处理willPop, 待关闭项中任意一项为false则阻止关闭行为
  if (removeList.length) {
    const confirmTasks: TaskCtx[] = [];

    removeList.forEach(item => {
      // 主实例是否可安全关闭
      if (!checkPopCloseable(item)) {
        confirmTasks.push(item);
      }

      // 子实例是否可安全关闭
      if (item.children?.length) {
        item.children.forEach(it => {
          if (!checkPopCloseable(it)) {
            confirmTasks.push(it);
          }
        });
      }
    });

    if (confirmTasks.length) {
      closeConfirm(confirmTasks, actionClose);
    } else {
      actionClose();
    }
  }
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
  const list = taskSeed.get().taskList;

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
  const list = taskGlobal.get({ id });
  list.forEach(item => item.hide());
}

/**
 * 打开指定id的所有任务
 * */
export function openTaskById(id: string) {
  if (!id) return;
  const list = taskGlobal.get({ id });
  list.forEach(item => item.open());
}

/**
 * 打开指定id的任务, 如果该任务已存在实例，则打开其最后一个实例
 * */
export function pushTaskOrOpenLastTask(id: string) {
  if (!id) return;
  const list = taskGlobal.get({ id });
  const length = list.length;
  if (!length) {
    taskGlobal.push(id);
    return;
  }
  list[length - 1].open();
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
export function closeConfirm(ctx: TaskCtx | TaskCtx[], cb: Function) {
  const tasks = ensureArray(ctx);

  if (!tasks.length) return;

  const names = tasks.map(getTaskName).join(', ');

  Dialog.render({
    content: (
      <div>
        您在 <span className="bold">"{names}"</span> {tasks.length > 1 && '等'}
        窗口进行的操作可能不会保存，确认要关闭吗?
      </div>
    ),
    close: true,
    onClose: isConfirm => {
      isConfirm && cb();
    },
  });
}

export function isTaskOptItem(arg: any): arg is TaskOptItem {
  return 'id' in arg && arg.component && arg.name;
}

export function isTaskItemCategory(arg: any): arg is TaskItemCategory {
  return 'children' in arg && arg.name && arg.children?.length;
}

/**
 * 检测选项是是否符满足权限
 * */
export function checkTaskAuth(opt: TaskOptItem | TaskItemCategory) {
  const pro = taskSeed.get().adminProps.permission;

  /* taskOptFormat()中添加，所有父节点组成的数组 */
  const parents: TaskItemCategory[] = (opt as any).__parents;

  // 检测所有父级是否通过校验
  if (parents?.length) {
    // 所有父级的auth是否均验证通过
    const everyPass = parents.every(item =>
      isArray(item.permission) ? !pro.check(item.permission) : true,
    );
    if (!everyPass) return false;
  }

  // 未配置auth时跳过验证
  if (!pro || !isArray(opt.permission) || !opt.permission.length) return true;

  // 验证当前节点
  return !pro.check(opt.permission);
}

/**
 * 根据taskAuth检测是是否符合条件， 无权限是触发提示
 * */
export function checkTaskAuthAndTips(opt: TaskOptItem) {
  const check = checkTaskAuth(opt);

  if (!check) {
    notify.render({
      status: Status.warning,
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

/** 检测是否是非隐藏且有权限的task选项 */
export function isPassNode(item: TaskItemCategory | TaskOptItem): item is TaskOptItem {
  return isTaskOptItem(item) && !item.hide && checkTaskAuth(item);
}

/** 检测是否是有权访问的节点或目录 */
export function isPassNodeOrCategory(item: TaskItemCategory | TaskOptItem) {
  if (!item) return false;
  if (isTaskOptItem(item)) return isPassNode(item);
  if (isTaskItemCategory(item)) return checkTaskAuth(item);
  return false;
}

/** 依次从task的taskName()和name获取窗口名 */
export function getTaskName(ctx: TaskCtx) {
  return ctx.option.taskName ? ctx.option.taskName(ctx) : ctx.option.name;
}
