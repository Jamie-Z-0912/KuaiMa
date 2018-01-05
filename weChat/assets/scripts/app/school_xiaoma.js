define('app/school_xiaoma', function(require, exports, module) {
    var $ = require('zepto'); 
    var swiper = new Swiper('.swiper-container', {
        hashNavigation: { watchState: true },
        pagination: { el: '.swiper-pagination', clickable: true}
    });
    $('#video').on('click', function(){
        window.location = 'animation/screen/index.html';
    })

});