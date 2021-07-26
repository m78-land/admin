import React from 'react';
import { ContextMenuItem } from 'm78/context-menu';
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
import task from '../../task/task';
import { closeTaskById, collectHandle, hideTaskById, openTaskById } from '../../task/methods';
import { M78AdminConfig, TaskCtx, TaskOptItem } from '../../types';

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
  return (
    <div>
      {tasks.length > 0 && (
        <>
          {tasks.map((i, ind) => (
            <ContextMenuItem
              key={i.taskKey}
              leading={<ToTopOutlined />}
              title={`置顶任务${ind + 1}`}
              onClick={i.open}
            />
          ))}
          <Divider />
        </>
      )}
      <ContextMenuItem
        leading={taskOptItem.singleton ? <FullscreenOutlined /> : <AppstoreAddOutlined />}
        title={taskOptItem.singleton ? '打开窗口' : '打开新窗口'}
        onClick={() => task.push(taskOptItem.id)}
      />
      <ContextMenuItem
        leading={isCollectd ? <HeartFilled className="color-orange" /> : <HeartOutlined />}
        title={isCollectd ? '取消收藏' : '收藏功能'}
        onClick={() => collectHandle(taskOptItem.id, config?.collectFunc || [])}
      />
      {tasks.length > 0 && (
        <>
          <ContextMenuItem
            leading={<EyeInvisibleOutlined />}
            title="隐藏全部窗口"
            onClick={() => hideTaskById(taskOptItem.id)}
          />
          <ContextMenuItem
            leading={<SelectOutlined />}
            title="打开全部窗口"
            onClick={() => openTaskById(taskOptItem.id)}
          />
          <ContextMenuItem
            leading={<ExportOutlined />}
            title="关闭全部窗口"
            onClick={() => closeTaskById(taskOptItem.id)}
          />
        </>
      )}
    </div>
  );
};

export default FuncContextMenuBuilder;
