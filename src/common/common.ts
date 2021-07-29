import { Seed } from 'm78/seed';
import { useEffect, useState } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { generate } from '@ant-design/colors';
import { isString } from '@lxjx/utils';
import taskSeed from '../task/task-seed';
import { M78AdminConfig, TaskState } from '../types';

/**
 * 发送警告信息
 * */
export function adminWarn(str: string) {
  console.warn('m78-admin: ', str);
}

/**
 * 从传入的状态值中取配置对象
 * */
export function configGetter(state: TaskState) {
  return state.adminProps?.config;
}

/**
 * 向外部发送配置变更通知
 * */
export function emitConfig(conf: Partial<M78AdminConfig>) {
  const callback = taskSeed.getState().adminProps.onConfigChange;
  callback && callback(conf);
}

/** 接收一个state中包含auth的seed，并在其改变时触发更新 */
export function useSubscribeAuthChange(seed: Seed) {
  const [authKeyChangeFlag, setFlag] = useState(0);

  useEffect(() => {
    const subscribe = seed.subscribe;

    return subscribe(changes => {
      if ('auth' in changes) {
        setFlag(prev => prev + 1);
      }
    });
  }, []);

  return authKeyChangeFlag;
}

/** 根据录入的主题色和次要主题色生成用于注入tag的css变量字符 */
export function generateThemeColorRules(color?: string, subColor?: string) {
  let s = '';

  const gHelper = (prefix: string, _color?: string) => {
    const tinyColor = new TinyColor(_color);

    if (tinyColor.isValid) {
      const colors = generate(_color!);

      tinyColor.setAlpha(0.2);
      const a02 = tinyColor.toRgbString();

      tinyColor.setAlpha(0.5);
      const a05 = tinyColor.toRgbString();

      tinyColor.setAlpha(0.75);
      const a075 = tinyColor.toRgbString();

      s += colors.map((c, ind) => `${prefix}-${ind + 1}: ${c};`).join('');

      s += `
        ${prefix}-opacity-sm: ${a02};
        ${prefix}-opacity-md: ${a05};
        ${prefix}-opacity-lg: ${a075};
    `;
    }
  };

  gHelper('--m78-color', color);
  gHelper('--m78-color-sub', subColor);

  return s
    ? `
      :root {
        ${s}
      }
    `
    : s;
}

/** 支持渲染的图片后缀类型 */
const stringIconSuffix = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

/** 是否是img表情可渲染的图片地址 网络图片/base64等 */
export function isStringIcon(icon: any): icon is string {
  if (!isString(icon)) return false;
  if (icon.startsWith('data:image')) return true;

  const slice = icon.split('.');
  const suffix = slice[slice.length - 1];

  return !!(suffix && stringIconSuffix.includes(suffix));
}
