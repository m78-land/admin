import { SettingOutlined } from 'm78/icon';
import React from 'react';
import { TaskOpt } from '../types/tasks';
import WillPopChild from './will-pop/will-pop-child';
import bjPng from './assets/bj.png';
import yhqPng from './assets/yhq.png';

const TestLazy = React.lazy(() => import('./Test'));
const TestLazy2 = React.lazy(() => import('./Test2'));
const TestLazy3 = React.lazy(() => import('./Test3'));
const TestLazy4 = React.lazy(() => import('./Test4'));
const WillPop = React.lazy(() => import('./will-pop/will-pop'));

export const opt: TaskOpt = [
  {
    name: '关闭提示',
    children: [
      {
        id: 'WillPopDemo',
        name: '关闭提示',
        component: WillPop,
      },
      {
        id: 'WillPopDemo1',
        name: '关闭提示子页1',
        component: WillPopChild,
      },
      {
        id: 'WillPopDemo2',
        name: '关闭提示子页2',
        component: WillPopChild,
      },
      {
        id: 'WillPopDemo3',
        name: '关闭提示子页3',
        component: WillPopChild,
      },
    ],
  },
  {
    id: 'permission1',
    name: '权限页1',
    component: React.lazy(() => import('./permission/permission-page1')),
    permission: ['user:create&query'],
  },
  {
    id: 'permission2',
    name: '权限页2',
    component: React.lazy(() => import('./permission/permission-page2')),
    permission: ['news:create&query'],
  },
  {
    name: '权限菜单',
    permission: ['user:create&query'],
    children: [
      {
        id: 'permissionGroup1',
        name: '权限页组1',
        component: React.lazy(() => import('./permission/permission-page1')),
      },
      {
        id: 'permissionGroup2',
        name: '权限页组2',
        component: React.lazy(() => import('./permission/permission-page2')),
      },
    ],
  },
  {
    id: 'xxx1',
    name: '无名功能1',
    component: TestLazy,
    // hide: true,
  },
  {
    id: 'xxx2',
    name: '无名功能2',
    icon: bjPng,
    component: TestLazy2,
  },
  {
    id: 'xxx3',
    name: '无名功能2',
    icon: <SettingOutlined />,
    component: TestLazy2,
  },
  {
    id: 'xxx4',
    name: '无名功能2',
    icon: yhqPng,
    component: TestLazy2,
  },
  {
    id: 'xxx5',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
  },
  {
    id: 'xxx6',
    name: '无名功能2',
    icon: <SettingOutlined />,
    component: TestLazy2,
  },
  {
    id: 'xxx7',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
  },
  {
    name: '角色',
    children: [
      {
        id: 'role1',
        name: '角色管理',
        icon: '✂',
        component: TestLazy3,
        taskName: ctx => ctx.param.name || '呵呵哒',
        singleton: true,
        // auth: ['user:crud', 'setting:cud'],
      },
      {
        id: 'role2',
        name: '权限管理',
        icon: '🦄',
        component: TestLazy4,
        // auth: ['user:cud', 'setting:cud'],
      },
      {
        id: 'role3',
        name: '嘻嘻嘻管理',
        icon: '💦',
        component: TestLazy,
      },
      {
        name: '角色xzczx',
        children: [
          {
            id: 'role125',
            name: '角色管理',
            icon: '✂',
            component: TestLazy3,
            taskName: ctx => ctx.param.name || '呵呵哒',
          },
          {
            id: 'role21677',
            name: '权限管理',
            icon: '🦄',
            component: TestLazy4,
            // auth: ['user:cud', 'setting:cud'],
          },
          {
            id: 'role37347',
            name: '嘻嘻嘻管理',
            icon: '💦',
            component: TestLazy,
          },
        ],
      },
    ],
  },
  {
    name: '菜单管理',
    children: [
      {
        id: 'menu1',
        name: '菜单管理1',
        icon: '🎉',
        component: TestLazy,
        param: {
          name: 'zl',
        },
      },
      {
        id: 'menu2',
        name: '菜单管理2',
        icon: '📂',
        component: TestLazy,
      },
      {
        id: 'menu3',
        name: '菜单管理3',
        icon: '✨',
        component: TestLazy,
      },
    ],
  },
  {
    name: '权限管理',
    children: [
      {
        id: 'auth1',
        name: '权限管理1',
        icon: '🌞',
        component: TestLazy,
      },
      {
        id: 'auth2',
        name: '权限管理2',
        icon: '💎',
        component: TestLazy,
      },
      {
        id: 'auth3',
        name: '权限管理3',
        icon: '🌊',
        component: TestLazy,
      },
    ],
  },
];
