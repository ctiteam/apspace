APSpace
=======
Mobile App @ CTI.

Requirements
------------
- node >= 8.x
- npm / yarn

Installation
------------
```shell
$ sudo npm install -g ionic cordova
```

Building
--------

### Development
Mitigate CORS issue during development with [CORS Everywhere][cors].
```shell
$ ionic serve -lc                # web
$ ionic cordova run android -lc  # android
```
Android live-reload have CORS issues.

[cors]: https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/

### Production
```shell
$ ionic cordova build android --prod --release
```

Contributing
------------
- [Conventional commit messages](https://github.com/conventional-changelog/conventional-changelog/blob/a5505865ff3dd710cf757f50530e73ef0ca641da/conventions/angular.md)
- [Issues / Features](https://bitbucket.org/imobileappdevelopment/apspace/issues)
- [Projects / Ideas](https://bitbucket.org/imobileappdevelopment/apspace/addon/trello/trello-board)
