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
