import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Route } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { forkJoin, Subject, Subscription } from 'rxjs';

import { AppComponent } from 'src/app/app.component';
import { DataService } from 'src/app/services/data.service';
import { Permission } from 'src/app/models/permission.model';
import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: '',
    permissions: new Array<Permission>(),
    groups: new Array <Group>()
  };
  permissions?: Permission[];
  groups?: Group[];
  userForm?: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  isShow: any;
  isShow2: any;
  isShow3: any;
  isShow4: any;
  routerGetSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private app: AppComponent
  ) {
    this.routerGetSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id !== null) {
          forkJoin(
            this.dataService.getUser(id),
            this.dataService.getPermissions(),
            this.dataService.getGroups()
          ).subscribe(
            ([user, permissions, groups]) => {
              this.user = user;
              this.permissions = permissions;
              this.groups = groups;
              this.formUInit(user, permissions, groups);
            });
        } else {
          forkJoin(
            this.dataService.getPermissions(),
            this.dataService.getGroups()
          ).subscribe(
            ([permissions, groups]) => {
              this.permissions = permissions;
              this.groups = groups;
              this.formUInit(this.user, permissions, groups);
            });
        }
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      forkJoin(
        this.dataService.getUser(id),
        this.dataService.getPermissions(),
        this.dataService.getGroups()
      ).subscribe(
        ([user, permissions, groups]) => {
          this.user = user;
          this.permissions = permissions;
          this.groups = groups;
          this.formUInit(user, permissions, groups);
        });
    } else {
      forkJoin(
        this.dataService.getPermissions(),
        this.dataService.getGroups()
      ).subscribe(
        ([permissions, groups]) => {

          this.permissions = permissions;
          this.groups = groups;
          this.formUInit(this.user, permissions, groups);
        });
    }
    this.app.delete
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deleteUser();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerGetSub.unsubscribe();
  }

  private formUInit(user: User, permissions: Permission[], groups: Group[]) {
    let checkBoxes: AbstractControl[] = [];
    let checkBoxesGroup: AbstractControl[] = [];
    if (user) {
      permissions.map((o) => {
        checkBoxes.push(new FormControl(user.permissions?.find(r => r.id === o.id)));
      });
      groups.map((o) => {
        checkBoxesGroup.push(new FormControl(user.groups?.find(r => r.id === o.id)));
      });
    } else {
      user = new User;
      user.name = '';
      user.email = '';
      user.password = '';
      permissions.map((o) => {
        checkBoxes.push(new FormControl(false));
      });
      groups.map((o) => {
        checkBoxesGroup.push(new FormControl(false));
      });
    }
    this.userForm = this.formBuilder.group({
      name: [user.name,
      [
        Validators.required,
        Validators.pattern('[A-z0-9 ]*'),
        Validators.minLength(3)
      ]
      ],
      email: [user.email,
      [
        Validators.required,
        Validators.email
      ]
      ],
      password: [user.password,
      [
        Validators.required,
        Validators.pattern('[A-z0-9]*'),
        Validators.minLength(5),
        Validators.maxLength(25)
      ]
      ],
      con_password: [user.password,
      [
        Validators.required,
        Validators.pattern('[A-z0-9]*'),
        Validators.minLength(5),
        Validators.maxLength(25)
      ]
      ],
      permissions: new FormArray(checkBoxes),
      groups: new FormArray(checkBoxesGroup),
      group_filter: ['']
    });
  }

  get formPermissions() {
    return <FormArray>this.userForm?.get('permissions');
  }

  get formGroups() {
    return <FormArray>this.userForm?.get('groups');
  }

  get effectivePermissions() {
    let checkBoxesEffect = [];
    const perms = this.userForm?.get('permissions') as FormArray;
    const grps = this.userForm?.get('groups') as FormArray;
    const selectedPermissions = new Array<Permission>();
    if (this.groups) {
      for (let i in grps.controls) {
        for (let g in this.groups) {
          if (grps.controls[i].value && g === i) {
            this.groups[g].permissions
              ?.forEach((v) => selectedPermissions.push(v));
          }
        }
      }
    }
    if (this.permissions) {
      for (let i in perms.controls) {
        for (let p in this.permissions) {
          if (perms.controls[i].value && p === i) {
            selectedPermissions.push(this.permissions[p]);
          }
        }
      }
      for (let permission of this.permissions) {
        checkBoxesEffect.push(new FormControl({ value: selectedPermissions.find((p) => p.id === permission.id), disabled: true }));
      }
    }
    return checkBoxesEffect;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.userForm?.controls[controlName];

    if (control) {
      const result = control.invalid && control.touched;
      return result;
    } else {
      return false;
    }
    
  }

  isPassNotEqual(): boolean {
    const pass1 = this.userForm?.controls['password'];
    const pass2 = this.userForm?.controls['con_password'];

    if (pass1 && pass2) {
      const t_result = pass1.touched && pass2.touched;
      if (t_result) {
        if (pass1.value != pass2.value) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  saveU(): void {
    const controls = this.userForm?.controls;
    const perms = this.userForm?.get('permissions') as FormArray;
    const grps = this.userForm?.get('groups') as FormArray;
    const selectedPermissions = new Array<Permission>();
    const selectedGroups = new Array<Group>();
    /*Validity check*/
    if (this.userForm?.invalid && controls) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    if (this.permissions) {
      for (let i in perms.controls) {
        for (let p in this.permissions) {
          if (perms.controls[i].value && p === i) {
            selectedPermissions.push(this.permissions[p]);
          }
        }
      }
    }
    if (this.groups) {
      for (let i in grps.controls) {
        for (let g in this.groups) {
          if (grps.controls[i].value && g === i) {
            selectedGroups.push(this.groups[g]);
          }
        }
      }
    }
    if (!this.user) {
      this.user = new User();
    }
    this.user.name = this.userForm?.get('name')?.value;
    this.user.email = this.userForm?.get('email')?.value;
    this.user.password = this.userForm?.get('password')?.value;
    this.user.permissions = selectedPermissions;
    this.user.groups = selectedGroups;
    console.log(JSON.stringify(this.user));
    if (this.user.id) {
      this.dataService.updateUser(this.user.id, this.user)
        .subscribe((response) => {
          console.log(response);
        });
    } else {
      this.dataService.createUser(this.user)
        .subscribe((response) => {
          console.log(response);
          this.router.navigateByUrl(`users/${response.id}`);
        });
    }
  }

  deleteUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.dataService.deleteUser(id)
        .subscribe((response) => {
          this.router.navigateByUrl('home');
          console.log(response);
        });
    }
  }
}
