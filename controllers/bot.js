var promise 	= require('bluebird');
var path        = require('path');
var rivescript  = require("rivescript");

var botconfig   = require('../config/botconfig').botconfig;

var botutil 	= require('../utils/botutil');
var stringutil 	= require('../utils/stringutil');
var debugutil 	= require('../utils/debugutil');

exports = module.exports = function(instances)
{
	return new Botctl(instances);
}

/**
 * @constructs Bot_Controller
 * @public
 * @param {Bot[]} instances - An array with bot instances config
 */
function Botctl(instances)
{
    this.bot = {};

    if(instances && instances.length!=undefined)
    {
        for (var i = 0; i < instances.length; i++)
        {
            var bot = instances[i];
            bot.language = bot.language || 'en';
            bot.config = bot.config || {};
            bot.path = bot.path || '';
            bot.variables = bot.variables || {};

            this.bot[bot.language] = {};

            this.bot[bot.language].loaded = false;
            this.bot[bot.language].entities = [];
            this.bot[bot.language].variables = bot.variables;
            this.bot[bot.language].brain = new rivescript(bot.config);

			if(bot.unicodePunctuation)
				this.bot[bot.language].brain.unicodePunctuation = bot.unicodePunctuation;

            this.bot[bot.language].brain.loadDirectory(bot.path, success_handler.bind(null, bot.language, this), error_handler.bind(null, bot.language));
        }
    }
}

/**
 * Sets a rivescript array to be used by the brain
 * @param {String} name - The name of the key of array
 * @param {Array} value - The array of values
 * @param {String} lang - The language of the bot
 * @param {Array} The array
 */
Botctl.prototype.setArray = function setArray(name, value, lang)
{
    if (value === void 0)
      return delete this.bot[lang].brain._array[name];
    else
      return this.bot[lang].brain._array[name] = value;
}

/**
 * Sets a rivescript global to be used by the brain
 * @param {String} name - The name of the key of global
 * @param {Array} value - The array of values
 * @param {String} lang - The language of the bot
 * @param {Object} The global
 */
Botctl.prototype.setGlobal = function setGlobal(name, value, lang)
{
    return this.bot[lang].brain.setGlobal(name, value);
}

/**
 * Sets a rivescript variable to be used by the brain
 * @param {String} name - The name of the key of variable
 * @param {Array} value - The array of values
 * @param {String} lang - The language of the bot
 * @param {Object} The variable
 */
Botctl.prototype.setVariable = function setVariable(name, value, lang)
{
    return this.bot[lang].brain.setVariable(name, value);
}

/**
 * Sets a rivescript user variable to be used by the brain
 * @param {String} user - The id of the user
 * @param {String} name - The name of the key of variable
 * @param {Array} value - The array of values
 * @param {String} lang - The language of the bot
 * @param {Object} The user variable
 */
Botctl.prototype.setUservar = function setUservar(user, name, value, lang)
{
    return this.bot[lang].brain.setUservar(user, name, value);
}

/**
 * Sets a object with rivescript user variables to be used by the brain
 * @param {String} user - The id of the user
 * @param {Object} data - A data object with pairs of key/values
 * @param {String} lang - The language of the bot
 * @param {Object} The user variables object
 */
Botctl.prototype.setUservars = function setUservars(user, data, lang)
{
    return this.bot[lang].brain.setUservars(user, data);
}

/**
 * Sets a rivescript subroutine to be used by the brain
 * @param {String} user - The id of the user
 * @param {Object} code - The subroutine code
 * @param {String} lang - The language of the bot
 * @param {Object} The subroutine
 */
Botctl.prototype.setSubroutine = function setSubroutine(name, code, lang)
{
    return this.bot[lang].brain.setSubroutine(name, code);
}

/**
 * Sets a rivescript handler to be used by the brain
 * @param {String} language_name - The name of language used
 * @param {Object} obj - A object to be used
 * @param {String} lang - The language of the bot
 * @param {Object} The handler
 */
