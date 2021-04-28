import React, { useContext, useEffect } from 'react';
import { useFn, useSetState } from '@lxjx/hooks';
import { mediaQueryCtx } from './context';
import { MediaQueryMete, MediaQuerySizeMete, MediaQueryTypeMete } from '../../types';

interface MediaQueryProps {
  onChange: (meta: MediaQueryMete) => void;
}

interface MediaQuerySizeProps {
  children: (sizeMeta: MediaQuerySizeMete) => React.ReactNode;
}

interface MediaQueryTypeProps {
  children: (sizeMeta: MediaQueryTypeMete) => React.ReactNode;
}

/**
 * 窗口尺寸改变时通过回调通知
 * */
function MediaQuery({ onChange }: MediaQueryProps) {
  const mqCtx = useContext(mediaQueryCtx);

  const oc = useFn(onChange);

  useEffect(() => {
    mqCtx.changeListeners.push(oc);

    return () => {
      const ind = mqCtx.changeListeners.indexOf(oc);

      if (ind !== -1) {
        mqCtx.changeListeners.splice(ind, 1);
      }
    };
  }, []);

  return null;
}

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
function MediaQuerySize({ children }: MediaQuerySizeProps) {
  const [state, setState] = useSetState<{
    size: MediaQuerySizeMete | null;
  }>({
    size: null,
  });

  return (
    <>
      <MediaQuery
        onChange={meta => {
          if (meta.width !== state.size?.width || meta.height !== state.size?.height) {
            setState({
              size: {
                width: meta.width,
                height: meta.height,
              },
            });
          }
        }}
      />
      {state.size && children(state.size)}
    </>
  );
}

/**
 * 窗口尺寸类型改变时通过回调通知传入子项帮助渲染
 * */
function MediaQueryType({ children }: MediaQueryTypeProps) {
  const [state, setState] = useSetState<{
    type: MediaQueryTypeMete | null;
  }>({
    type: null,
  });

  return (
    <>
      <MediaQuery
        onChange={({ width, height, ...type }) => {
          if (type.type !== state.type?.type) {
            setState({
              type,
            });
          }
        }}
      />
      {state.type && children(state.type)}
    </>
  );
}

MediaQuery.Size = MediaQuerySize;
MediaQuery.Type = MediaQueryType;

export { MediaQuerySize, MediaQueryType };
export default MediaQuery;
