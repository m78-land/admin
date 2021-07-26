import React from 'react';
import { Badge } from '../../index';

interface Props {
  /** 打开数量 */
  length: number;
}

/** 任务入口的数量和打开标记 */
const FuncStatusFlagBuilder = ({ length }: Props) => {
  return length > 0 ? <Badge>{length > 1 ? length : undefined}</Badge> : null;
};

export default FuncStatusFlagBuilder;
