/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - 1: enabled
     * - 0: disabled
     */
    type EnableStatus = number;

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy?: string;
      /** record create time */
      createTime?: string;
      /** record updater */
      updateBy?: string;
      /** record update time */
      updateTime?: string;
      /** record status */
      status?: EnableStatus;
    } & T;
  }

  /**
   * Namespace Auth
   *
   * Backend api module: "auth"
   */
  namespace Auth {
    /** 后端 LoginVO 中的 token 部分 */
    interface LoginToken {
      token: string;
      /** token 过期时间（秒） */
      expiresIn: number;
    }

    /** 后端 LoginVO.UserInfo */
    interface UserInfo {
      id: number;
      username: string;
      nickname: string;
      roles: string[];
      /** 权限码（user:list、user:add 等） */
      permissions: string[];
    }
  }

  /**
   * Namespace Route
   *
   * Backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    /** role — 与后端 SysRole 实体对应 */
    type Role = {
      id: number;
      code: string;
      name: string;
      description: string;
      status: number;
      createdAt: string;
      updatedAt: string;
    };

    /** role search params */
    type RoleSearchParams = Partial<Pick<Role, 'name' | 'code' | 'status'> & Common.CommonSearchParams>;

    /** role list（分页） */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role（用于下拉） */
    type AllRole = Pick<Role, 'id' | 'name' | 'code'>;

    /** user — 与后端 SysUser 实体对应 */
    type User = {
      id: number;
      username: string;
      nickname: string;
      phone: string;
      email: string;
      avatar: string;
      /** 1 启用，0 禁用 */
      status: number;
      createdAt: string;
      updatedAt: string;
      /** 角色 ID 列表（用于分配角色） */
      roleIds?: number[];
    };

    /** user search params */
    type UserSearchParams = Partial<
      Pick<User, 'status'> & { keyword?: string } & Common.CommonSearchParams
    >;

    /** user list（分页） */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** menu — 与后端 SysMenu 实体对应 */
    type Menu = {
      id: number;
      parentId: number;
      /** 1 目录 2 菜单 3 按钮 */
      type: number;
      name: string;
      title: string;
      path: string;
      component: string;
      icon: string;
      permission: string;
      sort: number;
      status: number;
      createdAt: string;
      updatedAt: string;
      children?: Menu[];
    };

    /** 菜单树（含 children 嵌套） */
    type MenuTree = {
      id: number;
      name: string;
      title: string;
      children?: MenuTree[];
    };

    /** 菜单列表（扁平） */
    type MenuList = Menu[];
  }

  /**
   * Namespace File
   *
   * Backend api module: "files"
   */
  namespace File {
    interface FileRecord {
      id: number;
      name: string;
      originalName: string;
      url: string;
      size: number;
      contentType: string;
      module: string;
      bizId: number;
      uploadedBy: number;
      createdAt: string;
    }

    type FileList = Common.PaginatingQueryRecord<FileRecord>;
  }
}
