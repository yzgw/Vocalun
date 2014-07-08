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
        var fetcher = new VocaDBFetcher(Config.VocaDB);
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
