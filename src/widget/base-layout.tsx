import React from 'react';
import Wine from '@m78/wine';
import FuncBar from './func/func-bar';
import TaskBar from './task/task-bar';
import taskSeed from '../task/task-seed';
import DesktopItems from './unit/desktop-items';

/**
 * 窗口的主要布局
 * */
const BaseLayout = () => {
  const width = taskSeed.useState(state => state.adminProps.width);
  const height = taskSeed.useState(state => state.adminProps.height);

  return (
    <div
      className="m78 m78-admin_layout"
      style={{
        height,
        width,
      }}
    >
      <div className="m78-admin_layout_side">
        <FuncBar />
      </div>
      <div className="m78-admin_layout_main">
        <TaskBar />

        <div className="m78-admin_layout_window">
          <DesktopItems />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
