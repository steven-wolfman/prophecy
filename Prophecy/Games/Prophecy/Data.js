// Any object created from the Data module should be tree- (or at
// least DAG-) structured. The goal is that all classes here should be
// easily deep-copyable.
//
// EXCEPTION: I'll need to make event handlers. These should NOT be
// copied on deep-copy. How shall I tag them? Does Foundation already
// have a built-in way to do this? Note: jQuery appears to already
// handle this in its clone method.

/*
 * Interface tagging implementors as deep-copyable.
 */
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

/*
 * A game resource (that a player holds, typically), such as strength
 * (total red cubes) or health (red cubes "on the right"). Note that
 * these can be modified by a variety of game effects.
 *
 * DO NOT INSTANTIATE. Instead, use the two static methods
 * GamesByEmail.Data.Resource.getArray and
 * GamesByEmail.Data.Resource.getMap below.
 *
 * For now, edit these functions to add resources. Obviously, we'll
 * want to refactor later!
 */
Foundation.createClass
(
    "GamesByEmail.Data.Resource",
    null,
    GamesByEmail.Data.Base,
    /*
     * Constructor. Do not call unless creating a new canonical
     * resource. Instead, use the existing canonical resources
     * accessible via getResource.
     */
    function(/* String */ name)
    {
	if (GamesByEmail.Data.Resource.getResource(name))
	    throw new "attempt to create duplicate resource \"" + name + "\""
	this.name = name;
    },
    {
	// Methods
	getName:
	/*
	 * Get the resource's (internal) name.
	 */
	/* String */ function()
	{
	    if (this.name === undefined)
		throw "unimplemented: Resource is abstract"		
	    return this.name;
	},
	// // Return the new htmlBuilder
	// addSymbolHtml:function(htmlBuilder)
	// {
	//     throw "unimplemented: Resource is abstract"
	// },
	// // Return the new htmlBuilder
	// addNegativeSymbolHtml:function(htmlBuilder)
	// {
	//     throw "unimplemented: Resource is abstract"
	// },
	// // Return the new htmlBuilder
	// addSingularTextHtml:function(htmlBuilder)
	// {
	//     throw "unimplemented: Resource is abstract"
	// },
	// // Return the new htmlBuilder
	// addPluralTextHtml:function(htmlBuilder)
	// {
	//     throw "unimplemented: Resource is abstract"
	// },
	// Lower numbers will be listed first in cost/benefit lists.
	// getPriority:function(htmlBuilder)
	// {
	//     throw "unimplemented: Resource is abstract"
	// }
    },
    {
	// Static methods and fields
	conditionalInitResources:
	/*
	 * Set up the canonical resources if they have not been already.
	 */
	/* void */ function() {
	    if (GamesByEmail.Data.Resource.map === undefined)
	    {
		// Avoid reentry. NOT thread safe!
		GamesByEmail.Data.Resource.map = {};

		builtinResources =
		    [
			new GamesByEmail.Data.Resource("Xp"),
			new GamesByEmail.Data.Resource("Gold"),
			new GamesByEmail.Data.Resource("Magic"),
			new GamesByEmail.Data.Resource("Health"),
			new GamesByEmail.Data.Resource("Willpower"),
			new GamesByEmail.Data.Resource("Strength"),
		    ];
		
		builtinResources.forEach(
		    function(resource) {
			GamesByEmail.Data.Resource.map[resource.getName()] = resource;
		    });
	    }
	},
	getAllResources:
	/*
	 * Get the canonical list of resources as an array.
	 */
	/* Array<Resource> */ function() {
	    GamesByEmail.Data.Resource.conditionalInitResources();
	    return Object.keys(GamesByEmail.Data.Resource.map).map(
		function(key) {
		    return GamesByEmail.Data.Resource.map[key];
		});
	},
	getResource:
	/*
	 * Get the canonical resource associated with the given name
	 * (or undefined if no such resource exists).
	 */
	/* Map<String -> Resource> */ function(/* String */ name) {
	    GamesByEmail.Data.Resource.conditionalInitResources();
	    return GamesByEmail.Data.Resource.map[name];
	},
    }
);


