import { Role } from '../../interfaces';

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  size: string;
  color: string;
  role: Role;
  tags: string[];
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}
