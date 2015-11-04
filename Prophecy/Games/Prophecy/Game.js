// WOLF (2015/10/24): Need to do some design work and decide what the
// major components are. Characters are obvious (need to possess
// abilities, items, have willpower/strength and magic/health,
// etc.). A character presumably also has a location. That location
// should index into the territories or BE a territory, but note that
// the default territories are not suitable for deep copying.

// Next steps: Highlight every territory that's a legal move (so that
// clicking other things is obviously a non-action; in that case, no
// need for an error message there).

// Board data, including characters and resources. TODO!!!
//Foundation.includeScripts("Data.js"); 


/* 
 * A Prophecy Piece knows (for the moment!) its location and (Player)
 * owner. It can display and serialize itself.
 * 
 * A location of -1 indicates an unplaced piece. An owner of -1
 * indicates an unspecified owner.
 *
 * Locations correspond to territory indexes.
 */
Foundation.createClass
(
    "GamesByEmail.ProphecyPiece",
    /*
     * Produce a piece at the given initial location and with the
     * given owner (defaults to unspecified location/owner).
     */
    /* Parameters: (Optional) Natural, (Optional) Natural */
    function(initLoc, owner)
    {
	if (initLoc === undefined)
	    initLoc = -1;
	if (owner === undefined)
	    owner = -1;
	// Class constructor.
	this.location = initLoc;  // Territory number where the piece is
	this.owner = owner;       // Player who owns this territory.
    },
    {
	// Methods and properties.
	getInnerHtml:
	/*
	 * Produce an HTML String representing the piece sitting in
	 * its curent territory. Nothing if the piece is unplaced or
	 * unowned.
	 *
	 * Difficult to test. Should just call across to getInnerHtmlPrim
	 */
	/* String */
	function(/* Game */ game, /* Territories */ territories)
	{
	    if (this.location >= 0 && this.owner >= 0)
	    {
		var screenRect = territories.length > this.location ? 
		    territories[this.location].polygon.rectangle :
		    undefined;
		var clipRect = game.getPieceRect(this.owner);
		return GamesByEmail.ProphecyPiece.getInnerHtmlPrim(game.getPieceSrc(), screenRect, clipRect);
	    }
	    else
		return "";
	},
	appendHtml:
	/*
	 * Append any durable (always-on) HTML representing this piece.
	 *
	 * May want to refactor to eliminate this?
	 */
	/* Foundation.StringBuilder */ 
	function(/* Foundation.StringBuilder */ htmlBuilder, /* ProphecyGame */ game, /* Territories */ territories)
	{
	    if (this.location >= 0)
	    {
		// Actually appears on the board.
	    }
	    return htmlBuilder;
	},
	getString:
	/*
	 * Serialize the piece.
	 */
	/* String */
	function()
	{
	    // Produce the serialization of the pieces.
	    var string = this.owner + "," + this.location;
	    return string;
	},
	setString:
	/*
	 * Deserialize the piece.
	 */
	/* void */
	function(/* String */ str)
	{
	    var strings = str.split(',');
	    if (strings.length >= 2)
		this.location = parseInt(strings[1]);
	    else
		this.location = -1;
	    if (strings.length >= 1)
		this.owner = parseInt(strings[0]);
	    else
		this.location = -1;
	},
    },
    {
	// This will hold our static methods and properties.

	// the resourcePack is a collection of information
	// used throughout the class.
	//resourcePack:{
	//
        //}
	getInnerHtmlPrim:
	/*
	 * Produce an HTML String representing the piece sitting in
	 * its curent territory, as defined by the screen rectangle
	 * for the (location in the) territory and piece rectangle for
	 * the piece's clipping region, given the HTML for piece's
	 * (possibly composite, i.e., containing many pieces) image
	 * itself.
	 * 
	 * If screenRect or pieceRect is undefined, produce a piece in
	 * the upper-left.
	 */
	/* String */
	function(
	    /* String */ pieceSrc,
	    /* (Optional) Foundation.Rectangle */ screenRect, 
	    /* (Optional) Foundation.Rectangle */ clipRect)
	{
	    var html = "";
	    if (screenRect && clipRect)
		    html += "<img src=\""+pieceSrc.htmlEncode()+"\" style=\""+GamesByEmail.positionImage(null,screenRect,clipRect).htmlEncode()+";z-index:800\">";
		else
		    html += "<img src=\""+pieceSrc.htmlEncode()+"\" style=\"position:absolute;top:0;left:0;visibility:hidden;z-index:800\">";
	    return html;
	},
    }
);


