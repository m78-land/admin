/// <reference types="react" />
import { TaskCtx } from '../../types';
interface Props {
    ctx: TaskCtx;
}
/**
 * 控制子任务的列表显示、操作等
 * */
declare const Crumbs: ({ ctx }: Props) => JSX.Element | null;
export default Crumbs;
