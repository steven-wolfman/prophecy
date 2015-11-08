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
    /* Parameters: String */
    function(name)
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
     * Constructor. The initial levels of resources (which is an
     * object where each field is a resource name and its value an
     * integer amount) are optional; any resource requested but not
     * provided will be undefined. Any resource ADJUSTED when not
     * provided defaults to starting at 0.
     *
     * All provided resources MUST be canonical resources.
     *
     * Resource levels are constrained between the default limits of
     * DEFAULT_MIN (0) and DEFAULT_MAX(Number.POSITIVE_INFINITY).
     */
    /* Parameters: Map<String -> Integer> */
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

/*
 * A cost OR benefit in the game (e.g., it might cost 1 health and 1
 * magic to use the Dark Mace, or you might receive up to 2 health
 * from healing). In the long run, it would be nice to handle "up to",
 * "at least", choices (e.g., heal 1 health or restore 2 magic), etc.
 *
 * This version is abstract.
 */
Foundation.createClass(
    "GamesByEmail.Data.Cost",
    null,
    GamesByEmail.Data.Base,
    /*
     * Constructor.
     */
    function()
    {
	// Nothing to be done.
    },
    {
	// Virtual methods

	/*
	 * Determine whether character can pay this cost.  Returns
	 * true if the character can pay; else, returns the type of
	 * resources that causes the problem.
	 */
	canPay:
	/* true or Resource */ function(/* Character */ character) {
	    throw "unimplemented";
	},
	/*
	 * Pay this cost on the given character. Produces the actual
	 * cost paid as a SimpleCost.
	 *
	 * PRECONDITION: this.canPay(character) === true.
	 */
	pay:
	/* SimpleCost */ function(/* Character */ character) {
	    throw "unimplemented";
	},
	/*
	 * Add a short version of this cost to the given htmlBuilder
	 * (e.g., "mm.." might mean "two or more magic").
	 *
	 * Returns the same htmlBuilder.
	 */
	addSummaryHtml:
	/* Foundation.StringBuilder */ function(/* Foundation.StringBuilder */ htmlBuilder) {
	    throw "unimplemented";
	},
	/*
	 * Add a full version of this cost to the given htmlBuilder
	 * (e.g., "If a character has 2 or more magic, costs all of a
	 * characters magic.").
	 *
	 * Returns the same htmlBuilder.
	 */
	addFullHtml:
	/* Foundation.StringBuilder */ function(/* Foundation.StringBuilder */ htmlBuilder) {
	    throw "unimplemented";
	},
	/*
	 * Determines whether a cost can have a positive component to
	 * it (i.e., usually, truly a cost).
	 * 
	 * Note: all four possible combos of isPositive and isNegative
	 * are reasonable.  Both true: mixed; both false: free.
	 */
	isPositive:
	/* Boolean */ function() { throw "unimplemented"; },
	/*
	 * Determines whether a cost can have a negative component to
	 * it (i.e., usually, actually a benefit).
	 * 
	 * Note: all four possible combos of isPositive and isNegative
	 * are reasonable.  Both true: mixed; both false: free.
	 */
	isNegative:
	/* Boolean */ function() { throw "unimplemented"; },
	/*
	 * Determines whether a cost can be compared to another
	 * cost. Note, however, that two comparable resources may
	 * still not dominate in either direction or domination may be
	 * situational (e.g., if one costs 2 magic and the other 1
	 * magic and 1 gold or if one can cost 1+ magic up to all of
	 * it and the other costs 2 magic).
	 *
	 * If it is, then it can be compared resource-by-resource; if
	 * not, then it should not be considered to dominate or be
	 * dominated by any resource.
	 */
	isComparable:
	/* Boolean */ function() { throw "unimplemented"; },
	/*
	 * Produce true if this dominates cost. I.e., this cost is
	 * weakly more expensive than (really "at least as expensive
	 * as") cost along all dimensions.
	 *
	 * This will always be false if either cost is
	 * incomparable. If two costs dominate each other, they are
	 * equal. This comparison takes ranges into account (and so
	 * will not return true (in the base implementation) either
	 * way for two things that both cost 1--3 magic, since the
	 * conditions under which they take on different costs may
	 * differ).
	 *
	 * (Best to test against true (... === true), since we may
	 * decide later to have some other return value on false?)
	 */
	dominates:
	/* Boolean */ function(/* Cost */ cost)
	{
	    // TODO: test!!!
	    if (!this.isComparable() || !cost.isComparable())
		return false;
	    
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
	/*
	 * The minimum cost in that resource (zero if not listed).
	 */
	getMin:
	/* Integer */ function(/* Resource */ resource) { throw "unimplemented"; },
	/*
	 * The maximum cost in that resource (zero if not listed; can be infinite??)
	 */
	getMax:
	/* Integer */ function(/* Resource */ resource) { throw "unimplemented"; },
	/*
	 * An array of all the types of resources relevant to this cost.
	 */
	getResourceTypes:
	/* Array<Resource> */ function() { throw "unimplemented"; }
    },
    {
	// Static methods
    }
);

/*
 * A "simple" cost in the game, one that can be described, for each
 * resource that participates in the cost, as a mandatory component
 * (required to pass "canPay") and an "upTo" cost. IF the player can
 * pay all the mandatory costs, then the actual amount paid will be
 * the upTo cost, clipped to the player's maximum/minimum range.
 */
Foundation.createClass(
    "GamesByEmail.Data.SimpleCost",
    null,
    GamesByEmail.Data.Cost,
    /*
     * Constructor. A simple cost has two parts, the mandatory
     * resources that must be available to be paid (an object where
     * each field is the name of a canonical resource, paired with the
     * amount of the mandatory cost), and a similar object describing
     * the actual cost if the mandatory amount is possible. Note that
     * the values of these two are somewhat independent, i.e., for a
     * given resource either can be larger than the other.
     *
     * If one is present without the other (e.g., a mandatory cost but
     * no upto cost for gold), the other defaults to 0. (A 0 mandatory
     * and non-0 upto cost means something that can be used---for that
     * resource---regardless of the player's current levels, e.g.,
     * magical breeze is "usable" regardless of how much
     * magic/willpower the player currently has. A 0 upto cost and
     * non-0 mandatory cost is a cost that requires some minimum
     * availability along the given resource but then has no effect on
     * that resource (e.g., the Giant Scorpion requires minimum magic
     * (?) in order to gain gold but then has no effect on the
     * player's amount of magic.)
     */
    /* Parameters: Map<String -> Integer>, Map<String -> Integer> */
    function(mandatoryResources,uptoResources)
    {
	// TODO from here!!! Implementation of class overall must be
	// slightly tweaked to match the description above.
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
    },
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


