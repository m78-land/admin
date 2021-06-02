import React from 'react';
import assetLogo from '@m78/admin/assets/logo.png';
import taskSeed from '../../task/task-seed';
import { configGetter } from '../../common/common';

/**
 * 功能栏logo部分
 * */
const FuncLogo = () => {
  const config = taskSeed.useState(configGetter);

  const logo = config?.logo || assetLogo;
  const name = config?.name || 'M78-Admin';

  return (
    <div className="m78-admin_func-bar_logo" title={name}>
      <img className="m78-admin_func-bar_logo-img" src={logo} alt={name} />
      <div className="ellipsis mt-4">{name}</div>
    </div>
  );
};

export default FuncLogo;
