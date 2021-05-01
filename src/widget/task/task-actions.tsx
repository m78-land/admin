import React from 'react';
import { Popper } from 'm78/popper';
import { Button } from 'm78/button';
import Wine from '@m78/wine';
import { Check } from 'm78/check';
import taskSeed from '../../task/task-seed';
import { emitConfig } from '../../common/common';
import task from '../../task/task';

/**
 * 任务栏右侧操作区域
 * */
const TaskActions = () => {
  const aProps = taskSeed.useState(state => state.adminProps);
  const config = aProps.config;

  const darkMode = config?.darkMode || false;

  return (
    <>
      <Popper content="收起所有窗口" direction="bottom">
        <Button icon onClick={Wine.hideAll}>
          <span style={{ fontSize: 18 }}>📘</span>
        </Button>
      </Popper>

      <Popper content="展开所有窗口" direction="bottom">
        <Button icon onClick={Wine.showAll}>
          <span style={{ fontSize: 18 }}>📖</span>
        </Button>
      </Popper>

      <Popper content="关闭所有窗口" direction="bottom">
        <Button icon onClick={() => task.dispose()}>
          <span style={{ fontSize: 18 }}>🗑</span>
        </Button>
      </Popper>

      {/* TODO: 自动排列 */}
      {/* <Popper content="自动排列窗口" direction="bottom"> */}
      {/*  <Button icon> */}
      {/*    <span style={{ fontSize: 18 }}>✂</span> */}
      {/*  </Button> */}
      {/* </Popper> */}

      {aProps.taskBarExtraNode}

      <Check
        className="ml-12"
        type="switch"
        switchOff={(<span style={{ fontSize: 16 }}>🌞</span>) as any}
        switchOn={(<span style={{ fontSize: 16 }}>🌛</span>) as any}
        checked={darkMode}
        onChange={toggle => {
          emitConfig({
            darkMode: toggle,
          });
        }}
      />
    </>
  );
};

export default TaskActions;
