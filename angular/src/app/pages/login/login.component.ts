import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiResult } from 'src/app/models/api-result';
import { AuthenticationInfo } from 'src/app/models/authentication-info';
import { LoginUser } from 'src/app/models/login-user';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = 'Login';
  username = '';
  password = '';
  errorMessage: string|null = null;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService) {    
  }
  ngOnInit(): void {
    this.authenticateService.logout();
  }

  login(): void {
    let userLogin = new LoginUser();
    console.log(this.username);
    debugger;
    if(!userLogin.setCredential(this.username, this.password)) {

      return;
    }
    this.authenticateService.login(userLogin)
      .pipe(first())
      .subscribe(
      (res: ApiResult<string>) => {
        if(res.data && res.data !== '') {          
          this.router.navigate(['employees']);
        }else {
          this.errorMessage = res.message;
        }
        
      },
      err => {
        this.authenticateService.logout();
      }
    );
  }
}
