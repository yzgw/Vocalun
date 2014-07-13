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
