var Config = {
    VocaDB: new function(){
        this.PUBLIC_URL = 'http://vocadb.net/';
        this.API_BASE_URL = this.PUBLIC_URL + 'api/';
        this.ALBUM_PAGE_URL = this.PUBLIC_URL + 'Album/Details/';
    }
};

module.exports = Config;
