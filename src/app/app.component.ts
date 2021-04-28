import { Component, OnInit, ContentChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Permission } from './models/permission.model';
import { Group } from './models/group.model';
import { User } from './models/user.model';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'User Management';
  permissions: Permission[] = [];
  groups: Group[] = [];
  users: User[] = [];
  searchBox = new FormControl('');
  public delete = new EventEmitter<void>();
  isShow: any;
  isShowU: any;
  isShowG: any;
  isShowP: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getUsers();
        this.getGroups();
        this.getPermissions();
      }
    })
  };

  ngOnInit() {
    this.getUsers();
    this.getGroups();
    this.getPermissions();
  }

  filterLists(): void {
    this.getPermissions();
    this.getGroups();
    this.getUsers();
  }

  getPermissions() {
    this.dataService.getPermissions()
      .subscribe(permissions => {
        if (this.searchBox.value.length > 0) {
          this.permissions = [];
          permissions
            .map((p) => {
              if (p.name?.toLowerCase().includes(this.searchBox.value.toLowerCase())) {
                this.permissions.push(p);
              }
            });
        } else {
          this.permissions = permissions;
        }
      });
  }

  getGroups() {
    this.dataService.getGroups()
      .subscribe(groups => {
        if (this.searchBox.value.length > 0) {
          this.groups = [];
          groups
            .map((p) => {
              if (p.name?.toLowerCase().includes(this.searchBox.value.toLowerCase())) {
                this.groups.push(p);
              }
            });
        } else {
          this.groups = groups;
        }
      });
  }

  getUsers() {
    this.dataService.getUsers()
      .subscribe(users => {
        if (this.searchBox.value.length > 0) {
          this.users = [];
          users
            .map((p) => {
              if (p.name?.toLowerCase().includes(this.searchBox.value.toLowerCase())) {
                this.users.push(p);
              }
            });
        } else {
          this.users = users;
        }
      });
  }

  addPermission() {
    this.router.navigateByUrl(`permissions`);
  }

  addGroup() {
    this.router.navigateByUrl(`groups`);
  }

  addUser() {
    this.router.navigateByUrl(`users`);
  }

  deleteObj() {
    this.delete.emit();
  }
}
