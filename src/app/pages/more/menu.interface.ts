import { Role } from '../../interfaces';

export interface MenuItem {
  title: string;
  group: string;
  url: string;
  img: string;
  role: Role;
  attachTicket?: boolean; // set to true if the service needs a service ticket
  tags: string[];
}
