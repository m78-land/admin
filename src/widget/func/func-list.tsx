import React from 'react';
import { Button } from 'm78/button';
import { StarFilled, StarOutlined } from 'm78/icon';
import { Tree, TreeNode } from 'm78/tree';
import taskSeed from '../../task/task-seed';
import task from '../../task/task';
import { collectHandle, isPassNodeOrCategory } from '../../task/methods';
import { configGetter, useSubscribeAuthChange } from '../../common/common';
import { TaskOptItem } from '../../types';

/**
 * 任务列表, 显示在任务栏左侧并通过气跑展开
 * */
const FuncList = () => {
  const tasks = taskSeed.useState(state => state.taskOptions);
  const AuthPro = taskSeed.useState(state => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);

  // state.auth变更监听
  const authKeyChangeFlag = useSubscribeAuthChange(AuthPro.authInstance.seed);

  function renderAction(node: TreeNode) {
    if (node.children?.length) return null;

    const collectFunc = config?.collectFunc || [];
    const isCollectd = collectFunc.includes(node.origin.id);

    return (
      <Button size="small" icon onClick={() => collectHandle(node.origin.id, collectFunc)}>
        {isCollectd ? (
          <StarFilled className="color-warn" title="取消标记" />
        ) : (
          <StarOutlined className="color-second" title="标记为常用功能" />
        )}
      </Button>
    );
  }

  function chooseHandle({ origin, children }: TreeNode) {
    if (children?.length) return;
    task.push(origin.id);
  }

  function renderContent() {
    return (
      <div className="func-list">
        <Tree
          key={authKeyChangeFlag}
          dataSource={tasks}
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
