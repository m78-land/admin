import React, { useContext, useEffect } from 'react';
import { WindowLayoutSectionProps } from '../../types';
import { SECTION_SELECTOR_PREFIX } from './common';
import { windowLayoutCtx } from './context';

/**
 * 提供可选的窗口基础的内容块，作为WindowLayout的子项时，会自动在其侧栏生成tab
 * */
export default function WindowLayoutSection(props: WindowLayoutSectionProps) {
  const { children, label, desc } = props;

  const wlCtx = useContext(windowLayoutCtx);

  useEffect(() => {
    wlCtx.sectionList.push(props);
    wlCtx.update();

    return () => {
      const ind = wlCtx.sectionList.findIndex(item => item.label === label);
      wlCtx.sectionList.splice(ind, 1);
      wlCtx.update();
    };
  }, []);

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
