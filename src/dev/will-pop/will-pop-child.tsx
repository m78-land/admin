import React from 'react';
import { TaskCtx, taskGlobal, WindowLayout } from '../../index';

const WillPopChild = (props: TaskCtx) => {
  taskGlobal.useWillPop(props, true);

  return (
    <WindowLayout>
      <h2>WillPopChild</h2>
    </WindowLayout>
  );
};

export default WillPopChild;
