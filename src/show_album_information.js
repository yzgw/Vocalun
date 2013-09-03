var VOCADB_URL = 'http://vocadb.net'
var VOCADB_SONB_API = VOCADB_URL + '/api/v1/Song/'
var VOCADB_ALBUM_URL = VOCADB_URL + '/Album/Details/'
var tags = get_all_tags()

$('.videoDescription').after('<div id="vocalun_album_information"></div>')

var old_description = $(".videoDescription").text()
setInterval(function() {
  if($(".videoDescription").text() != old_description){
    show_album_information()
    old_description = $(".videoDescription").text()
  }
}, 1000);

function show_album_information(){
  if(tags.indexOf("VOCALOID") != -1 || tags.indexOf("音楽") != -1){
    var id = get_video_id(document.URL)
    console.log(id)
    load_album_information({
      id: id,
      success: function(json){
        var dom = get_album_information(json['Albums'])
        $('#vocalun_album_information').empty().append(dom)          
      },
      error: function(XMLHttpRequest){
        console.log(XMLHttpRequest)
      }
    })
  }
}

function load_album_information(param){
  var url = VOCADB_SONB_API + 'ByPV?pvId=' +  param.id + '&service=NicoNicoDouga'
  $.ajax({
    url: url,
    cache: true,
    crossDomain: true,
    jsonpCallback: "callback",
    jsonp: "callback",
    success: function(data, textStatus, jqXHR){
      if(data != null)
        param.success(data, textStatus, jqXHR)
      else
        param.error(jqXHR, textStatus)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      param.error(jqXHR, textStatus)
    }
  });
}

function get_all_tags(){
  return $('.videoHeaderTagLink').map(function(i, val){
    return val.text
  }).get()
}

function get_video_id(url){
  return url.split("/").slice(-1)[0].split("?")[0].split("#")[0]
}

function get_album_information(albums){
  var album_list = $('<ul></ul>')
  albums.forEach(function(album){
    album_list.append('<li>' + 
      '<a target="_blank" href="' + VOCADB_ALBUM_URL + album['Id'] + '">' +
        '"' + album['Name'] + '"に収録' +
      '</a>' +
    '</li>' )
  })
  return album_list 
}

show_album_information()
