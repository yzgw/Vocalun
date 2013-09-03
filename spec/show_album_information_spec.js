describe("Show album information.js", function() {
  it("can get video id from simple nicovideos' url", function() {
    var url = 'http://www.nicovideo.jp/watch/sm17654032'
    var id = get_video_id(url)
    expect(id).toBe('sm17654032');
  });

  it("can get video id from complex nicovideos' url", function() {
    var url = 'http://www.nicovideo.jp/watch/sm17654032#hoge&foo=bar?param=foobar'
    var id = get_video_id(url)
    expect(id).toBe('sm17654032');
  });

  it("can get video id from complex nicovideos' url with param", function() {
    var url = 'http://www.nicovideo.jp/watch/sm21323813?group_id=37912666'
    var id = get_video_id(url)
    expect(id).toBe('sm21323813');
  });

  // The below tests fails because of cross domain problem.
  // But the extension will work, because Chrome partially allows cross domain request.
  
  // it("succeeds to get album information from vocadb", function() {
  //   var flag = false
  //   var json = load_album_information({
  //     id: "sm17654032",
  //     success: function(data){
  //       flag = true
  //     }
  //   })
  //   
  //   waitsFor(
  //     function(){ return flag; }, "The getting album information should be succeeded", 4000
  //   )
  //   runs(function(){
  //     expect(flag).toBe(true);
  //   });
  // });
  // 
  // it("fails to get album information from vocadb", function() {
  //   var flag = false
  //   var json = load_album_information({
  //     id: "0",
  //     error: function(textStatus, jqXHR){
  //       flag = true
  //     }
  //   })
  //   
  //   waitsFor(
  //     function(){ return flag; }, "The getting album information should be succeeded", 4000
  //   )
  //   runs(function(){
  //     expect(flag).toBe(true);
  //   });
  // });

  it("can make album information as list", function() {
    var json = [
      {
        AdditionalNames: "",
        ArtistString: "Phasma feat. 初音ミク",
        CreateDate: "2012-05-29T19:45:47",
        DiscType: "Album",
        Id: 1429,
        Name: "P",
        RatingAverage: 5,
        RatingCount: 1,
        ReleaseDate: {
        Day: 29,
        Formatted: "2012/04/29",
        IsEmpty: false,
        Month: 4,
        Year: 2012
        },
        ReleaseEvent: "The Voc@loid M@ster 20",
        Status: 1,
        Version: 3
      },
      {
        AdditionalNames: "Apollo",
        ArtistString: "Various artists",
        CreateDate: "2013-03-09T21:27:39",
        DiscType: "Compilation",
        Id: 2225,
        Name: "アポロ",
        RatingAverage: 0,
        RatingCount: 0,
        ReleaseDate: {
        Day: 30,
        Formatted: "2013/03/30",
        IsEmpty: false,
        Month: 3,
        Year: 2013
        },
        ReleaseEvent: null,
        Status: 1,
        Version: 7
      }
    ]
    var information = get_album_information(json).html()
    
    expect(information).toBe('<li><a target="_blank" href="http://vocadb.net/Album/Details/1429">"P"に収録</a></li><li><a target="_blank" href="http://vocadb.net/Album/Details/2225">"アポロ"に収録</a></li>');
  });
  
});
