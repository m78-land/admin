import React from 'react';
import { Divider } from 'm78/layout';
import taskSeed from '../../task/task-seed';

/**
 * 功能栏底部
 * */
const FuncFoot = () => {
  const funcBarExtraNode = taskSeed.useState(state => state.adminProps.funcBarExtraNode);

  if (!funcBarExtraNode) return null;

  return (
    <>
      <Divider />

      <div>{funcBarExtraNode}</div>
    </>
  );
};

export default FuncFoot;
