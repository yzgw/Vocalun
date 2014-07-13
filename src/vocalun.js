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
