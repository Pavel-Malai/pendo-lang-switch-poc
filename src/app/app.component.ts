import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import {Subject } from 'rxjs';
import { CultureService } from './services/culture.service';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
declare let pendo: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pendo-lang-switch-poc';
  pendoApiKey: string = '8303c8c6-d666-43eb-55ac-461d148b2fad';
  private unsubscribe$: Subject<void> = new Subject();

  cultures: Culture[] = [
    { value: 'en-GB', name: 'English' },
    { value: 'de-DE', name: 'German' },
    { value: 'es-ES', name: 'Spanish' }
  ];
  culturesFormControl = new FormControl();

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cookieService: CookieService,
    private cultureService: CultureService
  ) {
  }

  public ngOnInit(): void {
    this.addPendoTag(this.pendoApiKey);

    this.culturesFormControl.valueChanges.subscribe(s => {
      this.setCultureCookie(s);
      this.cultureService.culture = s;
      console.log(`The selected value is ${s}`);
    });

  }


  setCultureCookie(value: string) {
    this.cookieService.set('_culture', value, 31536000, '/', '.2.azurestaticapps.net', true, )
    this.cookieService.set('_culture', value, 31536000, '/', '.nice-ground-09a833310.2.azurestaticapps.net', true)
    this.cookieService.set('_culture', value, 31536000, '/', 'localhost')
  }

  public ngAfterViewInit(): void {

    // combineLatest([
    //   this.userService.user$.pipe(filter((user: User) => !!user)),
    //   this.accountService.selectedAccount$,
    // ])
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(([user, account]: [User, UserAccount]) => {
    //     if (this.pendoApiKey) {
    //       const pendoConfig = {
    //         visitor: {
    //           id: user.id,
    //           email: user.userDetails?.email,
    //           full_name: `${user.userDetails?.firstName} ${user.userDetails?.surname}`,
    //           role: account.userRole,
    //         },
    //         account: {
    //           id: account.id,
    //           reference: account.reference,
    //           type: account.type,
    //         },
    //       };

    //       if (!pendo?.isReady) {
    //         setTimeout(() => this.installPendo(pendoConfig), 1000);

    //         return;
    //       }

    //       this.installPendo(pendoConfig);
    //     }
    //   });


    if (this.pendoApiKey) {
      const pendoConfig = {
        visitor: {
          id: 'user.id',
          email: 'user.userDetails?.email',
          full_name: '`${user.userDetails?.firstName} ${user.userDetails?.surname}`',
          custom_language: this.cultureService.culture
        },
        account: {
          id: 'account.id',
          reference: 'account.reference',
          type: 'account.type',
        },
      };

      if (!pendo?.isReady) {
        setTimeout(() => this.installPendo(pendoConfig), 1000);

        return;
      }

      this.installPendo(pendoConfig);
    }
  }

  private installPendo(pendoConfig: unknown) {
    if (pendo.isReady()) {
      console.log('pendo is ready, identify Pendo')
      pendo.identify(pendoConfig);
    } else {
      console.log('pendo is not ready, initialize Pendo')
      pendo.initialize(pendoConfig);
    }
  }

  private addPendoTag(apiKey: string): void {
    console.log('addPendoTag');
    if (!apiKey) {
      return;
    }

    const pendoTag: HTMLScriptElement = this.doc.createElement('script');
    pendoTag.type = 'text/javascript';
    pendoTag.text = `
        (function (apiKey) {
            (function (p, e, n, d, o) {
              var v, w, x, y, z;o = p[d] = p[d] || {};o._q = o._q || [];
              v = ["initialize", "identify", "updateOptions", "pageLoad", "track"];
              for (w = 0, x = v.length; w < x; ++w)
                (function (m) {
                  o[m] = o[m] || function () {
                      o._q[m === v[0] ? "unshift" : "push"](
                        [m].concat([].slice.call(arguments, 0))
                      );
                    };
                })(v[w]);
              y = e.createElement(n);
              y.async = !0;
              y.src = "https://cdn.eu.pendo.io/agent/static/" + apiKey + "/pendo.js";
              z = e.getElementsByTagName(n)[0];
              z.parentNode.insertBefore(y, z);
            })(window, document, "script", "pendo")})
            ('${apiKey}');`;

    this.doc.head.appendChild(pendoTag);
  }
}

interface Culture {
  value: string;
  name: string;
}