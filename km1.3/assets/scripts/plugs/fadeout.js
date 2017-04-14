(function ($) {
    $.extend($.fn, {
        fadeOut: function (speed, easing, complete) {
            if (typeof(speed) === 'undefined') speed = 400; 
            if (typeof(easing) === 'undefined' || typeof(easing) !== 'string') easing = 'swing';
            $(this).css({ opacity: 1 }).animate({ opacity: 0}, speed, easing, function () {
                $(this).css('display', 'none');
                if (typeof(easing) === 'function') {
                    easing();
                } else if (typeof(complete) === 'function') {
                    complete();
                }
            });
            return this;
        }
    });
})(Zepto);

/*******
$('#hongbao').fadeOut(800,'',function(){
    $('#qian').animate({'transform': 'scale(3)'}, 400, 'swing', function(){
        $('#qian').animate({'transform': 'scale(1)'}, 400,'swing',function(){
            $('.line1,.line2').css('text-indent','0');$('#hongbao').remove();
            require('https://static.mlinks.cc/scripts/dist/mlink.min.js');
        })
    })
});
****/