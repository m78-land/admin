import React from 'react';
import { Divider } from 'm78/layout';
import FuncCollects from './func-collects';
import FuncLogo from './func-logo';
import FuncFoot from './func-foot';

/**
 * 控制功能栏的主要布局
 * */
const FuncBar = () => {
  return (
    <div className="m78-admin_func-bar">
      <FuncLogo />

      <Divider />

      <FuncCollects />

      <FuncFoot />
    </div>
  );
};

export default FuncBar;
