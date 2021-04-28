import { createContext } from 'react';
import { _MediaQueryTypeContext } from '../../types';

export const mediaQueryCtx = createContext<_MediaQueryTypeContext>({
  onChange: () => {},
  changeListeners: [],
});
