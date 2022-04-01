/**
 * 入口, 控制核心内容渲染流程, 同步配置
 * */

import React, { useEffect } from 'react';
import { M78AdminProps } from './types/types';
import taskSeed from './task/task-seed';
import M78AdminCore from './widget/m78-admin-core';

function M78AdminImpl(props: M78AdminProps) {
  useEffect(() => {
    taskSeed.set({
      adminProps: props,
    });
  }, [props]);

  return <M78AdminCore {...props} />;
}

export default M78AdminImpl;
