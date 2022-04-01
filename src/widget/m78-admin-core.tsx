/**
 * 渲染入口，可以执行一些渲染前的前置操作
 * */

import React, { useEffect, useState } from 'react';
import Wine from '@m78/wine';
import { Spin } from 'm78/spin';
import ConfigSync from './config-sync';
import BaseLayout from './base-layout';
import taskSeed from '../task/task-seed';
import { useSyncWineTask, taskOptFormat } from '../task/methods';
import { M78AdminProps } from '../types/types';
import Handles from './handles';

const M78AdminCore = (props: M78AdminProps) => {
  const { tasks } = props;

  // 确保adminProps等设置完成后后再绘制主内容
  const [pass, setPass] = useState(false);

  useEffect(() => {
    taskSeed.set(taskOptFormat(tasks));

    if (!pass) setPass(true);
  }, []);

  useSyncWineTask();

  if (!pass) return null;

  function render() {
    if (props.loading) {
      return (
        <div className="m78-admin_blocked-loading">
          <Spin size="big" text="" full />
        </div>
      );
    }

    if (props.body) return props.body;

    return <BaseLayout />;
  }

  return (
    <>
      <ConfigSync />
      <Handles />
      <Wine.RenderTarget />
      {render()}
    </>
  );
};

export default M78AdminCore;
