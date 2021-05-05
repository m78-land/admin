import React, { useState } from 'react';
import { M78Admin, Badge, FuncBtn } from '../index';
import { M78AdminConfig, TaskOpt } from '../types';
import './style.scss';

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
    // auth: ['user:cr', 'setting:ud'],
  },
  {
    id: 'xxx2',
    name: '无名功能2',
    icon: '😛',
    component: TestLazy2,
    // auth: ['user:cr'],
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
    collectFunc: ['xxx1', 'xxx2', 'role1', 'role2'],
    darkMode: false,
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
      // desktopNode={<span>🎉🎉欢迎</span>}
      // footerNode={<div>🎉✨</div>}
      loading={false}
      desktopNode={
        <div className="grid-wrap m78-scrollbar">
          <div className="grid __large">
            <div className="grid-column1">
              <div className="grid-box1 p-24">
                <div>统计计数</div>
                <div>今日 ----</div>
                <div>销售额 | 访问量 | 入库 | 注册会员</div>
                <div>总计 ----</div>
                <div>销售额 | 访问量 | 注册会员</div>
              </div>
              <div className="grid-box2">待审核用户: 50</div>
              <div className="grid-box3">
                动态:
                <div>xxx 录入了一条入库信息</div>
              </div>
            </div>

            <div className="grid-column2">
              <div className="grid-column2_row1">
                <div className="grid-box4">
                  <div>热卖种类 (图表)</div>
                  <div>水果</div>
                  <div>熟食</div>
                </div>
                <div className="grid-box5">
                  <div>热卖产品 (标签云)</div>
                  <div>橘子</div>
                  <div>苹果</div>
                </div>
              </div>
              <div className="grid-box6">销售额统计折线图</div>
              <div className="grid-column2_row3">
                <div className="grid-box7">
                  <div>销售额占比分析: 饼图</div>
                </div>
                <div className="grid-box8">过期产品: 51</div>
                <div className="grid-box9">
                  <div>库存信息</div>
                  <div>水果类：充足</div>
                  <div>熟食类：短缺</div>
                  <div>饮料：充足</div>
                </div>
              </div>
            </div>

            <div className="grid-column3">
              <div className="grid-box10">
                离销售目标还差:
                <div>5125元</div>
              </div>
              <div className="grid-box11">
                <div>员工考勤状况:</div>
                <div>在岗: 7/12</div>
                <div>请假: 4</div>
                <div>离职: 1</div>
              </div>
              <div className="grid-box12">
                <div>今日员工销售额</div>
                <div>列表1</div>
                <div>列表1</div>
                <div>列表1</div>
                <div>列表1</div>
              </div>
            </div>
          </div>
        </div>
      }
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
      authNameMap={{
        user: '用户',
        setting: '设置',
      }}
      customAuthKeysMap={{
        b: {
          name: 'batch',
          label: '批处理',
        },
        p: {
          name: 'publish',
          label: '发布内容',
        },
      }}
      // authSeed={authSeed}
      // beforeTaskEach={opt => {
      //   if (opt.id === 'role1') {
      //     Message.tips({ content: '错误' });
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
