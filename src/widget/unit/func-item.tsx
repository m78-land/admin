import { Tile, TileProps } from 'm78/layout';
import React from 'react';
import clsx from 'clsx';
import IconRender from './icon-render';

interface Props extends TileProps {
  icon?: React.ReactNode;
  title: string;
}

// 样式统一的功能入口按钮
const FuncItem = ({ title, icon, className, ...pp }: Props) => {
  return (
    <Tile
      crossAlign="center"
      className={clsx('m78-admin_func-item', className)}
      leading={<IconRender icon={icon} />}
      title={title}
      {...pp}
    />
  );
};

export default FuncItem;
