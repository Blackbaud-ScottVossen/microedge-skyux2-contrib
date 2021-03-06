import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: '../../dist/core.js',
  dest: '../../dist/bundles/core.umd.js',
  format: 'umd',
  moduleName: 'skyuxcontrib.core',
  context: 'this',
  globals: {
    '@angular/common': 'ng.common',
    '@angular/compiler': 'ng.compiler',
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms',
    '@angular/router': 'ng.router',
    'ng2-dragula/ng2-dragula': 'ng2.dragula',
    '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
    'moment': 'moment'
  },
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/forms',
    '@angular/router',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    'ng2-dragula/ng2-dragula',
    'moment/moment'
  ],
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};
