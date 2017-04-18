define(function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    pagelist.fun({ 
        url: 'api/v1/readArticles',
        data:{page: 1, page_size: 20}
    });
    $('#conList').on('click', 'li', function(){
        var url = $(this).data('url'),
            id = $(this).data('id');
        window.location.href = 'kmb://recommend?url=' + url + '&id=' + id;
    })
})