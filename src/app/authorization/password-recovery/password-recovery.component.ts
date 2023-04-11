import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit  {
  recoveryForm: FormGroup;
  emailExistMessage :string = 'This email does not exist.';
  error :string = null;

  private readonly EMAIL_PATTERN = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private  authService :AuthService) {}
  ngOnInit(): void {
    this.recoveryForm = new FormGroup({
      'email': new FormControl("", [
        Validators.required,
        Validators.pattern(this.EMAIL_PATTERN),
        Validators.maxLength(20)
      ]),
    });
  }
  onRecover()
  {
    this.authService.forgotPassword("PASSWORD_RESET",this.recoveryForm.value.email).subscribe(
      resData => {
        console.log(resData)
      },
      errorMessage =>{
        this.error = errorMessage;
      }
    )
  }
}
