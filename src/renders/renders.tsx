import React from 'react';
import { ContextMenuProps } from 'm78/context-menu';
import { PopperPropsCustom } from 'm78/popper';
import { isFunction } from '@lxjx/utils';

/**
 * 对标contextMenu的popper样式，其通过点击触发
 * */
export function actionPopperCustomer(props: PopperPropsCustom) {
  const contRender = props.content as ContextMenuProps['content'];

  return (
    <div className="m78-context-menu" onClick={() => props.setShow(false)}>
      {isFunction(contRender) ? contRender(props) : contRender}
    </div>
  );
}
