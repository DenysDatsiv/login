import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Observable, Subscription} from "rxjs";
import {AuthResponseData} from "../shared/interfaces";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  loginForm: FormGroup;
  emailExistMessage:string = 'This email does not exist.';
  invalidPasswordMessage :string = 'This password is not correct.';
  error :string = null
  isAuthenticated = false;
  private userSub: Subscription;
constructor(private router:Router,private authService: AuthService) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl("", [
        Validators.required,
        Validators.pattern("^^([a-zA-Z ]+|[А-ЩЬЮЯҐЄІЇа-щьюяґєії][а-щьюяґєії]*)$"),
        Validators.maxLength(20)
      ]),

      'password': new FormControl("", [
        Validators.required,
        Validators.maxLength(30)
      ])
    });

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
  onLogin() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe(
      resData => {
          this.router.navigate(['', resData.localId]);
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
