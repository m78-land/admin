import React from 'react';
import taskSeed from '../../task/task-seed';

/**
 * 桌面的各种元素
 * */
const DesktopItems = () => {
  // const taskList = taskSeed.useState(state => state.taskList);

  const aProps = taskSeed.useState(state => state.adminProps);

  return (
    <>
      <div className="m78-admin_desktop-node">{aProps.desktopNode}</div>

      <div className="m78-admin_layout_desc">
        {aProps.footerNode || (
          <>
            POWER BY |-
            <a href="https://github.com/xianjie-li/m78" target="_blank" rel="noreferrer">
              M78
            </a>
            -| |-
            <a href=" https://github.com/xianjie-li" target="_blank">
              Github
            </a>
            -|
          </>
        )}
      </div>
    </>
  );
};

export default DesktopItems;
