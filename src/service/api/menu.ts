import { request } from '../request';

/** 获取菜单树（用于菜单管理页，返回完整 Menu 含 children） */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.Menu[]>({
    url: '/api/v1/base/menus',
    method: 'get'
  });
}

/** 获取所有菜单（扁平，用于选择父菜单下拉） */
export function fetchGetAllMenus() {
  return request<Api.SystemManage.Menu[]>({
    url: '/api/v1/base/menus/all',
    method: 'get'
  });
}

/** 获取单个菜单 */
export function fetchGetMenu(id: number) {
  return request<Api.SystemManage.Menu>({
    url: `/api/v1/base/menus/${id}`,
    method: 'get'
  });
}

/** 创建菜单 */
export function fetchCreateMenu(data: Partial<Api.SystemManage.Menu>) {
  return request<Api.SystemManage.Menu>({
    url: '/api/v1/base/menus',
    method: 'post',
    data
  });
}

/** 更新菜单 */
export function fetchUpdateMenu(id: number, data: Partial<Api.SystemManage.Menu>) {
  return request<Api.SystemManage.Menu>({
    url: `/api/v1/base/menus/${id}`,
    method: 'put',
    data
  });
}

/** 删除菜单 */
export function fetchDeleteMenu(id: number) {
  return request<null>({
    url: `/api/v1/base/menus/${id}`,
    method: 'delete'
  });
}
