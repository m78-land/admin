import React from 'react';
import { WindowLayoutSectionProps } from '../../types';
import { SECTION_SELECTOR_PREFIX } from './common';

/**
 * 提供可选的窗口基础的内容块，作为WindowLayout的子项时，会自动在其侧栏生成tab
 * */
export default function WindowLayoutSection({ children, label, desc }: WindowLayoutSectionProps) {
  return (
    <div id={`${SECTION_SELECTOR_PREFIX}${label}`} className="m78-admin_window-layout_section">
      {(label || desc) && (
        <div className="m78-admin_window-layout_section-main">
          {label && <span className="m78-admin_window-layout_section-title">{label}</span>}
          {desc && <span className="color-second fs ml-8">{desc}</span>}
        </div>
      )}
      <div className="m78-admin_window-layout_section-content">{children}</div>
    </div>
  );
}