describe("GamesByEmail.Data.Resource", function() {
    it("produces its name correctly", function() {
	expect(new GamesByEmail.Data.Resource("foo").getName()).toEqual("foo");
    });

    it("contains the canonical resources and not wholly non-existant resources", function() {
	// Canonicals: exist and are named correctly.
	expect(GamesByEmail.Data.Resource.getResource("Gold")).not.toBeUndefined();
	expect(GamesByEmail.Data.Resource.getResource("Xp")).not.toBeUndefined();
	expect(GamesByEmail.Data.Resource.getResource("Health")).not.toBeUndefined();
	expect(GamesByEmail.Data.Resource.getResource("Strength")).not.toBeUndefined();
	expect(GamesByEmail.Data.Resource.getResource("Magic")).not.toBeUndefined();
	expect(GamesByEmail.Data.Resource.getResource("Willpower")).not.toBeUndefined();

	expect(GamesByEmail.Data.Resource.getResource("Gold").getName()).toEqual("Gold");
	expect(GamesByEmail.Data.Resource.getResource("Xp").getName()).toEqual("Xp");
	expect(GamesByEmail.Data.Resource.getResource("Health").getName()).toEqual("Health");
	expect(GamesByEmail.Data.Resource.getResource("Strength").getName()).toEqual("Strength");
	expect(GamesByEmail.Data.Resource.getResource("Magic").getName()).toEqual("Magic");
	expect(GamesByEmail.Data.Resource.getResource("Willpower").getName()).toEqual("Willpower");

	// Wholly non-existant resource.
	expect(GamesByEmail.Data.Resource.getResource("FAKEFakeyFakeFake")).toBeUndefined();
    });

    it("is consistent between the list and map of resources", function() {
	// Also checks that names are unique.
	var resources = GamesByEmail.Data.Resource.getAllResources();
	var alreadySeen = {};
	resources.forEach(function(resource) {
	    expect(alreadySeen[resource.getName()]).toBeUndefined();
	    alreadySeen[resource.getName()] = true;
	    expect(GamesByEmail.Data.Resource.getResource(resource.getName())).toBe(resource);
	});
    });
});

// ============================================================
// Character
// ============================================================

Foundation.createClass(
    "GamesByEmail.Data.Character",
    null,
    GamesByEmail.Data.Base,
    /*
     * Constructor. Takes a Map<Resource -> Integer> of initial levels
     * of resources. The map is optional; any resource requested but
     * not provided will be undefined. Any resource ADJUSTED when not
     * provided defaults to starting at 0.
     *
     * All mapped resources MUST be canonical resources.
     *
     * Resource levels are constrained between the default limits of
     * DEFAULT_MIN (0) and DEFAULT_MAX(Number.POSITIVE_INFINITY).
     */
    function(initialLevels)
    {
	var levels = {};
	if (initialLevels !== undefined) {
	    Object.keys(initialLevels).forEach(
		function(key) {
		    levels[key] = initialLevels[key];
		});
	}
	this.levels = levels;
    },
    {
	// Methods
	addResource:
	/*
	 * Add the given amount to the given type of resource. The
	 * resource MUST be a canonical resource. An uninitialized
	 * resource is assumed to start at 0. Clips to the
	 * minimum/maximum for the requested resource. Produces the
	 * effective amount actually added to the resource.
	 */
	/* Integer */ function(/* Resource */ type, /* Integer */ amount)
	{
	    var typeName = type.getName();
	    if (this.levels[typeName] === undefined)
		this.levels[typeName] = 0;
	    
	    var init = this.levels[typeName];
	    this.levels[typeName] = Math.min(Math.max(this.levels[typeName] + amount, 
						      GamesByEmail.Data.Character.DEFAULT_MIN),
					     GamesByEmail.Data.Character.DEFAULT_MAX);
	    return this.levels[typeName] - init;
	},
	getResource:
	/*
	 * Gets the amount of the requested resource the player possesses.
	 *
	 * Returns undefined for uninitialized resources.
	 */
	/* Integer or undefined */ function(/* Resource */ type)
	{
	    var typeName = type.getName();
	    return this.levels[typeName];
	},


	// // TODO!!!
	// + getHardResourceMax(type)
	// + getSoftResourceMax(type) // soft limits: applied at end of turn
	// + getHardResourceMin(type)
	// + getSoftResourceMin(type) // soft limits: applied at end of turn
	// + addTransportMode(mode)
	// + removeTransportMode(mode)
	// + hasTransportMode(mode)
	// + countTransportModes(name)     // by textual name (which may be repeated, e.g., "Magic Carpet")
	// + removeAllTransportModes(name) // by textual name
	// + getTransportModes() // an associative array (read: object)
    },
    {
	// Static methods
	DEFAULT_MIN:0,
	DEFAULT_MAX:Number.POSITIVE_INFINITY,
    }
);

