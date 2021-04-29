import React, { useEffect, useMemo, useRef, useState } from 'react';
import Scroller from 'm78/scroller';
import { checkElementVisible, isArray } from '@lxjx/utils';
import clsx from 'clsx';
import { useFn, useScroll, useSelf } from '@lxjx/hooks';
import { Spacer } from 'm78/layout';
import { isLayoutSection, SECTION_SELECTOR_PREFIX } from './common';
import { TaskWindowLayoutProps, WindowLayoutSectionProps } from '../../types';
import MediaQueryContext from '../media-query/media-query-context';
import MediaQueryCalc from '../media-query/media-query-calc';

interface Self {
  /** 存放所有sections节点的html节点 */
  sections: Array<{
    /** 该选项对应的html节点 */
    el: HTMLDivElement;
    /** 对应的选项 */
    opt: WindowLayoutSectionProps;
  }> | null;
}

/**
 * 为窗口提供可选的窗口基础布局:
 * - 包含内容区域、窗口底部操作区、侧栏
 * - 子项包含多个WindowLayoutSection时，会在侧栏生成帮助快速跳转的tab
 * - 使用MediaQuery系列组件进行媒体查询时，此组件是必选的父组件
 * */
function WindowLayout({ children, side, footer, className, style }: TaskWindowLayoutProps) {
  /** 当前选中节点的tab */
  const [cLabel, setCLabel] = useState('角色管理操作1');

  const self = useSelf<Self>();

  /** 计算节点，用于方便的计算当前应该展开的tab */
  const calcNodeRef = useRef<HTMLDivElement>(null!);

  /** 滚动容器节点 */
  const scrollNodeRef = useRef<HTMLDivElement>(null!);

  /** 处理子项并从中生成tab选项数据 */
  const tabOpt = useMemo(() => {
    if (!children) return null;

    if (isArray(children)) {
      const sessionOpt = children.filter(isLayoutSection).map(session => session.props);
      if (sessionOpt.length) return sessionOpt;
    }

    if (isLayoutSection(children)) {
      return [children.props];
    }

    return null;
  }, [children]);

  // 根据tabOpt获取所有section渲染节点并设置到self.sections
  useEffect(() => {
    if (!tabOpt || !tabOpt.length) {
      self.sections = null;
      return;
    }

    self.sections = tabOpt
      .map(item => ({
        el: scrollNodeRef.current.querySelector(`#${SECTION_SELECTOR_PREFIX}${item.label}`),
        opt: item,
      }))
      .filter(item => !!item.el) as any;
  }, [tabOpt]);

  const scrollHandle = useFn(() => {
    if (self.sections?.length) {
      const visibleNodes = self.sections.filter(
        item =>
          checkElementVisible(item.el, {
            wrapEl: calcNodeRef.current,
          }).visible,
      );

      if (visibleNodes.length) {
        const current = visibleNodes[visibleNodes.length - 1];
        const lb = current.opt.label;
        lb !== cLabel && setCLabel(lb);
      }
    }
  });

  /** 控制内容区域滚动 */
  const sc = useScroll<HTMLDivElement>({
    el: scrollNodeRef,
    onScroll: scrollHandle,
  });

  /** 滚动到指定label的节点 */
  const scrollToNode = useFn((label: string) => {
    setCLabel(label);
    /* TODO: 设置滚动动画会因为组件更新被打断？检测是否为react-spring的问题 */
    sc.scrollToElement(`#${SECTION_SELECTOR_PREFIX}${label}`, true);
  });

  /** 渲染侧栏区域 */
  function renderSide() {
    if (!side && !tabOpt) return null;

    if (tabOpt) {
      return (
        <div className="m78-admin_window-layout_side">
          <Scroller className="m78-admin_window-layout_tab" scrollFlag hideScrollbar>
            {tabOpt.map(item => (
              <div
                key={item.label}
                title={item.desc || item.label}
                className={clsx('m78-admin_window-layout_tab-item', {
                  __active: cLabel === item.label,
                })}
                onClick={() => scrollToNode(item.label)}
              >
                {item.label}
              </div>
            ))}
          </Scroller>
        </div>
      );
    }

    return <div className="m78-admin_window-layout_side">{side}</div>;
  }

  return (
    <MediaQueryContext>
      <div className={clsx('m78-admin_window-layout', className)} style={style}>
        {renderSide()}

        <div className="m78-admin_window-layout_main">
          <div ref={scrollNodeRef} className="m78-admin_window-layout_content m78-scrollbar">
            {children}

            {/* 留白 */}
            {/* <Spacer height={100} />*/}
          </div>
          {footer && <div className="m78-admin_window-layout_footer tr">{footer}</div>}
          <div ref={calcNodeRef} className="m78-admin_window-layout_calc-node" />
        </div>

        <MediaQueryCalc />
      </div>
    </MediaQueryContext>
  );
}

export default WindowLayout;
