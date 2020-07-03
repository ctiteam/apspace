import { Role } from '../../interfaces';
import { menusRaw } from './menu';

// MenuID to allow type checked ID is part of menus
// cycle type MenuItem -> ids -> menusRaw x> MenuItem
// ids became never if it is 'string' (missing `as const`)
export type MenuID = string extends (typeof menusRaw[number])['id']
  ? never : (typeof menusRaw[number])['id'];

export interface MenuItem {
  id: MenuID; // must be unique and should not be changed
  title: string;
  group: string;
  url: string;
  img: string;
  role: Role;
  attachTicket?: boolean; // set to true if the service needs a service ticket
  canAccess?: boolean;
  tags: string[];
}
