import React, { useRef } from 'react';
import { useFn } from '@lxjx/hooks';
import { isArray } from '@lxjx/utils';
import { _MediaQueryTypeContext, MediaQueryTypeKey } from '../../types';
import { mediaQueryCtx } from './context';
import { calcType } from './common';

/**
 * 提供MediaQuery上下文，只有其内部的MediaQuery系列组件会生效
 * */
const MediaQueryContext: React.FC = ({ children }) => {
  const value = useRef<_MediaQueryTypeContext>({
    onChange: () => {},
    changeListeners: [],
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
    };

    if (isArray(changeListeners)) {
      changeListeners.forEach(fn => fn({ ...size, type, ...is }));
    }
  });

  return <mediaQueryCtx.Provider value={value.current}>{children}</mediaQueryCtx.Provider>;
};

export default MediaQueryContext;
