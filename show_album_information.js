var VOCADB_URL = 'http://vocadb.net'
var VOCADB_SONB_API = VOCADB_URL + '/api/v1/Song/'
var VOCADB_ALBUM_URL = VOCADB_URL + '/Album/Details/'
var tags = get_all_tags()

if(tags.indexOf("VOCALOID") != -1 || tags.indexOf("音楽") != -1){
  var id = get_video_id(document.URL)  
  var url = VOCADB_SONB_API + 'ByPV?pvId=' + id + '&service=NicoNicoDouga'
  $.ajax({
    url: url,
    cache: true,
    jsonp: 'callback',
    success: function(json){
      console.log(json)
      show_album_information(json['Albums'])
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest)
      // console.log(textStatus)
    }
  });  
}

function get_video_id(url){
  console.log(url)
  return url.split("/").slice(-1)[0].split("?")[0]
}

function get_all_tags(){
  return $('.videoHeaderTagLink').map(function(i, val){
    return val.text
  }).get()
}

function show_album_information(albums){
  var vocalun_info = $('<div id="vocalun_album_information"></div>')
  var album_list = $('<ul></ul>')
  albums.forEach(function(album){
    album_list.append('<li>' + 
      '<a href="' + VOCADB_ALBUM_URL + album['Id'] + '">' +
        '"' + album['Name'] + '"に収録' +
      '</a>' +
    '</li>' )
  })
  vocalun_info.append(album_list)
  $('.videoDescription').append(vocalun_info)
}