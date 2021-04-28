import { MediaQueryTypeKey, MediaQueryTypeValues } from '../../types';

/**
 * 根据尺寸检测是何种类型
 * */
export function calcType(size: number) {
  if (size >= MediaQueryTypeValues.XXL) {
    return MediaQueryTypeKey.XXL;
  }

  if (size >= MediaQueryTypeValues.XL && size < MediaQueryTypeValues.XXL) {
    return MediaQueryTypeKey.XL;
  }

  if (size >= MediaQueryTypeValues.LG && size < MediaQueryTypeValues.XL) {
    return MediaQueryTypeKey.LG;
  }

  if (size >= MediaQueryTypeValues.MD && size < MediaQueryTypeValues.LG) {
    return MediaQueryTypeKey.MD;
  }

  if (size >= MediaQueryTypeValues.SM && size < MediaQueryTypeValues.MD) {
    return MediaQueryTypeKey.SM;
  }

  return MediaQueryTypeKey.XS;
}
