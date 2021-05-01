import React, { useMemo, useState } from 'react';
import { Button } from 'm78/button';
import { MenuOutlined, StarFilled, StarOutlined } from 'm78/icon';
import { Popper, PopperDirectionEnum } from 'm78/popper';
import { Tree, TreeNode } from 'm78/tree';
import { SizeEnum } from 'm78/types';
import taskSeed from '../../task/task-seed';
import task from '../../task/task';
import { collectHandle, isPassNode } from '../../task/methods';
import { TaskOpt } from '../../types';
import { Auth } from '../../auth/auth';

/**
 * 任务列表, 显示在任务栏左侧并通过气跑展开
 * */
const FuncList = () => {
  const tasks = taskSeed.useState(state => state.taskOptions);
  const adminProps = taskSeed.useState(state => state.adminProps);
  const config = adminProps.config;

  const authK = Auth.useCurrentAuth();

  const [popperShow, setPopperShow] = useState(false);

  /** 根据权限过滤后的列表 */
  const filterAuthTasks = useMemo(filterNotPassNode, [tasks, authK]);

  /** 从task中处理掉所有无权限和隐藏的节点并返回克隆节点 */
  function filterNotPassNode() {
    const _tasks: TaskOpt = [];

    tasks.forEach(item => {
      if (isPassNode(item)) {
        // 过滤掉height属性，和Tree的option配置冲突
        const { height, ...i } = item;
        _tasks.push(i);
      }

      if ('children' in item && item.children.length) {
        const _child = item.children.filter(isPassNode);

        if (_child.length) {
          _tasks.push({
            ...item,
            children: _child.map(({ height, ...i }) => i),
          });
        }
      }
    });

    return _tasks;
  }

  function renderAction(node: TreeNode) {
    if (node.children?.length) return null;

    const collectFunc = config?.collectFunc || [];
    const isCollectd = collectFunc.includes(node.id);

    return (
      <Button size="small" icon onClick={() => collectHandle(node.id, collectFunc)}>
        {isCollectd ? (
          <StarFilled className="color-warn" title="取消标记" />
        ) : (
          <StarOutlined className="color-second" title="标记为常用功能" />
        )}
      </Button>
    );
  }

  function chooseHandle({ id, children }: TreeNode) {
    if (children?.length) return;
    task.push(id as string);
    setPopperShow(false);
  }

  function renderContent() {
    return (
      <div className="func-list">
        <h3>全部功能</h3>
        <Tree
          dataSource={filterAuthTasks}
          labelGetter={item => item.name}
          valueGetter={item => item.id || item.name}
          toolbar
          rainbowIndicatorLine
          height={380}
          size={SizeEnum.large}
          defaultOpenZIndex={1}
          onNodeClick={chooseHandle}
          actions={renderAction}
        />
      </div>
    );
  }

  return (
    <Popper
      type="popper"
      show={popperShow}
      onChange={setPopperShow}
      content={renderContent()}
      direction={PopperDirectionEnum.bottomStart}
    >
      <Button icon>
        <MenuOutlined className="fs-md" />
      </Button>
    </Popper>
  );
};

export default FuncList;
