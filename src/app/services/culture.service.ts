import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CultureService {
    private readonly defaultCulture: string = 'en-GB';
    private readonly _currentCulture = new BehaviorSubject<string>(this.defaultCulture);
    constructor(
        private cookieService: CookieService,
    ) {
    }

    set culture(val: string) {
        console.log('set culture' + val);
        this.setCultureCookie(val);
        this._currentCulture.next(this.culture);
    }
    get culture(): string {
        let culture = this.cookieService.get('_culture'); 
        
        if(!culture){
            this.setCultureCookie(this.defaultCulture);
        }

        console.log('get culture: ' + this.cookieService.get('_culture'));
        return this.cookieService.get('_culture');
    }

    setCultureCookie(value: string) {
        console.log('set cookie:' + value);
        this.cookieService.set('_culture', value, 31536000, '/', '.2.azurestaticapps.net', true,)
        this.cookieService.set('_culture', value, 31536000, '/', '.nice-ground-09a833310.2.azurestaticapps.net', true)
        this.cookieService.set('_culture', value, 31536000, '/', 'localhost')
    }
}