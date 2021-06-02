import { createSeed } from 'm78/seed';
import { TaskState } from '../types';

/**
 * 管理所有内部状态管理的seed
 * */
const taskSeed = createSeed<TaskState>({
  state: {
    taskOptions: [],
    taskOptionsFlat: [],
    taskOptionsIdMap: {},
    taskList: [],
    adminProps: {
      tasks: [],
      authPro: null as any,
    },
  },
});

export default taskSeed;
