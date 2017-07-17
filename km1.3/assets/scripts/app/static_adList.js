define('app/static_adList', function(require, exports, module) {
    var pagelist = require('../mod/pagelist');
    pagelist.fun({ 
        url: 'api/v1/top_news',
        data:{page: 1, page_size: 20}
    },null,function(){
        var w_ = $('.view_3 .imgbox').width() * .3;
        $('.view_3 .imgbox').height(w_*74/113);
    });
    $('#conList').on('click', 'li', function(){
        var url = $(this).data('url')
        window.location.href = url;
    })
})