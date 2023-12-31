import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth.service';
import { LANGUAGES } from 'src/config/language-config';
import { User } from '../../../models/user';
import { I18nService } from 'ng-devui/i18n';
import { TipoCambioService } from '../../../../service/tipoCambio.service';

@Component({
  selector: 'da-header-operation',
  templateUrl: './header-operation.component.html',
  styleUrls: ['./header-operation.component.scss'],
})
export class HeaderOperationComponent implements OnInit {
  user: User;
  languages = LANGUAGES;
  language: string = 'en-us';
  haveLoggedIn = false;
  noticeCount: number = 0;
  tipoCambioHoy:number = 0;

  constructor(private route: Router,
              private authService: AuthService,
              private translate: TranslateService,
              private i18n: I18nService,
              private tipoCambioService:TipoCambioService) {}

  ngOnInit(): void {
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
      this.haveLoggedIn = true;
    } else {
      this.authService.login('Admin', 'Devui.admin').subscribe((res) => {
        this.authService.setSession(res);
        this.user = JSON.parse(localStorage.getItem('userinfo')!);
        this.haveLoggedIn = true;
      });
    }
    this.language = this.translate.currentLang;
    this.getTipoCambioHoy();
  }

  getTipoCambioHoy(){
    this.tipoCambioService.getTipoCambioHoy().subscribe(value => {
      this.tipoCambioHoy = value;
    });
  }
  onSearch(event: any) {
    console.log(event);
  }

  onLanguageClick(language: string) {
    this.language = language;
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }

  handleUserOps(operation: string) {
    switch (operation) {
      case 'logout': {
        this.haveLoggedIn = false;
        this.authService.logout();
        this.route.navigate(['/', 'login']);
        break;
      }
      default:
        break;
    }
  }

  handleNoticeCount(event: number) {
    this.noticeCount = event;
  }
}
