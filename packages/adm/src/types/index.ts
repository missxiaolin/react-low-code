/**
 * 菜单类型
 */
export interface IMenuItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  children?: IMenuItem[];
}

export interface ProjectItem {
  id: number;
  name: string;
  remark: string;
  logo: string;
  userName: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
}
