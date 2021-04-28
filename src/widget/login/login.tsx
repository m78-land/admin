import React from 'react';
import { TaskLoginProps } from '../../types';

/**
 * 内置的登录样式，非必选
 * */
const Login = ({ logo, title, desc, content }: TaskLoginProps) => {
  return (
    <div className="m78-admin_login">
      <div className="m78-admin_login-bg" />
      <div className="m78-admin_login-content">
        <div className="tc mb-24">
          {logo && <img style={{ width: 120 }} src={logo} alt="" />}
          {title && <div className="m78-admin_login-title">{title}</div>}
          {desc && <div className="color-second">{desc}</div>}
        </div>
        {content}
      </div>
    </div>
  );
};

export default Login;
