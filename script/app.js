;!( function( w, d, l ) {

    'use strict';

    var showSetTimePage = function() {

            overlayLM.addClass( 'set-time' );
            iconsLM.addClass( 'set-time' );

        },

        closeOverlay = function( e ) {

            if ( e )
                e.preventDefault();

            closeLM.blur();

            overlayLM.className = 'overlay';
            iconsLM.className = 'icons';

        },

        resumeTimer = function() {

            var diff = moment().diff( pauseTime );

            durationTime = moment.duration( diff + durationTime.asMilliseconds() );
            endTime = endTime.add( diff );

            pauseTime = false;

            id = reqAnim( frames );

        },

        pauseTimer = function( now ) {

            if ( !now )
                now = new Date;

            pauseTime = moment( now );

        },

        setTime = function( now ) {

            var duration = 0;

            if ( !now )
                now = new Date;

            if ( timerLM.hasClass( 'done' ) ) {

                timerLM.removeClass( 'done' );
                canvas.removeClass( 'done' );

            }

            startTime = moment( now );

            inputs.forEach( function( v ) {

                var val = Number( v.value ) * 1000;

                if ( !val )
                    return;

                switch ( v.name ) {

                    case 'h':

                        duration += val * 60 * 60 ;

                        break;

                    case 'm':

                        duration += val * 60;

                        break;

                    case 's':

                        duration += val;

                        break;

                }

            });

            durationTime = moment.duration( duration );
            endTime = moment().add( durationTime );

            pauseTime = false;

            timerLM.addClass( 'counting' );

            showTime();

        },

        showTime = function() {

            // var time = moment.utc( durationTime.asMilliseconds() );

            // descLM.textContent = 'From ' + time.format( 'HH:mm:ss' );
            descLM.textContent = 'From ' + durationTime.humanize();

            id = reqAnim( frames );

        },

        frames = function() {

            var time = moment.duration( endTime.diff() ),

                h = time.get( 'H' ),
                m = time.get( 'm' ),
                s = time.get( 's' ),

                hh, mm, ss,

                diffDeg = ( 360 * ( durationTime.asMilliseconds() - time.asMilliseconds() ) / durationTime.asMilliseconds() ) - 90;

            if ( h <= 0 && m <= 0 && s <= 0 ) {

                timesUp();

                return;

            }

            if ( pauseTime )
                return;

            remainingLM.textContent = '';

            hh = h.toString().length == 1 ? '0' + h : h;
            mm = m.toString().length == 1 ? '0' + m : m;
            ss = s.toString().length == 1 ? '0' + s : s;

            if ( h > 0 )
                remainingLM.textContent += hh + ':';

            remainingLM.textContent += mm + ':' + ss;


            ctx.clearRect( 0, 0, canvas.width, canvas.height );

            ctx.beginPath();

            ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.height / 2 ) - 2,
                    ctx.toRadian( diffDeg ), ctx.toRadian( -90 ) )

            ctx.strokeStyle = '#fd695d';
            ctx.lineWidth = 2;

            ctx.stroke();

            id = reqAnim( frames );

        },

        timesUp = function() {

            timerLM.removeClass( 'counting' ).addClass( 'done' );
            canvas.addClass( 'done' );

            ctx.clearRect( 0, 0, canvas.width, canvas.height );

            ctx.beginPath();

            ctx.arc( canvas.width / 2, canvas.height / 2, ( canvas.height / 2 ) - 2,
                    ctx.toRadian( -90 ), ctx.toRadian( 270 ) )

            ctx.strokeStyle = '#fd695d';
            ctx.lineWidth = 2;

            ctx.stroke();

            sound.play();

            startTime = false,
            pauseTime = false,
            durationTime = false,
            endTime = false;

        },

        startTime = false,
        pauseTime = false,
        durationTime = false,
        endTime = false,

        id = false,

        soundSrc = 'audio/bell.mp3',
        sound,

        canvas = get( 'canvas' ),
        ctx = canvas.getContext( '2d' ),

        timerLM = get( '.timer' ),
        closeLM = get( '.close' ),
        overlayLM = get( '.overlay' ),
        iconsLM = get( '.icons' ),

        remainingLM = get( '.remaining' ),
        descLM = get( '.desc' ),

        inputs = getEm( '.input' ),

        setTimeIcon = get( '.icons .fa.fa-clock-o' ),

        form = get( '.overlay form' ),

        setButton = get( 'button.set-time' ),
        cancelButton = get( 'button.cancel' );

    timerLM.on( 'click', function( e ) {

        // it's very first time user clicks after time's up
        if ( sound && !startTime ) {

            sound.pause();
            sound = false;

            canvas.removeClass( 'done' );
            timerLM.removeClass( 'done' );

            descLM.textContent = 'Add time';

            ctx.clearRect( 0, 0, canvas.width, canvas.height );

        }

        if ( !startTime )
            showSetTimePage();
        else if ( !pauseTime )
            pauseTimer();
        else
            resumeTimer();

    });

    setTimeIcon.on( 'click', showSetTimePage );

    w.on( 'hashchange', function( e ) {

        var s = l.hash.match( /\d+/ ),

            h, m;

        if ( !s || !s.length )
            return false;

        s = s[ 0 ];

        h = parseInt( s / 60 / 60 );
        s = s - ( h * 60 * 60 );

        m = parseInt( s / 60 );
        s = s - ( m * 60 );

        inputs.forEach( function( v ) {

            switch ( v.name ) {

                case 'h':

                    v.value = h;

                    break;

                case 'm':

                    v.value = m;

                    break;

                case 's':

                    v.value = s;

                    break;

            }

        });

    });

    form.on( 'submit', function( e ) {

        e.preventDefault();

        sound = new Audio( soundSrc );
        sound.loop = true;

        sound.on( 'canplaythrough', function( e ) {

            sound.play();
            sound.pause();

        });

        setTime();
        closeOverlay();

    });

    closeLM.on( 'click', closeOverlay );
    cancelButton.on( 'click', closeOverlay );

    if ( !pauseTime )
        showSetTimePage();

    w.fn[ 'hashchangefalse' ]();

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

})( this, document, location );
