/*
 * UberAccordion
 *
 * Gabriel Aszalos
 *
*/

(function($) {

    var UberAccordion = function(parent, options) {

        // Default settings

        var defaults = {
            verticalClass    : 'accordion-vertical',    // Class to apply when orientation is vertical
            horizontalClass  : 'accordion-horizontal',  // Class to apply when orientation is horizontal
            activeSlideClass : 'active',                // Class to apply on active accordion slide
            orientation      : 'horizontal',            // Accordion orientation
            orientationQuery : null,                    // Media query which causes orientation change
            startSlide       : 1,                       // Starter slide
            openMultiple     : false,                   // Set to true for multiple open slides at a time
            autoPlay         : false,                   // Auto-play
            autoPlaySpeed    : 5000,                    // Auto-play interval
            slideEvent       : 'click',                 // Open slide event
            animationSpeed   : 200,                     // Animation Speed
            headerItem       : typeof options.headerClass === 'undefined' ? 'h1' : '.' + options.headerClass,     // Header class
            contentItem      : typeof options.contentClass === 'undefined' ? 'div' : '.' + options.contentClass   // Content class
        };

        var settings  = $.extend(true, {}, defaults, options);                  // Add user settings with overwrite
        var el        = parent.children('ul');                                  // Accordion container
        var slides    = el.children().children(settings.contentItem);           // Accordion slides
        var headers   = el.children('li').children(settings.headerItem);        // Accordion headers
        var state     = {};                                                     // Keeps current accordion state (ie. currentSlide, orientation, etc)

        var showSlideCallback = function() {
            el.trigger('ua-slide-changed');
        }

        this.toggleSlide = function(slideNumber, override) {

            if(!settings.openMultiple) {

                // If multiple is disabled, open current slide and close other

                if(slideNumber !== state.currentSlide || override) {
                    this.hideSlide($(slides[el.children('li.' + settings.activeSlideClass).index()]));
                    this.showSlide($(slides[slideNumber]));
                }

            } else {

                // If multiple is enabled, toggle clicked slide

                if($(slides[slideNumber]).parent().hasClass(settings.activeSlideClass)) {
                    this.hideSlide($(slides[slideNumber]));
                } else {
                    this.showSlide($(slides[slideNumber]));
                }
            }

            state.currentSlide = slideNumber;
        }

        this.showSlide = function(slide) {

            if(state.orientation === "horizontal") {
                slide.slideDown(settings.animationSpeed, showSlideCallback);
            } else {
                slide.parent().animate({
                    width: slide.parent().attr('data-width')
                }, settings.animationSpeed, showSlideCallback);
            }

            slide.parent().addClass(settings.activeSlideClass);
        }

        this.hideSlide = function(slide) {
            if(state.orientation === "horizontal") {
                slide.slideUp(settings.animationSpeed);
            } else {
                slide.parent().animate({
                    width: slide.parent().children(settings.headerItem).attr('data-width')
                }, settings.animationSpeed);
            }

            slide.parent().removeClass(settings.activeSlideClass);
        }

        this.setOrientation = function(orientation) {

            el.removeClass(settings.horizontalClass + ' ' + settings.verticalClass);

            switch(orientation) {
                case 'vertical':
                    el.addClass(settings.verticalClass);
                    installVertical();
                    break;

                case 'horizontal':
                    el.addClass(settings.horizontalClass);

                    // Don't wipe styles on first load

                    if(typeof state.orientation !== 'undefined') {
                        uninstallVertical();
                    }

                    applyHorizontalBase();

                    break;
            }

            $(slides[state.currentSlide])
                .show()
                .parent().addClass(settings.activeSlideClass);

            state.orientation = orientation;
        }

        this.setAutoplay = function(enabled) {

            var _this = this;

            if(enabled) {
                state.autoPlayInterval = setInterval(function() {
                    var totalSlides = el.children('li').children(settings.headerItem).length;
                    state.currentSlide = state.currentSlide < (totalSlides - 1) ? state.currentSlide + 1 : 0;
                    _this.toggleSlide(state.currentSlide, true);
                }, settings.autoPlaySpeed);
            } else {
                if(typeof state.autoPlayInterval !== "undefined") {
                    clearInterval(state.autoPlayInterval);
                }
            }
        }

        // Installs styling and events for vertical slider

        var installVertical = function() {

            uninstallVertical();

            $(window).bind('resize', resizeContainer);

            applyVerticalBase();
            calculateSizes();
        }

        var applyVerticalBase = function() {

            slides.parent().css(CSSObject.SlideContainers);

            CSSObject.Headers.functions.setTransforms(-$(headers[0]).outerHeight(), 0);
            CSSObject.Slides.functions.setHeight(el.outerHeight(true));
            CSSObject.Slides.functions.setLeft($(headers[0]).outerHeight(true));

            headers.css(CSSObject.Headers.defaults);
            headers.setOuterWidth(el.innerHeight());
            slides.css(CSSObject.Slides.defaults);
        }

        var applyHorizontalBase = function() {
            slides.css({ 'display': 'none' });
        }

        // Calculate sizes and save widths in data attributes
        // for safe animating

        var calculateSizes = function() {

            var totalHeaderWidth = 0;
            var currentContainer = el.children('li.' + settings.activeSlideClass);
            var currentHeader    = currentContainer.children(settings.headerItem);
            var parentWidth      = parent.innerWidth();

            var slideWidth, headerWidth;

            headers.each(function() {
                headerWidth = $(this).outerHeight(true);
                totalHeaderWidth += headerWidth;

                $(this).parent().width(headerWidth);
                $(this).attr('data-width', headerWidth);
            });

            slides.each(function() {
                slideWidth  = parentWidth - totalHeaderWidth;
                headerWidth = $(this).parent().children(settings.headerItem).outerHeight(true);

                $(this).setOuterWidth(slideWidth);
                $(this).attr('data-width', slideWidth);

                $(this).parent().attr('data-width', slideWidth + headerWidth - 1);
            });

            currentContainer.width(parentWidth - totalHeaderWidth + currentHeader.outerHeight(true) - 1);

        }

        // Called on resize event - adjusts accordion width according
        // to parent to allow fluid design

        var resizeContainer = function() {

            if(state.orientation === "vertical") {

                // If we don't hide the accordion before reading the parent's width value
                // the parent will not auto-adjust in width

                el.css('display', 'none');
                el.width(parent.innerWidth());
                el.css('display', 'block');

                calculateSizes();
            }
        }

        // Uninstalls vertical events and styles

        var uninstallVertical = function() {

            $(window).unbind('resize', resizeContainer);

            el.removeAttr('style');
            el.children('li').removeAttr('style');
            slides.removeAttr('style');

            headers.removeAttr('style');
        }

        // Constructor

        var initialize = function(scope) {

            if(typeof options.headerClass !== 'undefined' && typeof options.contentClass === 'undefined') {
                throw("Content class must be defined along with header class.");
            }

            el.addClass('uberAccordion');

            headers.on(settings.slideEvent, function(e) {
                scope.toggleSlide(el.children('li').children(settings.headerItem).index(this));
                scope.setAutoplay(false);

                e.stopImmediatePropagation();
            });

            // If set to responsive, handle orientation changes

            if(settings.orientationQuery) {
                state.matchesQuery = window.matchMedia(settings.orientationQuery).matches;

                // If media query match state changes, switch orientation
                $(window).resize(function() {
                    if(window.matchMedia(settings.orientationQuery).matches !== state.matchesQuery) {
                        state.matchesQuery = window.matchMedia(settings.orientationQuery).matches;
                        scope.setOrientation(state.orientation === 'vertical' ? 'horizontal' : 'vertical');
                    }
                });

                if(state.matchesQuery) {
                    settings.orientation = settings.orientation === 'vertical' ? 'horizontal' : 'vertical';
                }
            }

            state.currentSlide = settings.startSlide - 1;
            $(slides[state.currentSlide]).parent().addClass(settings.activeSlideClass);

            scope.setOrientation(settings.orientation);

            // Set-up auto-play if enabled

            if(settings.autoPlay && !settings.openMultiple) {
                scope.setAutoplay(true);
            }

            el.attr('data-accordion-active', "true");
        }

        initialize(this);
    }

    $.fn.uberAccordion = function(options) {

        // Avoid double instantiating

        return $(this).children("ul").attr('data-accordion-active') === "true" ? false : new UberAccordion(this, options);
    }

    // Set total width with padding and borders (outerWidth)

    $.fn.setOuterWidth = function(value) {
        $(this).each(function() {
            var paddingLeft = isNaN(parseInt($(this).css('padding-left'), 10)) || $(this).css('padding-left') === '100%' ? 0 : parseInt($(this).css('padding-left'), 10);
            var paddingRight = isNaN(parseInt($(this).css('padding-right'), 10)) || $(this).css('padding-right') === '100%' ? 0 : parseInt($(this).css('padding-right'), 10);
            var borderLeft = isNaN(parseInt($(this).css('border-left-width'), 10)) ? 0 : parseInt($(this).css('border-left-width'), 10);
            var borderRight = isNaN(parseInt($(this).css('border-right-width'), 10)) ? 0 : parseInt($(this).css('border-right-width'), 10);
            
            $(this).width(value - paddingLeft - paddingRight - borderLeft - borderRight);
        });
    }

    // CSS Object for vertical accordion
    // These base styles are necessary for all vertical accordions

    var CSSObject = {

        SlideContainers: {
            'display': 'inline',
            'overflow': 'hidden',
            'float': 'left',
            'height': '100%',
            'position': 'relative'
        },

        Headers: {

            defaults: {
                'display': 'block',
                'float': 'left',
                'white-space': 'nowrap',
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'transform-origin': '0 100% 0',
                '-webkit-transform-origin': '0 100%',
                '-moz-transform-origin': '0 100%',
                '-ms-transform-origin': '0 100%'
            },

            functions: {
                setTransforms: function(x, y) {
                    CSSObject.Headers.defaults['-webkit-transform'] = "rotate(90deg) translate(" + x + "px, " + y + "px)";
                    CSSObject.Headers.defaults['-moz-transform'] = "rotate(90deg) translate(" + x + "px, " + y + "px)";
                    CSSObject.Headers.defaults['-ms-transform'] = "rotate(90deg) translate(" + x + "px, " + y + "px)";
                    CSSObject.Headers.defaults['-sand-transform'] = "rotate(90deg) translate(" + x + "px, " + y + "px)";
                    CSSObject.Headers.defaults['transform'] = "rotate(90deg) translate(" + x + "px, " + y + "px)";
                    //CSSObject.Headers.defaults['filter'] = "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
                }
            }
        },

        Slides: {

            defaults: {
                'float': 'left',
                'height': 0,
                'display': 'block',
                'position': 'absolute',
                'top': '0'
            },

            functions: {
                setHeight: function(height) { CSSObject.Slides.defaults.height = height; },
                setLeft: function(left) { CSSObject.Slides.defaults.left = left; }
            }
        }
    }

}(jQuery));