describe("GamesByEmail.Data.Character", function() {
    var charNothing;
    var charGold2;
    var charGold4Magic1;

    var gold;
    var magic;
    var health;


    beforeEach(function() {
	gold = GamesByEmail.Data.Resource.getResource("Gold");
	magic = GamesByEmail.Data.Resource.getResource("Magic");
	health = GamesByEmail.Data.Resource.getResource("Health");

	charNothing = new GamesByEmail.Data.Character();
	charGold2 = new GamesByEmail.Data.Character({
	    "Gold":2
	});
	charGold4Magic1 = new GamesByEmail.Data.Character({
	    "Gold":4,
	    "Magic":1,
	});
    });

    it("fetches resources correctly", function() {
	expect(charNothing.getResource(gold)).toBeUndefined();
	expect(charNothing.getResource(magic)).toBeUndefined();
	expect(charNothing.getResource(health)).toBeUndefined();

	expect(charGold2.getResource(gold)).toBe(2);
	expect(charGold2.getResource(magic)).toBeUndefined();
	expect(charGold2.getResource(health)).toBeUndefined();

	expect(charGold4Magic1.getResource(gold)).toBe(4);
	expect(charGold4Magic1.getResource(magic)).toBe(1);
	expect(charGold4Magic1.getResource(health)).toBeUndefined();
    });

    it("does not share levels it is initialized with", function() {
	var initLevels = {"Gold":1};
	var charG1 = new GamesByEmail.Data.Character(initLevels);
	initLevels["Magic"] = 5;
	expect(charG1.getResource(magic)).toBeUndefined();
    });

    it("adjusts resources correctly, including minima", function() {
	expect(charNothing.addResource(gold, 2)).toBe(2);
	expect(charNothing.getResource(gold)).toBe(2);
	expect(charNothing.addResource(magic, -2)).toBe(0);
	expect(charNothing.getResource(magic)).toBe(0);
	expect(charNothing.getResource(health)).toBeUndefined();

	expect(charGold2.addResource(gold, -3)).toBe(-2);
	expect(charGold2.getResource(gold)).toBe(0);
	expect(charGold2.addResource(magic, 5)).toBe(5);
	expect(charGold2.getResource(magic)).toBe(5);
	expect(charNothing.getResource(health)).toBeUndefined();

	expect(charGold4Magic1.addResource(gold, -3)).toBe(-3);
	expect(charGold4Magic1.getResource(gold)).toBe(1);
	expect(charGold4Magic1.addResource(magic, 2)).toBe(2);
	expect(charGold4Magic1.getResource(magic)).toBe(3);
	expect(charNothing.getResource(health)).toBeUndefined();
    });
});

// TODO: TransportMode classes.

// // ============================================================
// // Costs
// // ============================================================

