import { EllipsisOutlined } from 'm78/icon';
import React from 'react';
import { Row } from 'm78/layout';
import { ContextMenu } from 'm78/context-menu';
import { UseTriggerTypeEnum } from 'm78/hooks';
import FuncContextMenuBuilder from '../unit/func-context-menu-builder';
import FuncStatusFlagBuilder from '../unit/func-status-flag-builder';
import { M78AdminConfig, TaskCtxList, TaskOptItem } from '../../types/types';

export function renderFuncActions(
  tasks: TaskCtxList,
  isCollectd: boolean,
  item: TaskOptItem,
  config?: M78AdminConfig,
) {
  const length = tasks.length;

  return (
    <Row crossAlign="center">
      <span style={{ marginRight: 2 }}>
        <FuncStatusFlagBuilder length={length} />
      </span>
      <ContextMenu
        triggerType={UseTriggerTypeEnum.click}
        content={
          <FuncContextMenuBuilder
            tasks={tasks}
            taskOptItem={item}
            config={config}
            isCollectd={isCollectd}
          />
        }
      >
        <span className="m78-admin_func-list_more-btn m78-admin_effect fs-md">
          <EllipsisOutlined />
        </span>
      </ContextMenu>
    </Row>
  );
}
