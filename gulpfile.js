;!( function( g ) {

	'use strict';

	var gulp = require( 'gulp' ),

		watch = require( 'gulp-watch' ),
		plumber = require( 'gulp-plumber' ),
		pump = require( 'pump' ),
		stylus = require( 'gulp-stylus' ),
		uglify = require( 'gulp-terser' ),

        STYLUS_PATH = [ 'stylus/*.styl', '!stylus/_*.styl' ],
        CSS_PATH = 'css/',

		JS_PATH = [ 'script/*.js', '!script/_*.js' ],
		MINI_JS_PATH = 'minified/';

	gulp.task( 'default', [ 'stylus', 'js' ] );

	gulp.task( 'stylus', function() {

		pump([

			gulp.src( STYLUS_PATH ),
			watch( STYLUS_PATH ),
			stylus({

				compress: false

			}),
			gulp.dest( CSS_PATH )

		]);

	});

	gulp.task( 'js', function() {

		pump([

			gulp.src( JS_PATH ),
			watch( JS_PATH ),
			uglify(),
			gulp.dest( MINI_JS_PATH )

		]);

	});

})( this );
