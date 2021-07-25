import React, { useState } from 'react';
import './style.scss';
import { Button } from 'm78/button';

import { Row } from 'm78/layout';
import { M78Admin, FuncItem, Link, task } from '../index';
import { M78AdminConfig, TaskOpt } from '../types';
import { AuthPro } from './AuthPro';

const TestLazy = React.lazy(() => import('./Test'));
const TestLazy2 = React.lazy(() => import('./Test2'));
const TestLazy3 = React.lazy(() => import('./Test3'));
const TestLazy4 = React.lazy(() => import('./Test4'));

const opt: TaskOpt = [
  {
    id: 'xxx1',
    name: '无名功能1',
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
    id: 'xxx3',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    id: 'xxx4',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    id: 'xxx5',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    id: 'xxx6',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    id: 'xxx7',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    name: '角色',
    auth: ['user:cr', 'setting:ud'],
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
    <>
      <M78Admin
        // width="70vw"
        // height="70vh"
        tasks={opt}
        desktopNode={
          <div>
            <span>🎉🎉欢迎</span>

            <Link id="role1" param={{ name: 'lxj' }}>
              跳转 role1
            </Link>

            <Button onClick={() => console.log(task.get())}>get</Button>
            <Button onClick={() => console.log(task.get({ includeSubTask: true }))}>get all</Button>

            <Button onClick={() => console.log(task.get({ id: 'role1' }))}>get id</Button>
            <Button onClick={() => console.log(task.get({ id: 'role1', includeSubTask: true }))}>
              get all id
            </Button>

            <Button onClick={() => task.dispose({ id: 'role1' })}>refresh </Button>
            <Button onClick={() => task.dispose({ id: 'role1', includeSubTask: true })}>
              refresh role1
            </Button>

            <input
              type="color"
              onChange={e => {
                console.log(e.target.value);
                const str = e.target.value;

                setConfig(prev => ({
                  ...prev,
                  color: str,
                }));
              }}
            />
            <input
              type="color"
              onChange={e => {
                console.log(e.target.value);
                const str = e.target.value;

                setConfig(prev => ({
                  ...prev,
                  subColor: str,
                }));
              }}
            />
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
        taskBarLeadingExtraNode={<span>呵呵哒</span>}
        taskBarExtraNode={<span>呵呵</span>}
        funcBarExtraNode={
          <>
            <Row>
              <FuncItem icon="⚙" title="设置" />
              <FuncItem icon="📙" title="帮助" />
            </Row>
            {/* <FuncBtn */}
            {/*  text="LXJ" */}
            {/*  extraNode={ */}
            {/*    <Badge color="red" out> */}
            {/*      23 */}
            {/*    </Badge> */}
            {/*  } */}
            {/*  circle */}
            {/* /> */}
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
    </>
  );
};

export default App;
