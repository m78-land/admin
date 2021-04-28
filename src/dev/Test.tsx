import Button from 'm78/button';
import React, { useEffect } from 'react';
import WindowLayout from '../widget/window-layout/window-layout';
import WindowLayoutSection from '../widget/window-layout/window-layout-section';
import { TaskCtx } from '../types';
import task from '../task/task';
import { Link } from '../index';

export default function Test(props: TaskCtx<{ name: string }>) {
  useEffect(() => {
    console.log('render');
    return () => console.log('un_render');
  }, []);

  task.useWillPop(props, () => props.id === 'role1');

  console.log('1111 render');

  return (
    <WindowLayout>
      <WindowLayoutSection label="角色管理操作1" desc="角色管理操作对应的一段描述">
        <div>
          <div>{JSON.stringify(props.param)}</div>
          <div>
            <Button onClick={() => props.setParam({ name: 'lxj' })}>setParam</Button>
          </div>
          <div>
            <Button
              onClick={() => {
                props.push('role1');
                props.push('role2', { name: 'zl' });
                props.push('role3');
              }}
            >
              push😀😋😍😘
            </Button>
            <Button
              onClick={() => {
                props.replace('role1');
              }}
            >
              replace
            </Button>
            <Link id="xxx1" param={{ name: 'lxj' }}>
              跳转 xxx1
            </Link>
            <Link id="xxx2" blank>
              <Button>xxx2</Button>
            </Link>
          </div>
          {Array.from({ length: 50 }).map((i, ind) => (
            <div key={ind}>{ind}</div>
          ))}
        </div>
      </WindowLayoutSection>

      <div>21废弃物服务器废弃物服务器</div>

      <WindowLayoutSection label="角色管理操作2" desc="角色管理操作对应的一段描述">
        <div>
          <div>{JSON.stringify(props.param)}</div>
          <div>
            <Button onClick={() => props.setParam({ name: 'lxj' })}>setParam</Button>
          </div>
          <div>
            <Button
              onClick={() => {
                props.push('role1');
                props.push('role2');
                props.push('role3');
              }}
            >
              push
            </Button>
          </div>
          {Array.from({ length: 30 }).map((i, ind) => (
            <div key={ind}>{ind}</div>
          ))}
        </div>
      </WindowLayoutSection>

      <WindowLayoutSection label="角色管理操作3" desc="角色管理操作对应的一段描述">
        <div>
          <div>{JSON.stringify(props.param)}</div>
          <div>
            <Button onClick={() => props.setParam({ name: 'lxj' })}>setParam</Button>
          </div>
          <div>
            <Button
              onClick={() => {
                props.push('role1');
                props.push('role2');
                props.push('role3');
              }}
            >
              push
            </Button>
          </div>
          {Array.from({ length: 30 }).map((i, ind) => (
            <div key={ind}>{ind}</div>
          ))}
        </div>
      </WindowLayoutSection>
    </WindowLayout>
  );
}
