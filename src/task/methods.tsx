import React, { useEffect, useState } from 'react';
import Wine from '@m78/wine';
import { createRandString, isArray, isBoolean, isFunction, isObject } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import { message } from 'm78/message';
import { MediaQueryTypeValues } from 'm78/layout';
import { TaskCtx, TaskItemCategory, TaskOpt, TaskOptItem, TaskState } from '../types';
import { WILL_POP_MAP, WINE_OFFSET } from '../common/const';
import taskSeed from './task-seed';
import TaskWindowWrap from './task-window-wrap';
import { refreshEvent, updateByKeyEvent } from './event';
import { configGetter, emitConfig } from '../common/common';
import task from './task';
import { taskWindowHeaderCustomer } from '../renders/renders';

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

  const config = configGetter(taskSeed.getState());

  const isDefaultFull =
    // 小于SM的设备全屏显示窗口
    window.innerWidth <= MediaQueryTypeValues.SM ||
    !(wineState.width || wineState.height || wineState.sizeRatio || !config?.initFull);

  // 主实例实现
  ctx.wine = Wine.render({
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
      taskSeed.setState({
        activeTaskKey: ctx.taskKey,
      });
    },
  });

  ctx.children = [];

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
export function createSubTaskCtx(taskOpt: TaskOptItem, opt: CreateTaskInstanceOpt, ctx: TaskCtx) {
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

  // 子实例的push/replace直接调用父实例
  ctx.push = parent.push;

  ctx.replace = parent.replace;
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

  console.log(taskOptions, 222);

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
  const list = task.get({ id });
  list.forEach(item => item.hide());
}

/**
 * 打开指定id的所有任务
 * */
export function openTaskById(id: string) {
  if (!id) return;
  const list = task.get({ id });
  list.forEach(item => item.open());
}

/**
 * 打开指定id的任务, 如果该任务已存在实例，则打开其最后一个实例
 * */
export function pushTaskOrOpenLastTask(id: string) {
  if (!id) return;
  const list = task.get({ id });
  const length = list.length;
  if (!length) {
    task.push(id);
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
export function closeConfirm(ctx: TaskCtx) {
  return confirm(`您在 “${ctx.option.name}” 窗口进行的操作可能不会保存，确认要将其关闭吗?`);
}

export function isTaskOptItem(arg: any): arg is TaskOptItem {
  return 'id' in arg && arg.component && arg.name;
}

export function isTaskItemCategory(arg: any): arg is TaskItemCategory {
  return 'children' in arg && arg.name && arg.children?.length;
}

/**
 * 根据taskAuth检测是是否符合条件
 * */
export function checkTaskAuth(opt: TaskOptItem | TaskItemCategory) {
  const AuthPro = taskSeed.getState().adminProps.authPro;

  /* taskOptFormat()中添加，所有父节点组成的数组 */
  const parents: TaskItemCategory[] = (opt as any).__parents;

  // 检测所有父级是否通过校验
  if (parents?.length) {
    // 所有父级的auth是否均验证通过
    const everyPass = parents.every(item => (isArray(item.auth) ? !AuthPro.auth(item.auth) : true));
    if (!everyPass) return false;
  }

  // 未配置auth时跳过验证
  if (!AuthPro || !isArray(opt.auth) || !opt.auth.length) return true;

  // 验证当前节点
  return !AuthPro.auth(opt.auth);
}

/**
 * 根据taskAuth检测是是否符合条件， 无权限是触发提示
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
