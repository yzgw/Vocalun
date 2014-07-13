(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var Config = {
    VocaDB: new function(){
        this.PUBLIC_URL = 'http://vocadb.net/';
        this.API_BASE_URL = this.PUBLIC_URL + 'api/';
        this.ALBUM_PAGE_URL = this.PUBLIC_URL + 'Album/Details/';
    }
};

module.exports = Config;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./vocalun_console":6}],5:[function(require,module,exports){
var Config = require('./config');
var VocalunConsole = require('./vocalun_console');
var DomObserver = require('./dom_observer');
var VocaDBFetcher = require('./vocadb_fetcher');
var Cache = require('./cache.js');

var AlbumInformationRenderer = function(config) {
    this.init = function() {
        $('.videoDescription').after('<div id="vocalun_album_information"></div>');
    };

    this.render = function(albumJson) {
        var dom = makeAlbumInformationDom(albumJson);
        $('#vocalun_album_information').empty().append(dom);
    };

    this.reset = function(albumJson) {
        $('#vocalun_album_information').empty();
    };

    function makeAlbumInformationDom(albumJson){
        var album_list = $('<ul></ul>');
        albumJson.forEach(function(album){
            VocalunConsole.log(album);
            album_list.append('<li>' +
                '<a target="_blank" href="' + config.ALBUM_PAGE_URL + album.id + '">' +
                '"' + album.name + '"に収録' +
                '</a>' +
                '</li>' );
        });
        return album_list;
    }
};

var VocalunController = function() {
    var renderer = new AlbumInformationRenderer(Config.VocaDB);

    this.main = function() {
        renderer.init();
        this.updateAlbumInformation();

        var observer = new DomObserver($('#videoDetailInformation').get(0));
        observer.onChanged(this.updateAlbumInformation);
    };

    this.updateAlbumInformation = function() {
        renderer.reset();

        var tags = getTags();
        if(isTargetCategoryTag(tags)) {
            var videoId = getVideoId(document.URL);

            var fetcher = new VocaDBFetcher(Config.VocaDB, new Cache(localStorage));
            fetcher.fetchAlbumInformation({
                id: videoId,
                success: function(json){
                    if(json.albums) {
                        renderer.render(json.albums);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    VocalunConsole.log(errorThrown);
                }
            });
        }
    };

    function isTargetCategoryTag(tags) {
        return tags.indexOf("VOCALOID") != -1 || tags.indexOf("音楽") != -1;
    }

    function getTags(){
        return $('.videoHeaderTagLink').map(function(i, val){
            return val.text;
        }).get();
    }

    function getVideoId(url){
        return url.split("/").slice(-1)[0].split("?")[0].split("#")[0];
    }
};

var controller = new VocalunController();
controller.main();

},{"./cache.js":1,"./config":2,"./dom_observer":3,"./vocadb_fetcher":4,"./vocalun_console":6}],6:[function(require,module,exports){
var VocalunConsole = new function(){
    this.enable = false;
    this.log = function(message) {
        if(this.enable) {
            console.log(message);
        }
    };
}

module.exports = VocalunConsole;

},{}]},{},[5]);