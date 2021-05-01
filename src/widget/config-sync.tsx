import { useEffect } from 'react';
import Wine from '@m78/wine';
import { m78Config } from 'm78/config';
import taskSeed from '../task/task-seed';
import { configGetter } from '../common/common';

/**
 * 监听配置变更并对特定配置进行处理
 * */
const ConfigSync = () => {
  const config = taskSeed.useState(configGetter);

  const darkMode = config?.darkMode || false;

  const maxWindow = config?.maxWindow || 12;

  const color = config?.color;

  const subColor = config?.subColor;

  /* 主题模式切换 */
  useEffect(() => {
    m78Config.setState({
      darkMode,
    });
  }, [darkMode]);

  /* 最大实例改变 */
  useEffect(() => {
    Wine.setMaxInstance(maxWindow);
  }, [maxWindow]);

  /* 主题色改变 */
  useEffect(() => {
    const dSty = document.documentElement.style;
    if (dSty.setProperty) {
      dSty.setProperty('--m78-color-6', color || '');
      dSty.setProperty('--m78-color-sub-6', subColor || '');
    }
  }, [color, subColor]);

  return null;
};

export default ConfigSync;