describe("ProphecyPiece", function() {
    var pieceNowhere;
    var pieceLoc2Noone;
    var pieceLoc1Owner2;
    var pieceLoc4Owner1;
    
    beforeEach(function() {
	pieceNowhere = new GamesByEmail.ProphecyPiece();
	pieceLoc2Noone = new GamesByEmail.ProphecyPiece(2);
	pieceLoc1Owner2 = new GamesByEmail.ProphecyPiece(1,2);
	pieceLoc4Owner1 = new GamesByEmail.ProphecyPiece(4,1);
    });

    it("serializes with getString", function() {
	expect(pieceNowhere.getString()).toEqual("-1,-1");
	expect(pieceLoc2Noone.getString()).toEqual("-1,2");
	expect(pieceLoc1Owner2.getString()).toEqual("2,1");
	expect(pieceLoc4Owner1.getString()).toEqual("1,4");

	// And can change properly.
	piece = new GamesByEmail.ProphecyPiece(1,2);
	expect(piece.getString()).toEqual("2,1");

	piece.owner = 7;
	piece.location = 3;
	expect(piece.getString()).toEqual("7,3");
	piece.setString("1,2");
    });

    it("deserializes with setString", function() {
	var piece = new GamesByEmail.ProphecyPiece();

	piece.setString("-1,-1");
	expect(piece.owner).toEqual(-1);
	expect(piece.location).toEqual(-1);

	piece = new GamesByEmail.ProphecyPiece();
	piece.setString("2,-1");
	expect(piece.owner).toEqual(2);
	expect(piece.location).toEqual(-1);

	piece = new GamesByEmail.ProphecyPiece();
	piece.setString("1,2");
	expect(piece.owner).toEqual(1);
	expect(piece.location).toEqual(2);

	piece = new GamesByEmail.ProphecyPiece();
	piece.setString("4,1");
	expect(piece.owner).toEqual(4);
	expect(piece.location).toEqual(1);

	// And can change properly.
	piece = new GamesByEmail.ProphecyPiece();
	piece.setString("1,2");
	expect(piece.owner).toEqual(1);
	expect(piece.location).toEqual(2);

	piece.setString("4,1");
	expect(piece.owner).toEqual(4);
	expect(piece.location).toEqual(1);
    });

    it("produces appropriate inner html", function() {
	var rect1 = new Foundation.Rectangle(0, 0, 10, 20);
	var rect2 = new Foundation.Rectangle(5, 10, 40, 50);
	var rect3 = new Foundation.Rectangle(55, 11, 5, 25);
	var pieceSrc = "CONSPICIOUS TEXT";

	var html;
	var screenRect = rect1;
	var clipRect = rect2;

	html = "<img src=\"" + pieceSrc.htmlEncode() + "\" style=\"" + 
	    GamesByEmail.positionImage(null,screenRect,clipRect).htmlEncode()+";z-index:800\">";
	expect(GamesByEmail.ProphecyPiece.getInnerHtmlPrim(pieceSrc, screenRect, clipRect))
	    .toEqual(html);

	var screenRect = rect2;
	var clipRect = rect3;

	html = "<img src=\"" + pieceSrc.htmlEncode() + "\" style=\"" + 
	    GamesByEmail.positionImage(null,screenRect,clipRect).htmlEncode()+";z-index:800\">";
	expect(GamesByEmail.ProphecyPiece.getInnerHtmlPrim(pieceSrc, screenRect, clipRect))
	    .toEqual(html);

	html = "<img src=\""+pieceSrc.htmlEncode()+"\" style=\"position:absolute;top:0;left:0;visibility:hidden;z-index:800\">";
	expect(GamesByEmail.ProphecyPiece.getInnerHtmlPrim(pieceSrc, undefined, undefined))
	    .toEqual(html);
	expect(GamesByEmail.ProphecyPiece.getInnerHtmlPrim(pieceSrc, rect1, undefined))
	    .toEqual(html);
	expect(GamesByEmail.ProphecyPiece.getInnerHtmlPrim(pieceSrc, undefined, rect1))
	    .toEqual(html);
    });
});

