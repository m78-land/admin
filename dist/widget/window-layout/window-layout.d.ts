/// <reference types="react" />
import { TaskWindowLayoutProps } from '../../types';
/**
 * 为窗口提供可选的基础布局:
 * - 包含内容区域、底部操作区、侧栏、顶栏
 * */
declare function WindowLayout({ children, side, anchors, footer, className, style, scrollRef, sideTabs, topBar, topBarType, topBarDefaultShow, topBarIconCustomer, ...ppp }: TaskWindowLayoutProps): JSX.Element;
export default WindowLayout;
