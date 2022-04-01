import { createContext } from 'react';
import { TaskCtx } from '../types/types';

/**
 * 管理Link组件的上下文，帮助其区分是否属于某个任务的子任务
 * */
const ctx = createContext<{
  parent?: TaskCtx;
}>({});

export default ctx;
