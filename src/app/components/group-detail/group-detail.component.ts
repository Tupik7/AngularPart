import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Route } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, FormArrayName } from '@angular/forms';
import { forkJoin, Subject, Subscription } from 'rxjs';

import { AppComponent } from 'src/app/app.component';
import { DataService } from 'src/app/services/data.service';
import { Permission } from 'src/app/models/permission.model';
import { Group } from 'src/app/models/group.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  group: Group = {
    name: '',
    permissions: new Array<Permission>()
  };
  permissions?: Permission[];
  groupForm?: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  message = '';
  isShow: any;
  isShow2: any;
  routerGetSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private app: AppComponent
  ) {
    this.routerGetSub = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          const id = this.route.snapshot.paramMap.get('id');
          if (id !== null) {
            forkJoin(
              this.dataService.getGroup(id),
              this.dataService.getPermissions()
            ).subscribe(
              ([group, permissions]) => {
                this.group = group;
                this.permissions = permissions;
                this.formGInit(group, permissions);
              });
          } else {
            forkJoin(
              this.dataService.getPermissions()
            ).subscribe(
              ([permissions]) => {
                this.permissions = permissions;
                this.formGInit(this.group, permissions);
              }
            )
          }
        }
      }
    );
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      forkJoin(
        this.dataService.getGroup(id),
        this.dataService.getPermissions()
      ).subscribe(
        ([group, permissions]) => {
          this.group = group;
          this.permissions = permissions;
          this.formGInit(group, permissions);
        });
    } else {
      forkJoin(
        this.dataService.getPermissions()
      ).subscribe(
        ([permissions]) => {
          this.permissions = permissions;
          this.formGInit(this.group, permissions);
        }
      )
    }
    this.app.delete
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deleteGroup();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerGetSub.unsubscribe();
  }

  private formGInit(group: Group, permissions: Permission[]) {
    let checkBoxes: AbstractControl[] = [];
    if (group && group.permissions) {
      permissions.map((o) => {
        checkBoxes.push(new FormControl(group.permissions?.find(r => r.id === o.id)));
      });
    } else {
      group = new Group();
      group.name = '';
      permissions.map((o) => {
        checkBoxes.push(new FormControl(false));
      });
    }
    this.groupForm = this.formBuilder.group({
      name: [
        group.name,
        [
          Validators.required,
          Validators.pattern('[A-z0-9 ]*'),
          Validators.minLength(3)
        ]
      ],
      permissions: this.formBuilder.array(checkBoxes)
    });
  }

  get formPermissions() {
    return <FormArray>this.groupForm?.get('permissions');
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.groupForm?.controls[controlName];
    if (control) {
      const result = control.invalid && control.touched;
      return result;
    } else {
      return false;
    }
  }

  saveG() {
    const controls = this.groupForm?.controls;
    const perms = this.groupForm?.get('permissions') as FormArray;
    const selectedPermissions = new Array<Permission>();
    /*Validity check*/
    if (this.groupForm?.invalid && controls) {
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
    if (!this.group) {
      this.group = new Group();
    }
    this.group.name = this.groupForm?.get('name')?.value;
    this.group.permissions = selectedPermissions;
    //console.log(JSON.stringify(this.group));
    if (this.group.id) {
      this.dataService.updateGroup(this.group.id, this.group)
        .subscribe((response) => {
          console.log(response);
        });
    } else {
      this.dataService.createGroup(this.group)
        .subscribe((response) => {
          console.log(response);
          this.router.navigateByUrl(`groups/${response.id}`);
        });
    }
    /*this.dataService.updateGroup(this.group.id, this.group)
      .subscribe();*/
  }

  deleteGroup(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.dataService.deleteGroup(id)
        .subscribe((response) => {
          this.router.navigateByUrl('home');
          console.log(response);
        });
    }
  }

}
