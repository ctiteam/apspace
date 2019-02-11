import { Injectable } from '@angular/core';

@Injectable()
export class VersionProvider {

  readonly version = '1.0.1';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

}
