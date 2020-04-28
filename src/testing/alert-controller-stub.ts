/** Incomplete alert options. */
interface AlertOptions {
  buttons: Array<{
    text: string,
    handler?: () => never,
  }>;
}

/**
 * Stub alert controller without drawing in the view.
 */
export class AlertControllerStub {
  createCalled = false;
  presentCalled = false;
  _opts: AlertOptions;

  /** Create alert stub. */
  create(opts?: AlertOptions): Promise<any> { // type not found
    this.createCalled = true;
    this._opts = opts;
    return Promise.resolve({
      present: (): Promise<void> => {
        this.presentCalled = true;
        return Promise.resolve();
      }
    });
  }

  /** Helper to click on button by text. */
  click(text: string) {
    this._opts.buttons.find(button => button.text === text).handler();
  }
}
