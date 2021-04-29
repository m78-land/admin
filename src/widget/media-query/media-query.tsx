import React from 'react';
import { useSetState } from '@lxjx/hooks';
import {
  MediaQueryProps,
  MediaQuerySizeMete,
  MediaQuerySizeProps,
  MediaQueryTypeMete,
  MediaQueryTypeProps,
} from '../../types';
import { useMediaQuery, useMediaQuerySize, useMediaQueryType } from './hooks';

/**
 * 窗口尺寸改变时通过回调通知
 * */
function MediaQuery({ onChange }: MediaQueryProps) {
  useMediaQuery(onChange);
  return null;
}

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
function MediaQuerySize({ children }: MediaQuerySizeProps) {
  const size = useMediaQuerySize();

  return size ? children(size) : null;
}

/**
 * 窗口尺寸类型改变时通过回调通知传入子项帮助渲染
 * */
function MediaQueryType({ children }: MediaQueryTypeProps) {
  const type = useMediaQueryType();

  return type ? children(type) : null;
}

MediaQuery.Size = MediaQuerySize;
MediaQuery.Type = MediaQueryType;

export { MediaQuerySize, MediaQueryType };
export default MediaQuery;
