import { createPermissionPro } from 'm78/permission';

export const Permission = createPermissionPro({
  permission: {
    user: ['create', 'query'],
    news: [],
  },
  meta: {
    general: [
      {
        label: '创建',
        key: 'create',
      },
      {
        label: '查询',
        key: 'query',
      },
    ],
    modules: {
      user: {
        label: '用户',
      },
      news: {
        label: '新闻',
      },
    },
  },
});
