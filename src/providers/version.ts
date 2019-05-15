import { Injectable } from '@angular/core';

@Injectable()
export class VersionProvider {

  readonly version = '1.2.2';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

}
