APSpace
=======
Mobile App @ CTI.

Requirements
------------
- node >= 10.x
- npm / yarn

Building
--------

### Development
Mitigate CORS issue during development with [CORS Everywhere][cors].
```shell
$ ng serve  # web - http://localhost:4200/
$ ionic cordova run android -lc  # android
```
Android live-reload have CORS issues.

[cors]: https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/

### Production
```shell
$ ionic cordova build android --prod --release
```

Testing
-------
Run `ng test` to execute unit tests via [Karma][karma].
Run `ng e2e` to execute end-to-end tests via [Protractor][protractor].

[karma]: https:://karma-runner.github.io
[protractor]: http://www.protractortest.org/

Contributing
------------
- Fix `ng lint` errors during commit (included in pre-commit hooks)
- [Conventional commit messages](https://github.com/conventional-changelog/conventional-changelog/blob/a5505865ff3dd710cf757f50530e73ef0ca641da/conventions/angular.md)
- [Issues / Features](https://github.com/cticti/apspace/issues)
- Bump the version with `bin/bump`