Foundation.createClass
(
    "GamesByEmail.ProphecyPieces",
    Array,
    /*
     * Construct a ProphecyPieces array.
     */
    function()
    {
	// Class constructor.
	this.length=0;
    },
    {
	// Methods and properties.
	appendHtml:
	/*
	 * Append any durable (always-on) HTML representing all pieces.
	 */
	/* Foundation.StringBuilder */
	function(/* Foundation.StringBuilder */ htmlBuilder, /* ProphecyGame */ game, /* Territories */ territories)
	{
	    htmlBuilder.append("<div id=\"" + game.elementId("pieces") + 
			       "\" style=\"position:absolute;width:" + game.board.image.size.x + "; height:" + game.board.image.size.y + 
			       ";overflow:hidden;z-index:800\">");
	    for (var i = 0; i < this.length; i++) 
	    {
		this[i].appendHtml(htmlBuilder, game, territories);
	    }
	    htmlBuilder.append("</div>");
	    return htmlBuilder;
	},
	update:function(game, territories)
	{
	    var div = game.getElement("pieces");
	    var html = "";
	    for (var i = 0; i < this.length; i++) 
	    {
		html += this[i].getInnerHtml(game, territories);
	    }
	    game.setInnerHtml(div, html);
	},
	getString:function()
	{
	    // Produce the serialization of the pieces.
	    var string = "";
	    var first = true;
	    for (var i = 0; i < this.length; i++) {
		string += (first ? "" : "|") + this[i].getString()
		first = false;
	    }
	    return string;
	},
	setString:function(str)
	{
	    this.length = 0; // clear the existing pieces.

	    var strings = str.split('|');
	    for (var i=0;i<strings.length;i++) {
		var p = new GamesByEmail.ProphecyPiece();
		p.setString(strings[i]);
		this[this.length] = p;
	    }
	},
	addPiece:function(piece)
	{
	    this[this.length] = piece;
	}
    },
    {
	// This will hold our static methods and properties.

	// the resourcePack is a collection of information
	// used throughout the class.
	//resourcePack:{
	//
        //}
    }
);


