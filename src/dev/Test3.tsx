import React, { useState } from 'react';
import { Button } from 'm78/button';
import { TaskCtx } from '../types/types';

const Test3 = (props: TaskCtx) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span onClick={() => setCount(prev => prev + 1)}>count: {count}</span>
      <Button
        onClick={() => {
          props.replace('role1');
        }}
      >
        replace
      </Button>
      <Button
        onClick={() => {
          props.push('role1');
        }}
      >
        push
      </Button>
    </div>
  );
};

export default Test3;
