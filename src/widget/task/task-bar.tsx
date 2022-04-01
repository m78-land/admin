import React from 'react';
import { Divider } from 'm78/layout';
import TaskList from './task-list';
import TaskActions from './task-actions';
import taskSeed from '../../task/task-seed';

/**
 * 任务栏主要布局组件
 * */
const TaskBar = () => {
  const taskBarLeadingExtraNode = taskSeed.useState(state => state.adminProps.taskBarLeadingExtra);

  return (
    <div className="m78-admin_task-bar">
      {taskBarLeadingExtraNode && (
        <>
          {taskBarLeadingExtraNode}

          <Divider vertical className="h-1d4em" />
        </>
      )}

      <TaskList />

      <Divider vertical className="h-1d4em" />

      <div className="m78-admin_task-bar_action">
        <TaskActions />
      </div>
    </div>
  );
};

export default TaskBar;
