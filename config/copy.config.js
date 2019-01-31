module.exports = {
    copyAssets: {
        src: ['{{SRC}}/assets/**/*'],
        dest: '{{WWW}}/assets'
    },
    copyIndexContent: {
        src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
        dest: '{{WWW}}'
    },
    copyFonts: {
        src: [
            '{{ROOT}}/node_modules/ionicons/dist/fonts/**/*',
            '{{ROOT}}/node_modules/ionic-angular/fonts/**/*',
            '{{ROOT}}/src/assets/fonts/**/*'
        ],
        dest: '{{WWW}}/assets/fonts/'
    },
    copyPolyfills: {
        src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
        dest: '{{BUILD}}'
    },
    copySwToolbox: {
        src: [
            '{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js',
            '{{ROOT}}/node_modules/jquery/dist/jquery.js',
            '{{ROOT}}/node_modules/semantic-ui/dist/semantic.js',
        ],
        dest: '{{BUILD}}'
    },
    copyAnimateCss: {
        src: ['{{ROOT}}/node_modules/bootstrap/dist/css/bootstrap.css', '{{ROOT}}/node_modules/chartist/dist/chartist.css'],
        dest: '{{BUILD}}'
    }
}