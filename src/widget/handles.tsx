import { useEffect } from 'react';
import { LG } from 'm78/util';
import _debounce from 'lodash/debounce';
import taskSeed from '../task/task-seed';

/**
 * 处理程序
 * */
const Handles = () => {
  // 更新传递给wine的bound信息, wine内部不会改变引用，直接改原对象即可
  useEffect(() => {
    const resize = _debounce(() => {
      if (window.innerWidth < LG) {
        // 小屏下强制使用浮动菜单
        taskSeed.setState({
          funcBarFloat: true,
        });
      } else {
        // 大屏下还原菜单
        taskSeed.setState({
          funcBarFloat: false,
        });
      }
    }, 200);

    resize();

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return null;
};

export default Handles;