// TODO: documentation and testing!!!
Foundation.createClass(
    "GamesByEmail.Data.Cost",
    null,
    GamesByEmail.Data.Base,
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

// // Foundation.createClass(
// //     "GamesByEmail.Data.SimpleCost",
// //     GamesByEmail.Data.Cost,
// //     // mandatoryResources: an array of records with type (Resource)
// //     // and count (Integer) fields; if the character cannot pay exactly
// //     // the amount listed for each resource, then the cost cannot be
// //     // paid
// //     //
// //     // uptoResources: an array as above; the cost consumes up to this
// //     // much (on top of any mandatory resources) when paid.
// //     //
// //     // PRECONDITION: It is (currently) undefined what happens when a
// //     // mandatoryResource and an uptoResource for the same resource
// //     // have opposite signs.
// //     function(mandatoryResources,uptoResources)
// //     {
// // 	if (mandatoryResources === undefined)
// // 	    this.mandatoryResources = [];
// // 	else if (typeof mandatoryResources.slice === "function")
// // 	    this.mandatoryResources = mandatoryResources.slice();
// // 	else
// // 	    throw "mandatoryResources must be an array of objects with type:Resource and count:Integer";
// // 	if (uptoResources === undefined)
// // 	    this.uptoResources = [];
// // 	else if (typeof uptoResources.slice === "function")
// // 	    this.uptoResources = uptoResources.slice();
// // 	else
// // 	    throw "uptoResources must be an array of objects with type:Resource and count:Integer";

// // 	// TODO: check preconditions?
// //     },
// //     {
// // 	// Virtual methods
// // 	canPay:function(character) 
// // 	{
// // 	    for (var i = 0; i < this.mandatoryResources.length; i++)
// // 	    {
// // 		var type = this.mandatoryResources[i].type;
// // 		var amt = this.mandatoryResources[i].count;
// // 		var newLevel = character.getResource(type) + amt;
// // 		if (!(character.getHardResourceMin(type) <= newLevel &&
// // 		      newLevel <= character.getHardResourceMax(type)))
// // 		    return type;
// // 	    }
// // 	    // Note: do NOT check uptoResources, since they cannot cause failure to pay.
// // 	    return true;
// // 	},
// // 	pay:function(character)
// // 	{
// // 	    for (var i = 0; i < this.mandatoryResources.length; i++)
// // 	    {
// // 		var type = this.mandatoryResources[i].type;
// // 		var amt = this.mandatoryResources[i].count;
// // 		character.addResource(type, amt);
// // 	    }
// // 	    for (var i = 0; i < this.uptoResources.length; i++)
// // 	    {
// // 		var type = this.uptoResources[i].type;
// // 		var amt = this.uptoResources[i].count;
// // 		character.addResource(type, amt); // Let the character figure out how much can actually be added.
// // 	    }
// // 	    return true;
// // 	},
// // 	addSummaryHtml:function(htmlBuilder)
// // 	{
// // 	    // TODO!!!
// // 	},
// // 	addFullHtml:function(htmlBuilder)
// // 	{
// // 	    // TODO!!!
// // 	},
// // 	isPositive:function()
// // 	{
// // 	    for (var i = 0; i < this.mandatoryResources.length; i++)
// // 	    {
// // 		var type = this.mandatoryResources[i].type;
// // 		var amt = this.mandatoryResources[i].count;
// // 		if (amt > 0)
// // 		    return true;
// // 	    }
// // 	    // TODO: consider what should happen if sign of mandatory
// // 	    // and upto is not the same for a particular resource.
// // 	    for (var i = 0; i < this.uptoResources.length; i++)
// // 	    {
// // 		var type = this.uptoResources[i].type;
// // 		var amt = this.uptoResources[i].count;
// // 		if (amt > 0)
// // 		    return true;
// // 	    }
// // 	    return false;
// // 	},
// // 	isNegative:function()
// // 	{
// // 	    for (var i = 0; i < this.mandatoryResources.length; i++)
// // 	    {
// // 		var type = this.mandatoryResources[i].type;
// // 		var amt = this.mandatoryResources[i].count;
// // 		if (amt < 0)
// // 		    return true;
// // 	    }
// // 	    for (var i = 0; i < this.uptoResources.length; i++)
// // 	    {
// // 		var type = this.uptoResources[i].type;
// // 		var amt = this.uptoResources[i].count;
// // 		if (amt < 0)
// // 		    return true;
// // 	    }
// // 	    return false;
// // 	},
// // 	isComparable:function()
// // 	{
// // 	    return true;
// // 	},
// // 	getMin:function(resource)
// // 	{
// // 	    var mandatory = 0;
// // 	    for (var i = 0; i < this.mandatoryResources.length; i++)
// // 		if (this.mandatoryResources[i].type == resource)
// // 		    mandatory = this.mandatoryResources[i].count;
// // 	    var upto = 0;
// // 	    for (var i = 0; i < this.uptoResources.length; i++)
// // 		if (this.uptoResources[i].type == resource)
// // 		    upto = this.uptoResources[i].count;
// // 	    return min(mandatory, mandatory + upto);
// // 	},
// // 	getMax:function(resource)
// // 	{
// // 	    var mandatory = 0;
// // 	    for (var i = 0; i < this.mandatoryResources.length; i++)
// // 		if (this.mandatoryResources[i].type == resource)
// // 		    mandatory = this.mandatoryResources[i].count;
// // 	    var upto = 0;
// // 	    for (var i = 0; i < this.uptoResources.length; i++)
// // 		if (this.uptoResources[i].type == resource)
// // 		    upto = this.uptoResources[i].count;
// // 	    return max(mandatory, mandatory + upto);
// // 	},
// //     },
// //     {
// // 	// Static methods
// //     }
// // );


