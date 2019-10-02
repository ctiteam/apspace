import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  readonly version = '2.0.0';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

}
