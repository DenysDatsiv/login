import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../authorization/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserProfileData} from "../../authorization/shared/interfaces";

@Component({
  selector: 'app-main-page', templateUrl: './main-page.component.html', styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userData: UserProfileData;
  private userSub: Subscription;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.route.paramMap.subscribe(params => {
      this.authService.getUserInfo(params.get('userId')).subscribe(data => {
        this.userData = data;
      });
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  goBack() {
    window.history.back();
  }
}
