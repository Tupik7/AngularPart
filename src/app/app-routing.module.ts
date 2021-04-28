import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionDetailComponent } from './components/permission-detail/permission-detail.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'permissions', component: PermissionDetailComponent },
  { path: 'permissions/:id', component: PermissionDetailComponent },
  { path: 'groups', component: GroupDetailComponent },
  { path: 'groups/:id', component: GroupDetailComponent },
  { path: 'users', component: UserDetailComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
