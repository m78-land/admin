import React from 'react';
import { WindowLayoutSectionProps } from '../../types';
import WindowLayoutSection from './window-layout-section';

/** 块前缀 */
export const SECTION_SELECTOR_PREFIX = 'M78_WINDOW_LAYOUT_SECTION_';

/** 是否是WindowLayoutSection组件的实例 */
export function isLayoutSection(el: any): el is React.ReactElement<WindowLayoutSectionProps> {
  return React.isValidElement(el) && el.type === WindowLayoutSection;
}
