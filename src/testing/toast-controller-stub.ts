/** Incomplete toast options. */
interface ToastOptions {
  message: string;
}

/**
 * Stub toast controller without drawing in the view.
 */
export class ToastControllerStub {
  createCalled = false;
  presentCalled = false;
  _opts: ToastOptions;

  /** Create toast stub. */
  create(opts?: ToastOptions): Promise<any> { // type not found
    this.createCalled = true;
    this._opts = opts;
    return Promise.resolve({
      present: (): Promise<void> => {
        this.presentCalled = true;
        return Promise.resolve();
      }
    });
  }
}
