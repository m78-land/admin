import React, { useState } from 'react';
import './style.scss';
import { Button } from 'm78/button';

import { Row } from 'm78/layout';
import { PushpinOutlined, SettingOutlined, ThunderboltOutlined } from 'm78/icon';
import { FuncItem, Link, M78Admin, taskGlobal } from '../index';
import { M78AdminConfig } from '../types/core';
import { Permission } from './permission/permission';
import IconRender from '../widget/unit/icon-render';
import { opt } from './taskConfig';

// Auth.setAuth(['user:cr', 'setting:ud']);

const App = () => {
  const [config, setConfig] = useState<M78AdminConfig>({
    collectFunc: ['menu1', 'xxx1', 'xxx2', 'role1', 'role2'],
    darkMode: false,
    // initFull: true,
  });

  function setPermission(per: any) {
    Permission.seed.set({
      permission: per,
    });
  }

  return (
    <>
      <M78Admin
        // width="70vw"
        // height="70vh"
        tasks={opt}
        desktop={
          <div>
            <div>
              <IconRender icon="β¨" />
              <IconRender icon="π¨" />
              <IconRender icon={<ThunderboltOutlined />} />
              <IconRender icon={<SettingOutlined />} />
              <IconRender icon={<PushpinOutlined />} />
              <IconRender icon="http://pic.51yuansu.com/pic3/cover/01/35/81/5924def7eadc7_610.jpg" />
              <IconRender icon="https://pic.onlinewebfonts.com/svg/img_365060.png" />
            </div>
            <span>ππζ¬’θΏ</span>

            <Link id="role1" param={{ name: 'lxj' }}>
              θ·³θ½¬ role1
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
            <Button
              onClick={() =>
                setPermission({
                  user: ['create', 'query'],
                })
              }
            >
              user: crate query
            </Button>
            <Button
              onClick={() =>
                setPermission({
                  news: ['create', 'query'],
                })
              }
            >
              news: crate query
            </Button>
            <Button onClick={() => taskGlobal.push('permission1')}>push permissionPage1</Button>
          </div>
        }
        // footerNode={<div>πβ¨</div>}
        loading={false}
        taskBarLeadingExtra={<span>ε΅ε΅ε</span>}
        taskBarExtra={<span>ε΅ε΅</span>}
        funcBarExtra={
          <>
            <Row>
              <FuncItem icon="β" title="θ?Ύη½?" />
              <FuncItem icon="π" title="εΈ?ε©" />
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
        permission={Permission}
        // beforeTaskEach={opts => {
        //   if (opts.id === 'role1') {
        //     message.tips({ content: 'ιθ――' });
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
        //     desc="ε¨ζ°ηε€δ»»ε‘εε°η³»η»"
        //     content={
        //       <Row className="p-12" mainAlign="between" crossAlign="center">
        //         <div>
        //           <a
        //             className="fs"
        //             onClick={() => {
        //               taskGlobal.push('WillPopDemo');
        //
        //               // Wine.render({
        //               //   header: <div>δ½ ε₯½ε</div>,
        //               //   content: (
        //               //     <div>
        //               //       <h1>ζ ι’</h1>
        //               //       <div>12312312</div>
        //               //     </div>
        //               //   ),
        //               // });
        //             }}
        //           >
        //             εΏθ?°ε―η ?
        //           </a>
        //           <a className="fs">ζ³¨ε</a>
        //         </div>
        //         <Button type="submit" size="large" outline color="primary">
        //           η»ε½
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
