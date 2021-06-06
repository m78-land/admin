var __defProp = Object.defineProperty;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __rest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import "@m78/admin/style/index.scss";
import React, {useState, useEffect, createContext, useMemo, useRef, useContext} from "react";
import {Spin} from "m78/spin";
import {createSeed} from "m78/seed";
import Wine, {keypressAndClick} from "@m78/wine";
import {m78Config} from "m78/config";
import {Divider, MediaQueryContext, MediaQuery} from "m78/layout";
import {Scroller} from "m78/scroller";
import {ContextMenu, ContextMenuItem} from "m78/context-menu";
import {DNDContext, DND} from "m78/dnd";
import clsx from "clsx";
import {createEvent, useFn, useSelf, useScroll} from "@lxjx/hooks";
import {isNumber, createRandString, isObject, isArray, isFunction, isBoolean, retry} from "@lxjx/utils";
import _debounce from "lodash/debounce";
import {message} from "m78/message";
import {PageHeader} from "m78/page-header";
import {CloseOutlined, MenuOutlined, StarFilled, StarOutlined} from "m78/icon";
import {DirectionEnum, SizeEnum} from "m78/types";
import assetLogo from "@m78/admin/assets/logo.png";
import {Button} from "m78/button";
import {Popper, PopperDirectionEnum} from "m78/popper";
import {Tree} from "m78/tree";
import {Check} from "m78/check";
const taskSeed = createSeed({
  state: {
    taskOptions: [],
    taskOptionsFlat: [],
    taskOptionsIdMap: {},
    taskList: [],
    adminProps: {
      tasks: [],
      authPro: null
    }
  }
});
function adminWarn(str) {
  console.warn("m78-admin: ", str);
}
function configGetter(state) {
  var _a;
  return (_a = state.adminProps) == null ? void 0 : _a.config;
}
function emitConfig(conf) {
  const callback = taskSeed.getState().adminProps.onConfigChange;
  callback && callback(conf);
}
function useSubscribeAuthChange(seed) {
  const [authKeyChangeFlag, setFlag] = useState(0);
  useEffect(() => {
    const subscribe = seed.subscribe;
    return subscribe((changes) => {
      if ("auth" in changes) {
        setFlag((prev) => prev + 1);
      }
    });
  }, []);
  return authKeyChangeFlag;
}
const ConfigSync = () => {
  const config = taskSeed.useState(configGetter);
  const darkMode = (config == null ? void 0 : config.darkMode) || false;
  const maxWindow = (config == null ? void 0 : config.maxWindow) || 12;
  const color = config == null ? void 0 : config.color;
  const subColor = config == null ? void 0 : config.subColor;
  useEffect(() => {
    m78Config.setState({
      darkMode
    });
  }, [darkMode]);
  useEffect(() => {
    Wine.setMaxInstance(maxWindow);
  }, [maxWindow]);
  useEffect(() => {
    const dSty = document.documentElement.style;
    if (dSty.setProperty) {
      dSty.setProperty("--m78-color-6", color || "");
      dSty.setProperty("--m78-color-sub-6", subColor || "");
    }
  }, [color, subColor]);
  return null;
};
const updateByKeyEvent = createEvent();
const Crumbs = ({ctx: ctx2}) => {
  useListenerKeyToUpdate(ctx2);
  function changeTaskHandle(ind) {
    if (ctx2.currentChildIndex === ind)
      return;
    ctx2.currentChildIndex = ind;
    updateByKeyEvent.emit(ctx2.taskKey);
  }
  const childLen = ctx2.children.length;
  const childInd = ctx2.currentChildIndex;
  if (!childLen)
    return null;
  return /* @__PURE__ */ React.createElement(Scroller, {
    scrollFlag: true,
    hideScrollbar: true,
    direction: DirectionEnum.horizontal,
    className: "m78-admin_crumbs"
  }, /* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_crumbs-item ellipsis m78-admin_effect pr-8", {
      __active: !isNumber(childInd)
    }),
    onClick: () => changeTaskHandle()
  }, ctx2.option.name), /* @__PURE__ */ React.createElement("span", {
    className: "color-disabled mlr-8"
  }, "/"), ctx2.children.map((item, index) => /* @__PURE__ */ React.createElement(React.Fragment, {
    key: item.taskKey
  }, /* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_crumbs-item ellipsis m78-admin_effect", {
      __active: index === childInd
    }),
    onClick: () => changeTaskHandle(index)
  }, item.option.name, /* @__PURE__ */ React.createElement("span", {
    className: "m78-admin_crumbs-close m78-admin_effect ml-4",
    title: "\u5173\u95ED",
    onClick: (e) => {
      e.stopPropagation();
      item.dispose();
    }
  }, /* @__PURE__ */ React.createElement(CloseOutlined, {
    className: "m78-close-icon color-disabled fs"
  }))), index !== childLen - 1 && /* @__PURE__ */ React.createElement("span", {
    className: "color-disabled mlr-8"
  }, "/"))));
};
const TaskNameDynamic = ({ctx: ctx2}) => {
  useListenerKeyToUpdate(ctx2);
  const opt = ctx2.option;
  return /* @__PURE__ */ React.createElement("span", null, opt.taskName ? opt.taskName(ctx2) : opt.name);
};
const renderBuiltInHeader = (props, instance, isFull) => {
  var _a;
  const taskOpt = instance.state.taskOption;
  const ctx2 = instance.state.ctx;
  return /* @__PURE__ */ React.createElement(ContextMenu, {
    content: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5237\u65B0",
      onClick: ctx2.refresh
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u6700\u5C0F\u5316",
      onClick: instance.hide
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u6700\u5927\u5316",
      onClick: (_a = instance.current) == null ? void 0 : _a.full
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED",
      onClick: ctx2.dispose
    }))
  }, /* @__PURE__ */ React.createElement("div", __assign({}, props), /* @__PURE__ */ React.createElement(PageHeader, {
    className: "m78-admin_window-header",
    border: true,
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
      className: "vm"
    }, /* @__PURE__ */ React.createElement("span", {
      className: "m78-admin_window-header_icon"
    }, taskOpt.icon), " ", /* @__PURE__ */ React.createElement(TaskNameDynamic, {
      ctx: ctx2
    })), /* @__PURE__ */ React.createElement(Divider, {
      vertical: true
    }), /* @__PURE__ */ React.createElement(Crumbs, {
      ctx: ctx2
    })),
    backIcon: null,
    actions: /* @__PURE__ */ React.createElement("div", {
      className: "m78-wine_header-actions",
      onMouseDown: (e) => e.stopPropagation()
    }, /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn"
    }, keypressAndClick(instance.hide)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_hide-btn"
    })), isFull && /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn"
    }, keypressAndClick(instance.current.resize)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_resize-btn"
    })), !isFull && /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn"
    }, keypressAndClick(instance.current.full)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_max-btn"
    })), /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn __warning"
    }, keypressAndClick(ctx2.dispose)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_dispose-btn"
    })))
  })));
};
const WINE_OFFSET_LEFT = 89;
const WINE_OFFSET = {
  left: WINE_OFFSET_LEFT,
  top: 49
};
const WILL_POP_MAP = {};
const ctx = createContext({});
const LinkProvider = ctx.Provider;
const loadingNode = /* @__PURE__ */ React.createElement(Spin, {
  text: "\u6B63\u5728\u52A0\u8F7D\u8D44\u6E90",
  className: "m78-admin_fixed-center-text"
});
const TaskWindowWrap = ({ctx: ctx2, Component}) => {
  useListenerKeyToUpdate(ctx2);
  const hasChild = !!ctx2.children.length;
  const hasIndex = isNumber(ctx2.currentChildIndex);
  return /* @__PURE__ */ React.createElement(MediaQueryContext, null, /* @__PURE__ */ React.createElement(LinkProvider, {
    value: {parent: ctx2}
  }, /* @__PURE__ */ React.createElement("div", {
    className: clsx({hide: hasIndex})
  }, /* @__PURE__ */ React.createElement(React.Suspense, {
    fallback: loadingNode
  }, /* @__PURE__ */ React.createElement(Component, __assign({}, ctx2)))), hasChild && ctx2.children.map((subTask, ind) => {
    const SubComponent = subTask.option.component;
    return /* @__PURE__ */ React.createElement("div", {
      key: subTask.taskKey,
      className: clsx({hide: ctx2.currentChildIndex !== ind})
    }, /* @__PURE__ */ React.createElement(React.Suspense, {
      fallback: loadingNode
    }, /* @__PURE__ */ React.createElement(SubComponent, __assign({}, subTask))));
  })));
};
function useSyncWineTask() {
  useEffect(() => {
    const closeHandle = _debounce(() => {
      const instance = Wine.getInstances();
      const list = taskSeed.getState().taskList;
      const filterList = list.filter((item) => {
        return instance.some((i) => i === item.wine);
      });
      taskSeed.setState({
        taskList: filterList
      });
    }, 10, {leading: false, trailing: true});
    Wine.events.change.on(closeHandle);
    return () => Wine.events.change.off(closeHandle);
  }, []);
}
function useListenerKeyToUpdate(ctx2) {
  const [, update] = useState(0);
  updateByKeyEvent.useEvent((key) => {
    if (key === ctx2.taskKey)
      update((prev) => prev + 1);
  });
}
function checkBeforeTaskEach(opt) {
  const checkFn = taskSeed.getState().adminProps.beforeTaskEach;
  if (!checkFn)
    return true;
  return checkFn(opt);
}
function checkTaskAuth(opt) {
  const AuthPro = taskSeed.getState().adminProps.authPro;
  if (!AuthPro || !isArray(opt.auth) || !opt.auth.length)
    return true;
  return !AuthPro.auth(opt.auth);
}
function checkTaskAuthAndTips(opt) {
  const check = checkTaskAuth(opt);
  if (!check) {
    message.tips({
      type: "warning",
      content: /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", {
        className: "bold"
      }, opt.name, ": "), "\u60A8\u6CA1\u6709\u6B64\u529F\u80FD\u7684\u8BBF\u95EE\u6743\u9650"),
      duration: 2e3
    });
  }
  return check;
}
function createTaskInstance(taskOpt, opt) {
  const {param, parent} = opt || {};
  const ctx2 = {
    id: taskOpt.id,
    taskKey: createRandString(2),
    param: param || {},
    option: taskOpt,
    setParam: (_param) => {
      if (isObject(_param)) {
        ctx2.param = __assign({}, _param);
      }
      if (isArray(param)) {
        ctx2.param = [..._param];
      }
      ctx2.param = _param;
      updateByKeyEvent.emit((parent || ctx2).taskKey);
    }
  };
  if (!parent) {
    createMainTaskCtx(taskOpt, ctx2);
  } else {
    createSubTaskCtx(taskOpt, {param, parent}, ctx2);
  }
  return ctx2;
}
function createMainTaskCtx(taskOpt, ctx2) {
  const {id, name, component, icon, auth, taskName, initFull} = taskOpt, wineState = __rest(taskOpt, ["id", "name", "component", "icon", "auth", "taskName", "initFull"]);
  const config = configGetter(taskSeed.getState());
  const isDefaultFull = !(wineState.width || wineState.height || wineState.sizeRatio || !(config == null ? void 0 : config.initFull));
  ctx2.wine = Wine.render(__assign(__assign({}, wineState), {
    initFull: initFull || isDefaultFull,
    className: `J_task_${ctx2.taskKey}`,
    content: /* @__PURE__ */ React.createElement(TaskWindowWrap, {
      Component: React.memo(component),
      ctx: ctx2
    }),
    headerCustomer: renderBuiltInHeader,
    limitBound: WINE_OFFSET,
    taskOption: taskOpt,
    ctx: ctx2
  }));
  ctx2.children = [];
  ctx2.refresh = () => {
    var _a;
    return (_a = ctx2.wine.current) == null ? void 0 : _a.refresh();
  };
  ctx2.open = () => {
    var _a;
    ctx2.wine.show();
    (_a = ctx2.wine.current) == null ? void 0 : _a.top();
  };
  ctx2.hide = ctx2.wine.hide;
  ctx2.dispose = () => {
    closeTaskByKey(ctx2.taskKey);
  };
  ctx2.push = (_id, _param) => {
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt)
      return;
    if (!checkTaskAuthAndTips(currentOpt))
      return;
    if (!checkBeforeTaskEach(currentOpt))
      return;
    const instance = createTaskInstance(currentOpt, {
      param: _param,
      parent: ctx2
    });
    ctx2.children.push(instance);
    ctx2.currentChildIndex = ctx2.children.length - 1;
    updateByKeyEvent.emit(ctx2.taskKey);
  };
  ctx2.replace = (_id, _param) => {
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt)
      return;
    if (!checkTaskAuthAndTips(currentOpt))
      return;
    if (!checkBeforeTaskEach(currentOpt))
      return;
    [...ctx2.children].forEach((item) => {
      if (item.id === _id)
        item.dispose();
    });
    ctx2.push(_id, _param);
  };
}
function createSubTaskCtx(taskOpt, opt, ctx2) {
  const parent = opt.parent;
  ctx2.parent = parent;
  ctx2.refresh = parent.refresh;
  ctx2.open = () => {
    const ind = parent.children.indexOf(ctx2);
    if (ind !== -1)
      parent.currentChildIndex = ind;
    updateByKeyEvent.emit(parent.taskKey);
    parent.open();
  };
  ctx2.hide = () => {
    parent.currentChildIndex = void 0;
    updateByKeyEvent.emit(parent.taskKey);
  };
  ctx2.dispose = () => {
    if (!checkPopCloseable(ctx2) && !closeConfirm(ctx2))
      return;
    const ind = parent.children.indexOf(ctx2);
    if (ind === -1)
      return;
    parent.children.splice(ind, 1);
    const childInd = parent.currentChildIndex;
    if (childInd && childInd > parent.children.length - 1) {
      parent.currentChildIndex = childInd - 1;
    }
    if (!parent.children.length) {
      parent.currentChildIndex = void 0;
    }
    updateByKeyEvent.emit(parent.taskKey);
  };
  ctx2.push = () => {
    if (parent) {
      adminWarn("push() of child ctx will be ignored");
    }
  };
  ctx2.replace = () => {
    if (parent) {
      adminWarn("replace() of child ctx will be ignored");
    }
  };
}
function getTaskOpt(id) {
  const map = taskSeed.getState().taskOptionsIdMap;
  return map[id];
}
function taskOptFormat(taskOpt) {
  const taskOptions = [];
  const taskOptionsFlat = [];
  const taskOptionsIdMap = {};
  function flatTaskOptions(_taskOptions, list) {
    _taskOptions.forEach((item) => {
      if ("id" in item && item.component && item.name) {
        const c = __assign({}, item);
        taskOptionsFlat.push(c);
        taskOptionsIdMap[c.id] = c;
        if (list) {
          list.push(c);
        }
      }
      if ("children" in item && item.name && item.children.length) {
        const c = __assign(__assign({}, item), {
          children: []
        });
        if (list) {
          list.push(c);
        }
        flatTaskOptions(item.children, c.children);
      }
    });
  }
  flatTaskOptions(taskOpt, taskOptions);
  return {
    taskOptions,
    taskOptionsFlat,
    taskOptionsIdMap
  };
}
function collectHandle(id, collectFunc) {
  const index = collectFunc.indexOf(id);
  const clone = [...collectFunc];
  if (index === -1) {
    clone.push(id);
  } else {
    clone.splice(index, 1);
  }
  emitConfig({
    collectFunc: [...clone]
  });
}
function closeTaskList(checker) {
  const list = taskSeed.getState().taskList;
  const nextList = list.filter((item, index) => {
    var _a;
    let keep = checker(item, index);
    if (!keep) {
      const ctxIsSafe = checkPopCloseable(item);
      const subCtxIsSafe = ((_a = item.children) == null ? void 0 : _a.length) ? item.children.every(checkPopCloseable) : true;
      if (!ctxIsSafe || !subCtxIsSafe) {
        keep = !closeConfirm(item);
      }
    }
    if (!keep) {
      item.wine.dispose();
    }
    return keep;
  });
  taskSeed.setState({
    taskList: nextList
  });
}
function closeTaskByProp(propName, prop, be = false) {
  if (!prop)
    return;
  closeTaskList((ctx2) => be ? ctx2[propName] === prop : ctx2[propName] !== prop);
}
function closeTaskById(id) {
  closeTaskByProp("id", id);
}
function closeTaskByKey(key) {
  closeTaskByProp("taskKey", key);
}
function closeOtherTaskByKey(key) {
  closeTaskByProp("taskKey", key, true);
}
function closeSideTaskByKey(key, right = true) {
  if (!key)
    return;
  const list = taskSeed.getState().taskList;
  const index = list.findIndex((item) => item.taskKey === key);
  closeTaskList((ctx2, ind) => right ? ind <= index : ind >= index);
}
function closeRightTaskByKey(key) {
  closeSideTaskByKey(key);
}
function closeLeftTaskByKey(key) {
  closeSideTaskByKey(key, false);
}
function hideTaskById(id) {
  if (!id)
    return;
  const list = task.get(id);
  list.forEach((item) => item.hide());
}
function openTaskById(id) {
  if (!id)
    return;
  const list = task.get(id);
  list.forEach((item) => item.open());
}
function checkPopCloseable(ctx2) {
  const meta = WILL_POP_MAP[ctx2.taskKey];
  if (meta) {
    let pass = true;
    if (isFunction(meta.when) && meta.when())
      pass = false;
    if (isBoolean(meta.when) && meta.when)
      pass = false;
    return pass;
  }
  return true;
}
function closeConfirm(ctx2) {
  return confirm(`\u60A8\u5728 \u201C${ctx2.option.name}\u201D \u7A97\u53E3\u8FDB\u884C\u7684\u64CD\u4F5C\u53EF\u80FD\u4E0D\u4F1A\u4FDD\u5B58\uFF0C\u786E\u8BA4\u8981\u5C06\u5176\u5173\u95ED\u5417?`);
}
function isPassNode(item) {
  return item && "id" in item && !item.hide && checkTaskAuth(item);
}
const get = (id) => {
  const list = taskSeed.getState().taskList;
  if (!id)
    return list;
  return list.filter((item) => item.id === id);
};
const push = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt)
    return;
  if (!checkTaskAuthAndTips(currentOpt))
    return;
  if (!checkBeforeTaskEach(currentOpt))
    return;
  const instance = createTaskInstance(currentOpt, {
    param
  });
  taskSeed.setState({
    taskList: [...get(), instance]
  });
};
const refresh = (id) => {
  const ls = get(id);
  ls.forEach((item) => item.refresh());
};
const open = (id) => {
  const ls = get(id);
  ls.forEach((item) => item.open());
};
const hide = (id) => {
  const ls = get(id);
  ls.forEach((item) => item.hide());
};
const dispose = (id) => {
  const ls = get(id);
  ls.forEach((item) => item.dispose());
};
const useWillPop = (ctx2, when) => {
  WILL_POP_MAP[ctx2.taskKey] = {
    when
  };
  useEffect(() => () => {
    delete WILL_POP_MAP[ctx2.taskKey];
  }, []);
};
const replace = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt)
    return;
  if (!checkTaskAuthAndTips(currentOpt))
    return;
  if (!checkBeforeTaskEach(currentOpt))
    return;
  const sameList = get(id);
  sameList.forEach((item) => item.dispose());
  push(id, param);
};
const task = {
  get,
  push,
  refresh,
  open,
  hide,
  dispose,
  useWillPop,
  replace
};
const FuncCollects = () => {
  const map = taskSeed.useState((state) => state.taskOptionsIdMap);
  const taskList = taskSeed.useState((state) => state.taskList);
  const AuthPro = taskSeed.useState((state) => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const collect = (config == null ? void 0 : config.collectFunc) || [];
  useSubscribeAuthChange(AuthPro.authInstance.seed);
  const acceptHandle = useFn((e) => {
    const list = [...collect];
    const target = e.target.data;
    const source = e.source.data;
    const sInd = list.indexOf(source);
    const tInd = list.indexOf(target);
    if (e.status.dragOver) {
      list.splice(tInd, 0, ...list.splice(sInd, 1));
      emitConfig({
        collectFunc: [...list]
      });
    }
  });
  return /* @__PURE__ */ React.createElement(DNDContext, {
    onAccept: acceptHandle
  }, /* @__PURE__ */ React.createElement(Scroller, {
    className: "m78-admin_func-bar_main",
    scrollFlag: true,
    hideScrollbar: true
  }, collect.map((id) => {
    const item = map[id];
    if (!isPassNode(item))
      return null;
    const tasks = taskList.filter((i) => i.id === id);
    const length = tasks.length;
    const openTask = () => {
      if (!length) {
        task.push(item.id);
        return;
      }
      tasks[length - 1].open();
    };
    return /* @__PURE__ */ React.createElement(DND, {
      key: item.id,
      data: item.id,
      enableDrop: true
    }, ({innerRef, status, enables}) => /* @__PURE__ */ React.createElement(ContextMenu, {
      key: item.id,
      content: /* @__PURE__ */ React.createElement("div", null, length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, tasks.map((i, ind) => /* @__PURE__ */ React.createElement(ContextMenuItem, {
        key: i.taskKey,
        title: `\u7F6E\u9876\u4EFB\u52A1${ind + 1}`,
        onClick: i.open
      })), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u6253\u5F00\u65B0\u7A97\u53E3",
        onClick: () => task.push(item.id)
      }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u4ECE\u5E38\u7528\u529F\u80FD\u4E2D\u79FB\u9664",
        onClick: () => collectHandle(item.id, (config == null ? void 0 : config.collectFunc) || [])
      }), length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u9690\u85CF\u5168\u90E8\u7A97\u53E3",
        onClick: () => hideTaskById(item.id)
      }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u6253\u5F00\u5168\u90E8\u7A97\u53E3",
        onClick: () => openTaskById(item.id)
      }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u5173\u95ED\u5168\u90E8\u7A97\u53E3",
        onClick: () => closeTaskById(item.id)
      })))
    }, /* @__PURE__ */ React.createElement("div", {
      ref: innerRef,
      className: "m78-dnd-box-anime"
    }, /* @__PURE__ */ React.createElement(FuncBtn, {
      className: clsx("m78-dnd-box-anime_main", {
        __active: status.dragOver,
        __disabled: !enables.enable || status.dragging,
        __left: status.dragLeft,
        __top: status.dragTop,
        __right: status.dragRight,
        __bottom: status.dragBottom
      }),
      text: item.name,
      icon: item.icon,
      onClick: openTask,
      extraNode: length > 0 && /* @__PURE__ */ React.createElement(Badge, null, length > 1 ? length : void 0)
    }))));
  })));
};
const FuncLogo = () => {
  const config = taskSeed.useState(configGetter);
  const logo = (config == null ? void 0 : config.logo) || assetLogo;
  const name = (config == null ? void 0 : config.name) || "M78-Admin";
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_logo",
    title: name
  }, /* @__PURE__ */ React.createElement("img", {
    className: "m78-admin_func-bar_logo-img",
    src: logo,
    alt: name
  }), /* @__PURE__ */ React.createElement("div", {
    className: "ellipsis mt-4"
  }, name));
};
const FuncFoot = () => {
  const funcBarExtraNode = taskSeed.useState((state) => state.adminProps.funcBarExtraNode);
  if (!funcBarExtraNode)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_side"
  }, funcBarExtraNode));
};
const FuncBar = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar"
  }, /* @__PURE__ */ React.createElement(FuncLogo, null), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(FuncCollects, null), /* @__PURE__ */ React.createElement(FuncFoot, null));
};
const FuncList = () => {
  const tasks = taskSeed.useState((state) => state.taskOptions);
  const AuthPro = taskSeed.useState((state) => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const [popperShow, setPopperShow] = useState(false);
  const authKeyChangeFlag = useSubscribeAuthChange(AuthPro.authInstance.seed);
  const filterAuthTasks = useMemo(filterNotPassNode, [tasks, authKeyChangeFlag]);
  function filterNotPassNode() {
    if (!AuthPro)
      return tasks;
    const filterNodes = (list) => {
      const _tasks = [];
      if (!(list == null ? void 0 : list.length))
        return _tasks;
      list.forEach((item) => {
        if (isPassNode(item)) {
          const {height} = item, i = __rest(item, ["height"]);
          _tasks.push(i);
          return;
        }
        if ("children" in item && item.children.length) {
          const nChildren = filterNodes(item.children);
          if (nChildren == null ? void 0 : nChildren.length) {
            _tasks.push({
              name: item.name,
              children: nChildren
            });
          }
        }
      });
      return _tasks;
    };
    return filterNodes(tasks);
  }
  function renderAction(node) {
    var _a;
    if ((_a = node.children) == null ? void 0 : _a.length)
      return null;
    const collectFunc = (config == null ? void 0 : config.collectFunc) || [];
    const isCollectd = collectFunc.includes(node.id);
    return /* @__PURE__ */ React.createElement(Button, {
      size: "small",
      icon: true,
      onClick: () => collectHandle(node.id, collectFunc)
    }, isCollectd ? /* @__PURE__ */ React.createElement(StarFilled, {
      className: "color-warn",
      title: "\u53D6\u6D88\u6807\u8BB0"
    }) : /* @__PURE__ */ React.createElement(StarOutlined, {
      className: "color-second",
      title: "\u6807\u8BB0\u4E3A\u5E38\u7528\u529F\u80FD"
    }));
  }
  function chooseHandle({id, children}) {
    if (children == null ? void 0 : children.length)
      return;
    task.push(id);
    setPopperShow(false);
  }
  function renderContent() {
    return /* @__PURE__ */ React.createElement("div", {
      className: "func-list"
    }, /* @__PURE__ */ React.createElement("h3", null, "\u5168\u90E8\u529F\u80FD"), /* @__PURE__ */ React.createElement(Tree, {
      dataSource: filterAuthTasks,
      labelGetter: (item) => item.name,
      valueGetter: (item) => item.id || item.name,
      toolbar: true,
      rainbowIndicatorLine: true,
      height: 380,
      size: SizeEnum.large,
      defaultOpenZIndex: 1,
      onNodeClick: chooseHandle,
      actions: renderAction
    }));
  }
  return /* @__PURE__ */ React.createElement(Popper, {
    type: "popper",
    show: popperShow,
    onChange: setPopperShow,
    content: renderContent(),
    direction: PopperDirectionEnum.bottomStart
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true
  }, /* @__PURE__ */ React.createElement(MenuOutlined, {
    className: "fs-md"
  })));
};
const TaskTab = ({instance}) => {
  const opt = instance.option;
  return /* @__PURE__ */ React.createElement(ContextMenu, {
    content: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5237\u65B0",
      onClick: instance.refresh
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED\u5176\u4ED6\u7A97\u53E3",
      onClick: () => closeOtherTaskByKey(instance.taskKey)
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED\u5DE6\u4FA7\u7A97\u53E3",
      onClick: () => closeLeftTaskByKey(instance.taskKey)
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED\u53F3\u4FA7\u7A97\u53E3",
      onClick: () => closeRightTaskByKey(instance.taskKey)
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED",
      onClick: instance.dispose
    }))
  }, /* @__PURE__ */ React.createElement("span", {
    className: "m78-admin_task-tab",
    onClick: instance.open
  }, opt.icon, " ", /* @__PURE__ */ React.createElement(TaskNameDynamic, {
    ctx: instance
  }), /* @__PURE__ */ React.createElement("span", {
    className: "m78-admin_effect ml-4",
    title: "\u5173\u95ED\u7A97\u53E3",
    onClick: (e) => {
      e.stopPropagation();
      closeTaskByKey(instance.taskKey);
    }
  }, /* @__PURE__ */ React.createElement(CloseOutlined, {
    className: "m78-close-icon color-second"
  }))));
};
const TaskList = () => {
  const taskList = taskSeed.useState((state) => state.taskList);
  const scroller = useRef(null);
  const last = useRef();
  useEffect(() => {
    const f = setTimeout(() => {
      const meta = scroller.current.get();
      const xMax = meta.xMax;
      if (!last.current && xMax || last.current && xMax > last.current) {
        scroller.current.set({
          x: xMax,
          immediate: true
        });
      }
      last.current = xMax;
    }, 20);
    return () => clearTimeout(f);
  }, [taskList.length]);
  return /* @__PURE__ */ React.createElement(Scroller, {
    className: "m78-admin_task-bar_main",
    scrollFlag: true,
    hideScrollbar: true,
    direction: DirectionEnum.horizontal,
    ref: scroller
  }, taskList.map((item) => /* @__PURE__ */ React.createElement(TaskTab, {
    key: item.taskKey,
    instance: item
  })));
};
const TaskActions = () => {
  const aProps = taskSeed.useState((state) => state.adminProps);
  const config = aProps.config;
  const darkMode = (config == null ? void 0 : config.darkMode) || false;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Popper, {
    content: "\u6536\u8D77\u6240\u6709\u7A97\u53E3",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true,
    onClick: Wine.hideAll
  }, /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: 18}
  }, "\u{1F4D8}"))), /* @__PURE__ */ React.createElement(Popper, {
    content: "\u5C55\u5F00\u6240\u6709\u7A97\u53E3",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true,
    onClick: Wine.showAll
  }, /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: 18}
  }, "\u{1F4D6}"))), /* @__PURE__ */ React.createElement(Popper, {
    content: "\u5173\u95ED\u6240\u6709\u7A97\u53E3",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true,
    onClick: () => task.dispose()
  }, /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: 18}
  }, "\u{1F5D1}"))), aProps.taskBarExtraNode, /* @__PURE__ */ React.createElement(Check, {
    className: "ml-12",
    type: "switch",
    switchOff: /* @__PURE__ */ React.createElement("span", {
      style: {fontSize: 16}
    }, "\u{1F31E}"),
    switchOn: /* @__PURE__ */ React.createElement("span", {
      style: {fontSize: 16}
    }, "\u{1F31B}"),
    checked: darkMode,
    onChange: (toggle) => {
      emitConfig({
        darkMode: toggle
      });
    }
  }));
};
const TaskBar = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_task-bar"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_task-bar_before"
  }, /* @__PURE__ */ React.createElement(FuncList, null)), /* @__PURE__ */ React.createElement(Divider, {
    vertical: true,
    className: "h-1d4em"
  }), /* @__PURE__ */ React.createElement(TaskList, null), /* @__PURE__ */ React.createElement(Divider, {
    vertical: true,
    className: "h-1d4em"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_task-bar_action"
  }, /* @__PURE__ */ React.createElement(TaskActions, null)));
};
const DesktopItems = () => {
  const aProps = taskSeed.useState((state) => state.adminProps);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_desktop-node"
  }, aProps.desktopNode), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_desc"
  }, aProps.footerNode || /* @__PURE__ */ React.createElement(React.Fragment, null, "POWER BY |-", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/xianjie-li/m78",
    target: "_blank",
    rel: "noreferrer"
  }, "M78"), "-| |-", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/xianjie-li",
    target: "_blank",
    rel: "noreferrer"
  }, "Lime"), "-|")));
};
const BaseLayout = () => {
  const width = taskSeed.useState((state) => state.adminProps.width);
  const height = taskSeed.useState((state) => state.adminProps.height);
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout",
    style: {
      height,
      width
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_side"
  }, /* @__PURE__ */ React.createElement(FuncBar, null)), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_main"
  }, /* @__PURE__ */ React.createElement(TaskBar, null), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_window"
  }, /* @__PURE__ */ React.createElement(Wine.RenderBoxTarget, null), /* @__PURE__ */ React.createElement(DesktopItems, null))));
};
const Handles = () => {
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 680) {
        WINE_OFFSET.left = 0;
      } else {
        WINE_OFFSET.left = WINE_OFFSET_LEFT;
      }
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return null;
};
const M78AdminCore = (props) => {
  const {tasks} = props;
  const [pass, setPass] = useState(false);
  useEffect(() => {
    taskSeed.setState(taskOptFormat(tasks));
    if (!pass)
      setPass(true);
  }, []);
  useSyncWineTask();
  if (!pass)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ConfigSync, null), /* @__PURE__ */ React.createElement(Handles, null), /* @__PURE__ */ React.createElement(BaseLayout, null));
};
function M78AdminImpl(props) {
  useEffect(() => {
    taskSeed.setState({
      adminProps: props
    });
  }, [props]);
  if (props.loading) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "m78-admin_blocked-loading"
    }, /* @__PURE__ */ React.createElement(Spin, {
      size: "big",
      text: "",
      full: true
    }));
  }
  return /* @__PURE__ */ React.createElement(M78AdminCore, __assign({}, props));
}
const FuncBtn = (_a) => {
  var {icon, text, extraNode, small, circle, className, style} = _a, ppp = __rest(_a, ["icon", "text", "extraNode", "small", "circle", "className", "style"]);
  return /* @__PURE__ */ React.createElement("div", __assign({
    className: clsx("m78-admin_func-bar_func", className, small && "__small", circle && "__circle"),
    style
  }, ppp), !circle && /* @__PURE__ */ React.createElement(React.Fragment, null, icon && /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_icon"
  }, icon), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_text ellipsis-2"
  }, text)), circle && /* @__PURE__ */ React.createElement("div", {
    className: "ellipsis"
  }, text), extraNode);
};
const Badge = ({children, out, color}) => {
  return /* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_badge", out && "__out", color && `__${color}`)
  }, children);
};
const Login = ({logo, title, desc, content}) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login-bg"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login-content"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "tc mb-24"
  }, logo && /* @__PURE__ */ React.createElement("img", {
    style: {width: 120},
    src: logo,
    alt: ""
  }), title && /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login-title"
  }, title), desc && /* @__PURE__ */ React.createElement("div", {
    className: "color-second"
  }, desc)), content));
};
var TaskWindowTopBarTypeKeys;
(function(TaskWindowTopBarTypeKeys2) {
  TaskWindowTopBarTypeKeys2["toggle"] = "toggle";
  TaskWindowTopBarTypeKeys2["eclipse"] = "eclipse";
  TaskWindowTopBarTypeKeys2["always"] = "always";
})(TaskWindowTopBarTypeKeys || (TaskWindowTopBarTypeKeys = {}));
const builtInToggleIconRender = (toggle) => /* @__PURE__ */ React.createElement("span", {
  className: clsx("m78-admin_window-layout_top-bar-icon", toggle && "__active")
}, "\u2699");
function WindowLayout(_b) {
  var {
    children,
    side,
    anchors,
    footer,
    className,
    style,
    scrollRef,
    sideTabs,
    topBar,
    topBarType = TaskWindowTopBarTypeKeys.toggle,
    topBarDefaultShow = false,
    topBarIconCustomer = builtInToggleIconRender
  } = _b, ppp = __rest(_b, [
    "children",
    "side",
    "anchors",
    "footer",
    "className",
    "style",
    "scrollRef",
    "sideTabs",
    "topBar",
    "topBarType",
    "topBarDefaultShow",
    "topBarIconCustomer"
  ]);
  const [cLabel, setCLabel] = useState("");
  const self = useSelf();
  const calcNodeRef = useRef(null);
  const scrollNodeRef = useRef(null);
  const [topBarVisible, setBotBarVisible] = useState(topBarDefaultShow);
  const [sideVisible, setSideVisible] = useState(false);
  useEffect(() => {
    if (!(sideTabs == null ? void 0 : sideTabs.length)) {
      self.sections = null;
      return;
    }
    if (!cLabel)
      setCLabel(sideTabs[0].label);
    return retry(() => {
      var _a;
      self.sections = sideTabs.map((item) => ({
        el: scrollNodeRef.current.querySelector(item.selector),
        opt: item
      })).filter((item) => !!item.el);
      console.log(self.sections);
      return !((_a = self.sections) == null ? void 0 : _a.length);
    }, 1e3, {maxRetry: 5});
  }, [sideTabs]);
  const scrollHandle = useFn(() => {
    var _a;
    if ((_a = self.sections) == null ? void 0 : _a.length) {
      const {top, height} = calcNodeRef.current.getBoundingClientRect();
      const h = height * 2;
      const visibleNodes = self.sections.filter((it) => {
        const bound = it.el.getBoundingClientRect();
        return bound.top - h < top;
      });
      if (visibleNodes.length) {
        const current = visibleNodes[visibleNodes.length - 1];
        const lb = current.opt.label;
        lb !== cLabel && setCLabel(lb);
      }
    }
  });
  const sc = useScroll({
    el: scrollNodeRef,
    onScroll: scrollHandle
  });
  const scrollToNode = useFn((label, selector) => {
    setCLabel(label);
    sc.scrollToElement(selector, true);
  });
  function renderSide() {
    if (!side && !(sideTabs == null ? void 0 : sideTabs.length))
      return null;
    let sideNode = side;
    if (sideTabs == null ? void 0 : sideTabs.length) {
      sideNode = /* @__PURE__ */ React.createElement(Scroller, {
        className: "m78-admin_window-layout_tab",
        scrollFlag: true,
        hideScrollbar: true
      }, sideTabs.map((item) => /* @__PURE__ */ React.createElement("div", {
        key: item.label,
        title: item.label,
        className: clsx("m78-admin_window-layout_tab-item", {
          __active: cLabel === item.label
        }),
        onClick: () => scrollToNode(item.label, item.selector)
      }, item.label)));
    }
    return /* @__PURE__ */ React.createElement(MediaQuery, null, (meta) => {
      const isSmall = meta.isSmall();
      return /* @__PURE__ */ React.createElement("div", {
        className: clsx("m78-admin_window-layout_side", {
          __responsive: isSmall,
          __hide: isSmall && !sideVisible
        })
      }, sideNode, isSmall && /* @__PURE__ */ React.createElement("span", {
        title: topBarVisible ? "\u6536\u8D77\u4FA7\u680F" : "\u5C55\u5F00\u4FA7\u680F",
        className: "m78-admin_window-layout_side-toggle",
        onClick: () => setSideVisible((p) => !p)
      }, "\u{1F4D1}"));
    });
  }
  const isAlways = topBarType === TaskWindowTopBarTypeKeys.always;
  const isToggle = topBarType === TaskWindowTopBarTypeKeys.toggle;
  return /* @__PURE__ */ React.createElement("div", __assign({
    className: clsx("m78-admin_window-layout", className),
    style
  }, ppp), renderSide(), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_window-layout_main"
  }, topBar && /* @__PURE__ */ React.createElement("div", {
    className: clsx("m78-admin_window-layout_top-bar-wrap", isToggle && !topBarVisible && "__hide")
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_window-layout_top-bar m78-scrollbar"
  }, isFunction(topBar) ? topBar(topBarVisible) : topBar), !isAlways && /* @__PURE__ */ React.createElement("span", {
    title: topBarVisible ? "\u6536\u8D77\u9876\u680F" : "\u5C55\u5F00\u9876\u680F",
    className: "m78-admin_window-layout_top-bar-toggler",
    onClick: () => setBotBarVisible((p) => !p)
  }, topBarIconCustomer(topBarVisible))), /* @__PURE__ */ React.createElement("div", {
    ref: scrollNodeRef,
    className: "m78-admin_window-layout_content m78-scrollbar"
  }, children), footer && /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_window-layout_footer tr"
  }, footer), /* @__PURE__ */ React.createElement("div", {
    ref: calcNodeRef,
    className: "m78-admin_window-layout_calc-node"
  })));
}
const Link = (_c) => {
  var {children, replace: replace2, id, param, blank, className, style} = _c, ppp = __rest(_c, ["children", "replace", "id", "param", "blank", "className", "style"]);
  const ctx$1 = useContext(ctx);
  const openHandle = useFn(() => {
    if (blank) {
      replace2 ? task.replace(id, param) : task.push(id, param);
      return;
    }
    if (replace2) {
      ctx$1.parent ? ctx$1.parent.replace(id, param) : task.replace(id, param);
      return;
    }
    ctx$1.parent ? ctx$1.parent.push(id, param) : task.push(id, param);
  });
  if (typeof children === "string") {
    return /* @__PURE__ */ React.createElement("span", __assign(__assign({}, ppp), {
      className: clsx("m78-admin_link", className),
      style,
      onClick: openHandle
    }), children);
  }
  return React.cloneElement(children, {
    onClick: openHandle
  });
};
export {Badge, FuncBtn, Link, Login, M78AdminImpl as M78Admin, TaskWindowTopBarTypeKeys, WindowLayout, task};
