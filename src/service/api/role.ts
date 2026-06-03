import { request } from '../request';

/** 分页查询角色 */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/api/v1/base/roles',
    method: 'get',
    params
  });
}

/** 获取所有角色（下拉用） */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/api/v1/base/roles/all',
    method: 'get'
  });
}

/** 获取单个角色 */
export function fetchGetRole(id: number) {
  return request<Api.SystemManage.Role>({
    url: `/api/v1/base/roles/${id}`,
    method: 'get'
  });
}

/** 获取角色已分配的菜单 ID 列表 */
export function fetchGetRoleMenus(id: number) {
  return request<{ id: number }[]>({
    url: `/api/v1/base/roles/${id}/menus`,
    method: 'get'
  });
}

/** 创建角色 */
export function fetchCreateRole(data: Partial<Api.SystemManage.Role>) {
  return request<Api.SystemManage.Role>({
    url: '/api/v1/base/roles',
    method: 'post',
    data
  });
}

/** 更新角色 */
export function fetchUpdateRole(id: number, data: Partial<Api.SystemManage.Role>) {
  return request<Api.SystemManage.Role>({
    url: `/api/v1/base/roles/${id}`,
    method: 'put',
    data
  });
}

/** 删除角色 */
export function fetchDeleteRole(id: number) {
  return request<null>({
    url: `/api/v1/base/roles/${id}`,
    method: 'delete'
  });
}

/** 分配菜单给角色 */
export function fetchAssignRoleMenus(id: number, menuIds: number[]) {
  return request<null>({
    url: `/api/v1/base/roles/${id}/menus`,
    method: 'put',
    data: menuIds
  });
}
