import React from 'react';
import { Button } from 'm78/button';
import { TaskCtx, taskGlobal, WindowLayout } from '../../index';

const WillPop = (props: TaskCtx) => {
  taskGlobal.useWillPop(props, true);

  return (
    <WindowLayout>
      <h2>WillPop</h2>
      <Button
        onClick={() => {
          props.push('WillPopDemo1');
          props.push('WillPopDemo2');
          props.push('WillPopDemo3');
        }}
      >
        push
      </Button>
    </WindowLayout>
  );
};

export default WillPop;
