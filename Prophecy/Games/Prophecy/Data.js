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
	deepCopy:
	/*
	 * UNIMPLEMENTED PLAN: Make a deep copy of this object and
	 * return it. Likely will want to avoid copying event handlers
	 * (but may just want to be able to tag some fields for
	 * sharing).
	 */
	function()
	{
	    return GamesByEmail.Data.Base.deepCopy(this);
	}
    },
    {
	// Static methods and properties.
	deepCopy:
	/*
	 * Make a deep copy of orig. (See the member function deepCopy).
	 */
	/* any */ function(/* any */ orig) {
	    // TODO: presently based on GamesByEmail.deepCopy. Need
	    // to rewrite from scratch.
	    //
	    // One strategy would be to ONLY deepcopy things that are
	    // Data.Base. In that case, e.g., I'd need to change
	    // Character to manage its levels in an object tagged as
	    // Data.Base.
	    if (orig==null)
		return null;
	    var copy;
	    if (orig.constructor==Array)
		copy=new Array();
	    else
		copy=new Object();
	    for (var i in orig)
		if (typeof(orig[i])=="object")
		    copy[i]=GamesByEmail.Data.Base.deepCopy(orig[i]);
            else
		// Changed this so that it does NOT skip copying functions.
		copy[i]=orig[i];
	    return copy;
	},
	shallowCopyMap:
	/*
	 * Make a shallow copy (new object with fields of the same
	 * name containing copied values (but not shallow/deep copied
	 * values; so, e.g., might be a pointer to the SAME object as
	 * in the original) of the given simple map (an object with
	 * only its own fields (no inherited ones)).
	 */
	function(map) {
	    return GamesByEmail.shallowCopy(map);

	    //Tested this and it worked, but switching to use
	    //GamesByEmail version:
	    //
	    // var result = {};
	    // GamesByEmail.Data.Base.getMapKeys(map).forEach(
	    // 	function(key) {
	    // 	    result[key] = map[key];
	    // 	});
	    // return result;
	},
	getMapValues:
	/*
	 * Get an array of the values in a simple map object.
	 */
	function(map) {
	    return GamesByEmail.Data.Base.getMapKeys(map).map(
		function(key) {
		    return map[key];
		});
	},
	getMapKeys:
	/*
	 * Get an array of the keys in a simple map object.
	 */
	function(map) {
	    return Object.keys(map);
	}
    }
);


