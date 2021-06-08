import { createSeed } from 'm78/seed';
import { createAuthPro } from 'm78/auth';

const seed = createSeed();

export const AuthPro = createAuthPro({
  seed,
  auth: ['user:cr'],
  authNameMap: {
    user: '用户',
    setting: '设置',
  },
  customAuthKeysMap: {
    b: {
      name: 'batch',
      label: '批处理',
    },
    p: {
      name: 'publish',
      label: '发布内容',
    },
  },
});
