import { useEffect } from 'react';
import { WINE_OFFSET, WINE_OFFSET_LEFT } from '../common/const';

/**
 * 处理程序
 * */
const Handles = () => {
  // 更新传递给wine的bound信息, wine内部不会改变引用，直接改原对象即可
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 680 /* style/common.scss */) {
        WINE_OFFSET.left = 0;
      } else {
        WINE_OFFSET.left = WINE_OFFSET_LEFT;
      }
    };

    resize();

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return null;
};

export default Handles;