describe("GamesByEmail.Data.Base", function() {
    var emptyMap;
    var obj;
    var a1bHellocObjMap;
    
    beforeEach(function() {
	emptyMap = {};
	obj = {"x":1, "y":2};
	a1bHellocObjMap = {"a":1, "b":"Hello", "c":obj};
    });

    it("deep copies correctly", function() {
	var char1 = new GamesByEmail.Data.Character({"Gold":2, "Magic":3});
	var char2 = char1.deepCopy();

	// char2 should have an addResource function (and all the
	// other Character functions).
	expect(char2.addResource).not.toBeUndefined();
	expect(typeof(char2.addResource)).toEqual("function");
	
	// char2 should have equal fields to char1 without BEING char1.
	expect(char2.getResource("Gold")).toBe(2);
	expect(char2.getResource("Magic")).toBe(3);
	expect(char2.getResource("Health")).toBeUndefined();

	expect(char2).not.toBe(char1);
	expect(char2.levels).not.toBe(char1.levels);

	// Change char2's gold and expect char1's to stay the same.
	char2.addResource("Gold", -1);
	expect(char1.getResource("Gold")).toBe(2);
	expect(char2.getResource("Gold")).toBe(1);
    });

    it("get maps' keys correctly", function() {
	expect(GamesByEmail.Data.Base.getMapKeys(emptyMap)).toEqual([]);
	// Note: might the keys be produced in a different order?
	expect(GamesByEmail.Data.Base.getMapKeys(a1bHellocObjMap)).toEqual(["a", "b", "c"]);
    });

    it("get maps' values correctly", function() {
	expect(GamesByEmail.Data.Base.getMapValues(emptyMap)).toEqual([]);
	// Note: might the values be produced in a different order?
	expect(GamesByEmail.Data.Base.getMapValues(a1bHellocObjMap)).toEqual([1, "Hello", obj]);
    });

    it("shallow copies a map correctly", function() {
	var emptyMapCopy = GamesByEmail.Data.Base.shallowCopyMap(emptyMap);
	var a1bHellocObjMapCopy = GamesByEmail.Data.Base.shallowCopyMap(a1bHellocObjMap);

	expect(emptyMapCopy).toEqual(emptyMap);
	expect(a1bHellocObjMapCopy).toEqual(a1bHellocObjMap);
	
	obj.x = 3;

	expect(a1bHellocObjMap["c"]).toEqual({"x":3, "y":2});
	expect(a1bHellocObjMapCopy["c"]).toEqual({"x":3, "y":2});

	a1bHellocObjMap["c"] = "bye!";

	expect(a1bHellocObjMap["c"]).toEqual("bye!");
	expect(a1bHellocObjMapCopy["c"]).toEqual({"x":3, "y":2});
    });
});

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
	/* Array<String> */ function() {
	    GamesByEmail.Data.Resource.conditionalInitResources();
	    return GamesByEmail.Data.Base.getMapKeys(GamesByEmail.Data.Resource.map);
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
	    expect(alreadySeen[resource]).toBeUndefined();
	    alreadySeen[resource] = true;
	    expect(GamesByEmail.Data.Resource.getResource(resource).getName()).toBe(resource);
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
	if (initialLevels === undefined)
	    initialLevels = {};
	this.levels = GamesByEmail.Data.Base.shallowCopyMap(initialLevels);
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
	/* Integer */ function(/* String */ type, /* Integer */ amount)
	{
	    if (this.levels[type] === undefined)
		this.levels[type] = 0;
	    
	    var init = this.levels[type];
	    this.levels[type] = Math.min(Math.max(this.levels[type] + amount, 
						  GamesByEmail.Data.Character.DEFAULT_MIN),
					 GamesByEmail.Data.Character.DEFAULT_MAX);
	    return this.levels[type] - init;
	},
	getResource:
	/*
	 * Gets the amount of the requested resource the player possesses.
	 *
	 * Returns undefined for uninitialized resources.
	 */
	/* Integer or undefined */ function(/* String */ type)
	{
	    return this.levels[type];
	},
	getResources:
	/*
	 * Gets all resource names that are defined for this character.
	 */
	/* Array<String> */ function()
	{
	    return GamesByEmail.Data.Base.getMapKeys(this.levels);
	}
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
	expect(charNothing.getResource("Gold")).toBeUndefined();
	expect(charNothing.getResource("Magic")).toBeUndefined();
	expect(charNothing.getResource("Health")).toBeUndefined();

	expect(charGold2.getResource("Gold")).toBe(2);
	expect(charGold2.getResource("Magic")).toBeUndefined();
	expect(charGold2.getResource("Health")).toBeUndefined();

	expect(charGold4Magic1.getResource("Gold")).toBe(4);
	expect(charGold4Magic1.getResource("Magic")).toBe(1);
	expect(charGold4Magic1.getResource("Health")).toBeUndefined();
    });

    it("does not share levels it is initialized with", function() {
	var initLevels = {"Gold":1};
	var charG1 = new GamesByEmail.Data.Character(initLevels);
	initLevels["Magic"] = 5;
	expect(charG1.getResource("Magic")).toBeUndefined();
    });

    it("adjusts resources correctly, including minima", function() {
	expect(charNothing.addResource("Gold", 2)).toBe(2);
	expect(charNothing.getResource("Gold")).toBe(2);
	expect(charNothing.addResource("Magic", -2)).toBe(0);
	expect(charNothing.getResource("Magic")).toBe(0);
	expect(charNothing.getResource("Health")).toBeUndefined();

	expect(charGold2.addResource("Gold", -3)).toBe(-2);
	expect(charGold2.getResource("Gold")).toBe(0);
	expect(charGold2.addResource("Magic", 5)).toBe(5);
	expect(charGold2.getResource("Magic")).toBe(5);
	expect(charNothing.getResource("Health")).toBeUndefined();

	expect(charGold4Magic1.addResource("Gold", -3)).toBe(-3);
	expect(charGold4Magic1.getResource("Gold")).toBe(1);
	expect(charGold4Magic1.addResource("Magic", 2)).toBe(2);
	expect(charGold4Magic1.getResource("Magic")).toBe(3);
	expect(charNothing.getResource("Health")).toBeUndefined();
    });
    
    it("produces the right resources list", function() {
	expect(charNothing.getResources()).toEqual([]);
	expect(charGold2.getResources()).toEqual(["Gold"]);
	expect(charGold4Magic1.getResources()).toEqual(["Gold","Magic"]);
    });
});

