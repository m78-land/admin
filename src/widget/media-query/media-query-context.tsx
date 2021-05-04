import React, { useRef } from 'react';
import { useFn } from '@lxjx/hooks';
import { isArray } from '@lxjx/utils';
import { _MediaQueryTypeContext, MediaQueryMete, MediaQueryTypeKey } from '../../types';
import { mediaQueryCtx } from './context';
import { calcType } from './common';

/**
 * 提供MediaQuery上下文，只有其内部的MediaQuery系列组件会生效
 * */
const MediaQueryContext: React.FC = ({ children }) => {
  const value = useRef<_MediaQueryTypeContext>({
    onChange: () => {},
    changeListeners: [],
    meta: null,
  });

  value.current.onChange = useFn<_MediaQueryTypeContext['onChange']>(({ width, height }) => {
    const type = calcType(width);

    const changeListeners = value.current.changeListeners;

    const size = {
      width,
      height,
    };

    const is = {
      isXS: () => type === MediaQueryTypeKey.XS,
      isSM: () => type === MediaQueryTypeKey.SM,
      isMD: () => type === MediaQueryTypeKey.MD,
      isLG: () => type === MediaQueryTypeKey.LG,
      isXL: () => type === MediaQueryTypeKey.XL,
      isXXL: () => type === MediaQueryTypeKey.XXL,
      isSmall: () => is.isXS() || is.isSM(),
      isMedium: () => is.isMD() || is.isLG(),
      isLarge: () => !is.isSmall() && !is.isMedium(),
    };

    const full: MediaQueryMete = { ...size, type, ...is };
    value.current.meta = full;

    if (isArray(changeListeners)) {
      changeListeners.forEach(fn => fn(full));
    }
  });

  return <mediaQueryCtx.Provider value={value.current}>{children}</mediaQueryCtx.Provider>;
};

export default MediaQueryContext;
