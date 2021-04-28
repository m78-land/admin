import React, { useContext, useEffect } from 'react';
import { useMeasure } from '@lxjx/hooks';
import { mediaQueryCtx } from './context';

/**
 * 附加到某个包含非常规定位属性的元素上并对其尺寸进行持续测量, 通过mediaQueryCtx回调变更
 * */
const MediaQueryCalc = () => {
  const [ref, bound] = useMeasure<HTMLDivElement>();

  const mqCtx = useContext(mediaQueryCtx);

  useEffect(() => {
    // 过滤掉无效回调
    if (bound.width === 0 && bound.height === 0) return;
    mqCtx.onChange(bound);
  }, [bound]);

  return <div ref={ref} className="m78-admin_media-query_calc-node" />;
};

export default MediaQueryCalc;
