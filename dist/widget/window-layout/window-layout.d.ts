import { TaskWindowLayoutProps } from '../../types';
/**
 * 为窗口提供可选的窗口基础布局:
 * - 包含内容区域、窗口底部操作区、侧栏、顶栏
 * - 使用MediaQuery系列组件进行媒体查询时，此组件是必选的父组件
 * */
declare function WindowLayout({ children, side, anchors, footer, className, style, scrollRef, sideTabs, topBar, topBarAlwaysShow, topBarIcon, ...ppp }: TaskWindowLayoutProps): JSX.Element;
export default WindowLayout;