describe("ProphecyPieces", function() {
    var pieceNowhere;
    var pieceLoc2Noone;
    var pieceLoc1Owner2;
    var pieceLoc4Owner1;

    var piecesEmpty;
    var pieces1;
    var pieces2;
    
    beforeEach(function() {
	pieceNowhere = new GamesByEmail.ProphecyPiece();
	pieceLoc2Noone = new GamesByEmail.ProphecyPiece(2);
	pieceLoc1Owner2 = new GamesByEmail.ProphecyPiece(1,2);
	pieceLoc4Owner1 = new GamesByEmail.ProphecyPiece(4,1);

	// piecesEmpty is empty.

	pieces1 = new GamesByEmail.ProphecyPieces();
	pieces1.addPiece(pieceLoc1Owner2);

	pieces2 = new GamesByEmail.ProphecyPieces();
	pieces2.addPiece(pieceLoc2Noone);
	pieces2.addPiece(pieceLoc4Owner1);
    });

    it("performs addPiece correctly", function() {
	// TODO: decide if toBe is the right thing here or if I need
	// equality testing. (Seems like the latter.)

	expect(pieces1.length).toBe(1);
	expect(pieces1[0]).toBe(pieceLoc1Owner2);

	expect(pieces2.length).toBe(2);
	expect(pieces2[0]).toBe(pieceLoc2Noone);
	expect(pieces2[1]).toBe(pieceLoc4Owner1);

	var p = new GamesByEmail.ProphecyPiece(3,3);
	pieces2.addPiece(p);
	expect(pieces2.length).toBe(3);
	expect(pieces2[0]).toBe(pieceLoc2Noone);
	expect(pieces2[1]).toBe(pieceLoc4Owner1);
	expect(pieces2[2]).toBe(p);
    });

    it("serializes with getString", function() {
	expect(pieces1.getString()).toEqual(pieceLoc1Owner2.getString());
	expect(pieces2.getString()).toEqual(pieceLoc2Noone.getString() + "|" + 
					   pieceLoc4Owner1.getString());

	var p = new GamesByEmail.ProphecyPiece(3,3);
	pieces2.addPiece(p);
	expect(pieces2.getString()).toEqual(pieceLoc2Noone.getString() + "|" + 
					   pieceLoc4Owner1.getString() + "|" +
					   "3,3");

    });

    it("deserializes with setString", function() {
	var pieces = new GamesByEmail.ProphecyPieces();

	pieces.setString(pieceNowhere.getString() + "|" + pieceLoc2Noone.getString());
	expect(pieces.length).toBe(2);
	expect(pieces[0].getString()).toEqual(pieceNowhere.getString());
	expect(pieces[1].getString()).toEqual(pieceLoc2Noone.getString());

	pieces.setString(pieceLoc1Owner2.getString());
	expect(pieces.length).toBe(1);
	expect(pieces[0].getString()).toEqual(pieceLoc1Owner2.getString());
    });

    // Not easy to test b/c of game/territories
    //it("produces appropriate static html with appendHtml", function() {
    //
    //});

    it("udpates inner html appropriately", function() {
	// TODO: mock a game object that accepts getElement, expects
	// "pieces" and produces an object that is identifiable later.
	//
	// mock object must also accept setInnerHtml with the object
	// produced earlier and appropriate html for the pieces.
    });
});

