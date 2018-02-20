/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Earth is the only planet not named after a god.',
                'Jupiter has the shortest day of all the planets.',
                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
                'The Sun contains 99.86% of the mass in the Solar System.',
                'The Sun is an almost perfect sphere.',
                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
                'The temperature inside the Sun can reach 15 million degrees Celsius.',
                'The Moon is moving approximately 3.8 cm away from our planet every year.',
            ],
            SKILL_NAME: 'Nanopool Stats',
            WELCOME_MESSAGE: 'Welcome to Nanopool Stats',
            HELP_MESSAGE: 'You can say give me stats, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':tellWithCard', this.t('WELCOME_MESSAGE'), this.t('SKILL_NAME'), this.t('WELCOME_MESSAGE'));
    },
    'GetCurrentPrice': function() {
         var filledSlots = delegateSlotCollection.call(this);
        
        
        var speechOutput = '';
        var text = '';
        var self = this;
        var options = {
            host: 'api.nanopool.org',
            path: '/v1/eth/prices',
            method: 'GET'
        };
        getPrice(options, function (res){
            if(res == ''){
                speechOutput = "Please try again later";
            }
            else{
                var prices = JSON.parse(res);
                speechOutput = prices.data.price_usd;
                
            }
            self.emit(':tellWithCard', speechOutput, self.t('SKILL_NAME'), text);
        });
    },
    'GetMiningStats': function () {
        var speechOutput = '';
        var text = '';
        var self = this;
        var options = {
            host: 'api.nanopool.org',
            path: '/v1/eth/prices',
            method: 'GET'
        };
        getPrice(options, function (res){
            if(res == ''){
                speechOutput = "Please try again later";
            }
            else{
                var prices = JSON.parse(res);
                speechOutput = prices.data.price_usd;
                
            }
            self.emit(':tellWithCard', speechOutput, self.t('SKILL_NAME'), text);
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getPrice(options, callback){
    https.get(options, function(res) {
        res.on("data", function(data) {
            return callback(data);
            });
    }).on('error', function(e) {
        console.error("Got error: " + e.message);
    });
}

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}