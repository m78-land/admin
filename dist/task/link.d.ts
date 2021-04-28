import { TaskLinkProps } from '../types';
/**
 * 开启任务的快捷方式，其底层是ctx.push/ctx.replace等方法
 * - 如果组件处理一个任务窗口实例内部，会在该窗口打开子任务，如果在实例外则会通过新任务窗口打开任务
 * - 根据子项类型不同会有不同的行为:
 *    * 子项为string时，会渲染一个内联节点，并且会透接收到的props(style/className等)
 *    * 子项为ReactElement时，其必须是能接收onClick事件的元素
 * */
declare const Link: ({ children, replace, id, param, blank, className, style, ...ppp }: TaskLinkProps) => JSX.Element;
export default Link;
