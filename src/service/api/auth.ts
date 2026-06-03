import { request } from '../request';

/**
 * 登录
 *
 * @param username 用户名
 * @param password 密码
 */
export function fetchLogin(username: string, password: string) {
  return request<Api.Auth.LoginToken & { userInfo: Api.Auth.UserInfo }>({
    url: '/api/v1/base/auth/login',
    method: 'post',
    data: { username, password }
  });
}

/** 登出 */
export function fetchLogout() {
  return request<void>({
    url: '/api/v1/base/auth/logout',
    method: 'post'
  });
}
