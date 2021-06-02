import React, { useState } from 'react';
import './style.scss';
import { createAuthPro } from 'm78/auth';
import { createSeed } from 'm78/seed';
import { Button } from 'm78/button';

import { M78Admin, Badge, FuncBtn } from '../index';
import { M78AdminConfig, TaskOpt } from '../types';

const TestLazy = React.lazy(() => import('./Test'));
const TestLazy2 = React.lazy(() => import('./Test2'));
const TestLazy3 = React.lazy(() => import('./Test3'));
const TestLazy4 = React.lazy(() => import('./Test4'));

const opt: TaskOpt = [
  {
    id: 'xxx1',
    name: '无名功能1',
    icon: '😍',
    component: TestLazy,
    // hide: true,
    auth: ['user:cr', 'setting:ud'],
  },
  {
    id: 'xxx2',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
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
            auth: ['user:ud', 'setting:cr'],
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

const AuthPro = createAuthPro({
  seed: createSeed(),
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

// Auth.setAuth(['user:cr', 'setting:ud']);

const App = () => {
  const [config, setConfig] = useState<M78AdminConfig>({
    collectFunc: ['menu1', 'xxx1', 'xxx2', 'role1', 'role2'],
    darkMode: false,
    // initFull: true,
  });

  // return (
  //   <Login
  //     logo={Logo}
  //     title="M78 Admin"
  //     desc="以任务为维度的后台管理系统"
  //     content={
  //       <Form style={{ width: 300 }}>
  //         <Form.Item name="name">
  //           <Input size="large" placeholder="用户名" />
  //         </Form.Item>
  //         <Form.Item name="password">
  //           <Input size="large" type="password" placeholder="密码" />
  //         </Form.Item>
  //
  //         <Row mainAlign="between" crossAlign="center">
  //           <a className="fs" href="">
  //             忘记密码?
  //           </a>
  //           <Button outline color="primary">
  //             登录
  //           </Button>
  //         </Row>
  //       </Form>
  //     }
  //   />
  // );

  return (
    <M78Admin
      // width="70vw"
      // height="70vh"
      tasks={opt}
      desktopNode={
        <div>
          <span>🎉🎉欢迎</span>
          <Button onClick={() => AuthPro.setAuth(['user:cr', 'setting:ud'])}>
            ['user:cr', 'setting:ud']
          </Button>
          <Button onClick={() => AuthPro.setAuth(['user:ud', 'setting:cr'])}>
            ['user:cr', 'setting:ud']
          </Button>
        </div>
      }
      // footerNode={<div>🎉✨</div>}
      loading={false}
      funcBarExtraNode={
        <>
          <FuncBtn text="设置" icon="⚙" small />
          <FuncBtn text="帮助中心" icon="📙" small />
          <FuncBtn
            text="LXJ"
            extraNode={
              <Badge color="red" out>
                23
              </Badge>
            }
            circle
          />
        </>
      }
      authPro={AuthPro}
      // beforeTaskEach={opts => {
      //   if (opts.id === 'role1') {
      //     message.tips({ content: '错误' });
      //     return false;
      //   }
      //   return true;
      // }}
      config={config}
      onConfigChange={conf => {
        setConfig(prev => ({
          ...prev,
          ...conf,
        }));
        console.log('config change: ', conf);
      }}
    />
  );
};

export default App;
