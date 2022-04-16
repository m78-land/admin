import { createSeed } from 'm78/seed';
import { TaskState } from '../types/types';

/**
 * 管理所有内部状态的seed
 * */
const taskSeed = createSeed<TaskState>({
  state: {
    taskOptions: [],
    taskOptionsFlat: [],
    taskOptionsIdMap: {},
    taskList: [],
    adminProps: {
      tasks: [],
      permission: null as any,
    },
  },
});

export default taskSeed;
