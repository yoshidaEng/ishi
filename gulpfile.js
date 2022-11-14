//gulp.〇〇の処理は全部定数でまとめる
const {
    src,
    dest,
    watch,
    lastRun,
    series,
    parallel
} = require("gulp");

// html
const htmlMin = require("gulp-htmlmin");

// Sass
const sass = require("gulp-dart-sass");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const postCss = require("gulp-postcss"); //for autoprefixer
const autoprefixer = require("autoprefixer");
const gcmq = require("gulp-group-css-media-queries");

// JavaScript
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// 画像圧縮
// const imagemin = import("gulp-imagemin");
// const imageminMozjpeg = import("imagemin-mozjpeg");
// const imageminPngquant = import("imagemin-pngquant");
// const imageminGifsicle = import("imagemin-gifsicle");
// const imageminSvgo = import("imagemin-svgo");

// ブラウザ同期
const browserSync = require("browser-sync").create();

//パス設定
const paths = {
    html: {
        // src: "./src/*.html",// src内の全てのhtmlを指定
        src: "./src/**/*.html",
        dist: "./dist/",
    },
    styles: {
        src: "./src/scss/**/*.scss",
        dist: "./dist/css/",
        map: "./map",
    },
    scripts: {
        src: "./src/js/**/*.js",
        dist: "./dist/js/",
    },
    images: {
        src: "./src/img/**/*.{jpg,jpeg,png,gif,svg}",
        dist: "./dist/img/",
    },
};

// htmlフォーマット
const htmlFormat = () => {
    return src(paths.html.src)
        .pipe(
            plumber({
                //エラーがあっても処理を止めない
                errorHandler: notify.onError("Error: <%= error.message %>"),
            })
        )
        .pipe(
            htmlMin({
                //HTMLの圧縮
                minifyCSS: true, //style要素とstyle属性の圧縮
                minifyJS: true, //js要素とjs属性の圧縮
                removeComments: true, //コメントを削除
                collapseWhitespace: true, //余白を詰める
                collapseInlineTagWhitespace: true, //inline要素間のスペース削除（spanタグ同士の改行などを詰める
                preserveLineBreaks: true, //タグ間の改行を詰める
            })
        )
        .pipe(dest(paths.html.dist));
};

// Sassコンパイル
const sassCompile = () => {
    return src(paths.styles.src, {
        sourcemaps: true,
    })
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>"),
            })
        )
        .pipe(
            sass({
                outputStyle: "expanded",
            }).on("error", sass.logError)
        )
        .pipe(
            postCss([
                autoprefixer({
                    // プロパティのインデントを整形しない
                    cascade: false,
                    // IE11のgrid対応
                    grid: "autoplace",
                }),
            ])
        )
        //メディアクエリをまとめる
        .pipe(gcmq())
        .pipe(
            dest(paths.styles.dist, {
                sourcemaps: "./map",
            })
        )
        // 変更があったらリロードせずにCSSのみ更新
        .pipe(browserSync.stream())
};

// JavaScriptコンパイル
const jsBabel = () => {
    return src(paths.scripts.src)
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>"),
            })
        )
        .pipe(
            // Babel変換
            babel({
                presets: ["@babel/preset-env"],
            })
        )
        .pipe(dest(paths.scripts.dist))
        // JS圧縮
        .pipe(uglify())
        .pipe(dest(paths.scripts.dist));
};

// ローカルサーバー起動
const browserSyncFunc = (done) => {
    browserSync.init({
        //デフォルトのconnectedのメッセージ非表示
        notify: false,
        server: {
            baseDir: "./",
        },
        startPath: "./dist/index.html",
        reloadOnRestart: true,
    });
    done();
};

// ブラウザ自動リロード
const browserReloadFunc = (done) => {
    browserSync.reload();
    done();
};

// ファイル監視
const watchFiles = () => {
    watch(paths.html.src, series(htmlFormat, browserReloadFunc));
    watch(paths.styles.src, series(sassCompile));
    watch(paths.scripts.src, series(jsBabel, browserReloadFunc));
    watch(paths.images.src, series(browserReloadFunc));
};

// npx gulp実行処理
exports.default = series(
    parallel(htmlFormat, sassCompile, jsBabel),
    parallel(watchFiles, browserSyncFunc)
);