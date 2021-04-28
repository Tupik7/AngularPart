import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Route } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { error } from 'protractor';

import { Subject, Subscription } from 'rxjs';

import { AppComponent } from 'src/app/app.component';
import { DataService } from 'src/app/services/data.service';
import { Permission } from 'src/app/models/permission.model';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-permission-detail',
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.scss']
})
export class PermissionDetailComponent implements OnInit, OnDestroy {

  permission: Permission = {
    name: ''
  };
  permForm?: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  isShow: any;
  isShow2: any;
  routerGetSub: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private app: AppComponent
  ) {
    this.routerGetSub = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          const id = this.route.snapshot.paramMap.get('id');
          if (id !== null) {
            this.dataService.getPermission(id)
              .subscribe(
                (permission) => {
                  this.permission = permission;
                  this.formPInit(permission);
                });
          } else {
            this.formPInit(this.permission);
          }
        }
      }
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.dataService.getPermission(id)
        .subscribe(
          (permission) => {
            this.permission = permission;
            this.formPInit(permission);
            console.log(permission);
          },
          error => {
            console.log(error);
          });
    } else {
      this.formPInit(this.permission);
    }
    this.app.delete
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deletePermission();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerGetSub.unsubscribe();
  }

  private formPInit(permission: Permission) {
    this.permForm = this.formBuilder.group({
      name: [
        permission.name,
        [
          Validators.required,
          Validators.pattern('[A-z0-9 ]*'),
          Validators.minLength(3)
        ]
      ]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.permForm?.controls[controlName];
    if (control) {
      const result = control.invalid && control.touched;
      return result;
    } else {
      return false;
    }
  }

  savePermission(): void {
    const controls = this.permForm?.controls;
    // Validity check
    if (this.permForm?.invalid && controls) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    if (!this.permission) {
      this.permission = new Permission();
    }
    this.permission.name = this.permForm?.get('name')?.value;
    if (this.permission.id) {
      this.dataService.updatePermission(this.permission.id, this.permission)
        .subscribe(
          (response) => {
            console.log(response);
          });
    } else {
      this.dataService.createPermission(this.permission)
        .subscribe((response) => {
          this.router.navigateByUrl(`permissions/${response.id}`);
          console.log(response);
          });
    }

  }

  deletePermission(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.dataService.deletePermission(id)
        .subscribe((response) => {
            this.router.navigateByUrl('home');
            console.log(response);
          });
    }
  }

}
