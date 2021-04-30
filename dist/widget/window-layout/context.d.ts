/// <reference types="react" />
import { WindowLayoutSectionProps } from '../../types';
export interface WindowLayoutContext {
    /** 当前存在的所有sectionList */
    sectionList: WindowLayoutSectionProps[];
    /** 通知父组件sectionList更新 */
    update: () => void;
}
export declare const windowLayoutCtx: import("react").Context<WindowLayoutContext>;
