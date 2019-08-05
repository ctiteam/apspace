import { Role } from '../../interfaces';

export interface MenuItem {
  title: string;
  url: string;
  img: string;
  role: Role;
  tags: string[];
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}
