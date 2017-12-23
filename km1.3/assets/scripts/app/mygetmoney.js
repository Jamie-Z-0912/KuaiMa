define('app/mygetmoney', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
	var km = require('../plugs/version');
    pagelist.fun({ 
        url: 'api/v1/withdraw/list',
        data:{page: 1, page_size: 20}
    });

});