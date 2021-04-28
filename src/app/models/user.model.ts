import { Permission } from './permission.model';
import { Group } from './group.model';

export class User {
  id?: any;
  name?: string;
  email?: string;
  password?: string;
  permissions?: Permission[];
  groups?: Group[];
}
