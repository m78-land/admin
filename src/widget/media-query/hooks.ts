import { useContext, useEffect } from 'react';
import { useFn, useSetState } from '@lxjx/hooks';
import { mediaQueryCtx } from './context';
import { MediaQueryProps, MediaQuerySizeMete, MediaQueryTypeMete } from '../../types';

/**
 * 窗口尺寸改变时通过回调通知
 * */
export function useMediaQuery(onChange: MediaQueryProps['onChange']) {
  const mqCtx = useContext(mediaQueryCtx);

  const oc = useFn(onChange);

  useEffect(() => {
    mqCtx.changeListeners.push(oc);
    oc(mqCtx.meta!);

    return () => {
      const ind = mqCtx.changeListeners.indexOf(oc);

      if (ind !== -1) {
        mqCtx.changeListeners.splice(ind, 1);
      }
    };
  }, []);
}

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export function useMediaQuerySize() {
  const [state, setState] = useSetState<{
    size: MediaQuerySizeMete | null;
  }>({
    size: null,
  });

  useMediaQuery(meta => {
    if (meta.width !== state.size?.width || meta.height !== state.size?.height) {
      setState({
        size: {
          width: meta.width,
          height: meta.height,
        },
      });
    }
  });

  return state.size;
}

/**
 * 窗口尺寸类型改变时通过回调通知传入子项帮助渲染
 * */
export function useMediaQueryType() {
  const [state, setState] = useSetState<{
    type: MediaQueryTypeMete | null;
  }>({
    type: null,
  });

  useMediaQuery(({ width, height, ...type }) => {
    if (type.type !== state.type?.type) {
      setState({
        type,
      });
    }
  });

  return state.type;
}
