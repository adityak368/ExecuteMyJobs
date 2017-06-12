export const initDomHandlers = () => {

    //NAV START
    var $toggle = $('#nav-toggle');
    var $menu = $('#nav-menu');

    $toggle.click(function() {
        $(this).toggleClass('is-active');
        $menu.toggleClass('is-active');
    });


    $('.nav-item').click(function(){
        var nav_data = $(this).attr('data-nav');
        $('.nav-item').removeClass('is-active');
        $(this).addClass('is-active');
        $('[data-nav='+nav_data+']').addClass('is-active');
    });

    //NAV END
    $('.modal-button').click(function() {
        var target = $(this).data('target');
        $('html').addClass('is-clipped');
        $(target).addClass('is-active');
    });

    $('.modal-background, .modal-close').click(function() {
        $('html').removeClass('is-clipped');
        $(this).parent().removeClass('is-active');
    });

    $('.modal-card-head .delete, .modal-card-foot .button').click(function() {
        $('html').removeClass('is-clipped');
        $('#modal-ter').removeClass('is-active');
    });

    $(document).on('keyup',function(e) {
        if (e.keyCode == 27) {
            $('html').removeClass('is-clipped');
            $('.modal').removeClass('is-active');
        }
    });

    var $highlights = $('.highlight');

    $highlights.each(function() {
        var $el = $(this);
        var copy = '<button class="copy">Copy</button>';
        var expand = '<button class="expand">Expand</button>';
        $el.append(copy);

        if ($el.find('pre code').innerHeight() > 600) {
            $el.append(expand);
        }
    });

    var $highlightButtons = $('.highlight .copy, .highlight .expand');

    $highlightButtons.hover(function() {
        $(this).parent().css('box-shadow', '0 0 0 1px #ed6c63');
    }, function() {
        $(this).parent().css('box-shadow', 'none');
    });

    $('.highlight .expand').click(function() {
        $(this).parent().children('pre').css('max-height', 'none');
    });

    $('.tabs ul li').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('.tabs ul li').removeClass('is-active');
        $('.tab-content').removeClass('is-active');

        $(this).addClass('is-active');
        $("#"+tab_id).addClass('is-active');
    });

}