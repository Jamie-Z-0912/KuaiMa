define(function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    pagelist.fun({ 
        url: 'api/v1/msgs',
        data:{page: 1, page_size: 20}
    });
})