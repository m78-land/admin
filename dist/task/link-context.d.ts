/// <reference types="react" />
import { TaskCtx } from '../types/types';
/**
 * 管理Link组件的上下文，帮助其区分是否属于某个任务的子任务
 * */
declare const ctx: import("react").Context<{
    parent?: TaskCtx<any> | undefined;
}>;
export default ctx;