/*
 * A mode of transportation available to a character. (Abstract!)
 */
Foundation.createClass(
    "GamesByEmail.Data.TransportMode",
    null,
    GamesByEmail.Data.Base,
    /*
     * Constructor.
     */
    function()
    {
	// Nothing to do.
    },
    {
	// Methods
	findCost:
	/*
	 * Find the cost of moving the character between the listed
	 * territories. ASSUME the character is in the
	 * fromTerritory. A cost of null indicates that it is not
	 * possible to connect the given territories with this mode of
	 * transport, REGARDLESS of whether or not the character can
	 * pay.
	 */
	/* Cost */ function(
	    /* Territory */ fromTerritory, 
	    /* Territory */ toTerritory, 
	    /* Character */ character)
	{
	    throw "unimplemented";
	},
	canConnect:
	/*
	 * Determine whether (regardless of whether the player can pay
	 * the price), this transport mode could move a player between
	 * the listed territories. ASSUME the character is in the
	 * fromTerritory.
	 */
	/* Boolean */ function(
	    /* Territory */ fromTerritory, 
	    /* Territory */ toTerritory, 
	    /* Character */ character)
	{
	    return this.findCost(fromTerritory, toTerritory, character) !== null;
	}
    },
    {
	// Static methods
    }
);

/*
 * The most basic mode of transportation: not moving!
 */
Foundation.createClass(
    "GamesByEmail.Data.Resting",
    GamesByEmail.Data.TransportMode,
    /*
     * Constructor.
     */
    function()
    {
	// Nothing to do.
    },
    {
	// Methods
	findCost:function(fromTerritory, toTerritory, character)
	{
	    if (fromTerritory.index === toTerritory.index)
		// For the moment, you can ALWAYS stay where you
		// are. (That's not necessarily true everywhere,
		// although some places where it's not true (e.g.,
		// most astral planes) probably don't matter.)
		return new GamesByEmail.Data.SimpleCost();
	    else
		return null;
	}
    },
    {
	// Static methods
    }
);

describe("TransportModes:", function() {
    // it("uses findCost as expected to implement canConnect", function() {
    // 	expect(new GamesByEmail.Data.Resting().canConnect(
    // 	    {index:4}, {index:4}, undefined)).toBe(true);
    // 	expect(new GamesByEmail.Data.Resting().canConnect(
    // 	    {index:2}, {index:2}, undefined)).toBe(true);
    // 	expect(new GamesByEmail.Data.Resting().canConnect(
    // 	    {index:2}, {index:4}, undefined)).not.toBe(true);
    // });

    describe("GamesByEmail.Data.Resting", function() {
	it("can find costs", function() {
	    new GamesByEmail.Data.SimpleCost();
	    // expect(new GamesByEmail.Data.SimpleCost().dominates(
	    // 	new GamesByEmail.Data.Resting().findCost(
	    // 	    {index:4}, {index:4}, undefined))).toBe(true);
	    // expect(new GamesByEmail.Data.SimpleCost().dominates(
	    // 	new GamesByEmail.Data.Resting().findCost(
	    // 	    {index:2}, {index:2}, undefined))).toBe(true);
	    // expect(new GamesByEmail.Data.SimpleCost().dominates(
	    // 	new GamesByEmail.Data.Resting().findCost(
	    // 	    {index:4}, {index:2}, undefined))).not.toBe(true);
	});
    });
});



