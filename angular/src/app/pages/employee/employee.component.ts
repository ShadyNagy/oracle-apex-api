import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ApiResult } from 'src/app/models/api-result';
import { Employee } from 'src/app/models/employee';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  title = 'Employees';
  employees = new Array<Employee>();

  constructor(
    public authenticateService: AuthenticateService,
    private employeeService: EmployeeService) {

  }

  loadEmployees(): void {
    this.employeeService.getAll()
    .pipe(first())
      .subscribe(
      (res: ApiResult<Array<Employee>>) => {
        if(res.data) {    
          this.employees = res.data;
        }else {
          this.employees = new Array<Employee>();
        }
        
      },
      err => {
        this.employees = new Array<Employee>();
      }
    );
  }
}
