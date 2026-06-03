import { request } from '../request';

/** 分页查询用户 */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/api/v1/base/users',
    method: 'get',
    params
  });
}

/** 获取单个用户 */
export function fetchGetUser(id: number) {
  return request<Api.SystemManage.User>({
    url: `/api/v1/base/users/${id}`,
    method: 'get'
  });
}

/** 创建用户 */
export function fetchCreateUser(data: Partial<Api.SystemManage.User> & { password: string; roleIds?: number[] }) {
  return request<Api.SystemManage.User>({
    url: '/api/v1/base/users',
    method: 'post',
    data
  });
}

/** 更新用户 */
export function fetchUpdateUser(id: number, data: Partial<Api.SystemManage.User> & { roleIds?: number[] }) {
  return request<Api.SystemManage.User>({
    url: `/api/v1/base/users/${id}`,
    method: 'put',
    data
  });
}

/** 删除用户 */
export function fetchDeleteUser(id: number) {
  return request<null>({
    url: `/api/v1/base/users/${id}`,
    method: 'delete'
  });
}

/** 分配角色 */
export function fetchAssignUserRoles(id: number, roleIds: number[]) {
  return request<null>({
    url: `/api/v1/base/users/${id}/roles`,
    method: 'put',
    data: roleIds
  });
}

/** 切换用户状态 */
export function fetchUpdateUserStatus(id: number, status: number) {
  return request<null>({
    url: `/api/v1/base/users/${id}/status`,
    method: 'put',
    params: { status }
  });
}
