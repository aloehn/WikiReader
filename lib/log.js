
/**
* Manages the log outputs.
*/
var Log = module.exports = function(name) {
    var tabStop = '';
    var timer = [];
    
    /**
    * Writes a string and optionally an object to the log.
    */
    this.info = this.writeln = function(str, obj) {
        log(str, obj);
        return this;
    };
    
    /**
    * Writes a yellow string and optionally an object to the log.
    */
    this.warn = function(str, obj) {
        log(str, obj, 33); // print out in yellow.
        return this;
    };
    
    /**
    * Writes a yellow string and optionally an object to the log.
    */
    this.error = function(err) {
        log('"' + err.message + '"', err.stack, 31); // print out in red.
        return this;
    };
    
    /**
    * Starts a new block and counts the time. To end the block and stop the time: call '.endBlock()'.
    */
    this.newBlock = function() {
        this.writeln('{');
        timer.push(new Date());
        tabStop += '   ';
        return this;
    };
    
    /**
    * Ends a block and shows the needed time (milliseconds).
    */
    this.endBlock = function() {
        var time = timer[timer.length - 1];
        tabStop = tabStop.substr(0, tabStop.length - 3);
        
        this.writeln('} ' + (new Date() - time) + ' ms')
        
        timer.slice(timer.length - 1, 1);
        return this;
    };
    
    function log(str, obj, colorCode) {
        var prefix = '[' + name + '] ' + tabStop;
        var text = prefix + str;
        if (colorCode)
            text = '\u001b[' + colorCode + 'm' + text + '\u001b[39m';
        
        if (obj) {
            console.log(text + ' ->', obj);   
        }
        else {
            console.log(text);   
        }
    }
};


/** DEBUGGING **/
/*
var log = new Log('lib/log');

log.warn("This is a WARNING!", { example: 1 });
log.error(new Error("This is an example!"));

log.writeln("This is a new block ...").newBlock();
setTimeout(function() {
    log.writeln("This should take about 200 ms!").endBlock();
}, 200);
*/
