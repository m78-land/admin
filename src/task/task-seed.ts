import create from 'm78/seed';
import { TaskState } from '../types';

/**
 * 管理所有内部状态管理的seed
 * */
const taskSeed = create<TaskState>({
  state: {
    taskOptions: [],
    taskOptionsFlat: [],
    taskOptionsIdMap: {},
    taskList: [],
    adminProps: {
      tasks: [],
    },
  },
});

export default taskSeed;
