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
