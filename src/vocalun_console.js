var VocalunConsole = new function(){
    this.enable = false;
    this.log = function(message) {
        if(this.enable) {
            console.log(message);
        }
    };
}

module.exports = VocalunConsole;
