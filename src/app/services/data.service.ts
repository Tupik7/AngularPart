import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Permission } from '../models/permission.model';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://localhost:5001/api/';
  private permissionsUrl = this.baseUrl + 'permissions';
  private groupsUrl = this.baseUrl + 'groups';
  private usersUrl = this.baseUrl + 'users';
  public refresh = new Subject();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.permissionsUrl);
  }

  getPermission(id: any): Observable<Permission> {
    return this.http.get(`${this.permissionsUrl}/${id}`);
  }

  createPermission(data: any): Observable<any> {
    return this.http.post(this.permissionsUrl, JSON.stringify(data), this.httpOptions).pipe(
      tap(_ => this.refresh.next())
    );
  }

  updatePermission(id: any, data: any): Observable<any> {
    return this.http.put(`${this.permissionsUrl}/${id}`, JSON.stringify(data), this.httpOptions).pipe(
      tap(_ => this.refresh.next())
    );
  }

  deletePermission(id: any): Observable<any> {
    return this.http.delete(`${this.permissionsUrl}/${id}`).pipe(
      tap(_ => this.refresh.next())
    );
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.groupsUrl);
  }

  getGroup(id: any): Observable<Group> {
    return this.http.get(`${this.groupsUrl}/${id}`);
  }

  createGroup(data: any): Observable<any> {
    return this.http.post(this.groupsUrl, JSON.stringify(data), this.httpOptions).pipe(
      tap(_ => this.refresh.next())
    );
  }

  updateGroup(id: any, data: any): Observable<any> {
    return this.http.put(`${this.groupsUrl}/${id}`, JSON.stringify(data), this.httpOptions).pipe(
      tap(_ => this.refresh.next())
    );
  }

  deleteGroup(id: any): Observable<any> {
    return this.http.delete(`${this.groupsUrl}/${id}`).pipe(
      tap(_ => this.refresh.next())
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser(id: any): Observable<User> {
    return this.http.get(`${this.usersUrl}/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(this.usersUrl, JSON.stringify(data), this.httpOptions).pipe(
      tap(_ => this.refresh.next())
    );
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(`${this.usersUrl}/${id}`, JSON.stringify(data), this.httpOptions).pipe(
      tap(_ => this.refresh.next())
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${id}`).pipe(
      tap(_ => this.refresh.next())
    );
  }

  searchPermissions(term: string): Observable<Permission[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<Permission[]>(`${this.permissionsUrl}/?name=${term}`).pipe(
      //tap(_ => this.log(`found permissions matching "${term}"`)),
      //catchError(this.handleError<Permission[]>('searchPermissions', []))
    );
  }

  searchGroups(term: string): Observable<Group[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<Group[]>(`${this.groupsUrl}/?name=${term}`).pipe(
      //tap(_ => this.log(`found groups matching "${term}"`)),
      //catchError(this.handleError<Group[]>('searchGroups', []))
    );
  }

  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      //tap(_ => this.log(`found users matching "${term}"`)),
      //catchError(this.handleError<User[]>('searchUsers', []))
    );
  }
}