Botctl.prototype.setHandler = function setHandler(language_name, obj, lang)
{
    return this.bot[lang].brain.setHandler(language_name, obj);
}

/**
 * Sets a rivescript substitution to be used by the brain
 * @param {String} name - The name of the substitution
 * @param {Object} value - The value of the substitution
 * @param {String} lang - The language of the bot
 * @param {Object} The substitution
 */
Botctl.prototype.setSubstitution = function setSubstitution(name, value, lang)
{
    return this.bot[lang].brain.setSubstitution(name, value);
}

/**
 * Sets a rivescript person to be used by the brain
 * @param {String} name - The name of the person
 * @param {Object} value - The value of the person
 * @param {String} lang - The language of the bot
 * @param {Object} The person
 */
Botctl.prototype.setPerson = function setPerson(name, value, lang)
{
    return this.bot[lang].brain.setPerson(name, value);
}

/**
 * Gets a rivescript array object
 * @param {String} lang - The language of the bot
 * @param {Array} The array object
 */
Botctl.prototype.getArray = function getArray(lang)
{
    return this.bot[lang].brain._array;
}

/**
 * Gets a rivescript subtitution object
 * @param {String} lang - The language of the bot
 * @param {Array} The subtitution object
 */
Botctl.prototype.getSubstitution = function getSubstitution(lang)
{
    return this.bot[lang].brain._sub;
}

/**
 * Gets a rivescript user last match
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user last match
 */
Botctl.prototype.lastMatch = function lastMatch(user, lang)
{
    return this.bot[lang].brain.lastMatch(user);
}

/**
 * Gets a rivescript user initial match
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user initial match
 */
Botctl.prototype.initialMatch = function initialMatch(user, lang)
{
    return this.bot[lang].brain.initialMatch(user);
}

/**
 * Gets a rivescript user topic triggers
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user initial match
 */
Botctl.prototype.getUserTopicTriggers = function getUserTopicTriggers(user, lang)
{
    return this.bot[lang].brain.getUserTopicTriggers(user);
}

/**
 * Gets a rivescript variable by a given name
 * @param {String} user - The id of the user
 * @param {String} name - The name of the substitution
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript variable
 */
Botctl.prototype.getVariable = function getVariable(user, name, lang)
{
    return this.bot[lang].brain.getVariable(user, name);
}

/**
 * Gets a rivescript user variable by a given name
 * @param {String} user - The id of the user
 * @param {String} name - The name of the substitution
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user variable
 */
Botctl.prototype.getUservar = function getUservar(user, name, lang)
{
    return this.bot[lang].brain.getUservar(user, name);
}

/**
 * Gets a rivescript user variables object
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user variables object
 */
Botctl.prototype.getUservars = function getUservars(user, lang)
{
    return this.bot[lang].brain.getUservars(user);
}

/**
 * Clears the rivescript user variables object
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user variables object
 */
Botctl.prototype.clearUservars = function clearUservars(user, lang)
{
    return this.bot[lang].brain.clearUservars(user);
}

/**
 * Freezes the rivescript user variables object
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user variables object
 */
Botctl.prototype.freezeUservars = function freezeUservars(user, lang)
{
    return this.bot[lang].brain.freezeUservars(user);
}

/**
 * Thaws the rivescript user variables object
 * @param {String} user - The id of the user
 * @param {String} lang - The language of the bot
 * @param {Array} The rivescript user variables object
 */
Botctl.prototype.thawUservars = function thawUservars(user, lang)
{
    return this.bot[lang].brain.thawUservars(user);
}

/**
 * Process bot event and sends to rivescript
 * @param {Event} event - A NGINB event object
 */
