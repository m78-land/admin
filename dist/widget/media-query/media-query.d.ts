/// <reference types="react" />
import { MediaQueryProps, MediaQuerySizeProps, MediaQueryTypeProps } from '../../types';
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
declare function MediaQuerySize({ children }: MediaQuerySizeProps): import("react").ReactElement<any, any> | null;
/**
 * 窗口尺寸类型改变时通过回调通知传入子项帮助渲染
 * */
declare function MediaQueryType({ children }: MediaQueryTypeProps): import("react").ReactElement<any, any> | null;
export { MediaQuerySize, MediaQueryType };
export default MediaQuery;
