import React from 'react';
import { Button } from 'm78/button';
import Wine from '@m78/wine';
import { Check } from 'm78/check';
import { Bubble } from 'm78/bubble';
import { FullscreenExitOutlined, FullscreenOutlined, ImportOutlined } from 'm78/icon';
import { Divider } from 'm78/layout';
import taskSeed from '../../task/task-seed';
import { emitConfig } from '../../common/common';
import taskGlobal from '../../task/task-global';

/**
 * 任务栏右侧操作区域
 * */
const TaskActions = () => {
  const aProps = taskSeed.useState(state => state.adminProps);
  const config = aProps.config;

  const darkMode = config?.darkMode || false;

  return (
    <>
      {aProps.taskBarExtra}

      <Divider vertical className="h-1d4em" />

      <Bubble content="收起所有窗口" direction="bottom">
        <Button icon onClick={Wine.hideAll}>
          <span style={{ fontSize: 18 }}>
            <FullscreenExitOutlined />
          </span>
        </Button>
      </Bubble>

      <Bubble content="展开所有窗口" direction="bottom">
        <Button icon onClick={Wine.showAll}>
          <span style={{ fontSize: 18 }}>
            <FullscreenOutlined />
          </span>
        </Button>
      </Bubble>

      <Bubble content="关闭所有窗口" direction="bottom">
        <Button icon onClick={() => taskGlobal.dispose()}>
          <span style={{ fontSize: 18 }}>
            <ImportOutlined />
          </span>
        </Button>
      </Bubble>

      {/* TODO: 自动排列 */}
      {/* <Popper content="自动排列窗口" direction="bottom"> */}
      {/*  <Button icon> */}
      {/*    <span style={{ fontSize: 18 }}>✂</span> */}
      {/*  </Button> */}
      {/* </Popper> */}

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
