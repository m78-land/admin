import React, { useEffect, useState } from 'react';
import ConfigSync from './config-sync';
import BaseLayout from './base-layout';
import taskSeed from '../task/task-seed';
import { useSyncWineTask, taskOptFormat } from '../task/methods';
import { M78AdminProps } from '../types';

/**
 * 渲染入口，可以执行一些渲染前的前置操作
 * */
const M78AdminCore = (props: M78AdminProps) => {
  const { tasks } = props;

  // 确保adminProps等设置完成后后再绘制主内容
  const [pass, setPass] = useState(false);

  useEffect(() => {
    taskSeed.setState(taskOptFormat(tasks));

    if (!pass) setPass(true);
  }, []);

  useSyncWineTask();

  if (!pass) return null;

  return (
    <>
      <ConfigSync />
      <BaseLayout />
    </>
  );
};

export default M78AdminCore;
