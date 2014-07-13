(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Config = require('../../src/config');
var VocalunConsole = require('../../src/vocalun_console');
var DomObserver = require('../../src/dom_observer');
var VocaDBFetcher = require('../../src/vocadb_fetcher');
var Cache = require('../../src/cache.js');

describe('Cache', function() {
    it('should stores a value into storage', function() {
        var storage = {};
        var cache = new Cache(storage);
        cache.store({
            key: 'foo', value: 'bar'
        }, 100);

        stored = JSON.parse(storage["foo"]);
        expect(stored.value).toBe("bar");
    });

    it('should returns value if cache not expired', function() {
        var storage = {};
        var cache = new Cache(storage);
        cache.store({
            key: 'foo', value: 'bar'
        }, 100);

        expect(cache.find('foo')).toBe("bar");
    });

    describe('Expired cache', function() {
        var storage = {};
        var cache = new Cache(storage);

        beforeEach(function(done) {
            cache.store({
                key: 'foo', value: 'bar'
            }, 10);
            setTimeout(function() {
                done();
            }, 50);
        });

        it('returns null', function() {
            expect(cache.find('foo')).toBe(null);
        });
    });

});

describe('VocaDBFetcher', function() {
    var result;

    beforeEach(function(done) {
        var storage = {};
        var cache = new Cache(storage);
        var fetcher = new VocaDBFetcher(Config.VocaDB, cache);
        fetcher.fetchAlbumInformation({
            id: 'sm18460014',
            success: function(json){
                flag = true;
                result = json;
            }
        });
        done();
    });

    it('fetch album information', function(done) {
        expect(result).not.toBe(null);
        done();
    });
});

},{"../../src/cache.js":2,"../../src/config":3,"../../src/dom_observer":4,"../../src/vocadb_fetcher":5,"../../src/vocalun_console":6}],2:[function(require,module,exports){
var Cache = function(localStorage) {
    this.store = function(keyValue, expireTimeInMilliSeconds) {
        localStorage[keyValue.key] = JSON.stringify({
            value: keyValue.value,
            expireDate: Date.now() + expireTimeInMilliSeconds
        });
    };

    this.find = function(key) {
        if(localStorage[key] === undefined)
            return null;

        var valueAndExpireTime = JSON.parse(localStorage[key]);
        if(Date.now() < valueAndExpireTime.expireDate && valueAndExpireTime !== null) {
            return valueAndExpireTime.value;
        } else {
            delete(localStorage[key]);
            return null;
        }
    };
};

module.exports = Cache;

},{}],3:[function(require,module,exports){
var Config = {
    VocaDB: new function(){
        this.PUBLIC_URL = 'http://vocadb.net/';
        this.API_BASE_URL = this.PUBLIC_URL + 'api/';
        this.ALBUM_PAGE_URL = this.PUBLIC_URL + 'Album/Details/';
    }
};

module.exports = Config;

},{}],4:[function(require,module,exports){
var DomObserver = function(targetDom) {
    this.onChanged = function(callback) {
        var mo = new MutationObserver(function(mutationRecords){
            callback();
        });
        mo.observe(
            targetDom, { characterData: true, subtree: true }
        );
    };
};

module.exports = DomObserver;

},{}],5:[function(require,module,exports){
var VocalunConsole = require('./vocalun_console');

var VocaDBFetcher = function(config, cache) {

    this.ONE_HOUR = 60 * 60 * 1000; //milliseconds

    this.getSongApiUrl = function(pvId){
        return config.API_BASE_URL + "songs?pvService=NicoNicoDouga&pvId=" + pvId + "&fields=Albums";
    };

    this.fetchAlbumInformation = function(params) {
      var url = this.getSongApiUrl(params.id);
      VocalunConsole.log(url);

      var cachedJson = cache.find(params.id);
      if(cachedJson !== null) {
        VocalunConsole.log("Cache used.");
        params.success(cachedJson);
        return;
      }

      $.ajax({
        context: this,
        headers: {
            Accept : "text/json; charset=utf-8",
            "Content-Type": "text/json; charset=utf-8"
        },
        url: url,
        cache: true,
        jsonpCallback: "jsonp",
        jsonp: "callback",
        success: function(data, textStatus, jqXHR){
            if(data !== null){
                VocalunConsole.log("Cache stored.");
                cache.store({
                    key: params.id,
                    value: data
                }, this.ONE_HOUR);
                params.success(data, textStatus, jqXHR);
            } else {
                params.error(jqXHR, textStatus);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            params.error(jqXHR, textStatus, errorThrown);
        }
      });
    };
};

module.exports = VocaDBFetcher;

},{"./vocalun_console":6}],6:[function(require,module,exports){
var VocalunConsole = new function(){
    this.enable = false;
    this.log = function(message) {
        if(this.enable) {
            console.log(message);
        }
    };
}

module.exports = VocalunConsole;

},{}]},{},[1]);