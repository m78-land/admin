import React from 'react';
import { Divider } from 'm78/layout';
import {
  AppstoreAddOutlined,
  ExportOutlined,
  EyeInvisibleOutlined,
  FullscreenOutlined,
  HeartFilled,
  HeartOutlined,
  SelectOutlined,
  ToTopOutlined,
} from 'm78/icon';
import { ListView, ListViewItem } from 'm78/list-view';
import { SizeEnum } from 'm78/common';
import { useFn } from '@lxjx/hooks';
import taskGlobal from '../../task/task-global';
import { closeTaskById, collectHandle, hideTaskById, openTaskById } from '../../task/methods';
import { M78AdminConfig, TaskCtx, TaskOptItem } from '../../types/types';

interface Props {
  /** 改任务所有已打开窗口的数组 */
  tasks: TaskCtx[];
  /** 当前任务 */
  taskOptItem: TaskOptItem;
  /** 配置 */
  config: M78AdminConfig | undefined;
  /** 是否收藏 */
  isCollectd: boolean;
}

/** 任务入口的上下文菜单主内容 */
const FuncContextMenuBuilder = ({ tasks, taskOptItem, config, isCollectd }: Props) => {
  // 对某些操作延迟执行, 防止contextMenu即时更新造成闪烁
  const delayCall = useFn((cb: Function) => () => setTimeout(cb, 120));

  return (
    <ListView size={SizeEnum.small}>
      {tasks.length > 0 && (
        <>
          {tasks.map((i, ind) => (
            <ListViewItem
              key={i.taskKey}
              leading={<ToTopOutlined />}
              title={`置顶任务${ind + 1}`}
              onClick={i.open}
            />
          ))}
          <Divider />
        </>
      )}
      <ListViewItem
        leading={taskOptItem.singleton ? <FullscreenOutlined /> : <AppstoreAddOutlined />}
        title={taskOptItem.singleton ? '打开窗口' : '打开新窗口'}
        onClick={delayCall(() => taskGlobal.push(taskOptItem.id))}
      />
      <ListViewItem
        leading={isCollectd ? <HeartFilled className="color-orange" /> : <HeartOutlined />}
        title={isCollectd ? '取消收藏' : '收藏功能'}
        onClick={() => collectHandle(taskOptItem.id, config?.collectFunc || [])}
      />
      {tasks.length > 0 && (
        <>
          <ListViewItem
            leading={<EyeInvisibleOutlined />}
            title="隐藏全部窗口"
            onClick={() => hideTaskById(taskOptItem.id)}
          />
          <ListViewItem
            leading={<SelectOutlined />}
            title="打开全部窗口"
            onClick={() => openTaskById(taskOptItem.id)}
          />
          <ListViewItem
            leading={<ExportOutlined />}
            title="关闭全部窗口"
            onClick={delayCall(() => closeTaskById(taskOptItem.id))}
          />
        </>
      )}
    </ListView>
  );
};

export default FuncContextMenuBuilder;
