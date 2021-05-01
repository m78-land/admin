import React, { useEffect, useRef } from 'react';
import { DirectionEnum } from 'm78/types';
import { Scroller, ScrollerRef } from 'm78/scroller';
import TaskTab from './task-tab';
import taskSeed from '../../task/task-seed';

/**
 * 任务栏 -> 任务列表区域
 * */
const TaskList = () => {
  const taskList = taskSeed.useState(state => state.taskList);

  const scroller = useRef<ScrollerRef>(null!);

  const last = useRef<number>();

  useEffect(() => {
    const f = setTimeout(() => {
      const meta = scroller.current.get();
      const xMax = meta.xMax;
      if ((!last.current && xMax) || (last.current && xMax > last.current)) {
        scroller.current.set({
          x: xMax,
          immediate: true,
        });
      }
      last.current = xMax;
    }, 20);

    return () => clearTimeout(f);
  }, [taskList.length]);

  return (
    <Scroller
      className="m78-admin_task-bar_main"
      scrollFlag
      hideScrollbar
      direction={DirectionEnum.horizontal}
      ref={scroller}
    >
      {taskList.map(item => (
        <TaskTab key={item.taskKey} instance={item} />
      ))}
    </Scroller>
  );
};

export default TaskList;
