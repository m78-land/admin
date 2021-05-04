import { Button } from 'm78/button';
import React, { useEffect } from 'react';
import { Input } from 'm78/input';
import { Row } from 'm78/layout';
import WindowLayout from '../widget/window-layout/window-layout';
import { TaskCtx } from '../types';
import task from '../task/task';
import { Link, MediaQuery } from '../index';

export default function Test(props: TaskCtx<{ name: string }>) {
  useEffect(() => {
    console.log('render');
    return () => console.log('un_render');
  }, []);

  task.useWillPop(props, () => props.id === 'role1');

  console.log('1111 render');

  return (
    <WindowLayout
      sideTabs={[
        {
          label: '角色管理操作1',
          selector: '#s1',
        },
        {
          label: '角色管理操作2',
          selector: '#s2',
        },
        {
          label: '角色管理操作3',
          selector: '#s3',
        },
      ]}
      topBar={
        <Row mainAlign="between">
          <span>内容</span>
          <Input placeholder="输入内容进行搜索" style={{ width: 200 }} />
        </Row>
      }
      footer={<Button size="large">按钮</Button>}
    >
      <div>
        <div id="s1">
          <h3>角色管理操作1</h3>
          <MediaQuery.Type>
            {meta => (
              <div>
                {meta.type}
                <br />
                {meta.isSmall() && 'small'}
                {meta.isMedium() && 'medium'}
                {meta.isLarge() && 'large'}
              </div>
            )}
          </MediaQuery.Type>
          <MediaQuery.Size>{meta => <div>{JSON.stringify(meta)}</div>}</MediaQuery.Size>
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
        </div>

        <div>21废弃物服务器废弃物服务器</div>

        <div id="s2">
          <h3>角色管理操作2</h3>
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
        </div>

        <div id="s3">
          <h3>角色管理操作3</h3>
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
        </div>
      </div>
    </WindowLayout>
  );
}
