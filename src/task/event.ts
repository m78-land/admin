import { createEvent } from '@lxjx/hooks';

/**
 * 某个任务改变时，通过key来通知相关组件更新
 * */
export const updateByKeyEvent = createEvent<(key: string) => void>();

/**
 * 用于实现任务组件的refresh()
 * */
export const refreshEvent = createEvent<(key: string) => void>();
