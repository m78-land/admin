import React, { ReactElement } from 'react';
import { AuthProps } from 'm78/seed/type';
import { ValidMeta } from '@m78/seed/types';
import authSeed from './auth-seed';
import { AuthDetailMap, AuthSeedState, AuthStrings } from '../types';
import { ADMIN_AUTH_NAME } from './common';

/*
 * #####################################################
 * 重写seed的权限api, 为admin提供更适合后台的使用方式
 * #####################################################
 * */

interface AdminAuthProps extends Omit<AuthProps<AuthSeedState, any>, 'keys' | 'extra'> {
  keys: AuthStrings;
}

/** 为admin改写的seed权限 */
interface AdminAuth {
  /** 权限检测组件, 同 AdminAuth.Auth */
  (props: AdminAuthProps): ReactElement<any, any> | null;
  /** 设置当前权限 */
  setAuth: (auth: AuthStrings) => void;
  /** 获取当前权限 */
  getAuth: () => AuthStrings;
  /** 获取由当前权限转换得到的详细对象 */
  getAuthDetail: () => AuthDetailMap | null;
  /** 权限检测组件 */
  Auth: (props: AdminAuthProps) => ReactElement<any, any> | null;
  /** 权限验证hook */
  useAuth: (keys: AuthStrings) => ValidMeta[] | null;
  /** 传入权限数组进行验证 */
  auth: (keys: AuthStrings) => ValidMeta[] | null;
  /** 创建带权限检测的高阶组件 */
  withAuth: <P>(
    conf: Omit<AdminAuthProps, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
  /** 通过hook获取当前的auth并响应更新 */
  useCurrentAuth: () => AuthStrings;
}

const Auth: AdminAuth = (props: AdminAuthProps) => {
  return (
    <authSeed.Auth {...props} keys={[ADMIN_AUTH_NAME]} extra={props.keys}>
      {props.children}
    </authSeed.Auth>
  );
};

Auth.setAuth = auth => {
  authSeed.setState({
    auth,
  });
};

Auth.getAuth = () => authSeed.getState().auth;

Auth.getAuthDetail = () => authSeed.getState().authDetailMap;

Auth.Auth = Auth;

Auth.useAuth = auth =>
  authSeed.useAuth([ADMIN_AUTH_NAME], {
    extra: auth,
  });

Auth.auth = auth =>
  authSeed.auth([ADMIN_AUTH_NAME], {
    extra: auth,
  });

Auth.withAuth = ({ keys, ...o }) => {
  return authSeed.withAuth({
    ...o,
    extra: keys,
    keys: [ADMIN_AUTH_NAME],
  });
};

Auth.useCurrentAuth = () => authSeed.useState(({ auth }) => auth);

export { Auth };
