import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CultureService {
    private readonly _currentCulture = new BehaviorSubject<string>('en-GB');

    set culture(val: string) {
        console.log(' set culture' + val);
        this._currentCulture.next(val);
    }
    get culture(): string {
        return this._currentCulture.getValue();
    }
}