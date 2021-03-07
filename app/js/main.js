(function ($) {
    'use strict';
    AOS.init({
        offset: 150,
        duration: 1000,
        delay: 100,
        easing: 'ease',
        once: true,
    });

    //scroll
    $('.nav-link').on('click', function () {
        $('html, body').animate({
            scrollTop: $($(this).attr("href")).offset().top - $('nav').height() - 20 + "px"
        }, {
            duration: 1000,
            easing: "easeInOutExpo"
        });
    });
})(jQuery);