// ============================================================
// Costs
// ============================================================

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
	/* true or String */ function(/* Character */ character) {
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
	 * Produce true if this dominates cost for the given
	 * character. I.e., this cost is WEAKLY more expensive than
	 * (really "at least as expensive as") cost along all
	 * dimensions.
	 *
	 * PRECONDITION: this.canPay(character) && cost.canPay(character)
	 *
	 * (Best to test against true (... === true), since we may
	 * decide later to have some other return value on false?)
	 */
	dominates:
	/* Boolean */ function(/* Cost */ cost, /* Character */ character)
	{
	    // NOTE: testing with SimpleCost only for now.
	    //
	    // However, any other cost that has a working "pay"
	    // function should be fine.
	    var char1 = character.deepCopy();
	    var char2 = character.deepCopy();
	    
	    this.pay(char1);
	    cost.pay(char2);

	    var result = true;
	    char1.getResources().forEach(function(key) {
		var c1 = char1.getResource(key);
		var c2 = char2.getResource(key) === undefined ?
		    0 : char2.getResource(key);
		result = result && (c1 <= c2);
	    });
	    
	    char2.getResources().forEach(function(key) {
		var c1 = char1.getResource(key) === undefined ?
		    0 : char1.getResource(key);
		var c2 = char2.getResource(key);
		result = result && (c1 <= c2);
	    });
	    
	    return result;
	},
	/*
	 * An array of all the types of resources relevant to this cost.
	 */
	getResourceTypes:
	/* Array<String> */ function() { throw "unimplemented"; }
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
	if (mandatoryResources === undefined)
	    mandatoryResources = {};

	if (uptoResources === undefined)
	    uptoResources = {};

	var mr = GamesByEmail.Data.Base.shallowCopyMap(mandatoryResources); // need local copies accessible inside closures.
	var ur = GamesByEmail.Data.Base.shallowCopyMap(uptoResources);

	GamesByEmail.Data.Base.getMapKeys(ur).forEach(
	    function(key) {
		if (mr[key] === undefined)
		    mr[key] = 0;
	    });

	GamesByEmail.Data.Base.getMapKeys(mr).forEach(
	    function(key) {
		if (ur[key] === undefined)
		    ur[key] = 0;
	    });

	this.mandatoryResources = mr;
	this.uptoResources = ur;
    },
    {
	// Virtual methods
	canPay:function(character) 
	{
	    var result = true;
	    var success = true;
	    var mr = this.mandatoryResources;
	    var char2 = character.deepCopy();
	    GamesByEmail.Data.Base.getMapKeys(mr).forEach(
		function(key) {
		    // This is a COST. So, add the cost's negation.
		    var effAmt = char2.addResource(key, -mr[key]);
		    if (success && (effAmt != -mr[key])) {
			success = false;
			result = key;
		    }
		});
	    return result;
	},
	pay:function(character)
	{
	    // TODO: think about what happens if a person presently
	    // has 4 magic and 4 willpower and the cost of something
	    // is 4 magic and 1 willpower. Can they pay this? Or, if
	    // they presently have 5 magic and 5 willpower, how much
	    // magic/willpower should they end up with? (FIX canPay at
	    // same time.)
	    
	    // TODO: assert that character CAN pay.

	    var ur = this.uptoResources;
	    GamesByEmail.Data.Base.getMapKeys(ur).forEach(
		function(key) {
		    // This is a COST. So, add the cost's negation.
		    character.addResource(key, -ur[key]);
		});
	},
	addSummaryHtml:function(htmlBuilder)
	{
	    // TODO
	},
	addFullHtml:function(htmlBuilder)
	{
	    // TODO
	},
	isPositive:function()
	{
	    var result = false;
	    var ur = this.uptoResources;
	    GamesByEmail.Data.Base.getMapKeys(ur).forEach(
		function(key) {
		    result = result || (ur[key] > 0);
		});
	    return result;
	},
	isNegative:function()
	{
	    var result = false;
	    var ur = this.uptoResources;
	    GamesByEmail.Data.Base.getMapKeys(ur).forEach(
		function(key) {
		    result = result || (ur[key] < 0);
		});
	    return result;
	},
    },
    {
	// Static methods
	makeStrict:
	/*
	 * Produce a simple cost where the mandatory and upto fields match.
	 *
	 * Consumes a resource name to amount map as with the constructor.
	 */
	/* SimpleCost */ function(/* Map<String -> Integer> */ amts) {
	    return new GamesByEmail.Data.SimpleCost(amts, amts);
	},
	makeUnrestricted:
	/*
	 * Produce a simple cost that can always be paid (all
	 * mandatory costs are 0).
	 *
	 * Consumes a resource name to amount map as with the constructor.
	 */
	/* SimpleCost */ function(/* Map<String -> Integer> */ amts) {
	    return new GamesByEmail.Data.SimpleCost({}, amts);
	},
	makePaymentChecker:
	/*
	 * Produce a simple cost that has no effect when paid (only
	 * the mandatory costs are non-0).
	 *
	 * Consumes a resource name to amount map as with the constructor.
	 */
	/* SimpleCost */ function(/* Map<String -> Integer> */ amts) {
	    return new GamesByEmail.Data.SimpleCost(amts, {});
	}
    }
);

