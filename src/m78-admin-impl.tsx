import React, { useEffect } from 'react';
import { Spin } from 'm78/spin';
import { M78AdminProps } from './types';
import taskSeed from './task/task-seed';
import M78AdminCore from './widget/m78-admin-core';

/**
 * 入口组件
 * */
function M78AdminImpl(props: M78AdminProps) {
  useEffect(() => {
    taskSeed.setState({
      adminProps: props,
    });
  }, [props]);

  if (props.loading) {
    return (
      <div className="m78-admin_blocked-loading">
        <Spin size="big" text="" full />
      </div>
    );
  }

  return <M78AdminCore {...props} />;
}

export default M78AdminImpl;
