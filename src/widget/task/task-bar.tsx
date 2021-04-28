import React from 'react';
import { Divider } from 'm78/layout';
import FuncList from '../func/func-list';
import TaskList from './task-list';
import TaskActions from './task-actions';

/**
 * 任务栏主要布局组件
 * */
const TaskBar = () => {
  return (
    <div className="m78-admin_task-bar">
      <div className="m78-admin_task-bar_before">
        <FuncList />
      </div>

      <Divider vertical className="h-1d4em" />

      <TaskList />

      <Divider vertical className="h-1d4em" />

      <div className="m78-admin_task-bar_action">
        <TaskActions />
      </div>
    </div>
  );
};

export default TaskBar;
