import { useEffect, useMemo } from 'react';
import Wine from '@m78/wine';
import { m78Config } from 'm78/config';
import taskSeed from '../task/task-seed';
import { configGetter, generateThemeColorRules } from '../common/common';

/**
 * 监听配置变更并对特定配置进行处理
 * */
const ConfigSync = () => {
  const config = taskSeed.useState(configGetter);

  /*
   * #################################
   * 主题模式切换
   * #################################
   * */

  const darkMode = config?.darkMode || false;

  useEffect(() => {
    m78Config.setState({
      darkMode,
    });
  }, [darkMode]);

  /*
   * #################################
   * 最大实例改变
   * #################################
   * */

  const maxWindow = config?.maxWindow || 12;

  useEffect(() => {
    Wine.setMaxInstance(maxWindow);
  }, [maxWindow]);

  /*
   * #################################
   * 主题色配置操作
   * #################################
   * */

  const color = config?.color;

  const subColor = config?.subColor;

  /** 注入自定义css变量的style tag */
  const styleTag = useMemo(() => {
    const tag = document.createElement('style');
    tag.setAttribute('type', 'text/css');
    tag.setAttribute('data-name', 'm78-theme-custom');
    document.head.appendChild(tag);
    return tag;
  }, []);

  /* 主题色改变 */
  useEffect(() => {
    styleTag.innerHTML = generateThemeColorRules(color, subColor);
  }, [color, subColor]);

  /* 销毁创建的style节点 */
  useEffect(
    () => () => {
      document.head.removeChild(styleTag);
    },
    [],
  );

  return null;
};

export default ConfigSync;
