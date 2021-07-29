import React from 'react';
import Wine from '@m78/wine';
import clsx from 'clsx';
import { MediaQuery } from 'm78/layout';
import { TaskLoginProps } from '../../types';

/**
 * 内置的登录样式，非必选
 * */
const Login = ({ logo, title, desc, content }: TaskLoginProps) => {
  return (
    <MediaQuery>
      {meta => {
        const isSmall = meta.isSmall();
        return (
          <>
            <Wine.RenderBoxTarget />
            <div className="m78-admin_login">
              <div className="m78-admin_login-bg" />
              <div
                className="m78-admin_login-content"
                style={{ padding: isSmall ? '40px 12px 60px' : '40px 60px 60px' }}
              >
                <div className="tc mb-24">
                  {logo && <img style={{ width: isSmall ? 80 : 120 }} src={logo} alt="" />}
                  {title && (
                    <div className={clsx('m78-admin_login-title', isSmall ? 'fs-18' : 'fs-24')}>
                      {title}
                    </div>
                  )}
                  {desc && <div className="color-second">{desc}</div>}
                </div>
                {content}
                <div className="m78-admin_login-content_bg" />
              </div>
            </div>
          </>
        );
      }}
    </MediaQuery>
  );
};

export default Login;
