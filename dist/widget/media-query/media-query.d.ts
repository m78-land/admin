import React from 'react';
import { MediaQueryMete, MediaQuerySizeMete, MediaQueryTypeMete } from '../../types';
interface MediaQueryProps {
    onChange: (meta: MediaQueryMete) => void;
}
interface MediaQuerySizeProps {
    children: (sizeMeta: MediaQuerySizeMete) => React.ReactNode;
}
interface MediaQueryTypeProps {
    children: (sizeMeta: MediaQueryTypeMete) => React.ReactNode;
}
/**
 * 窗口尺寸改变时通过回调通知
 * */
declare function MediaQuery({ onChange }: MediaQueryProps): null;
declare namespace MediaQuery {
    var Size: typeof MediaQuerySize;
    var Type: typeof MediaQueryType;
}
/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
declare function MediaQuerySize({ children }: MediaQuerySizeProps): JSX.Element;
/**
 * 窗口尺寸类型改变时通过回调通知传入子项帮助渲染
 * */
declare function MediaQueryType({ children }: MediaQueryTypeProps): JSX.Element;
export { MediaQuerySize, MediaQueryType };
export default MediaQuery;
