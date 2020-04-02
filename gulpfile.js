// gulpfile.js
const { series, parallel, src, dest, watch } = require('gulp')
const mocha = require('gulp-mocha')
const tslint = require('gulp-tslint')
const rollup = require('rollup')
const rollupTypescript = require('@wessberg/rollup-plugin-ts')
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const rollupCommonjs = require('rollup-plugin-commonjs')
const rollupSourceMaps = require('rollup-plugin-sourcemaps')
const terser = require('gulp-terser')
const del = require('del')
const pkg = require('./package.json')
const allFiles = ['src/**/*.ts', 'test/**/*.ts']
// Task functions
/**
 * Bundle function
 */
function bundle() {
    return rollup.rollup({
        input: 'src/xydata.ts',
        plugins: [
            rollupTypescript({ typescript: require('typescript'), tsconfig: './tsconfig.json' }),
            rollupCommonjs(),
            rollupNodeResolve(),
            rollupSourceMaps()
        ]
    })
        .then(bundle =>
            Promise.all([
                bundle.write({
                    file: pkg.main,
                    format: 'cjs',
                    exports: 'named',
                    sourcemap: true,
                    name: 'xydata'
                }),
                bundle.write({
                    file: pkg.module,
                    format: 'es',
                    exports: 'named',
                    sourcemap: true,
                    name: 'xydata'
                }),
                bundle.write({
                    file: pkg.iife,
                    format: 'iife',
                    exports: 'named',
                    sourcemap: true,
                    name: 'xydata'
                })
            ])
        )
}
/**
 * Minify function
 */
function minify() {
    return src([pkg.iife])
        .pipe(terser({
            mangle: {
                toplevel: true,
                reserved: [
                    'xydata'
                ],
                properties: {
                    regex: /\b_\w*/,
                    keep_quoted: true
                }
            },
            keep_classnames: false,
            keep_fnames: false
        }))
        .pipe(dest('dist'))
}
/**
 * Linting function
 */
function lint() {
    return src(allFiles)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report({ allowWarnings: true }))
}
// Lint watcher
const lintWatcher = () => watch(allFiles, series(lint))
const lintWatch = series(lint, lintWatcher)
/**
 * Testing task
 */
function test() {
    return src('./test/**/*.spec.ts', { read: false })
        .pipe(mocha({
            "timeout": 100000,
            require: 'ts-node/register',
            reporter: 'spec'
        }))
}
/**
 *  Test watch functions
*/
const testWatcher = () => watch(allFiles, test)
const testWatch = series(test, testWatcher)
/**
 * Cleaning function
 */
const clean = () => del('dist')
/**
 * CI watch functions
 */
const ciWatcher = () => watch(allFiles, parallel(test, lint))
const ciWatch = series(parallel(test, lint), ciWatcher)
/**
 * Building functions
 */
const build = series(clean, bundle, minify)
const buildWatcher = () => watch(allFiles, build)
const buildWatch = series(build, buildWatcher)

// Export functions for gulp CLI
// Start testing
exports.test = test
// Start test watching
exports.testWatch = testWatch
// Start linting
exports.lint = lint
// Start lint watching
exports.lintWatch = lintWatch
// Start CI watching
exports.ciWatch = ciWatch
// Clean folder with distribution
exports.clean = clean
// Build distribution
exports.build = build
// Start build watching
exports.buildWatch = buildWatch
// Default case: build distribution
exports.default = build
