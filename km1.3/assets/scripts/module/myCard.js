define(function(require, exports, module) {
    var Ajax = require('../libs/base');
    Ajax.custom({
        url:'api/v1/cards/my'
    }, function(d){
        Ajax.render('#myCard', '#myCard-tmpl', d.data, undefined, true);
    });
    Ajax.custom({
        url:'api/v1/cards'
    }, function(d){
        Ajax.render('#cards', '#cards-tmpl', d, undefined, true);
        seajs.use('./assets/scripts/plugs/swiper-2.7.min',function(){
            new Swiper('#cardsWrap',{
                freeMode : true,
                loop : false,
                slidesPerView : 'auto',
                pagination: '.pagination',
                paginationClickable: true
            });
        });
    })
});