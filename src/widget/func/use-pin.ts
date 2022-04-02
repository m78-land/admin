import { createEvent, useDelayToggle } from '@lxjx/hooks';
import { useState } from 'react';

/**
 * 计数事件, 如果应该增加则在通过true触发
 * */
export const pinEvent = createEvent<(isPin: boolean) => void>();

/**
 * funcBar处于悬浮状态时, 如果通过操作打开了其他悬浮容器, 鼠标移开会导致funcBar收起, 需要在打开其他容器时添加标识阻止关闭funcBar
 * */
export function usePin(enable = true) {
  const [pin, set] = useState(false);

  pinEvent.useEvent(isPin => enable && set(isPin));

  return useDelayToggle(pin, 200, {
    leading: false,
    trailing: true,
  });
}
