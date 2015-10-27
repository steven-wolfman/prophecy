// Nothing inside the "Data" module should store any field referring
// to anything outside the "Data" module (within the game).
//
// The goal is that all classes here should be deep-copyable.
//
// EXCEPTION: I'll need to make event handlers. These should NOT be
// copied on deep-copy. How shall I tag them? Does Foundation already
// have a built-in way to do this?

// TODO: refactor so this stuff that uses an array of resource types
// instead exploits the uniqueness of names and uses
// objects/associative arrays.
Foundation.createInterface
(
    "GamesByEmail.Data.Base",
    {
	deepCopy:function()
	{
	    return GamesByEmail.deepCopy(this);
	}
    },
    {
	// Static methods and properties.
    }
);


// ============================================================
// RESOURCES
// ============================================================

// DO NOT INSTANTIATE. Instead, use the two variables
// GamesByEmail.Data.ResourceArray and GamesByEmail.Data.Resources
// below, adding to them as needed to extend the universe of resources
// allowed.
Foundation.createClass
(
    "GamesByEmail.Data.Resource",
    null,
    GamesByEmail.Data.Base,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function()
	{
	    throw "unimplemented: Resource is abstract"
	},
	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    throw "unimplemented: Resource is abstract"
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    throw "unimplemented: Resource is abstract"
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    throw "unimplemented: Resource is abstract"
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    throw "unimplemented: Resource is abstract"
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    throw "unimplemented: Resource is abstract"
	}
    },
    {
	// Static methods
    }
);


Foundation.createClass
(
    "GamesByEmail.Data.Resource.Subclass.Xp",
    GamesByEmail.Data.Resource,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function() { return "Xp"; },

	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("X");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("x");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    htmlBuilder.append("XP");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    return this.addSingularTextHtml(htmlBuilder);
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    // TODO: return to this when I've reviewed what the game does or made a reasonable design decision.
	    return 100;
	}
    },
    {
	// Static methods
    }
);


Foundation.createClass
(
    "GamesByEmail.Data.Resource.Subclass.Gold",
    GamesByEmail.Data.Resource,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function() { return "Gold"; },

	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("G");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("g");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    htmlBuilder.append("Gold");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    return this.addSingularTextHtml(htmlBuilder);
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    // TODO: return to this when I've reviewed what the game does or made a reasonable design decision.
	    return 200;
	}
    },
    {
	// Static methods
    }
);

Foundation.createClass
(
    "GamesByEmail.Data.Resource.Subclass.Magic",
    GamesByEmail.Data.Resource,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function() { return "Magic"; },

	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("M");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("m");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    htmlBuilder.append("Magic");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    return this.addSingularTextHtml(htmlBuilder);
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    // TODO: return to this when I've reviewed what the game does or made a reasonable design decision.
	    return 300;
	}
    },
    {
	// Static methods
    }
);

Foundation.createClass
(
    "GamesByEmail.Data.Resource.Subclass.Health",
    GamesByEmail.Data.Resource,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function() { return "Health"; },

	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("H");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("h");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    htmlBuilder.append("Health");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    return this.addSingularTextHtml(htmlBuilder);
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    // TODO: return to this when I've reviewed what the game does or made a reasonable design decision.
	    return 400;
	}
    },
    {
	// Static methods
    }
);

Foundation.createClass
(
    "GamesByEmail.Data.Resource.Subclass.Willpower",
    GamesByEmail.Data.Resource,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function() { return "Willpower"; },

	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("W");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("w");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    htmlBuilder.append("Willpower");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    return this.addSingularTextHtml(htmlBuilder);
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    // TODO: return to this when I've reviewed what the game does or made a reasonable design decision.
	    return 500;
	}
    },
    {
	// Static methods
    }
);


