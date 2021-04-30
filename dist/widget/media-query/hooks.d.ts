import { MediaQueryProps, MediaQuerySizeMete, MediaQueryTypeMete } from '../../types';
/**
 * 窗口尺寸改变时通过回调通知
 * */
export declare function useMediaQuery(onChange: MediaQueryProps['onChange']): void;
/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export declare function useMediaQuerySize(): MediaQuerySizeMete | null;
/**
 * 窗口尺寸类型改变时通过回调通知传入子项帮助渲染
 * */
export declare function useMediaQueryType(): MediaQueryTypeMete | null;
