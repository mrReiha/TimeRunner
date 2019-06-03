/**
 * @zCode 110110011000011011011000101101011101100010110001001000001101100110000101110110011000011000100000110110001010011111011001100001001101100110000100110110011000011100100000110110011000100000100000110110011000000111011000101010101101100010101101001000001101100110000010110110001011000111011011100011001101100010101000
 * @name CJ
 * @version v0.4 ( 12/2018 )
 * @author Reiha Hosseini ( @mrReiha )
 * @license GPL
 */
;!( function( w, d ) {

	'use strict';

	var reqAnim = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame || w.oRequestAnimationFrame || w.msRequestAnimationFrame || function( s ){ return setTimeout( s, 1000 / 60 ); },
		clearAnim = w.cancelRequestAnimationFrame || w.mozCancelRequestAnimationFrame || w.webkitCancelRequestAnimationFrame || w.oCancelRequestAnimationFrame || w.msCancelRequestAnimationFrame || clearTimeout,

		// Check here: http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
		QBk = (function(){var r=w;var n=4;var t=.001;var e=1e-7;var u=10;var i=11;var a=1/(i-1);var o="Float32Array"in r;function f(r,f,v,s){if(arguments.length!==4){throw new Error("QBk requires 4 arguments.")}for(var c=0;c<4;++c){if(typeof arguments[c]!=="number"||isNaN(arguments[c])||!isFinite(arguments[c])){throw new Error("QBk arguments should be integers.")}}if(r<0||r>1||v<0||v>1){throw new Error("QBk x values must be in [0, 1] range.")}var l=o?new Float32Array(i):new Array(i);function g(r,n){return 1-3*n+3*r}function h(r,n){return 3*n-6*r}function m(r){return 3*r}function w(r,n,t){return((g(n,t)*r+h(n,t))*r+m(n))*r}function b(r,n,t){return 3*g(n,t)*r*r+2*h(n,t)*r+m(n)}function y(t,e){for(var u=0;u<n;++u){var i=b(e,r,v);if(i===0)return e;var a=w(e,r,v)-t;e-=a/i}return e}function Q(){for(var n=0;n<i;++n){l[n]=w(n*a,r,v)}}function x(n,t,i){var a,o,f=0;do{o=t+(i-t)/2;a=w(o,r,v)-n;if(a>0){i=o}else{t=o}}while(Math.abs(a)>e&&++f<u);return o}function A(n){var e=0;var u=1;var o=i-1;for(;u!=o&&l[u]<=n;++u){e+=a}--u;var f=(n-l[u])/(l[u+1]-l[u]);var s=e+f*a;var c=b(s,r,v);if(c>=t){return y(n,s)}else if(c==0){return s}else{return x(n,e,e+a)}}var E=false;function F(){E=true;if(r!=f||v!=s)Q()}var d=function(n){if(!E)F();if(r===f&&v===s)return n;if(n===0)return 0;if(n===1)return 1;return w(A(n),f,s)};d.getControlPoints=function(){return[{x:r,y:f},{x:v,y:s}]};var N="QBk("+[r,f,v,s]+")";return d}return f})(),

		debounce = function( fn, delay, args ) {

            var id;

			if ( !fn || !delay )
				throw new Error( '`fn` and `delay` have to be provided.' );

            return function() {

				if ( !args )
					args = arguments;

                var newFn = function() {

                        fn.apply( ctx, args );

                    },

                    ctx = this;

                clearTimeout( id );

                id = setTimeout( newFn, delay );

            }


        },

		prefixier = function* ( prop ) {

			var arr = [],
				prefixes = [ 'webkit', 'ms', 'moz', 'o' ],

				len;

			len = prefixes.length;

			while ( len-- )
				yield prefixes[ len ] + prop[ 0 ].toUpperCase() + prop.slice( 1 );

		},

		GLOBALS,

		domMethods,
		canvasMethods,
		eventMethods,
		stringMethods,
		nodeListMethods;

	GLOBALS = {

		get: d.querySelector.bind( d ),
		getEm: d.querySelectorAll.bind( d ),

		debounce,

		prefixier: function( str ) {

			var fn = prefixier( str ),
				arr = [ str ],

				tmp;

			while ( tmp = fn.next().value )
				arr.push( tmp );

			return arr;

		},

		reqAnim,
		clearAnim,

		QBk,

		create: function( lm ) {

			return d.createElement( lm );

		},

		isNumeric: arg => {

			let float = parseFloat( arg );

			return !Number.isNaN( float ) && Number.isFinite( float );

		},

		// From: https://gist.github.com/gre/1650294
		ease: {

			no: function( t ) { return t },
			in: function( t ) { return t * t },
			out: function( t ) { return t * ( 2 - t ) },
			inOut: function( t ) { return t < .5 ? 2 * t * t : -1 + ( 4 - 2 * t ) * t },
			inQuint: function( t ) { return t * t * t * t * t },
			inCubic: function ( t ) { return t * t * t },
			outCubic: function ( t ) { return ( --t ) * t * t + 1 },
			inOutCubic: function ( t ) { return t < .5 ? 4 * t * t * t : ( t - 1 ) * ( 2 * t - 2 ) * ( 2 * t - 2 ) + 1 },
			outQuint: function( t ) { return 1 + ( --t ) * t * t * t * t },
			inOutQuint: function( t ) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * ( --t ) * t * t * t * t },
			outElastic: function( t ) { var p = .3; return Math.pow( 2, -10 * t ) * Math.sin( ( t - p / 4 ) * ( 2 * Math.PI ) / p ) + 1 },

			inBack: QBk( 0.6, -0.28, 0.735, 0.045 ),
			outBack: QBk( 0.175, 0.885, 0.32, 1.275 ),
			inOutBack: QBk( 0.68, -0.55, 0.265, 1.55 )

		}

	}

	domMethods = {

		get: function( s ) {

			return this.querySelector( s );

		},

		getEm: function( s ) {

			return this.querySelectorAll( s );

		},

		anim: function( args ) {

			var start = new Date(),
				LM = this,

				_anim = function() {

					var timePassed = new Date - start,
						prog = timePassed / duration,
						_delta = [];

					prog = prog > 1 ? 1 : prog;

					if ( delta instanceof Array )
						for ( var i = 0, len = delta.length; i < len; i++ )
							_delta.push( typeof delta[ i ] == 'function' ? delta[ i ]( prog ) : ease.inOut( prog ) );
					else
						_delta = typeof delta == 'function' ? delta( prog ) : ease.inOut( prog );

					func.apply( LM, _delta instanceof Array ? _delta : [ _delta ] );

					if ( prog == 1 ) {

						if ( args.complete && typeof args.complete == 'function' )
							args.complete.apply( LM );

					} else
						w.id = reqAnim( _anim );

				},

				duration = args.duration || 500,
				delta = args.delta || ease.inOut,
				func = typeof args == 'function' ? args : args.func;

			if ( args.start && typeof args.start == 'function' )
				args.start.apply( LM );

			w.id = reqAnim( _anim );

			return LM;

		},

		fade: function( mode, time, comp ) {

			time = time || 650;

			this.anim({

				duration: time,
				delta: ease[ mode == 'in' ? 'out' : 'in' ],

				func: function( d ) {

					mode == 'in' ?
						this.style.opacity = d * 1 :
						this.style.opacity = ( .01 / d ) > 1 ? 1 : ( .01 / d );

				},

				start: function() {

					var s = this.style,
						display = getComputedStyle( this ).display;

					if ( display == 'none' )
						display = 'block';

					mode == 'in' ?
						( s.display = display, s.opacity = 0 ) :
						s.opacity = 1;

				},

				complete: function() {

					if ( typeof comp == 'function' )
						comp.apply( this );

					mode == 'in' ?
						this.style.opacity = 1 :
						( this.style.opacity = 0, this.style.display = 'none' );

				}

			});

			return this;

		},

		until: function( selector ) {

			var par = this.parentNode;

			if ( Element.prototype.closest )
				return this.closest( selector );

			if ( !Element.protoype.matches )
				Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector;

			do {

				if ( par.matches( selector ) )
					return par;

				par = par.parentNode;

			} while ( par && par.nodeType == 1 );

		},

		hasClass: function( cn ) {

			var c = this.className;

			// Trick is here! There's no need to use RegExp
			return c && c.replace( cn, '-' ) != c;

		},

		addClass: function( cn ) {

			var that = this;

			if ( that.hasClass( cn ) )
				return that;

			if ( that.className == '' )
				that.className = cn;
			else
				that.className += ' ' + cn;

			return that;

		},

		removeClass: function( cn ) {

			var that = this,
				c = that.className;

			if ( !that.hasClass( cn ) )
				return that;

			that.className = c.replace( new RegExp( '\\s?' + cn, 'gi' ), '' );

			return that;

		},

		css: function( prop, val, prefix = false ) {

			var that = this,
				old = that.style[ prop ] || getComputedStyle( that ).getPropertyValue( prop ),

				isVal = typeof val != 'undefined',
				isNotVal = val === false,

				tmp,
				fn;

			if ( isVal ) {

				if ( isNotVal ) {

					if ( this.style.removeProperty )
						that.style.removeProperty( prop );
					else
						that.style[ prop ] = '';

					return that;

				}

				if ( prefix ) {

					fn = prefixier( prop );

					while ( tmp = fn.next().value )
						that.style[ tmp ] = val;

				}

				that.style[ prop ] = val;

				return that;

			}

			return old;

		},

		attr: function( attr, val ) {

			var l = this.getAttribute( attr ),
				isVal = typeof val != 'undefined',
				isNotVal = val === false;

			if ( isVal )
				this.setAttribute( attr, val );

			if ( isNotVal )
				this.removeAttribute( attr );

			return isVal ? this : l;

		}

	};

	canvasMethods = {

		anim: domMethods.anim,

		infAnim: function( args ) {

			var _inf = function() {

					this.anim( args );

				},

				comp = args.complete,
				that = this,

				counter = args.limit && 0;

			if ( !args )
				args = {};

			args.complete = function( e ) {

				if ( comp )
					comp.apply( that );

				that.row = !that.row;

				if ( args.limit ? counter++ < args.limit : 1 )
					_inf.apply( that );

			};

			_inf.apply( that );

			return that;

		},

		toRadian: function( deg ) {

			return deg / 180 * Math.PI;

		}

	}

	eventMethods = {

		on: function( e, func, bool = false ) {

			var that = this || w;

			if ( !that.fn )
				that.fn = {};

			that.fn[ e + bool ] = func;

			if ( w.addEventListener )
				that.addEventListener( e, that.fn[ e + bool ], bool );
			else
				that[ 'on' + e ] = that.fn[ e + bool ];

			return that;

		},

		onOld: function( e, func, bool = false ) {

			var set = function( _e ) {

					if ( w.addEventListener )
						~_e.search( /mouse/gi ) ?
								that.addEventListener( _e, that.fn[ _e ], bool ) :
								w.addEventListener( _e, that.fn[ _e ], bool );
					// else if ( w.attachEvent )
					// 	w.attachEvent( 'on' + _e, that.fn[ _e ] );
					else
						that[ 'on' + _e ] = func;

				},

				that = this;

			if ( !that.fn )
				that.fn = {};

			if ( e instanceof Array ) {

				for ( let i = 0, _len = e.length; i < _len; i++ ) {

					that.fn[ e[ i ] ] = function( E = false, r = false ) {

						if ( r || E.target === that || that === w )
							func.apply( that, [ E ] );

					}

					set( e[ i ] );

				}

			} else {

				that.fn[ e ] = function( E = false, r = false ) {

					if ( r || E.target === that || that === w )
						func.apply( that, [ E ] );

				}

				set( e );

			}

			return that;

		},

		offOld: function( e, bool = false ) {

			var unset = function( _e ) {

					if ( w.addEventListener )
						~_e.search( /mouse/gi ) ?
								that.removeEventListener( _e, that.fn[ _e ], bool ) :
								w.removeEventListener( _e, that.fn[ _e ], bool );
					// else if ( w.attachEvent )
					// 	w.detachEvent( 'on' + _e, that.fn[ _e ] );
					else
						delete that[ 'on' + _e ];

				},

				that = this;

			if ( typeof e === 'undefined' ) {

				for ( var i in that.fn )
					unset( i );

				return that;

			} else if ( e instanceof Array )
				for ( var i = 0,  _len = e.length; i < _len; i++ )
					unset( e[ i ] );

			else
				unset( e );

			return that;

		}

	}

	nodeListMethods = {

		toArray: function() {

			var arr = [];

			Array.prototype.forEach.call( this, function( val ) {

				arr.push( val );

			});

			return arr;

		},

		afterTransition: function( callback, prop = false ) {

			this.toArray().pop().on( 'transitionend', prop ? function( e ) {

				if ( e.propertyName == prop )
					callback();

			} : callback, 0, 1 );

			return this;

		}

	}

	stringMethods = {

		isURL: function() {

			var pattern = new RegExp(

						'^((ft|htt)ps?:\\/\\/)?' + // protocol
						'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
						'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
						'(\\:\\d+)?'+ // port
						'(\\/[-a-z\\d%@_.~+&:#]*)*' + // path
						'(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
						'(\\#[-a-z\\d_]*)?$',

				'i' ); // fragment locator

			return pattern.test( encodeURI( this ) );

		},

	}

	for ( var _i in GLOBALS )
		w[ _i ] = GLOBALS[ _i ];

	for ( var _i in domMethods )
		Element.prototype[ _i ] = domMethods[ _i ];

	for ( var _i in canvasMethods )
		CanvasRenderingContext2D.prototype[ _i ] = canvasMethods[ _i ];

	for ( var _i in eventMethods )
		EventTarget.prototype[ _i ] = eventMethods[ _i ];

	for ( var _i in nodeListMethods )
		NodeList.prototype[ _i ] = nodeListMethods[ _i ];

	for ( var _i in stringMethods )
		String.prototype[ _i ] = stringMethods[ _i ];

})( this, document );
