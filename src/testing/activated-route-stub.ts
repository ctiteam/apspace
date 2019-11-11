import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` and `params` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 * Use the `setParams()` method to add the next `params` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private _paramMap$ = new ReplaySubject<ParamMap>();
  private _params$ = new ReplaySubject<Params>();

  // Record the old values to simulate BehaviorSubject
  private _paramMap: ParamMap;
  private _params: Params;

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this._paramMap$.asObservable();

  /** The mock params observable */
  readonly params = this._params$.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this._paramMap$.next(this._paramMap = convertToParamMap(params));
  }

  /** Set the params observables's next value */
  setParams(params?: Params) {
    this._params$.next(this._params = params);
  }

  /** Minimal mock of snapshot */
  get snapshot() {
    return { paramMap: this._paramMap, params: this._params };
  }
}
