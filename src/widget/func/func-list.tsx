import React from 'react';
import { Tree, TreeNode } from 'm78/tree';
import taskSeed from '../../task/task-seed';
import taskGlobal from '../../task/task-global';
import { isPassNodeOrCategory, pushTaskOrOpenLastTask } from '../../task/methods';
import { configGetter, useSubscribeAuthChange } from '../../common/common';
import { TaskOptItem } from '../../types/types';
import IconRender from '../unit/icon-render';
import { renderFuncActions } from './renders';

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
    const tasks = taskGlobal.get({ id });
    const isCollectd = collectFunc.includes(id);

    return renderFuncActions(tasks, isCollectd, node.origin as TaskOptItem, config);
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
          customIconRender={icon => <IconRender icon={icon} />}
        />
      </div>
    );
  }

  return renderContent();
};

export default FuncList;