Botctl.prototype.processEvent = function processEvent(event)
{
    var self = this;
	return new promise(function(resolve, reject)
	{
		if(!stringutil.isEmail(event.text))
			event.text = stringutil.replaceAll(event.text, '.', '');

		self.bot[event.lang].brain.replyAsync(event.sender, event.text)
        .then(function(response)
        {
            var reply = botutil.getVariablesObjectFromString(response, event.userdata);
            resolve ({reply:reply, event:event});
        })
        .catch(function(error)
        {
            console.log(error);
        });
	});
}

/**
 * Process entities and configure to use in rivescript
 * @param {EntityConfig[]} entities - An array of entities objects
 * @param {String} lang - The language of the bot to set entities to
 * @return {Boolean}  A bluebird promise with true or false
 */
Botctl.prototype.setEntities = function setEntities(entities, lang)
{
    var self = this;
    return new promise(function(resolve, reject)
	{
        entities = entities || [];
        lang = lang || 'en';

		if(self.bot[lang])
		{
	        if(self.bot[lang].loaded)
	        {
	            processEntities(entities, lang)
	            .then(function(response)
	            {
	                resolve(response);
	            });
	        }
	        else
	            self.bot[lang].entities = entities;
		}
    });
}

/**
 * Success handler for load rivescript brain instances
 * @private
 * @param {String} lang - The language of the bot
 * @param {Bot_Controller} self - This instance of bot controller
 */
function success_handler (lang, self)
{
    self.bot[lang].brain.sortReplies();
    self.bot[lang].loaded = true;

    if(self.bot[lang].variables && self.bot[lang].variables.entities)
        processEntities(self,self.bot[lang].variables.entities, lang);

    if(self.bot[lang].entities.length>0)
    {
        processEntities(self, bot[lang].entities, lang);
        self.bot[lang].entities = [];
    }
}

/**
 * Error handler for load rivescript brain instances
 * @private
 * @param {String} lang - The language of the bot
 * @param {String} err - The error sent by rivescript loader
 */
function error_handler (lang, err)
{
	console.log("Error loading brains " + lang + ": " + err + "\n");
}

/**
 * A function to process the entities
 * @private
 * @param {Bot_Controller} self - This instance of bot controller
 * @param {EntityConfig[]} entities - The entities array object
 * @param {String} lang - The language of the bot
 */
function processEntities(self, entities, lang)
{
    return new promise(function(resolve, reject)
	{
        var flatentities = JSON.stringify(entities);
        var flatbotarray = JSON.stringify(self.getArray(lang));
        var flatbotsubs = JSON.stringify(self.getSubstitution(lang));

        flatentities += flatbotarray + flatbotsubs;

        for (var i = 0; i < entities.length; i++)
        {
            var entity = entities[i];
            if(entity.hasOwnProperty('name') && entity.hasOwnProperty('entries'))
            {
                var array = [];
                for (var j = 0; j < entity.entries.length; j++)
                {
                    var entry = entity.entries[j];
                    var prefix = entry.hasOwnProperty('prefix') ? entry.prefix + ' ' : '';
                    var vlr = prefix + entry.value;
                    array.push(vlr);

                    if(entry.hasOwnProperty('synonyms'))
                    {
                        for (var s = 0; s < entry.synonyms.length; s++)
                        {
                            var sub = entry.synonyms[s];

                            if(sub!=vlr)
                            {
                                self.setSubstitution(sub, vlr, lang);

                                if(botconfig.humanize_subs)
                                {
                                    for (var c = 0; c < sub.length; c++)
                                    {
                                        var newword = botutil.dropChar(sub, c);

                                        if(flatentities.indexOf('"'+newword+'"')==-1)
                                            self.setSubstitution(newword, vlr, lang);

                                        newword = botutil.switchChar(sub, c);
                                        if(flatentities.indexOf('"'+newword+'"')==-1)
                                            self.setSubstitution(newword, vlr, lang);

                                        //botutil.addTypo(sub, c); will add too much subs
                                    }
                                }
                            }
                        }
                    }
                }

                self.setArray(entity.name, array, lang);
            }
        }
        resolve(true);
    });
}