describe("GamesByEmail.Data.SimpleCost", function() {
    // Note: need a +, a -, a +/-, and a neither.
    var scG1M3;      // +
    var scG0un2Hn1;  // -
    var scMn1u3;     // +
    var scG2un2;     // -

    var scG1Mn1;     // +-
    var scG1u0Mn1u0; // neither

    var charAll100;
    var charAll2;

    beforeEach(function() {
	charAll100 = new GamesByEmail.Data.Character({"Strength":100, "Gold":100, "Magic":100, "Health":100});
	charAll2 = new GamesByEmail.Data.Character({"Strength":2, "Gold":2, "Magic":2, "Health":2});

	scG1M3 = new GamesByEmail.Data.SimpleCost(
	    {"Gold":1, "Magic":3},
	    {"Gold":1, "Magic":3});
	scG0un2Hn1 = new GamesByEmail.Data.SimpleCost(
	    {"Gold":0, "Health":-1},
	    {"Gold":-2, "Health":-1});
	scMn1u3 = new GamesByEmail.Data.SimpleCost(
	    {"Magic":-1},
	    {"Magic":3});
	scG2un2 = new GamesByEmail.Data.SimpleCost(
	    {"Gold":2},
	    {"Gold":-2});

	scG1Mn1 = GamesByEmail.Data.SimpleCost.makeStrict(
	    {"Gold":1, "Magic":-1});
	scG1u0Mn1u0 = GamesByEmail.Data.SimpleCost.makePaymentChecker(
	    {"Gold":1, "Magic":-1});
    });

    describe("can test domination", function() {
	// Not testing mandatory levels, since they are irrelevant to
	// domination.

	var makeSC = GamesByEmail.Data.SimpleCost.makeUnrestricted;

	// Desired tests:
	it("when it dominates but never ties", function() {
	    expect(makeSC({"Strength":5, "Gold":2, "Magic":-1, "Health":0}).
		   dominates(makeSC({"Strength":2, "Gold":-1, "Magic":-3, "Health":-2}), charAll100)).
		toBe(true);
	});

	it("when it dominates but always ties", function() {
	    expect(makeSC({"Strength":5, "Gold":2, "Magic":-1, "Health":0}).
		   dominates(makeSC({"Strength":5, "Gold":2, "Magic":-1, "Health":0}), charAll100)).
		toBe(true);
	});

	it("when it dominates but sometimes ties", function() {
	    expect(makeSC({"Strength":5, "Gold":2, "Magic":-1, "Health":0}).
		   dominates(makeSC({"Strength":-1, "Gold":1, "Magic":-1, "Health":0}), charAll100)).
		toBe(true);
	});

	it("when it does not dominate, sometimes wins, sometimes loses", function() {
	    expect(makeSC({"Strength":5, "Gold":2, "Magic":-1, "Health":0}).
		   dominates(makeSC({"Strength":-1, "Gold":4, "Magic":-1, "Health":-3}), charAll100)).
		not.toBe(true);
	});

	it("when it does not dominate via an undefined field in me/you", function() {
	    expect(makeSC({}).
		   dominates(makeSC({"Strength":-1}), charAll100)).
		toBe(true);
	    expect(makeSC({}).
		   dominates(makeSC({"Strength":0}), charAll100)).
		toBe(true);
	    expect(makeSC({"Strength":0}).
		   dominates(makeSC({}), charAll100)).
		toBe(true);
	    expect(makeSC({"Strength":1}).
		   dominates(makeSC({}), charAll100)).
		toBe(true);
	});

	it("when it does not dominate via an undefined field in me/you", function() {
	    expect(makeSC({"Strength":-1}).
		   dominates(makeSC({}), charAll100)).
		not.toBe(true);
	    expect(makeSC({}).
		   dominates(makeSC({"Strength":1}), charAll100)).
		not.toBe(true);
	});
	
	it("when it dominates despite running out of resources to charge in some cases", function() {
	    expect(makeSC({"Strength":5, "Gold":3, "Magic":-1, "Health":0}).
		   dominates(makeSC({"Strength":1, "Gold":6, "Magic":-1, "Health":0}), charAll2)).
		toBe(true);
	});

	it("when it dominates BECAUSE it runs out of resources to charge in some cases", function() {
	    expect(makeSC({"Strength":2, "Gold":3, "Magic":-1, "Health":0}).
		   dominates(makeSC({"Strength":4, "Gold":6, "Magic":-1, "Health":0}), charAll2)).
		toBe(true);
	});

	// This CANNOT happen, since we test only WEAK domination.
	// it("when it does not dominate because it runs out of resources to charge in some cases", function() {
	//     expect(makeSC({"Strength":5, "Gold":1, "Magic":-1, "Health":0}).
	// 	   dominates(makeSC({"Strength":3, "Gold":1, "Magic":-1, "Health":0}), charAll2)).
	// 	not.toBe(true);
	// });
    });

    describe("can be constructed appropriately", function() {
	it("with missing parameters", function() {
	    var sc = new GamesByEmail.Data.SimpleCost({"Gold":2});
	    expect(sc.mandatoryResources).toEqual({"Gold":2});
	    expect(sc.uptoResources).toEqual({"Gold":0});

	    var sc = new GamesByEmail.Data.SimpleCost();
	    expect(sc.mandatoryResources).toEqual({});
	    expect(sc.uptoResources).toEqual({});
	});

	it("with supplied values for mandatory/upto (whitebox)", function() {
	    expect(scG1M3.mandatoryResources).toEqual({"Gold":1, "Magic":3});
	    expect(scG1M3.uptoResources).toEqual({"Gold":1, "Magic":3});
	    
	    expect(scG0un2Hn1.mandatoryResources).toEqual({"Gold":0, "Health":-1});
	    expect(scG0un2Hn1.uptoResources).toEqual({"Gold":-2, "Health":-1});
	    
	    expect(scMn1u3.mandatoryResources).toEqual({"Magic":-1});
	    expect(scMn1u3.uptoResources).toEqual({"Magic":3});
	    
	    expect(scG2un2.mandatoryResources).toEqual({"Gold":2});
	    expect(scG2un2.uptoResources).toEqual({"Gold":-2});
	});

	it("with values missing for mandatory or upto", function() {
	    var sc1 = new GamesByEmail.Data.SimpleCost(
		{"Strength":2, "Willpower":2},
		{});
	    var sc2 = new GamesByEmail.Data.SimpleCost(
		{},
		{"Strength":2, "Willpower":2});
	    var sc3 = new GamesByEmail.Data.SimpleCost(
		{"Gold":1, "Magic":2},
		{"Magic":1, "Health":-4});

	    expect(sc1.mandatoryResources).toEqual({"Strength":2, "Willpower":2});
	    expect(sc1.uptoResources).toEqual({"Strength":0, "Willpower":0});

	    expect(sc2.mandatoryResources).toEqual({"Strength":0, "Willpower":0});
	    expect(sc2.uptoResources).toEqual({"Strength":2, "Willpower":2});

	    expect(sc3.mandatoryResources).toEqual({"Gold":1, "Magic":2, "Health":0});
	    expect(sc3.uptoResources).toEqual({"Gold":0, "Magic":1, "Health":-4});
	});

	it("using makeStrict", function() {
	    var sc1 = GamesByEmail.Data.SimpleCost.makeStrict(
		{"Strength":2, "Willpower":2});
	    var sc2 = GamesByEmail.Data.SimpleCost.makeStrict(
		{"Gold":-3, "Health":-2});

	    expect(sc1.mandatoryResources).toEqual({"Strength":2, "Willpower":2});
	    expect(sc1.uptoResources).toEqual({"Strength":2, "Willpower":2});

	    expect(sc2.mandatoryResources).toEqual({"Gold":-3, "Health":-2});
	    expect(sc2.uptoResources).toEqual({"Gold":-3, "Health":-2});
	});
	
	it("using makeUnrestricted", function() {
	    var sc1 = GamesByEmail.Data.SimpleCost.makeUnrestricted(
		{"Strength":2, "Willpower":2});
	    var sc2 = GamesByEmail.Data.SimpleCost.makeUnrestricted(
		{"Gold":-3, "Health":-2});

	    expect(sc1.mandatoryResources).toEqual({"Strength":0, "Willpower":0});
	    expect(sc1.uptoResources).toEqual({"Strength":2, "Willpower":2});

	    expect(sc2.mandatoryResources).toEqual({"Gold":0, "Health":0});
	    expect(sc2.uptoResources).toEqual({"Gold":-3, "Health":-2});
	});

	it("using makePaymentChecker", function() {
	    var sc1 = GamesByEmail.Data.SimpleCost.makePaymentChecker(
		{"Strength":2, "Willpower":2});
	    var sc2 = GamesByEmail.Data.SimpleCost.makePaymentChecker(
		{"Gold":-3, "Health":-2});

	    expect(sc1.mandatoryResources).toEqual({"Strength":2, "Willpower":2});
	    expect(sc1.uptoResources).toEqual({"Strength":0, "Willpower":0});

	    expect(sc2.mandatoryResources).toEqual({"Gold":-3, "Health":-2});
	    expect(sc2.uptoResources).toEqual({"Gold":0, "Health":0});
	});
    });
    
    it("can test for payment", function() {
	// TODO: need to test with meaningful maxima on resources,
	// once we have meaningful maxima on resources! (That only
	// matters w/negative mandatory costs, however.)

	var character = new GamesByEmail.Data.Character({"Gold":2, "Magic":3});
	expect(scG1M3.canPay(character)).toBe(true);
	// Doesn't change the character, however!
	expect(character.getResource("Gold")).toBe(2);
	expect(character.getResource("Magic")).toBe(3);

	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":2});
	expect(scG1M3.canPay(character)).not.toBe(true);

	character = new GamesByEmail.Data.Character({"Gold":0, "Magic":4});
	expect(scG1M3.canPay(character)).not.toBe(true);

	character = new GamesByEmail.Data.Character({"Gold":5, "Magic":4});
	expect(scG1M3.canPay(character)).toBe(true);

	// Undefined doesn't get counted as high enough.
	character = new GamesByEmail.Data.Character({"Magic":4});
	expect(scG1M3.canPay(character)).not.toBe(true);




	character = new GamesByEmail.Data.Character({"Gold":2, "Health":3});
	expect(scG0un2Hn1.canPay(character)).toBe(true);

	character = new GamesByEmail.Data.Character({});
	expect(scG0un2Hn1.canPay(character)).toBe(true);


	// Mandatory is what matters, not upto.
	character = new GamesByEmail.Data.Character({"Magic":2});
	expect(scMn1u3.canPay(character)).toBe(true);

	character = new GamesByEmail.Data.Character({});
	expect(scMn1u3.canPay(character)).toBe(true);
    });

    it("can extract payment", function() {
	var character;

	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":3, "Health":1});
	scG1M3.pay(character);
	expect(character.getResource("Gold")).toBe(1);
	expect(character.getResource("Magic")).toBe(0);
	expect(character.getResource("Health")).toBe(1);

	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":3, "Health":1});
	scG0un2Hn1.pay(character);
	expect(character.getResource("Gold")).toBe(4);
	expect(character.getResource("Magic")).toBe(3);
	expect(character.getResource("Health")).toBe(2);

	// Impact on undefined, negative
	character = new GamesByEmail.Data.Character({"Magic":3, "Health":1});
	scG0un2Hn1.pay(character);
	expect(character.getResource("Gold")).toBe(2);
	expect(character.getResource("Magic")).toBe(3);
	expect(character.getResource("Health")).toBe(2);

	// Full upto cost
	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":4, "Health":1});
	scMn1u3.pay(character);
	expect(character.getResource("Gold")).toBe(2);
	expect(character.getResource("Magic")).toBe(1);
	expect(character.getResource("Health")).toBe(1);

	// Part upto cost
	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":2, "Health":1});
	scMn1u3.pay(character);
	expect(character.getResource("Gold")).toBe(2);
	expect(character.getResource("Magic")).toBe(0);
	expect(character.getResource("Health")).toBe(1);

	// Impact on undefined, positive
	character = new GamesByEmail.Data.Character({"Gold":2, "Health":1});
	scMn1u3.pay(character);
	expect(character.getResource("Gold")).toBe(2);
	expect(character.getResource("Magic")).toBe(0);
	expect(character.getResource("Health")).toBe(1);

	// Part upto cost
	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":2, "Health":1});
	scG1Mn1.pay(character);
	expect(character.getResource("Gold")).toBe(1);
	expect(character.getResource("Magic")).toBe(3);
	expect(character.getResource("Health")).toBe(1);

	// No effect from pay-checker
	character = new GamesByEmail.Data.Character({"Gold":2, "Magic":2, "Health":1});
	scG1u0Mn1u0.pay(character);
	expect(character.getResource("Gold")).toBe(2);
	expect(character.getResource("Magic")).toBe(2);
	expect(character.getResource("Health")).toBe(1);
    });

    it("can report positive correctly", function() {
	expect(scG1M3.isPositive()).toBe(true);
	expect(scG0un2Hn1.isPositive()).not.toBe(true);
	expect(scMn1u3.isPositive()).toBe(true);
	expect(scG2un2.isPositive()).not.toBe(true);

	expect(scG1Mn1.isPositive()).toBe(true);
	expect(scG1u0Mn1u0.isPositive()).not.toBe(true);
    });

    it("can report negative correctly", function() {
	expect(scG1M3.isNegative()).not.toBe(true);
	expect(scG0un2Hn1.isNegative()).toBe(true);
	expect(scMn1u3.isNegative()).not.toBe(true);
	expect(scG2un2.isNegative()).toBe(true);

	expect(scG1Mn1.isNegative()).toBe(true);
	expect(scG1u0Mn1u0.isNegative()).not.toBe(true);
    });

    // it("can report minima correctly", function() {
    // 	expect(scG1M3.getMin("Gold")).toBe(1);
    // 	expect(scG1M3.getMin("Magic")).toBe(3);
    // 	expect(scG1M3.getMin("Health")).toBe(0);

    // 	// On gold: Mandatory is max; upto is min.
    // 	expect(scG0un2Hn1.getMin("Gold")).toBe(-2);
    // 	expect(scG0un2Hn1.getMin("Health")).toBe(-1);
    // 	expect(scG0un2Hn1.getMin("Magic")).toBe(0);

    // 	// On magic: Mandatory is min; upto is max.
    // 	expect(scMn1u3.getMin("Magic")).toBe(0);
    // 	expect(scMn1u3.getMin("Health")).toBe(0);

    // 	expect(scG2un2.getMin("Gold")).toBe(-2);
    // 	expect(scG2un2.getMin("Health")).toBe(0);
    // });

    // it("can report maxima correctly", function() {
    // 	expect(scG1M3.getMax("Gold")).toBe(1);
    // 	expect(scG1M3.getMax("Magic")).toBe(3);
    // 	expect(scG1M3.getMax("Health")).toBe(0);

    // 	// On gold: Mandatory is max; upto is min.
    // 	expect(scG0un2Hn1.getMax("Gold")).toBe(0);
    // 	expect(scG0un2Hn1.getMax("Health")).toBe(-1);
    // 	expect(scG0un2Hn1.getMax("Magic")).toBe(0);

    // 	// On magic: Mandatory is min; upto is max.
    // 	expect(scMn1u3.getMax("Magic")).toBe(3);
    // 	expect(scMn1u3.getMax("Health")).toBe(0);

    // 	expect(scG2un2.getMax("Gold")).toBe(0);
    // 	expect(scG2un2.getMax("Health")).toBe(0);
    // });
});
