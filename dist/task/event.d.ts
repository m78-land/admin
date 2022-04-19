/**
 * 某个任务改变时，通过key来通知相关组件更新
 * */
export declare const updateByKeyEvent: import("@lxjx/hooks").CustomEventWithHook<(key: string) => void>;
/**
 * 用于实现任务组件的refresh()
 * */
export declare const refreshEvent: import("@lxjx/hooks").CustomEventWithHook<(key: string) => void>;
