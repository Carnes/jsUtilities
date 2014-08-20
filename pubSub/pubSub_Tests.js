describe('pubSub', function(){
    it('exists', function(){
        expect(PubSub).toBeDefined();
    });

    describe('public properties', function(){
        it('has sub', function(){
            expect(typeof(PubSub.sub)).toEqual("function");
        });

        it('has pub', function(){
            expect(typeof(PubSub.pub)).toEqual("function");
        });

        it('has unSub', function(){
            expect(typeof(PubSub.unSub)).toEqual("function");
        });

        it('has unSubAll', function(){
            expect(typeof(PubSub.unSubAll)).toEqual("function");
        });

    });

    describe('publishing event', function(){
        var self = this;
        self.callback = function(){};
        var callbackSpy;
        beforeEach(function(){
            callbackSpy = spyOn(self, 'callback');
        });

        it('sub on event calls callback on pub event', function(){
            //Arrange
            var eventName = 'random event';

            //Act
            PubSub.sub(eventName, self.callback);
            PubSub.pub(eventName);

            //Assert
            expect(callbackSpy).toHaveBeenCalled();
        });

        it('does not call callback for wrong event', function(){
            //Arrange
            PubSub.sub('event1', self.callback);

            //Act
            PubSub.pub('event2');

            //Assert
            expect(callbackSpy).not.toHaveBeenCalled();
        });

        it('can call multiple callbacks for event', function(){
            //Arrange
            var eventName = 'random event';
            self.callback2 = function(){};
            var callbackSpy2 = spyOn(self, 'callback2');
            PubSub.sub(eventName, self.callback);
            PubSub.sub(eventName, self.callback2);

            //Act
            PubSub.pub(eventName);

            //Assert
            expect(callbackSpy).toHaveBeenCalled();
            expect(callbackSpy2).toHaveBeenCalled();
        });

        it('calls callback with three arguments', function(){
            //Arrange
            var eventName = 'random event';
            PubSub.sub(eventName, self.callback);

            //Act
            PubSub.pub(eventName, 1,2,3);

            //Assert
            expect(callbackSpy).toHaveBeenCalledWith(1,2,3);
        });
    });

    describe('unSub - ', function(){
        it('can unsubscribe a callback from an event', function(){
            //Arrange
            var eventName = 'random event';
            this.callback1 = function(){};
            this.callback2 = function(){};
            var callback1Spy = spyOn(this, 'callback1');
            var callback2Spy = spyOn(this, 'callback2');
            PubSub.sub(eventName, this.callback1);
            PubSub.sub(eventName, this.callback2);
            PubSub.unSub(eventName, this.callback1);

            //Act
            PubSub.pub(eventName);

            //Assert
            expect(callback1Spy).not.toHaveBeenCalled();
            expect(callback2Spy).toHaveBeenCalled();
        });

        it('unsub on missing event is ignored', function(){
            //Arrange
            PubSub.sub('random event', function(){});

            //Act
            var expectAct = function(){PubSub.unSub('stuff', function(){});};

            //Assert
            expect(expectAct).not.toThrow();
        });

        it('can unsubscribe all callbacks from all events', function(){
            //Arrange
            var eventName = 'random event';
            this.callback1 = function(){};
            this.callback2 = function(){};
            var callback1Spy = spyOn(this, 'callback1');
            var callback2Spy = spyOn(this, 'callback2');
            PubSub.sub(eventName, this.callback1);
            PubSub.sub(eventName, this.callback2);
            PubSub.unSubAll();

            //Act
            PubSub.pub(eventName);

            //Assert
            expect(callback1Spy).not.toHaveBeenCalled();
            expect(callback2Spy).not.toHaveBeenCalled();
        });

    });

    describe('validation - ', function(){
        it('throws if pub event is not a string', function(){
            //Arrange
            PubSub.sub('', function(){});
            var expectAct = function(){PubSub.pub();};

            //Act //Assert
            expect(expectAct).toThrow();
        });

        it('throws if sub event is not a string', function(){
            //Arrange
            var expectAct = function(){PubSub.sub(null, function(){});};

            //Act //Assert
            expect(expectAct).toThrow();
        });

        it('throws if callback is not a function', function(){
            //Arrange
            var expectAct = function(){PubSub.sub('event name', {});};

            //Act //Assert
            expect(expectAct).toThrow();
        });
    });
});