import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { v4 as uuid } from 'uuid';
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
  userId: string = 'c9efe64a-4fa8-4a39-ac44-ea0c86d52ca3';
  accountId: string = uuid();

  cultures: Culture[] = [
    { value: 'en-GB', name: 'English' },
    { value: 'de-DE', name: 'German' },
    { value: 'es-ES', name: 'Spanish' }
  ];
  culturesFormControl = new FormControl();

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cultureService: CultureService
  ) {
  }

  public ngOnInit(): void {
    this.addPendoTag(this.pendoApiKey);

    this.culturesFormControl.setValue(this.cultureService.culture);

    this.culturesFormControl.valueChanges.subscribe(s => {
      console.log(`Culture value changed in dropdon: ${s}`);
      this.cultureService.culture = s;
      
      location.reload();
      
      // setTimeout(() => {
      //   console.log('update options, current culture: ' + this.cultureService.culture);
      //   pendo.initialize();
      //   pendo.updateOptions();
      //   pendo.loadGuides()
      // }, 1000);
    });
  }

  public ngAfterViewInit(): void {
    if (this.pendoApiKey) {
      const pendoConfig = {
        visitor: {
          id: this.userId,
          email: 'user.userDetails?.email',
          full_name: '`${user.userDetails?.firstName} ${user.userDetails?.surname}`',
          custom_language: this.cultureService.culture
        },
        account: {
          id: this.accountId,
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