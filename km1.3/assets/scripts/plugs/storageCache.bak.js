define(function(require,exports,module){
    var _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
    var _defaultExpire = _maxExpireDate;

    var defaultSerializer = {
        serialize: function (item) {
            return JSON.stringify(item);
        },
        deserialize: function (data) {
            return data && JSON.parse(data);
        }
    };

    function _extend (obj, props) {
        for (var key in props) obj[key] = props[key];
        return obj;
    }

    function _keyAsString(key){
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }
        return key;
    }

    // cache item constructor
    function CacheItemConstructor (value, exp) {
        // createTime
        this.c = (new Date()).getTime();
        exp = exp || _defaultExpire;
        var expires = _getExpiresDate(exp);
        // expiresTime
        this.e = expires.getTime();
        this.v = value;
    }

    function _isCacheItem(item) {
        if (typeof item !== 'object') {
            return false;
        }
        if(item) {
            if('c' in item && 'e' in item && 'v' in item) {
                return true;
            }
        }
        return false;
    }
    function _checkCacheItemIfEffective(cacheItem) {
        var timeNow = (new Date()).getTime();
        return timeNow < cacheItem.e;
    }
	
    var CacheAPI = {
        set: function (key, value, options) {},
        get: function (key) {},
        delete: function (key) {},
        // Clear all keys
        clear: function () {},
    };
    var CacheAPIImpl = {
        set: function(key, val, options) {
            key = _keyAsString(key);
            options = _extend({force: true}, options);
            if (val === undefined) {
                return this.delete(key);
            }
            var value = defaultSerializer.serialize(val);
            var cacheItem = new CacheItemConstructor(value, options.exp);
            try {
                this.storage.setItem(key, defaultSerializer.serialize(cacheItem));
            } catch (e) {
                console.error(e);
            } 
        },
	    get: function (key) {
	        key = _keyAsString(key);
	        var cacheItem = null;
	        try{
	            cacheItem = defaultSerializer.deserialize(this.storage.getItem(key));
	        }catch(e){
	            return null;
	        }
	        if(_isCacheItem(cacheItem)){
	            if(_checkCacheItemIfEffective(cacheItem)) {
	                var value = cacheItem.v;
	                return defaultSerializer.deserialize(value);
	            } else {
	                this.delete(key);
	            }
	        }
	        return null;
	    },

	    delete: function (key) {
	        key = _keyAsString(key);
	        this.storage.removeItem(key);
	        return key;
	    },

	    clear: function () {
	        this.storage.clear();
	    }
	};
	function _getStorageInstance (storage) {
        var type = typeof storage;
        if (type === 'string' && window[storage] instanceof Storage) {
            return window[storage];
        }
        return storage;
    }

	function _isStorageSupported(storage) {
        var supported = false;
        if (storage && storage.setItem ) {
            supported = true;
            var key = '__' + Math.round(Math.random() * 1e7);
            try {
                storage.setItem(key, key);
                storage.removeItem(key);
            } catch (err) {
                supported = false;
            }
        }
        return supported;
    }

	function CacheConstructor (options) {
	    // default options
	    var defaults = {
	        storage: 'localStorage',
	        exp: Infinity  //An expiration time, in seconds. default never .
	    };

	    var opt = _extend(defaults, options);

	    var expires = opt.exp;

	    if (expires && typeof expires !== 'number' && !_isValidDate(expires)) {
	        throw new Error('Constructor `exp` parameter cannot be converted to a valid Date instance');
	    } else {
	        _defaultExpire = expires;
	    }

	    var storage = _getStorageInstance(opt.storage);

	    var isSupported = _isStorageSupported(storage);

	    this.isSupported = function () {
	        return isSupported;
	    };

	    if (isSupported) {

	        this.storage = storage;

	        this.quotaExceedHandler = function (key, val, options, e) {
	            console.warn('Quota exceeded!');
	            if (options && options.force === true) {
	                var deleteKeys = this.deleteAllExpires();
	                console.warn('delete all expires CacheItem : [' + deleteKeys + '] and try execute `set` method again!');
	                try {
	                    options.force = false;
	                    this.set(key, val, options);
	                } catch (err) {
	                    console.warn(err);
	                }
	            }
	        };

	    } else {  // if not support, rewrite all functions without doing anything
	        _extend(this, CacheAPI);
	    }

	}

	CacheConstructor.prototype = CacheAPIImpl;
    module.exports = CacheConstructor;
})