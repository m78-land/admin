import React, { useState } from 'react';
import './style.scss';
import { Button } from 'm78/button';

import { Row } from 'm78/layout';
import { PushpinOutlined, SettingOutlined, ThunderboltOutlined } from 'm78/icon';
import Wine from '@m78/wine';
import { M78Admin, FuncItem, Link, taskGlobal, Login } from '../index';
import { M78AdminConfig, TaskOpt } from '../types/types';
import { AuthPro } from './AuthPro';
import IconRender from '../widget/unit/icon-render';
import WillPopChild from './will-pop/will-pop-child';

import bjPng from './assets/bj.png';
import yhqPng from './assets/yhq.png';

const TestLazy = React.lazy(() => import('./Test'));
const TestLazy2 = React.lazy(() => import('./Test2'));
const TestLazy3 = React.lazy(() => import('./Test3'));
const TestLazy4 = React.lazy(() => import('./Test4'));
const WillPop = React.lazy(() => import('./will-pop/will-pop'));

const opt: TaskOpt = [
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
    id: 'xxx1',
    name: '无名功能1',
    component: TestLazy,
    // hide: true,
    auth: ['user:cr', 'setting:ud'],
  },
  {
    id: 'xxx2',
    name: '无名功能2',
    icon: bjPng,
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    id: 'xxx3',
    name: '无名功能2',
    icon: <SettingOutlined />,
    component: TestLazy2,
    auth: ['user:ud', 'setting:cr'],
  },
  {
    id: 'xxx4',
    name: '无名功能2',
    icon: yhqPng,
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
    icon: <SettingOutlined />,
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

  return (
    <>
      <M78Admin
        // width="70vw"
        // height="70vh"
        tasks={opt}
        desktop={
          <div>
            <div>
              <IconRender icon="✨" />
              <IconRender icon="🎨" />
              <IconRender icon={<ThunderboltOutlined />} />
              <IconRender icon={<SettingOutlined />} />
              <IconRender icon={<PushpinOutlined />} />
              <IconRender icon="http://pic.51yuansu.com/pic3/cover/01/35/81/5924def7eadc7_610.jpg" />
              <IconRender icon="https://pic.onlinewebfonts.com/svg/img_365060.png" />
            </div>
            <span>🎉🎉欢迎</span>

            <Link id="role1" param={{ name: 'lxj' }}>
              跳转 role1
            </Link>

            <Button onClick={() => console.log(taskGlobal.get())}>get</Button>
            <Button onClick={() => console.log(taskGlobal.get({ includeSubTask: true }))}>
              get all
            </Button>

            <Button onClick={() => console.log(taskGlobal.get({ id: 'role1' }))}>get id</Button>
            <Button
              onClick={() => console.log(taskGlobal.get({ id: 'role1', includeSubTask: true }))}
            >
              get all id
            </Button>

            <Button onClick={() => taskGlobal.dispose({ id: 'role1' })}>refresh </Button>
            <Button onClick={() => taskGlobal.dispose({ id: 'role1', includeSubTask: true })}>
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
        taskBarLeadingExtra={<span>呵呵哒</span>}
        taskBarExtra={<span>呵呵</span>}
        funcBarExtra={
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
        // body={
        //   <Login
        //     // logo={Logo}
        //     title="M78 Admin"
        //     desc="全新的多任务后台系统"
        //     content={
        //       <Row className="p-12" mainAlign="between" crossAlign="center">
        //         <div>
        //           <a
        //             className="fs"
        //             onClick={() => {
        //               taskGlobal.push('WillPopDemo');
        //
        //               // Wine.render({
        //               //   header: <div>你好啊</div>,
        //               //   content: (
        //               //     <div>
        //               //       <h1>标题</h1>
        //               //       <div>12312312</div>
        //               //     </div>
        //               //   ),
        //               // });
        //             }}
        //           >
        //             忘记密码?
        //           </a>
        //           <a className="fs">注册</a>
        //         </div>
        //         <Button type="submit" size="large" outline color="primary">
        //           登录
        //         </Button>
        //       </Row>
        //     }
        //   />
        // }
      />
    </>
  );
};

export default App;
