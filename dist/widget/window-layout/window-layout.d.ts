import { TaskWindowLayoutProps } from '../../types';
/**
 * 为窗口提供可选的窗口基础布局:
 * - 包含内容区域、窗口底部操作区、侧栏
 * - 子项包含多个WindowLayoutSection时，会在侧栏生成帮助快速跳转的tab
 * - 使用MediaQuery系列组件进行媒体查询时，此组件是必选的父组件
 * */
declare function WindowLayout({ children, side, anchors, footer, className, style, scrollRef, ...ppp }: TaskWindowLayoutProps): JSX.Element;
export default WindowLayout;
