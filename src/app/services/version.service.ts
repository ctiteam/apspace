import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  readonly version = '1.0.1';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

}
