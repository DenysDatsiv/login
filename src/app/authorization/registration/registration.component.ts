import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CountryService } from "./country.service";
import { Country } from "../shared/interfaces";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  countries: Country[];
  emailExistMessage :string = 'This email exists already';
  error:string= null;
  constructor(private authService: AuthService, private countryService: CountryService, private router: Router) {
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      'firstName': new FormControl("", [Validators.required, Validators.pattern("^^([a-zA-Z ]+|[А-ЩЬЮЯҐЄІЇа-щьюяґєії][а-щьюяґєії]*)$"), Validators.maxLength(20)]),
      'lastName': new FormControl("", [Validators.required, Validators.pattern("^^([a-zA-Z ]+|[А-ЩЬЮЯҐЄІЇа-щьюяґєії][а-щьюяґєії]*)$"), Validators.maxLength(20)]),
      'email': new FormControl("", [Validators.required, Validators.maxLength(20)]),
      'password': new FormControl("", [Validators.required, Validators.maxLength(20), Validators.minLength(8)]),
      'country': new FormControl("", [Validators.required]),
      'firstHear': new FormControl("", [Validators.required]),
    });

    this.countryService.getAllCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  onRegister() {
    const formData = this.registrationForm.value
      this.authService.signup(formData.email, formData.password).subscribe(
        resData => {
          this.authService.userInfo(
            resData.localId,
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.country).subscribe(resData=>console.log(resData))

        },
        errorMessage =>{
          this.error =errorMessage
        }
      )

      this.router.navigate(['/login']);
  }
}
