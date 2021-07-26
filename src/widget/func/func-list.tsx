import React from 'react';
import { EllipsisOutlined } from 'm78/icon';
import { Tree, TreeNode } from 'm78/tree';
import { Divider } from 'm78/layout';
import { Popper, PopperDirectionEnum } from 'm78/popper';
import { ContextMenuItem } from 'm78/context-menu';
import taskSeed from '../../task/task-seed';
import task from '../../task/task';
import { isPassNodeOrCategory, pushTaskOrOpenLastTask } from '../../task/methods';
import { configGetter, useSubscribeAuthChange } from '../../common/common';
import { TaskOptItem } from '../../types';
import { actionPopperCustomer } from '../../renders/renders';
import FuncContextMenuBuilder from '../unit/func-context-menu-builder';
import FuncStatusFlagBuilder from '../unit/func-status-flag-builder';

/**
 * 任务列表, 显示在任务栏左侧并通过气跑展开
 * */
const FuncList = () => {
  const taskOptions = taskSeed.useState(state => state.taskOptions);

  // 任务列表变更时触发render
  taskSeed.useState(state => state.taskList);

  const AuthPro = taskSeed.useState(state => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const collectFunc = config?.collectFunc || [];

  // state.auth变更监听
  const authKeyChangeFlag = useSubscribeAuthChange(AuthPro.authInstance.seed);

  function renderAction(node: TreeNode) {
    if (node.children?.length) return null;

    const id = node.origin.id;
    const tasks = task.get({ id });
    const length = tasks.length;
    const isCollectd = collectFunc.includes(id);

    return (
      <>
        <span style={{ marginRight: 2 }}>
          <FuncStatusFlagBuilder length={length} />
        </span>
        <Popper
          trigger="click"
          offset={0}
          customer={actionPopperCustomer}
          direction={PopperDirectionEnum.rightStart}
          content={
            <FuncContextMenuBuilder
              tasks={tasks}
              taskOptItem={node.origin as TaskOptItem}
              config={config}
              isCollectd={isCollectd}
            />
          }
        >
          <span className="m78-admin_func-list_more-btn m78-admin_effect fs-md">
            <EllipsisOutlined />
          </span>
        </Popper>
      </>
    );
  }

  function chooseHandle({ origin, children }: TreeNode) {
    if (children?.length) return;

    pushTaskOrOpenLastTask(origin.id);
  }

  function renderContent() {
    return (
      <div className="m78-admin_func-list">
        <Tree
          key={authKeyChangeFlag}
          dataSource={taskOptions}
          labelKey="name"
          valueKey="id"
          toolbar
          rainbowIndicatorLine
          defaultOpenZIndex={1}
          onNodeClick={chooseHandle}
          actions={renderAction}
          filter={node => isPassNodeOrCategory(node.origin as TaskOptItem)}
        />
      </div>
    );
  }

  return renderContent();
};

export default FuncList;
