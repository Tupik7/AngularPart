import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
/*import { UsersListComponent } from './components/users-list/users-list.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { PermissionsListComponent } from './components/permissions-list/permissions-list.component';
import { SearchComponent } from './components/search/search.component';*/
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { PermissionDetailComponent } from './components/permission-detail/permission-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    GroupDetailComponent,
    PermissionDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
