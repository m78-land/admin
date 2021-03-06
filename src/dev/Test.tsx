import { Button } from 'm78/button';
import React from 'react';
import { Input } from 'm78/input';
import { Grids, MediaQuery } from 'm78/layout';
import { useForm } from 'm78/form';
import WindowLayout from '../widget/window-layout/window-layout';
import { TaskCtx } from '../types/types';
import taskGlobal from '../task/task-global';
import { Link } from '../index';

export default function Test(props: TaskCtx<{ name: string }>) {
  // useEffect(() => {
  //   console.log('render');
  //   return () => console.log('un_render');
  // }, []);

  taskGlobal.useWillPop(props, () => props.id === 'role1');

  const Form = useForm();

  // console.log('1111 render');

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
      topBar={toggle => (
        <div>
          <Grids>
            <Grids.Item xs={12} md={6} xl={4}>
              <Form.Field label="表单xx" name="f1">
                <Input placeholder="输入内容进行搜索" />
              </Form.Field>
            </Grids.Item>
            <Grids.Item xs={12} md={6} xl={4}>
              <Form.Field label="表单xx" name="f2">
                <Input placeholder="输入内容进行搜索" />
              </Form.Field>
            </Grids.Item>
            {toggle && (
              <>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
                <Grids.Item xs={12} md={6} xl={4}>
                  <Form.Field label="表单xx" name="f3">
                    <Input placeholder="输入内容进行搜索" />
                  </Form.Field>
                </Grids.Item>
              </>
            )}
          </Grids>
        </div>
      )}
      topBarType="eclipse"
      footer={<Button size="large">按钮</Button>}
    >
      <MediaQuery>
        {meta => (
          <div>
            <div id="s1">
              <h3>角色管理操作1</h3>
            </div>

            <div>{JSON.stringify(meta)}</div>

            <MediaQuery>
              {meta1 => (
                <div>
                  {meta.type}
                  <br />
                  {meta1.isSmall() && 'small'}
                  {meta1.isMedium() && 'medium'}
                  {meta1.isLarge() && 'large'}
                </div>
              )}
            </MediaQuery>
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
                <Button
                  onClick={() => {
                    props.push('role1');
                  }}
                >
                  push
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

            <div>21废弃物服务器废弃物服务器</div>

            <div id="s2">
              <h3>角色管理操作2</h3>
            </div>

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

            <div id="s3">
              <h3>角色管理操作3</h3>
            </div>

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
        )}
      </MediaQuery>
    </WindowLayout>
  );
}
