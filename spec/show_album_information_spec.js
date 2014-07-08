describe('Cache', function() {
    it('stores a value into storage', function() {
        var storage = {};
        var cache = new Cache(storage);
        cache.store({
            key: 'foo', value: 'bar'
        }, 100);

        stored = JSON.parse(storage["foo"]);
        expect(stored.value).toBe("bar");
    });

    it('returns value if cache not expired', function() {
        var storage = {};
        var cache = new Cache(storage);
        cache.store({
            key: 'foo', value: 'bar'
        }, 100);

        expect(cache.find('foo')).toBe("bar");
    });

    it('returns null if cache expired', function() {
        var storage = {};
        var cache = new Cache(storage);
        cache.store({
            key: 'foo', value: 'bar'
        }, 10);

        var flag = false;
        runs(function(){
            setTimeout(function() {
                flag = true;
            }, 50);
        });

        waitsFor(function() {
            return flag;
        }, "Wait cache expire", 100);

        runs(function() {
            expect(cache.find('foo')).toBe(null);
        });
    });
});

describe('VocaDBFetcher', function() {
    it('fetch album information', function() {
        var fetcher = new VocaDBFetcher(Config.VocaDB);
        var flag = false;
        var result;

        runs(function() {
            fetcher.fetchAlbumInformation({
                id: 'sm18460014',
                success: function(json){
                    flag = true;
                    result = json;
                }
            });
        });

        waitsFor(function() {
            return flag;
        }, "Wait ajax request", 80);

        runs(function() {
            expect(result).toNotBe(null);
        });
    });
});