Foundation.createClass
(
    "GamesByEmail.ProphecyGame",
    GamesByEmail.Game, // This is the base class that we are extending (the tutorial for now).
    /*
     * Constructor.
     */
    function()
    {
	// This is our class contructor.
	this.pieces = new GamesByEmail.ProphecyPieces();
	this.winningLocation = 12; // Magic Wilderness
    },
    {
	// This will hold our methods and properties.
	checkForWin:
	/*
	 * Return true if the player corresponding to the provided
	 * piece has won. The current player's piece is used if piece
	 * is not provided.
	 */
	/* Boolean */
	function(/* (Optional) ProphecyPiece */ piece)
	{
	    // Stub
	    if (piece === undefined)
		piece = this.getCurrentPiece();
	    return piece.location === this.winningLocation;
	},
	sendMove:
	/*
	 * Commit to and communicate the move to the server.
	 *
	 * TODO: update based on GamesByEmail.Game sendMove documentation.
	 */
	/* TODO (return type? void?) */
	function()
	{
	    this.clearMouseEvents();
	    this.info.board = this.getString(); // serialize into the board slot
	    var opponent=this.player.team.nextTeam();
	    if (this.checkForWin())
		this.setEnded(this.player.team);
	    else
	    {
		opponent.setExclusiveTurn();
	    }
	    return Super.sendMove();
	},
	territoryAtPoint:
	/*
	 * Produce the territory at the given point on the screen.
	 */
	/* Territory */ function(/* TODO */ point)
	{
	    return this.territories.findAtPoint(point);
	},
	getCurrentPiece:
	/*
	 * Get the current player's piece.
	 */
	/* ProphecyPiece */ function()
	{
	    var playerIndex = this.player.team.color;
	    return this.pieces[playerIndex];
	},
	getCurrentTerritory:
	/*
	 * Produce the territory occupied by the current player or
	 * null (if no single, clear current territory).
	 */
	/* Territory */ function(/* ProphecyPiece */ piece)
	{
	    if (piece === undefined)
		piece = this.getCurrentPiece();
	    if (piece.location >= 0)
		return this.territories[piece.location];
	    else
		return null;
	},
	mouseUp:function(screenPoint)
	{
	    // TODO: continue function signatures from here.
	    
	    // First, undo a move if we have already made one.
	    if (this.madeMove)
		this.undo();

	    var toTerritory=this.territoryAtPoint(screenPoint);
	    var piece=this.getCurrentPiece();
	    var fromTerritory=this.getCurrentTerritory(piece);
	    if (toTerritory && fromTerritory)
	    {
		if (GamesByEmail.ProphecyGame.areTerritoriesAdjacent(fromTerritory, toTerritory))
		{
		    piece.location = toTerritory.index;
		    this.madeMove = true;
		    this.readyToSend = true;
		    this.update();
		}
		else
		{
		    // TODO: Handle the case where the territories
		    // exist but are not adjacent.
		}
	    }
	    else
	    {
		// TODO: Handle case where there either is no to
		// territory or worse no from territory (i.e., no
		// location for the current piece).
	    }
	},
	itsYourTurnHtml:function(resourceName)
	{
	    // Make sure to only hook movement if we have not placed a piece yet.
	    if (!this.madeMove)
	    {
		// Nothing to do here either!
	    }
	    else
	    {
		// Nothing to do here.
	    }
	    this.onLeftMouseUp="mouseUp";
	    return Super.itsYourTurnHtml(resourceName); // Call the parent class' itsYourTurnHtml method.
	},
	appendBoardHtml:function(htmlBuilder)
	{
	    this.pieces.appendHtml(htmlBuilder, this, this.territories);
	    Super.appendBoardHtml(htmlBuilder);
	    return htmlBuilder;
	},
	synch:function()
	{
	    Super.synch(); // Call the parent class' synch method to do whatever it does.
	    this.setString(this.info.board);
	},
	initialize:function(numPlayers,turnTeamIndex)
	{
	    var test=false;
	    //test=true;
	    if (test && !GamesByEmail.inProduction())
	    {
		// Insert test code here.
		Super.initialize(2,turnTeamIndex);
		this.type=24;
		this.info.board="3|X|5|O";
		this.info.hiliteIndex="";  // WOLF (2015-10-21): I want undefined since any index means we're using a gridded board; note that you cannot put undefined as the value, since that results in a syntax error (a blank, where a string is needed); "" means undefined in the code for hiliteIndex
		this.teams[0].status.myTurn=false;
		this.teams[1].status.myTurn=true;
		this.move.number=3;
		this.move.player="0,0";
		return;
	    }
	    Super.initialize(numPlayers,turnTeamIndex); // Call the parent class' initialize method to create the teams and players.
	    this.info.board="0,0|1,9";
	},
	getString:function()
	{
	    return this.pieces.getString();
	},
	setString:function(str)
	{
	    this.pieces.setString(str);
	},
	update:function()
	{
	    this.pieces.update(this, this.territories);
	    Super.update();
	}
    },
    {
	// This will hold our static methods and properties.
	
	// TODO: build into territories or territory, probably also
	// for indices and not just territories. Also, probably extend
	// to support querying different "flavors" of adjacency, e.g.,
	// port or magical forest movement??
	areTerritoriesAdjacent:function(from, to)
	{
	    var adjList = from.adjacent;
	    for (var i = 0; i < adjList.length; i++)
		if (adjList[i].index === to.index)
		    return true;
	    return false;
	},

	// the resourcePack is a collection of information
	// used throughout the class.
	resourcePack:{
	    piecesClass:null,  // NOT chess-like board and so not chess-like pieces
	    territoriesClass:GamesByEmail.Territories,
	    territoryClass:GamesByEmail.Territory,
	    gameFolder:"Prophecy", // The folder we are in.
	    gameTypes:[24], // The types of games supported by this class.
	    gameTypeTitles:["Prophecy"], // The titles of games supported by this class.
	    allowedNumPlayers:[2], // A list of the number of players allowed in a game.
	    teamTitles:["X","O"],
	    teamFontColors:["#770802","#008806"],
	    itIsYourTurnToMove:"<p>It is your turn to move. Place a piece to make any %rlegal move</a>. After you move you will have the option of sending or undoing the move.", // Change the default prompt.
	    board:{  // Various information about our game board.
		image:{  // Information about the board image.
		    src:"simplified-board.png",  // The path and name of the image file, relative to the Default folder.
		    size:new Foundation.Point(498,498)  // The width and height of the board image, in pixels.
		},
		pieceImage:"Pieces.gif",
		pieceRects:{ // Clipping rectangles for the pieces.
		    "0":new Foundation.Rectangle(0,0,85,85),
		    "1":new Foundation.Rectangle(85,0,85,85),
		    hilite:new Foundation.Rectangle(170,0,85,85)
		}
	    },
	    territories:[
		{ // 0
		    title:"0",
		    polygon:new Foundation.Polygon(219,52,211,3,289,3,281,52),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[19,1]
		},
		{ // 1
		    title:"1",
		    polygon:new Foundation.Polygon(281,52,289,3,363,27,341,72),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[0,2]
		},
		{ // 2
		    title:"2",
		    polygon:new Foundation.Polygon(341,72,363,27,427,73,391,109),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[1,3]
		},
		{ // 3
		    title:"3",
		    polygon:new Foundation.Polygon(391,109,427,73,473,137,428,159),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[2,4]
		},
		{ // 4
		    title:"4",
		    polygon:new Foundation.Polygon(428,159,473,137,497,211,448,219),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[3,5]
		},
		{ // 5
		    title:"5",
		    polygon:new Foundation.Polygon(448,219,497,211,497,289,448,281),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[4,6]
		},
		{ // 6
		    title:"6",
		    polygon:new Foundation.Polygon(448,281,497,289,473,363,428,341),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[5,7]
		},
		{ // 7
		    title:"7",
		    polygon:new Foundation.Polygon(428,341,473,363,427,427,391,391),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[6,8]
		},
		{ // 8
		    title:"8",
		    polygon:new Foundation.Polygon(391,391,427,427,363,473,341,428),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[7,9]
		},
		{ // 9
		    title:"9",
		    polygon:new Foundation.Polygon(341,428,363,473,289,497,281,448),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[8,10]
		},
		{ // 10
		    title:"10",
		    polygon:new Foundation.Polygon(281,448,289,497,211,497,219,448),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[9,11]
		},
		{ // 11
		    title:"11",
		    polygon:new Foundation.Polygon(219,448,211,497,137,473,159,428),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[10,12]
		},
		{ // 12
		    title:"12",
		    polygon:new Foundation.Polygon(159,428,137,473,73,427,109,391),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[11,13]
		},
		{ // 13
		    title:"13",
		    polygon:new Foundation.Polygon(109,391,73,427,27,363,72,341),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[12,14]
		},
		{ // 14
		    title:"14",
		    polygon:new Foundation.Polygon(72,341,27,363,3,289,52,281),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[13,15]
		},
		{ // 15
		    title:"15",
		    polygon:new Foundation.Polygon(52,281,3,289,3,211,52,219),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[14,16]
		},
		{ // 16
		    title:"16",
		    polygon:new Foundation.Polygon(52,219,3,211,27,137,72,159),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[15,17]
		},
		{ // 17
		    title:"17",
		    polygon:new Foundation.Polygon(72,159,27,137,73,73,109,109),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[16,18]
		},
		{ // 18
		    title:"18",
		    polygon:new Foundation.Polygon(109,109,73,73,137,27,159,72),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[17,19]
		},
		{ // 19
		    title:"19",
		    polygon:new Foundation.Polygon(159,72,137,27,211,3,219,52),
		    //hiliteOffset:new Foundation.Point(440,14), // Not sure about these hilite related items
		    //hiliteSize:new Foundation.Point(145,233),  
		    //overlaySize:new Foundation.Point(145,233), // Not sure about overlay
		    adjacentIndices:[18,0]
		},
	    ],
	    rules:Foundation.readTextFile("Rules.htm")
	}
    }
);







