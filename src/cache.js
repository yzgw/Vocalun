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
