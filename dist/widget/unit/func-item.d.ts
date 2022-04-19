import { TileProps } from 'm78/layout';
import React from 'react';
interface Props extends TileProps {
    icon?: React.ReactNode;
    title: string;
}
declare const FuncItem: ({ title, icon, className, ...pp }: Props) => JSX.Element;
export default FuncItem;
