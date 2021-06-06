import React, { useEffect, useRef, useState } from 'react';
import { Scroller } from 'm78/scroller';
import { isFunction, retry } from '@lxjx/utils';
import clsx from 'clsx';
import { useFn, useScroll, useSelf } from '@lxjx/hooks';
import { MediaQuery } from 'm78/layout';
import {
  TaskWindowLayoutProps,
  TaskWindowTopBarTypeKeys,
  WindowLayoutSectionProps,
} from '../../types';

interface Self {
  /** 存放所有sections节点的html节点 */
  sections: Array<{
    /** 该选项对应的html节点 */
    el: HTMLDivElement;
    /** 对应的选项 */
    opt: WindowLayoutSectionProps;
  }> | null;
}

/** 内置顶栏按钮渲染器 */
const builtInToggleIconRender: TaskWindowLayoutProps['topBarIconCustomer'] = (toggle: boolean) => (
  <span className={clsx('m78-admin_window-layout_top-bar-icon', toggle && '__active')}>⚙</span>
);

/**
 * 为窗口提供可选的基础布局:
 * - 包含内容区域、底部操作区、侧栏、顶栏
 * */
function WindowLayout({
  children,
  side,
  anchors,
  footer,
  className,
  style,
  scrollRef,
  sideTabs,
  topBar,
  topBarType = TaskWindowTopBarTypeKeys.toggle,
  topBarDefaultShow = false,
  topBarIconCustomer = builtInToggleIconRender,
  ...ppp
}: TaskWindowLayoutProps) {
  /** 当前选中节点的tab */
  const [cLabel, setCLabel] = useState('');

  const self = useSelf<Self>();

  /** 计算节点，用于方便的计算当前应该展开的tab */
  const calcNodeRef = useRef<HTMLDivElement>(null!);

  /** 滚动容器节点 */
  const scrollNodeRef = useRef<HTMLDivElement>(null!);

  /** 控制顶栏可见 */
  const [topBarVisible, setBotBarVisible] = useState(topBarDefaultShow);
  /** 控制小屏下的side栏的可见状态 */
  const [sideVisible, setSideVisible] = useState(false);

  useEffect(() => {
    if (!sideTabs?.length) {
      self.sections = null;
      return;
    }

    if (!cLabel) setCLabel(sideTabs[0].label);

    return retry(
      () => {
        self.sections = sideTabs
          .map(item => ({
            el: scrollNodeRef.current.querySelector(item.selector),
            opt: item,
          }))
          .filter(item => !!item.el) as any;

        console.log(self.sections);

        return !self.sections?.length;
      },
      1000,
      { maxRetry: 5 },
    ) as any;
  }, [sideTabs]);

  const scrollHandle = useFn(() => {
    if (self.sections?.length) {
      const { top, height } = calcNodeRef.current.getBoundingClientRect();

      const h = height * 2;

      const visibleNodes = self.sections.filter(it => {
        const bound = it.el.getBoundingClientRect();
        return bound.top - h < top;
      });

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
  const scrollToNode = useFn((label: string, selector: string) => {
    setCLabel(label);
    /* TODO: 设置滚动动画会因为组件更新被打断？检测是否为react-spring的问题 */
    sc.scrollToElement(selector, true);
  });

  /** 渲染侧栏区域 */
  function renderSide() {
    if (!side && !sideTabs?.length) return null;

    let sideNode: React.ReactNode = side;

    if (sideTabs?.length) {
      sideNode = (
        <Scroller className="m78-admin_window-layout_tab" scrollFlag hideScrollbar>
          {sideTabs.map(item => (
            <div
              key={item.label}
              title={item.label}
              className={clsx('m78-admin_window-layout_tab-item', {
                __active: cLabel === item.label,
              })}
              onClick={() => scrollToNode(item.label, item.selector)}
            >
              {item.label}
            </div>
          ))}
        </Scroller>
      );
    }

    return (
      <MediaQuery>
        {meta => {
          const isSmall = meta.isSmall();

          return (
            <div
              className={clsx('m78-admin_window-layout_side', {
                __responsive: isSmall,
                __hide: isSmall && !sideVisible,
              })}
            >
              {sideNode}
              {isSmall && (
                <span
                  title={topBarVisible ? '收起侧栏' : '展开侧栏'}
                  className="m78-admin_window-layout_side-toggle"
                  onClick={() => setSideVisible(p => !p)}
                >
                  📑
                </span>
              )}
            </div>
          );
        }}
      </MediaQuery>
    );
  }

  const isAlways = topBarType === TaskWindowTopBarTypeKeys.always;
  const isToggle = topBarType === TaskWindowTopBarTypeKeys.toggle;

  return (
    <div className={clsx('m78-admin_window-layout', className)} style={style} {...ppp}>
      {renderSide()}

      <div className="m78-admin_window-layout_main">
        {topBar && (
          <div
            className={clsx(
              'm78-admin_window-layout_top-bar-wrap',
              isToggle && !topBarVisible && '__hide',
            )}
          >
            <div className="m78-admin_window-layout_top-bar m78-scrollbar">
              {isFunction(topBar) ? topBar(topBarVisible) : topBar}
            </div>
            {!isAlways && (
              <span
                title={topBarVisible ? '收起顶栏' : '展开顶栏'}
                className="m78-admin_window-layout_top-bar-toggler"
                onClick={() => setBotBarVisible(p => !p)}
              >
                {topBarIconCustomer!(topBarVisible)}
              </span>
            )}
          </div>
        )}

        <div ref={scrollNodeRef} className="m78-admin_window-layout_content m78-scrollbar">
          {children}
        </div>
        {footer && <div className="m78-admin_window-layout_footer tr">{footer}</div>}
        <div ref={calcNodeRef} className="m78-admin_window-layout_calc-node" />
      </div>
    </div>
  );
}

export default WindowLayout;
