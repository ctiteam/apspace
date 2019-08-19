import { Role } from '../../interfaces';

export interface MenuItem {
  title: string;
  group: string;
  url: string;
  img: string;
  role: Role;
  tags: string[];
}
