var PubSub = (function(){
    var self = {};
    var subscribers = [];

    var validateEvent = function(event){
        if(typeof(event) != "string")
            throw "PubSub requires event to be a string.";
    };

    var validateCallback = function(callback){
        if(typeof(callback)!="function")
            throw "PubSub callback must be a function.";
    };

    var eventExists = function(event){
        return Array.isArray(subscribers[event]);
    };

    self.sub = function(event, callback){
        validateEvent(event);
        validateCallback(callback);
        if(eventExists(event))
            subscribers[event].push(callback);
        else
            subscribers[event] = [callback];
    };

    self.pub = function(event){
        var args = Array.prototype.slice.call(arguments, 1);
        validateEvent(event);
        if(eventExists(event))
            subscribers[event].forEach(function(func){
                func.apply(null, args);
            });
    };

    self.unSub = function(event, needle){
        validateEvent(event);
        validateCallback(needle);
        if(eventExists(event))
        {
            var hayStack = [];
            subscribers[event].forEach(function(hay){
                if(hay != needle)
                    hayStack.push(hay);
            });
            subscribers[event] = hayStack;
        }
    };

    self.unSubAll = function(){
        subscribers = [];
    };

    return self;
})();