Foundation.createClass
(
    "GamesByEmail.Data.Resource.Subclass.Strength",
    GamesByEmail.Data.Resource,
    function()
    {
	// Constructor
    },
    {
	// Methods
	getName:function() { return "Strength"; },

	// Return the new htmlBuilder
	addSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("S");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addNegativeSymbolHtml:function(htmlBuilder)
	{
	    // TODO: improve!
	    htmlBuilder.append("s");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addSingularTextHtml:function(htmlBuilder)
	{
	    htmlBuilder.append("Strength");
	    return htmlBuilder;
	},
	// Return the new htmlBuilder
	addPluralTextHtml:function(htmlBuilder)
	{
	    return this.addSingularTextHtml(htmlBuilder);
	},
	// Lower numbers will be listed first in cost/benefit lists.
	getPriority:function(htmlBuilder)
	{
	    // TODO: return to this when I've reviewed what the game does or made a reasonable design decision.
	    return 600;
	}
    },
    {
	// Static methods
    }
);

// Create two ways to "look through" the resources
// - In an array.
// - In an associative array by name.
GamesByEmail.Data.ResourceArray =
    [
	new GamesByEmail.Data.Resource.Subclass.Xp(),
	new GamesByEmail.Data.Resource.Subclass.Gold(),
	new GamesByEmail.Data.Resource.Subclass.Magic(),
	new GamesByEmail.Data.Resource.Subclass.Health(),
	new GamesByEmail.Data.Resource.Subclass.Willpower(),
	new GamesByEmail.Data.Resource.Subclass.Strength(),
    ];

GamesByEmail.Data.Resources = {};
GamesByEmail.Data.ResourceArray.map(
    function(resource) {
	GamesByEmail.Data.Resources[resource.getName()] = resource;
    });

// ============================================================
// Character
// ============================================================

Foundation.createClass(
    "GamesByEmail.Data.Character",
    null,
    GamesByEmail.Data.Base,
    // Consumes (optional) arrays of pairs {type:Resource, count:Integer}
    // Otherwise, min defaults to 0 and max to Number.POSITIVE_INFINITY.
    function(initialLevels,minLevels, maxLevels)
    {
	// Constructor
	if (minLevels === undefined)
	    this.minLevels = [];
	else if (typeof minLevels.slice === "function")
	    this.minLevels = minLevels.slice();
	else
	    throw "minLevels must be an array of objects with type:Resource and count:Integer";

	if (maxLevels === undefined)
	    this.maxLevels = [];
	else if (typeof maxLevels.slice === "function")
	    this.maxLevels = maxLevels.slice();
	else
	    throw "maxLevels must be an array of objects with type:Resource and count:Integer";

	if (initialLevels === undefined)
	    this.levels = [];
	else if (typeof initialLevels.slice === "function")
	    this.levels = initialLevels.slice();
	else
	    throw "initialLevels must be an array of objects with type:Resource and count:Integer";

	// TODO: check that initial levels meet minima/maxima
	// TODO: enforce preconditions (and add ones like the mins must be <= the maxes!)
    },
    {
	// Methods
	addResource:function(type, amount)
	{
	    for (var i = 0; i < this.levels.length; i++)
	    {
		if (this.levels[i].type == type)
		{
		    this.levels[i].count += amount;
		    this.levels[i].count = min(this.levels[i].count, this.getHardResourceMax(type));
		    this.levels[i].count = max(this.levels[i].count, this.getHardResourceMin(type));
		    // TODO: loads of event firing and such.
		    return;
		}
	    }
	    var index = this.levels.length;
	    this.levels[index] = {"type":type, "count":0};
	    this.levels[index].count += amount;
	    this.levels[index].count = min(this.levels[index].count, this.getHardResourceMax(type));
	    this.levels[index].count = max(this.levels[index].count, this.getHardResourceMin(type));
	},
	getResource:function(type)
	{
	    for (var i = 0; i < this.levels.length; i++)
	    {
		if (this.levels[i].type == type)
		{
		    return this.levels[i].count;
		}
	    }
	    return null;
	},
// TODO!!!
+ getHardResourceMax(type)
+ getSoftResourceMax(type) // soft limits: applied at end of turn
+ getHardResourceMin(type)
+ getSoftResourceMin(type) // soft limits: applied at end of turn
+ addTransportMode(mode)
+ removeTransportMode(mode)
+ hasTransportMode(mode)
+ countTransportModes(name)     // by textual name (which may be repeated, e.g., "Magic Carpet")
+ removeAllTransportModes(name) // by textual name
+ getTransportModes() // an associative array (read: object)
    },
    {
	// Static methods
	DEFAULT_MIN:0,
	DEFAULT_MAX:Number.POSITIVE_INFINITY,
    },
);

// TODO: TransportMode classes.

// ============================================================
// Costs
// ============================================================

Foundation.createClass(
    "GamesByEmail.Data.Cost",
    null,
    GamesByEmail.Data,
    function()
    {
	// Constructor
    },
    {
	// Virtual methods

	// TODO: throw unimplemented?

	// Given a Character, determine whether that character can pay
	// this cost.  Returns true if the character can pay; else,
	// returns the type of resources that causes the problem.
	canPay:function(character) { },
	pay:function(character) { },
	addSummaryHtml:function(htmlBuilder) { },
	addFullHtml:function(htmlBuilder) { },
	isPositive:function() { },   // Note: all four possible combos are reasonable,
	isNegative:function() { },   //       both true: mixed; both false: free
	isComparable:function() { }, // If it is, then it can be compared resource-by-resource; 
	                             // it should not be considered to dominate or be dominated by any resource
	// For the moment, at least, returns a Boolean,
	// but maybe best to test against true (... === true)?
	dominates:function(cost)
	{
	    if (!this.isComparable() || !cost.isComparable())
		return false;
	    
	    // TODO: could be more efficient, but probably not important
	    var thisResources = this.getResourceTypes();
	    var thatResources = cost.getResourceTypes();
	    for (var i = 0; i < thisResources.length; i++)
	    {
		var type = thisResources[i];
		if (!(this.getMax(type) <= cost.getMin(type)))
		{
		    return false;
		}
	    }
	    for (var i = 0; i < thatResources.length; i++)
	    {
		var type = thatResources[i];
		if (!(this.getMax(type) <= cost.getMin(type)))
		{
		    return false;
		}
	    }
	    return true;
	},
	getMin:function(resource) { }, // the minimum cost in that resource (zero if not listed)
	getMax:function(resource) { }, // the maximum cost in that resource (zero if not listed; can be infinite??)
	getResourceTypes:function() { } // an array of all the types of resources relevant to this cost
    },
    {
	// Static methods
    }
);

Foundation.createClass(
    "GamesByEmail.Data.SimpleCost",
    GamesByEmail.Data.Cost,
    // mandatoryResources: an array of records with type (Resource)
    // and count (Integer) fields; if the character cannot pay exactly
    // the amount listed for each resource, then the cost cannot be
    // paid
    //
    // uptoResources: an array as above; the cost consumes up to this
    // much (on top of any mandatory resources) when paid.
    //
    // PRECONDITION: It is (currently) undefined what happens when a
    // mandatoryResource and an uptoResource for the same resource
    // have opposite signs.
    function(mandatoryResources,uptoResources)
    {
	if (mandatoryResources === undefined)
	    this.mandatoryResources = [];
	else if (typeof mandatoryResources.slice === "function")
	    this.mandatoryResources = mandatoryResources.slice();
	else
	    throw "mandatoryResources must be an array of objects with type:Resource and count:Integer";
	if (uptoResources === undefined)
	    this.uptoResources = [];
	else if (typeof uptoResources.slice === "function")
	    this.uptoResources = uptoResources.slice();
	else
	    throw "uptoResources must be an array of objects with type:Resource and count:Integer";

	// TODO: check preconditions?
    }
    {
	// Virtual methods
	canPay:function(character) 
	{
	    for (var i = 0; i < this.mandatoryResources.length; i++)
	    {
		var type = this.mandatoryResources[i].type;
		var amt = this.mandatoryResources[i].count;
		var newLevel = character.getResource(type) + amt;
		if (!(character.getHardResourceMin(type) <= newLevel &&
		      newLevel <= character.getHardResourceMax(type)))
		    return type;
	    }
	    // Note: do NOT check uptoResources, since they cannot cause failure to pay.
	    return true;
	},
	pay:function(character)
	{
	    for (var i = 0; i < this.mandatoryResources.length; i++)
	    {
		var type = this.mandatoryResources[i].type;
		var amt = this.mandatoryResources[i].count;
		character.addResource(type, amt);
	    }
	    for (var i = 0; i < this.uptoResources.length; i++)
	    {
		var type = this.uptoResources[i].type;
		var amt = this.uptoResources[i].count;
		character.addResource(type, amt); // Let the character figure out how much can actually be added.
	    }
	    return true;
	},
	addSummaryHtml:function(htmlBuilder)
	{
	    // TODO!!!
	},
	addFullHtml:function(htmlBuilder)
	{
	    // TODO!!!
	},
	isPositive:function()
	{
	    for (var i = 0; i < this.mandatoryResources.length; i++)
	    {
		var type = this.mandatoryResources[i].type;
		var amt = this.mandatoryResources[i].count;
		if (amt > 0)
		    return true;
	    }
	    // TODO: consider what should happen if sign of mandatory
	    // and upto is not the same for a particular resource.
	    for (var i = 0; i < this.uptoResources.length; i++)
	    {
		var type = this.uptoResources[i].type;
		var amt = this.uptoResources[i].count;
		if (amt > 0)
		    return true;
	    }
	    return false;
	},
	isNegative:function()
	{
	    for (var i = 0; i < this.mandatoryResources.length; i++)
	    {
		var type = this.mandatoryResources[i].type;
		var amt = this.mandatoryResources[i].count;
		if (amt < 0)
		    return true;
	    }
	    for (var i = 0; i < this.uptoResources.length; i++)
	    {
		var type = this.uptoResources[i].type;
		var amt = this.uptoResources[i].count;
		if (amt < 0)
		    return true;
	    }
	    return false;
	},
	isComparable:function()
	{
	    return true;
	},
	getMin:function(resource)
	{
	    var mandatory = 0;
	    for (var i = 0; i < this.mandatoryResources.length; i++)
		if (this.mandatoryResources[i].type == resource)
		    mandatory = this.mandatoryResources[i].count;
	    var upto = 0;
	    for (var i = 0; i < this.uptoResources.length; i++)
		if (this.uptoResources[i].type == resource)
		    upto = this.uptoResources[i].count;
	    return min(mandatory, mandatory + upto);
	},
	getMax:function(resource)
	{
	    var mandatory = 0;
	    for (var i = 0; i < this.mandatoryResources.length; i++)
		if (this.mandatoryResources[i].type == resource)
		    mandatory = this.mandatoryResources[i].count;
	    var upto = 0;
	    for (var i = 0; i < this.uptoResources.length; i++)
		if (this.uptoResources[i].type == resource)
		    upto = this.uptoResources[i].count;
	    return max(mandatory, mandatory + upto);
	},
    },
    {
	// Static methods
    }
);



GamesByEmail.Data.testing = true;
if (GamesByEmail.Data.testing === true)
{
    result = "";
    for (var i = 0; i < GamesByEmail.Data.ResourceArray.length; i++) {
	var name = GamesByEmail.Data.ResourceArray[i].getName();
	result += name + ":" + GamesByEmail.Data.Resources[name].getName() + "\n";
    }
    alert(result);
}
