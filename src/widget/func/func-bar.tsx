import React, { useEffect, useMemo } from 'react';
import { Scroller } from 'm78/scroller';
import { MenuFoldOutlined, MenuUnfoldOutlined } from 'm78/icon';
import { Divider, Row, Spacer } from 'm78/layout';
import clsx from 'clsx';
import { useDelayToggle } from '@lxjx/hooks';
import { Portal } from 'm78/portal';
import FuncList from './func-list';
import FuncCollects from './func-collects';
import FuncLogo from './func-logo';
import taskSeed from '../../task/task-seed';
import { configGetter, emitConfig } from '../../common/common';
import FuncFoot from './func-foot';
import { FUNC_BAR_WIDTH, WINE_OFFSET } from '../../common/const';
import { getTaskOpt, isPassNode } from '../../task/methods';

const FuncBar = () => {
  const insideFuncBarFloat = taskSeed.useState(state => state.funcBarFloat);
  const {
    funcBarCollectToggle = false,
    funcBarFuncToggle = true,
    funcBarFloat = false,
    collectFunc = [],
  } = taskSeed.useState(configGetter) || {};

  const isFloat = insideFuncBarFloat || funcBarFloat;

  const validCollectFunc = useMemo(() => collectFunc.filter(id => isPassNode(getTaskOpt(id))), [
    collectFunc,
  ]);

  // 启用功能菜单的hover展开收起效果，用于实现延迟菜单初次设置为悬浮后延迟收起
  const enableHover = useDelayToggle(isFloat, 1000);

  // 浮动方式变更时，更新bound
  useEffect(() => {
    if (isFloat) {
      WINE_OFFSET.left = 0;
    } else {
      WINE_OFFSET.left = FUNC_BAR_WIDTH;
    }
  }, [isFloat]);

  // 收藏数为0时，自动收起收藏菜单, 否则自动展开
  useEffect(() => {
    // 状态为展开切无收藏内容, 关闭
    if (funcBarCollectToggle && validCollectFunc.length === 0) {
      emitConfig({
        funcBarCollectToggle: false,
      });
    }

    // 未展开且包含收藏内容
    if (!funcBarCollectToggle && validCollectFunc.length) {
      emitConfig({
        funcBarCollectToggle: true,
      });
    }
  }, [validCollectFunc.length]);

  function render() {
    return (
      <div
        className={clsx('m78-admin_func-bar', {
          __fixed: isFloat,
          __hover: enableHover,
        })}
      >
        <Row crossAlign="center">
          <FuncLogo />
          <span
            className="m78-admin_effect __inline ml-4 fs-18 color-second"
            onClick={() => {
              emitConfig({
                funcBarFloat: !isFloat,
              });
            }}
          >
            {isFloat && <MenuFoldOutlined />}
            {!isFloat && <MenuUnfoldOutlined />}
          </span>
        </Row>

        <Divider />

        <Scroller className="m78-admin_func-bar_main" hideScrollbar scrollFlag>
          <div>
            <div
              className="m78-admin_effect __inline color-second mb-8"
              onClick={() => {
                emitConfig({
                  funcBarCollectToggle: !funcBarCollectToggle,
                });
              }}
            >
              收藏 ({validCollectFunc.length})
            </div>
            {funcBarCollectToggle && (
              <>
                <FuncCollects />
                {!validCollectFunc.length && (
                  <div className="tc color-second fs-sm">暂无收藏喔~</div>
                )}
                <Spacer height={24} />
              </>
            )}
          </div>

          <div>
            <div
              className="m78-admin_effect __inline color-second mb-8"
              onClick={() => {
                emitConfig({
                  funcBarFuncToggle: !funcBarFuncToggle,
                });
              }}
            >
              功能菜单
            </div>
            {funcBarFuncToggle && (
              <>
                <FuncList />
                <Spacer height={24} />
              </>
            )}
          </div>
        </Scroller>

        <FuncFoot />
      </div>
    );
  }

  return (
    <>
      <div style={{ width: isFloat ? 0 : FUNC_BAR_WIDTH, transition: '0.4s' }} />
      <Portal>{render()}</Portal>
    </>
  );
};

export default FuncBar;
