define('app/myCardList', function(require, exports, module) {
    var pagelist = require('../mod/pagelist');
    pagelist.fun({ 
        url: 'api/v1/cards/list',
        data:{page: 1, page_size: 20}
    });
});