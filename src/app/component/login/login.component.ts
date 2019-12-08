import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../service/authentication.service';
import {AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.auth.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        token => {
          // localStorage.setItem('token', token.jwttoken);
          this.alertService.success('Successfully logged in.');
          this.auth.token = token.jwttoken;
          this.auth.username = this.f.username.value;
          this.auth.isLoggedIn.next(true);
          this.router.navigate(['/app']);
        },
        error => {
          this.alertService.error('Wrong username or password.');
          this.loading = false;
        });

    this.auth.getRole(this.f.username.value).subscribe( role => { this.auth.role = role; });
    console.log(this.auth.role);
  }
}
