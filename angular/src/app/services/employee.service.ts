import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult } from '../models/api-result';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  mainEndpoint = 'hr/employees/';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ApiResult<Array<Employee>>> {
    return this.http.get<ApiResult<Array<Employee>>>(`${environment.BASE_URL}/${this.mainEndpoint}`);
  }
}
