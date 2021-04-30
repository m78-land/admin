import { createContext } from 'react';
import { WindowLayoutSectionProps } from '../../types';

export interface WindowLayoutContext {
  /** 当前存在的所有sectionList */
  sectionList: WindowLayoutSectionProps[];
  /** 通知父组件sectionList更新 */
  update: () => void;
}

export const windowLayoutCtx = createContext<WindowLayoutContext>({
  sectionList: [],
  update: () => {},
});
