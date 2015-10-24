/*
GamesByEmail.WW2Game
Copyright © 1998-2011 Scott Nesin, all rights reserved.

To Do:
Unload/Bombard all when amphib assault starts.
Abandoned fighters
Sub Separate Retreat
#####Breeding on transports!!!! DONE!!!!

*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
GamesByEmail.WW2Territory=function(territories,index,indexString,game,territory)
{
   this.detailRectangle=null;
   this.ipcValue=0;
   this.originalIndustrialComplex=false;
   GamesByEmail.Territory.call(this,territories,index,indexString,game,territory);
   if (typeof(this.overlayOffset)=="undefined" && this.isLand())
      this.overlayOffset=this.hiliteOffset;
   this.holdingPowerIndex=this.originalPowerIndex;
   this.hl=null;
   this.hld=null;
   this.div=null;
   this.pieces=new GamesByEmail.WW2Pieces(this);
   this.unitAttackMoves=this.unitNonCombatMoves=this.unitMoves=null;
   this.blitzed=0;
   this.amphibiousAssaulted=0;
   this.preMoveLogPowerIndex=7;
};
GamesByEmail.WW2Territory.$parentClass=GamesByEmail.Territory;
if (!GamesByEmail.Territory.$childClasses) GamesByEmail.Territory.$childClasses=new Array();
GamesByEmail.Territory.$childClasses.push(GamesByEmail.WW2Territory);
GamesByEmail.WW2Territory.$constructor=GamesByEmail.Territory.$constructor ? GamesByEmail.Territory.$constructor : function(){};
GamesByEmail.WW2Territory.$interfaces=new Array();
GamesByEmail.WW2Territory.$name="WW2Territory";
GamesByEmail.WW2Territory.$childClasses=new Array();
GamesByEmail.WW2Territory.$container=GamesByEmail;
GamesByEmail.WW2Territory.prototype={
   constructor:GamesByEmail.WW2Territory,
   getHiliteImageSrc:function()
   {
      return this.game.getImageSrc(this.game.resource("territoryHiliteImage",'i',this.indexString,'c',this.holdingPowerIndex));
   },
   getOverlayImageSrc:function()
   {
      return this.game.getImageSrc(this.game.resource("territoryOverlayImage",'i',this.indexString,'c',this.holdingPowerIndex));
   },
   appendOverlayHtml:function(htmlBuilder)
   {
      if (this.isLand())
      {
         var src="";
         if (this.holdingPowerIndex!=this.originalPowerIndex)
            src=this.getOverlayImageSrc();
         else
            src=this.game.getImageSrc("Blank.gif");
         htmlBuilder.append("<img id=\""+this.game.elementId("territoryOverlay_"+this.index)+"\" src=\""+src+"\" style=\"position:absolute;left:"+this.overlayOffset.x+";top:"+this.overlayOffset.y+";visibility:"+(src.length==0 ? "hidden" : "visible")+"; z-index:100\"  width=\""+this.overlaySize.x+"\" height=\""+this.overlaySize.y+"\">");
      }
      this.pieces.appendHtml(htmlBuilder);
      return htmlBuilder;
   },
   updateColor:function()
   {
      this.game.getElement("territoryHilite_"+this.index).src=this.getHiliteImageSrc();
      var overlay=this.game.getElement("territoryOverlay_"+this.index);
      if (overlay)
      {
         if (this.holdingPowerIndex==this.originalPowerIndex)
         {
            overlay.style.visibility="hidden";
            overlay.src=this.game.getImageSrc("Blank.gif");
         }
         else
         {
            overlay.src=this.getOverlayImageSrc();
            overlay.style.visibility="visible";
         }
      }
   },
   containsPoint:function(point)
   {
      return ((this.detailRectangle &&
               this.detailRectangle.containsPoint(point)) ||
              this.polygon.containsPoint(point));
   },
   updateBlink:function()
   {
      var oldBlink=this.blink;
      if (this.game.isMyTurn(true))
         switch (this.game.movePhase)
         {
         case 6 :
            this.setBlink(this.blitzed>0 || this.amphibiousAssaulted>0 || (this.unitAttackMoves!=null && this.unitAttackMoves.totalNumMoved()>0));
            break;
         case 7 :
            this.setBlink(this.needsCombatResolved());
            break;
         case 8 :
            var npl=this.needsPlanesLanded();
            this.setBlink(npl);
            break;
         case 9 :
            this.setBlink(this.amphibiousAssaulted>0 || (this.unitNonCombatMoves!=null && this.unitNonCombatMoves.totalNumMoved()>0));
            break;
         case 13 :
            this.setBlink(this.defenseOrderingNeeded);
            break;
         default :
            this.setBlink(false);
            break;
         }
      else
         this.setBlink(false);
      return (this.blink==oldBlink);
   },
   needsCombatResolved:function()
   {
      return (this.amphibiousAssaulted>0 || !this.strategicBombingRaidResolved() || (this.isEnemyOccupied() && this.isFriendlyOccupied(true,true,true,false)));
   },
   isBlitzedOrUnopposed:function()
   {
      return (this.blitzed ||
              ((this.isEnemy() || this.isNeutral()) &&
               !this.isEnemyOccupied() &&
               this.isFriendlyOccupied(true)));
   },
   needsPlanesLanded:function()
   {
      return (this.pieces.unlandedAircraftCount()>0);
   },
   isHeld:function()
   {
      return (this.holdingPowerIndex!=6 &&
              this.holdingPowerIndex!=5);
   },
   logPowerIndex:function()
   {
      var p=this.holdingPower();
      if (p)
         return p.powerIndex;
      if (this.isNeutral())
         return 5;
      if (this.pieces.length>0)
         return this.pieces[0].owner.powerIndex;
      return 6;
   },
   holdingPower:function()
   {
      if (this.isHeld())
         return this.game.powers[this.holdingPowerIndex];
      return null;
   },
   originalPower:function()
   {
      if (this.isLand())
         return this.game.powers[this.originalPowerIndex];
      return null;
   },
   isFriendly:function(powerIndex)
   {
      return (!this.isNeutral() &&
              !this.isEnemy(powerIndex));
   },
   isSeaZone:function()
   {
      return (this.originalPowerIndex==6);
   },
   isLand:function()
   {
      return (this.originalPowerIndex!=6);
   },
   getIslands:function()
   {
      var islands=new Array();
      if (this.isSeaZone())
         for (var i=0;i<this.adjacent.length;i++)
         {
            var t=this.adjacent[i];
            if (t.isLand() && t.adjacent.length==1 && t.adjacent[0]==this)
               islands[islands.length]=t;
         }
      return islands;
   },
   isSeaLocked:function()
   {
      if (!this.isLand())
         return false;
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isLand())
            return false;
      return true;
   },
   isNeutral:function()
   {
      return (this.holdingPowerIndex==5);
   },
   isEnemy:function(powerIndex)
   {
      if (typeof(powerIndex)=="undefined")
         powerIndex=this.game.player.team.team.powerIndex;
      if (this.isHeld())
         return (this.game.powers[this.holdingPowerIndex].team.powerIndex!=powerIndex);
      for (var i=0;i<this.pieces.length;i++)
         if (this.pieces[i].owner.team.powerIndex!=powerIndex)
            return true;
      return false;
   },
   isCanalTransitBlocked:function(toTerritory,powerIndex)
   {
      if (typeof(this.canal)=="undefined" || toTerritory.index!=this.canal.toIndex)
         return false;
      if (arguments.length<2)
         powerIndex=this.game.player.team.team.powerIndex;
      for (var i=0;i<this.canal.checkIndices.length;i++)
      {
         var t=this.territories[this.canal.checkIndices[i]];
         if (t.isEnemy(powerIndex) || t.conqueredThisTurn)
            return true;
      }
      return false;
   },
   isStraitsTransitBlocked:function(toTerritory,powerIndex)
   {
      if (this.territories.game.info.getValue("b_MustControlStraits"))
      {
         if (typeof(this.straits)=="undefined")
	         return false;
	      var indexExists=false;
	      for (var i=0;i<this.straits.toIndexes.length;i++)
	        if (toTerritory.index==this.straits.toIndexes[i])
	        {
	        	indexExists=true;
	        	break;
	        }
	      if (!indexExists)
	      	return false;
	      if (arguments.length<2)
	         powerIndex=this.game.player.team.team.powerIndex;
	      for (var i=0;i<this.straits.checkIndices.length;i++)
	      {
	         var t=this.territories[this.straits.checkIndices[i]];
	         if (t.isEnemy(powerIndex) || (t.isNeutral() && t.index==59))
               return true;
	      }
	    }
      return false;
   },
   canMoveThrough:function(powerIndex)
   {
      if (arguments.length<1)
         powerIndex=this.game.player.team.team.powerIndex;
      if (this.isHeld())
         return (this.game.powers[this.holdingPowerIndex].team.powerIndex==powerIndex);
      return (this.holdingPowerIndex==6);
   },
   autoLandOrCrashExtraEnemyFighters:function()
   {
      if (this.isSeaZone())
      {
         var numCarrierSpots=0;
         var numFighters=0;
         var carrierSpots=new Array(0,0,0,0,0);
         var fighters=new Array(new Array(),new Array(),new Array(),new Array(),new Array());
         for (var i=0;i<this.pieces.length;i++)
         {
            var p=this.pieces[i];
            if (!p.isFriendly())
               if (p.unit==6)
               {
                  numCarrierSpots+=2;
                  carrierSpots[p.owner.powerIndex]+=2;
               }
               else
                  if (p.unit==2)
                  {
                     numFighters++;
                     var a=fighters[p.owner.powerIndex];
                     a[a.length]=p;
                  }
         }
         if (numCarrierSpots<numFighters)
         {
            for (var i=0;i<carrierSpots.length;i++)
               while (carrierSpots[i]>0 && fighters[i].length>0)
               {
                  carrierSpots[i]--;
                  fighters[i].length--;
                  numCarrierSpots--;
                  numFighters--;
               }
            var fighterList=new Array();
            for (var i=0;i<fighters.length;i++)
               fighterList=fighterList.concat(fighters[i]);
            while (numCarrierSpots>0)
            {
               var saved=GamesByEmail.random(fighterList.length);
               for (var i=saved+1;i<fighterList.length;i++)
                  fighterList[i-1]=fighterList[i];
               fighterList.length--;
               numCarrierSpots--;
            }
            var islands=this.getIslands();
            var island=null;
            for (var i=0;i<islands.length;i++)
               if (!islands[i].isNeutral() &&
                   islands[i].isEnemy())
               {
                  island=islands[i];
                  break;
               }
            for (var i=0;i<fighterList.length;i++)
            {
               var fighter=fighterList[i];
               this.pieces.removePiece(fighter);
               if (island)
               {
                  island.pieces.addPiece(fighter);
                  this.game.log.record(335,fighter.unit,fighter.owner.powerIndex,this.index,this.holdingPowerIndex,island.index,island.holdingPowerIndex);
               }
               else
                  this.game.log.record(336,fighter.unit,fighter.owner.powerIndex,this.index,this.holdingPowerIndex);

            }
            this.pieces.updateBoard();
            if (island)
               island.pieces.updateBoard();
         }
      }
   },
   attackHtml:function()
   {
      var html="";
      html+="<table id=\""+this.game.elementId("primaryMoves")+"\" style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.game.board.image.size.x*2/3)+"px\" height=\""+Math.floor(this.game.board.image.size.y*2/3)+"px\">";
      html+="<tr><td colspan=4>";
      html+=this.game.resource(43,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'A',this.game.getButtonHtml(this.game.resource(36),""),
                               'a',this.game.getButtonHtml(this.game.resource(57),""),
                               'R',this.game.getButtonHtml(this.game.resource(37),""),
                               'r',this.game.getButtonHtml(this.game.resource(58),""),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap>"+this.game.resource(33)+"</td><td nowrap width=\"1%\">"+this.game.resource(69)+"</td><td nowrap width=\"1%\">"+this.game.resource(70)+"</td><td nowrap width=\"20%\">"+this.game.resource(35)+"</td></tr><tr>";
      html+="<td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:250px;overflow:auto\" id=\""+this.game.elementId("attackMovesDiv")+"\">"+this.game.resource(59)+"</div></td>";
      html+="<td><div style=\"border:1px solid black;width:100%;height:250px;overflow:auto\" id=\""+this.game.elementId("defencesDiv")+"\"></div></td>";
      html+="</tr><tr><td colspan=4 align=left>";
      html+=this.game.resource(44,
                               'd',this.game.getButtonHtml(this.game.resource(20),"update",this.game.event("update()",true)),
                               'o',this.game.getAnchorHtml(this.game.resource(45),"showBattleOdds",this.game.event("showBattleOdds(event,"+this.index+")"),"disabled"),
                               'b',this.game.getAnchorHtml(this.game.resource(92),"previewBattleBoard",this.game.event("previewBattleBoardAtIndex("+this.index+")")));
      html+="</td></tr></table>";
      html+="<div id=\""+this.game.elementId("secondaryMoves")+"\" style=\"display:none\"></div>";
      return html;
   },
   blitzOnlyHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.game.board.image.size.x*2/3),Math.floor(this.game.board.image.size.y*2/3));
      html+="<table id=\""+this.game.elementId("primaryMoves")+"\" style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\" height=\""+size.y+"px\">";
      html+="<tr><td colspan=3>";
      html+=this.game.resource(203,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'A',this.game.getButtonHtml(this.game.resource(36),""),
                               'a',this.game.getButtonHtml(this.game.resource(57),""),
                               'R',this.game.getButtonHtml(this.game.resource(37),""),
                               'r',this.game.getButtonHtml(this.game.resource(58),""),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap>"+this.game.resource(33)+"</td><td nowrap width=\"1%\">"+this.game.resource(69)+"</td><td nowrap width=\"1%\">"+this.game.resource(204)+"</td></tr><tr>";
      html+="<td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:250px;overflow:auto\" id=\""+this.game.elementId("attackMovesDiv")+"\">"+this.game.resource(59)+"</div></td>";
      html+="</tr><tr><td colspan=3 align=left>";
      html+=this.game.resource(205,
                               'd',this.game.getButtonHtml(this.game.resource(20),"update",this.game.event("update()",true)));
      html+="</td></tr></table>";
      return html;
   },
   takeOverNeutralHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.game.board.image.size.x*2/3)+"px\" height=\""+Math.floor(this.game.board.image.size.y*2/3)+"px\">";
      html+="<tr><td colspan=3>";
      html+=this.game.resource(73,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'i',this.game.player.team.units.neutral.cost,
                               'A',this.game.getButtonHtml(this.game.resource(36),""),
                               'a',this.game.getButtonHtml(this.game.resource(57),""),
                               'R',this.game.getButtonHtml(this.game.resource(37),""),
                               'r',this.game.getButtonHtml(this.game.resource(58),""),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap>"+this.game.resource(33)+"</td><td nowrap width=\"1%\">"+this.game.resource(69)+"</td><td nowrap width=\"1%\">"+this.game.resource(75)+"</td></tr><tr>";
      html+="<td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:100%;overflow:scroll;overflow-y:scroll\" id=\""+this.game.elementId("attackMovesDiv")+"\">"+this.game.resource(59)+"</div></td>";
      html+="</tr><tr><td colspan=3 align=left>";
      html+=this.game.resource(74,
                               'd',this.game.getButtonHtml(this.game.resource(20),"update",this.game.event("update()",true)));
      html+="</td></tr></table>";
      return html;
   },
   occupySeaZoneHtml:function()
   {
      var html="";
      html+="<table id=\""+this.game.elementId("primaryMoves")+"\" style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.game.board.image.size.x*2/3)+"px\" height=\""+Math.floor(this.game.board.image.size.y*2/3)+"px\">";
      html+="<tr><td colspan=4>";
      html+=this.game.resource(78,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'A',this.game.getButtonHtml(this.game.resource(36),""),
                               'a',this.game.getButtonHtml(this.game.resource(57),""),
                               'R',this.game.getButtonHtml(this.game.resource(37),""),
                               'r',this.game.getButtonHtml(this.game.resource(58),""),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap>"+this.game.resource(33)+"</td><td nowrap width=\"1%\">"+this.game.resource(69)+"</td><td nowrap width=\"1%\">"+this.game.resource(75)+"</td><td nowrap width=\"20%\">"+this.game.resource(81)+"</td></tr><tr>";
      html+="<td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:100%;overflow:scroll;overflow-y:scroll\" id=\""+this.game.elementId("attackMovesDiv")+"\">"+this.game.resource(59)+"</div></td>";
      html+="<td><div style=\"border:1px solid black;width:100%;height:100%;overflow:scroll;overflow-y:scroll\" id=\""+this.game.elementId("defencesDiv")+"\"></div></td>";
      html+="</tr><tr><td colspan=4 align=left>";
      html+=this.game.resource(79,
                               'd',this.game.getButtonHtml(this.game.resource(20),"update",this.game.event("update()",true)),
                               'o',this.game.getAnchorHtml(this.game.resource(45),"showBattleOdds"),this.game.event("showBattleOdds(event,"+this.index+")"),"disabled");
      html+="</td></tr></table>";
      html+="<div id=\""+this.game.elementId("secondaryMoves")+"\" style=\"display:none\"></div>";
      return html;
   },
   landPlanesHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.game.board.image.size.x*2/3),Math.floor(this.game.board.image.size.y*2/3));
      html+="<table id=\""+this.game.elementId("primaryMoves")+"\" style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\" height=\""+size.y+"px\">";
      html+="<tr><td colspan=3>";
      html+=this.game.resource(149,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap width=\"50px\" style=\"padding-left:2px\">"+this.game.resource(150)+"</td><td nowrap width=\""+(size.x-50-190)+"\">"+this.game.resource(152)+"</td><td nowrap width=\"190\">"+this.game.resource(153)+"</td></tr>";
      html+="<tr><td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:"+(size.x-2)+"px;height:250px;overflow:auto\" id=\""+this.game.elementId("landPlanesDivLandPlanesDiv")+"\">";
      html+=this.landPlanesOptions.getHtml((size.x-50-190));
      html+="</div></td>";
      html+="<tr><td colspan=3 align=left>";
      html+=this.game.resource(165,
                               'd',this.game.getButtonHtml(this.game.resource(20),"update",this.game.event("update()",true)));
      html+="</td></tr></table>";
      return html;
   },
   nonCombatMovesHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.game.board.image.size.x*1/2),Math.floor(this.game.board.image.size.y*2/3));
      html+="<table id=\""+this.game.elementId("primaryMoves")+"\" style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\" height=\""+size.y+"px\">";
      html+="<tr><td colspan=3>";
      html+=this.game.resource(162,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'M',this.game.getButtonHtml(this.game.resource(36),""),
                               'm',this.game.getButtonHtml(this.game.resource(57),""),
                               'R',this.game.getButtonHtml(this.game.resource(37),""),
                               'r',this.game.getButtonHtml(this.game.resource(58),""),
                               'H',this.game.tempHidePrompt,
                               'A',this.isLand() && this.conqueredThisTurn ? this.game.resource(327) : "");
      html+="</td></tr>";
      html+="<tr><td nowrap>"+this.game.resource(33)+"</td><td nowrap width=\"1%\">"+this.game.resource(69)+"</td><td nowrap width=\"1%\">"+this.game.resource(163)+"</td></tr><tr>";
      html+="<td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:250px;overflow:auto\" id=\""+this.game.elementId("nonCombatMovesDiv")+"\">"+this.game.resource(59)+"</div></td>";
      html+="</tr><tr><td colspan=3 align=left>";
      html+=this.game.resource(164,
                               'd',this.game.getButtonHtml(this.game.resource(20),"update",this.game.event("update()",true)));
      html+="</td></tr></table>";
      html+="<div id=\""+this.game.elementId("secondaryMoves")+"\" style=\"display:none\"></div>";
      return html;
   },
   setDefenseOrderHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.game.board.image.size.x*2/3),Math.floor(this.game.board.image.size.y*1/3));
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\">";
      html+="<tr><td>";
      html+=this.game.resource(194,
                               'B',this.game.falseBackButton("update"),
                               't',this.title.htmlEncode(),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap>"+this.game.resource(196)+"</td></tr>";
      html+="<tr><td style=\"border:1px solid black;padding:2\" valign=top><table cellspacing=0 cellpadding=0><tr><td>";
      html+=this.game.resource(197);
      html+="</td></tr><tr><td><span id=\""+this.game.elementId("topOrderArrow")+"\">";
      html+=this.game.arrowHtml(false);
      html+="</span></td></tr><tr><td id=\""+this.game.elementId("combatUnitsOrder")+"\">";
      this.pieces.moveNonCombatToFront();
      html+=this.pieces.setDefenseOrderHtml();
      html+="</td></tr><tr><td><span id=\""+this.game.elementId("bottomOrderArrow")+"\">";
      html+=this.game.arrowHtml(true);
      html+="</span></td></tr><tr><td><span id=\""+this.game.elementId("bottomOrderCaption")+"\">";
      html+=this.game.resource(198);
      html+="</span></td></tr></table><br>";
      html+=this.game.getButtonHtml(this.game.resource(339),"orderCombatUnitsByCost",this.game.event("orderCombatUnitsByCostAtIndex("+this.index+")"));
      html+="</td></tr><tr><td colspan=3 align=left>";
      html+=this.game.resource(195,
                               'd',this.game.getButtonHtml(this.game.resource(20),"combatUnitsOrdered",this.game.event("combatUnitsOrderedAtIndex("+this.index+")",true)));
      html+="</td></tr></table>";
      window.setTimeout(this.game.event("territories["+this.index+"].updateOrderStuff()"),1);
      return html;
   },
   updateOrderStuff:function()
   {
      var defo,e,x,o,p,pl;
      defo=this.game.getElement("defenseOrder");
      if (defo.childNodes.length==0)
         return;
      e=defo.firstChild;
      o=this.game.getElement("topOrderArrow");
      x=e.offsetLeft+e.offsetWidth/2;
      pl=parseInt(o.style.paddingLeft);
      if (isNaN(pl))
         pl=0;
      p=Math.floor(x-(o.offsetWidth-pl)/2);
      if (p<0)
         p=0;
      o.style.paddingLeft=p;
      e=defo.lastChild;
      x=e.offsetLeft+e.offsetWidth/2;
      o=this.game.getElement("bottomOrderArrow");
      pl=parseInt(o.style.paddingLeft);
      if (isNaN(pl))
         pl=0;
      p=Math.floor(x-(o.offsetWidth-pl)/2);
      if (p<0)
         p=0;
      o.style.paddingLeft=p;
      o=this.game.getElement("bottomOrderCaption");
      pl=parseInt(o.style.paddingLeft);
      if (isNaN(pl))
         pl=0;
      p=e.offsetLeft+e.offsetWidth-(o.offsetWidth-pl);
      if (p<0)
         p=0;
      o.style.paddingLeft=p;
   },
   orderCombatUnitsByCost:function()
   {
      var e;
      if (this.pieces.orderCombatUnitsByCost() &&
          (e=this.game.getElement("combatUnitsOrder")))
      {
         this.game.setInnerHtml(e,this.pieces.setDefenseOrderHtml());
         this.updateOrderStuff();
      }
      return false;
   },
   updateDefences:function(ourOwn)
   {   
      var defences=this.getDefences(ourOwn);
      var div=this.game.getElement("defencesDiv");
      div.style.backgroundColor=(defences.length%2 ? "#eeeeee" : "#ffffff");
      this.game.setInnerHtml(div,defences.getHtml());
   },
   getDefences:function(ourOwn)
   {
      var defences=new GamesByEmail.WW2Defenses(ourOwn,this.game);
      if (this.pieces.length>0)
      {
         var power=this.pieces[0].owner;
         for (var i=0;i<this.pieces.length;i++)
            if (this.pieces[i].unit!=4 &&
                this.pieces[i].unit!=9 &&
                this.pieces[i].isFriendly(power) &&
                !this.pieces[i].moved)
               defences.add(this.pieces[i]);
         defences.sort();
      }
      return defences;
   },
   updateAttackMoves:function()
   {
      if (this.unitAttackMoves==null)
         this.unitMoves=this.unitAttackMoves=new GamesByEmail.WW2Moves(this,this.game.player.team,false);
      else
      {
         this.unitMoves=this.unitAttackMoves;
         this.unitMoves.clearNonMoves();
      }
      this.unitMoves.loadAttackMoves();
      var div=this.game.getElement("attackMovesDiv");
      div.style.backgroundColor=(this.unitMoves.length%2 ? "#eeeeee" : "#ffffff");
      this.game.setInnerHtml(div,this.unitMoves.getHtml());
      this.unitMoves.updateMoveButtons();
   },
   updateNonCombatMoves:function()
   {
      if (this.unitNonCombatMoves==null)
         this.unitMoves=this.unitNonCombatMoves=new GamesByEmail.WW2Moves(this,this.game.player.team,true);
      else
      {
         this.unitMoves=this.unitNonCombatMoves;
         this.unitMoves.clearNonMoves();
      }
      this.unitMoves.loadNonCombatMoves();
      var div=this.game.getElement("nonCombatMovesDiv");
      div.style.backgroundColor=(this.unitMoves.length%2 ? "#eeeeee" : "#ffffff");
      this.game.setInnerHtml(div,this.unitMoves.getHtml(true));
      this.unitMoves.updateMoveButtons();
   },
   adjacentWithinRange:function(range,list)
   {
      if (arguments.length<2)
         list=new Array();
      for (var i=0;i<list.length;i++)
         if (list[i]==this)
            break;
      if (i==list.length)
         list[list.length]=this;
      if (range>0)
         for (var i=0;i<this.adjacent.length;i++)
            this.adjacent[i].adjacentWithinRange(range-1,list);
      return list;
   },
   setString:function(territoryString)
   {
      this.pieces.length=0;
      if (territoryString.length>0)
         this.pieces.setString(territoryString.substr(this.setAttributes(territoryString)));
      else
         this.holdingPowerIndex=this.originalPowerIndex;
      this.updateColor();
      this.pieces.updateBoard();
      this.preMoveLogPowerIndex=this.logPowerIndex();
   },
   clearForNextTurn:function()
   {
      this.firstAttack=false;
      this.conqueredThisTurn=false;
      this.combatRolls=null;
      this.defendersHit=0;
      this.attackersHit=0;
      this.defenderSeaUnitsHit=0;
      this.attackerSeaUnitsHit=0;
      this.retreatTerritories=null;
      this.pieces.clearForNextTurn();
      this.amphibiousAssaulted=0;
      this.blitzed=0;
      this.clearMoves();
   },
   clearAttributes:function()
   {
      this.holdingPowerIndex=this.originalPowerIndex;
      this.firstAttack=false;
      this.conqueredThisTurn=false;
      this.combatRolls=null;
      this.defendersHit=0;
      this.attackersHit=0;
      this.defenderSeaUnitsHit=0;
      this.attackerSeaUnitsHit=0;
      this.retreatTerritories=null;
   },
   setAttributes:function(attributesString)
   {
      var consumed=0;
      this.clearAttributes();
      if (attributesString.length>0 && attributesString.charAt(0)=="\t")
      {
         consumed++;
         while (attributesString.charAt(consumed)!="\t")
            consumed+=this.setAttribute(attributesString.substr(consumed));
         consumed++;
      }
      return consumed;
   },
   setAttribute:function(attributeString)
   {
      var consumed=1;
      switch (attributeString.charAt(0))
      {
      case 'h' :
         consumed++;
         this.setHoldingPower(parseInt(attributeString.charAt(1),16));
         break;
      case 'q' :
         this.conqueredThisTurn=true;
         break;
      case 'f' :
         this.firstAttack=true;
         break;
      case 'c' :
         this.combatRolls=new Array();
         this.defendersHit=parseInt(attributeString.substr(consumed,4),16);
         consumed+=4;
         this.attackersHit=parseInt(attributeString.substr(consumed,4),16);
         consumed+=4;
         this.defenderSeaUnitsHit=parseInt(attributeString.substr(consumed,4),16);
         consumed+=4;
         this.attackerSeaUnitsHit=parseInt(attributeString.substr(consumed,4),16);
         consumed+=4;
         while (attributeString.charAt(consumed)>='0' && attributeString.charAt(consumed)<='9')
            this.combatRolls[this.combatRolls.length]=parseInt(attributeString.charAt(consumed++));
         break;
      case 'r' :
         for (;attributeString.charAt(consumed)!='r';consumed+=2)
         {
            if (this.retreatTerritories==null)
               this.retreatTerritories=new Array();
            this.retreatTerritories[this.retreatTerritories.length]=this.territories[parseInt(attributeString.substr(consumed,2),16)];
         }
         consumed++;
         break;
      }
      return consumed;
   },
   getString:function()
   {
      var string="";
      string+=this.getAttributes();
      string+=this.pieces.getString();
      return string;
   },
   getAttributes:function()
   {
      var attributes="";
      if (this.holdingPowerIndex!=this.originalPowerIndex)
         attributes+='h'+GamesByEmail.getHexString(this.holdingPowerIndex);
      if (this.conqueredThisTurn)
         attributes+='q';
      if (this.firstAttack)
         attributes+='f';
      if (this.combatRolls)
      {
         attributes+='c'+GamesByEmail.getHexString(this.defendersHit,4)+GamesByEmail.getHexString(this.attackersHit,4)+GamesByEmail.getHexString(this.defenderSeaUnitsHit,4)+GamesByEmail.getHexString(this.attackerSeaUnitsHit,4);
         for (var i=0;i<this.combatRolls.length;i++)
            attributes+=this.combatRolls[i];
      }
      if (this.retreatTerritories)
      {
         attributes+='r';
         for (var i=0;i<this.retreatTerritories.length;i++)
            attributes+=GamesByEmail.getHexString(this.retreatTerritories[i].index,2);
         attributes+='r';
      }
      return (attributes.length>0 ? "\t"+attributes+"\t" : "");
   },
   setHoldingPower:function(powerIndex)
   {
      if (!this.isSeaZone())
      {
         this.holdingPowerIndex=powerIndex;
         this.updateColor();
         for (var i=0;i<this.pieces.length;i++)
         {
            var piece=this.pieces[i];
            if (piece.unit==9 ||
                piece.unit==4)
               piece.owner=this.game.powers[this.holdingPowerIndex];
         }
         this.pieces.updateBoard();
         this.game.updateTeamTitles();
      }
   },
   liberate:function(power,originalPower,logPhase)
   {
      if (this.isCapital)
      {
         this.game.log.recordPhase(logPhase,262,this.index,this.preMoveLogPowerIndex,originalPower.powerIndex);
         this.setHoldingPower(originalPower.powerIndex);
         this.territories.liberateRest(originalPower,logPhase);
      }
      else
         if (this.territories.isCapitalHeld(originalPower))
         {
            this.setHoldingPower(originalPower.powerIndex);
            this.game.log.recordPhase(logPhase,262,this.index,this.preMoveLogPowerIndex,originalPower.powerIndex);
         }
         else
         {
            this.setHoldingPower(power.powerIndex);
            this.game.log.recordPhase(logPhase,260,this.index,this.preMoveLogPowerIndex);
         }
   },
   capture:function(power,originalPower,logPhase)
   {
      var numIpcs=0;
      if (this.isCapital)
      {
         numIpcs=originalPower.ipcs;
         power.ipcs+=originalPower.ipcs;
         originalPower.ipcs=0;
      }
      if (originalPower.powerIndex==5 &&
          this.holdingPowerIndex==5)
         power.ipcs-=power.units.neutral.cost;
      this.setHoldingPower(power.powerIndex);
      if (this.isCapital)
      {
         this.game.log.recordPhase(logPhase,261,this.index,this.preMoveLogPowerIndex,originalPower.powerIndex,numIpcs);
         alert(this.game.resource(199,
                                  'c',this.title,
                                  'i',numIpcs,
                                  'p',originalPower.players[0].title));
      }
      else
         this.game.log.recordPhase(logPhase,260,this.index,this.preMoveLogPowerIndex);
   },
   conquer:function()
   {
      var logPhase=6;
      this.game.log.mode=1;
      var originalPower=this.originalPower();
      this.pieces.setUsedInBattleThisTurn();
      this.clearUnlandedAmphibiousUnits();
      if (originalPower)
      {
         var power=this.game.player.team;
         if (originalPower.team==power.team)
            this.liberate(power,originalPower,logPhase);
         else
            this.capture(power,originalPower,logPhase);
         this.conqueredThisTurn=true;
         this.updateBlink();
      }
      this.game.log.mode=0;
   },
   unitCount:function(unit,powerIndex,unmovedOnly,notUsedInBattleOnly)
   {
      if (arguments.length<2) powerIndex=this.holdingPowerIndex;
      if (arguments.length<3) unmovedOnly=false;
      if (arguments.length<4) notUsedInBattleOnly=false;
      notUsedInBattleOnly=true;
      var count=0;
      for (var i=0;i<this.pieces.length;i++)
         if (this.pieces[i].unit==unit &&
             this.pieces[i].owner.powerIndex==powerIndex &&
             (unmovedOnly ? !this.pieces[i].moved : true) &&
             (notUsedInBattleOnly ? !this.pieces[i].usedInBattle : true))
            count++;
      return count;
   },
   getAntiaircraftGun:function()
   {
      for (var i=0;i<this.pieces.length;i++)
         if (this.pieces[i].unit==4)
            return this.pieces[i];
      return null;
   },
   hasAntiaircraftGun:function()
   {
      return (this.getAntiaircraftGun()!=null);
   },
   hasIndustry:function()
   {
      for (var i=0;i<this.pieces.length;i++)
         if (this.pieces[i].unit==9)
            return true;
      return false;
   },
   unassignedUnitsOnTransports:function(attack)
   {
      if (!this.isSeaZone())
         return 0;
      var landingAvailable=false;
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isLand() &&
             (attack ? !this.adjacent[i].isFriendly() : this.adjacent[i].isFriendly()))
         {
            landingAvailable=true;
            break;
         }
      if (!landingAvailable)
         return 0;
      var count=0;
      for (var i=0;i<this.pieces.length;i++)
      {
         var p=this.pieces[i];
         if (p.unit==7 &&
             p.isOurs())
            for (var j=0;j<p.carry.length;j++)
            {
               t=p.carry[j];
               if ((!attack || t.unit!=4) &&
                   t.amphibiousAssault==null)
               {
                  count++;
                  break;
               }
            }
      }
      return count;
   },
   canSpareAircraftCarrier:function()
   {
      var unmovableFighterCount=0;
      var aircraftCarrierCount=0;
      for (var i=0;i<this.pieces.length;i++)
      {
         var p=this.pieces[i];
         if (p.unit==2 &&
             p.moved &&
             p.isFriendly())
            unmovableFighterCount++;
         else
            if (p.unit==6 &&
                p.isFriendly())
               aircraftCarrierCount++;
      }
      return (!this.isSeaZone() || unmovableFighterCount<=aircraftCarrierCount*2);
   },
   hasRoomForFighter:function(nonCombat)
   {
      if (this.isLand() && this.isFriendly() && (nonCombat || !this.conqueredThisTurn))
         return true;
      var fighterCount=0;
      var aircraftCarrierCount=0;
      for (var i=0;i<this.pieces.length;i++)
      {
         var p=this.pieces[i];
         if (p.unit==2 &&
             p.isFriendly())
            fighterCount++;
         else
            if (p.unit==6 &&
                p.isFriendly())
               aircraftCarrierCount++;
      }
      return (fighterCount<aircraftCarrierCount*2);
   },
   hasRoomForAircraft:function(nonCombat,isFighter)
   {
      if (isFighter)
         return this.hasRoomForFighter(nonCombat);
      return (this.isLand() && this.isFriendly() && (nonCombat || !this.conqueredThisTurn));
   },
   neighboringPickup:function(transport,powerIndex)
   {
      if (!this.isLand())
         return false;
      var light=false,heavy=false;
      var units=this.game.powers[powerIndex].units;
      for (var i=0;i<this.pieces.length && (!light || !heavy);i++)
      {
         var p=this.pieces[i];
         if (p.owner.powerIndex==powerIndex &&
             !p.usedInBattle &&
             p.numSpacesMoved<units[p.unit].movement)
            if (p.unit==0)
               heavy=light=true;
            else if (p.unit==1 ||
                     p.unit==4)
               heavy=true;
      }
      return ((transport.carry.length==0 && heavy) ||
              (transport.carry.length==1 && light));
   },
   neighboringPickups:function(transport,powerIndex)
   {
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].neighboringPickup(transport,powerIndex))
            return true;
      return false;
   },
   transportCounts:function(powerIndex,unmovedOnly,canCarryMoreOnly,allowFriendly)
   {
      if (arguments.length<1) powerIndex=this.holdingPowerIndex;
      if (arguments.length<2) unmovedOnly=false;
      var counts=new Array();
      for (var i=0;i<this.pieces.length;i++)
      {
         var p1=this.pieces[i];
         if (p1.unit==7 &&
             !p1.usedInBattle &&
             (p1.owner.powerIndex==powerIndex ||
              (allowFriendly &&
               this.game.areFriendly(p1.owner.powerIndex,powerIndex) &&
               this.neighboringPickups(p1,powerIndex))) &&
             (unmovedOnly ? !p1.moved : true))
         {
            if (p1.canCarryMore())
               counts[counts.length]={piece:p1.cloneTransport(),count:1};
            else
               if (!canCarryMoreOnly)
               {
                  var needNew=true;
                  for (var c=0;!needNew && c<counts.length;c++)
                     if (counts[c].piece.isCarryingSameLoad(p1))
                     {
                        needNew=false;
                        counts[c].count++;
                     }
                  if (needNew)
                     counts[counts.length]={piece:p1.cloneTransport(),count:1};
               }
         }
      }
      return counts;
   },
   isOccupied:function(powerIndex,checkLandUnits,checkSeaUnits,checkAirUnits,checkStrategicBombUnits)
   {
      if (!checkLandUnits && !checkSeaUnits && !checkAirUnits)
         checkLandUnits=checkSeaUnits=checkAirUnits=true;
      for (var i=0;i<this.pieces.length;i++)
      {
         var piece=this.pieces[i];
         if (piece.owner.team.powerIndex!=powerIndex &&
             ((checkLandUnits && piece.isLandUnit(true)) ||
              (checkSeaUnits && piece.isSeaUnit()) ||
              (checkAirUnits && piece.isAirUnit())))
         {
            if (!checkStrategicBombUnits && piece.strategicBombingRaid)
               continue;
            return true;
         }
      }
      return false;
   },
   isEnemyOccupied:function(checkLandUnits,checkSeaUnits,checkAirUnits,checkStrategicBombUnits)
   {
      return this.isOccupied(this.game.player.team.team.powerIndex,checkLandUnits,checkSeaUnits,checkAirUnits,checkStrategicBombUnits);
   },
   isFriendlyOccupied:function(checkLandUnits,checkSeaUnits,checkAirUnits,checkStrategicBombUnits)
   {
      return this.isOccupied(this.game.player.team.team.opposingTeam.powerIndex,checkLandUnits,checkSeaUnits,checkAirUnits,checkStrategicBombUnits);
   },
   unitAtNumber:function(unit,powerIndex,number)
   {
      var count=0;
      for (var i=0;i<this.pieces.length;i++)
         if (this.pieces[i].unit==unit &&
             this.pieces[i].owner.powerIndex==powerIndex &&
             (count++)==number)
            return this.pieces[i];
      return null;
   },
   trackHtml:function(point)
   {
      return this.game.resource(this.game.testing ? 7 : 42,
                                't',this.title.htmlEncode(),
                                'i',this.index,
                                'x',point.x,
                                'y',point.y,
                                'p',this.pieces.trackHtml());
   },
   moveUnits:function(unit,team,toTerritory,num,oldSpacesMoved,newSpacesMoved,markAsMoved,aaGunFlyover,strategicBombingRaid,transport)
   {
      for (var i=0;i<num;i++)
      {
         var piece=toTerritory.pieces.addPiece(this.pieces.removePiece(this.pieces.findByUnitTeamMoved(unit,team,!markAsMoved,oldSpacesMoved,transport)));
         piece.moved=markAsMoved;
         piece.unlanded=(markAsMoved && piece.isAirUnit());
         piece.numSpacesMoved=newSpacesMoved;
         piece.aaGunFlyover=aaGunFlyover;
         piece.strategicBombingRaid=strategicBombingRaid;
         if (piece.amphibiousAssaultPath)
         {
            piece.amphibiousAssaultPath.numMoved=0;
            piece.amphibiousAssaultPath=null;
            for (var j=0;j<piece.carry.length;j++)
               if (piece.carry[j].amphibiousAssault!=null)
               {
                  piece.carry[j].amphibiousAssault.amphibiousAssaulted--;
                  piece.carry[j].amphibiousAssault.updateBlink();
                  piece.carry[j].amphibiousAssault=null;
               }
            piece.unloaded=false;
         }
      }
      this.pieces.updateBoard();
      toTerritory.pieces.updateBoard();
   },
   availableLandingSlots:function(power)
   {
      if (!this.isSeaZone())
         return 1;
      var carrierCount=0,fighterCount=0;
      if (typeof(power)=="undefined")
         power=this.game.player.team;
      for (var i=0;i<this.pieces.length;i++)
      {
         var p=this.pieces[i];
         if (p.isFriendly(power))
            if (p.unit==6)
               carrierCount++;
            else
               if (p.unit==2 && !p.unlanded)
                  fighterCount++;
      }
      return carrierCount*2-fighterCount;
   },
   landPlane:function(unit,team,toTerritory,unlanded)
   {
      var piece=toTerritory.pieces.addPiece(this.pieces.removePiece(this.pieces.findByUnitTeamUnlanded(unit,team,unlanded)));
      piece.unlanded=!unlanded;
      this.pieces.updateBoard();
      toTerritory.pieces.updateBoard();
      return piece;
   },
   destroyPlane:function(unit,team)
   {
      var piece=this.pieces.removePiece(this.pieces.findByUnitTeamUnlanded(unit,team,true));
      this.pieces.updateBoard();
      return piece;
   },
   undestroyPlane:function(piece)
   {
      this.pieces.addPiece(piece);
      this.pieces.updateBoard(this.holdingPower());
   },
   closeSecondaryAttack:function()
   {
      var game=this.game;
      game.getElement("secondaryMoves").style.display="none";
      game.getElement("primaryMoves").style.display="";
   },
   changeFirstStrikeRolls:function(numHits)
   {
      this.pieces.hitDefenders(numHits,true);
      this.getBattleBoardDetails(false,false,true);
      this.pieces.clearHits();
   },
   battleCubeHtml:function(roll)
   {
      var html="";
      var game=this.game;
      html+="<table cellspacing=0 cellpadding=0 style=\"margin:4;width:50px;height:40px;background-color:#bbbbbb\">";
      html+="<tr><td align=center>&nbsp;</td></tr>";
      html+="<tr><td align=center style=\"color:#ffffff;font-size:18px;font-weight:bolder\">"+roll+"</td></tr>";
      html+="<tr><td align=center>"+(roll>1 ? game.resource(94) : "&nbsp;")+"</td></tr>";
      html+="</table>";
      return html;
   },
   battleBoardHtml:function(bottomHtml,selectHits,allowUnlanded,falseBackButton)
   {
      var bbds=this.getBattleBoardDetails(selectHits,allowUnlanded);
      var html="";
      var numCols=0;
      for (var i=0;i<bbds.length;i++)
         if (bbds[i].count>0)
            numCols++;
      var colSpan=(numCols==0 ? 1 : numCols);
      var size=new Foundation.Point(Math.floor(this.game.board.image.size.x*2/3),Math.floor(this.game.board.image.size.y*2/3));
      var midHeight=1;
      var bbHeight=Math.floor(size.y/2)-24-24-midHeight;
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellspacing=0 cellpadding=0 width=\""+size.x+"px\" height=\""+size.y+"px\">";
      html+="<tr style=\"height:1px\"><td colspan="+colSpan+">";
      html+=this.game.resource(121,
                               'B',falseBackButton ? this.game.falseBackButton(falseBackButton) : "",
                               't',this.title.htmlEncode());
      html+="</td></tr>";
      html+="<tr style=\"background-color:#000000\"><td colspan="+colSpan+" align=center style=\"height:1px;color:white;font-size:24px;font-weight:bold\">"+this.game.resource(202)+"</td></tr>";
      html+="<tr style=\"background-color:#dEB887;height:"+bbHeight+";\">";
      var td="<td width=\""+(100/colSpan)+"%\" align=center style=\"border-left:1px solid #000000;border-right:1px solid #000000\">";
      if (numCols==0)
         html+=td+"&nbsp;</td>";
      else
         for (var i=0;i<bbds.length;i++)
            if (bbds[i].count>0)
               html+=td+bbds[i].defender.html+"</td>";
      html+="</tr><tr style=\"background-color:#99915B;height:"+midHeight+"px\">";
      if (numCols==0)
         html+=td+this.game.resource(95)+"</td>";
      else
         for (var i=0;i<bbds.length;i++)
            if (bbds[i].count>0)
               html+="<td align=center style=\"border-left:1px solid #000000;border-right:1px solid #000000\">"+this.battleCubeHtml(bbds[i].roll)+"</td>";
      html+="</tr><tr style=\"background-color:#556B2F;height:"+bbHeight+"\">";
      if (numCols==0)
         html+=td+"&nbsp;</td>";
      else
         for (var i=0;i<bbds.length;i++)
            if (bbds[i].count>0)
               html+=td+bbds[i].attacker.html+"</td>";
      html+="<tr style=\"background-color:#000000\"><td colspan="+colSpan+" align=center style=\"height:1px;color:white;font-size:24px;font-weight:bold\">"+this.game.resource(201)+"</td></tr>";
      if (bottomHtml)
         html+="<tr><td align=center colspan="+colSpan+" style=\"height:1px;\">"+bottomHtml+"</td></tr>";
      html+="</table>";
      this.battleBoardDetails=bbds;
      return html;
   },
   previewBattleBoard:function()
   {
      var e=this.game.getElement("secondaryMoves");
      this.game.setInnerHtml(e,this.battleBoardHtml(this.game.getButtonHtml(this.game.resource(93),"closeSecondaryAttack",this.game.event("closeSecondaryAttackAtIndex("+this.index+")",true)),true,false,"closeSecondaryAttackAtIndex"));
      this.game.getElement("primaryMoves").style.display="none";
      e.style.display="";   
   },
   getBattleBoardDetails:function(selectHits,allowUnlanded,firstStrike)
   {
      var bbds=new Array();
      bbds.totalDiceCount=0;
      bbds.defendingUnits="";
      bbds.attackingUnits="";
      bbds.oneTimeShots=0;
      var rollsConsumed=0;
      for (var i=0;i<=6;i++)
      {
         var bbd={roll:i,count:0};
         bbd.defender=this.pieces.getBattleBoardDetails(bbd.roll,false,this.combatRolls,rollsConsumed,selectHits,allowUnlanded,firstStrike);
         if (bbd.roll>0)
            rollsConsumed+=bbd.defender.count;
         bbds.defendingUnits+=bbd.defender.units;
         bbds.oneTimeShots+=bbd.defender.oneTimeShots;
         bbd.attacker=this.pieces.getBattleBoardDetails(bbd.roll,true,this.combatRolls,rollsConsumed,selectHits,allowUnlanded,firstStrike);
         if (bbd.roll>0)
            rollsConsumed+=bbd.attacker.count;
         bbd.count=bbd.defender.count+bbd.attacker.count;
         bbds.attackingUnits+=bbd.attacker.units;
         bbds.oneTimeShots+=bbd.attacker.oneTimeShots;
         if (bbd.roll>0)
            bbds.totalDiceCount+=bbd.count;
         bbds[bbds.length]=bbd;
      }
      return bbds;
   },
   getBattleBoardAmphibAssaultDetails:function(roll,allowUnlanded)
   {
      var bbaad={html:"",count:0,units:"",oneTimeShots:0};
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isSeaZone())
         {
            var bbaaad=this.adjacent[i].pieces.getBattleBoardAmphibAssaultDetails(this,roll,allowUnlanded);
            bbaad.html+=bbaaad.html;
            bbaad.count+=bbaaad.count;
            bbaad.units+=bbaaad.units;
            bbaad.oneTimeShots+=bbaaad.oneTimeShots;
         }
      return bbaad;
   },
   preAmphibiousAssaultBattlesResolved:function()
   {
      if (this.amphibiousAssaulted>0)
         for (var i=0;i<this.adjacent.length;i++)
            if (this.adjacent[i].isSeaZone() &&
                this.adjacent[i].isAmphibiousAssaulting(this) &&
                this.adjacent[i].isEnemyOccupied())
               return false;
      return true;
   },
   antiaircraftFireResolved:function()
   {
      return (this.pieces.antiaircraftFireCount()==0);
   },
   shotDownSomePlanesHtml:function()
   {
      var html="";
      html+="<div style=\"border:2px solid #000000;background-color:#ffffff;\" style=\"text-align:center\">";
      var buttons=this.game.getButtonHtml(this.game.resource(20),"removePlaneHits",this.game.event("removePlaneHitsAtIndex("+this.index+")",true));
      if (this.game.isLog)
         buttons=this.game.logMovementButtons(false);
      html+=this.game.resource(109,
                               't',this.title.htmlEncode(),
                               'r',this.pieces.shotDownSomePlanesHtml(this.combatRolls),
                               'd',buttons);
      html+="</div>";
      return html;
   },
   shootDownSomePlanesHtml:function()
   {
      var html="";
      html+="<div style=\"border:2px solid #000000;background-color:#ffffff;\" style=\"width:350px\">";
      html+=this.game.resource(108,
                               't',this.title.htmlEncode());
      html+="</div>";
      this.combatRolls=this.game.diceRolls(this.pieces.antiaircraftFireCount());
      this.game.log.record(281,this.index,this.preMoveLogPowerIndex,escape(this.pieces.antiaircraftFireLog(this.combatRolls)));
      if (this.game.testing)
         window.setTimeout(this.game.event("sendMove()"),1);
      else
         this.game.sendMove();
      return html;
   },
   strategicBombingRaidResolved:function()
   {
      return (this.pieces.getStrategicBombingRaidInfo().bombs==0);
   },
   droppedSomeBombsHtml:function()
   {
      var html="";
      var damage=0;
      for (var i=0;i<this.combatRolls.length;i++)
         damage+=this.combatRolls[i];
      html+="<div style=\"border:2px solid #000000;background-color:#ffffff;\" style=\"text-align:center\">";
      var buttons=this.game.getButtonHtml(this.game.resource(20),"cleanUpStrategicBombingRaid",this.game.event("cleanUpStrategicBombingRaidAtIndex("+this.index+")",true));
      var roller=this.game.resource(294);
      if (this.game.isLog)
      {
         buttons=this.game.logMovementButtons(false);
         roller=this.game.move.player.team.title.htmlEncode();
      }
      html+=this.game.resource(111,
                               'y',roller,
                               't',this.title.htmlEncode(),
                               'r',this.pieces.droppedSomeBombsHtml(this.combatRolls),
                               'e',this.holdingPower().title.htmlEncode(),
                               'b',damage,
                               'i',this.defendersHit,
                               'd',buttons);
      html+="</div>";
      return html;
   },
   dropSomeBombsHtml:function()
   {
      var html="";
      html+="<div style=\"border:2px solid #000000;background-color:#ffffff;\" style=\"width:350px\">";
      html+=this.game.resource(110,
                               't',this.title.htmlEncode());
      html+="</div>";

      var strategicInfo=this.pieces.getStrategicBombingRaidInfo()
      this.combatRolls=this.game.diceRolls(strategicInfo.bombs);
      var damage=0;
      for (var i=0;i<this.combatRolls.length;i++)
         damage+=this.combatRolls[i];
      var holdingPower=this.holdingPower();
      if (damage>=holdingPower.ipcs)
         this.defendersHit=holdingPower.ipcs;
      else
         this.defendersHit=damage;
      holdingPower.ipcs-=this.defendersHit;

      this.game.log.record(288,this.index,this.preMoveLogPowerIndex,strategicInfo.planes,strategicInfo.bombs,damage,this.defendersHit,this.combatRolls.join(""));

      if (this.game.testing)
         window.setTimeout(this.game.event("sendMove();"),1);
      else
         this.game.sendMove();
      return html;
   },
   amphibiousAssaultOptionsHtml:function()
   {
      var html="";
      if (!this.amphibiousAssaultOptions)
         this.amphibiousAssaultOptions=new GamesByEmail.WW2AmphibiousAssaultOptions(this);
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.game.board.image.size.x*2/3)+"px\" height=\""+Math.floor(this.game.board.image.size.y*2/3)+"px\">";
      html+="<tr><td colspan=3>";
      html+=this.game.resource(113,
                               'B',this.game.backButton(),
                               't',this.title.htmlEncode(),
                               'A',this.game.getButtonHtml(this.game.resource(36),""),
                               'a',this.game.getButtonHtml(this.game.resource(57),""),
                               'R',this.game.getButtonHtml(this.game.resource(37),""),
                               'r',this.game.getButtonHtml(this.game.resource(58),""),
                               'H',this.game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td nowrap width=\"100%\">"+this.game.resource(115)+"</td><td nowrap width=\"83px\">"+this.game.resource(116)+"</td><td nowrap width=\"90px\">"+this.game.resource(117)+"</td></tr><tr>";
      html+="<td colspan=3 style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:100%;overflow:scroll;overflow-y:scroll;background-color:"+(this.amphibiousAssaultOptions.length%2==0 ? "#ffffff" : "#eeeeee")+"\">";
      html+=this.amphibiousAssaultOptions.getHtml();
      html+="</div></td>";
      html+="</tr><tr><td colspan=3 align=left>";
      html+=this.game.resource(114,
                               'd',this.game.getButtonHtml(this.game.resource(20),"resolveCombatAmphibiousSet",this.game.event("resolveCombatAmphibiousSetAtIndex("+this.index+")",true)));
      html+="</td></tr></table>";
      return html;
   },
   staticafyAmphibiousAssaultVessels:function()
   {
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isSeaZone())
            this.adjacent[i].pieces.staticafyAmphibiousAssaultVessels(this);
   },
   amphibiousAssaultedCount:function()
   {
      var count=0;
      for (var i=0;i<this.pieces.length;i++)
         if (this.pieces[i].amphibiousAssault==this)
            count++;
      return count;
   },
   clearUnlandedAmphibiousUnits:function()
   {
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isSeaZone())
            this.adjacent[i].pieces.clearUnlandedAmphibiousUnits(this);
      this.amphibiousAssaulted=0;
   },
   updateAmphibiousAssault:function()
   {
      this.amphibiousAssaulted=0;
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isSeaZone())
            this.amphibiousAssaulted+=this.adjacent[i].pieces.amphibiousAssaultCount(this);
   },
   isAmphibiousAssaulting:function(territory)
   {
      return (this.pieces.amphibiousAssaultCount(territory)>0);
   },
   hitStringIndex:function()
   {
      if (this.defenderSeaUnitsHit==0 && this.attackerSeaUnitsHit==0)
         return 103;
      var index;
      if (this.defenderSeaUnitsHit==0)
         index=132;
      else
         if (this.defendersHit==0)
            index=135;
         else
            index=129;
      if (this.attackerSeaUnitsHit==0)
         index+=1;
      else
         if (this.attackersHit==0)
            index+=2;
      return index;
   },
   selectHitStringIndex:function()
   {
      if (this.attackerSeaUnitsHit==0)
         return 104;
      if (this.attackersHit==0)
         return 139;
      return 138;
   },
   hitString:function(hits,naval)
   {
      return this.game.resource((hits==1 ? 141 : 140)+(naval ? 2 : 0),'h',hits);
   },
   unitString:function(units,naval)
   {
      return this.game.resource((units==1 ? 145 : 144)+(naval ? 2 : 0),'u',units);
   },
   combatHtml:function()
   {
      var html="";
      var selectHits=false;
      var backButton=null;
      if (this.combatRolls)
      {
         this.pieces.hitDefenders(this.defenderSeaUnitsHit,true);
         this.pieces.hitDefenders(this.defendersHit,false);
         html+=this.game.resource(this.hitStringIndex(),
                                  'a',this.hitString(this.defendersHit),
                                  'A',this.hitString(this.defenderSeaUnitsHit,true),
                                  'd',this.hitString(this.attackersHit),
                                  'D',this.hitString(this.attackerSeaUnitsHit,true));
         if (this.game.isLog)
            html+=this.game.logMovementButtons(false);
         else
         {
            var attackingSeaUnitCount=this.pieces.attackingSeaUnitCount();
            if (attackingSeaUnitCount<this.attackerSeaUnitsHit)
               this.attackerSeaUnitsHit=attackingSeaUnitCount;
            if (this.attackersHit>0 || this.attackerSeaUnitsHit>0)
               if (this.pieces.allAttackersHit(this.attackersHit,this.attackerSeaUnitsHit))
               {
                  this.pieces.hitAllAttackers();
                  html+=this.game.resource(107,
                                           'd',this.game.getButtonHtml(this.game.resource(20),"removeHitPieces",this.game.event("removeHitPiecesAtIndex("+this.index+")",true)));
               }
               else
               {
                  html+=this.game.resource(this.selectHitStringIndex(),
                                           'i',this.game.elementId("attackersHit"),
                                           'I',this.game.elementId("attackerSeaUnitsHit"),
                                           'n',this.unitString(this.attackersHit),
                                           'N',this.unitString(this.attackerSeaUnitsHit,true),
                                           'd',this.game.getButtonHtml(this.game.resource(20),"removeHitPieces",this.game.event("removeHitPiecesAtIndex("+this.index+")",true),null,"disabled"));
                  selectHits=true;
               }
            else
               html+=this.game.getButtonHtml(this.game.resource(20),"removeHitPieces",this.game.event("removeHitPiecesAtIndex("+this.index+")",true));
            this.previousCombat=true;
         }
      }
      else
         if (this.game.isLog)
            html+=this.game.logMovementButtons(false);
         else
            if (!this.previousCombat)
            {
               if (this.amphibiousAssaulted>0 || this.amphibiousAssaultedCount()>0)
               {
                  if (this.isFriendlyOccupied())
                     html+=this.game.getButtonHtml(this.game.resource(101),"rollForCombat",this.game.event("rollForCombatAtIndex("+this.index+")",true));
                  else
                     html+=this.game.getButtonHtml(this.game.resource(333),"callOffAssault",this.game.event("callOffAssaultAtIndex("+this.index+")",true));
                  html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.game.getButtonHtml(this.game.resource(308),"resolveCombat",this.game.event("resolveCombatAtIndex("+this.index+")",true));
                  backButton=null;
               }
               else
               {
                  html+=this.game.getButtonHtml(this.game.resource(101),"rollForCombat",this.game.event("rollForCombatAtIndex("+this.index+")",true));
                  backButton="update";
               }
               html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.game.getButtonHtml(this.game.resource(122),"update",this.game.event("update()"));
            }
            else
            {
               html+=this.game.getButtonHtml(this.game.resource(101),"rollForCombat",this.game.event("rollForCombatAtIndex("+this.index+")",true));
               if (this.canRetreat())
               {
                  backButton="processGoBack";
                  html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.game.getButtonHtml(this.game.resource(123),"retreat",this.game.event("retreatAtIndex("+this.index+")",true));
               }
            }
      return this.battleBoardHtml(html,selectHits,false,backButton);
   },
   resolveAmphibiousCombatHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.game.board.image.size.x*1/2)+"px\">";
      html+="<tr><td>";
      html+=this.game.resource(99,
                               'B',this.game.backButton(),
                               't',this.title.htmlEncode(),
                               'c',this.game.getButtonHtml(this.game.resource(100),"update",this.game.event("update()")));
      html+="<p>";
      for (var i=0;i<this.adjacent.length;i++)
         if (this.adjacent[i].isSeaZone() &&
             this.adjacent[i].isAmphibiousAssaulting(this) &&
             this.adjacent[i].isEnemyOccupied())
            html+=this.game.getButtonHtml(this.adjacent[i].title,"resolveCombat",this.game.event("resolveCombatAtIndex("+this.adjacent[i].index+")",true));
      html+="</td></tr></table>";
      return html;
   },
   retreat:function()
   {
      this.game.setGamePrompts(this.retreatOptionsHtml());
   },
   retreatOptionsHtml:function()
   {
      var html="";
      var game=this.game;
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.game.board.image.size.x*1/2)+"px\">";
      html+="<tr><td>";
      html+=this.game.resource(124,
                               'B',game.falseBackButton("resolveCombatAtIndex",this.index),
                               't',this.title.htmlEncode(),
                               'H',game.tempHidePrompt);
      html+="</td></tr><tr><td style=\"padding:10px\">";
      for (var i=0;i<this.retreatTerritories.length;i++)
         if (this.canRetreatToTerritory(this.retreatTerritories[i]))
            html+=game.getButtonHtml(game.resource(125,'t',this.retreatTerritories[i].title),"retreatTo_"+this.retreatTerritories[i].index,game.event("retreatToAtIndex("+this.index+","+this.retreatTerritories[i].index+")",true))+" ";
      html+="</td></tr><tr><td align=center>";
      html+=game.getButtonHtml(game.resource(126),"resolveCombat",game.event("resolveCombatAtIndex("+this.index+")",true));
      html+="</td></tr></table>";
      return html;
   },
   retreatTo:function(territory)
   {
      var pieces=this.pieces.retreatTo(territory);
      this.updateBlink();
      this.game.log.mode=1;
      this.game.log.record(277,this.index,this.preMoveLogPowerIndex,territory.index,territory.preMoveLogPowerIndex,escape(pieces));
      this.game.log.record(278,this.index,this.preMoveLogPowerIndex);
      this.game.log.mode=0;
      this.game.sendMove(false);
      this.game.update(false);
   },
   addRetreatTerritory:function(territory)
   {
      for (var i=0;i<this.retreatTerritories.length;i++)
         if (this.retreatTerritories[i]==territory)
            return;
      var index=0;
      while (index<this.retreatTerritories.length && this.retreatTerritories[index].index<territory.index)
         index++;
      for (var i=this.retreatTerritories.length;i>index;i--)
         this.retreatTerritories[i]=this.retreatTerritories[i-1];
      this.retreatTerritories[index]=territory;
   },
   addRetreatTerritories:function(territories)
   {
      for (var i=0;i<territories.length;i++)
         this.addRetreatTerritory(territories[i]);
   },
   updateRetreatTerritories:function()
   {
      this.retreatTerritories=new Array();
      if (this.unitMoves)
         for (var i=0;i<this.unitMoves.length;i++)
         {
            var attackMove=this.unitMoves[i];
            for (var j=0;j<attackMove.paths.length;j++)
            {
               var path=attackMove.paths[j];
               if (path.numMoved>0)
                  this.addRetreatTerritories(path.territories);
            }
         }
      if (this.retreatTerritories.length==0)
         this.retreatTerritories=null;
   },
   canRetreat:function()
   {
      if (this.retreatTerritories)
         for (var i=0;i<this.retreatTerritories.length;i++)
            if (this.canRetreatToTerritory(this.retreatTerritories[i]))
               return true;
      return false;
   },
   canRetreatToTerritory:function(territory)
   {
      if (this.pieces.canRetreatToTerritory(territory))
         if (this.isLand())
            return (territory.isFriendly() && this.shortestPathLength(territory,this.pieces.retreatRange())>=0);
         else
            return (!territory.isEnemyOccupied() && this.shortestPathLength(territory,this.pieces.retreatRange())>=0);
      return false;
   },
   shortestPathLength:function(territory,range)
   {
      return this.getShortestPathLength(new Array(),this,territory,0,range);
   },
   getShortestPathLength:function(path,territory,target,depth,range)
   {
      path[depth]=territory;
      if (territory==target)
         return 0;
      if (depth>=range)
         return -1;
      for (var i=0;i<depth-1;i++)
         if (path[i]==territory)
            return -1;
      var newDepth=-1;
      for (var i=0;i<territory.adjacent.length;i++)
      {
         var D=this.getShortestPathLength(path,territory.adjacent[i],target,depth+1,range)+1;
         if (D>0 && (newDepth<0 || D<newDepth))
            newDepth=D;
      }
      return newDepth;
   },
   processNonCombat:function()
   {
      if (this.unitMoves)
      {
         this.unitMoves.processNonCombat();
   //      this.unitMoves=null;
      }
   },
   markDefenseOrderingNeeded:function()
   {
      this.defenseOrderingNeeded=(this.pieces.hasOneOfOurCombatUnits(this.game.player.team) &&
                                  this.pieces.hasMoreThanOneTypeOfCombatUnit());
   },
   maximumOutput:function()
   {
      if (this.holdingPowerIndex!=this.game.player.team.powerIndex || this.conqueredThisTurn)
         return 0;
      if (this.holdingPowerIndex==this.originalPowerIndex && this.originalIndustrialComplex)
         return 10000;
      if (this.hasIndustry())
         return this.ipcValue;
      return 0;
   },
   clearMoves:function()
   {
      this.landPlanesOptions=null;
      this.amphibiousAssaultOptions=null;
      this.unitAttackMoves=null;
      this.unitNonCombatMoves=null;
      this.unitMoves=null;
   },
   undoNonCombat:function()
   {
      if (this.unitNonCombatMoves)
      {
         this.unitNonCombatMoves.undoAll();
         this.unitNonCombatMoves=null;
      }
   },
   undoAllLandings:function()
   {
      for (var i=this.pieces.length-1;i>=0;i--)
      {
         var p=this.pieces[i];
         if (p.unit==5)
            p.amphibiousAssault=null;
         else
            p.undoUnload(this);
      }
   },
   clearUnitsManufactured:function()
   {
      this.numUnitsManufactured=0;
   },
   incrementUnitsManufactured:function()
   {
      if (this.isSeaZone())
      {
         var mostRoom=0;
         var mostRoomIndex=-1;
         for (var i=0;i<this.adjacent.length;i++)
         {
            var o=this.adjacent[i].maximumOutput();
            var room=o-this.adjacent[i].numUnitsManufactured;
            if (room>mostRoom)
            {
               mostRoomIndex=i;
               mostRoom=room;
            }
         }
         this.adjacent[mostRoomIndex].incrementUnitsManufactured();
      }
      else
         this.numUnitsManufactured++;
   },
   decrementUnitsManufactured:function()
   {
      if (this.isSeaZone())
      {
         var leastRoom=2000000000;
         var leastRoomIndex=-1;
         for (var i=0;i<this.adjacent.length;i++)
         {
            var o=this.adjacent[i].maximumOutput();
            var room=o-this.adjacent[i].numUnitsManufactured;
            if (room<leastRoom && this.adjacent[i].numUnitsManufactured>0)
            {
               leastRoomIndex=i;
               leastRoom=room;
            }
         }
         this.adjacent[leastRoomIndex].decrementUnitsManufactured();
      }
      else
         this.numUnitsManufactured--;
   },
   canManufactureAnother:function()
   {
      if (this.isSeaZone())
      {
         for (var i=0;i<this.adjacent.length;i++)
            if (this.adjacent[i].isLand() &&
                this.adjacent[i].canManufactureAnother())
               return true;
         return false;
      }
      return (this.maximumOutput()-this.numUnitsManufactured>0);
   },
   recordUnitMovement:function(phase)
   {
      if (phase==6 && this.unitAttackMoves)
         this.unitAttackMoves.recordUnitMovement(phase);
      else
         if (phase==9 && this.unitNonCombatMoves)
            this.unitNonCombatMoves.recordUnitMovement(phase);
   },
   recordLandedPlanes:function(phase)
   {
      if (this.landPlanesOptions)
         this.landPlanesOptions.recordLandedPlanes(phase);
   },
   defensiveRetreatRank:function(power)
   {
      var rank=0;
      for (var i=0;i<this.pieces.length;i++)
         if (!this.pieces[i].isFriendly())
            rank++;
      var capitalCenter=this.territories.findCapital(power).polygon.rectangle.getCenter();
      var territoryCenter=this.polygon.rectangle.getCenter();
      var dist1=territoryCenter.distance(capitalCenter);
      capitalCenter.x-=this.game.board.image.size.x/2;
      if (capitalCenter.x<0)
         capitalCenter.x+=this.game.board.image.size.x;
      territoryCenter.x-=this.game.board.image.size.x/2;
      if (territoryCenter.x<0)
         territoryCenter.x+=this.game.board.image.size.x;
      var dist2=territoryCenter.distance(capitalCenter);
      if (dist2<dist1)
         dist1=dist2;
      rank+=(10000-dist1)/10000;
      return rank;
   },
   shouldDefensiveSubsRetreat:function()
   {
      var retreatTo=null;
      var numSubs=0;
      var firstSub=null;
      for (var i=0;i<this.pieces.length;i++)
      {
         var piece=this.pieces[i];
         if (!piece.isFriendly())
            if (piece.unit==8)
            {
               numSubs++;
               if (firstSub==null)
                  firstSub=piece;
            }
            else
               break;
      }
      if (numSubs>0)
      {
         var numNonAir=0,numAir=0;
         for (var i=0;i<this.pieces.length;i++)
         {
            var piece=this.pieces[i];
            if (piece.isFriendly())
               if (piece.isAirUnit())
                  numAir++;
               else
                  numNonAir++;
         }
         if (numAir>0 && numNonAir==0)
         {
            var oldRank=0;
            for (var i=0;i<this.adjacent.length;i++)
            {
               var retreat=this.adjacent[i];
               if (retreat.isSeaZone() &&
                   !this.isCanalTransitBlocked(retreat,firstSub.owner.team.powerIndex) &&
                   !retreat.isFriendlyOccupied())
               {
                  var rank=retreat.defensiveRetreatRank(firstSub.owner);
                  if (retreatTo==null ||
                      rank>oldRank)
                  {
                     retreatTo=retreat;
                     oldRank=rank;
                  }
               }
            }
         }
      }
      return retreatTo;
   },
   retreatDefensiveSubs:function(toTerritory)
   {
      var subs="";
      for (var i=0;i<this.pieces.length;i++)
      {
         var piece=this.pieces[i];
         if (!piece.isFriendly())
            if (piece.unit==8)
            {
               subs+=piece.getPieceString();
               toTerritory.pieces.addPiece(this.pieces.removePiece(piece));
               i--;
            }
            else
               break;
      }
      this.pieces.updateBoard();
      toTerritory.pieces.updateBoard();
      return subs;
   },
   dispose:function()
   {
      if (GamesByEmail.Territory.prototype.dispose) GamesByEmail.Territory.prototype.dispose.call(this);
   },
   setAdjacent:GamesByEmail.Territory.prototype.setAdjacent,
   getHiliteImage:GamesByEmail.Territory.prototype.getHiliteImage,
   setHilite:GamesByEmail.Territory.prototype.setHilite,
   setBlink:GamesByEmail.Territory.prototype.setBlink,
   hideHilite:GamesByEmail.Territory.prototype.hideHilite,
   showHilite:GamesByEmail.Territory.prototype.showHilite,
   showHiliteIfOurs:GamesByEmail.Territory.prototype.showHiliteIfOurs,
   isColor:GamesByEmail.Territory.prototype.isColor,
   isOurs:GamesByEmail.Territory.prototype.isOurs,
   appendHtml:GamesByEmail.Territory.prototype.appendHtml,
   event:GamesByEmail.Territory.prototype.event
};
GamesByEmail.WW2Territory.getTypePath=GamesByEmail.Territory.getTypePath;
GamesByEmail.WW2Territory.isInstanceOf=GamesByEmail.Territory.isInstanceOf;
GamesByEmail.WW2Territory.$constructor();


GamesByEmail.WW2Territories=function(){var $_=null;if(this.constructor==arguments.callee){$_=new Array;$_.constructor=arguments.callee;for(var i in arguments.callee.prototype)$_[i]=arguments.callee.prototype[i];}(function()
{
   GamesByEmail.Territories.apply(this,arguments);
   this.blinkHandle=null;
}).apply($_!=null?$_:this,arguments);if($_!=null)return $_;};
GamesByEmail.WW2Territories.$parentClass=GamesByEmail.Territories;
if (!GamesByEmail.Territories.$childClasses) GamesByEmail.Territories.$childClasses=new Array();
GamesByEmail.Territories.$childClasses.push(GamesByEmail.WW2Territories);
GamesByEmail.WW2Territories.$constructor=GamesByEmail.Territories.$constructor ? GamesByEmail.Territories.$constructor : function(){};
GamesByEmail.WW2Territories.$interfaces=new Array();
GamesByEmail.WW2Territories.$name="WW2Territories";
GamesByEmail.WW2Territories.$childClasses=new Array();
GamesByEmail.WW2Territories.$container=GamesByEmail;
GamesByEmail.WW2Territories.prototype={
   constructor:GamesByEmail.WW2Territories,
   territoryAtPoint:function(point)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].containsPoint(point))
            return this[i];
      return null;
   },
   setString:function(strings)
   {
      strings=strings.split('|');
      for (var i=0;i<strings.length;i++)
         this[i].setString(strings[i]);
      this.updateAmphibiousAssault();
      this.updateBlink();
   },
   getString:function()
   {
      var string="";
      for (var i=0;i<this.length;i++)
      {
         if (i>0)
            string+='|';
         string+=this[i].getString();
      }
      return string;
   },
   updateBlink:function(blinkChanged)
   {
      if (arguments.length<1)
         blinkChanged=false;
      for (var i=0;i<this.length;i++)
         blinkChanged|=this[i].updateBlink();
      this.game.updateCompassHilite(false);
   },
   updateAmphibiousAssault:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].updateAmphibiousAssault();
   },
   needsCombatResolved:function()
   {
      for (var i=0;i<this.length;i++)
         if (this[i].needsCombatResolved())
            return true;
      return false;
   },
   needsPlanesLanded:function()
   {
      for (var i=0;i<this.length;i++)
         if (this[i].needsPlanesLanded())
            return true;
      return false;
   },
   findCombat:function()
   {
      for (var i=0;i<this.length;i++)
         if (this[i].combatRolls)
            return this[i];
      return null;
   },
   getNpl:function(power)
   {
      var npl=0;
      for (var i=0;i<this.length;i++)
         if (this[i].holdingPower()==power)
            npl+=this[i].ipcValue;
      return npl;
   },
   findCapital:function(power)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].isCapital &&
             this[i].originalPowerIndex==power.powerIndex)
            return this[i];
      return null;
   },
   isCapitalHeld:function(power)
   {
      return (this.findCapital(power).holdingPowerIndex==power.powerIndex);
   },
   updateRetreatTerritories:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].updateRetreatTerritories();
   },
   conquerBlitzedAndUnopposed:function()
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         if (this[i].isBlitzedOrUnopposed())
         {
            this[i].conquer();
            count++;
         }
      return count;
   },
   countToBeConqueredBlitzedAndUnopposedRussian:function()
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         if (this[i].isBlitzedOrUnopposed() && this[i].preMoveLogPowerIndex==0) {
            count++;
         }
      return count;
   },
   setFirstAttack:function()
   {
      for (var i=0;i<this.length;i++)
         if (this[i].needsCombatResolved())
            this[i].firstAttack=true;
   },
   processNonCombat:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].processNonCombat();
   },
   clearUnitMoves:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].unitMoves=null;
   },
   autoLandOrCrashExtraEnemyFighters:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].autoLandOrCrashExtraEnemyFighters();
   },
   clearMoves:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].clearMoves();
   },
   markDefenseOrderingNeeded:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].markDefenseOrderingNeeded();
   },
   defenseOrderingNeeded:function()
   {
      for (var i=0;i<this.length;i++)
         if (this[i].defenseOrderingNeeded)
            return true;
      return false;
   },
   orderRemainingByCost:function()
   {
      for (var i=0;i<this.length;i++)
         if (this[i].defenseOrderingNeeded)
         {
            this[i].defenseOrderingNeeded=false;
            this[i].orderCombatUnitsByCost();
         }
   },
   clearForNextTurn:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].clearForNextTurn();
   },
   liberateRest:function(power,logPhase)
   {
      for (var i=0;i<this.length;i++)
      {
         var territory=this[i];
         var originalPower=territory.originalPower();
         var holdingPower=territory.holdingPower();
         if (originalPower &&
             originalPower==power &&
             holdingPower &&
             originalPower!=holdingPower &&
             originalPower.team==holdingPower.team)
         {
            this.game.log.recordPhase(logPhase,263,territory.index,territory.preMoveLogPowerIndex,originalPower.powerIndex);
            territory.setHoldingPower(originalPower.powerIndex);
         }
      }
   },
   clearUnitsManufactured:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].clearUnitsManufactured();
   },
   teamHasIndustrialComplex:function(team)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].holdingPower()==team &&
             this[i].hasIndustry())
            return true;
      return false;
   },
   teamHasPlayableCombatUnits:function(team)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].pieces.teamHasPlayableCombatUnits(team))
            return true;
      return false;
   },
   recordUnitMovement:function(phase)
   {
      for (var i=this.length-1;i>=0;i--)
         this[i].recordUnitMovement(phase);
   },
   recordLandedPlanes:function(phase)
   {
      for (var i=0;i<this.length;i++)
         this[i].recordLandedPlanes(phase);
   },
   dispose:function()
   {
      if (GamesByEmail.Territories.prototype.dispose) GamesByEmail.Territories.prototype.dispose.call(this);
   },
   indexOf:GamesByEmail.Territories.prototype.indexOf,
   findAtPoint:GamesByEmail.Territories.prototype.findAtPoint,
   hideHilites:GamesByEmail.Territories.prototype.hideHilites,
   mouseEvent:GamesByEmail.Territories.prototype.mouseEvent,
   clearMouseEvents:GamesByEmail.Territories.prototype.clearMouseEvents,
   appendOverlayHtml:GamesByEmail.Territories.prototype.appendOverlayHtml,
   appendHtml:GamesByEmail.Territories.prototype.appendHtml,
   updateBoardImageSize:GamesByEmail.Territories.prototype.updateBoardImageSize,
   setBlink:GamesByEmail.Territories.prototype.setBlink,
   blinkEvent:GamesByEmail.Territories.prototype.blinkEvent,
   clearBlink:GamesByEmail.Territories.prototype.clearBlink
};
GamesByEmail.WW2Territories.getTypePath=GamesByEmail.Territories.getTypePath;
GamesByEmail.WW2Territories.isInstanceOf=GamesByEmail.Territories.isInstanceOf;
GamesByEmail.WW2Territories.$constructor();



GamesByEmail.WW2Game=function()
{
   GamesByEmail.Game.apply(this,arguments);
   this.logSettings.format=GamesByEmail.LogSettings.FORMAT.ROW_BY_MOVE;
   this.logSettings.placement=GamesByEmail.LogSettings.PLACEMENT.BOTTOM;
   this.logSettings.color=GamesByEmail.LogSettings.COLOR.NONE;
   this.developments=this.getDevelopments();
   this.units=this.newUnits();
   this.log=new GamesByEmail.WW2Log(this);
   this.trackGamePrompts=null;
   this.trackGamePromptsShouldBeVisible=false;
   this.gamePrompts=null;
   this.gamePromptsShouldBeVisible=false;
   this.compassPrompts=null;
   this.compassRoseBlink=false;
};
GamesByEmail.WW2Game.$parentClass=GamesByEmail.Game;
if (!GamesByEmail.Game.$childClasses) GamesByEmail.Game.$childClasses=new Array();
GamesByEmail.Game.$childClasses.push(GamesByEmail.WW2Game);
GamesByEmail.WW2Game.$constructor=GamesByEmail.Game.$constructor ? GamesByEmail.Game.$constructor : function(){};
GamesByEmail.WW2Game.$interfaces=new Array();
GamesByEmail.WW2Game.$name="WW2Game";
GamesByEmail.WW2Game.$childClasses=new Array();
GamesByEmail.WW2Game.$container=GamesByEmail;
GamesByEmail.WW2Game.prototype={
   constructor:GamesByEmail.WW2Game,
   initialize:function(numPlayers,turnTeamIndex)
   {
      var allies=this.teams.add();
          allies.status.nonPlaying=true;
          var ussr=allies.teams.add();
              ussr.players.add().id=0;
              ussr.status.inPlay=true;
          var unitedKingdom=allies.teams.add();
              unitedKingdom.players.add().id=2;
              unitedKingdom.status.inPlay=true;
          var unitedStates=allies.teams.add();
              unitedStates.players.add().id=4;
              unitedStates.status.inPlay=true;
      var axis=this.teams.add();
          axis.status.nonPlaying=true;
          var germany=axis.teams.add();
              germany.players.add().id=1;
              germany.status.inPlay=true;
          var japan=axis.teams.add();
              japan.players.add().id=3;
              japan.status.inPlay=true;
      this.move.log=this.logEntry(54);

      var useOriginal=true;
      useOriginal=false;
      if (useOriginal || GamesByEmail.inProduction())
      {
         // original
         if (this.info.getValue("b_WeaponsDevelopmentBenefits"))
         		this.info["board"]="0|||~:24|j:32|:30|s:25|:36~|T|-|;:|||::||G||G|     |VTT|G|;|/.---|]XWVUTT||  |/.---||IGG|||610/..----||T|<::||PKJIHGGG|)$\"!   |||GG|.-|IGGG|||T||G|||G||||IGG||)$\"!!    ||TT|G|61.--|!  ||||:||/..---|:|C>=<<;::||G||:|1/..--|]XVTT|   |45|||LMI||24|||||A|B|[|||||ZV\\|A|LN|('|||||||||||||||N||O||||||||||5|?A|||||?|Y[|||~~5";
         else
         		this.info["board"]="0|||~:24|:32|:30|:25|:36~|T|-|;:|||::||G||G|     |VTT|G|;|/.---|]XWVUTT||  |/.---||IGG|||610/..----||T|<::||PKJIHGGG|)$\"!   |||GG|.-|IGGG|||T||G|||G||||IGG||)$\"!!    ||TT|G|61.--|!  ||||:||/..---|:|C>=<<;::||G||:|1/..--|]XVTT|   |45|||LMI||24|||||A|B|[|||||ZV\\|A|LN|('|||||||||||||||N||O||||||||||5|?A|||||?|Y[|||~~5";
         ussr.status.myTurn=true;
      }
      else
      {
         GamesByEmail.Game.prototype.initialize.call(this,2,turnTeamIndex);
         this.type=33;
         this.info.b_UssrNoCombatFirstRound="False";
         this.info.b_NoAxisEconomicVictory="False";
         this.info.b_WeaponsDevelopmentBenefits="True";
         this.info.b_MustControlStraits="True";
         this.info.b_NoNewFactories="False";
         this.info.b_InfDefendAt1="False";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.board="0|||~:25|j:34|:30|s:31|:32~||	h2	:||||||||G| |	h3	GGG|G|;|.---|]XTT|||//.-----|:|III||;|61|	h1	|	h3	H|||PKJGGG|)$\"\"!!!                       ||:||.-||||T||G||    |G||||G||)  ||	h3	GG|G|610//...----|||||	h1	--||||C>WV;;::::::::||G||U:T|1//....--|]XVTTT|!   $||||||344||||||24|[[[[||A|||LLMIIN||NNN||||[|||||||||||||||||||||||||?(\'AAAA|||||||Y||~~5~0";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=false;
         this.teams[0].teams[1].status.myTurn=false;
         this.teams[0].teams[2].status.myTurn=false;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=true;
         this.move.number=56;
         this.move.player="0,1,0";
         return;
         this.type=33;
         this.info.b_UssrNoCombatFirstRound="True";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.b_NoAxisEconomicVictory="True";
         this.info.b_WeaponsDevelopmentBenefits="True";
         this.info.b_MustControlStraits="True";
         this.info.b_NoNewFactories="False";
         this.info.b_InfDefendAt1="False";
         this.info.board="0|||~:24|:32|:30|:25|:36~|T|-|;:|||::||G||G|     |VTT|G|;|/.---|]XWVUTT||  |/.---||IGG|||610/..----||T|<::||PKJIHGGG|)$\"!   |||GG|.-|IGGG|||T||G|||G||||IGG||)$\"!!    ||TT|G|61.--|!  ||||:||/..---|:|C>=<<;::||G||:|1/..--|]XVTT|   |45|||LMI||24|||||A|B|[|||||ZV\\|A|LN|(\'|||||||||||||||N||O||||||||||5|?A|||||?|Y[|||~~5";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=true;
         this.teams[0].teams[1].status.myTurn=false;
         this.teams[0].teams[2].status.myTurn=false;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=false;
         this.move.number=870;
         this.move.player="0,1,0";
         return;
         this.type=33;
         this.info.b_UssrNoCombatFirstRound="False";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.b_NoAxisEconomicVictory="True";
         this.info.b_WeaponsDevelopmentBenefits="True";
         this.info.b_MustControlStraits="False";
         this.info.b_NoNewFactories="True";
         this.info.board="0|||~:35|j:0|:41|s:38|:44~|TT|	h2	|>::::::::::::::|||	h3	|||||||||	h2	TTT|]XTT||T|	h0	||	h0	|	h3	||	h0	)$||	h3	|=====<<;;;;;;!||PKIHHGGGGGGGG|)$TTTTTTTTTTTTTTTTTTTT|||	h4	U|	h2	|HHGGGGGGGGGG||UUTTT|T|||	h3	| ||| ||||)$U!!!   ::::::::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT                                 ||WWVVVV\"UUU!!!!!!!!!!!!!                    ||	h4	]XTTTTTT|	h3	||||;;;:::::::::::::||	h2	||C=||||UUTTTTTTTTTTTTTTTT|	h2	>|]XTTTTTTT|	h3	HHHGGGGGGGG||||||||||||@<<AAAAAAA||||||||LLMIONNNNNNNN||||Y[[[[[||||||||||||||||||||||||||||||||||~~5";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=false;
         this.teams[0].teams[1].status.myTurn=true;
         this.teams[0].teams[2].status.myTurn=false;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=false;
         this.move.number=568;
         this.move.player="0,0,0";
         return;
         
         this.type=33;
         this.info.b_UssrNoCombatFirstRound="True";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.b_NoAxisEconomicVictory="True";
         this.info.b_WeaponsDevelopmentBenefits="True";
         this.info.b_MustControlStraits="True";
         this.info.b_NoNewFactories="False";
         this.info.board="0|||~:23|j:23|:38|s:57|:34~||	h2	|::|||	h3	||||||	h3	|||	h2	>;:::::::|]XW||	h3	GGG|	h0	|	h3	G|PKGGG|	h3	||61/0-------||T|	h3	PGGG|	h3	H|PKG|)$        |!!!!!       |U||	h2	|PKGGG||T||||	h3	| ||| ||||)$\"\"  ||	h3	IIHHH||61--|	h3	||||	h1	||	h0	||C>;;;:::::::||||WWUUTTTTTTTTT|.-|]X|	h3	|@<<AAAAA||||||||||||[[||||||||||N||||||||||||||N||||||||||||||||||L|LN||~~5";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=false;
         this.teams[0].teams[1].status.myTurn=true;
         this.teams[0].teams[2].status.myTurn=false;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=false;
         this.move.number=227;
         this.move.player="1,0,0";
         return;
         
         this.type=33;
         this.info.b_UssrNoCombatFirstRound="True";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.b_NoAxisEconomicVictory="True";
         this.info.b_WeaponsDevelopmentBenefits="True";
         this.info.b_MustControlStraits="False";
         this.info.b_NoNewFactories="True";
         this.info.board="2|6|1|~:27|j:0|jr:64|si:36|jrh:31~|T|	h2	;::::::::||||	h3	||G||G|>|	h3	JIIIHHHHHHHHHHHGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG|G||	h2	        TTTTTTTTTT|]|||	h0	X||GG|||	h2	C>;:::::::::||	h3	|||PKHHHHHHHGGG|)$        :::::||||	h2	|GGGGGGGGGGG||UUUUUUTTTX|T||G|	h3	|==TTTTTTTTTTT    |||||||)$!!!;;;;;;TTTTTTT    ||W\"\"VV<!!!!!!!!!!!!!!!!!!!!UUUUUUUTTTTTTTTTTT                                                   ||	h2	C=::|	h3	||||||	h4	||C>|||||	h2	>|]|	h3	GG||||||A||||||||||||||LNNNNNNNN||||||||||||||||||||||||||||?AAAAA|||||||ZVV\\\\\\\\|Y[[[[[[[||~~5";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=false;
         this.teams[0].teams[1].status.myTurn=false;
         this.teams[0].teams[2].status.myTurn=true;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=false;
         this.move.number=450;
         this.move.player="0,2,0";
         return;
         
         this.type=33;
         this.info.b_UssrNoCombatFirstRound="True";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.b_NoAxisEconomicVictory="True";
         this.info.board="0|||~:23|:29|:30|:45|:35~|T|	h4	|T|||::|T|||G||	h3	|G|TTTTTTT|1--------|]XTTTTTTTTTTT|||	h2	||PHHH|||610-----------||T|	h3	PHHH|	h1	|PK|)$\"\"           |	h3	H|	h1	-||	h4	|PHHH|||T||G||	h3	HH|||	h3	H||||)$::::||	h3	JIIGGG||6|	h3	||||||	h0	 |	h1	|C>;;:::::::::::|||||1..|]XTTTT|	h3	G|||||||||||||[[||NN|||||LM|||||||||||||||||||||||||||||Y@[[[[AAAA||N|||||||~~5";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=false;
         this.teams[0].teams[1].status.myTurn=false;
         this.teams[0].teams[2].status.myTurn=true;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=false;
         return;
         
         this.info.b_UssrNoCombatFirstRound="True";
         this.info.b_UssrNoCombatUntilAttacked="True";
         this.info.b_NoAxisEconomicVictory="True";
         this.info.board="0|||~:26|:30|:26|:36|:40~||	h4	|T|||::|:|||G|::::|	h3	|G|X|1///-------------|]X||!!!! |	h0	::::||IIIIIGGGGGGGGGGGGGGG||VW|610...----||T|C>\"\"<<<<<;;;::::::::::: |	h1	|PKIGGGGGGGG|)$W                             | |	h1	||	h4	:::|GGGGGGG|||T||G||      |G|| ||||)$||	h3	G|G|6---|	h3	||||||	h0	   |	h1	|C>:::::||G||TTTTTTTTTTTTT|.-------|]XUTTTTTTTTTTTT|	h3	IIGGGGGGGG||A||||||||||||||||||LLMONNNN||||||||||||||||||||||||||||YZ[[[[[[[\'|@AA|||||||||~~5";
         this.teams[0].status.myTurn=false;
         this.teams[0].status.inPlay=false;
         this.teams[0].status.nonPlaying=true;
         this.teams[0].teams[0].status.myTurn=false;
         this.teams[0].teams[1].status.myTurn=false;
         this.teams[0].teams[2].status.myTurn=true;
         this.teams[1].status.myTurn=false;
         this.teams[1].status.inPlay=false;
         this.teams[1].status.nonPlaying=true;
         this.teams[1].teams[0].status.myTurn=false;
         this.teams[1].teams[1].status.myTurn=false;
         return;
      }
      
      this.displayOptions();
   },
   displayOptions:function()
   {
      this.addNote("#Game Options");
      this.addNote("  -- " + (this.info.getValue("b_UssrNoCombatFirstRound") ? this.resource(343) : this.resource(344)));
      if (this.info.getValue("b_UssrNoCombatUntilAttacked"))
         this.addNote("  -- " + this.resource(353));
      this.addNote("  -- " + (this.info.getValue("b_NoAxisEconomicVictory") ? this.resource(345) : this.resource(346)));
      this.addNote("  -- " + (this.info.getValue("b_WeaponsDevelopmentBenefits") ? this.resource(347) : this.resource(348)));
      this.addNote("  -- " + (this.info.getValue("b_MustControlStraits") ? this.resource(349) : this.resource(350)));
      if (this.info.getValue("b_NoNewFactories"))
      	this.addNote("  -- " + this.resource(351));
		if (this.info.getValue("b_InfDefendAt1"))
      	this.addNote("  -- " + this.resource(352));
   },
   initializePowers:function()
   {
      if (typeof(this.player.team.powerIndex)=="undefined")
      {
         this.allies=this.teams[0];
         this.allies.title=this.resource(0);
         this.allies.powerIndex=0;
         this.ussr=this.allies.ussr=this.allies.teams[0];
         this.ussr.title=this.resource(2);
         this.ussr.powerIndex=0;
         this.unitedKingdom=this.allies.unitedKingdom=this.allies.teams[1];
         this.unitedKingdom.title=this.resource(3);
         this.unitedKingdom.powerIndex=2;
         this.unitedStates=this.allies.unitedStates=this.allies.teams[2];
         this.unitedStates.title=this.resource(4);
         this.unitedStates.powerIndex=4;
         this.axis=this.teams[1];
         this.axis.title=this.resource(1);
         this.axis.powerIndex=1;
         this.germany=this.axis.germany=this.axis.teams[0];
         this.germany.title=this.resource(5);
         this.germany.powerIndex=1;
         this.japan=this.axis.japan=this.axis.teams[1];
         this.japan.title=this.resource(6);
         this.japan.powerIndex=3;
         this.allies.opposingTeam=this.axis;
         this.axis.opposingTeam=this.allies;
         this.powers=new Array();
         this.powers[0]=this.ussr;
         this.powers[1]=this.germany;
         this.powers[2]=this.unitedKingdom;
         this.powers[3]=this.japan;
         this.powers[4]=this.unitedStates;
         this.powers[5]={powerIndex:5};
         this.powersInitialized=true;
      }
   },
   maybeSwitchPower:function()
   {
      var e=this.getElement("rightLinks");
      if (e)
         this.setInnerHtml(e,this.getRightLinksHtml());
      if (!this.player.team.status.myTurn)
      {
         var powerIndex=this.player.team.powerIndex;
         for (var i=0;i<5;i++)
         {
            powerIndex++;
            if (powerIndex>4)
               powerIndex=0;
            if (this.powers[powerIndex].status.myTurn &&
                this.powers[powerIndex].id!=0 &&
                this.powers[powerIndex].players[0].id!=0)
            {
               this.player=this.powers[powerIndex].players[0];
               return true;
            }
         }
      }
      return false;
   },
   synch:function()
   {
      this.initializePowers();
      this.maybeSwitchPower();
      this.ussr.units=this.newUnits();
      this.unitedKingdom.units=this.newUnits();
      this.unitedStates.units=this.newUnits();
      this.germany.units=this.newUnits();
      this.japan.units=this.newUnits();
      this.mustStartAllOver=false;
      this.setString(this.info.getValue("board"),this.info.getValue("purchasedUnits",""));
      this.ussrNoCombatFirstRound=this.info.getValue("b_UssrNoCombatFirstRound");
      this.ussrNoCombatUntilAttacked=this.info.getValue("b_UssrNoCombatUntilAttacked");
      this.noAxisEconomicVictory=this.info.getValue("b_NoAxisEconomicVictory");
      this.weaponsDevelopmentBenefits=this.info.getValue("b_WeaponsDevelopmentBenefits");
      this.mustControlStraitsForSurfaceShipMovement=this.info.getValue("b_MustControlStraits");
      this.noNewFactories=this.info.getValue("b_NoNewFactories");
      this.infDefendAt1=this.info.getValue("b_InfDefendAt1");
      this.startingMovePhase=this.movePhase;
      this.clearMoves();
      if (this.movePhase==0)
         this.clearForNextTurn();
      var link=this.getElement("analyzeGameLink");
      if (link)
         link.href="http://fuzzylogicinc.net/aa/Dice.htm?url="+this.id;
   },
   getDevelopments:function()
   {
      var developments=GamesByEmail.deepCopy(this.resource("developments"));
      developments[1]=developments.jetPower;
      developments[2]=developments.rockets;
      developments[3]=developments.superSubmarines;
      developments[4]=developments.longRangeAircraft;
      developments[5]=developments.industrialTechnology;
      developments[6]=developments.heavyBombers;
      return developments;
   },
   newUnits:function()
   {
      var units=GamesByEmail.deepCopy(this.resource("units"));
      if (this.info.getValue("b_InfDefendAt1"))
      	units.infantry.defend=1;
      units[0]=units.infantry;
      units[1]=units.armor;
      units[2]=units.fighter;
      units[3]=units.bomber;
      units[4]=units.antiaircraftGun;
      units[5]=units.battleship;
      units[6]=units.aircraftCarrier;
      units[7]=units.transport;
      units[8]=units.submarine;
      units[9]=units.industry;
      units[12]=units.development;
      return units;
   },
   sendMove:function(sendNow)
   {
      this.info["board"]=this.getString();
      this.switched=false;
      this.setGamePrompts(" ");
      this.move.log=this.log.getMoves();
      GamesByEmail.Game.prototype.sendMove.call(this,sendNow);
   },
   getRightLinksHtml:function()
   {
      var html="";
      if (this.spectating)
         html+=this.resource(341,'a',this.openLogAnchorHtml());
      else
      {
         html+=this.resource(340,'a',this.openLogAnchorHtml());
         html+="<br>";
         html+=this.resource(306,'a',this.reportProblemAnchorHtml());
         html+="<br>";
         html+=this.resource(342,'a',this.getSpectatorAnchorHtml());
      }
      return html;
   },
   appendHtml:function(htmlBuilder)
   {
//      if (id=="onkeydown")
  //       return this.maybeStartTempHide(arg);
    //  if (id=="onkeyup")
      //   return this.maybeEndTempHide(arg);
      
      this.attachEvent(document,"onkeydown","maybeStartTempHide(event)");
      this.attachEvent(document,"onkeyup","maybeEndTempHide(event)");
      htmlBuilder.append(GamesByEmail.elementTitleHtml());
      htmlBuilder.append("<table cellspacing=0 cellpadding=0 ondragstart=\"return false;\" oncontextmenu=\"return false;\" style=\"width:1px\">");
      this.appendTestControlsHtml(htmlBuilder);
//      if (!this.testing && !this.isLog)
  //       htmlBuilder.append("<tr><td align=center style=\"border:1px solid #ff8888;background-color:#ffcccc\"><font color=maroon size=larger>Recent bugs crashed aircraft from carriers, and transformed fighting units into AA guns and industrial complexes.<br>Check game log, note move number, use report problem link to request roll back to move number.</font><br>It has been a rough 2 days, sorry for the hassles everyone!</td></tr>");
      htmlBuilder.append("<tr><td><table cellspacing=0 cellpadding=0 width=\"100%\">");
      if (!this.isLog)
      {
         htmlBuilder.append("<tr><td width=\"20%\">");
         htmlBuilder.append(this.resource(209,
                                  'a',this.getAnchorHtml(this.resource(211),"openFaq",this.event("openFaq(event)"))));
         htmlBuilder.append("<br>");
         htmlBuilder.append(this.resource(210,
                                  'a',this.getAnchorHtml(this.resource(212),"openUnitSheet",this.event("openUnitSheet(event)"))));
         if (!this.testing)
            htmlBuilder.append("<br><a id=\""+this.elementId("analyzeGameLink").htmlEncode()+"\" target=\"_analyzeGame\" href=\"http://fuzzylogicinc.net/aa/Dice.htm?url="+this.id+"\">Analyze Game Stats</a>");
         htmlBuilder.append("</td><td align=center id=\""+this.elementId("gameTitle")+"\" style=\"font-size:200%;font-weight:bold\">&nbsp;</td><td id=\""+this.elementId("rightLinks")+"\" wowrap width=\"20%\" align=right>");
         htmlBuilder.append(this.getRightLinksHtml());
         htmlBuilder.append("</td></tr></table></td></tr>");
      }
      htmlBuilder.append("<tr><td id=\""+this.elementId("teamTitles")+"\" >"+this.teamTitlesHtml(true)+"</td></tr>");
      htmlBuilder.append("<tr onselectstart=\"return false;\"><td align=left valign=top onselectstart=\"return false;\">");
      this.appendBoardHtml(htmlBuilder);
      htmlBuilder.append("</td></tr>");
      htmlBuilder.append("<tr><td width=\"100%\" id=\""+this.elementId("gameFooter")+"\"></td></tr>");
      if (!this.isLog)
      {
         htmlBuilder.append("<tr><td>");
         htmlBuilder.append("  <table cellspacing=\"1px\" cellpadding=0 border=0>");
         htmlBuilder.append("   <tr>");
         htmlBuilder.append("    <td colspan=2 id=\""+this.elementId("gameMessagePrompt")+"\"></td>");
         htmlBuilder.append("    <td rowspan=3 width=\"2%\" style=\"background-color:#ffffff\">&nbsp;</td>");
         htmlBuilder.append("    <td colspan=2 id=\""+this.elementId("teamMessagePrompt")+"\"></td>");
         htmlBuilder.append("   </tr>");
         htmlBuilder.append("   <tr>");
         htmlBuilder.append("    <td width=\"53%\"><textarea id=\""+this.elementId("gameMessageRead")+"\" disabled wrap=soft rows=7 cols=\"\" readonly style=\"position:relative;left:0;top:0;background-color:#eeeeee;width:100%\"></textarea></td>");
         htmlBuilder.append("    <td width=\"1%\">"+this.getVButtonHtml(this.resource("clear"),"clearGameMessage",this.event("clearGameMessage()",true),"disabled")+"</td>");
         htmlBuilder.append("    <td width=\"43%\"><textarea id=\""+this.elementId("teamMessageRead")+"\" disabled wrap=soft rows=7 cols=\"\" readonly style=\"position:relative;left:0;top:0;background-color:#eeeeee;width:100%\"></textarea></td>");
         htmlBuilder.append("    <td width=\"1%\">"+this.getVButtonHtml(this.resource("clear"),"clearTeamMessage",this.event("clearTeamMessage()",true),"disabled")+"</td>");
         htmlBuilder.append("   </tr>");
         htmlBuilder.append("   <tr>");
         htmlBuilder.append("    <td colspan=2 nowrap><table cellspacing=0 cellpadding=0 width=\"100%\"><tr><td width=\"100%\" valign=middle>"+GamesByEmail.expandingTextareaHtml(this.elementId("gameMessageWrite"),"100%",16,5,null,"disabled")+"</td><td valign=middle>"+this.getButtonHtml(this.resource("post"),"sendGameMessage",this.event("sendGameMessage()",true),null,"disabled")+"</td></tr></table></td>");
         htmlBuilder.append("    <td colspan=2 nowrap><table cellspacing=0 cellpadding=0 width=\"100%\"><tr><td width=\"100%\" valign=middle>"+GamesByEmail.expandingTextareaHtml(this.elementId("teamMessageWrite"),"100%",16,5,null,"disabled")+"</td><td valign=middle>"+this.getButtonHtml(this.resource("post"),"sendTeamMessage",this.event("sendTeamMessage()",true),null,"disabled")+"</td></tr></table></td>");
         htmlBuilder.append("   </tr>");
         htmlBuilder.append("  </table>");
         htmlBuilder.append("</td></tr>");
         if (this.testing)
            htmlBuilder.append("<tr><td align=left>"+this.getAnchorHtml("edit map","openMapEditor",this.event("openMapEditor(event)"))+"Open map editor</a></td></tr>");
      }
      else
      {
         htmlBuilder.append("<tr><td><div id=\""+this.elementId("log")+"\" style=\"background-color:#eeeeee;width:100%;height:165px;overflow:auto\"></div></td></tr>");
      }
      htmlBuilder.append("</table>");
      return htmlBuilder;
   },
   sendTeamMessage:function()
   {
      GamesByEmail.Game.prototype.sendTeamMessage.call(this,this.player.team.team.id);
   },
   clearTeamMessage:function()
   {
      GamesByEmail.Game.prototype.clearTeamMessage.call(this,this.player.team.team.id);
   },
   showTransactionPrompt:function(resourceName)
   {
      var html="";
      html+="<div style=\"border:2px solid #000000;background-color:#ffffff;padding:5px\">";
      html+=this.resource(resourceName);
      html+="</div>";
      this.setGamePrompts(html);
   },
   openFaq:function(event)
   {
      this.openPopup(event,this.resource("faqDialogSize"),this.event("openFaqHtml()"));
   },
   openFaqHtml:function()
   {
      var html=this.resource(207,
                                'Z',this.font);
      if (GamesByEmail.notIe)
         html=html.replace(/100%/g,"98%");
      return html;
   },
   openUnitSheet:function(event)
   {
      this.openPopup(event,this.resource("unitSheetDialogSize"),this.event("openUnitSheetHtml()"));
   },
   showBattleOdds:function(event)
   {
      //this.openPopup(event,this.resource("battleOddsDialogSize"),this.event("showBattleOddsHtml()"));
   },
   getPieceImage:function(team,index)
   {
      return GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[team.powerIndex][index],null,"align=absmiddle");
   },
   openUnitSheetHtml:function()
   {
      return this.resource(208,
                                'Z',this.font,
                                'm',this.getPieceImage(this.player.team,'m'),
                                'a',this.getPieceImage(this.player.team,'a'),
                                'f',this.getPieceImage(this.player.team,'f'),
                                'j',this.getPieceImage(this.player.team,'j'),
                                'J',this.getPieceImage(this.player.team,'J'),
                                'F',this.getPieceImage(this.player.team,'F'),
                                'b',this.getPieceImage(this.player.team,'b'),
                                'h',this.getPieceImage(this.player.team,'h'),
                                'H',this.getPieceImage(this.player.team,'H'),
                                'B',this.getPieceImage(this.player.team,'B'),
                                't',this.getPieceImage(this.player.team,'t'),
                                's',this.getPieceImage(this.player.team,'s'),
                                'S',this.getPieceImage(this.player.team,'S'),
                                'c',this.getPieceImage(this.player.team,'c'),
                                'd',this.getPieceImage(this.player.team,'d'),
                                'g',this.getPieceImage(this.player.team,'g'),
                                'G',this.getPieceImage(this.player.team,'G'),
                                'i',this.getPieceImage(this.player.team,'i'),
                                'I',this.getPieceImage(this.player.team,'I'));
   },
   openTeamMessage:function(event)
   {
      this.openPopup(event,this.resource("teamMessageDialogSize"),this.event("openTeamMessageHtml()"));
   },
   openTeamMessageHtml:function()
   {
      return this.resource(332,
                                'Z',this.font,
                                'm',this.getElement("teamMessageRead").value);
   },
   resignPower:function(team)
   {
      this.notify.elimination=true;
      this.notify.resigned=true;
      this.status.resigned=true;
      team.status.resigned=true;
      team.status.myTurn=false;
      this.log.record(316,team.powerIndex);
   },
   resign:function()
   {
      this.clearMouseEvents();
      this.notify.play=true;
      var team=this.player.team.team;
      this.log.mode=1;
      this.resignPower(this.player.team);
      for (var i=0;i<team.teams.length;i++)
         if (!team.teams[i].status.resigned &&
             team.teams[i].players[0].id!=0)
            this.resignPower(team.teams[i]);
      var anyCanPlay=false;
      for (var i=0;i<team.teams.length;i++)
         if (!team.teams[i].status.resigned &&
             this.teamHasMoves(team.teams[i]))
            anyCanPlay=true;
      if (!anyCanPlay)
         for (var i=0;i<team.teams.length;i++)
            if (!team.teams[i].status.resigned)
               this.resignPower(team.teams[i]);
      var allResigned=true;
      for (var i=0;i<team.teams.length;i++)
         if (!team.teams[i].status.resigned)
            allResigned=false;
      if (allResigned)
      {
         this.setEnded();
         for (var i=0;i<team.teams.length && allResigned;i++)
            team.teams[i].notify.lost=true;
         for (var i=0;i<team.opposingTeam.teams.length && allResigned;i++)
            team.opposingTeam.teams[i].status.won=team.opposingTeam.teams[i].notify.won=true;
         team.notify.lost=true;
         team.opposingTeam.status.won=true;
         team.opposingTeam.notify.won=true;
         this.log.record(317,team.index,team.opposingTeam.index);
         this.log.record(250);
         if (team==this.axis)
            this.movePhase=3;
         else
            this.movePhase=4;
         this.log.mode=0;
         this.sendMove();
      }
      else
      {
         if (!this.handleGameOver())
            this.moveToNextTeamsTurn();
         this.log.mode=0;
      }
      return true;
   },
   isAllies:function(powerIndex)
   {
      return (powerIndex==0 ||
              powerIndex==2 ||
              powerIndex==4);
   },
   isAxis:function(powerIndex)
   {
      return (powerIndex==1 ||
              powerIndex==3);
   },
   areFriendly:function(powerIndex1,powerIndex2)
   {
      return (this.isAxis(powerIndex1)==this.isAxis(powerIndex2));
   },
   backButtonTag:function()
   {
      return "";
      return (this.testing ? " ["+this.movePhase+"]" : "");
   },
   backButton:function(inline)
   {
      var html="";
      if (this.movePhase>this.startingMovePhase)
      {
         if (!inline)
            html+="<table align=right cellspacing=0 cellpadding=0><tr><td align=right>";
         html+=this.getButtonHtml(this.resource(206)+this.backButtonTag(),"goBack",this.event("processGoBack()",true));
         if (!inline)
            html+="</td></tr></table>";
      }
      return html;
   },
   staticBackButton:function(checkPhase)
   {
      var html="";
      html+="<table id=\""+this.elementId("nextPhaseDiv")+"\" style=\"border:2px solid #000000;background:#ffffff;padding:5px;\"><tr><td align=center>";
      html+=this.backButton(true);
      html+="</td></tr></table>";
      return html;
   },
   falseBackButton:function(id,arg)
   {
      var html="";
      if (arguments.length<2)
         arg="";
      html+="<table align=right cellspacing=0 cellpadding=0><tr><td align=right>";
      html+=this.getButtonHtml(this.resource(206)+this.backButtonTag(),id,this.event(id+"("+arg+")",true));
      html+="</td></tr></table>";
      return html;
   },
   updateTeamTitles:function()
   {
      this.setInnerHtml("teamTitles",this.teamTitlesHtml());
   },
   doNothing:function()
   {
   },
   update:function(phaseIsNew)
   {
      this.clearMouseEvents();
      if (this.isMyTurn(true))
      {
         if (this.movePhase==0)
            this.log.record(249);
         if (this.movePhase==1)
         {
            if (phaseIsNew && !this.testing && (this.message.length>0 || this.player.team.team.message.length>0))
               return this.bounceMessages(true);
            else
               if (!this.teamCanResearch(this.player.team))
                  this.movePhase+=2;
         }
         if (this.movePhase==3)
         {
            if (!this.player.team.rockets)
               this.movePhase+=2;
         }
         if (this.movePhase==4)
         {
            if (!this.teamCanManufacture(this.player.team))
            {
               this.purchasedUnits="";
               this.placePurchasedUnits=null;
               this.movePhase++;
            }
         }
         if (this.movePhase==6)
         {
            if (this.noCombatThisTurn())
               this.movePhase+=3;
         }
         if (this.movePhase==7)
         {
            if (phaseIsNew)
            {
               var unassigned;
               if ((unassigned=this.unassignedUnitsOnTransports(true)).length>0 &&
                   !confirm(this.resource(329,'z',unassigned.join("\n"))))
                  this.movePhase--;
               else
               {
                  this.log.mode=1;
                  this.log.clearPhase(6);
                  this.territories.recordUnitMovement(6);
                  this.log.mode=0;
                  this.territories.updateRetreatTerritories();
                  if (this.territories.countToBeConqueredBlitzedAndUnopposedRussian()>0)
                     this.ussrAttacked=1;
                  if (this.territories.conquerBlitzedAndUnopposed()>0)
                     this.mustStartAllOver=true;
                  this.territories.setFirstAttack();
                  if (!this.territories.needsCombatResolved())
                  {
                     this.movePhase++;
                     phaseIsNew=true;
                  }
               }
            }
            else
               if (!this.territories.needsCombatResolved())
               {
                  this.log.mode=1;
                  this.territories.autoLandOrCrashExtraEnemyFighters();
                  this.movePhase++;
                  phaseIsNew=true;
               }
         }
         if (this.movePhase==8)
         {
            if (phaseIsNew)
               this.territories.clearUnitMoves();
            if (!this.territories.needsPlanesLanded() && phaseIsNew)
               this.movePhase++;
         }
         if (this.movePhase==9)
         {
            this.log.mode=1;
            this.log.clearPhase(8);
            this.territories.recordLandedPlanes(8);
            this.log.mode=0;
         }
         if (this.movePhase==10)
         {
            var unassigned;
            if (phaseIsNew && (unassigned=this.unassignedUnitsOnTransports(false)).length>0 &&
                !confirm(this.resource(330,'z',unassigned.join("\n"))))
               this.movePhase--;
            else
            {
               this.log.mode=1;
               this.log.clearPhase(9);
               this.territories.recordUnitMovement(9);
               this.log.mode=0;
               if (this.purchasedUnits.length==0)
               {
                  this.movePhase++;
                  phaseIsNew=true;
               }
            }
         }
         if (this.movePhase==12)
         {
            if (this.handleGameOver())
               return;
            this.movePhase++;
            phaseIsNew=true;
         }
         if (this.movePhase==13)
         {
            if (phaseIsNew)
               this.territories.markDefenseOrderingNeeded();
         }
         if (this.movePhase==14)
         {
            return this.moveToNextTeamsTurn();
         }
      }
      this.territories.updateBlink();
      this.updateFurther();
   },
   updateFurther:function(phaseIsNew)
   {
      if (!this.isLog)
      {
         this.setInnerHtml("gameTitle",this.title.htmlEncode());
         this.setInnerHtml("gameMessagePrompt",this.verbose ? this.resource(192) : "");
         this.setInnerHtml("teamMessagePrompt",this.verbose ? this.resource(193,'o',this.getAnchorHtml(this.resource(331),"openTeamMessage",this.event("openTeamMessage(event)"))) : "");
      }
      this.updateTeamTitles();
      if (this.isLog)
         return this.updateLogFurther();
      if (!this.status.playing)
      {
         this.setGamePrompts(this.gameOverHtml(),this.movePhase<5 ? null : "doNothing",this.movePhase>=5 ? this.startAnotherGameButton() : null);
         return;
      }
      if (this.spectating || !this.isMyTurn())
      {
         this.setGamePrompts(this.notMyTurnHtml(),"doNothing",this.notOurTurnButtons());
         this.setCompassRoseBlink(false);
         return;
      }
      this.tempHidePrompt="<div style=\"margin-top:3px;margin-bottom:3px;color:#0000EE\">"+this.resource(156)+"</div>";
      var compassRoseBlink=false;
      switch (this.movePhase)
      {
         case 0 : this.setGamePrompts(this.startTurnHtml(),"startTurn",this.cancelGameButton()); break;
         case 1 : this.setGamePrompts(this.researchDevelopmentHtml()); break;
         case 2 : this.setGamePrompts(this.researchResultsHtml()); break;
         case 3 : this.setGamePrompts(this.rocketAttackHtml()); break;
         case 4 : this.setGamePrompts(this.rocketAttackResultsHtml()); break;
         case 5 :
            this.setGamePrompts(this.purchaseUnitsHtml());
            this.updatePurchaseBoard();
            break;
         case 6 : this.setGamePrompts(this.chooseTerritoryToAttackHtml(),"attackTerritory",this.nextPhaseButton()); break;
         case 7 : this.resolveCombat(this.territories.findCombat()); break;
         case 8 :
            var npl=this.territories.needsPlanesLanded();
            this.setGamePrompts(this.landPlanesPrompt(npl),"landPlanes",this.nextPhaseButton(null,161,npl));
            compassRoseBlink=!npl;
            break;
         case 9 : this.setGamePrompts(this.nonCombatMovesPrompt(),"nonCombatMove",this.nextPhaseButton("processNonCombatMoves")); break;
         case 10 :
            this.setGamePrompts(this.placeNewUnitsHtml());
            this.placePurchasedUnits.updateButtons();
            break;
         case 11 : this.setGamePrompts(this.collectIncomeHtml()); break;
         case 13 :
            var don=(this.territories.defenseOrderingNeeded());
            var button;
            if (don)
               button=this.orderByCostButton();
            else
               button=this.nextPhaseButton(null,null,false)
            this.setGamePrompts(this.setDefenseOrderPrompt(don),"setDefenseOrder",button);
            compassRoseBlink=!don;
            break;
         default : this.setGamePrompts(""); break;
      }
      this.setCompassRoseBlink(compassRoseBlink);
   },
   updateLogFurther:function()
   {
      switch (this.movePhase)
      {
      case 2 : this.setGamePrompts(this.researchResultsHtml()); break;
      case 4 :
      case 5 : this.setGamePrompts(this.rocketAttackResultsHtml()); break;
      case 7 : this.synchCombatLogHtml(); break;
      default : this.setGamePrompts(this.simpleTrackHtml(),"doNothing",this.logMovementButtons(true)); break;
      }
   },
   synchCombatLogHtml:function()
   {
      if (this.move.rawLog)
      {
         var entry=this.parseLastLogEntry(this.move.rawLog);
         var entryIndex=parseInt(entry[0]);
         var territoryIndex=parseInt(entry[2]);
         switch (entryIndex)
         {
         case 264 :
         case 265 :
         case 266 :
         case 267 :
         case 268 :
         case 269 :
         case 270 :
         case 271 :
            this.setGamePrompts(this.territories[territoryIndex].combatHtml()); 
            return ;
         case 281 :
            this.setGamePrompts(this.territories[territoryIndex].shotDownSomePlanesHtml()); 
            return ;
         case 288 :
            this.setGamePrompts(this.territories[territoryIndex].droppedSomeBombsHtml()); 
            return ;
         }
      }
      this.setGamePrompts(this.simpleTrackHtml(),"doNothing",this.logMovementButtons(true));
   },
   setCompassRoseBlink:function(blink)
   {
      if (this.compassRoseBlink!=blink)
      {
         this.compassRoseBlink=blink;
         this.territories.updateBlink(true);
      }
   },
   bounceMessages:function(startBounce)
   {
      if (startBounce)
      {
         this.setGamePrompts("");
         this.bounceIncrement=0;
         this.bounceHandle=window.setInterval(this.event("bounceMessages()"),50);
         this.getElement("gameMessageRead").style.zIndex=this.getElement("teamMessageRead").style.zIndex=10000;
      }
      else
      {
         this.bounceIncrement+=5*0.017453292519943295769236907684886;
         var top=0;
         if (this.bounceIncrement<Math.PI)
            top=-Math.floor(this.board.image.size.y*3/4*Math.sin(this.bounceIncrement));
         this.getElement("gameMessageRead").style.top=this.getElement("teamMessageRead").style.top=top;
         if (this.bounceIncrement>=Math.PI)
         {
            window.clearInterval(this.bounceHandle);
            this.getElement("gameMessageRead").style.zIndex=this.getElement("teamMessageRead").style.zIndex=0;
            this.update(false);
         }
      }
      return false;
   },
   processGoBack:function()
   {
      this.movePhase--;
      if (this.movePhase==12)
      {
         this.movePhase--;
      }
      if (this.movePhase==11)
      {
         if (this.territories.isCapitalHeld(this.player.team))
            this.player.team.ipcs-=this.territories.getNpl(this.player.team);
      }
      if (this.movePhase==10)
      {
         if (this.territories.isCapitalHeld(this.player.team))
            this.player.team.ipcs-=this.territories.getNpl(this.player.team);
         if (this.purchasedUnits.length==0)
            this.movePhase--;
      }
      if (this.movePhase==9)
      {
         this.undoAllLandings();
      }
      if (this.movePhase==8)
      {
         this.undoNonCombat();
         if (!this.hasLandPlanesOptions())
            this.movePhase-=2;
      }
      if (this.movePhase==7)
      {
         this.movePhase--;
      }
      if (this.movePhase==6)
      {
         if (this.startingMovePhase==7 || this.mustStartAllOver)
            return this.undo();
         this.undoAllLandings();
         if (this.noCombatThisTurn())
            this.movePhase--;
      }
      if (this.movePhase==5)
      {
         if (this.purchasedUnits!="")
            this.unpurchaseUnits();
         else
            if (!this.teamCanManufacture(this.player.team))
               this.movePhase--;
      }
      if (this.movePhase==4)
      {
         if (this.startingMovePhase<4)
            if (!this.player.team.rockets)
               this.movePhase-=2;
            else
               this.movePhase--;
      }
      if (this.movePhase==2)
      {
         if (this.startingMovePhase<2)
            this.movePhase--;
      }
      this.update(false);
   },
   noCombatThisTurn:function()
   {
      return (this.ussrNoCombatFirstRound && this.maxMoveNumber<5 && this.player.team==this.ussr) ||
             (this.ussrNoCombatUntilAttacked && this.ussrAttacked == 0 && this.player.team==this.ussr);
   },
   handleGameOver:function()
   {
      var numHeld=0;
      if (this.germany.isPlaying() && this.territories.isCapitalHeld(this.germany)) numHeld++;
      if (this.japan.isPlaying() && this.territories.isCapitalHeld(this.japan)) numHeld++;
      if (numHeld<1)
      {
         this.log.mode=1;
         this.log.record(226,this.allies.powerIndex);
         this.log.record(250);
         this.setEnded();
         this.germany.notify.lost=true;
         this.japan.notify.lost=true;
         this.allies.status.won=true;
         this.ussr.status.won=true;
         this.ussr.notify.won=true;
         this.unitedKingdom.status.won=true;
         this.unitedKingdom.notify.won=true;
         this.unitedStates.status.won=true;
         this.unitedStates.notify.won=true;
         this.movePhase=0;
         this.log.mode=0;
         this.sendMove();
         return true;
      }
      numHeld=0;
      if (this.ussr.isPlaying() && this.territories.isCapitalHeld(this.ussr)) numHeld++;
      if (this.unitedKingdom.isPlaying() && this.territories.isCapitalHeld(this.unitedKingdom)) numHeld++;
      if (this.unitedStates.isPlaying() && this.territories.isCapitalHeld(this.unitedStates)) numHeld++;
      if (numHeld<2 ||
          (this.player.team==this.unitedStates &&
           !this.noAxisEconomicVictory &&
           (this.territories.getNpl(this.germany)+this.territories.getNpl(this.japan))>=this.units.economicVictory.cost))
      {
         this.log.mode=1;
         if (numHeld<2)
            this.log.record(227);
         else
            this.log.record(226,this.axis.powerIndex);
         this.log.record(250);
         this.setEnded();
         this.ussr.notify.lost=true;
         this.unitedKingdom.notify.lost=true;
         this.unitedStates.notify.lost=true;
         this.axis.status.won=true;
         this.germany.status.won=true;
         this.germany.notify.won=true;
         this.japan.status.won=true;
         this.japan.notify.won=true;
         if (numHeld<2)
            this.movePhase=1;
         else
            this.movePhase=2;
         this.log.mode=0;
         this.sendMove();
         return true;
      }
      return false;
   },
   moveToNextTeamsTurn:function()
   {
      this.log.record(250);
      var team=this.player.team;
      do
      {
         if (team==this.ussr)
            team=this.germany;
         else if (team==this.germany)
            team=this.unitedKingdom;
         else if (team==this.unitedKingdom)
            team=this.japan;
         else if (team==this.japan)
            team=this.unitedStates;
         else if (team==this.unitedStates)
            team=this.ussr;
      } while (!this.teamHasMoves(team));
      if (team.status.inPlay)
         team.setExclusiveTurn();
      this.clearForNextTurn();
      this.sendMove();
      return true;
   },
   teamHasMoves:function(team)
   {
      return (team.isPlaying() &&
              (this.teamCanCollectIncome(team) ||
               this.teamCanResearch(team) ||
               this.teamCanManufacture(team) ||
               this.teamCanRocketAttack(team) ||
               this.teamHasPlayableCombatUnits(team)));
   },
   teamCanCollectIncome:function(team)
   {
      return this.territories.isCapitalHeld(team);
   },
   teamHasPlayableCombatUnits:function(team)
   {
      return this.territories.teamHasPlayableCombatUnits(team);
   },
   teamCanManufacture:function(team)
   {
      for (var i in team.units)
         if (team.units[i].title &&
             team.ipcs>=team.units[i].cost)
            return (this.territories.teamHasIndustrialComplex(team)>0);
      return false;
   },
   teamHasDevelopmentsLeft:function(team)
   {
      for (var i in this.developments)
         if (!team[i])
            return true;
      return false;
   },
   teamCanAffordResearch:function(team)
   {
      return (team.ipcs>=team.units.development.cost);
   },
   teamCanRocketAttack:function(team)
   {
      return (team.rockets &&
              !this.getRocketAttackInfo(team).noneToAttack);
   },
   teamCanResearch:function(team)
   {
      return (this.teamCanAffordResearch(team) &&
              this.teamHasDevelopmentsLeft(team));
   },
   clearForNextTurn:function()
   {
      this.movePhase=0;
      this.purchasedUnits="";
      this.placePurchasedUnits=null;
      this.attackerRolls.length=this.defenderRolls.length=0;
      this.clearMoves();
      this.territories.clearForNextTurn();
   },
   cancelGameButton:function()
   {
      var html="";
      if (this.move.number==0)
      {
         html+="<table style=\"border:2px solid #000000;background:#ffffff;padding:2px;\"><tr><td align=center>";
         html+=this.getHtmlButtonHtml("cancel");
         html+=this.resource(328);
         html+="</button>";
         html+="</td></tr></table>";
      }
      return html;
   },
   orderByCostButton:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background:#ffffff;padding:2px;width:50px\"><tr><td align=center>";
      html+=this.getButtonHtml(this.resource(339),"",this.event("orderRemainingByCost()",true));
      html+="</td></tr><tr><td align=center>";
      html+=this.backButton(true);
      html+="</td></tr></table>";
      return html;
   },
   nextPhaseButton:function(id,index,hidden)
   {
      if (!id)
         id="nextPhase";
      if (!index)
         index=127;
      var html="";
      html+="<table id=\""+this.elementId("nextPhaseDiv")+"\" style=\"border:2px solid #000000;background:#ffffff;padding:5px;\"><tr style=\"display:"+(hidden ? "none" : "")+"\"><td align=center>";
      html+=this.getButtonHtml(this.resource(index),"",this.event(id+"("+(this.movePhase+1)+")",true));
      html+="</td></tr><tr><td align=center>";
      html+=this.backButton(true);
      html+="</td></tr></table>";
      return html;
   },
   setNextPhaseButtonHidden:function(hidden)
   {
      this.getElement("nextPhaseDiv").style.visibility=(hidden ? "hidden" : "visible");
      return hidden;
   },
   notOurTurnButtons:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background:#ffffff;width:1px;height:1px\" cellspacing=0 cellpadding=0>";
      html+="<tr><td align=center>"+this.refreshGameButtonHtml()+"</td></tr>";
      if (!this.spectating)
         html+="<tr><td align=center>"+this.sendReminderButtonHtml()+"</td></tr>";
      html+="<tr><td align=center>"+this.closeWindowButtonHtml()+"</td></tr>";
      html+="</table>";
      return html;
   },
   displayStartGameForm:function(gameForm)
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background:#ffffff;width:"+Math.floor(this.board.image.size.x/2)+";height:1px\" cellspacing=0 cellpadding=0>";
      html+="<tr><td align=center>"+gameForm.getHtml()+"</td></tr>";
      html+="</table>";
      this.setGamePrompts(html);
   },
   startAnotherGameButton:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background:#ffffff;width:1px;height:1px\" cellspacing=0 cellpadding=0>";
      html+="<tr><td align=center>"+this.startAnotherGameButtonHtml()+"</td></tr>";
      html+="<tr><td align=center>"+this.closeWindowButtonHtml()+"</td></tr>";
      html+="</table>";
      return html;
   },
    /* OF INTEREST!!! */
   trackOnMouseMove:function(point,arg,event)
   {
      if (this.maybeEndTempHide(event))
         return;
      if (this.trackUnits)
      {
         var t=this.territories.territoryAtPoint(point);
         if (this.lastHiliteTerritory!=t)
         {
            if (this.lastHiliteTerritory)
               this.lastHiliteTerritory.hideHilite();
            this.lastHiliteTerritory=t;
            if (this.lastHiliteTerritory)
            {
               this.setInnerHtml(this.trackUnits,this.lastHiliteTerritory.trackHtml(point));
               this.lastHiliteTerritory.showHilite();
            }
            else
               this.setInnerHtml(this.trackUnits,"");
         }
      }
      this.trackGamePrompts.style.left=point.x-this.trackGamePrompts.offsetWidth*point.x/this.board.image.size.x;
      this.trackGamePrompts.style.top=point.y+20;
      this.trackGamePrompts.style.visibility="visible";
   },
   trackOnMouseOut:function(point)
   {
      this.trackGamePrompts.style.visibility="hidden";
      if (this.lastHiliteTerritory)
         this.lastHiliteTerritory.hideHilite();
      this.lastHiliteTerritory=null;
   },
   trackOnMouseDown:function(point)
   {
      this[this.onMouseOut](point);
      this[this.trackEvent](point);
   },
   setGamePrompts:function(html,track,compassHtml)
   {
      this.trackGamePromptsShouldBeVisible=false;
      this.gamePromptsShouldBeVisible=false;
      if (this.trackGamePrompts==null)
         this.trackGamePrompts=this.getElement("trackGamePrompts");
      if (this.gamePrompts==null)
         this.gamePrompts=this.getElement("gamePrompts");
      if (this.compassPrompts==null)
         this.compassPrompts=this.getElement("compassPrompts");
      if (html && html.length>0)
      {
         if (typeof(track)=="string" && track.length>0)
         {
            this.gamePrompts.parentNode.style.visibility=this.gamePrompts.style.visibility="hidden";
            this.setInnerHtml(this.gamePrompts,"");

            this.setTrackPrompts(html,track);
         }
         else
         {
            this.stopTrackPrompts();

            this.setInnerHtml(this.gamePrompts,html);
            this.gamePrompts.parentNode.style.visibility="visible";
            this.gamePrompts.style.visibility="visible";
            this.gamePrompts.style.left=(this.board.image.size.x-this.gamePrompts.offsetWidth)/2;
            this.gamePrompts.style.top=(this.board.image.size.y-this.gamePrompts.offsetHeight)/2;
            this.gamePromptsShouldBeVisible=true;
            if (this.gamePrompts.focus)
               this.gamePrompts.focus();
         }
      }
      else
      {
         this.stopTrackPrompts();
         this.gamePrompts.parentNode.style.visibility=this.gamePrompts.style.visibility="hidden";
         this.setInnerHtml(this.gamePrompts,"");
      }
      if (compassHtml && compassHtml.length>0)
      {
         this.setInnerHtml(this.compassPrompts,compassHtml);
         this.compassPrompts.style.visibility="visible";
         this.compassPrompts.style.left=this.board.compassPoint.x-this.compassPrompts.firstChild.offsetWidth/2;
         this.compassPrompts.style.top=this.board.compassPoint.y-this.compassPrompts.firstChild.offsetHeight/2;
      }
      else
      {
         this.compassPrompts.style.visibility="hidden";
         this.setInnerHtml(this.compassPrompts,"");
      }
   },
   setTrackPrompts:function(html,trackEvent)
   {
      this.trackGamePromptsShouldBeVisible=true;
      this.setInnerHtml(this.trackGamePrompts,html);
      this.trackGamePrompts.parentNode.style.visibility="visible";
      this.trackGamePrompts.style.visibility="hidden";
      this.trackGamePrompts.style.left=0;
      this.trackGamePrompts.style.top=0;
      this.onMouseOver="trackOnMouseMove";
      this.onMouseMove="trackOnMouseMove";
      this.onMouseOut="trackOnMouseOut";
      if (trackEvent)
         this.onLeftMouseDown="trackOnMouseDown";
      this.lastHiliteTerritory=null;
      this.trackUnits=this.getElement("trackUnits");
      this.trackEvent=(trackEvent ? trackEvent : null);
   },
   stopTrackPrompts:function()
   {
      this.trackGamePromptsShouldBeVisible=false;
      this.trackGamePrompts.parentNode.style.visibility=this.trackGamePrompts.style.visibility="hidden";
      this.setInnerHtml(this.trackGamePrompts,"");
      this.onMouseOver=null;
      this.onMouseMove=null;
      this.onMouseOut=null;
      this.onLeftMouseDown=null;
   },
   startTurnHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td align=center>";
      var team=this.player.team;
      html+=this.resource(9,
                               'i',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[team.powerIndex].y,null,"align=absmiddle"),
                               'p',team.title.htmlEncode(),
                               'P',team.team.title.htmlEncode());
      html+="</td></tr></table>";
      return html;
   },
   gameOverHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.board.image.size.x*1/3),Math.floor(this.board.image.size.y*1/3));
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\"><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td align=center>";
      var team=this.player.team;
      html+=this.resource(184,
                               'W',this.allies.status.won ? this.allies.title.htmlEncode() : this.axis.title.htmlEncode());
      if (!this.spectating)
         html+=this.resource(185,
                                  'i',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[team.powerIndex].y,null,"align=absmiddle"),
                                  'p',team.title.htmlEncode(),
                                  'P',team.team.title.htmlEncode());
      html+=this.resource(186+this.movePhase%5,
                               'n',this.units.economicVictory.cost,
                               't',this.territories.getNpl(this.germany)+this.territories.getNpl(this.japan));
      if (this.movePhase<=4)
      {
         html+="<p>";
         if (this.player.team.team.status.won)
            html+="<table cellspacing=0 cellpadding=0 border=0 witdh=\"100%\"><tr><td align=left>";
         html+=this.getButtonHtml(this.resource(20),"nextPhase",this.event("nextPhase("+(this.movePhase+5)+")",true));
         if (this.player.team.team.status.won)
            html+="</td><td align=right>"+this.startAnotherGameButtonHtml()+"</td></tr></table>";
      }
      html+="</td></tr></table>";
      return html;
   },
   notMyTurnHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td align=center>";
      var team=this.player.team;
      var turnTeam=this.teams.getTurnTeam();
      html+=this.resource(322,
                               'p',turnTeam.players[0].title.htmlEncode(),
                               't',turnTeam.title.htmlEncode(),
                               'T',turnTeam.team.title.htmlEncode());
      if (!this.spectating)
         html+=this.resource(321,
                                  'i',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[team.powerIndex].y,null,"align=absmiddle"),
                                  'p',team.title.htmlEncode(),
                                  'P',team.team.title.htmlEncode());
      html+="</td></tr></table>";
      return html;
   },
   simpleTrackHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr></table>";
      return html;
   },
   researchDevelopmentHtml:function()
   {
      var html="";
      this.developmentChances=0;
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x*2/3)+"px\"><tr><td>";
      html+=this.resource(13,
                               'B',this.backButton(),
                               'J',(this.player.team.jetPower ? "#a0A0A0" : "#000000"),
                               'j',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].j),
                               'R',(this.player.team.rockets ? "#a0A0A0" : "#000000"),
                               'r',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].G),
                               'S',(this.player.team.superSubmarines ? "#a0A0A0" : "#000000"),
                               's',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].S),
                               'L',(this.player.team.longRangeAircraft ? "#a0A0A0" : "#000000"),
                               'l',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].F)+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].B),
                               'I',(this.player.team.industrialTechnology ? "#a0A0A0" : "#000000"),
                               'i',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].I),
                               'H',(this.player.team.heavyBombers ? "#a0A0A0" : "#000000"),
                               'h',GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].h),
                               'b',this.player.team.ipcs,
                               'p',this.getButtonHtml(this.resource(15),"addDevelopment",this.event("setWeaponsDevelopmentHtml(1)"),null,(this.player.team.ipcs<this.player.team.units.development.cost*(this.developmentChances+1) ? "disabled" : "")),
                               'm',this.getButtonHtml(this.resource(16),"subtractDevelopment",this.event("setWeaponsDevelopmentHtml(-1)"),null,(this.developmentChances==0 ? "disabled" : "")),
                               'Z',this.tempHidePrompt);
      html+="<span id=\""+this.elementId("weaponsDevelopment")+"\">"+this.weaponsDevelopmentHtml()+"</span>";
      html+="</td></tr></table>";
      return html;
   },
   weaponsDevelopmentHtml:function()
   {
      return this.resource(14,
                                'i',this.developmentChances*this.player.team.units.development.cost,
                                'c',this.developmentChances,
                                's',this.getButtonHtml(this.resource(17),"spendDevelopment",this.event("spendDevelopment("+this.developmentChances+")",true)));
   },
   setDisabled:function()
   {
      var disabled=arguments[arguments.length-1];
      for (var i=0;i<arguments.length-1;i++)
      {
         var element=arguments[i];
         if (typeof(element)=="string")
            element=this.getElement(element);
         if (element)
         {
            element.disabled=disabled;
            if (disabled && element.blur)
               element.blur();
         }
      }
   },
   setWeaponsDevelopmentHtml:function(change)
   {
      var maxPossible=Math.floor(this.player.team.ipcs/this.player.team.units.development.cost);
      this.developmentChances+=change;
      if (this.developmentChances<0)
         this.developmentChances=0;
      if (this.developmentChances>maxPossible)
         this.developmentChances=maxPossible;
      this.setDisabled("addDevelopment",!(this.developmentChances<maxPossible));
      this.setDisabled("subtractDevelopment",this.developmentChances<1);
      this.setInnerHtml("weaponsDevelopment",this.weaponsDevelopmentHtml());
   },
   dieHtml:function(attacker,roll)
   {
      return GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[GamesByEmail.WW2Game.DICE[attacker ? "ATTACKERS" : "DEFENDERS"]][roll]);
   },
   arrowHtml:function(up)
   {
      return GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[up ? "upArrow" : "downArrow"]);
   },
   bombHtml:function(power)
   {
      return GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[power.index][power.heavyBombers ? "X" : "x"]);
   },
   researchResultsHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0><tr><td align=center>";
      html+="<table cellspacing=1 cellpadding=0><tr>";
      for (var i=0;i<this.attackerRolls.length;i++)
         html+="<td align=center>"+this.dieHtml(true,this.attackerRolls[i])+"</td>";
      html+="</tr><tr>";
      var j=0;
      for (var i=0;i<this.attackerRolls.length;i++)
      {
         html+="<td align=center>";
         if (this.attackerRolls[i]==6 && j<this.defenderRolls.length)
            html+=this.dieHtml(false,this.defenderRolls[j++]);
         html+="</td>";
      }
      html+="</tr><tr>";
      j=0;
      for (var i=0;i<this.attackerRolls.length;i++)
      {
         html+="<td valign=top align=center>";
         if (this.attackerRolls[i]==6 && j<this.defenderRolls.length)
            switch (this.defenderRolls[j++])
            {
            case 1 : html+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].j); break;
            case 2 : html+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].G); break;
            case 3 : html+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].S); break;
            case 4 : html+="<table cellspacing=0 cellpadding=0><tr><td align=center>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].F)+"</td><td>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].B)+"</td></tr></table>"; break;
            case 5 : html+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].I); break;
            case 6 : html+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[this.player.team.powerIndex].h); break;
            }
         html+="</td>";
      }
      html+="</tr></table>";
      if (this.defenderRolls.length>0)
      {
         html+="<table cellpadding=0><tr><td valign=top>";
         if (this.isLog)
            html+=this.resource(290,
                                     'p',this.powerLogColor(this.move.player.team.powerIndex),
                                     'P',this.move.player.team.title.htmlEncode());
         else
            html+=this.resource(19,
                                     's',this.defenderRolls.length);
         html+="</td><td><b>";
         for (var i=0;i<this.defenderRolls.length;i++)
         {
            if (i>0)
               html+="<br>";
            html+=this.resource(20+this.defenderRolls[i]);
         }
         html+="</b></td></tr></table>";
      }
      else
         if (this.isLog)
            html+=this.resource(289,
                                     'p',this.powerLogColor(this.move.player.team.powerIndex),
                                     'P',this.move.player.team.title.htmlEncode());
         else
            html+=this.resource(18);
      if (this.isLog)
         html+="<p>"+this.logMovementButtons();
      else
         html+="<p>"+this.getButtonHtml(this.resource(20),"nextPhase",this.event("nextPhase("+(this.movePhase+1)+")",true));
      return html;
   },
   logMovementButtons:function(needBackground)
   {
      var html="";
      if (needBackground)
         html+="<table style=\"position:relative;left:-8;border:2px solid #000000;background:#ffffff;padding:5px;\"><tr><td align=center>";
      html+=this.getButtonHtml(this.resource(291),"goToLogEntry",this.event("viewLog("+(this.move.number-1)+")",true),null,this.move.number==0 ? "disabled" : "");
      if (needBackground)
         html+="</td></tr><tr><td align=center>";
      else
         html+="&nbsp;&nbsp;&nbsp;";
      html+=this.getButtonHtml(this.resource(292),"goToLogEntry",this.event("viewLog("+(this.move.number+1)+")",true),null,this.move.number==this.maxMoveNumber ? "disabled" : "");
      if (needBackground)
         html+="</td></tr></table>";
      return html;
   },
   purchaseRowHtml:function(oddRow,power,unit)
   {
      var html="";
      var numPurchased=this.numUnitsPurchased(unit);
      html+="<tr style=\"background-color:"+(oddRow ? "#eeeeee" : "#ffffff")+"\">";
      html+="<td nowrap>"
      html+=this.resource(50,
                               'p',this.getButtonHtml(this.resource(15),"addUnit_"+unit,this.event("numUnits("+unit+",1)"),null,"disabled"),
                               'm',this.getButtonHtml(this.resource(16),"subUnit_"+unit,this.event("numUnits("+unit+",-1)"),null,"disabled"));
      html+="</td>";
      html+="<td align=center>"+GamesByEmail.WW2Piece.getImageHtml(this,power,unit)+"</td>";
      html+="<td colspan=2 align=left nowrap width=\"100%\">"+power.units[unit].title.htmlEncode()+"</td>";
      html+="<td align=center>"+power.units[unit].cost+"</td>";
      html+="<td>"+this.getTextHtml(numPurchased,"numUnits_"+unit,"readonly style=\"font:"+this.font+";background-color:#eeeeee\" size=3")+"</td>";
      html+="<td align=right id=\""+this.elementId("subTotal_"+unit)+"\">0</td>";
      html+="</tr>";
      return html;
   },
   purchaseUnitsHtml:function()
   {
      var power=this.player.team;
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellspacing=0 cellpadding=1 width=\""+Math.floor(this.board.image.size.x*2/3)+"px\"><tr><td colspan=7>";
      html+=this.resource(47,
                               'B',this.backButton(),
                               'Z',this.tempHidePrompt);
      html+="</td></tr>";
      html+=this.resource(48);
      html+=this.purchaseRowHtml(false,power,0);
      html+=this.purchaseRowHtml(true,power,1);
      html+=this.purchaseRowHtml(false,power,2);
      html+=this.purchaseRowHtml(true,power,3);
      html+=this.purchaseRowHtml(false,power,4);
      html+=this.purchaseRowHtml(true,power,5);
      html+=this.purchaseRowHtml(false,power,6);
      html+=this.purchaseRowHtml(true,power,7);
      html+=this.purchaseRowHtml(false,power,8);
      if (!this.info.getValue("b_NoNewFactories"))
      	html+=this.purchaseRowHtml(true,power,9);
      html+="<tr style=\"background-color:#cccccc\">";
      html+="<td colspan=3 align=left nowrap>"+this.resource(49,'i',power.ipcs)+"</td>";
      html+="<td colspan=3 align=right nowrap>"+this.getButtonHtml(this.resource(17),"purchaseUnits",this.event("purchaseUnits()",true))+"&nbsp;"+this.resource(46)+"</td>";
      html+="<td>"+this.getTextHtml(0,"purchaseTotal","readonly style=\"font:"+this.font+";background-color:#eeeeee\" size=3")+"</td>";
      html+="</tr>";
      html+="</table>";
      return html;
   },
   placePurchasedUnits:function()
   {
      this.log.mode=1;
      this.log.clear();
      this.placePurchasedUnits.process();
      this.log.mode=0;
      this.movePhase++;
      return this.update(true);
   },
   placeNewUnitsHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.board.image.size.x*2/3),Math.floor(this.board.image.size.y*2/3));
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellspacing=0 cellpadding=1 width=\""+size.x+"px\"><tr><td width=\""+(size.x/3)+"\">";
      html+=this.resource(170);
      html+=this.resource(156);
      html+="</td><td>";
      html+="<table cellspacing=0 cellpadding=0 border=0 width=\"100%\" style=\"height:100%\">";
      html+="<tr><td nowrap width=\"43px\" valign=bottom>"+this.resource(172)+"</td><td nowrap width=\"185px\" valign=bottom>"+this.resource(173)+"</td><td nowrap valign=bottom>"+this.resource(174)+"</td><td align=right nowrap width=\"1px\">"+this.backButton(false)+"</td></tr>";
      html+="<tr><td colspan=4><div style=\"overflow:auto;width:100%;height:"+(size.y-30)+";border:1px solid black\">";
      if (this.placePurchasedUnits==null)
         this.placePurchasedUnits=new GamesByEmail.WW2PlacePurchasedUnits(this,this.player.team,this.purchasedUnits);
      else
         this.placePurchasedUnits.unprocess();
      html+=this.placePurchasedUnits.getHtml();
      html+="</div></td></tr></table></td></tr>";
      html+="<tr style=\"background-color:#cccccc\">";
      html+="<td colspan=2 align=left nowrap>";
      html+=this.resource(171,
                               'd',this.getButtonHtml(this.resource(127),"placePurchasedUnits",this.event("placePurchasedUnitsProcess()",true),null,"disabled"));
      html+="</td></tr>";
      html+="</table>";
      return html;
   },
   rocketAttackResultsHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x/3)+"px\"><td align=center>";
      html+="<table cellpadding=0 cellspacing=5><tr><td valign=top>";
      html+=this.dieHtml(true,this.attackerRolls[0]);
      html+="</td><td valign=top>";
      if (this.isLog)
         html+=this.resource(293,
                                  'a',this.powerLogColor(this.move.player.team.powerIndex),
                                  'A',this.move.player.team.title.htmlEncode(),
                                  'd',this.powerLogColor(this.defenderRolls[0]),
                                  'D',this.powers[this.defenderRolls[0]].title.htmlEncode(),
                                  'r',this.attackerRolls[0],
                                  'i',this.defenderRolls[1],
                                  'I',this.logIpcPhrase(this.defenderRolls[1]));
      else
         html+=this.resource(30,
                                  'r',this.attackerRolls[0],
                                  'p',this.powers[this.defenderRolls[0]].title.htmlEncode(),
                                  's',this.defenderRolls[1]);
      html+="</td></tr></table>";
      if (this.isLog)
         html+="<p>"+this.logMovementButtons();
      else
         html+="<p>"+this.getButtonHtml(this.resource(20),"nextPhase",this.event("nextPhase("+(this.movePhase+1)+")",true));
      html+="</td></tr></table>";
      return html;
   },
   collectIncomeHtml:function()
   {
      var html="";
      var size=new Foundation.Point(Math.floor(this.board.image.size.x*1/3),Math.floor(this.board.image.size.y*1/3));
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\"><td align=center>";
      var team=this.player.team;
      if (this.territories.isCapitalHeld(team))
      {
         var numIpcs=this.territories.getNpl(team);
         team.ipcs+=numIpcs;
         this.updateTeamTitles();
         html+=this.resource(180,
                                  'B',this.backButton(),
                                  'n',numIpcs);
         this.log.record(302,numIpcs,numIpcs);
      }
      else
      {
         html+=this.resource(181,
                                  'B',this.backButton());
         this.log.record(303);
      }
      html+="<p>"+this.getButtonHtml(this.resource(20),"nextPhase",this.event("nextPhase("+(this.movePhase+1)+")",true));
      html+="</td></tr></table>";
      return html;
   },
   rocketAttackHtml:function()
   {
      var rocketAttackInfo=this.getRocketAttackInfo(this.player.team);
      var width=(rocketAttackInfo.noneToAttack ? 1/3 : 2/3);
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x*width)+"px\"><td>";
      if (rocketAttackInfo.noneToAttack)
      {
         html+=this.resource(27,
                                  'r',this.player.team.units.antiaircraftGun.range);
         html+="<p align=center>"+this.getButtonHtml(this.resource(20),"nextPhase",this.event("nextPhase("+(this.movePhase+2)+")",true));
      }
      else
      {
         var table="<table cellspacing=3 cellpadding=0 border=0>";
         for (var i=0;i<rocketAttackInfo.length;i++)
            if (rocketAttackInfo[i].length>0)
            {
               table+="<tr><td valign=top>";
               table+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[rocketAttackInfo[i].powerIndex].y);
               table+="</td><td align=right>"+this.resource(112,'i',rocketAttackInfo[i].ipcs)+"</td><td>";
               for (var j=0;j<rocketAttackInfo[i].length;j++)
                  table+=this.getButtonHtml(this.territories[rocketAttackInfo[i][j]].title.htmlEncode(),"rocketAttack",this.event("rocketAttack("+rocketAttackInfo[i][j]+")",true))+" ";
               table+="</td></tr>";
            }
         table+="</table>";
         html+=this.resource(28,
                                  'B',this.backButton(),
                                  'r',this.player.team.units.antiaircraftGun.range,
                                  'c',table,
                                  's',this.getButtonHtml(this.resource(29),"rocketAttack",this.event("rocketAttack(-1)",true)),
                                  'o',this.getAnchorHtml(this.resource(32),"rocketAttackOdds",this.event("rocketAttackOdds()")));
      }
      html+="</td></tr></table>";
      return html;
   },
   getRocketAttackInfo:function(team)
   {
      var info=new Array();
      info.noneToAttack=true;   
      var enemies=team.team.nextTeam();
      for (var i=0;i<enemies.teams.length;i++)
      {
         var rocket=new Array();
         rocket.powerIndex=enemies.teams[i].powerIndex;
         rocket.ipcs=enemies.teams[i].ipcs;
         this.fillRocketAttackList(rocket,team.powerIndex,enemies.teams[i].powerIndex,team.units.antiaircraftGun.range);
         info[info.length]=rocket;
         if (rocket.length>0)
            info.noneToAttack=false;
      }
      return info;
   },
   fillRocketAttackList:function(list,attackerIndex,targetIndex,range)
   {
      for (var i=0;i<this.territories.length;i++)
         if (this.territories[i].isLand() &&
             this.territories[i].holdingPowerIndex==targetIndex &&
             this.territories[i].unitCount(9)>0 &&
             this.rocketWithinRange(this.territories[i].adjacent,attackerIndex,range))
            list[list.length]=i;
   },
   rocketWithinRange:function(territories,attackerIndex,range)
   {
      if (range>0)
      {
         range--;
         var gun;
         for (var i=0;i<territories.length;i++)
            if ((territories[i].isLand() &&
                 (gun=territories[i].getAntiaircraftGun())!=null &&
                 gun.owner.powerIndex==attackerIndex) ||
                this.rocketWithinRange(territories[i].adjacent,attackerIndex,range))
               return true;
      }
      return false;
   },
   nonCombatMovesPrompt:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x/3)+"px\"><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td>";
      html+=this.resource(160);
      html+="</td></tr></table>";
      return html;
   },
   landPlanesPrompt:function(anyLeftToLand)
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x/3)+"px\"><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td>";
      html+=this.resource(anyLeftToLand ? 148 : 159);
      html+="</td></tr></table>";
      return html;
   },
   setDefenseOrderPrompt:function(anyLeftToOrder)
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x/3)+"px\"><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td>";
      html+=this.resource(anyLeftToOrder ? 182 : 183);
      html+="</td></tr></table>";
      return html;
   },
   chooseTerritoryToAttackHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x/2.5)+"px\"><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td>";
      html+=this.resource(51,'d',this.resource(127));
      html+="</td></tr></table>";
      return html;
   },
   chooseCombatTerritoryHtml:function()
   {
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+Math.floor(this.board.image.size.x/3)+"px\"><tr><td id=\""+this.elementId("trackUnits")+"\"></td></tr><tr><td>";
      html+=this.resource(98);
      html+="</td></tr></table>";
      return html;
   },
   powerTitleHtml:function(team,emptyTitles)
   {
      var html="";
      var powerIndex,powerTitle,isUs,myTurn,font;
      if (emptyTitles)
      {
         powerIndex=team;
         isUs=false;
         powerTitle="";
         myTurn=false;
         font="font:10px verdana";
      }
      else
      {
         isUs=(!this.spectating && this.player.team==team);
         powerIndex=team.powerIndex;
         powerTitle=this.resource(191,
                                       't',team.title.htmlEncode(),
                                       'T',team.team.title.htmlEncode());
         myTurn=team.status.myTurn;
         font="";
      }
      var w=Math.floor(this.board.image.size.x/5);
      html+="<td nowrap align=center valign=middle width=\""+w+"px\">";
      html+="<div style=\"width:"+(w-5)+"px;background-color:"+(isUs ? "#cccccc" : "#ffffff")+";border:1px solid "+(myTurn ? "#0000ff" : "#aaaaaa")+"\">";
      html+="<table cellspacing=0 cellpadding=0 border=0><tr><td align=center>";
      html+="<table cellspacing=1 cellpadding=0 "+GamesByEmail.elementTitleAttributes(powerTitle)+"><tr><td>";
      html+=GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].y);
      html+="</td><td nowrap style=\"padding-left:3px;"+font+"\">";
      if (emptyTitles)
         html+="&nbsp;";
      else
         html+=team.players[0].title.htmlEncode();
      html+="</td><td>";
      if (!emptyTitles)
         html+=(team.status.resigned ? this.resource(315) : isUs && myTurn && !this.isLog ? "&nbsp;"+this.resignButtonHtml() : "");
      html+="</td></tr></table></td></tr><tr><td align=center><table cellspacing=0 cellpadding=0 border=0><tr><td rowspan=2><table cellspacing=0 cellpadding=0 border=0><tr>";
      if (!emptyTitles)
      {
         if (team.jetPower && team.longRangeAircraft)
            html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].J,null,GamesByEmail.elementTitleAttributes(this.resource(60)))+"</td>";
         else
            if (team.jetPower)
               html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].j,null,GamesByEmail.elementTitleAttributes(this.resource(61)))+"</td>";
            else
               if (team.longRangeAircraft)
                  html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].F,null,GamesByEmail.elementTitleAttributes(this.resource(62)))+"</td>";
         if (team.heavyBombers && team.longRangeAircraft)
            html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].H,null,GamesByEmail.elementTitleAttributes(this.resource(63)))+"</td>";
         else
            if (team.heavyBombers)
               html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].h,null,GamesByEmail.elementTitleAttributes(this.resource(64)))+"</td>";
            else
               if (team.longRangeAircraft)
                  html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].B,null,GamesByEmail.elementTitleAttributes(this.resource(65)))+"</td>";
         if (team.rockets)
            html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].G,null,GamesByEmail.elementTitleAttributes(this.resource(66)))+"</td>";
         if (team.superSubmarines)
            html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].S,null,GamesByEmail.elementTitleAttributes(this.resource(67)))+"</td>";
         if (team.industrialTechnology)
            html+="<td nowrap valign=bottom>"+GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.board.pieceRects[powerIndex].I,null,GamesByEmail.elementTitleAttributes(this.resource(68)))+"</td>";
      }
      html+="</tr></table></td><td align=left nowrap style=\"padding-left:3px;"+font+"\">";
      if (emptyTitles)
         html+=this.resource(31,'i',0,'I',"");
      else
         html+=this.resource(31,
                                  'i',team.ipcs,
                                  'I',GamesByEmail.elementTitleAttributes(this.resource(166)));
      html+="</td></tr><tr><td align=left nowrap style=\"padding-left:3px;"+font+"\">";
      if (emptyTitles)
         html+=this.resource(318,'l',0,'L',"");
      else
         html+=this.resource(318,
                                  'l',this.territories.getNpl(team),
                                  'L',GamesByEmail.elementTitleAttributes(this.resource(167)+
                                                                       (this.noAxisEconomicVictory ? this.resource(338)
                                                                                                   : this.resource(337,
                                                                                                                        'a',this.territories.getNpl(this.germany)+this.territories.getNpl(this.japan),
                                                                                                                        'e',this.units.economicVictory.cost))));
      html+="</td></tr></table></td></tr></table></div></td>";
      return html;
   },
   teamTitlesHtml:function(emptyTitles)
   {
      var html="";
      html+="<table cellspacing=0 cellpadding=0 border=0 width=\""+this.board.image.size.x+"px\"><tr>";
      html+=this.powerTitleHtml(emptyTitles ? 0 : this.ussr,emptyTitles);
      html+=this.powerTitleHtml(emptyTitles ? 1 : this.germany,emptyTitles);
      html+=this.powerTitleHtml(emptyTitles ? 2 : this.unitedKingdom,emptyTitles);
      html+=this.powerTitleHtml(emptyTitles ? 3 : this.japan,emptyTitles);
      html+=this.powerTitleHtml(emptyTitles ? 4 : this.unitedStates,emptyTitles);
      html+="</tr></table>";
      return html;
   },
   appendBoardHtml:function(htmlBuilder)
   {
      var wh="width:"+this.board.image.size.x+"px;height:"+this.board.image.size.y+"px";
      htmlBuilder.append("<div "+this.mouseEvents(false,"compassPrompts")+" style=\"position:absolute;visibility:hidden;"+wh+";z-index:1000\">");
      htmlBuilder.append("<div id=\""+this.elementId("compassPrompts")+"\" style=\"position:absolute;left:"+this.board.compassPoint.x+";top:"+this.board.compassPoint.y+";width:0;height:0;z-index:1000;visibility:hidden\"></div>");
      htmlBuilder.append("<div id=\""+this.elementId("trackGamePrompts")+"\" style=\"position:absolute;z-index:1000\"></div>");
      htmlBuilder.append("</div>");
      htmlBuilder.append("<div style=\"position:absolute;"+wh+";visibility:hidden;z-index:1000\">");
      htmlBuilder.append("<div id=\""+this.elementId("gamePrompts")+"\" style=\"position:absolute;z-index:1000\"></div>");
      htmlBuilder.append("</div>");
      htmlBuilder.append("<div style=\"text-align:left;"+wh+"\">");
      htmlBuilder.append("<div "+this.mouseEvents(false,"compassPrompts")+" style=\"position:absolute;"+wh+";overflow:hidden;z-index:200\">");
      this.territories.appendHtml(htmlBuilder,this.board.image.size);
      htmlBuilder.append("<img id=\""+this.elementId("compassHilite")+"\" src=\""+this.getImageSrc(this.board.compassHilite.src)+"\" width="+this.board.compassHilite.width+" height="+this.board.compassHilite.height+" style=\"position:absolute;top:"+this.board.compassHilite.top+";left:"+this.board.compassHilite.left+";visibility:hidden;z-index:200\" border=0 galleryimg=false>");
      htmlBuilder.append("<img src=\""+this.getImageSrc(this.board.image.src)+"\" width="+this.board.image.size.x+" height="+this.board.image.size.y+" style=\"display:block; z-index:100\" border=0 galleryimg=false>");
      htmlBuilder.append("</div></div>");
      return htmlBuilder;
   },
   spendDevelopment:function(numChances)
   {
      if (numChances==0)
      {
         this.movePhase++;
         this.log.record(213);
         this.movePhase++;
         this.update(true);
      }
      else
      {
         var mp=this.movePhase;
         this.undo();
         this.movePhase=mp;
         var roll;
         var noDevelopmentsLeft;
         this.attackerRolls=this.diceRolls(numChances);
         if (this.testing)
            for (var i=0;i<numChances;i++)
               this.attackerRolls[i]=6;
         this.defenderRolls.length=0;
         var cost=0;
         for (var i=0;i<numChances;i++)
         {
            noDevelopmentsLeft=(this.player.team.jetPower && this.player.team.heavyBombers && this.player.team.longRangeAircraft && this.player.team.rockets && this.player.team.industrialTechnology && this.player.team.superSubmarines);
            this.player.team.ipcs-=this.player.team.units.development.cost;
            cost+=this.player.team.units.development.cost;
            var team=this.player.team;
            if (this.attackerRolls[i]==6 && !noDevelopmentsLeft)
               while (true)
               {
                  roll=this.dieRoll();
                  if (roll==1 && !team.jetPower)
                  {
                     team.jetPower=true;
                     this.defenderRolls[this.defenderRolls.length]=roll;
                     break;
                  }
                  if (roll==2 && !team.rockets)
                  {
                     team.rockets=true;
                     this.defenderRolls[this.defenderRolls.length]=roll;
                     break;
                  }
                  if (roll==3 && !team.superSubmarines)
                  {
                     team.superSubmarines=true;
                     this.defenderRolls[this.defenderRolls.length]=roll;
                     break;
                  }
                  if (roll==4 && !team.longRangeAircraft)
                  {
                     team.longRangeAircraft=true;
                     this.defenderRolls[this.defenderRolls.length]=roll;
                     break;
                  }
                  if (roll==5 && !team.industrialTechnology)
                  {
                     team.industrialTechnology=true;
                     this.defenderRolls[this.defenderRolls.length]=roll;
                     break;
                  }
                  if (roll==6 && !team.heavyBombers)
                  {
                     team.heavyBombers=true;
                     this.defenderRolls[this.defenderRolls.length]=roll;
                     break;
                  }
               }
         }
         this.movePhase++;
         this.log.record(214,cost,this.attackerRolls.join(""),this.defenderRolls.join(""));
         this.sendMove();
      }
   },
   unitPurchaseCost:function(unit)
   {
      var e=this.getElement("numUnits_"+unit);
      return e ? this.player.team.units[unit].cost*parseInt(e.value) : 0;
   },
   totalPurchaseCost:function()
   {
      return this.unitPurchaseCost(0)+
             this.unitPurchaseCost(1)+
             this.unitPurchaseCost(2)+
             this.unitPurchaseCost(3)+
             this.unitPurchaseCost(4)+
             this.unitPurchaseCost(5)+
             this.unitPurchaseCost(6)+
             this.unitPurchaseCost(7)+
             this.unitPurchaseCost(8)+
             this.unitPurchaseCost(9);
   },
   updatePurchaseRow:function(unit,total)
   {
      var cost=this.player.team.units[unit].cost;
      var e=this.getElement("numUnits_"+unit);
      if (e)
      {
         var numUnits=parseInt(e.value);
         this.setDisabled("addUnit_"+unit,(total+cost>this.player.team.ipcs));
         this.setDisabled("subUnit_"+unit,numUnits==0);
         this.setInnerHtml("subTotal_"+unit,cost*numUnits);
      }
   },
   updatePurchaseBoard:function()
   {
      var total=this.totalPurchaseCost();
      this.updatePurchaseRow(0,total);
      this.updatePurchaseRow(1,total);
      this.updatePurchaseRow(2,total);
      this.updatePurchaseRow(3,total);
      this.updatePurchaseRow(4,total);
      this.updatePurchaseRow(5,total);
      this.updatePurchaseRow(6,total);
      this.updatePurchaseRow(7,total);
      this.updatePurchaseRow(8,total);
      this.updatePurchaseRow(9,total);
      this.getElement("purchaseTotal").value=total;
      this.setDisabled("purchaseUnits",total>0 && this.player.team.ipcs<total);
   },
   numUnits:function(unit,delta)
   {
      var e=this.getElement("numUnits_"+unit);
      e.value=parseInt(e.value)+delta;
      this.updatePurchaseBoard();
   },
   verifyPurchase:function()
   {
      var numLand=0,numSea=0;
      var landMax=0,seaMax=0,uncontestedSeaMax=0;
      var landTargets=new Array();
      numLand+=parseInt(this.getElement("numUnits_"+0).value);
      numLand+=parseInt(this.getElement("numUnits_"+1).value);
      numLand+=parseInt(this.getElement("numUnits_"+2).value);
      numLand+=parseInt(this.getElement("numUnits_"+3).value);
      numLand+=parseInt(this.getElement("numUnits_"+4).value);
      numSea+=parseInt(this.getElement("numUnits_"+5).value);
      numSea+=parseInt(this.getElement("numUnits_"+6).value);
      numSea+=parseInt(this.getElement("numUnits_"+7).value);
      numSea+=parseInt(this.getElement("numUnits_"+8).value);
      for (var i=0;i<this.territories.length;i++)
      {
         var output=this.territories[i].maximumOutput();
         if (output>0)
         {
            landMax+=output;
            landTargets[landTargets.length]=this.territories[i];
         }
      }
      for (var i=0;i<landTargets.length;i++)
      {
         var a=landTargets[i].adjacent;
         for (var j=0;j<a.length;j++)
         {
            var t=a[j];
            if (t.isSeaZone() && !t.isLandLocked)
            {
               var output=landTargets[i].maximumOutput();
               seaMax+=output;
               if (!t.isEnemyOccupied())
                  uncontestedSeaMax+=output;
            }
         }
      }
      var verify="";
      if (numLand+numSea>landMax)
         verify+=this.resource(323);
      if (numSea>seaMax)
         verify+=this.resource(324);
      if (numSea>uncontestedSeaMax && seaMax>uncontestedSeaMax)
         verify+=this.resource(325);
      return (verify.length==0 ||
              confirm(verify+this.resource(326)));
   },
   purchaseUnit:function(unit)
   {
      var e=this.getElement("numUnits_"+unit);
      if (!e)
         return 0;
      var numUnits=parseInt(e.value);
      for (var i=0;i<numUnits;i++)
         this.purchasedUnits+=GamesByEmail.WW2Piece.getMusterIndex(unit);
      var cost=this.player.team.units[unit].cost*numUnits;
      this.player.team.ipcs-=cost;
      return cost;
   },
   purchaseUnits:function()
   {
      this.purchasedUnits="";
      this.placePurchasedUnits=null;
      var cost=0;
      if (!this.verifyPurchase())
      {
         this.getElement("purchaseUnits").disabled=false;
         return;
      }
      cost+=this.purchaseUnit(0);
      cost+=this.purchaseUnit(1);
      cost+=this.purchaseUnit(2);
      cost+=this.purchaseUnit(3);
      cost+=this.purchaseUnit(4);
      cost+=this.purchaseUnit(5);
      cost+=this.purchaseUnit(6);
      cost+=this.purchaseUnit(7);
      cost+=this.purchaseUnit(8);
      cost+=this.purchaseUnit(9);
      if (cost==0)
         this.log.record(228);
      else
         this.log.record(229,cost,this.purchasedUnits);
      this.movePhase++;
      this.update(true);
   },
   unpurchaseUnit:function(unitPurchaseChar)
   {
      var unit=GamesByEmail.WW2Piece.unitFromMusterIndex(unitPurchaseChar);
      this.player.team.ipcs+=this.player.team.units[unit].cost;
   },
   unassignedUnitsOnTransports:function(attack)
   {
      var unassignedSeaZones=new Array();
      for (var i=0;i<this.territories.length;i++)
         if (this.territories[i].unassignedUnitsOnTransports(attack)>0)
            unassignedSeaZones[unassignedSeaZones.length]=this.territories[i].title;
      return unassignedSeaZones;
   },
   unpurchaseUnits:function()
   {
      for (var i=0;i<this.purchasedUnits.length;i++)
         this.unpurchaseUnit(this.purchasedUnits.charAt(i));
   },
   numUnitsPurchased:function(unit)
   {
      unit=GamesByEmail.WW2Piece.getMusterIndex(unit);
      var count=0;
      for (var i=0;i<this.purchasedUnits.length;i++)
         if (this.purchasedUnits.charAt(i)==unit)
            count++;
      return count;
   },
   rocketAttack:function(territoryIndex)
   {
      territoryIndex=parseInt(territoryIndex);
      this.attackerRolls.length=this.defenderRolls.length=0;
      if (territoryIndex<0)
      {
         this.log.record(232);
         this.movePhase+=2;
         this.update(true);
      }
      else
      {
         var mp=this.movePhase;
         this.undo();
         this.movePhase=mp;
         var enemy=this.territories[territoryIndex].holdingPower();
         this.attackerRolls[0]=this.dieRoll();
         this.defenderRolls[0]=enemy.powerIndex;
         if (enemy.ipcs<this.attackerRolls[0])
            this.defenderRolls[1]=enemy.ipcs;
         else
            this.defenderRolls[1]=this.attackerRolls[0];
         enemy.ipcs-=this.defenderRolls[1];
         this.log.record(233,territoryIndex,this.defenderRolls[0],this.attackerRolls[0],this.defenderRolls[1]);
         this.movePhase++;
         this.sendMove();
      }
   },
   clearMoves:function()
   {
      this.placePurchasedUnits=null;
      this.territories.clearMoves();
   },
   undoNonCombat:function()
   {
      for (var i=0;i<this.territories.length;i++)
         this.territories[i].undoNonCombat();
   },
   undoAllLandings:function()
   {
      for (var i=0;i<this.territories.length;i++)
         this.territories[i].undoAllLandings();
   },
   hasLandPlanesOptions:function()
   {
      for (var i=0;i<this.territories.length;i++)
         if (this.territories[i].landPlanesOptions)
            return true;
      return false;
   },
   landPlanes:function(point)
   {
      this.focusTerritory=this.territories.territoryAtPoint(point);
      if (this.focusTerritory)
      {
         this.clearMouseEvents();
         if (!this.focusTerritory.landPlanesOptions)
            this.focusTerritory.landPlanesOptions=new GamesByEmail.WW2LandPlanesOptions(this.focusTerritory);
         this.setGamePrompts(this.focusTerritory.landPlanesHtml());
      }
   },
   attackTerritory:function(point)
   {
      this.focusTerritory=this.territories.territoryAtPoint(point);
      if (this.focusTerritory)
      {
         this.clearMouseEvents();
         if (this.focusTerritory.isLand())
            if (this.focusTerritory.isEnemy())
            {
               this.setGamePrompts(this.focusTerritory.attackHtml());
               this.focusTerritory.updateDefences();
            }
            else
               if (this.focusTerritory.isNeutral())
                  this.setGamePrompts(this.focusTerritory.takeOverNeutralHtml());
               else
                  this.setGamePrompts(this.focusTerritory.blitzOnlyHtml());
         else
            if (this.focusTerritory.isEnemyOccupied())
            {
               this.setGamePrompts(this.focusTerritory.attackHtml());
               this.focusTerritory.updateDefences(false);
            }
            else
            {
               this.setGamePrompts(this.focusTerritory.occupySeaZoneHtml());
               this.focusTerritory.updateDefences(true);
            }
         window.setTimeout(this.event("updateAttackMovesAtIndex("+this.focusTerritory.index+")"),1);
      }
   },
   nonCombatMove:function(point)
   {
      this.focusTerritory=this.territories.territoryAtPoint(point);
      if (this.focusTerritory && !this.focusTerritory.isEnemy() && !this.focusTerritory.isNeutral())
      {
         this.clearMouseEvents();
         this.setGamePrompts(this.focusTerritory.nonCombatMovesHtml());
         window.setTimeout(this.event("updateNonCombatMovesAtIndex("+this.focusTerritory.index+")"),1);
      }
   },
   setDefenseOrder:function(point)
   {
      this.focusTerritory=this.territories.territoryAtPoint(point);
      if (this.focusTerritory && !this.focusTerritory.isEnemy() && !this.focusTerritory.isNeutral())
      {
         this.clearMouseEvents();
         this.setGamePrompts(this.focusTerritory.setDefenseOrderHtml());
      }
   },
   orderRemainingByCost:function()
   {
      this.territories.orderRemainingByCost();
      this.update();
   },
   combatTerritory:function(point)
   {
      this.resolveCombat(this.territories.territoryAtPoint(point),false,true);
   },
   resolveCombat:function(territory,amphibiousSet,mapClick)
   {
      this.focusTerritory=territory;
      if (this.focusTerritory &&
          (this.focusTerritory.combatRolls ||
           this.focusTerritory.amphibiousAssaulted>0 ||
           !this.focusTerritory.strategicBombingRaidResolved() ||
           (this.focusTerritory.isEnemyOccupied() && this.focusTerritory.isFriendlyOccupied())))
      {
         this.clearMouseEvents();
         if (!this.focusTerritory.preAmphibiousAssaultBattlesResolved())
            this.setGamePrompts(this.focusTerritory.resolveAmphibiousCombatHtml());
         else
            if (!this.focusTerritory.antiaircraftFireResolved())
               if (this.focusTerritory.combatRolls)
                  this.setGamePrompts(this.focusTerritory.shotDownSomePlanesHtml());
               else
                  this.setGamePrompts(this.focusTerritory.shootDownSomePlanesHtml());
            else
               if (!this.focusTerritory.strategicBombingRaidResolved())
                  if (this.focusTerritory.combatRolls)
                     this.setGamePrompts(this.focusTerritory.droppedSomeBombsHtml());
                  else
                     this.setGamePrompts(this.focusTerritory.dropSomeBombsHtml());
               else
               {
                  if (this.focusTerritory.amphibiousAssaulted>0 && !amphibiousSet)
                     this.setGamePrompts(this.focusTerritory.amphibiousAssaultOptionsHtml());
                  else
                     if (this.focusTerritory.isEnemyOccupied())
                        this.setGamePrompts(this.focusTerritory.combatHtml());
                     else
                     {
                        if (this.focusTerritory.isFriendlyOccupied(true))
                           this.focusTerritory.conquer();
                        this.update();
                     }
               }
      }
      else
         if (!mapClick)
            this.setGamePrompts(this.chooseCombatTerritoryHtml(),"combatTerritory",this.staticBackButton(7));
   },
   rollForCombat:function(territory)
   {
      this.log.mode=1;
      if (territory.firstAttack)
      {
         if (this.log.hasEntry())
            this.sendMove(false);
         this.log.record(274,territory.index,territory.preMoveLogPowerIndex);
      }
      if (territory.amphibiousAssaultOptions)
      {
         territory.amphibiousAssaultOptions.recordUnitMovement(this.movePhase);
         territory.amphibiousAssaultOptions=null;
      }
      var bbds=territory.battleBoardDetails;
      if (territory.amphibiousAssaultedCount()>0)
         territory.retreatTerritories=null;
      territory.clearUnlandedAmphibiousUnits();
      var combatRolls;
      var defendersHit=0,attackersHit=0;
      var defenderSeaUnitsHit=0,attackerSeaUnitsHit=0;
      var defenderHasSeaUnits=territory.pieces.hasSeaUnits(false);
      var attackerHasSeaUnits=territory.pieces.hasSeaUnits(true);
      var attackerRollLog,defenderRollLog;
      function isNotSub(bbd,index)
      {
         return (bbd.subCount==0 ||
                 index<bbd.subStart ||
                 index>=bbd.subStart+bbd.subCount);
      }
      var subRetreat=territory.shouldDefensiveSubsRetreat();
      do
      {
         territory.combatRolls=combatRolls=this.diceRolls(bbds.totalDiceCount);
         var rollNum=0;
         for (var i=0;i<bbds.length;i++)
            if (bbds[i].roll>0)
            {
               rollNum+=bbds[i].defender.count;
               for (var j=0;j<bbds[i].attacker.count;j++)
                  if (combatRolls[rollNum++]<=bbds[i].roll)
                     if (isNotSub(bbds[i].attacker,j))
                        defendersHit++;
                     else
                        if (defenderHasSeaUnits)
                           defenderSeaUnitsHit++;
            }
         if (defenderSeaUnitsHit>0)
            territory.changeFirstStrikeRolls(defenderSeaUnitsHit);
         rollNum=0;
         attackerRollLog="";
         defenderRollLog="";
         for (var i=0;i<bbds.length;i++)
            if (bbds[i].roll>0)
            {
               for (var j=0;j<bbds[i].defender.count;j++)
               {
                  defenderRollLog+=(combatRolls[rollNum]>6 ? '-' : combatRolls[rollNum]);
                  if (combatRolls[rollNum++]<=bbds[i].roll)
                     if (isNotSub(bbds[i].defender,j))
                        attackersHit++;
                     else
                        if (attackerHasSeaUnits)
                           attackerSeaUnitsHit++;
               }
               for (var j=0;j<bbds[i].attacker.count;j++)
                  attackerRollLog+=combatRolls[rollNum++];
            }
      } while (bbds.oneTimeShots==0 && defendersHit==0 && attackersHit==0 && defenderSeaUnitsHit==0 && attackerSeaUnitsHit==0 && !subRetreat)

      if (territory.preMoveLogPowerIndex==0)
         this.ussrAttacked = 1;
      //GamesByEmail.WW2Piece.powerIndexFromPieceChar(piecestring)

      territory.defendersHit=defendersHit;
      territory.attackersHit=attackersHit;
      territory.defenderSeaUnitsHit=defenderSeaUnitsHit;
      territory.attackerSeaUnitsHit=attackerSeaUnitsHit;
      var logIndex=264;
      if (territory.defenderSeaUnitsHit>0)
      {
         logIndex=(territory.defendersHit==0 ? 265 : 267);
         if (territory.firstAttack)
            logIndex++;
      }
      this.log.record(logIndex,territory.index,territory.preMoveLogPowerIndex,this.player.team.powerIndex,escape(bbds.attackingUnits),territory.defendersHit,territory.defenderSeaUnitsHit,attackerRollLog);
      var logIndex=269;
      if (territory.attackerSeaUnitsHit>0)
         logIndex=(territory.attackersHit==0 ? 270 : 271);
      this.log.record(logIndex,territory.index,territory.preMoveLogPowerIndex,territory.preMoveLogPowerIndex,escape(bbds.defendingUnits),territory.attackersHit,territory.attackerSeaUnitsHit,defenderRollLog);
      this.log.mode=0;
      this.sendMove();
   },
   callOffAssault:function(territory)
   {
      this.log.mode=1;
      if (territory.firstAttack)
      {
         if (this.log.hasEntry())
            this.sendMove(false);
         this.log.record(334,territory.index,territory.preMoveLogPowerIndex);
      }
      territory.clearUnlandedAmphibiousUnits();
      this.log.mode=0;
      this.sendMove(false);
      this.update();
   },
   removeHitPieces:function(territory,preBattle)
   {
      if (!preBattle)
         territory.firstAttack=false;
      this.log.mode=1;
      var logPieces;
      logPieces=territory.pieces.removeHit(false);
      if (logPieces.length>0) {
         for(var i=0; i<logPieces.length; i++)
            if (GamesByEmail.WW2Piece.powerIndexFromPieceChar(logPieces.charAt(i))==0)
               this.ussrAttacked=1;
         this.log.recordPhase(6,304,territory.index,territory.preMoveLogPowerIndex,escape(logPieces));
      }
      logPieces=territory.pieces.removeHit(true);
      if (logPieces.length>0)
         this.log.recordPhase(6,305,territory.index,territory.preMoveLogPowerIndex,escape(logPieces));
      this.log.mode=0;

      territory.combatRolls=null;
      territory.defendersHit=territory.attackersHit=0;
      territory.defenderSeaUnitsHit=territory.attackerSeaUnitsHit=0;
      this.territories.updateAmphibiousAssault();
      territory.updateBlink();
      territory.staticafyAmphibiousAssaultVessels();
      var subRetreat=territory.shouldDefensiveSubsRetreat();
      if (!territory.firstAttack && subRetreat)
      {
         var subs=territory.retreatDefensiveSubs(subRetreat);
         this.log.mode=1;
         this.log.record(309,territory.index,territory.preMoveLogPowerIndex,subRetreat.index,subRetreat.preMoveLogPowerIndex,escape(subs));
         this.log.mode=0;
         alert(this.resource(312,
                                  's',subs.length,
                                  'S',this.logSubmarinePhrase(subs.length),
                                  'T',subRetreat.title));
      }
      if (territory.needsCombatResolved())
         this.resolveCombat(territory);
      else
      {
         this.log.mode=1;
         if (territory.isSeaZone())
            if (territory.isFriendlyOccupied(false,true))
               this.log.record(280,territory.index,territory.preMoveLogPowerIndex);
            else
               if (territory.isEnemyOccupied(false,true))
                  this.log.record(278,territory.index,territory.preMoveLogPowerIndex);
               else
                  this.log.record(279,territory.index,territory.preMoveLogPowerIndex);
         else
            if (territory.isFriendlyOccupied(true))
               territory.conquer();
            else
               this.log.record(278,territory.index,territory.preMoveLogPowerIndex);
         this.log.mode=0;
         territory.pieces.setUsedInBattleThisTurn();
         this.sendMove(false);
         this.update();
      }
   },
   cleanUpStrategicBombingRaid:function(territory)
   {
      territory.combatRolls=null;
      territory.defendersHit=territory.attackersHit=0;
      territory.defenderSeaUnitsHit=territory.attackerSeaUnitsHit=0;
      territory.updateBlink();
      if (territory.needsCombatResolved())
         this.resolveCombat(territory);
      else
         this.update();
   },
   toggleHitPiece:function(territory,pieceIndex)
   {
      var hits;
      var piece=territory.pieces[pieceIndex];
      if (piece.hit)
      {
         piece.hit=false;
         hits=territory.pieces.attackerHitsRemaining(territory.attackersHit,territory.attackerSeaUnitsHit);
      }
      else
      {
         hits=territory.pieces.attackerHitsRemaining(territory.attackersHit,territory.attackerSeaUnitsHit);
         if (hits.seaUnits>0 && piece.isSeaUnit())
         {
            piece.hit=true;
            hits.seaUnits--;
         }
         else
            if (hits.units>0)
            {
               piece.hit=true;
               hits.units--;
            }
      }
      var anchor=this.getElement("hitPiece_"+pieceIndex);
      anchor.style.border=(piece.hit ? this.resource(106) : "");
      var hitElement=this.getElement("attackersHit");
      if (hitElement)
         this.setInnerHtml(hitElement,territory.unitString(hits.units));
      hitElement=this.getElement("attackerSeaUnitsHit");
      if (hitElement)
         this.setInnerHtml(hitElement,territory.unitString(hits.seaUnits,true));
      this.setDisabled("removeHitPieces",hits.units>0 || hits.seaUnits>0);
   },
   maybeStartTempHide:function(event)
   {
      if (event &&
          this.gamePromptsShouldBeVisible &&
          !this.trackGamePromptsShouldBeVisible &&
          (event.ctrlKey || event.ctrlLeft))
      {
         this.tempTracking=true;
         this.gamePrompts.parentNode.style.visibility=this.gamePrompts.style.visibility="hidden";
         this.setTrackPrompts(this.simpleTrackHtml());
      }
      return true;
   },
   maybeEndTempHide:function(event)
   {
      if (event &&
          this.tempTracking &&
          this.gamePromptsShouldBeVisible &&
          !event.ctrlKey && !event.ctrlLeft)
      {
         this.tempTracking=false;
         this[this.onMouseOut](null);
         this.stopTrackPrompts();
         this.gamePrompts.parentNode.style.visibility=this.gamePrompts.style.visibility="visible";
         return true;
      }
      return false;
   },
   blink:function()
   {
      this.territories.blink();
   },
   startTurn:function()
   {
      this.movePhase++;
      return this.update(true);
   },
   nextPhase:function(phase)
   {
      this.movePhase=phase;
      this.update(true);
   },
   rocketAttackOdds:function()
   {
      var url=this.folder()+"battleOdds.asp";
      var oddsSize=this.resource("oddsDialogSize");
      return window.open(url,"wW2BattleOdds","height="+oddsSize.y+",width="+oddsSize.x+",left="+(screenPoint.x-oddsSize.x/2)+",top="+(screenPoint.y-(oddsSize.y-50))+",channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizeable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no").focus();
   },
   updateAttackMovesAtIndex:function(tIndex)
   {
      this.territories[tIndex].updateAttackMoves();
   },
   updateNonCombatMovesAtIndex:function(tIndex)
   {
      this.territories[tIndex].updateNonCombatMoves();
   },
   rollForCombatAtIndex:function(tIndex)
   {
      this.rollForCombat(this.territories[tIndex]);
   },
   resolveCombatAtIndex:function(tIndex)
   {
      this.resolveCombat(this.territories[tIndex]);
   },
   resolveCombatAmphibiousSetAtIndex:function(tIndex)
   {
      this.resolveCombat(this.territories[tIndex],true);
   },
   moveAllNumAvailAtIndex:function(tIndex,mIndex,pIndex)
   {
      this.territories[tIndex].unitMoves[mIndex].change("moveAllNumAvail",pIndex);
   },
   moveOneNumAvailAtIndex:function(tIndex,mIndex,pIndex)
   {
      this.territories[tIndex].unitMoves[mIndex].change("moveOneNumAvail",pIndex);
   },
   moveAllNumMovedAtIndex:function(tIndex,mIndex,pIndex)
   {
      this.territories[tIndex].unitMoves[mIndex].change("moveAllNumMoved",pIndex);
   },
   moveOneNumMovedAtIndex:function(tIndex,mIndex,pIndex)
   {
      this.territories[tIndex].unitMoves[mIndex].change("moveOneNumMoved",pIndex);
   },
   loadAndMoveTransportAtIndex:function(tIndex,mIndex)
   {
      this.territories[tIndex].unitMoves.activeLoadTransportMove.transportLoadMoves[mIndex].loadAndMoveTransport();
   },
   moveTransportAtIndex:function(tIndex)
   {
      this.territories[tIndex].unitMoves.activeLoadTransportMove.transportLoadMoves.moveTransport();
   },
   closeSecondaryAttackAtIndex:function(tIndex)
   {
      this.territories[tIndex].closeSecondaryAttack();
   },
   previewBattleBoardAtIndex:function(tIndex)
   {
      this.territories[tIndex].previewBattleBoard();
   },
   unloadAllNumAvailAtIndex:function(tIndex,aIndex)
   {
      this.territories[tIndex].amphibiousAssaultOptions[aIndex].change("unloadAllNumAvail");
   },
   unloadOneNumAvailAtIndex:function(tIndex,aIndex)
   {
      this.territories[tIndex].amphibiousAssaultOptions[aIndex].change("unloadOneNumAvail");
   },
   unloadAllNumMovedAtIndex:function(tIndex,aIndex)
   {
      this.territories[tIndex].amphibiousAssaultOptions[aIndex].change("unloadAllNumMoved");
   },
   unloadOneNumMovedAtIndex:function(tIndex,aIndex)
   {
      this.territories[tIndex].amphibiousAssaultOptions[aIndex].change("unloadOneNumMoved");
   },
   rollForCombatAtIndex:function(tIndex)
   {
      this.rollForCombat(this.territories[tIndex]);
   },
   callOffAssaultAtIndex:function(tIndex)
   {
      this.callOffAssault(this.territories[tIndex]);
   },
   hitPieceAtIndex:function(tIndex,pIndex)
   {
      this.toggleHitPiece(this.territories[tIndex],pIndex);
   },
   removeHitPiecesAtIndex:function(tIndex)
   {
      this.removeHitPieces(this.territories[tIndex]);
   },
   removePlaneHitsAtIndex:function(tIndex)
   {
      this.removeHitPieces(this.territories[tIndex],true);
   },
   cleanUpStrategicBombingRaidAtIndex:function(tIndex)
   {
      this.cleanUpStrategicBombingRaid(this.territories[tIndex]);
   },
   retreatAtIndex:function(tIndex)
   {
      this.territories[tIndex].retreat();
   },
   retreatToAtIndex:function(tIndex,rIndex)
   {
      return this.territories[tIndex].retreatTo(this.territories[rIndex]);
   },
   landPlaneAtIndex:function(tIndex,oIndex,lIndex,cIndex)
   {
      this.territories[tIndex].landPlanesOptions[oIndex].land(lIndex,cIndex);
   },
   unlandPlaneAtIndex:function(tIndex,oIndex,lIndex,cIndex)
   {
      this.territories[tIndex].landPlanesOptions[oIndex].unland(lIndex);
   },
   placeNewUnitAtIndex:function(uIndex,pIndex)
   {
      this.placePurchasedUnits[uIndex].place(pIndex);
   },
   unplaceNewUnitAtIndex:function(uIndex,pIndex)
   {
      this.placePurchasedUnits[uIndex].unplace(pIndex);
   },
   placePurchasedUnitsProcess:function()
   {
      this.log.mode=1;
      this.log.clear();
      this.placePurchasedUnits.process();
      this.log.mode=0;
      this.movePhase++;
      return this.update(true);
   },
   orderCombatUnitsByCostAtIndex:function(tIndex)
   {
      this.territories[tIndex].orderCombatUnitsByCost();
   },
   combatUnitsOrderedAtIndex:function(tIndex)
   {
      this.territories[tIndex].defenseOrderingNeeded=false;
      this.update(false);
   },
   openMapEditor:function(mouseEvent)
   {
      var size=new Foundation.Point(300,630);
      var left=mouseEvent.screenX-size.x/2;
      var top=mouseEvent.screenY-(size.y-10);
      var pageUrl="MapEditor.htm#"+this.$Foundation_$registry_index;
      var features="height="+size.y+",width="+size.x+",left="+left+",top="+top+",resizable=yes,fullscreen=no,channelmode=no,directories=no,status=no,toolbar=no,menubar=no,location=no";
      var baseUrl=this.getCodeFolder(!document.all || window.location.protocol!="file:");
      try
      {
         window.open(baseUrl+pageUrl,(new Date()).valueOf(),features).focus();
      }
      catch(e){}
      return;
   },
   powerLogColor:function(powerIndex)
   {
      return this.resource(219+powerIndex);
   },
   logUnitPhrase:function(numUnits)
   {
      return this.resource(numUnits==1 ? 251 : 252);
   },
   logSpacePhrase:function(numSpaces)
   {
      return this.resource(numSpaces==1 ? 253 : 254);
   },
   logBattleshipPhrase:function(numBattleships)
   {
      return this.resource(numBattleships==1 ? 256 : 257);
   },
   logIpcPhrase:function(numIpcs)
   {
      return this.resource(numIpcs==1 ? 258 : 259);
   },
   logHitPhrase:function(numHits)
   {
      return this.resource(numHits==1 ? 272 : 273);
   },
   logRoll:function(roll)
   {
      return (roll=='-' ? this.resource(275) : roll);
   },
   logRollString:function(rolls)
   {
      var log="";
      for (var i=0;i<rolls.length;i++)
      {
         if (log.length>0)
            log+=this.resource(276);
         log+=this.logRoll(rolls.charAt(i));
      }
      return log;
   },
   logAAGunPhrase:function(numGuns)
   {
      return this.resource(numGuns==1 ? 282 : 283);
   },
   logBomberPhrase:function(numBombers)
   {
      return this.resource(numBombers==1 ? 284 : 285);
   },
   logBombPhrase:function(numBombs)
   {
      return this.resource(numBombs==1 ? 286 : 287);
   },
   logFighterPhrase:function(numFighters)
   {
      return this.resource(numFighters==1 ? 297 : 298);
   },
   logAircraftPhrase:function(aircraftUnit,numAircraft)
   {
      return (aircraftUnit==2 ? this.logFighterPhrase(numAircraft) : this.logBomberPhrase(numAircraft));
   },
   logSubmarinePhrase:function(numSubmarines)
   {
      return this.resource(numSubmarines==1 ? 310 : 311);
   },
   logWasPhrase:function(num)
   {
      return this.resource(num==1 ? 319 : 320);
   },
   teamColorFromTeam:function(team)
   {
      if (team==this.ussr) return 0;
      if (team==this.germany) return 1;
      if (team==this.unitedKingdom) return 2;
      if (team==this.japan) return 3;
      if (team==this.unitedStates) return 4;
      return 5;
   },
   getLogProcessingInformation:function()
   {
      this.initializePowers();
      return this.resource("teamFontColors");
   },
   processLogMove:function(move,moveIndex,colors)
   {
      var entries=this.parseLogEntries(move.log);
      var log="";
      for (var i=0;i<entries.length;i++)
      {
         if (log.length>0)
            log+="<br>";
         var entry=entries[i];
         var entryIndex=parseInt(entry[0]);
         if (entry.length>1)
         {
            var powerIndex=parseInt(entry[1]);
            log+="<font color=\""+colors[powerIndex]+"\">";
            switch (entryIndex)
            {
            case 214 :
               var cost=parseInt(entry[2]);
               var chanceRolls=entry[3];
               var devRolls=entry[4];
               if (devRolls.length==0)
                  log+=this.resource(214,
                                          'i',cost,
                                          'n',chanceRolls.length,
                                          'r',this.logRollString(chanceRolls));
               else
               {
                  var developments=this.developments[parseInt(devRolls.charAt(0))].title.htmlEncode();
                  for (var j=1;j<devRolls.length;j++)
                     developments=this.resource(218,
                                                     'd',developments,
                                                     'D',this.developments[parseInt(devRolls.charAt(j))].title.htmlEncode());
                  log+=this.resource(217,
                                          'i',cost,
                                          'n',chanceRolls.length,
                                          'd',devRolls.length,
                                          'D',developments,
                                          'r',this.logRollString(chanceRolls),
                                          'R',this.logRollString(devRolls));
               }
               break;
            case 249 :
            case 250 :
               log+=this.resource(entryIndex,
                                       'p',this.powers[powerIndex].title.htmlEncode());
               break;
            case 226 :
               log+=this.resource(entryIndex,
                                       'p',this.teams[parseInt(entry[2])].title.htmlEncode());
               break;
            case 229 :
               var cost=parseInt(entry[2]);
               var units=entry[3];
               var unitList="";
               var num=1;
               var lastUnit=units.charAt(0);
               for (var j=1;j<=units.length;j++)
                  if (j==units.length || units.charAt(j)!=lastUnit)
                  {
                     var unit=this.resource(230,
                                                 'n',num,
                                                 'u',this.unitFromMusterIndex(lastUnit).title.htmlEncode());
                     if (unitList.length==0)
                        unitList=unit;
                     else
                        unitList=this.resource(231,
                                                    'U',unitList,
                                                    'u',unit);
                     if (j==units.length)
                        break;
                     lastUnit=units.charAt(j);
                     num=1;
                  }
                  else
                     num++;
               log+=this.resource(229,
                                       'i',cost,
                                       'u',unitList);
               break;
            case 233 :
               var territoryIndex=parseInt(entry[2]);
               var enemyIndex=parseInt(entry[3]);
               var roll=parseInt(entry[4]);
               var cost=parseInt(entry[5]);
               log+=this.resource(entryIndex,
                                       'c',colors[enemyIndex],
                                       't',this.territories[territoryIndex].title.htmlEncode(),
                                       'r',roll,
                                       'e',this.powers[enemyIndex].title.htmlEncode(),
                                       'i',cost);
               break;
            case 234 :
               var numMoved=parseInt(entry[2]);
               var unit=parseInt(entry[3]);
               var numSpaces=parseInt(entry[4]);
               var fromTerritoryIndex=parseInt(entry[5]);
               var fromTerritoryPower=parseInt(entry[6]);
               var toTerritoryIndex=parseInt(entry[7]);
               var toTerritoryPower=parseInt(entry[8]);
               var strategicBombingRaid=parseInt(entry[9]);
               var numNeutralViolation=parseInt(entry[10]);
               var numAntiaircraftGun=parseInt(entry[11]);
               var numBlitzed=parseInt(entry[12]);
               var blitzedIndex=parseInt(entry[13]);
               var blitzedPower=parseInt(entry[14]);
               var extras="";
               if (strategicBombingRaid>0)
                  extras+=this.resource(235);
               if (numBlitzed>0)
                  extras+=this.resource(236,
                                             'c',colors[blitzedPower],
                                             't',this.territories[blitzedIndex].title.htmlEncode());
               if (numAntiaircraftGun>0)
                  extras+=this.resource(237,
                                             'n',numAntiaircraftGun);
               if (numNeutralViolation>0)
                  extras+=this.resource(238,
                                             'n',numNeutralViolation);
               log+=this.resource(entryIndex,
                                       'n',numMoved,
                                       'u',this.unitFromUnitIndex(unit).title.htmlEncode(),
                                       'U',this.logUnitPhrase(numMoved),
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode(),
                                       'x',extras);
               break;
            case 239 :
            case 299 :
               var numMoved=parseInt(entry[2]);
               var unit=parseInt(entry[3]);
               var fromTerritoryIndex=parseInt(entry[4]);
               var fromTerritoryPower=parseInt(entry[5]);
               var toTerritoryIndex=parseInt(entry[6]);
               var toTerritoryPower=parseInt(entry[7]);
               log+=this.resource(entryIndex,
                                       'n',numMoved,
                                       'u',this.unitFromUnitIndex(unit).title.htmlEncode(),
                                       'U',this.logUnitPhrase(numMoved),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 240 :
               var numSpaces=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               log+=this.resource(entryIndex,
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 241 :
            case 242 :
               var numSpaces=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unit1Type=parseInt(entry[7]);
               var unit1Owner=parseInt(entry[8]);
               var unit1TerritoryIndex=parseInt(entry[9]);
               var unit1TerritoryPower=parseInt(entry[10]);
               log+=this.resource(entryIndex,
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode(),
                                       'p',colors[unit1Owner],
                                       'P',this.unitFromUnitIndex(unit1Type).title.htmlEncode(),
                                       'q',colors[unit1TerritoryPower],
                                       'Q',this.territories[unit1TerritoryIndex].title.htmlEncode());
               break;
            case 243 :
               var numSpaces=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unit1Type=parseInt(entry[7]);
               var unit1Owner=parseInt(entry[8]);
               var unit1TerritoryIndex=parseInt(entry[9]);
               var unit1TerritoryPower=parseInt(entry[10]);
               var unit2Type=parseInt(entry[11]);
               var unit2Owner=parseInt(entry[12]);
               var unit2TerritoryIndex=parseInt(entry[13]);
               var unit2TerritoryPower=parseInt(entry[14]);
               log+=this.resource(entryIndex,
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode(),
                                       'p',colors[unit1Owner],
                                       'P',this.unitFromUnitIndex(unit1Type).title.htmlEncode(),
                                       'q',colors[unit1TerritoryPower],
                                       'Q',this.territories[unit1TerritoryIndex].title.htmlEncode(),
                                       'c',colors[unit2Owner],
                                       'C',this.unitFromUnitIndex(unit2Type).title.htmlEncode(),
                                       'd',colors[unit2TerritoryPower],
                                       'D',this.territories[unit2TerritoryIndex].title.htmlEncode());
               break;
            case 244 :
            case 246 :
               var numSpaces=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unit1Type=parseInt(entry[7]);
               var unit1Owner=parseInt(entry[8]);
               log+=this.resource(entryIndex,
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode(),
                                       'c',colors[unit1Owner],
                                       'C',this.unitFromUnitIndex(unit1Type).title.htmlEncode());
               break;
            case 245 :
               var numSpaces=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unit1Type=parseInt(entry[7]);
               var unit1Owner=parseInt(entry[8]);
               var unit2Type=parseInt(entry[9]);
               var unit2Owner=parseInt(entry[10]);
               var unit2TerritoryIndex=parseInt(entry[11]);
               var unit2TerritoryPower=parseInt(entry[12]);
               log+=this.resource(entryIndex,
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode(),
                                       'c',colors[unit1Owner],
                                       'C',this.unitFromUnitIndex(unit1Type).title.htmlEncode(),
                                       'p',colors[unit2Owner],
                                       'P',this.unitFromUnitIndex(unit2Type).title.htmlEncode(),
                                       'q',colors[unit2TerritoryPower],
                                       'Q',this.territories[unit2TerritoryIndex].title.htmlEncode());
               break;
            case 247 :
               var numSpaces=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unit1Type=parseInt(entry[7]);
               var unit1Owner=parseInt(entry[8]);
               var unit2Type=parseInt(entry[9]);
               var unit2Owner=parseInt(entry[10]);
               log+=this.resource(entryIndex,
                                       's',numSpaces,
                                       'S',this.logSpacePhrase(numSpaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode(),
                                       'c',colors[unit1Owner],
                                       'C',this.unitFromUnitIndex(unit1Type).title.htmlEncode(),
                                       'd',colors[unit2Owner],
                                       'D',this.unitFromUnitIndex(unit2Type).title.htmlEncode());
               break;
            case 248 :
               var numUnits=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unitType=parseInt(entry[7]);
               var unitOwner=parseInt(entry[8]);
               log+=this.resource(entryIndex,
                                       'n',numUnits,
                                       'u',this.unitFromUnitIndex(unitType).title.htmlEncode(),
                                       'U',this.logUnitPhrase(numUnits),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 255 :
               var numParticipating=parseInt(entry[2]);
               var fromTerritoryIndex=parseInt(entry[3]);
               var fromTerritoryPower=parseInt(entry[4]);
               var toTerritoryIndex=parseInt(entry[5]);
               var toTerritoryPower=parseInt(entry[6]);
               var unitType=parseInt(entry[7]);
               var unitOwner=parseInt(entry[8]);
               log+=this.resource(entryIndex,
                                       'n',numParticipating,
                                       'u',this.logBattleshipPhrase(numParticipating),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 260 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               log+=this.resource(entryIndex,
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode());
               break;
            case 261 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               var originalPower=parseInt(entry[4]);
               var numIpcs=parseInt(entry[5]);
               log+=this.resource(entryIndex,
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode(),
                                       'c',colors[originalPower],
                                       'C',this.powers[originalPower].title.htmlEncode(),
                                       'i',numIpcs,
                                       'I',this.logIpcPhrase(numIpcs),
                                       'p',colors[powerIndex],
                                       'P',this.powers[powerIndex].title.htmlEncode());
               break;
            case 262 :
            case 263 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               var originalPower=parseInt(entry[4]);
               log+=this.resource(entryIndex,
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode(),
                                       'p',colors[originalPower],
                                       'P',this.powers[originalPower].title.htmlEncode());
               break;
            case 264 :
            case 265 :
            case 266 :
            case 267 :
            case 268 :
            case 269 :
            case 270 :
            case 271 :
               var territory=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               var power=parseInt(entry[4]);
               var units=unescape(entry[5]);
               var hits=parseInt(entry[6]);
               var navalHits=parseInt(entry[7]);
               var rolls=entry[8];
               log+=this.resource(entryIndex,
                                       'p',colors[power],
                                       'u',units.length,
                                       'U',this.logUnitPhrase(units.length),
                                       'h',hits,
                                       'H',this.logHitPhrase(hits),
                                       'n',navalHits,
                                       'N',this.logHitPhrase(navalHits),
                                       'r',this.logRollString(rolls));
               break;
            case 274 :
            case 334 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               log+=this.resource(entryIndex,
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode());
               break;
            case 277 :
               var fromTerritoryIndex=parseInt(entry[2]);
               var fromTerritoryPower=parseInt(entry[3]);
               var toTerritoryIndex=parseInt(entry[4]);
               var toTerritoryPower=parseInt(entry[5]);
               var units=unescape(entry[6]);
               log+=this.resource(entryIndex,
                                       'u',units.length,
                                       'U',this.logUnitPhrase(units.length),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 278 :
            case 279 :
            case 280 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               log+=this.resource(entryIndex,
                                       't',colors[territoryPower],
                                       'w',colors[6],
                                       'T',this.territories[territoryIndex].title.htmlEncode(),
                                       'p',this.powers[powerIndex].title.htmlEncode(),
                                       'P',this.powers[territoryPower].title.htmlEncode());
               break;
            case 281 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               var aaLog=unescape(entry[4]);
               var planeCount=0;
               var hitCount=0;
               var rolls="";
               var numGuns=0;
               j=0;
               while (j<aaLog.length)
               {
                  planeCount++;
                  j++;
                  var numRolls=parseInt(aaLog.charAt(j++));
                  var hit=false;
                  numGuns+=numRolls;
                  var l;
                  for (var l=0;l<numRolls;l++)
                  {
                     var roll=parseInt(aaLog.charAt(j++));
                     rolls+=roll;
                     if (roll<=this.units.antiaircraftGun.defend)
                        hit=true;
                  }
                  if (hit)
                     hitCount++;
               }
               log+=this.resource(entryIndex,
                                       'a',planeCount,
                                       'U',this.logUnitPhrase(planeCount),
                                       'g',numGuns,
                                       'G',this.logAAGunPhrase(numGuns),
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode(),
                                       'h',hitCount,
                                       'H',this.logHitPhrase(hitCount),
                                       'r',this.logRollString(rolls));
               break;
            case 288 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               var numPlanes=parseInt(entry[4]);
               var numBombs=parseInt(entry[5]);
               var damage=parseInt(entry[6]);
               var ipcs=parseInt(entry[7]);
               var rolls=entry[8];
               log+=this.resource(entryIndex,
                                       'a',numPlanes,
                                       'A',this.logBomberPhrase(numPlanes),
                                       'b',numBombs,
                                       'B',this.logBombPhrase(numBombs),
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode(),
                                       'd',damage,
                                       'P',this.powers[territoryPower].title.htmlEncode(),
                                       'i',ipcs,
                                       'I',this.logIpcPhrase(ipcs),
                                       'r',this.logRollString(rolls));
               break;
            case 295 :
               var fromTerritoryIndex=parseInt(entry[2]);
               var fromTerritoryPower=parseInt(entry[3]);
               var toTerritoryIndex=parseInt(entry[4]);
               var toTerritoryPower=parseInt(entry[5]);
               var unit=parseInt(entry[6]);
               var range=parseInt(entry[7]);
               var numUnits=parseInt(entry[8]);
               var spaces=parseInt(entry[9]);
               log+=this.resource(entryIndex,
                                       'u',numUnits,
                                       'U',this.logAircraftPhrase(unit,numUnits),
                                       'r',range,
                                       's',spaces,
                                       'S',this.logSpacePhrase(spaces),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 300 :
               var numUnits=parseInt(entry[2]);
               var unitType=parseInt(entry[3]);
               var toTerritoryIndex=parseInt(entry[4]);
               var toTerritoryPower=parseInt(entry[5]);
               log+=this.resource(entryIndex,
                                       'n',numUnits,
                                       'u',this.unitFromUnitIndex(unitType).title.htmlEncode(),
                                       'U',this.logUnitPhrase(numUnits),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 301 :
               var numUnits=parseInt(entry[2]);
               var unitType=parseInt(entry[3]);
               log+=this.resource(entryIndex,
                                       'n',numUnits,
                                       'u',this.unitFromUnitIndex(unitType).title.htmlEncode(),
                                       'U',this.logUnitPhrase(numUnits),
                                       'w',this.logWasPhrase(numUnits));
               break;
            case 302 :
               var npl=parseInt(entry[2]);
               var ipcs=parseInt(entry[3]);
               log+=this.resource(entryIndex,
                                       'n',npl,
                                       'i',ipcs,
                                       'I',this.logIpcPhrase(ipcs));
               break;
            case 304 :
            case 305 :
               var territoryIndex=parseInt(entry[2]);
               var territoryPower=parseInt(entry[3]);
               var pieces=unescape(entry[4]);
               log+=this.resource(entryIndex,
                                       'u',pieces.length,
                                       'U',this.logUnitPhrase(pieces.length),
                                       't',colors[territoryPower],
                                       'T',this.territories[territoryIndex].title.htmlEncode());
               break;
            case 309 :
               var fromTerritoryIndex=parseInt(entry[2]);
               var fromTerritoryPower=parseInt(entry[3]);
               var toTerritoryIndex=parseInt(entry[4]);
               var toTerritoryPower=parseInt(entry[5]);
               var subs=unescape(entry[6]);
               log+=this.resource(entryIndex,
                                       's',subs.length,
                                       'S',this.logSubmarinePhrase(subs.length),
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       't',colors[toTerritoryPower],
                                       'T',this.territories[toTerritoryIndex].title.htmlEncode());
               break;
            case 313 :
               var fromTerritoryIndex=parseInt(entry[2]);
               var fromTerritoryPower=parseInt(entry[3]);
               var unit=parseInt(entry[4]);
               var range=parseInt(entry[5]);
               var numUnits=parseInt(entry[6]);
               log+=this.resource(entryIndex,
                                       'a',numUnits,
                                       'A',this.logAircraftPhrase(unit,numUnits),
                                       'r',range,
                                       'f',colors[fromTerritoryPower],
                                       'F',this.territories[fromTerritoryIndex].title.htmlEncode(),
                                       'u',this.logUnitPhrase(numUnits));
               break;
            case 316 :
               var resigningPowerIndex=parseInt(entry[2]);
               log+=this.resource(entryIndex,
                                       'p',this.powers[resigningPowerIndex].title.htmlEncode());
               break;
            case 317 :
               var teamIndex=parseInt(entry[2]);
               var opposingTeamIndex=parseInt(entry[3]);
               log+=this.resource(entryIndex,
                                       'l',this.teams[teamIndex].title.htmlEncode(),
                                       'w',this.teams[opposingTeamIndex].title.htmlEncode());
               break;
            case 335 :
               var unitType=parseInt(entry[2]);
               var unitOwner=parseInt(entry[3]);
               var seaTerritoryIndex=parseInt(entry[4]);
               var seaTerritoryPower=parseInt(entry[5]);
               var islandTerritoryIndex=parseInt(entry[6]);
               var islandTerritoryPower=parseInt(entry[7]);
               log+=this.resource(entryIndex,
                                       'S',colors[seaTerritoryPower],
                                       's',this.territories[seaTerritoryIndex].title.htmlEncode(),
                                       'f',colors[unitOwner],
                                       'p',this.powers[unitOwner].title.htmlEncode(),
                                       't',colors[islandTerritoryPower],
                                       'T',this.territories[islandTerritoryIndex].title.htmlEncode());
               break;
            case 336 :
               var unitType=parseInt(entry[2]);
               var unitOwner=parseInt(entry[3]);
               var seaTerritoryIndex=parseInt(entry[4]);
               var seaTerritoryPower=parseInt(entry[5]);
               log+=this.resource(entryIndex,
                                       'S',colors[seaTerritoryPower],
                                       's',this.territories[seaTerritoryIndex].title.htmlEncode(),
                                       'f',colors[unitOwner],
                                       'p',this.powers[unitOwner].title.htmlEncode());
               break;
            default :
               log+=this.resource(entryIndex);
               break;
            }
            log+="</font>";
         }
         else
            log+=this.resource(entryIndex);
      }
      move.log=log;
   },
   setDevelopmentByString:function(team,string)
   {
      team.jetPower=(string.indexOf('j')>=0);
      if (team.jetPower)
         eval(this.developments.jetPower.value);
      team.rockets=(string.indexOf('r')>=0);
      if (team.rockets)
         eval(this.developments.rockets.value);
      team.superSubmarines=(string.indexOf('s')>=0);
      if (team.superSubmarines)
         eval(this.developments.superSubmarines.value);
      team.longRangeAircraft=(string.indexOf('l')>=0);
      if (team.longRangeAircraft)
         eval(this.developments.longRangeAircraft.value);
      team.industrialTechnology=(string.indexOf('i')>=0);
      if (team.industrialTechnology)
         eval(this.developments.industrialTechnology.value);
      team.heavyBombers=(string.indexOf('h')>=0);
      if (team.heavyBombers)
         eval(this.developments.heavyBombers.value);
   },
   getDevelopmentString:function(team)
   {
      var string="";
      if (team.jetPower) string+='j';
      if (team.rockets) string+='r';
      if (team.superSubmarines) string+='s';
      if (team.longRangeAircraft) string+='l';
      if (team.industrialTechnology) string+='i';
      if (team.heavyBombers) string+='h';
      return string;
   },
   setTeamByString:function(team,string)
   {
      string=string.split(':');
      this.setDevelopmentByString(team,string[0]);
      team.ipcs=parseInt(string[1]);
   },
   getTeamString:function(team)
   {
      var string="";
      string+=this.getDevelopmentString(team)+':';
      string+=team.ipcs;
      return string;
   },
   setTeamsByString:function(string)
   {
      string=string.split('|');
      for (var i=0;i<string.length;i++)
         this.setTeamByString(this.powers[i],string[i]);
   },
   getTeamsString:function()
   {
      var string="";
      for (var i=0;i<this.powers.length;i++)
         if (i!=5)
         {
            if (i>0)
               string+='|';
            string+=this.getTeamString(this.powers[i]);
         }
      return string;
   },
   rollsByString:function(string)
   {
      var rolls=new Array();
      for (var i=0;i<string.length;i++)
         rolls[i]=parseInt(string.charAt(i));
      return rolls;
   },
   getRollsString:function(rolls)
   {
      var string="";
      for (var i=0;i<rolls.length;i++)
         string+=rolls[i];
      return string;
   },
   setStateByString:function(string)
   {
      string=string.split('|');
      this.movePhase=parseInt(string[0]);
      this.attackerRolls=this.rollsByString(string[1]);
      this.defenderRolls=this.rollsByString(string[2]);
   },
   getStateString:function()
   {
      var string="";
      string+=this.movePhase+'|';
      string+=this.getRollsString(this.attackerRolls)+"|";
      string+=this.getRollsString(this.defenderRolls)+"|";
      return string;
   },
   setString:function(string,purchased)
   {
      string=string.split('~');
      this.setStateByString(string[0]);
      this.setTeamsByString(string[1]);
      this.territories.setString(string[2]);
      if (string.length<4)
      {
         this.purchasedUnits=purchased;
         this.numPlayers=5;
         this.ussrAttacked=0;
      }
      else
      {
         this.purchasedUnits=string[3];
         this.numPlayers=parseInt(string[4].charAt(0));
         if (string.length>=6)
            this.ussrAttacked=parseInt(string[5].charAt(0));
         else
            this.ussrAttacked=0;
      }
   },
   getString:function()
   {
      var string="";
      string+=this.getStateString()+'~';
      string+=this.getTeamsString()+'~';
      string+=this.territories.getString()+'~';
      string+=this.purchasedUnits+'~';
      string+=this.numPlayers+'~';
      string+=this.ussrAttacked;
      return string;
   },
   processNonCombatMoves:function()
   {
      this.territories.processNonCombat();
      this.territories.updateBlink();
      this.movePhase++;
      this.update(true);
      return false;
   },
   unitFromUnitIndex:function(unitIndex)
   {
      if (unitIndex==0) return this.units.infantry;
      if (unitIndex==1) return this.units.armor;
      if (unitIndex==2) return this.units.fighter;
      if (unitIndex==3) return this.units.bomber;
      if (unitIndex==4) return this.units.antiaircraftGun;
      if (unitIndex==5) return this.units.battleship;
      if (unitIndex==6) return this.units.aircraftCarrier;
      if (unitIndex==7) return this.units.transport;
      if (unitIndex==8) return this.units.submarine;
      if (unitIndex==9) return this.units.industry;
      return null;
   },
   unitFromMusterIndex:function(muster)
   {
      return this.unitFromUnitIndex(GamesByEmail.WW2Piece.unitFromMusterIndex(muster));
   },
   updateCompassHilite:function(blinkOn)
   {
      this.getElement("compassHilite").style.visibility=(this.compassRoseBlink && blinkOn ? "visible" : "hidden");
   },
   getNewGame2PlayerOrder:function(userInfo)
   {
      var ordered=new Array(5);
      ordered[0]=userInfo[3];
      ordered[1]=userInfo[0];
      ordered[2]=userInfo[3];
      ordered[3]=userInfo[1];
      ordered[4]=userInfo[4];
      return ordered;
   },
   getNewGame3PlayerOrder:function(userInfo)
   {
      var ordered=new Array(5);
      ordered[0]=userInfo[1];
      ordered[1]=userInfo[0];
      ordered[2]=userInfo[3];
      ordered[3]=userInfo[2];
      ordered[4]=userInfo[1];
      return ordered;
   },
   getNewGame4PlayerOrder:function(userInfo)
   {
      var ordered=new Array(5);
      ordered[0]=userInfo[4];
      ordered[1]=userInfo[0];
      ordered[2]=userInfo[3];
      ordered[3]=userInfo[1];
      ordered[4]=userInfo[4];
      return ordered;
   },
   getNewGame5PlayerOrder:function(userInfo)
   {
      var ordered=new Array(5);
      ordered[0]=userInfo[2];
      ordered[1]=userInfo[0];
      ordered[2]=userInfo[3];
      ordered[3]=userInfo[1];
      ordered[4]=userInfo[4];
      return ordered;
   },
   getNewGamePlayerOrder:function(userInfo)
   {
      if (userInfo[0].id==userInfo[1].id && userInfo[0].id==userInfo[2].id && userInfo[3].id==userInfo[4].id)
         return this.getNewGame2PlayerOrder(userInfo);
      if (userInfo[0].id==userInfo[2].id && userInfo[3].id==userInfo[4].id)
         return this.getNewGame3PlayerOrder(userInfo);
      if (userInfo[0].id==userInfo[2].id)
         return this.getNewGame4PlayerOrder(userInfo);
      return this.getNewGame5PlayerOrder(userInfo);
   },
   initializeNewGameForm:function(gameForm,userInfo)
   {
      GamesByEmail.Game.prototype.initializeNewGameForm.call(this,gameForm,userInfo);
      gameForm.info.b_UssrNoCombatFirstRound=this.info.getValue("b_UssrNoCombatFirstRound",false);
      gameForm.info.b_UssrNoCombatUntilAttacked=this.info.getValue("b_UssrNoCombatUntilAttacked",false);
      gameForm.info.b_NoAxisEconomicVictory=this.info.getValue("b_NoAxisEconomicVictory",false);
      gameForm.info.b_WeaponsDevelopmentBenefits=this.info.getValue("b_WeaponsDevelopmentBenefits",false);
      gameForm.info.b_MustControlStraits=this.info.getValue("b_MustControlStraits",false);
      gameForm.info.b_NoNewFactories=this.info.getValue("b_NoNewFactories",false);
      gameForm.info.b_InfDefendAt1=this.info.getValue("b_InfDefendAt1",false);
   },
   dispose:function()
   {
      if (GamesByEmail.Game.prototype.dispose) GamesByEmail.Game.prototype.dispose.call(this);
   },
   server:GamesByEmail.Game.prototype.server,
   serverSerialized:GamesByEmail.Game.prototype.serverSerialized,
   serverSynchronous:GamesByEmail.Game.prototype.serverSynchronous,
   resource:GamesByEmail.Game.prototype.resource,
   resourceUrl:GamesByEmail.Game.prototype.resourceUrl,
   event:GamesByEmail.Game.prototype.event,
   elementId:GamesByEmail.Game.prototype.elementId,
   getElement:GamesByEmail.Game.prototype.getElement,
   getElements:GamesByEmail.Game.prototype.getElements,
   getElementValue:GamesByEmail.Game.prototype.getElementValue,
   parseElementId:GamesByEmail.Game.prototype.parseElementId,
   attachEvent:GamesByEmail.Game.prototype.attachEvent,
   detachEvent:GamesByEmail.Game.prototype.detachEvent,
   processHtml:GamesByEmail.Game.prototype.processHtml,
   setBoard:GamesByEmail.Game.prototype.setBoard,
   updateBoardCaches:GamesByEmail.Game.prototype.updateBoardCaches,
   addToBlankValue:GamesByEmail.Game.prototype.addToBlankValue,
   calculateBlankValue:GamesByEmail.Game.prototype.calculateBlankValue,
   elementTitleAttributes:GamesByEmail.Game.prototype.elementTitleAttributes,
   setPlayerPrefs:GamesByEmail.Game.prototype.setPlayerPrefs,
   assembleHeaderHtml:GamesByEmail.Game.prototype.assembleHeaderHtml,
   getHeaderHtml:GamesByEmail.Game.prototype.getHeaderHtml,
   gameInProgressHeaderHtml:GamesByEmail.Game.prototype.gameInProgressHeaderHtml,
   drawOfferedHeaderHtml:GamesByEmail.Game.prototype.drawOfferedHeaderHtml,
   drawDeclinedHeaderHtml:GamesByEmail.Game.prototype.drawDeclinedHeaderHtml,
   turnHeaderHtml:GamesByEmail.Game.prototype.turnHeaderHtml,
   gameOverHeaderHtml:GamesByEmail.Game.prototype.gameOverHeaderHtml,
   drawAcceptedHeaderHtml:GamesByEmail.Game.prototype.drawAcceptedHeaderHtml,
   tieGameHeaderHtml:GamesByEmail.Game.prototype.tieGameHeaderHtml,
   resignedHeaderHtml:GamesByEmail.Game.prototype.resignedHeaderHtml,
   wonHeaderHtml:GamesByEmail.Game.prototype.wonHeaderHtml,
   getTeamAtDistance:GamesByEmail.Game.prototype.getTeamAtDistance,
   getTeamsForTitles:GamesByEmail.Game.prototype.getTeamsForTitles,
   valueFromBoardValue:GamesByEmail.Game.prototype.valueFromBoardValue,
   colorFromBoardValue:GamesByEmail.Game.prototype.colorFromBoardValue,
   boardValueFromValueColor:GamesByEmail.Game.prototype.boardValueFromValueColor,
   getTeamResource:GamesByEmail.Game.prototype.getTeamResource,
   getTeamFontColor:GamesByEmail.Game.prototype.getTeamFontColor,
   getTeamLogFontColor:GamesByEmail.Game.prototype.getTeamLogFontColor,
   getTeamLogFontBgColor:GamesByEmail.Game.prototype.getTeamLogFontBgColor,
   getTeamTitleHtml:GamesByEmail.Game.prototype.getTeamTitleHtml,
   getTeamTitlesHtml:GamesByEmail.Game.prototype.getTeamTitlesHtml,
   getTeamTitleAlignment:GamesByEmail.Game.prototype.getTeamTitleAlignment,
   aboveTeamTitleRowHtml:GamesByEmail.Game.prototype.aboveTeamTitleRowHtml,
   belowTeamTitleRowHtml:GamesByEmail.Game.prototype.belowTeamTitleRowHtml,
   getGamePromptsHtml:GamesByEmail.Game.prototype.getGamePromptsHtml,
   undoMoveHtml:GamesByEmail.Game.prototype.undoMoveHtml,
   sendMoveHtml:GamesByEmail.Game.prototype.sendMoveHtml,
   offerDrawHtml:GamesByEmail.Game.prototype.offerDrawHtml,
   acceptDeclineDrawHtml:GamesByEmail.Game.prototype.acceptDeclineDrawHtml,
   drawDeclinedHtml:GamesByEmail.Game.prototype.drawDeclinedHtml,
   resignHtml:GamesByEmail.Game.prototype.resignHtml,
   isMyTurn:GamesByEmail.Game.prototype.isMyTurn,
   getTurnHtml:GamesByEmail.Game.prototype.getTurnHtml,
   beginTurnHtml:GamesByEmail.Game.prototype.beginTurnHtml,
   continueTurnHtml:GamesByEmail.Game.prototype.continueTurnHtml,
   completeTurnHtml:GamesByEmail.Game.prototype.completeTurnHtml,
   spectatingHtml:GamesByEmail.Game.prototype.spectatingHtml,
   theyResignedHtml:GamesByEmail.Game.prototype.theyResignedHtml,
   youResignedHtml:GamesByEmail.Game.prototype.youResignedHtml,
   youTiedHtml:GamesByEmail.Game.prototype.youTiedHtml,
   drawAcceptedHtml:GamesByEmail.Game.prototype.drawAcceptedHtml,
   youWinHtml:GamesByEmail.Game.prototype.youWinHtml,
   youLoseHtml:GamesByEmail.Game.prototype.youLoseHtml,
   startAnotherGameHtml:GamesByEmail.Game.prototype.startAnotherGameHtml,
   closeWindowHtml:GamesByEmail.Game.prototype.closeWindowHtml,
   gameletHtml:GamesByEmail.Game.prototype.gameletHtml,
   notYourTurnHtml:GamesByEmail.Game.prototype.notYourTurnHtml,
   itsYourTurnHtml:GamesByEmail.Game.prototype.itsYourTurnHtml,
   pieHtml:GamesByEmail.Game.prototype.pieHtml,
   continueYourTurnHtml:GamesByEmail.Game.prototype.continueYourTurnHtml,
   completeYourTurnHtml:GamesByEmail.Game.prototype.completeYourTurnHtml,
   cancelGameHtml:GamesByEmail.Game.prototype.cancelGameHtml,
   sendPie:GamesByEmail.Game.prototype.sendPie,
   pie:GamesByEmail.Game.prototype.pie,
   getPieType:GamesByEmail.Game.prototype.getPieType,
   maybePie:GamesByEmail.Game.prototype.maybePie,
   pieButtonHtml:GamesByEmail.Game.prototype.pieButtonHtml,
   maybeResign:GamesByEmail.Game.prototype.maybeResign,
   resignButtonHtml:GamesByEmail.Game.prototype.resignButtonHtml,
   acceptDraw:GamesByEmail.Game.prototype.acceptDraw,
   acceptDrawButtonHtml:GamesByEmail.Game.prototype.acceptDrawButtonHtml,
   send:GamesByEmail.Game.prototype.send,
   processSecureMove:GamesByEmail.Game.prototype.processSecureMove,
   catchResponseError:GamesByEmail.Game.prototype.catchResponseError,
   responseErrorReported:GamesByEmail.Game.prototype.responseErrorReported,
   setCatchAndDebug:GamesByEmail.Game.prototype.setCatchAndDebug,
   sendToServer:GamesByEmail.Game.prototype.sendToServer,
   receiveSendMoveResults:GamesByEmail.Game.prototype.receiveSendMoveResults,
   handleMoveCollision:GamesByEmail.Game.prototype.handleMoveCollision,
   sendMoveButtonHtml:GamesByEmail.Game.prototype.sendMoveButtonHtml,
   undo:GamesByEmail.Game.prototype.undo,
   undoButtonHtml:GamesByEmail.Game.prototype.undoButtonHtml,
   offerDrawCheckBoxHtml:GamesByEmail.Game.prototype.offerDrawCheckBoxHtml,
   cancelGameResponse:GamesByEmail.Game.prototype.cancelGameResponse,
   cancelGame:GamesByEmail.Game.prototype.cancelGame,
   cancelGameButtonHtml:GamesByEmail.Game.prototype.cancelGameButtonHtml,
   refreshResponse:GamesByEmail.Game.prototype.refreshResponse,
   refreshGame:GamesByEmail.Game.prototype.refreshGame,
   refreshGameButtonHtml:GamesByEmail.Game.prototype.refreshGameButtonHtml,
   sendReminderResponse:GamesByEmail.Game.prototype.sendReminderResponse,
   sendReminder:GamesByEmail.Game.prototype.sendReminder,
   sendReminderButtonHtml:GamesByEmail.Game.prototype.sendReminderButtonHtml,
   getNextGamesTitle:GamesByEmail.Game.prototype.getNextGamesTitle,
   gameFormOnCreateEvent:GamesByEmail.Game.prototype.gameFormOnCreateEvent,
   gameFormOnCancelEvent:GamesByEmail.Game.prototype.gameFormOnCancelEvent,
   showStartAnotherGameForm:GamesByEmail.Game.prototype.showStartAnotherGameForm,
   anotherGameStarted:GamesByEmail.Game.prototype.anotherGameStarted,
   requestNewGameUserInfo:GamesByEmail.Game.prototype.requestNewGameUserInfo,
   startAnotherGame:GamesByEmail.Game.prototype.startAnotherGame,
   startAnotherGameButtonHtml:GamesByEmail.Game.prototype.startAnotherGameButtonHtml,
   closeWindow:GamesByEmail.Game.prototype.closeWindow,
   closeWindowButtonHtml:GamesByEmail.Game.prototype.closeWindowButtonHtml,
   transformHashLinksToOnClicks:GamesByEmail.Game.prototype.transformHashLinksToOnClicks,
   processText_clippedPiece:GamesByEmail.Game.prototype.processText_clippedPiece,
   processText_staticBoardUrl:GamesByEmail.Game.prototype.processText_staticBoardUrl,
   processText:GamesByEmail.Game.prototype.processText,
   cookRule:GamesByEmail.Game.prototype.cookRule,
   showRule:GamesByEmail.Game.prototype.showRule,
   resizeFont:GamesByEmail.Game.prototype.resizeFont,
   appendPopupOnLoadScript:GamesByEmail.Game.prototype.appendPopupOnLoadScript,
   rulesPopupHtml:GamesByEmail.Game.prototype.rulesPopupHtml,
   openRules:GamesByEmail.Game.prototype.openRules,
   openRulesAnchorHtml:GamesByEmail.Game.prototype.openRulesAnchorHtml,
   requestLog:GamesByEmail.Game.prototype.requestLog,
   sendLogRequestToServer:GamesByEmail.Game.prototype.sendLogRequestToServer,
   requiredScripts:GamesByEmail.Game.prototype.requiredScripts,
   setAsLog:GamesByEmail.Game.prototype.setAsLog,
   logPopupHtml:GamesByEmail.Game.prototype.logPopupHtml,
   getLogDialogSize:GamesByEmail.Game.prototype.getLogDialogSize,
   openLog:GamesByEmail.Game.prototype.openLog,
   openLogAnchorHtml:GamesByEmail.Game.prototype.openLogAnchorHtml,
   setPreferences:GamesByEmail.Game.prototype.setPreferences,
   savePreferencesResponse:GamesByEmail.Game.prototype.savePreferencesResponse,
   savePreferencesToServer:GamesByEmail.Game.prototype.savePreferencesToServer,
   extractPreferences:GamesByEmail.Game.prototype.extractPreferences,
   savePreferences:GamesByEmail.Game.prototype.savePreferences,
   appendAdditionalPreferencesHtml:GamesByEmail.Game.prototype.appendAdditionalPreferencesHtml,
   preferencesPopupHtml:GamesByEmail.Game.prototype.preferencesPopupHtml,
   openPreferences:GamesByEmail.Game.prototype.openPreferences,
   openPreferencesAnchorHtml:GamesByEmail.Game.prototype.openPreferencesAnchorHtml,
   sendProblemReport:GamesByEmail.Game.prototype.sendProblemReport,
   sendProblemReportToServer:GamesByEmail.Game.prototype.sendProblemReportToServer,
   sendProblemReportResponse:GamesByEmail.Game.prototype.sendProblemReportResponse,
   reportProblemPopupHtml:GamesByEmail.Game.prototype.reportProblemPopupHtml,
   reportProblem:GamesByEmail.Game.prototype.reportProblem,
   reportProblemAnchorHtml:GamesByEmail.Game.prototype.reportProblemAnchorHtml,
   getSpectatorUrl:GamesByEmail.Game.prototype.getSpectatorUrl,
   getSpectatorAnchorHtml:GamesByEmail.Game.prototype.getSpectatorAnchorHtml,
   getActionLinksHtml:GamesByEmail.Game.prototype.getActionLinksHtml,
   openPopup:GamesByEmail.Game.prototype.openPopup,
   logUpdate:GamesByEmail.Game.prototype.logUpdate,
   titleFromTeamColor:GamesByEmail.Game.prototype.titleFromTeamColor,
   hiliteImageHtml:GamesByEmail.Game.prototype.hiliteImageHtml,
   synchTeam:GamesByEmail.Game.prototype.synchTeam,
   setPerspective:GamesByEmail.Game.prototype.setPerspective,
   addNote:GamesByEmail.Game.prototype.addNote,
   clearNotifications:GamesByEmail.Game.prototype.clearNotifications,
   setMessageAndNotes:GamesByEmail.Game.prototype.setMessageAndNotes,
   clearUnsentMoves:GamesByEmail.Game.prototype.clearUnsentMoves,
   doInitialization:GamesByEmail.Game.prototype.doInitialization,
   sendInitializationToServer:GamesByEmail.Game.prototype.sendInitializationToServer,
   maybeSwitchPlayers:GamesByEmail.Game.prototype.maybeSwitchPlayers,
   sendSetGameEndedTurnsOff:GamesByEmail.Game.prototype.sendSetGameEndedTurnsOff,
   receiveSetGameEndedTurnsOff:GamesByEmail.Game.prototype.receiveSetGameEndedTurnsOff,
   setMyTurnsOffForUs:GamesByEmail.Game.prototype.setMyTurnsOffForUs,
   setGameEndedTurnsOff:GamesByEmail.Game.prototype.setGameEndedTurnsOff,
   setSpectatingStatus:GamesByEmail.Game.prototype.setSpectatingStatus,
   doSyncronization:GamesByEmail.Game.prototype.doSyncronization,
   enablePermanentControls:GamesByEmail.Game.prototype.enablePermanentControls,
   load:GamesByEmail.Game.prototype.load,
   receiveData:GamesByEmail.Game.prototype.receiveData,
   importRawGame:GamesByEmail.Game.prototype.importRawGame,
   importData:GamesByEmail.Game.prototype.importData,
   importLog:GamesByEmail.Game.prototype.importLog,
   findPlayerByIndices:GamesByEmail.Game.prototype.findPlayerByIndices,
   washHtml:GamesByEmail.Game.prototype.washHtml,
   getHtml:GamesByEmail.Game.prototype.getHtml,
   setInnerHtml:GamesByEmail.Game.prototype.setInnerHtml,
   appendBoardLayoutHtml:GamesByEmail.Game.prototype.appendBoardLayoutHtml,
   appendControlsHtml:GamesByEmail.Game.prototype.appendControlsHtml,
   printerFriendlyLogHtml:GamesByEmail.Game.prototype.printerFriendlyLogHtml,
   printerFriendlyLog:GamesByEmail.Game.prototype.printerFriendlyLog,
   appendLogHtml:GamesByEmail.Game.prototype.appendLogHtml,
   appendGameStateRowHtml:GamesByEmail.Game.prototype.appendGameStateRowHtml,
   appendBoardSpaceHtml:GamesByEmail.Game.prototype.appendBoardSpaceHtml,
   appendTestControlsHtml:GamesByEmail.Game.prototype.appendTestControlsHtml,
   appendInnerHtml:GamesByEmail.Game.prototype.appendInnerHtml,
   updateBoardImageSize:GamesByEmail.Game.prototype.updateBoardImageSize,
   clearCachedElements:GamesByEmail.Game.prototype.clearCachedElements,
   setAboveBoardHtml:GamesByEmail.Game.prototype.setAboveBoardHtml,
   setOverlayHtml:GamesByEmail.Game.prototype.setOverlayHtml,
   redraw:GamesByEmail.Game.prototype.redraw,
   receiveGameMessage:GamesByEmail.Game.prototype.receiveGameMessage,
   sendGameMessageToServer:GamesByEmail.Game.prototype.sendGameMessageToServer,
   clearGameMessage:GamesByEmail.Game.prototype.clearGameMessage,
   sendGameMessage:GamesByEmail.Game.prototype.sendGameMessage,
   receivePlayerNotes:GamesByEmail.Game.prototype.receivePlayerNotes,
   sendPlayerNotesToServer:GamesByEmail.Game.prototype.sendPlayerNotesToServer,
   savePlayerNotes:GamesByEmail.Game.prototype.savePlayerNotes,
   receiveTeamMessage:GamesByEmail.Game.prototype.receiveTeamMessage,
   sendTeamMessageToServer:GamesByEmail.Game.prototype.sendTeamMessageToServer,
   getScriptId:GamesByEmail.Game.prototype.getScriptId,
   getScriptSrc:GamesByEmail.Game.prototype.getScriptSrc,
   mouseEvents:GamesByEmail.Game.prototype.mouseEvents,
   getTextHtml:GamesByEmail.Game.prototype.getTextHtml,
   getTextareaHtml:GamesByEmail.Game.prototype.getTextareaHtml,
   getSelectHtml:GamesByEmail.Game.prototype.getSelectHtml,
   getOptionHtml:GamesByEmail.Game.prototype.getOptionHtml,
   getButtonHtml:GamesByEmail.Game.prototype.getButtonHtml,
   getHtmlButtonHtml:GamesByEmail.Game.prototype.getHtmlButtonHtml,
   getVButtonHtml:GamesByEmail.Game.prototype.getVButtonHtml,
   getCheckboxHtml:GamesByEmail.Game.prototype.getCheckboxHtml,
   getRadioHtml:GamesByEmail.Game.prototype.getRadioHtml,
   getAnchorHtml:GamesByEmail.Game.prototype.getAnchorHtml,
   clearMouseEvents:GamesByEmail.Game.prototype.clearMouseEvents,
   clearHilites:GamesByEmail.Game.prototype.clearHilites,
   showPoint:GamesByEmail.Game.prototype.showPoint,
   showPolygon:GamesByEmail.Game.prototype.showPolygon,
   getPieceRect:GamesByEmail.Game.prototype.getPieceRect,
   getPieceSrc:GamesByEmail.Game.prototype.getPieceSrc,
   getImageSrc:GamesByEmail.Game.prototype.getImageSrc,
   getStaticFolder:GamesByEmail.Game.prototype.getStaticFolder,
   getCodeFolder:GamesByEmail.Game.prototype.getCodeFolder,
   folder:GamesByEmail.Game.prototype.folder,
   typeTitle:GamesByEmail.Game.prototype.typeTitle,
   jsSerialize:GamesByEmail.Game.prototype.jsSerialize,
   findPlayer:GamesByEmail.Game.prototype.findPlayer,
   findNextPlayer:GamesByEmail.Game.prototype.findNextPlayer,
   getTurnTeam:GamesByEmail.Game.prototype.getTurnTeam,
   findTeamByIndexString:GamesByEmail.Game.prototype.findTeamByIndexString,
   findPlayersByChatIds:GamesByEmail.Game.prototype.findPlayersByChatIds,
   nextTeam:GamesByEmail.Game.prototype.nextTeam,
   findWinningTeam:GamesByEmail.Game.prototype.findWinningTeam,
   numTeamsPlaying:GamesByEmail.Game.prototype.numTeamsPlaying,
   setEnded:GamesByEmail.Game.prototype.setEnded,
   setTeamResigned:GamesByEmail.Game.prototype.setTeamResigned,
   setResigned:GamesByEmail.Game.prototype.setResigned,
   clearTurns:GamesByEmail.Game.prototype.clearTurns,
   isXYBoardClear:GamesByEmail.Game.prototype.isXYBoardClear,
   isPointBoardClear:GamesByEmail.Game.prototype.isPointBoardClear,
   isXYOnBoard:GamesByEmail.Game.prototype.isXYOnBoard,
   isPointOnBoard:GamesByEmail.Game.prototype.isPointOnBoard,
   numInPath:GamesByEmail.Game.prototype.numInPath,
   isPathClear:GamesByEmail.Game.prototype.isPathClear,
   setValueAtXY:GamesByEmail.Game.prototype.setValueAtXY,
   setValueAtPoint:GamesByEmail.Game.prototype.setValueAtPoint,
   movePiece:GamesByEmail.Game.prototype.movePiece,
   forEachTeam:GamesByEmail.Game.prototype.forEachTeam,
   forEachBoardPoint:GamesByEmail.Game.prototype.forEachBoardPoint,
   colorFromXYBoard:GamesByEmail.Game.prototype.colorFromXYBoard,
   colorFromPointBoard:GamesByEmail.Game.prototype.colorFromPointBoard,
   isColorAtXY:GamesByEmail.Game.prototype.isColorAtXY,
   isColorAtPoint:GamesByEmail.Game.prototype.isColorAtPoint,
   isValueColorAtXY:GamesByEmail.Game.prototype.isValueColorAtXY,
   isValueColorAtPoint:GamesByEmail.Game.prototype.isValueColorAtPoint,
   valueIndexFromBoardXY:GamesByEmail.Game.prototype.valueIndexFromBoardXY,
   valueIndexFromBoardPoint:GamesByEmail.Game.prototype.valueIndexFromBoardPoint,
   valueFromXYBoard:GamesByEmail.Game.prototype.valueFromXYBoard,
   valueFromPointBoard:GamesByEmail.Game.prototype.valueFromPointBoard,
   boardPointFromValueIndex:GamesByEmail.Game.prototype.boardPointFromValueIndex,
   screenRectFromBoardXY:GamesByEmail.Game.prototype.screenRectFromBoardXY,
   screenRectFromBoardPoint:GamesByEmail.Game.prototype.screenRectFromBoardPoint,
   boardPointFromScreenXY:GamesByEmail.Game.prototype.boardPointFromScreenXY,
   boardPointFromScreenPoint:GamesByEmail.Game.prototype.boardPointFromScreenPoint,
   isBoardPointHidden:GamesByEmail.Game.prototype.isBoardPointHidden,
   setConstrainer:GamesByEmail.Game.prototype.setConstrainer,
   constrainPoint:GamesByEmail.Game.prototype.constrainPoint,
   constrainRectangle:GamesByEmail.Game.prototype.constrainRectangle,
   checkMove:GamesByEmail.Game.prototype.checkMove,
   logAnchorOnKeyDown:GamesByEmail.Game.prototype.logAnchorOnKeyDown,
   getPlayerLogCol:GamesByEmail.Game.prototype.getPlayerLogCol,
   rowByRoundTurnLogEntriesHtml:GamesByEmail.Game.prototype.rowByRoundTurnLogEntriesHtml,
   rowByMoveLogEntriesHtml:GamesByEmail.Game.prototype.rowByMoveLogEntriesHtml,
   freeFormLogEntriesHtml:GamesByEmail.Game.prototype.freeFormLogEntriesHtml,
   logEntriesHtml:GamesByEmail.Game.prototype.logEntriesHtml,
   updateLogEntry:GamesByEmail.Game.prototype.updateLogEntry,
   processLogMoveEvent:GamesByEmail.Game.prototype.processLogMoveEvent,
   receiveLog:GamesByEmail.Game.prototype.receiveLog,
   getLogColoringSpans:GamesByEmail.Game.prototype.getLogColoringSpans,
   viewLog:GamesByEmail.Game.prototype.viewLog,
   logEntryParts:GamesByEmail.Game.prototype.logEntryParts,
   logEntry:GamesByEmail.Game.prototype.logEntry,
   parseLogEntries:GamesByEmail.Game.prototype.parseLogEntries,
   parseLastLogEntry:GamesByEmail.Game.prototype.parseLastLogEntry,
   setFloatHtml:GamesByEmail.Game.prototype.setFloatHtml,
   setMouseHtml:GamesByEmail.Game.prototype.setMouseHtml,
   updateMouseHtmlPosition:GamesByEmail.Game.prototype.updateMouseHtmlPosition,
   dieRoll:GamesByEmail.Game.prototype.dieRoll,
   diceRolls:GamesByEmail.Game.prototype.diceRolls,
   openPlayerChatAnchorHtml:GamesByEmail.Game.prototype.openPlayerChatAnchorHtml,
   openPlayerChat:GamesByEmail.Game.prototype.openPlayerChat,
   playerChatPopupHtml:GamesByEmail.Game.prototype.playerChatPopupHtml,
   requestPlayerChatMessage:GamesByEmail.Game.prototype.requestPlayerChatMessage,
   receivePlayerChatMessage:GamesByEmail.Game.prototype.receivePlayerChatMessage,
   chatMessageShown:GamesByEmail.Game.prototype.chatMessageShown,
   setChatStatus:GamesByEmail.Game.prototype.setChatStatus,
   sendSetChatStatusRequest:GamesByEmail.Game.prototype.sendSetChatStatusRequest,
   receiveSetChatStatusResponse:GamesByEmail.Game.prototype.receiveSetChatStatusResponse,
   okToChat:GamesByEmail.Game.prototype.okToChat,
   postPlayerChatOnClick:GamesByEmail.Game.prototype.postPlayerChatOnClick,
   postPlayerChatMessage:GamesByEmail.Game.prototype.postPlayerChatMessage,
   blurt:GamesByEmail.Game.prototype.blurt,
   debug:GamesByEmail.Game.prototype.debug,
   debugUpdate:GamesByEmail.Game.prototype.debugUpdate,
   addProfiler:GamesByEmail.Game.prototype.addProfiler,
   openProfiler:GamesByEmail.Game.prototype.openProfiler,
   loadProfiler:GamesByEmail.Game.prototype.loadProfiler
};
GamesByEmail.WW2Game.resourcePack={
      piecesClass:null,
      territoriesClass:GamesByEmail.WW2Territories,
      territoryClass:GamesByEmail.WW2Territory,
      gameFolder:"WW2",
      gameTypes:[33],
      gameTypeTitles:["W.W.II"],
      allowedNumPlayers:[2,3,4,5],
      teamTitles:["U.S.S.R.","Germany","United Kingdom","Japan","United States"],
      teamFontColors:["#C72918","#666666","#CB7838","#BCA20E","#809F55","#E6B477","#627EB0"],
      board:{image:{src:"Board.gif?v3",size:new Foundation.Point(946,554)},
            pieceImage:"Pieces.gif?v2",
            blinkInterval:500,
            maxPieceSize:new Foundation.Point(26,16),
            compassPoint:new Foundation.Point(476,456),
            battleBoardPieceMod:10,
            territoryPieceMod:25,
            compassHilite:
            {
               src:"CompassHilite.gif",
               width:107,
               height:123,
               top:388,
               left:422
            },
            pieceRects:{
               i0:new Foundation.Rectangle(0,0,15,27),
               i1:new Foundation.Rectangle(15,0,15,27),
               i2:new Foundation.Rectangle(30,0,15,27),
               i3:new Foundation.Rectangle(45,0,15,27),
               i4:new Foundation.Rectangle(60,0,15,27),
               i5:new Foundation.Rectangle(75,0,15,27),
               i6:new Foundation.Rectangle(90,0,15,27),
               a1:new Foundation.Rectangle(105,0,24,24),
               a2:new Foundation.Rectangle(129,0,24,24),
               a3:new Foundation.Rectangle(153,0,24,24),
               a4:new Foundation.Rectangle(177,0,24,24),
               a5:new Foundation.Rectangle(201,0,24,24),
               a6:new Foundation.Rectangle(225,0,24,24),
               d1:new Foundation.Rectangle(249,0,24,24),
               d2:new Foundation.Rectangle(273,0,24,24),
               d3:new Foundation.Rectangle(297,0,24,24),
               d4:new Foundation.Rectangle(321,0,24,24),
               d5:new Foundation.Rectangle(345,0,24,24),
               d6:new Foundation.Rectangle(369,0,24,24)
            }
      },
      territoryOverlayImage:"%c/%i.gif",
      territoryHiliteImage:"%c/%i_h.gif",
      territories:[
             { //   0
              title:"Afghanistan",
              abbreviation:"Afg",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(439,241,440,235,444,234,447,222,455,219,471,218,489,220,488,226,481,228,477,242,466,248,462,245,439,241),
              hiliteOffset:new Foundation.Point(440,14),
              hiliteSize:new Foundation.Point(145,233),
              overlaySize:new Foundation.Point(145,233),
              adjacentIndices:[27,31,45,51],
              detailRectangle:new Foundation.Rectangle(515,5,71,57),
              musters:{g:new Foundation.Point(536,42),m:new Foundation.Point(535,25),m_:new Foundation.Point(-5,7),a:new Foundation.Point(548,33),a_:new Foundation.Point(1,-6),f:new Foundation.Point(561,41),f_:new Foundation.Point(-9,4),b:new Foundation.Point(570,21),b_:new Foundation.Point(2,8)}
             },
             { //   1
              title:"Alaska",
              abbreviation:"Ala",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(744,143,764,125,752,112,769,84,777,81,783,63,813,63,813,122,821,123,830,137,831,148,826,149,820,144,816,133,810,127,799,128,790,125,785,136,777,132,744,143),
              hiliteOffset:new Foundation.Point(744,64),
              hiliteSize:new Foundation.Point(88,86),
              overlaySize:new Foundation.Point(88,86),
              adjacentIndices:[66,76,120],
              ipcValue:2,
              musters:{i:new Foundation.Point(781,107),g:new Foundation.Point(800,106),m:new Foundation.Point(766,118),m_:new Foundation.Point(6,0),a:new Foundation.Point(804,117),a_:new Foundation.Point(-9,2),f:new Foundation.Point(783,80),f_:new Foundation.Point(-5,9),b:new Foundation.Point(801,72),b_:new Foundation.Point(1,9)}
             },
             { //   2
              title:"Algeria",
              abbreviation:"Alg",
              originalPowerIndex:1, // 1
              polygon:new Foundation.Polygon(196,275,199,263,213,249,223,253,248,248,266,239,272,242,274,258,279,262,270,271,267,268,264,273,267,275,258,285,246,285,238,285,229,294,208,275,196,275),
              hiliteOffset:new Foundation.Point(197,239),
              hiliteSize:new Foundation.Point(82,56),
              overlaySize:new Foundation.Point(82,56),
              adjacentIndices:[20,23,34,117,123],
              ipcValue:1,
              musters:{i:new Foundation.Point(227,263),g:new Foundation.Point(246,263),m:new Foundation.Point(255,277),m_:new Foundation.Point(4,-6),a:new Foundation.Point(263,250),a_:new Foundation.Point(-10,2),f:new Foundation.Point(229,284),f_:new Foundation.Point(4,-5),b:new Foundation.Point(210,268),b_:new Foundation.Point(2,-5)}
             },
             { //   3
              title:"Anglo-Egypt/Sudan",
              abbreviation:"Egy",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(307,340,307,321,312,320,313,280,317,273,314,267,342,266,347,269,369,320,370,329,360,348,366,355,345,367,339,358,325,364,317,361,315,347,307,340),
              hiliteOffset:new Foundation.Point(308,266),
              hiliteSize:new Foundation.Point(61,101),
              overlaySize:new Foundation.Point(61,101),
              adjacentIndices:[7,20,28,32,34,58,81,106],
              ipcValue:2,
              musters:{i:new Foundation.Point(329,335),g:new Foundation.Point(348,335),m:new Foundation.Point(326,350),m_:new Foundation.Point(-5,-9),a:new Foundation.Point(347,351),a_:new Foundation.Point(4,-7),f:new Foundation.Point(344,285),f_:new Foundation.Point(1,8),b:new Foundation.Point(324,287),b_:new Foundation.Point(1,8)}
             },
             { //   4
              title:"Angola",
              abbreviation:"Ang",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(279,468,287,447,280,436,319,436,331,456,322,465,307,469,287,486,279,468),
              hiliteOffset:new Foundation.Point(280,436),
              hiliteSize:new Foundation.Point(50,50),
              overlaySize:new Foundation.Point(50,50),
              adjacentIndices:[7,32,61,122],
              musters:{g:new Foundation.Point(305,465),m:new Foundation.Point(289,455),m_:new Foundation.Point(5,0),a:new Foundation.Point(293,442),a_:new Foundation.Point(6,0),f:new Foundation.Point(289,477),f_:new Foundation.Point(2,-4),b:new Foundation.Point(314,450),b_:new Foundation.Point(2,5)}
             },
             { //   5
              title:"Argentina/Chile",
              abbreviation:"Arg",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(51,471,56,462,53,452,55,430,85,422,97,439,111,439,87,472,73,484,68,505,66,512,75,516,69,522,58,514,54,505,51,471),
              hiliteOffset:new Foundation.Point(51,423),
              hiliteSize:new Foundation.Point(60,99),
              overlaySize:new Foundation.Point(60,99),
              adjacentIndices:[9,46,77,108,121],
              musters:{g:new Foundation.Point(84,460),m:new Foundation.Point(80,438),m_:new Foundation.Point(6,2),a:new Foundation.Point(62,444),a_:new Foundation.Point(3,-5),f:new Foundation.Point(62,507),f_:new Foundation.Point(0,-6),b:new Foundation.Point(63,482),b_:new Foundation.Point(-1,-8)}
             },
             { //   6
              title:"Australia",
              abbreviation:"Aus",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(566,466,570,454,587,447,610,427,614,434,631,417,640,424,649,423,645,439,662,446,664,430,669,426,703,475,709,492,695,528,686,543,678,547,662,547,639,530,633,518,601,522,581,531,569,528,572,523,571,491,567,486,570,482,570,471,566,466),
              hiliteOffset:new Foundation.Point(566,418),
              hiliteSize:new Foundation.Point(143,129),
              overlaySize:new Foundation.Point(143,129),
              adjacentIndices:[98,114,127],
              ipcValue:2,
              musters:{i:new Foundation.Point(627,477),g:new Foundation.Point(648,477),m:new Foundation.Point(617,504),m_:new Foundation.Point(9,0),a:new Foundation.Point(668,503),a_:new Foundation.Point(0,9),f:new Foundation.Point(673,479),f_:new Foundation.Point(-11,-13),b:new Foundation.Point(599,471),b_:new Foundation.Point(-5,13)}
             },
             { //   7
              title:"Belgian Congo",
              abbreviation:"Cng",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(267,384,305,375,317,361,325,364,339,358,345,367,345,381,324,408,319,409,319,427,324,432,319,436,280,436,271,416,267,384),
              hiliteOffset:new Foundation.Point(267,358),
              hiliteSize:new Foundation.Point(77,78),
              overlaySize:new Foundation.Point(77,78),
              adjacentIndices:[3,4,20,32,71],
              ipcValue:1,
              musters:{i:new Foundation.Point(292,404),g:new Foundation.Point(311,404),m:new Foundation.Point(336,371),m_:new Foundation.Point(-8,0),a:new Foundation.Point(330,383),a_:new Foundation.Point(-11,0),f:new Foundation.Point(310,427),f_:new Foundation.Point(-3,-6),b:new Foundation.Point(288,425),b_:new Foundation.Point(-4,-7)}
             },
             { //   8
              title:"Borneo/Celebes",
              abbreviation:"Bor",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(594,361,613,350,636,364,631,382,620,385,596,379,594,361),
              hiliteOffset:new Foundation.Point(593,351),
              hiliteSize:new Foundation.Point(265,138),
              overlaySize:new Foundation.Point(265,138),
              detailRectangle:new Foundation.Rectangle(785,434,78,56),
              adjacentIndices:[72],
              ipcValue:1,
              musters:{i:new Foundation.Point(805,471),g:new Foundation.Point(811,479),m:new Foundation.Point(848,467),m_:new Foundation.Point(-5,-4),a:new Foundation.Point(843,481),a_:new Foundation.Point(-3,-5),f:new Foundation.Point(822,478),f_:new Foundation.Point(3,-8),b:new Foundation.Point(816,463),b_:new Foundation.Point(4,-7)}
             },
             { //   9
              title:"Brazil",
              abbreviation:"Bra",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(42,388,45,381,51,379,54,362,66,362,67,356,78,351,84,362,106,355,109,360,112,365,130,374,138,376,146,382,150,388,147,398,139,406,129,430,111,439,97,439,85,422,84,412,62,395,51,398,42,388),
              hiliteOffset:new Foundation.Point(43,352),
              hiliteSize:new Foundation.Point(107,87),
              overlaySize:new Foundation.Point(107,87),
              adjacentIndices:[5,46,63,99,110],
              ipcValue:3,
              musters:{i:new Foundation.Point(95,398),g:new Foundation.Point(114,397),m:new Foundation.Point(132,389),m_:new Foundation.Point(-2,8),a:new Foundation.Point(110,422),a_:new Foundation.Point(-9,-6),f:new Foundation.Point(86,373),f_:new Foundation.Point(9,-1),b:new Foundation.Point(68,383),b_:new Foundation.Point(0,-7)}
             },
             { //  10
              title:"Caroline Islands",
              abbreviation:"Car",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(678,344,691,328,707,330,714,340,678,344),
              hiliteOffset:new Foundation.Point(680,328),
              hiliteSize:new Foundation.Point(256,151),
              overlaySize:new Foundation.Point(256,151),
              detailRectangle:new Foundation.Rectangle(864,434,77,56),
              adjacentIndices:[73],
              musters:{g:new Foundation.Point(900,473),m:new Foundation.Point(926,472),m_:new Foundation.Point(4,-7),a:new Foundation.Point(912,472),a_:new Foundation.Point(5,-7),f:new Foundation.Point(893,456),f_:new Foundation.Point(9,-3),b:new Foundation.Point(885,471),b_:new Foundation.Point(-4,-6)}
             },
             { //  11
              title:"Caucasus",
              abbreviation:"Cau",
              originalPowerIndex:0, // 0
              polygon:new Foundation.Polygon(374,148,377,146,378,108,390,97,395,100,402,96,411,103,415,120,411,131,414,140,414,153,401,158,399,167,403,168,406,174,401,178,399,188,410,204,408,210,399,210,389,205,378,185,380,172,383,166,376,156,374,148),
              hiliteOffset:new Foundation.Point(375,97),
              hiliteSize:new Foundation.Point(40,113),
              overlaySize:new Foundation.Point(40,113),
              adjacentIndices:[30,45,49,59,60,101,126],
              ipcValue:3,
              musters:{i:new Foundation.Point(385,135),g:new Foundation.Point(404,134),m:new Foundation.Point(401,107),m_:new Foundation.Point(2,8),a:new Foundation.Point(387,110),a_:new Foundation.Point(0,8),f:new Foundation.Point(390,164),f_:new Foundation.Point(2,-9),b:new Foundation.Point(389,180),b_:new Foundation.Point(3,7)}
             },
             { //  12
              title:"China",
              abbreviation:"Chi",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(550,218,557,202,561,184,570,183,575,186,595,178,595,173,604,171,605,177,596,196,592,216,598,222,603,223,606,232,601,234,597,242,591,244,585,261,566,268,566,259,560,257,553,244,550,218),
              hiliteOffset:new Foundation.Point(551,172),
              hiliteSize:new Foundation.Point(55,95),
              overlaySize:new Foundation.Point(55,95),
              adjacentIndices:[21,33,35,39,51],
              ipcValue:2,
              musters:{i:new Foundation.Point(569,209),g:new Foundation.Point(588,209),m:new Foundation.Point(560,226),m_:new Foundation.Point(9,-1),a:new Foundation.Point(591,234),a_:new Foundation.Point(-10,2),f:new Foundation.Point(588,190),f_:new Foundation.Point(-9,1),b:new Foundation.Point(568,249),b_:new Foundation.Point(3,4)}
             },
             { //  13
              title:"East Indies",
              abbreviation:"Sum",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(536,354,543,351,555,360,566,375,567,381,573,383,568,392,610,412,598,417,566,412,554,407,544,394,536,354),
              hiliteOffset:new Foundation.Point(536,351),
              hiliteSize:new Foundation.Point(75,66),
              overlaySize:new Foundation.Point(75,66),
              adjacentIndices:[78],
              ipcValue:2,
              musters:{i:new Foundation.Point(560,408),g:new Foundation.Point(551,396),m:new Foundation.Point(572,405),m_:new Foundation.Point(-5,-5),a:new Foundation.Point(591,410),a_:new Foundation.Point(-5,-4),f:new Foundation.Point(542,357),f_:new Foundation.Point(5,4),b:new Foundation.Point(560,386),b_:new Foundation.Point(-5,-6)}
             },
             { //  14
              title:"Eastern Canada",
              abbreviation:"ECa",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(3,188,3,86,9,85,17,90,17,81,26,75,36,77,50,88,55,82,64,86,55,99,41,102,41,108,28,112,18,132,23,144,29,145,47,154,57,167,59,154,64,146,62,137,69,116,92,122,91,132,95,135,101,129,107,133,107,142,125,160,137,190,125,192,114,185,114,176,101,182,102,190,110,190,116,195,94,205,89,203,86,191,72,200,48,209,34,187,3,188),
              hiliteOffset:new Foundation.Point(4,76),
              hiliteSize:new Foundation.Point(133,132),
              overlaySize:new Foundation.Point(133,132),
              adjacentIndices:[16,66,80],
              ipcValue:3,
              musters:{i:new Foundation.Point(12,174),g:new Foundation.Point(31,173),m:new Foundation.Point(69,166),m_:new Foundation.Point(-10,1),a:new Foundation.Point(52,180),a_:new Foundation.Point(4,8),f:new Foundation.Point(79,183),f_:new Foundation.Point(12,-5),b:new Foundation.Point(89,151),b_:new Foundation.Point(-5,-10)}
             },
             { //  15
              title:"Eastern Europe",
              abbreviation:"EEu",
              originalPowerIndex:1, // 1
              polygon:new Foundation.Polygon(300,126,304,114,310,109,306,102,319,97,323,93,326,98,334,94,343,101,343,176,350,176,353,180,342,196,345,210,339,210,336,215,334,208,328,213,322,209,318,198,310,189,315,179,312,174,312,159,316,147,313,130,300,126),
              hiliteOffset:new Foundation.Point(301,95),
              hiliteSize:new Foundation.Point(53,120),
              overlaySize:new Foundation.Point(53,120),
              adjacentIndices:[24,30,53,60,70,101],
              ipcValue:3,
              musters:{i:new Foundation.Point(318,116),g:new Foundation.Point(337,116),m:new Foundation.Point(316,106),m_:new Foundation.Point(8,0),a:new Foundation.Point(329,145),a_:new Foundation.Point(0,7),f:new Foundation.Point(331,199),f_:new Foundation.Point(-4,-5),b:new Foundation.Point(325,177),b_:new Foundation.Point(6,2)}
             },
             { //  16
              title:"Eastern U.S.A.",
              abbreviation:"EUS",
              originalPowerIndex:4, // 4
              isCapital:true,
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(3,262,3,188,34,187,48,209,72,200,86,191,89,203,83,210,83,217,63,234,63,239,50,255,52,277,46,278,42,262,3,262),
              hiliteOffset:new Foundation.Point(4,189),
              hiliteSize:new Foundation.Point(86,90),
              overlaySize:new Foundation.Point(86,90),
              adjacentIndices:[14,68,82],
              ipcValue:12,
              musters:{i:new Foundation.Point(26,211),g:new Foundation.Point(13,210),m:new Foundation.Point(56,233),m_:new Foundation.Point(1,-7),a:new Foundation.Point(72,212),a_:new Foundation.Point(5,-6),f:new Foundation.Point(14,252),f_:new Foundation.Point(9,1),b:new Foundation.Point(15,235),b_:new Foundation.Point(10,-5)}
             },
             { //  17
              title:"Eire",
              abbreviation:"Ire",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(185,121,185,111,196,99,207,96,214,98,215,108,203,122,185,121),
              hiliteOffset:new Foundation.Point(184,96),
              hiliteSize:new Foundation.Point(31,27),
              overlaySize:new Foundation.Point(31,27),
              adjacentIndices:[118],
              musters:{g:new Foundation.Point(201,121),m:new Foundation.Point(209,111),m_:new Foundation.Point(-7,-2),a:new Foundation.Point(198,113),a_:new Foundation.Point(-3,4),f:new Foundation.Point(188,110),f_:new Foundation.Point(-1,4),b:new Foundation.Point(204,100),b_:new Foundation.Point(0,-3)}
             },
             { //  18
              title:"Evenki Nat'l Okrug",
              abbreviation:"Eve",
              originalPowerIndex:0, // 0
              polygon:new Foundation.Polygon(502,100,508,98,503,91,504,63,572,63,572,118,554,118,541,114,505,117,502,100),
              hiliteOffset:new Foundation.Point(503,64),
              hiliteSize:new Foundation.Point(69,57),
              overlaySize:new Foundation.Point(69,57),
              adjacentIndices:[42,49,69],
              ipcValue:2,
              musters:{i:new Foundation.Point(529,101),g:new Foundation.Point(548,101),m:new Foundation.Point(562,77),m_:new Foundation.Point(-8,1),a:new Foundation.Point(515,69),a_:new Foundation.Point(14,0),f:new Foundation.Point(562,108),f_:new Foundation.Point(0,-7),b:new Foundation.Point(515,89),b_:new Foundation.Point(-1,10)}
             },
             { //  19
              title:"Finland/Norway",
              abbreviation:"Fin",
              originalPowerIndex:1, // 1
              polygon:new Foundation.Polygon(257,86,260,78,276,66,282,52,305,36,311,36,324,71,321,88,309,94,302,85,303,74,307,64,301,60,296,58,287,75,285,83,275,97,268,101,263,102,258,96,257,86),
              hiliteOffset:new Foundation.Point(258,35),
              hiliteSize:new Foundation.Point(66,67),
              overlaySize:new Foundation.Point(210,96),
              overlayOffset:new Foundation.Point(258,6),
              adjacentIndices:[30,56,70,118],
              ipcValue:2,
              musters:{i:new Foundation.Point(317,72),g:new Foundation.Point(315,84),m:new Foundation.Point(286,62),m_:new Foundation.Point(2,-5),a:new Foundation.Point(276,79),a_:new Foundation.Point(1,-6),f:new Foundation.Point(267,92),f_:new Foundation.Point(-2,-6),b:new Foundation.Point(305,51),b_:new Foundation.Point(-1,-5)}
             },
             { //  20
              title:"French Equatorial Africa",
              abbreviation:"FEq",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(219,383,234,367,234,353,246,353,246,285,258,285,270,304,278,311,282,309,307,321,307,340,315,347,317,361,305,375,267,384,262,378,254,374,219,383),
              hiliteOffset:new Foundation.Point(220,286),
              hiliteSize:new Foundation.Point(96,98),
              overlaySize:new Foundation.Point(96,98),
              adjacentIndices:[2,3,7,23,34,71],
              ipcValue:1,
              musters:{i:new Foundation.Point(269,362),g:new Foundation.Point(288,362),m:new Foundation.Point(253,311),m_:new Foundation.Point(1,-8),a:new Foundation.Point(257,340),a_:new Foundation.Point(2,-9),f:new Foundation.Point(303,353),f_:new Foundation.Point(-2,-10),b:new Foundation.Point(249,364),b_:new Foundation.Point(8,-7)}
             },
             { //  21
              title:"French Indo-China/Burma",
              abbreviation:"Bur",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(526,296,536,285,537,270,543,256,553,244,560,257,566,259,566,268,585,261,590,285,581,286,580,291,593,314,578,343,559,324,558,335,571,349,575,359,571,367,544,337,546,331,541,307,534,309,526,296),
              hiliteOffset:new Foundation.Point(527,245),
              hiliteSize:new Foundation.Point(66,122),
              overlaySize:new Foundation.Point(66,122),
              adjacentIndices:[12,27,33,51,84],
              ipcValue:3,
              musters:{i:new Foundation.Point(548,308),g:new Foundation.Point(568,307),m:new Foundation.Point(541,276),m_:new Foundation.Point(-2,11),a:new Foundation.Point(553,260),a_:new Foundation.Point(1,9),f:new Foundation.Point(578,275),f_:new Foundation.Point(0,12),b:new Foundation.Point(571,322),b_:new Foundation.Point(-8,-1)}
             },
             { //  22
              title:"French Madagascar",
              abbreviation:"Mad",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(375,512,379,489,404,466,406,468,409,469,399,517,403,528,389,538,383,532,384,528,382,518,375,512),
              hiliteOffset:new Foundation.Point(375,467),
              hiliteSize:new Foundation.Point(35,72),
              overlaySize:new Foundation.Point(35,72),
              adjacentIndices:[79,92,102,115],
              ipcValue:1,
              musters:{i:new Foundation.Point(383,515),g:new Foundation.Point(392,527),m:new Foundation.Point(404,474),m_:new Foundation.Point(-4,-1),a:new Foundation.Point(400,484),a_:new Foundation.Point(-4,-3),f:new Foundation.Point(385,488),f_:new Foundation.Point(5,3),b:new Foundation.Point(385,503),b_:new Foundation.Point(5,1)}
             },
             { //  23
              title:"French West Africa",
              abbreviation:"WAf",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(186,344,191,338,195,340,199,331,196,321,189,317,190,302,184,299,196,275,208,275,229,294,238,285,246,285,246,353,234,353,234,367,219,383,195,369,186,344),
              hiliteOffset:new Foundation.Point(183,276),
              hiliteSize:new Foundation.Point(63,107),
              overlaySize:new Foundation.Point(63,107),
              adjacentIndices:[2,20,48,85],
              ipcValue:1,
              musters:{i:new Foundation.Point(207,323),g:new Foundation.Point(226,322),m:new Foundation.Point(199,282),m_:new Foundation.Point(9,5),a:new Foundation.Point(238,328),a_:new Foundation.Point(0,9),f:new Foundation.Point(217,371),f_:new Foundation.Point(5,-8),b:new Foundation.Point(199,353),b_:new Foundation.Point(9,-8)}
             },
             { //  24
              title:"Germany",
              abbreviation:"Ger",
              originalPowerIndex:1, // 1
              isCapital:true,
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(257,158,258,147,273,132,282,129,284,133,294,128,300,126,313,130,316,147,312,159,312,174,278,186,277,176,262,173,261,160,257,158),
              hiliteOffset:new Foundation.Point(257,126),
              hiliteSize:new Foundation.Point(60,63),
              overlaySize:new Foundation.Point(145,183),
              overlayOffset:new Foundation.Point(172,6),
              adjacentIndices:[15,53,57,67,70],
              ipcValue:10,
              musters:{i:new Foundation.Point(264,152),g:new Foundation.Point(267,166),m:new Foundation.Point(307,169),m_:new Foundation.Point(-7,2),a:new Foundation.Point(305,159),a_:new Foundation.Point(-11,3),f:new Foundation.Point(308,147),f_:new Foundation.Point(-10,2),b:new Foundation.Point(301,135),b_:new Foundation.Point(-11,2)}
             },
             { //  25
              title:"Gibraltar",
              abbreviation:"Gib",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(205,237,213,226,222,234,214,246,205,237),
              hiliteOffset:new Foundation.Point(85,9),
              hiliteSize:new Foundation.Point(138,237),
              overlaySize:new Foundation.Point(138,237),
              detailRectangle:new Foundation.Rectangle(79,5,72,58),
              adjacentIndices:[55,123],
              musters:{g:new Foundation.Point(115,32),m:new Foundation.Point(117,20),m_:new Foundation.Point(5,-4),a:new Foundation.Point(96,34),a_:new Foundation.Point(5,-10),f:new Foundation.Point(131,31),f_:new Foundation.Point(4,-6),b:new Foundation.Point(103,45),b_:new Foundation.Point(12,1)}
             },
             { //  26
              title:"Hawaiian Islands",
              abbreviation:"Haw",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(788,292,798,288,818,298,825,312,816,317,788,292),
              hiliteOffset:new Foundation.Point(791,18),
              hiliteSize:new Foundation.Point(140,300),
              overlaySize:new Foundation.Point(140,300),
              detailRectangle:new Foundation.Rectangle(874,5,67,57),
              adjacentIndices:[87],
              ipcValue:1,
              musters:{i:new Foundation.Point(925,42),g:new Foundation.Point(914,30),m:new Foundation.Point(881,19),m_:new Foundation.Point(4,6),a:new Foundation.Point(899,33),a_:new Foundation.Point(7,4),f:new Foundation.Point(893,20),f_:new Foundation.Point(6,2),b:new Foundation.Point(911,18),b_:new Foundation.Point(7,5)}
             },
             { //  27
              title:"India",
              abbreviation:"Ind",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(443,276,451,270,461,269,459,254,462,245,466,248,477,242,481,228,488,226,494,227,494,240,500,250,521,265,537,270,536,285,526,296,519,301,503,317,501,340,492,354,473,326,473,311,467,299,468,292,460,295,455,283,443,276),
              hiliteOffset:new Foundation.Point(444,229),
              hiliteSize:new Foundation.Point(92,126),
              overlaySize:new Foundation.Point(141,327),
              overlayOffset:new Foundation.Point(444,28),
              adjacentIndices:[0,21,45,51,88],
              ipcValue:3,
              musters:{i:new Foundation.Point(482,299),g:new Foundation.Point(501,298),m:new Foundation.Point(466,282),m_:new Foundation.Point(1,-10),a:new Foundation.Point(508,273),a_:new Foundation.Point(3,8),f:new Foundation.Point(486,250),f_:new Foundation.Point(1,12),b:new Foundation.Point(489,318),b_:new Foundation.Point(1,8)}
             },
             { //  28
              title:"Italian East Africa",
              abbreviation:"EAf",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(360,348,370,329,369,320,388,344,387,350,396,352,416,346,420,349,408,376,386,399,369,375,371,359,366,355,360,348),
              hiliteOffset:new Foundation.Point(360,321),
              hiliteSize:new Foundation.Point(60,78),
              overlaySize:new Foundation.Point(60,78),
              adjacentIndices:[3,32,106],
              ipcValue:1,
              musters:{i:new Foundation.Point(383,387),g:new Foundation.Point(392,387),m:new Foundation.Point(373,336),m_:new Foundation.Point(7,8),a:new Foundation.Point(370,348),a_:new Foundation.Point(5,7),f:new Foundation.Point(379,375),f_:new Foundation.Point(6,-5),b:new Foundation.Point(409,356),b_:new Foundation.Point(-3,8)}
             },
             { //  29
              title:"Japan",
              abbreviation:"Jpn",
              originalPowerIndex:3, // 3
              isCapital:true,
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(643,238,648,229,661,219,670,218,680,202,683,204,687,195,685,180,687,170,692,167,694,155,698,154,703,160,720,163,720,167,707,178,703,175,697,179,705,192,702,219,707,224,710,230,710,239,705,246,696,250,688,249,682,243,679,235,658,244,657,255,651,253,650,246,643,238),
              hiliteOffset:new Foundation.Point(644,154),
              hiliteSize:new Foundation.Point(77,102),
              overlaySize:new Foundation.Point(77,102),
              adjacentIndices:[89],
              ipcValue:8,
              musters:{i:new Foundation.Point(667,220),g:new Foundation.Point(679,224),m:new Foundation.Point(651,240),m_:new Foundation.Point(5,-5),a:new Foundation.Point(693,205),a_:new Foundation.Point(1,8),f:new Foundation.Point(694,192),f_:new Foundation.Point(-1,-6),b:new Foundation.Point(700,170),b_:new Foundation.Point(-1,-4)}
             },
             { //  30
              title:"Karelia S.S.R.",
              abbreviation:"Len",
              originalPowerIndex:0, // 0
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(311,36,320,29,330,34,342,47,352,50,360,59,379,46,383,52,405,40,403,34,410,28,415,33,422,30,436,3,442,3,441,58,432,61,418,78,419,84,408,88,411,93,402,96,395,100,390,97,378,108,367,100,355,107,343,101,334,94,326,98,323,93,321,88,324,71,311,36),
              hiliteOffset:new Foundation.Point(312,4),
              hiliteSize:new Foundation.Point(129,104),
              overlaySize:new Foundation.Point(129,104),
              adjacentIndices:[11,15,19,49,60,70,90],
              ipcValue:3,
              musters:{i:new Foundation.Point(366,91),g:new Foundation.Point(386,91),m:new Foundation.Point(354,70),m_:new Foundation.Point(9,-4),a:new Foundation.Point(346,88),a_:new Foundation.Point(-6,-8),f:new Foundation.Point(402,78),f_:new Foundation.Point(-6,-9),b:new Foundation.Point(411,58),b_:new Foundation.Point(8,-10)}
             },
             { //  31
              title:"Kazakh S.S.R.",
              abbreviation:"Kaz",
              originalPowerIndex:0, // 0
              polygon:new Foundation.Polygon(414,187,414,182,422,181,430,181,436,170,450,166,464,170,471,184,476,182,496,202,489,220,471,218,455,219,447,222,425,217,421,191,414,187),
              hiliteOffset:new Foundation.Point(414,167),
              hiliteSize:new Foundation.Point(82,54),
              overlaySize:new Foundation.Point(171,215),
              overlayOffset:new Foundation.Point(414,6),
              adjacentIndices:[0,42,45,49,51,126],
              ipcValue:2,
              musters:{i:new Foundation.Point(445,204),g:new Foundation.Point(464,204),m:new Foundation.Point(479,197),m_:new Foundation.Point(-7,-5),a:new Foundation.Point(482,213),a_:new Foundation.Point(-8,0),f:new Foundation.Point(431,206),f_:new Foundation.Point(7,3),b:new Foundation.Point(431,190),b_:new Foundation.Point(7,-6)}
             },
             { //  32
              title:"Kenya/Rhodesia",
              abbreviation:"Ken",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(319,436,324,432,319,427,319,409,324,408,345,381,345,367,366,355,371,359,369,375,386,399,372,421,376,433,360,444,361,456,349,453,331,456,319,436),
              hiliteOffset:new Foundation.Point(319,356),
              hiliteSize:new Foundation.Point(66,110),
              overlaySize:new Foundation.Point(66,110),
              adjacentIndices:[3,4,7,28,36,61,92],
              ipcValue:1,
              musters:{i:new Foundation.Point(333,416),g:new Foundation.Point(346,416),m:new Foundation.Point(362,369),m_:new Foundation.Point(-5,3),a:new Foundation.Point(366,429),a_:new Foundation.Point(-10,2),f:new Foundation.Point(348,388),f_:new Foundation.Point(8,0),b:new Foundation.Point(366,406),b_:new Foundation.Point(-10,-2)}
             },
             { //  33
              title:"Kwangtung",
              abbreviation:"Kwa",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(585,261,591,244,597,242,601,234,606,232,603,223,598,222,592,216,596,196,616,203,615,210,623,214,620,223,627,247,619,273,601,285,590,285,585,261),
              hiliteOffset:new Foundation.Point(585,196),
              hiliteSize:new Foundation.Point(43,90),
              overlaySize:new Foundation.Point(43,90),
              adjacentIndices:[12,21,35,91],
              ipcValue:3,
              musters:{i:new Foundation.Point(599,261),g:new Foundation.Point(617,261),m:new Foundation.Point(590,261),m_:new Foundation.Point(1,9),a:new Foundation.Point(608,275),a_:new Foundation.Point(-3,-3),f:new Foundation.Point(614,229),f_:new Foundation.Point(-4,8),b:new Foundation.Point(605,206),b_:new Foundation.Point(3,6)}
             },
             { //  34
              title:"Libya",
              abbreviation:"Lib",
              originalPowerIndex:1, // 1
              polygon:new Foundation.Polygon(258,285,267,275,264,273,267,268,270,271,279,262,298,270,314,267,317,273,313,280,312,320,307,321,282,309,278,311,270,304,258,285),
              hiliteOffset:new Foundation.Point(260,263),
              hiliteSize:new Foundation.Point(57,58),
              overlaySize:new Foundation.Point(57,58),
              adjacentIndices:[2,3,20,75],
              ipcValue:1,
              musters:{i:new Foundation.Point(279,298),g:new Foundation.Point(298,294),m:new Foundation.Point(270,285),m_:new Foundation.Point(7,-2),a:new Foundation.Point(282,271),a_:new Foundation.Point(6,2),f:new Foundation.Point(305,285),f_:new Foundation.Point(1,-5),b:new Foundation.Point(300,307),b_:new Foundation.Point(3,4)}
             },
             { //  35
              title:"Manchuria",
              abbreviation:"Man",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(596,196,605,177,604,171,610,165,615,163,628,141,632,129,646,147,656,144,667,156,670,164,676,168,667,182,651,190,644,205,651,218,634,232,629,204,624,206,616,203,596,196),
              hiliteOffset:new Foundation.Point(596,129),
              hiliteSize:new Foundation.Point(81,104),
              overlaySize:new Foundation.Point(81,104),
              adjacentIndices:[12,33,39,54,69,89],
              ipcValue:3,
              musters:{i:new Foundation.Point(625,183),g:new Foundation.Point(644,183),m:new Foundation.Point(635,147),m_:new Foundation.Point(-4,7),a:new Foundation.Point(661,171),a_:new Foundation.Point(-6,-8),f:new Foundation.Point(610,189),f_:new Foundation.Point(4,-10),b:new Foundation.Point(635,199),b_:new Foundation.Point(2,8)}
             },
             { //  36
              title:"Mozambique",
              abbreviation:"Moz",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(348,487,350,465,361,456,360,444,376,433,381,435,380,457,371,469,370,480,363,482,358,499,348,487),
              hiliteOffset:new Foundation.Point(349,434),
              hiliteSize:new Foundation.Point(33,65),
              overlaySize:new Foundation.Point(33,65),
              adjacentIndices:[32,61,92],
              musters:{g:new Foundation.Point(357,467),m:new Foundation.Point(355,492),m_:new Foundation.Point(1,-9),a:new Foundation.Point(374,442),a_:new Foundation.Point(0,6),f:new Foundation.Point(367,465),f_:new Foundation.Point(-1,-7),b:new Foundation.Point(358,480),b_:new Foundation.Point(2,-4)}
             },
             { //  37
              title:"Mexico",
              abbreviation:"Mex",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(863,245,873,244,885,249,893,247,902,257,910,257,923,269,928,294,932,297,942,296,942,311,924,312,916,310,898,297,897,286,892,281,884,284,863,245),
              hiliteOffset:new Foundation.Point(865,244),
              hiliteSize:new Foundation.Point(77,69),
              overlaySize:new Foundation.Point(77,69),
              adjacentIndices:[44,68,86,93],
              ipcValue:2,
              musters:{i:new Foundation.Point(901,298),g:new Foundation.Point(920,298),m:new Foundation.Point(933,305),m_:new Foundation.Point(-5,-5),a:new Foundation.Point(906,262),a_:new Foundation.Point(4,5),f:new Foundation.Point(893,272),f_:new Foundation.Point(6,6),b:new Foundation.Point(882,259),b_:new Foundation.Point(-6,-4)}
             },
             { //  38
              title:"Midway Island",
              abbreviation:"Mid",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(782,220,784,213,793,215,786,222,782,220),
              hiliteOffset:new Foundation.Point(783,19),
              hiliteSize:new Foundation.Point(71,203),
              overlaySize:new Foundation.Point(71,203),
              detailRectangle:new Foundation.Rectangle(802,5,71,57),
              adjacentIndices:[94],
              musters:{i:new Foundation.Point(813,37),g:new Foundation.Point(820,27),m:new Foundation.Point(823,38),m_:new Foundation.Point(6,4),a:new Foundation.Point(850,33),a_:new Foundation.Point(-5,5),f:new Foundation.Point(833,30),f_:new Foundation.Point(-1,-5),b:new Foundation.Point(850,22),b_:new Foundation.Point(-1,-4)}
             },
             { //  39
              title:"Mongolia",
              abbreviation:"Mng",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(535,160,548,152,555,153,556,147,563,147,567,151,572,148,580,154,600,150,600,160,607,160,610,165,604,171,595,173,595,178,575,186,570,183,561,184,555,182,555,180,541,177,535,160),
              hiliteOffset:new Foundation.Point(536,148),
              hiliteSize:new Foundation.Point(73,37),
              overlaySize:new Foundation.Point(73,37),
              adjacentIndices:[12,35,42,51,69],
              musters:{g:new Foundation.Point(564,176),m:new Foundation.Point(544,161),m_:new Foundation.Point(0,6),a:new Foundation.Point(556,159),a_:new Foundation.Point(0,7),f:new Foundation.Point(571,158),f_:new Foundation.Point(0,8),b:new Foundation.Point(589,161),b_:new Foundation.Point(0,6)}
             },
             { //  40
              title:"New Guinea",
              abbreviation:"NGu",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(649,378,704,400,711,413,650,398,649,378),
              hiliteOffset:new Foundation.Point(649,380),
              hiliteSize:new Foundation.Point(208,154),
              overlaySize:new Foundation.Point(208,154),
              detailRectangle:new Foundation.Rectangle(785,491,78,58),
              adjacentIndices:[95],
              ipcValue:1,
              musters:{i:new Foundation.Point(803,512),g:new Foundation.Point(813,510),m:new Foundation.Point(823,509),m_:new Foundation.Point(7,0),a:new Foundation.Point(815,519),a_:new Foundation.Point(1,7),f:new Foundation.Point(848,530),f_:new Foundation.Point(0,-8),b:new Foundation.Point(833,522),b_:new Foundation.Point(0,8)}
             },
             { //  41
              title:"New Zealand",
              abbreviation:"NZe",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(722,542,740,522,748,494,741,473,758,489,773,492,774,499,758,514,744,547,722,542),
              hiliteOffset:new Foundation.Point(723,473),
              hiliteSize:new Foundation.Point(51,74),
              overlaySize:new Foundation.Point(51,74),
              adjacentIndices:[96],
              ipcValue:1,
              musters:{i:new Foundation.Point(750,484),g:new Foundation.Point(745,474),m:new Foundation.Point(762,492),m_:new Foundation.Point(7,0),a:new Foundation.Point(753,503),a_:new Foundation.Point(-2,-5),f:new Foundation.Point(749,518),f_:new Foundation.Point(7,-6),b:new Foundation.Point(731,539),b_:new Foundation.Point(7,-5)}
             },
             { //  42
              title:"Novosibirsk",
              abbreviation:"Nov",
              originalPowerIndex:0, // 0
              polygon:new Foundation.Polygon(464,170,481,148,484,131,505,117,541,114,554,118,572,118,572,148,567,151,563,147,556,147,555,153,548,152,535,160,496,202,476,182,471,184,464,170),
              hiliteOffset:new Foundation.Point(465,115),
              hiliteSize:new Foundation.Point(107,87),
              overlaySize:new Foundation.Point(107,87),
              adjacentIndices:[18,31,39,49,51,69],
              ipcValue:2,
              musters:{i:new Foundation.Point(512,149),g:new Foundation.Point(531,148),m:new Foundation.Point(554,132),m_:new Foundation.Point(-9,-2),a:new Foundation.Point(489,155),a_:new Foundation.Point(6,-9),f:new Foundation.Point(481,174),f_:new Foundation.Point(8,7),b:new Foundation.Point(505,170),b_:new Foundation.Point(8,-5)}
             },
             { //  43
              title:"Okinawa",
              abbreviation:"Oki",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(673,285,679,275,685,277,679,288,673,285),
              hiliteOffset:new Foundation.Point(674,13),
              hiliteSize:new Foundation.Point(36,275),
              overlaySize:new Foundation.Point(36,275),
              detailRectangle:new Foundation.Rectangle(659,5,70,57),
              adjacentIndices:[103],
              ipcValue:1,
              musters:{i:new Foundation.Point(678,47),g:new Foundation.Point(688,46),m:new Foundation.Point(677,36),m_:new Foundation.Point(4,-4),a:new Foundation.Point(690,38),a_:new Foundation.Point(5,-4),f:new Foundation.Point(688,23),f_:new Foundation.Point(4,-5),b:new Foundation.Point(706,23),b_:new Foundation.Point(4,-5)}
             },
             { //  44
              title:"Panama",
              abbreviation:"Pan",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(3,314,3,299,12,298,22,293,28,305,34,305,34,327,37,331,45,328,49,331,48,335,39,336,27,334,26,329,17,320,3,314),
              hiliteOffset:new Foundation.Point(4,293),
              hiliteSize:new Foundation.Point(45,45),
              overlaySize:new Foundation.Point(45,45),
              adjacentIndices:[37,63,104,125],
              ipcValue:1,
              musters:{i:new Foundation.Point(16,316),g:new Foundation.Point(33,316),m:new Foundation.Point(24,309),m_:new Foundation.Point(3,-1),a:new Foundation.Point(29,328),a_:new Foundation.Point(5,2),f:new Foundation.Point(10,306),f_:new Foundation.Point(-2,-2),b:new Foundation.Point(19,298),b_:new Foundation.Point(-4,-2)}
             },
             { //  45
              title:"Persia",
              abbreviation:"Per",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(387,248,389,233,394,228,395,221,399,210,408,210,415,224,419,224,425,217,447,222,444,234,440,235,439,241,462,245,459,254,461,269,451,270,443,276,436,265,431,268,419,248,416,250,416,256,393,270,387,248),
              hiliteOffset:new Foundation.Point(388,210),
              hiliteSize:new Foundation.Point(74,65),
              overlaySize:new Foundation.Point(161,257),
              overlayOffset:new Foundation.Point(388,18),
              adjacentIndices:[0,11,27,31,50,58,59,106,126],
              ipcValue:1,
              musters:{i:new Foundation.Point(406,244),g:new Foundation.Point(425,244),m:new Foundation.Point(436,227),m_:new Foundation.Point(-7,0),a:new Foundation.Point(444,264),a_:new Foundation.Point(-7,-5),f:new Foundation.Point(404,224),f_:new Foundation.Point(-4,9),b:new Foundation.Point(446,250),b_:new Foundation.Point(-8,-4)}
             },
             { //  46
              title:"Peru",
              abbreviation:"Bol",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(21,385,21,380,26,377,33,377,45,381,42,388,51,398,62,395,84,412,85,422,55,430,53,419,38,410,21,385),
              hiliteOffset:new Foundation.Point(21,377),
              hiliteSize:new Foundation.Point(65,54),
              overlaySize:new Foundation.Point(65,54),
              adjacentIndices:[5,9,63,121],
              musters:{g:new Foundation.Point(61,400),m:new Foundation.Point(59,420),m_:new Foundation.Point(-2,-5),a:new Foundation.Point(76,414),a_:new Foundation.Point(-3,4),f:new Foundation.Point(38,394),f_:new Foundation.Point(3,6),b:new Foundation.Point(29,385),b_:new Foundation.Point(4,-1)}
             },
             { //  47
              title:"Philippine Islands",
              abbreviation:"Phi",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(622,315,629,290,636,289,647,315,648,323,640,324,622,315),
              hiliteOffset:new Foundation.Point(622,9),
              hiliteSize:new Foundation.Point(28,316),
              overlaySize:new Foundation.Point(28,316),
              detailRectangle:new Foundation.Rectangle(587,5,71,57),
              adjacentIndices:[105],
              ipcValue:3,
              musters:{i:new Foundation.Point(626,36),g:new Foundation.Point(637,35),m:new Foundation.Point(635,52),m_:new Foundation.Point(-2,-5),a:new Foundation.Point(647,49),a_:new Foundation.Point(2,-7),f:new Foundation.Point(642,21),f_:new Foundation.Point(-3,-5),b:new Foundation.Point(624,21),b_:new Foundation.Point(-3,-4)}
             },
             { //  48
              title:"Rio De Oro",
              abbreviation:"Rio",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(178,308,184,299,190,302,189,317,196,321,199,331,195,340,191,338,186,344,182,337,186,331,178,308),
              hiliteOffset:new Foundation.Point(179,299),
              hiliteSize:new Foundation.Point(20,45),
              overlaySize:new Foundation.Point(20,45),
              adjacentIndices:[23,85],
              musters:{g:new Foundation.Point(182,307),m:new Foundation.Point(187,302),m_:new Foundation.Point(0,-3),a:new Foundation.Point(188,327),a_:new Foundation.Point(1,-3),f:new Foundation.Point(186,317),f_:new Foundation.Point(0,-3),b:new Foundation.Point(191,338),b_:new Foundation.Point(1,-3)}
             },
             { //  49
              title:"Russia",
              abbreviation:"Mos",
              originalPowerIndex:0, // 0
              isCapital:true,
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(399,167,401,158,414,153,414,140,411,131,415,120,411,103,402,96,411,93,408,88,419,84,418,78,432,61,441,58,441,63,504,63,503,91,508,98,502,100,505,117,484,131,481,148,464,170,450,166,436,170,430,181,422,181,420,170,406,174,403,168,399,167),
              hiliteOffset:new Foundation.Point(400,60),
              hiliteSize:new Foundation.Point(107,121),
              overlaySize:new Foundation.Point(107,121),
              adjacentIndices:[11,18,30,31,42,126],
              ipcValue:8,
              musters:{i:new Foundation.Point(439,131),g:new Foundation.Point(460,131),m:new Foundation.Point(423,101),m_:new Foundation.Point(3,-10),a:new Foundation.Point(467,74),a_:new Foundation.Point(2,8),f:new Foundation.Point(482,107),f_:new Foundation.Point(-6,14),b:new Foundation.Point(429,153),b_:new Foundation.Point(-2,-13)}
             },
             { //  50
              title:"Saudi Arabia",
              abbreviation:"SAr",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(377,292,386,282,389,284,392,280,388,274,393,270,416,256,422,263,424,275,428,278,434,275,434,280,440,289,440,295,430,317,423,325,419,333,397,344,393,327,381,313,377,292),
              hiliteOffset:new Foundation.Point(378,256),
              hiliteSize:new Foundation.Point(63,89),
              overlaySize:new Foundation.Point(63,89),
              adjacentIndices:[45,58,106],
              musters:{g:new Foundation.Point(410,309),m:new Foundation.Point(406,272),m_:new Foundation.Point(-4,7),a:new Foundation.Point(422,284),a_:new Foundation.Point(-7,6),f:new Foundation.Point(422,310),f_:new Foundation.Point(5,-8),b:new Foundation.Point(406,326),b_:new Foundation.Point(-5,-8)}
             },
             { //  51
              title:"Sinkiang",
              abbreviation:"Sin",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(488,226,489,220,496,202,535,160,541,177,555,180,555,182,561,184,557,202,550,218,553,244,543,256,537,270,521,265,500,250,494,240,494,227,488,226),
              hiliteOffset:new Foundation.Point(489,162),
              hiliteSize:new Foundation.Point(72,109),
              overlaySize:new Foundation.Point(72,109),
              adjacentIndices:[0,12,21,27,31,39,42],
              ipcValue:2,
              musters:{i:new Foundation.Point(515,234),g:new Foundation.Point(534,234),m:new Foundation.Point(506,210),m_:new Foundation.Point(4,-7),a:new Foundation.Point(544,210),a_:new Foundation.Point(3,-8),f:new Foundation.Point(530,257),f_:new Foundation.Point(-9,-5),b:new Foundation.Point(531,186),b_:new Foundation.Point(-3,11)}
             },
             { //  52
              title:"Solomon Islands",
              abbreviation:"Sol",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(721,399,725,395,761,414,756,421,721,399),
              hiliteOffset:new Foundation.Point(723,396),
              hiliteSize:new Foundation.Point(214,149),
              overlaySize:new Foundation.Point(214,149),
              detailRectangle:new Foundation.Rectangle(864,491,77,58),
              adjacentIndices:[107],
              musters:{g:new Foundation.Point(897,513),m:new Foundation.Point(875,506),m_:new Foundation.Point(8,0),a:new Foundation.Point(907,528),a_:new Foundation.Point(-8,-3),f:new Foundation.Point(920,540),f_:new Foundation.Point(-10,-1),b:new Foundation.Point(929,528),b_:new Foundation.Point(-8,-6)}
             },
             { //  53
              title:"Southern Europe",
              abbreviation:"SEu",
              originalPowerIndex:1, // 1
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(251,206,261,191,267,191,278,186,312,174,315,179,310,189,318,198,322,209,328,213,322,218,327,228,324,236,318,235,318,228,308,219,304,219,293,243,283,235,293,233,295,225,274,209,269,202,256,207,251,206),
              hiliteOffset:new Foundation.Point(251,175),
              hiliteSize:new Foundation.Point(78,68),
              overlaySize:new Foundation.Point(164,198),
              overlayOffset:new Foundation.Point(165,45),
              adjacentIndices:[15,24,57,67,75],
              ipcValue:6,
              musters:{i:new Foundation.Point(287,195),g:new Foundation.Point(304,195),m:new Foundation.Point(308,183),m_:new Foundation.Point(2,6),a:new Foundation.Point(320,224),a_:new Foundation.Point(-4,-4),f:new Foundation.Point(318,207),f_:new Foundation.Point(-9,-1),b:new Foundation.Point(268,199),b_:new Foundation.Point(8,6)}
             },
             { //  54
              title:"Soviet Far East",
              abbreviation:"Far",
              originalPowerIndex:0, // 0
              polygon:new Foundation.Polygon(632,129,632,63,746,63,749,66,749,87,727,103,724,114,728,126,726,140,719,150,707,124,706,116,709,111,702,102,701,112,695,114,681,106,664,122,675,128,682,144,680,164,676,168,670,164,667,156,656,144,646,147,632,129),
              hiliteOffset:new Foundation.Point(633,64),
              hiliteSize:new Foundation.Point(117,104),
              overlaySize:new Foundation.Point(117,104),
              adjacentIndices:[35,69,116],
              ipcValue:2,
              musters:{i:new Foundation.Point(673,91),g:new Foundation.Point(694,91),m:new Foundation.Point(643,73),m_:new Foundation.Point(8,0),a:new Foundation.Point(642,99),a_:new Foundation.Point(7,-6),f:new Foundation.Point(645,123),f_:new Foundation.Point(8,7),b:new Foundation.Point(714,100),b_:new Foundation.Point(7,-9)}
             },
             { //  55
              title:"Spain",
              abbreviation:"Spa",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(188,212,193,187,200,177,222,184,243,211,227,232,222,234,213,226,205,237,199,235,190,229,188,212),
              hiliteOffset:new Foundation.Point(188,178),
              hiliteSize:new Foundation.Point(55,60),
              overlaySize:new Foundation.Point(163,232),
              overlayOffset:new Foundation.Point(80,6),
              adjacentIndices:[25,67,117,123],
              musters:{g:new Foundation.Point(223,223),m:new Foundation.Point(223,196),m_:new Foundation.Point(5,5),a:new Foundation.Point(210,189),a_:new Foundation.Point(4,8),f:new Foundation.Point(198,197),f_:new Foundation.Point(-2,7),b:new Foundation.Point(202,224),b_:new Foundation.Point(4,-4)}
             },
             { //  56
              title:"Sweden",
              abbreviation:"Swe",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(275,97,285,83,287,75,296,58,301,60,299,68,292,86,296,90,293,96,292,105,288,112,282,115,279,106,275,103,275,97),
              hiliteOffset:new Foundation.Point(275,6),
              hiliteSize:new Foundation.Point(230,109),
              overlaySize:new Foundation.Point(230,109),
              adjacentIndices:[19,70],
              detailRectangle:new Foundation.Rectangle(443,5,71,57),
              musters:{g:new Foundation.Point(473,26),m:new Foundation.Point(496,27),m_:new Foundation.Point(-6,-1),a:new Foundation.Point(495,14),a_:new Foundation.Point(-10,0),f:new Foundation.Point(461,45),f_:new Foundation.Point(0,-10),b:new Foundation.Point(483,53),b_:new Foundation.Point(0,-7)}
             },
             { //  57
              title:"Switzerland",
              abbreviation:"Swz",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(255,185,255,177,262,173,277,176,278,186,267,191,261,191,255,185),
              hiliteOffset:new Foundation.Point(157,12),
              hiliteSize:new Foundation.Point(121,179),
              overlaySize:new Foundation.Point(121,179),
              adjacentIndices:[24,53,67],
              detailRectangle:new Foundation.Rectangle(152,5,73,58),
              musters:{g:new Foundation.Point(189,33),m:new Foundation.Point(173,20),m_:new Foundation.Point(9,1),a:new Foundation.Point(205,22),a_:new Foundation.Point(2,7),f:new Foundation.Point(171,45),f_:new Foundation.Point(-3,-8),b:new Foundation.Point(204,46),b_:new Foundation.Point(-7,0)}
             },
             { //  58
              title:"Syria/Iraq",
              abbreviation:"Syr",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(346,265,356,256,371,233,389,233,387,248,393,270,388,274,392,280,389,284,386,282,377,292,359,276,361,271,357,269,354,276,347,269,346,265),
              hiliteOffset:new Foundation.Point(347,232),
              hiliteSize:new Foundation.Point(46,61),
              overlaySize:new Foundation.Point(46,61),
              adjacentIndices:[3,45,50,59,81,106],
              ipcValue:1,
              musters:{i:new Foundation.Point(364,267),g:new Foundation.Point(381,265),m:new Foundation.Point(363,255),m_:new Foundation.Point(-4,5),a:new Foundation.Point(378,238),a_:new Foundation.Point(0,7),f:new Foundation.Point(385,278),f_:new Foundation.Point(1,-6),b:new Foundation.Point(369,280),b_:new Foundation.Point(6,4)}
             },
             { //  59
              title:"Turkey",
              abbreviation:"Tur",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(335,228,339,217,367,203,380,208,385,211,389,208,389,205,399,210,395,221,394,228,389,233,371,233,362,236,362,233,354,233,348,237,341,236,341,232,335,228),
              hiliteOffset:new Foundation.Point(335,203),
              hiliteSize:new Foundation.Point(64,35),
              overlaySize:new Foundation.Point(64,35),
              adjacentIndices:[11,45,58,81,101],
              musters:{g:new Foundation.Point(364,222),m:new Foundation.Point(389,212),m_:new Foundation.Point(-7,0),a:new Foundation.Point(355,214),a_:new Foundation.Point(7,-1),f:new Foundation.Point(343,225),f_:new Foundation.Point(7,0),b:new Foundation.Point(383,224),b_:new Foundation.Point(-7,1)}
             },
             { //  60
              title:"Ukraine S.S.R.",
              abbreviation:"Ukr",
              originalPowerIndex:1, // 1
              polygon:new Foundation.Polygon(343,176,343,101,355,107,367,100,378,108,377,146,374,148,376,156,383,166,380,172,366,179,374,182,363,191,358,179,353,180,350,176,343,176),
              hiliteOffset:new Foundation.Point(343,102),
              hiliteSize:new Foundation.Point(40,89),
              overlaySize:new Foundation.Point(40,89),
              adjacentIndices:[11,15,30,101],
              ipcValue:3,
              musters:{i:new Foundation.Point(374,167),g:new Foundation.Point(351,168),m:new Foundation.Point(350,136),m_:new Foundation.Point(0,10),a:new Foundation.Point(369,137),a_:new Foundation.Point(0,8),f:new Foundation.Point(370,126),f_:new Foundation.Point(0,-6),b:new Foundation.Point(354,115),b_:new Foundation.Point(0,6)}
             },
             { //  61
              title:"Union of South Africa",
              abbreviation:"SAf",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(287,486,307,469,322,465,331,456,349,453,350,465,348,487,358,499,359,507,323,544,317,546,303,514,294,506,287,486),
              hiliteOffset:new Foundation.Point(287,454),
              hiliteSize:new Foundation.Point(72,92),
              overlaySize:new Foundation.Point(72,92),
              adjacentIndices:[4,32,36,79,92,122],
              ipcValue:2,
              musters:{i:new Foundation.Point(311,503),g:new Foundation.Point(330,503),m:new Foundation.Point(335,467),m_:new Foundation.Point(-8,4),a:new Foundation.Point(345,507),a_:new Foundation.Point(-2,-8),f:new Foundation.Point(314,516),f_:new Foundation.Point(1,9),b:new Foundation.Point(332,520),b_:new Foundation.Point(-2,6)}
             },
             { //  62
              title:"United Kingdom",
              abbreviation:"GBr",
              originalPowerIndex:2, // 2
              isCapital:true,
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(200,142,214,119,220,120,223,113,216,94,223,82,244,77,239,87,242,91,236,106,243,107,250,112,254,122,250,132,242,136,235,149,200,142),
              hiliteOffset:new Foundation.Point(201,77),
              hiliteSize:new Foundation.Point(43,74),
              overlaySize:new Foundation.Point(43,74),
              adjacentIndices:[118],
              ipcValue:8,
              musters:{i:new Foundation.Point(206,140),g:new Foundation.Point(216,141),m:new Foundation.Point(228,141),m_:new Foundation.Point(6,-5),a:new Foundation.Point(216,131),a_:new Foundation.Point(6,-6),f:new Foundation.Point(226,104),f_:new Foundation.Point(9,5),b:new Foundation.Point(226,91),b_:new Foundation.Point(7,-4)}
             },
             { //  63
              title:"Venezuela/Colombia",
              abbreviation:"Col",
              originalPowerIndex:5, // 5
              polygon:new Foundation.Polygon(21,375,36,339,39,336,48,335,71,338,91,350,106,355,84,362,78,351,67,356,66,362,54,362,51,379,45,381,33,377,26,377,21,380,21,375),
              hiliteOffset:new Foundation.Point(21,335),
              hiliteSize:new Foundation.Point(85,46),
              overlaySize:new Foundation.Point(85,46),
              adjacentIndices:[9,44,46,104,125],
              musters:{g:new Foundation.Point(42,344),m:new Foundation.Point(72,345),m_:new Foundation.Point(4,0),a:new Foundation.Point(89,352),a_:new Foundation.Point(5,0),f:new Foundation.Point(59,353),f_:new Foundation.Point(0,-5),b:new Foundation.Point(39,369),b_:new Foundation.Point(-1,-4)}
             },
             { //  64
              title:"Wake Island",
              abbreviation:"Wak",
              originalPowerIndex:3, // 3
              polygon:new Foundation.Polygon(727,285,731,278,738,281,731,288,727,285),
              hiliteOffset:new Foundation.Point(728,17),
              hiliteSize:new Foundation.Point(51,271),
              overlaySize:new Foundation.Point(51,271),
              detailRectangle:new Foundation.Rectangle(730,5,71,57),
              adjacentIndices:[119],
              musters:{g:new Foundation.Point(770,14),m:new Foundation.Point(754,31),m_:new Foundation.Point(3,-5),a:new Foundation.Point(781,22),a_:new Foundation.Point(-8,4),f:new Foundation.Point(785,39),f_:new Foundation.Point(-6,-3),b:new Foundation.Point(767,41),b_:new Foundation.Point(-9,0)}
             },
             { //  65
              title:"West Indies",
              abbreviation:"Cub",
              originalPowerIndex:4, // 4
              polygon:new Foundation.Polygon(47,287,58,283,90,298,89,302,58,301,47,287),
              hiliteOffset:new Foundation.Point(10,21),
              hiliteSize:new Foundation.Point(81,282),
              overlaySize:new Foundation.Point(81,282),
              detailRectangle:new Foundation.Rectangle(5,5,73,58),
              adjacentIndices:[104],
              ipcValue:1,
              musters:{i:new Foundation.Point(21,43),g:new Foundation.Point(31,42),m:new Foundation.Point(14,24),m_:new Foundation.Point(7,-3),a:new Foundation.Point(29,33),a_:new Foundation.Point(8,-6),f:new Foundation.Point(65,44),f_:new Foundation.Point(-11,1),b:new Foundation.Point(49,34),b_:new Foundation.Point(7,-5)}
             },
             { //  66
              title:"Western Canada",
              abbreviation:"WCa",
              originalPowerIndex:2, // 2
              polygon:new Foundation.Polygon(813,122,813,63,942,63,942,176,852,176,846,175,837,168,834,157,835,151,831,148,830,137,821,123,813,122),
              hiliteOffset:new Foundation.Point(814,64),
              hiliteSize:new Foundation.Point(128,112),
              overlaySize:new Foundation.Point(128,112),
              adjacentIndices:[1,14,68,76,80,124],
              ipcValue:1,
              musters:{i:new Foundation.Point(869,123),g:new Foundation.Point(889,122),m:new Foundation.Point(841,90),m_:new Foundation.Point(-5,-7),a:new Foundation.Point(847,121),a_:new Foundation.Point(-6,-9),f:new Foundation.Point(858,153),f_:new Foundation.Point(12,-4),b:new Foundation.Point(915,146),b_:new Foundation.Point(0,-14)}
             },
             { //  67
              title:"Western Europe",
              abbreviation:"WEu",
              originalPowerIndex:1, // 1
              polygon:new Foundation.Polygon(218,155,226,156,266,128,265,119,269,115,273,114,273,132,258,147,257,158,261,160,262,173,255,177,255,185,261,191,251,206,246,205,243,211,222,184,226,172,225,164,218,161,218,155),
              hiliteOffset:new Foundation.Point(218,114),
              hiliteSize:new Foundation.Point(56,97),
              overlaySize:new Foundation.Point(121,205),
              overlayOffset:new Foundation.Point(153,6),
              adjacentIndices:[24,53,55,57,70,117,118,123],
              ipcValue:6,
              musters:{i:new Foundation.Point(234,181),g:new Foundation.Point(252,180),m:new Foundation.Point(226,162),m_:new Foundation.Point(7,4),a:new Foundation.Point(241,154),a_:new Foundation.Point(6,8),f:new Foundation.Point(251,146),f_:new Foundation.Point(6,-6),b:new Foundation.Point(244,199),b_:new Foundation.Point(-1,-6)}
             },
             { //  68
              title:"Western U.S.A.",
              abbreviation:"WUs",
              originalPowerIndex:4, // 4
              originalIndustrialComplex:true,
              polygon:new Foundation.Polygon(844,197,847,178,852,176,942,176,942,253,924,262,923,269,910,257,902,257,893,247,885,249,873,244,863,245,854,234,846,217,844,197),
              hiliteOffset:new Foundation.Point(844,177),
              hiliteSize:new Foundation.Point(98,92),
              overlaySize:new Foundation.Point(98,92),
              adjacentIndices:[16,37,66,86,124],
              ipcValue:10,
              musters:{i:new Foundation.Point(894,220),g:new Foundation.Point(916,219),m:new Foundation.Point(861,187),m_:new Foundation.Point(10,0),a:new Foundation.Point(861,217),a_:new Foundation.Point(11,-5),f:new Foundation.Point(886,234),f_:new Foundation.Point(-9,-1),b:new Foundation.Point(916,243),b_:new Foundation.Point(6,-7)}
             },
             { //  69
              title:"Yakut S.S.R.",
              abbreviation:"Yak",
              originalPowerIndex:0, // 0
              polygon:new Foundation.Polygon(572,148,572,118,572,63,632,63,632,129,628,141,615,163,610,165,607,160,600,160,600,150,580,154,572,148),
              hiliteOffset:new Foundation.Point(573,64),
              hiliteSize:new Foundation.Point(59,99),
              overlaySize:new Foundation.Point(59,99),
              adjacentIndices:[18,35,39,42,54],
              ipcValue:2,
              musters:{i:new Foundation.Point(589,106),g:new Foundation.Point(611,106),m:new Foundation.Point(580,91),m_:new Foundation.Point(4,-7),a:new Foundation.Point(623,93),a_:new Foundation.Point(-1,-7),f:new Foundation.Point(585,123),f_:new Foundation.Point(3,8),b:new Foundation.Point(612,122),b_:new Foundation.Point(-1,10)}
             },
             { //  70
              title:"Baltic Sea Zone",
              abbreviation:"BAL",
              straits:{toIndexes:[118],checkIndices:[56,67]},
              otherTitle:"Baltic Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(268,101,301,60,307,64,321,88,323,93,300,126,284,133,273,132,269,115,268,101),
              hiliteOffset:new Foundation.Point(268,61),
              hiliteSize:new Foundation.Point(53,71),
              adjacentIndices:[15,19,24,30,56,67,118],
              musters:{t:new Foundation.Point(301,100),t_:new Foundation.Point(2,-2),m:new Foundation.Point(300,89),m_:new Foundation.Point(2,-2),a:new Foundation.Point(301,89),a_:new Foundation.Point(2,-2),g:new Foundation.Point(301,89),g_:new Foundation.Point(2,-2),c:new Foundation.Point(287,123),c_:new Foundation.Point(3,-3),f:new Foundation.Point(295,115),f_:new Foundation.Point(3,-3),b:new Foundation.Point(302,71),s:new Foundation.Point(278,115),s_:new Foundation.Point(-2,-2),d:new Foundation.Point(273,105),d_:new Foundation.Point(2,-3)}
             },
             { //  71
              title:"Belgian Congo Sea Zone",
              abbreviation:"ASC",
              otherTitle:"Ascension Island",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(176,457,176,399,219,399,219,383,254,374,262,378,267,384,271,416,280,436,248,436,248,457,176,457),
              hiliteOffset:new Foundation.Point(177,375),
              hiliteSize:new Foundation.Point(103,82),
              adjacentIndices:[7,20,85,109,110,122],
              musters:{d:new Foundation.Point(232,451),d_:new Foundation.Point(-3,-6),c:new Foundation.Point(227,429),c_:new Foundation.Point(11,-5),t:new Foundation.Point(240,403),t_:new Foundation.Point(5,-5),s:new Foundation.Point(188,409),s_:new Foundation.Point(12,-3),m:new Foundation.Point(232,394),m_:new Foundation.Point(5,-5),a:new Foundation.Point(242,395),a_:new Foundation.Point(5,-5),g:new Foundation.Point(252,394),g_:new Foundation.Point(5,-5),f:new Foundation.Point(235,420),f_:new Foundation.Point(11,-5),b:new Foundation.Point(261,428)}
             },
             { //  72
              title:"Borneo/Celebes Sea Zone",
              abbreviation:"CEL",
              otherTitle:"Celebes Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(583,386,583,375,600,345,642,345,642,413,619,413,583,386),
              hiliteOffset:new Foundation.Point(584,346),
              hiliteSize:new Foundation.Point(58,67),
              adjacentIndices:[8,73,78,84,95,98,105],
              musters:{d:new Foundation.Point(632,357),d_:new Foundation.Point(-2,-3),c:new Foundation.Point(609,400),c_:new Foundation.Point(-2,-3),t:new Foundation.Point(633,409),t_:new Foundation.Point(0,-5),s:new Foundation.Point(595,381),s_:new Foundation.Point(-1,-3),m:new Foundation.Point(625,402),m_:new Foundation.Point(0,-5),a:new Foundation.Point(631,401),a_:new Foundation.Point(0,-5),g:new Foundation.Point(638,401),g_:new Foundation.Point(0,-5),f:new Foundation.Point(612,393),f_:new Foundation.Point(-2,-3),b:new Foundation.Point(639,377)}
             },
             { //  73
              title:"Caroline Islands Sea Zone",
              abbreviation:"MIC",
              otherTitle:"Micronesia",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(642,367,642,345,657,345,657,304,731,304,731,367,642,367),
              hiliteOffset:new Foundation.Point(643,305),
              hiliteSize:new Foundation.Point(88,62),
              adjacentIndices:[10,72,95,103,105,107,119],
              musters:{d:new Foundation.Point(670,321),d_:new Foundation.Point(0,-5),c:new Foundation.Point(662,362),c_:new Foundation.Point(0,-5),t:new Foundation.Point(695,361),t_:new Foundation.Point(11,0),s:new Foundation.Point(720,326),s_:new Foundation.Point(0,-5),m:new Foundation.Point(686,353),m_:new Foundation.Point(11,0),a:new Foundation.Point(696,353),a_:new Foundation.Point(11,0),g:new Foundation.Point(704,353),g_:new Foundation.Point(11,0),f:new Foundation.Point(669,353),f_:new Foundation.Point(0,-5),b:new Foundation.Point(695,313)}
             },
             { //  74
              title:"Central Indian Sea Zone",
              abbreviation:"EIO",
              otherTitle:"Eastern Indian Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(475,528,475,502,493,498,507,488,517,474,520,457,517,439,507,425,493,416,475,411,475,371,530,371,530,425,548,425,548,528,475,528),
              hiliteOffset:new Foundation.Point(476,372),
              hiliteSize:new Foundation.Point(72,156),
              adjacentIndices:[78,88,102,112,114,127],
              musters:{t:new Foundation.Point(492,521),t_:new Foundation.Point(18,0),m:new Foundation.Point(485,512),m_:new Foundation.Point(18,0),a:new Foundation.Point(493,513),a_:new Foundation.Point(18,0),g:new Foundation.Point(501,512),g_:new Foundation.Point(18,0),c:new Foundation.Point(497,410),c_:new Foundation.Point(7,-3),f:new Foundation.Point(506,402),f_:new Foundation.Point(7,-3),b:new Foundation.Point(531,436),s:new Foundation.Point(532,470),s_:new Foundation.Point(0,7),d:new Foundation.Point(506,385),d_:new Foundation.Point(-8,-4)}
             },
             { //  75
              title:"Central Mediterranean Sea Zone",
              abbreviation:"CMD",
              straits:{toIndexes:[101],checkIndices:[59]},
              otherTitle:"Central Mediterranean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(249,211,256,207,251,206,278,186,328,213,331,241,314,267,298,270,279,262,276,237,249,211),
              hiliteOffset:new Foundation.Point(251,195),
              hiliteSize:new Foundation.Point(80,75),
              adjacentIndices:[34,53,81,101,123],
              musters:{t:new Foundation.Point(311,259),t_:new Foundation.Point(0,-3),m:new Foundation.Point(305,251),m_:new Foundation.Point(0,-3),a:new Foundation.Point(313,252),a_:new Foundation.Point(0,-3),g:new Foundation.Point(319,250),g_:new Foundation.Point(0,-3),c:new Foundation.Point(292,260),c_:new Foundation.Point(-2,-5),f:new Foundation.Point(285,252),f_:new Foundation.Point(-2,-5),b:new Foundation.Point(279,228),s:new Foundation.Point(270,217),s_:new Foundation.Point(-1,-5),d:new Foundation.Point(308,235),d_:new Foundation.Point(-1,-4)}
             },
             { //  76
              title:"East Alaska Sea Zone",
              abbreviation:"GOA",
              otherTitle:"Gulf of Alaska",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(799,157,799,128,821,123,835,151,834,157,799,157),
              hiliteOffset:new Foundation.Point(800,129),
              hiliteSize:new Foundation.Point(34,28),
              adjacentIndices:[1,66,94,120,124],
              musters:{t:new Foundation.Point(825,155),t_:new Foundation.Point(0,-3),m:new Foundation.Point(819,148),m_:new Foundation.Point(0,-3),a:new Foundation.Point(825,148),a_:new Foundation.Point(0,-3),g:new Foundation.Point(834,148),g_:new Foundation.Point(0,-3),c:new Foundation.Point(805,154),c_:new Foundation.Point(0,-3),f:new Foundation.Point(808,150),f_:new Foundation.Point(0,-3),b:new Foundation.Point(814,145),s:new Foundation.Point(804,139),d:new Foundation.Point(808,131),d_:new Foundation.Point(-2,-2)}
             },
             { //  77
              title:"East Argentina/Chile Sea Zone",
              abbreviation:"GSJ",
              otherTitle:"Gulf of San Jorge",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(68,505,73,484,111,439,130,457,154,457,154,505,68,505),
              hiliteOffset:new Foundation.Point(69,440),
              hiliteSize:new Foundation.Point(85,65),
              adjacentIndices:[5,108,109,110],
              musters:{t:new Foundation.Point(83,500),t_:new Foundation.Point(13,0),m:new Foundation.Point(78,493),m_:new Foundation.Point(13,0),a:new Foundation.Point(86,493),a_:new Foundation.Point(13,0),g:new Foundation.Point(94,493),g_:new Foundation.Point(13,0),c:new Foundation.Point(96,481),c_:new Foundation.Point(9,0),f:new Foundation.Point(104,472),f_:new Foundation.Point(9,0),b:new Foundation.Point(141,465),s:new Foundation.Point(143,478),s_:new Foundation.Point(0,7),d:new Foundation.Point(118,459),d_:new Foundation.Point(-2,-4)}
             },
             { //  78
              title:"East Indies Sea Zone",
              abbreviation:"JAV",
              otherTitle:"Java Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(530,425,530,342,541,342,570,370,583,375,583,386,619,413,602,425,530,425),
              hiliteOffset:new Foundation.Point(531,343),
              hiliteSize:new Foundation.Point(88,82),
              adjacentIndices:[13,72,74,84,88,98,127],
              musters:{t:new Foundation.Point(538,405),t_:new Foundation.Point(0,-3),m:new Foundation.Point(532,398),m_:new Foundation.Point(0,-3),a:new Foundation.Point(538,398),a_:new Foundation.Point(0,-3),g:new Foundation.Point(537,391),g_:new Foundation.Point(0,-3),c:new Foundation.Point(543,421),c_:new Foundation.Point(0,-2),f:new Foundation.Point(548,417),f_:new Foundation.Point(0,-2),b:new Foundation.Point(589,422),s:new Foundation.Point(567,420),s_:new Foundation.Point(0,-2),d:new Foundation.Point(582,394),d_:new Foundation.Point(-3,-6)}
             },
             { //  79
              title:"East South Africa Sea Zone",
              abbreviation:"PEI",
              otherTitle:"Prince Edward Islands",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(316,550,317,546,359,507,370,528,384,528,389,538,389,550,316,550),
              hiliteOffset:new Foundation.Point(317,508),
              hiliteSize:new Foundation.Point(72,42),
              adjacentIndices:[22,61,92,115,122],
              musters:{t:new Foundation.Point(348,547),t_:new Foundation.Point(3,-3),m:new Foundation.Point(340,540),m_:new Foundation.Point(3,-3),a:new Foundation.Point(350,540),a_:new Foundation.Point(3,-3),g:new Foundation.Point(360,540),g_:new Foundation.Point(3,-3),c:new Foundation.Point(375,546),c_:new Foundation.Point(0,-3),f:new Foundation.Point(380,540),f_:new Foundation.Point(0,-3),b:new Foundation.Point(365,531),s:new Foundation.Point(356,520),s_:new Foundation.Point(3,-3),d:new Foundation.Point(329,546),d_:new Foundation.Point(3,-3)}
             },
             { //  80
              title:"Eastern Canada Sea Zone",
              abbreviation:"LAB",
              otherTitle:"Labrador Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(3,86,3,64,154,64,154,220,106,220,89,203,86,191,23,144,18,132,3,86),
              hiliteOffset:new Foundation.Point(4,65),
              hiliteSize:new Foundation.Point(150,155),
              adjacentIndices:[14,66,82,97,117,118],
              musters:{t:new Foundation.Point(42,141),t_:new Foundation.Point(10,-14),m:new Foundation.Point(35,132),m_:new Foundation.Point(10,-14),a:new Foundation.Point(43,133),a_:new Foundation.Point(10,-14),g:new Foundation.Point(53,132),g_:new Foundation.Point(10,-14),c:new Foundation.Point(118,109),c_:new Foundation.Point(6,9),f:new Foundation.Point(125,99),f_:new Foundation.Point(6,9),b:new Foundation.Point(108,75),s:new Foundation.Point(135,142),s_:new Foundation.Point(2,8),d:new Foundation.Point(85,87),d_:new Foundation.Point(3,10)}
             },
             { //  81
              title:"Eastern Mediterranean Sea Zone",
              abbreviation:"EMD",
              otherTitle:"Eastern Mediterranean",
              canal:{toIndex:106,checkIndices:[3,58]},
              straits:{toIndexes:[101],checkIndices:[59]},
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(314,267,331,241,341,236,354,233,371,233,356,256,346,265,347,269,342,266,314,267),
              hiliteOffset:new Foundation.Point(314,235),
              hiliteSize:new Foundation.Point(55,34),
              adjacentIndices:[3,58,59,75,101,106],
              musters:{t:new Foundation.Point(351,246),t_:new Foundation.Point(2,-2),m:new Foundation.Point(346,242),m_:new Foundation.Point(2,-2),a:new Foundation.Point(351,242),a_:new Foundation.Point(2,-2),g:new Foundation.Point(359,242),g_:new Foundation.Point(2,-2),c:new Foundation.Point(334,261),c_:new Foundation.Point(-3,-1),f:new Foundation.Point(341,258),f_:new Foundation.Point(-3,-1),b:new Foundation.Point(346,252),s:new Foundation.Point(334,252),s_:new Foundation.Point(4,0),d:new Foundation.Point(336,245),d_:new Foundation.Point(1,-3)}
             },
             { //  82
              title:"Eastern U.S.A. Sea Zone",
              abbreviation:"ECO",
              otherTitle:"East Coast of America",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(3,281,3,262,89,203,106,220,106,281,3,281),
              hiliteOffset:new Foundation.Point(4,205),
              hiliteSize:new Foundation.Point(102,76),
              adjacentIndices:[16,80,86,97,104],
              musters:{t:new Foundation.Point(14,277),t_:new Foundation.Point(9,0),m:new Foundation.Point(7,268),m_:new Foundation.Point(9,0),a:new Foundation.Point(15,268),a_:new Foundation.Point(9,0),g:new Foundation.Point(24,268),g_:new Foundation.Point(9,0),c:new Foundation.Point(67,276),c_:new Foundation.Point(-1,-6),f:new Foundation.Point(75,266),f_:new Foundation.Point(-1,-6),b:new Foundation.Point(90,223),s:new Foundation.Point(91,272),s_:new Foundation.Point(3,-5),d:new Foundation.Point(84,239),d_:new Foundation.Point(4,6)}
             },
             { //  83
              title:"Far South Atlantic Sea Zone",
              abbreviation:"SAO",
              otherTitle:"South Atlantic Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(154,550,154,514,248,514,248,550,154,550),
              hiliteOffset:new Foundation.Point(155,515),
              hiliteSize:new Foundation.Point(93,35),
              adjacentIndices:[108,109,122],
              musters:{t:new Foundation.Point(168,545),t_:new Foundation.Point(0,-5),m:new Foundation.Point(161,537),m_:new Foundation.Point(0,-5),a:new Foundation.Point(170,537),a_:new Foundation.Point(0,-5),g:new Foundation.Point(178,537),g_:new Foundation.Point(0,-5),c:new Foundation.Point(195,545),c_:new Foundation.Point(8,-3),f:new Foundation.Point(205,536),f_:new Foundation.Point(8,-3),b:new Foundation.Point(236,523),s:new Foundation.Point(226,543),s_:new Foundation.Point(6,-2),d:new Foundation.Point(189,520),d_:new Foundation.Point(13,0)}
             },
             { //  84
              title:"French Indo-China/Burma Sea Zone",
              abbreviation:"SCH",
              otherTitle:"South China Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(526,342,526,296,581,286,590,285,600,297,600,310,600,345,583,375,570,370,541,342,526,342),
              hiliteOffset:new Foundation.Point(527,288),
              hiliteSize:new Foundation.Point(73,87),
              adjacentIndices:[21,72,78,88,91,105],
              musters:{t:new Foundation.Point(588,355),t_:new Foundation.Point(-6,-2),m:new Foundation.Point(581,348),m_:new Foundation.Point(-6,-2),a:new Foundation.Point(586,348),a_:new Foundation.Point(-6,-2),g:new Foundation.Point(595,348),g_:new Foundation.Point(-6,-2),c:new Foundation.Point(589,337),c_:new Foundation.Point(1,-5),f:new Foundation.Point(594,330),f_:new Foundation.Point(1,-4),b:new Foundation.Point(594,305),s:new Foundation.Point(536,324),s_:new Foundation.Point(0,-5),d:new Foundation.Point(580,366),d_:new Foundation.Point(-3,-3)}
             },
             { //  85
              title:"French West Africa Sea Zone",
              abbreviation:"CAN",
              otherTitle:"Canary Islands",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(154,382,154,275,196,275,219,383,219,399,176,399,176,382,154,382),
              hiliteOffset:new Foundation.Point(155,276),
              hiliteSize:new Foundation.Point(64,123),
              adjacentIndices:[23,48,71,97,99,110,117],
              musters:{t:new Foundation.Point(199,395),t_:new Foundation.Point(-4,-4),m:new Foundation.Point(192,386),m_:new Foundation.Point(-4,-4),a:new Foundation.Point(199,387),a_:new Foundation.Point(-4,-4),g:new Foundation.Point(208,386),g_:new Foundation.Point(-4,-4),c:new Foundation.Point(169,374),c_:new Foundation.Point(2,-5),f:new Foundation.Point(175,364),f_:new Foundation.Point(2,-5),b:new Foundation.Point(165,314),s:new Foundation.Point(170,282),s_:new Foundation.Point(-2,8),d:new Foundation.Point(166,344),d_:new Foundation.Point(0,-7)}
             },
             { //  86
              title:"Gulf Of Mexico Sea Zone",
              abbreviation:"GOM",
              otherTitle:"Gulf of Mexico",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(923,269,924,262,942,253,942,296,932,297,928,294,923,269),
              hiliteOffset:new Foundation.Point(925,253),
              hiliteSize:new Foundation.Point(17,44),
              adjacentIndices:[37,68,82,104],
              musters:{t:new Foundation.Point(936,295),m:new Foundation.Point(930,289),a:new Foundation.Point(936,289),g:new Foundation.Point(940,289),c:new Foundation.Point(934,281),f:new Foundation.Point(939,279),b:new Foundation.Point(934,270),s:new Foundation.Point(933,276),d:new Foundation.Point(935,264)}
             },
             { //  87
              title:"Hawaiian Islands Sea Zone",
              abbreviation:"EPO",
              otherTitle:"Eastern Pacific Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(767,335,767,262,863,262,863,335,767,335),
              hiliteOffset:new Foundation.Point(768,263),
              hiliteSize:new Foundation.Point(95,72),
              adjacentIndices:[26,93,94,100,107,113,119,124],
              musters:{t:new Foundation.Point(827,299),t_:new Foundation.Point(10,0),m:new Foundation.Point(821,292),m_:new Foundation.Point(10,0),a:new Foundation.Point(830,292),a_:new Foundation.Point(10,0),g:new Foundation.Point(838,291),g_:new Foundation.Point(10,0),c:new Foundation.Point(846,327),c_:new Foundation.Point(-5,-4),f:new Foundation.Point(851,318),f_:new Foundation.Point(-5,-4),b:new Foundation.Point(809,277),s:new Foundation.Point(779,274),s_:new Foundation.Point(6,-3),d:new Foundation.Point(845,274),d_:new Foundation.Point(-7,-3)}
             },
             { //  88
              title:"India Sea Zone",
              abbreviation:"BEN",
              otherTitle:"Bay of Bengal",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(443,371,443,276,526,296,526,342,530,342,530,371,443,371),
              hiliteOffset:new Foundation.Point(444,277),
              hiliteSize:new Foundation.Point(86,94),
              adjacentIndices:[27,74,78,84,102,106],
              musters:{t:new Foundation.Point(460,360),t_:new Foundation.Point(0,-14),m:new Foundation.Point(450,352),m_:new Foundation.Point(0,-14),a:new Foundation.Point(461,352),a_:new Foundation.Point(0,-14),g:new Foundation.Point(471,352),g_:new Foundation.Point(0,-14),c:new Foundation.Point(513,365),c_:new Foundation.Point(0,-7),f:new Foundation.Point(518,356),f_:new Foundation.Point(0,-7),b:new Foundation.Point(486,363),s:new Foundation.Point(455,310),s_:new Foundation.Point(-1,-7),d:new Foundation.Point(514,330),d_:new Foundation.Point(1,-7)}
             },
             { //  89
              title:"Japan Sea Zone",
              abbreviation:"SJA",
              otherTitle:"Sea of Japan",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(616,203,676,168,680,170,688,151,707,151,707,157,730,157,730,262,651,262,644,255,632,239,625,211,616,203),
              hiliteOffset:new Foundation.Point(618,152),
              hiliteSize:new Foundation.Point(112,110),
              adjacentIndices:[29,35,91,100,103,105,116,119],
              musters:{t:new Foundation.Point(662,208),t_:new Foundation.Point(4,-5),m:new Foundation.Point(654,200),m_:new Foundation.Point(4,-5),a:new Foundation.Point(663,201),a_:new Foundation.Point(4,-5),g:new Foundation.Point(670,200),g_:new Foundation.Point(4,-5),c:new Foundation.Point(717,218),c_:new Foundation.Point(0,-7),f:new Foundation.Point(720,210),f_:new Foundation.Point(0,-7),b:new Foundation.Point(675,254),s:new Foundation.Point(717,185),s_:new Foundation.Point(1,-4),d:new Foundation.Point(717,254),d_:new Foundation.Point(0,-6)}
             },
             { //  90
              title:"Karelia S.S.R. Sea Zone",
              abbreviation:"BAR",
              otherTitle:"Barents Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(311,36,311,3,436,3,367,100,311,36),
              hiliteOffset:new Foundation.Point(312,4),
              hiliteSize:new Foundation.Point(125,62),
              adjacentIndices:[30,118],
              musters:{t:new Foundation.Point(350,43),t_:new Foundation.Point(0,-8),m:new Foundation.Point(342,33),m_:new Foundation.Point(0,-8),a:new Foundation.Point(351,34),a_:new Foundation.Point(0,-8),g:new Foundation.Point(359,34),g_:new Foundation.Point(0,-8),c:new Foundation.Point(382,39),c_:new Foundation.Point(1,-7),f:new Foundation.Point(390,30),f_:new Foundation.Point(1,-7),b:new Foundation.Point(413,14),s:new Foundation.Point(324,9),s_:new Foundation.Point(-1,7),d:new Foundation.Point(367,9),d_:new Foundation.Point(-11,0)}
             },
             { //  91
              title:"Kwangtung Sea Zone",
              abbreviation:"ECH",
              otherTitle:"East China Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(590,285,616,203,625,211,632,239,644,255,629,280,600,310,600,297,590,285),
              hiliteOffset:new Foundation.Point(591,205),
              hiliteSize:new Foundation.Point(53,105),
              adjacentIndices:[33,84,89,105],
              musters:{t:new Foundation.Point(634,262),t_:new Foundation.Point(0,-3),m:new Foundation.Point(631,256),m_:new Foundation.Point(0,-3),a:new Foundation.Point(636,256),a_:new Foundation.Point(0,-3),g:new Foundation.Point(641,255),g_:new Foundation.Point(0,-3),c:new Foundation.Point(606,296),c_:new Foundation.Point(3,-3),f:new Foundation.Point(610,290),f_:new Foundation.Point(3,-3),b:new Foundation.Point(627,272),s:new Foundation.Point(622,282),s_:new Foundation.Point(2,-3),d:new Foundation.Point(631,240),d_:new Foundation.Point(-2,-4)}
             },
             { //  92
              title:"Mozambique Sea Zone",
              abbreviation:"MCH",
              otherTitle:"Mozambique Channel",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(359,507,358,499,372,421,386,399,411,399,411,464,406,468,384,528,370,528,359,507),
              hiliteOffset:new Foundation.Point(360,400),
              hiliteSize:new Foundation.Point(51,128),
              adjacentIndices:[22,32,36,61,79,102,106],
              musters:{t:new Foundation.Point(395,443),t_:new Foundation.Point(0,-3),m:new Foundation.Point(387,436),m_:new Foundation.Point(0,-3),a:new Foundation.Point(395,436),a_:new Foundation.Point(0,-3),g:new Foundation.Point(404,436),g_:new Foundation.Point(0,-3),c:new Foundation.Point(390,421),c_:new Foundation.Point(3,-3),f:new Foundation.Point(398,413),f_:new Foundation.Point(3,-3),b:new Foundation.Point(404,454),s:new Foundation.Point(371,493),s_:new Foundation.Point(3,-6),d:new Foundation.Point(390,463),d_:new Foundation.Point(0,-4)}
             },
             { //  93
              title:"Mexico Sea Zone",
              abbreviation:"GOC",
              otherTitle:"Gulf of California",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(863,379,863,245,885,249,942,311,942,379,863,379),
              hiliteOffset:new Foundation.Point(864,247),
              hiliteSize:new Foundation.Point(78,132),
              adjacentIndices:[37,87,111,113,124,125],
              musters:{t:new Foundation.Point(876,313),t_:new Foundation.Point(0,-8),m:new Foundation.Point(869,306),m_:new Foundation.Point(0,-8),a:new Foundation.Point(877,306),a_:new Foundation.Point(0,-8),g:new Foundation.Point(886,306),g_:new Foundation.Point(0,-8),c:new Foundation.Point(899,344),c_:new Foundation.Point(0,-10),f:new Foundation.Point(906,336),f_:new Foundation.Point(0,-10),b:new Foundation.Point(903,363),s:new Foundation.Point(876,370),s_:new Foundation.Point(0,-7),d:new Foundation.Point(927,361),d_:new Foundation.Point(1,-10)}
             },
             { //  94
              title:"Midway Island Sea Zone",
              abbreviation:"TOC",
              otherTitle:"Tropic of Cancer (Midway Islands)",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(774,262,774,157,815,157,815,262,774,262),
              hiliteOffset:new Foundation.Point(775,158),
              hiliteSize:new Foundation.Point(40,104),
              adjacentIndices:[38,76,87,100,120,124],
              musters:{t:new Foundation.Point(804,218),t_:new Foundation.Point(0,-5),m:new Foundation.Point(795,209),m_:new Foundation.Point(0,-5),a:new Foundation.Point(802,210),a_:new Foundation.Point(0,-5),g:new Foundation.Point(810,209),g_:new Foundation.Point(0,-5),c:new Foundation.Point(796,256),c_:new Foundation.Point(-3,-5),f:new Foundation.Point(805,247),f_:new Foundation.Point(-3,-5),b:new Foundation.Point(803,178),s:new Foundation.Point(786,166),s_:new Foundation.Point(7,-2),d:new Foundation.Point(786,188),d_:new Foundation.Point(0,-5)}
             },
             { //  95
              title:"New Guinea Sea Zone",
              abbreviation:"MEL",
              otherTitle:"Melanesia",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(642,413,642,367,715,367,715,422,654,422,654,413,642,413),
              hiliteOffset:new Foundation.Point(643,368),
              hiliteSize:new Foundation.Point(72,54),
              adjacentIndices:[40,72,73,98,107],
              musters:{t:new Foundation.Point(663,421),t_:new Foundation.Point(-2,-5),m:new Foundation.Point(655,415),m_:new Foundation.Point(-2,-5),a:new Foundation.Point(662,415),a_:new Foundation.Point(-2,-5),g:new Foundation.Point(673,415),g_:new Foundation.Point(-2,-5),c:new Foundation.Point(701,388),c_:new Foundation.Point(0,-3),f:new Foundation.Point(707,380),f_:new Foundation.Point(0,-3),b:new Foundation.Point(684,373),s:new Foundation.Point(700,417),s_:new Foundation.Point(-5,-2),d:new Foundation.Point(667,377),d_:new Foundation.Point(-7,-3)}
             },
             { //  96
              title:"New Zealand Sea Zone",
              abbreviation:"TAS",
              otherTitle:"Tasman Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(715,550,715,434,783,432,783,550,715,550),
              hiliteOffset:new Foundation.Point(716,435),
              hiliteSize:new Foundation.Point(67,115),
              adjacentIndices:[41,98,107,108,113,114,121],
              musters:{t:new Foundation.Point(730,509),t_:new Foundation.Point(0,-9),m:new Foundation.Point(721,500),m_:new Foundation.Point(0,-9),a:new Foundation.Point(730,501),a_:new Foundation.Point(0,-9),g:new Foundation.Point(737,500),g_:new Foundation.Point(0,-9),c:new Foundation.Point(768,543),c_:new Foundation.Point(0,-9),f:new Foundation.Point(774,534),f_:new Foundation.Point(0,-8),b:new Foundation.Point(772,475),s:new Foundation.Point(732,453),s_:new Foundation.Point(3,-4),d:new Foundation.Point(763,452),d_:new Foundation.Point(0,-5)}
             },
             { //  97
              title:"North Atlantic Sea Zone",
              abbreviation:"NAO",
              otherTitle:"North Atlantic",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(106,316,106,220,154,220,154,316,106,316),
              hiliteOffset:new Foundation.Point(107,221),
              hiliteSize:new Foundation.Point(47,95),
              adjacentIndices:[80,82,85,99,104,117],
              musters:{t:new Foundation.Point(122,261),t_:new Foundation.Point(10,0),m:new Foundation.Point(114,253),m_:new Foundation.Point(10,0),a:new Foundation.Point(121,253),a_:new Foundation.Point(10,0),g:new Foundation.Point(132,253),g_:new Foundation.Point(10,0),c:new Foundation.Point(123,236),c_:new Foundation.Point(9,0),f:new Foundation.Point(130,228),f_:new Foundation.Point(9,0),b:new Foundation.Point(121,306),s:new Foundation.Point(120,275),s_:new Foundation.Point(12,-3),d:new Foundation.Point(139,291),d_:new Foundation.Point(-10,-3)}
             },
             { //  98
              title:"Northeast Australia Sea Zone",
              abbreviation:"COR",
              otherTitle:"Coral Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(602,433,602,425,619,413,642,413,654,413,654,422,715,422,715,528,695,528,634,510,602,433),
              hiliteOffset:new Foundation.Point(603,414),
              hiliteSize:new Foundation.Point(112,114),
              adjacentIndices:[6,72,78,95,96,107,114,127],
              musters:{t:new Foundation.Point(655,438),t_:new Foundation.Point(0,-2),m:new Foundation.Point(651,431),m_:new Foundation.Point(0,-2),a:new Foundation.Point(657,431),a_:new Foundation.Point(0,-2),g:new Foundation.Point(662,431),g_:new Foundation.Point(0,-2),c:new Foundation.Point(701,451),c_:new Foundation.Point(0,-6),f:new Foundation.Point(707,442),f_:new Foundation.Point(0,-6),b:new Foundation.Point(711,472),s:new Foundation.Point(688,430),s_:new Foundation.Point(-2,-2),d:new Foundation.Point(707,521),d_:new Foundation.Point(1,-6)}
             },
             { //  99
              title:"North Brazil Sea Zone",
              abbreviation:"FDN",
              otherTitle:"Fernando de Noronha Archipelago",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(106,355,106,316,154,316,154,382,146,382,130,374,112,365,106,355),
              hiliteOffset:new Foundation.Point(107,317),
              hiliteSize:new Foundation.Point(47,65),
              adjacentIndices:[9,85,97,104,110],
              musters:{t:new Foundation.Point(127,366),t_:new Foundation.Point(-4,-5),m:new Foundation.Point(117,359),m_:new Foundation.Point(-2,-4),a:new Foundation.Point(127,359),a_:new Foundation.Point(-2,-4),g:new Foundation.Point(138,359),g_:new Foundation.Point(-3,-5),c:new Foundation.Point(121,345),c_:new Foundation.Point(10,0),f:new Foundation.Point(128,337),f_:new Foundation.Point(10,0),b:new Foundation.Point(139,324),s:new Foundation.Point(117,327),s_:new Foundation.Point(0,-4),d:new Foundation.Point(143,370),d_:new Foundation.Point(1,-5)}
             },
             { // 100
              title:"North Pacific Sea Zone",
              abbreviation:"NPO",
              otherTitle:"North Pacific Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(730,262,730,157,774,157,774,262,730,262),
              hiliteOffset:new Foundation.Point(731,158),
              hiliteSize:new Foundation.Point(43,104),
              adjacentIndices:[87,89,94,116,119,120],
              musters:{t:new Foundation.Point(745,229),t_:new Foundation.Point(5,-6),m:new Foundation.Point(736,220),m_:new Foundation.Point(5,-6),a:new Foundation.Point(745,221),a_:new Foundation.Point(5,-6),g:new Foundation.Point(756,220),g_:new Foundation.Point(5,-6),c:new Foundation.Point(749,198),c_:new Foundation.Point(4,-8),f:new Foundation.Point(755,190),f_:new Foundation.Point(4,-8),b:new Foundation.Point(742,254),s:new Foundation.Point(742,170),s_:new Foundation.Point(2,-4),d:new Foundation.Point(762,244),d_:new Foundation.Point(-9,-3)}
             },
             { // 101
              title:"Northern Mediterranean Sea Zone",
              abbreviation:"BLA",
              straits:{toIndexes:[75,81],checkIndices:[59]},
              otherTitle:"Black Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(328,213,353,180,380,172,389,205,389,208,385,211,341,236,331,241,328,213),
              hiliteOffset:new Foundation.Point(330,174),
              hiliteSize:new Foundation.Point(58,67),
              adjacentIndices:[11,15,59,60,75,81],
              musters:{t:new Foundation.Point(375,201),t_:new Foundation.Point(0,-2),m:new Foundation.Point(366,194),m_:new Foundation.Point(0,-2),a:new Foundation.Point(373,194),a_:new Foundation.Point(0,-2),g:new Foundation.Point(380,194),g_:new Foundation.Point(0,-2),c:new Foundation.Point(350,205),c_:new Foundation.Point(0,-2),f:new Foundation.Point(357,199),f_:new Foundation.Point(0,-2),b:new Foundation.Point(351,195),s:new Foundation.Point(339,215),s_:new Foundation.Point(2,-2),d:new Foundation.Point(353,187),d_:new Foundation.Point(2,-3)}
             },
             { // 102
              title:"Northeast Madagascar Sea Zone",
              abbreviation:"WIO",
              otherTitle:"Western Indian Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(403,528,399,517,406,468,411,464,411,399,443,399,443,371,475,371,475,411,459,415,442,425,435,439,431,457,435,474,445,488,459,498,475,502,475,528,403,528),
              hiliteOffset:new Foundation.Point(400,372),
              hiliteSize:new Foundation.Point(75,156),
              adjacentIndices:[22,74,88,92,106,112,115],
              musters:{t:new Foundation.Point(423,499),t_:new Foundation.Point(0,-10),m:new Foundation.Point(416,491),m_:new Foundation.Point(0,-10),a:new Foundation.Point(424,492),a_:new Foundation.Point(0,-10),g:new Foundation.Point(433,492),g_:new Foundation.Point(0,-10),c:new Foundation.Point(455,404),c_:new Foundation.Point(2,-7),f:new Foundation.Point(463,395),f_:new Foundation.Point(2,-7),b:new Foundation.Point(423,436),s:new Foundation.Point(463,515),s_:new Foundation.Point(-6,-8),d:new Foundation.Point(434,417),d_:new Foundation.Point(-5,-5)}
             },
             { // 103
              title:"Okinawa Sea Zone",
              abbreviation:"RYU",
              otherTitle:"Ryuku Islands",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(657,304,657,262,710,262,710,304,657,304),
              hiliteOffset:new Foundation.Point(658,263),
              hiliteSize:new Foundation.Point(52,41),
              adjacentIndices:[43,73,89,105,119],
              musters:{t:new Foundation.Point(696,300),t_:new Foundation.Point(0,-4),m:new Foundation.Point(689,293),m_:new Foundation.Point(0,-4),a:new Foundation.Point(696,293),a_:new Foundation.Point(0,-4),g:new Foundation.Point(706,293),g_:new Foundation.Point(0,-4),c:new Foundation.Point(668,298),c_:new Foundation.Point(0,-4),f:new Foundation.Point(663,290),f_:new Foundation.Point(0,-4),b:new Foundation.Point(703,268),s:new Foundation.Point(665,270),s_:new Foundation.Point(3,-2),d:new Foundation.Point(692,277),d_:new Foundation.Point(-3,-5)}
             },
             { // 104
              title:"Eastern Panama Sea Zone",
              abbreviation:"CAR",
              otherTitle:"Caribbean Sea",
              canal:{toIndex:125,checkIndices:[44]},
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(3,299,3,281,106,281,106,355,48,335,37,331,3,299),
              hiliteOffset:new Foundation.Point(4,282),
              hiliteSize:new Foundation.Point(102,73),
              adjacentIndices:[44,63,65,82,86,97,99,125],
              musters:{t:new Foundation.Point(93,340),t_:new Foundation.Point(0,-6),m:new Foundation.Point(83,332),m_:new Foundation.Point(0,-6),a:new Foundation.Point(91,332),a_:new Foundation.Point(0,-6),g:new Foundation.Point(99,331),g_:new Foundation.Point(0,-6),c:new Foundation.Point(64,330),c_:new Foundation.Point(0,-5),f:new Foundation.Point(71,321),f_:new Foundation.Point(0,-5),b:new Foundation.Point(95,290),s:new Foundation.Point(40,298),s_:new Foundation.Point(-1,-5),d:new Foundation.Point(48,318),d_:new Foundation.Point(0,-6)}
             },
             { // 105
              title:"Philippine Islands Sea Zone",
              abbreviation:"SUL",
              otherTitle:"Sulu Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(600,345,600,310,629,280,644,255,651,262,657,262,657,304,657,345,600,345),
              hiliteOffset:new Foundation.Point(601,255),
              hiliteSize:new Foundation.Point(56,90),
              adjacentIndices:[47,72,73,84,89,91,103],
              musters:{t:new Foundation.Point(645,342),t_:new Foundation.Point(-13,0),m:new Foundation.Point(636,335),m_:new Foundation.Point(-13,0),a:new Foundation.Point(644,335),a_:new Foundation.Point(-13,0),g:new Foundation.Point(652,333),g_:new Foundation.Point(-13,0),c:new Foundation.Point(643,285),c_:new Foundation.Point(0,-4),f:new Foundation.Point(649,276),f_:new Foundation.Point(0,-4),b:new Foundation.Point(649,302),s:new Foundation.Point(610,320),s_:new Foundation.Point(4,-2),d:new Foundation.Point(616,307),d_:new Foundation.Point(3,-4)}
             },
             { // 106
              title:"Saudi Arabia Sea Zone",
              abbreviation:"RED",
              otherTitle:"Red Sea",
              canal:{toIndex:81,checkIndices:[3,58]},
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(386,399,347,269,419,248,436,265,443,276,443,399,386,399),
              hiliteOffset:new Foundation.Point(348,249),
              hiliteSize:new Foundation.Point(95,150),
              adjacentIndices:[3,28,45,50,58,81,88,92,102],
              musters:{t:new Foundation.Point(430,348),t_:new Foundation.Point(0,-7),m:new Foundation.Point(425,341),m_:new Foundation.Point(0,-7),a:new Foundation.Point(430,341),a_:new Foundation.Point(0,-7),g:new Foundation.Point(438,341),g_:new Foundation.Point(0,-7),c:new Foundation.Point(426,394),c_:new Foundation.Point(0,-5),f:new Foundation.Point(433,385),f_:new Foundation.Point(0,-5),b:new Foundation.Point(407,393),s:new Foundation.Point(368,297),s_:new Foundation.Point(4,7),d:new Foundation.Point(427,364),d_:new Foundation.Point(2,-4)}
             },
             { // 107
              title:"Solomon Islands Sea Zone",
              abbreviation:"SOS",
              otherTitle:"Solomon Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(715,434,715,367,731,367,731,335,779,335,779,434,715,434),
              hiliteOffset:new Foundation.Point(716,336),
              hiliteSize:new Foundation.Point(63,98),
              adjacentIndices:[52,73,87,95,96,98,113,119],
              musters:{t:new Foundation.Point(745,377),t_:new Foundation.Point(6,-4),m:new Foundation.Point(737,369),m_:new Foundation.Point(6,-4),a:new Foundation.Point(746,369),a_:new Foundation.Point(6,-4),g:new Foundation.Point(755,369),g_:new Foundation.Point(6,-4),c:new Foundation.Point(766,400),c_:new Foundation.Point(0,-6),f:new Foundation.Point(771,391),f_:new Foundation.Point(0,-6),b:new Foundation.Point(769,426),s:new Foundation.Point(747,348),s_:new Foundation.Point(5,-3),d:new Foundation.Point(733,424),d_:new Foundation.Point(-3,-6)}
             },
             { // 108
              title:"South Argentina/Chile Sea Zone",
              abbreviation:"SCO",
              otherTitle:"Scotia Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(3,550,3,505,154,505,154,550,3,550),
              hiliteOffset:new Foundation.Point(4,506),
              hiliteSize:new Foundation.Point(150,44),
              adjacentIndices:[5,77,83,96,109,121],
              musters:{t:new Foundation.Point(83,529),t_:new Foundation.Point(13,-5),m:new Foundation.Point(80,522),m_:new Foundation.Point(13,-5),a:new Foundation.Point(86,522),a_:new Foundation.Point(13,-5),g:new Foundation.Point(94,522),g_:new Foundation.Point(13,-5),c:new Foundation.Point(118,539),c_:new Foundation.Point(8,-6),f:new Foundation.Point(127,530),f_:new Foundation.Point(8,-6),b:new Foundation.Point(66,542),s:new Foundation.Point(20,516),s_:new Foundation.Point(-3,7),d:new Foundation.Point(45,525),d_:new Foundation.Point(-7,8)}
             },
             { // 109
              title:"South Atlantic Sea Zone",
              abbreviation:"TDC",
              otherTitle:"Tristan da Cunha Island",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(154,514,154,457,248,457,248,514,154,514),
              hiliteOffset:new Foundation.Point(155,458),
              hiliteSize:new Foundation.Point(93,56),
              adjacentIndices:[71,77,83,108,110,122],
              musters:{t:new Foundation.Point(167,510),t_:new Foundation.Point(0,-11),m:new Foundation.Point(159,502),m_:new Foundation.Point(0,-11),a:new Foundation.Point(166,502),a_:new Foundation.Point(0,-11),g:new Foundation.Point(177,502),g_:new Foundation.Point(0,-11),c:new Foundation.Point(232,509),c_:new Foundation.Point(0,-11),f:new Foundation.Point(239,500),f_:new Foundation.Point(0,-11),b:new Foundation.Point(223,466),s:new Foundation.Point(164,462),s_:new Foundation.Point(19,0),d:new Foundation.Point(200,505),d_:new Foundation.Point(0,-11)}
             },
             { // 110
              title:"South Brazil Sea Zone",
              abbreviation:"RDJ",
              otherTitle:"Rio de Janeiro",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(111,439,146,382,176,382,176,457,130,457,111,439),
              hiliteOffset:new Foundation.Point(113,383),
              hiliteSize:new Foundation.Point(63,74),
              adjacentIndices:[9,71,77,85,99,109],
              musters:{t:new Foundation.Point(154,417),t_:new Foundation.Point(-1,-5),m:new Foundation.Point(146,409),m_:new Foundation.Point(0,-4),a:new Foundation.Point(156,409),a_:new Foundation.Point(0,-4),g:new Foundation.Point(165,409),g_:new Foundation.Point(0,-4),c:new Foundation.Point(157,451),c_:new Foundation.Point(2,-5),f:new Foundation.Point(165,442),f_:new Foundation.Point(2,-5),b:new Foundation.Point(142,431),b_:new Foundation.Point(6,-2),s:new Foundation.Point(132,445),s_:new Foundation.Point(-3,-3),d:new Foundation.Point(165,393),d_:new Foundation.Point(-2,-5)}
             },
             { // 111
              title:"South East Pacific Sea Zone",
              abbreviation:"SPO",
              otherTitle:"South Pacific Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(863,432,863,379,942,379,942,432,863,432),
              hiliteOffset:new Foundation.Point(864,380),
              hiliteSize:new Foundation.Point(78,52),
              adjacentIndices:[93,113,121],
              musters:{t:new Foundation.Point(929,406),t_:new Foundation.Point(0,-6),m:new Foundation.Point(917,397),m_:new Foundation.Point(1,-6),a:new Foundation.Point(927,398),a_:new Foundation.Point(0,-6),g:new Foundation.Point(938,397),g_:new Foundation.Point(0,-6),c:new Foundation.Point(883,401),c_:new Foundation.Point(0,-4),f:new Foundation.Point(890,393),f_:new Foundation.Point(0,-4),b:new Foundation.Point(929,423),s:new Foundation.Point(884,422),s_:new Foundation.Point(-4,-4),d:new Foundation.Point(909,414),d_:new Foundation.Point(-1,-5)}
             },
             { // 112
              title:"South Indian Sea Zone",
              abbreviation:"SEI",
              otherTitle:"Southeast Indian Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(464,550,464,528,539,528,539,550,464,550),
              hiliteOffset:new Foundation.Point(465,529),
              hiliteSize:new Foundation.Point(74,21),
              adjacentIndices:[74,102,114,115],
              musters:{t:new Foundation.Point(476,549),t_:new Foundation.Point(0,-4),m:new Foundation.Point(468,541),m_:new Foundation.Point(0,-4),a:new Foundation.Point(476,542),a_:new Foundation.Point(0,-4),g:new Foundation.Point(484,541),g_:new Foundation.Point(0,-4),c:new Foundation.Point(500,547),c_:new Foundation.Point(0,-3),f:new Foundation.Point(506,540),f_:new Foundation.Point(0,-3),b:new Foundation.Point(520,535),s:new Foundation.Point(491,532),s_:new Foundation.Point(-4,-1),d:new Foundation.Point(527,545),d_:new Foundation.Point(0,-4)}
             },
             { // 113
              title:"South Pacific Sea Zone",
              abbreviation:"French Polynesia",
              otherTitle:"POL",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(779,434,779,335,863,335,863,432,779,434),
              hiliteOffset:new Foundation.Point(780,336),
              hiliteSize:new Foundation.Point(83,98),
              adjacentIndices:[87,93,96,107,111],
              musters:{t:new Foundation.Point(818,392),t_:new Foundation.Point(3,-16),m:new Foundation.Point(808,385),m_:new Foundation.Point(3,-16),a:new Foundation.Point(818,385),a_:new Foundation.Point(3,-16),g:new Foundation.Point(827,384),g_:new Foundation.Point(3,-16),c:new Foundation.Point(844,419),c_:new Foundation.Point(0,-20),f:new Foundation.Point(853,410),f_:new Foundation.Point(0,-20),b:new Foundation.Point(793,370),s:new Foundation.Point(799,421),s_:new Foundation.Point(-2,-7),d:new Foundation.Point(797,350),d_:new Foundation.Point(-3,-4)}
             },
             { // 114
              title:"South Australia Sea Zone",
              abbreviation:"GAB",
              otherTitle:"Great Australian Bight",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(539,550,539,528,569,528,634,510,695,528,715,528,715,550,539,550),
              hiliteOffset:new Foundation.Point(540,520),
              hiliteSize:new Foundation.Point(175,30),
              adjacentIndices:[6,74,96,98,112,127],
              musters:{t:new Foundation.Point(619,536),t_:new Foundation.Point(-8,0),m:new Foundation.Point(611,528),m_:new Foundation.Point(-8,0),a:new Foundation.Point(620,528),a_:new Foundation.Point(-8,0),g:new Foundation.Point(629,528),g_:new Foundation.Point(-8,0),c:new Foundation.Point(568,546),c_:new Foundation.Point(6,0),f:new Foundation.Point(578,538),f_:new Foundation.Point(6,0),b:new Foundation.Point(615,546),s:new Foundation.Point(550,537),s_:new Foundation.Point(4,-3),d:new Foundation.Point(642,544),d_:new Foundation.Point(-3,-3)}
             },
             { // 115
              title:"Southeast Madagascar Sea Zone",
              abbreviation:"SWI",
              otherTitle:"Southwest Indian Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(389,550,389,538,403,528,464,528,464,550,389,550),
              hiliteOffset:new Foundation.Point(390,529),
              hiliteSize:new Foundation.Point(74,21),
              adjacentIndices:[22,79,102,112],
              musters:{t:new Foundation.Point(410,547),t_:new Foundation.Point(-4,0),m:new Foundation.Point(400,539),m_:new Foundation.Point(-4,0),a:new Foundation.Point(409,539),a_:new Foundation.Point(-4,0),g:new Foundation.Point(419,539),g_:new Foundation.Point(-4,0),c:new Foundation.Point(433,548),c_:new Foundation.Point(0,-3),f:new Foundation.Point(441,542),f_:new Foundation.Point(0,-3),b:new Foundation.Point(454,546),s:new Foundation.Point(429,532),s_:new Foundation.Point(-5,-1),d:new Foundation.Point(454,535),d_:new Foundation.Point(-3,-3)}
             },
             { // 116
              title:"Soviet Far East Sea Zone",
              abbreviation:"SOK",
              otherTitle:"Sea of Okhotsk",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(664,122,681,106,746,63,770,63,737,113,737,157,707,157,707,151,688,151,680,170,676,168,664,122),
              hiliteOffset:new Foundation.Point(666,64),
              hiliteSize:new Foundation.Point(104,106),
              adjacentIndices:[54,89,100,120],
              musters:{t:new Foundation.Point(684,127),t_:new Foundation.Point(6,0),m:new Foundation.Point(675,119),m_:new Foundation.Point(6,0),a:new Foundation.Point(683,119),a_:new Foundation.Point(6,0),g:new Foundation.Point(692,119),g_:new Foundation.Point(6,0),c:new Foundation.Point(724,153),c_:new Foundation.Point(0,-5),f:new Foundation.Point(730,144),f_:new Foundation.Point(0,-5),b:new Foundation.Point(733,117),s:new Foundation.Point(692,147),s_:new Foundation.Point(5,0),d:new Foundation.Point(702,136),d_:new Foundation.Point(-6,0)}
             },
             { // 117
              title:"Spain Sea Zone",
              straits:{toIndexes:[123],checkIndices:[25,2]},
              abbreviation:"AZO",
              otherTitle:"Azores",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(154,275,154,161,218,161,225,164,226,172,222,184,199,235,199,263,196,275,154,275),
              hiliteOffset:new Foundation.Point(155,162),
              hiliteSize:new Foundation.Point(70,113),
              adjacentIndices:[2,55,67,80,85,97,118,123],
              musters:{t:new Foundation.Point(168,176),t_:new Foundation.Point(10,0),m:new Foundation.Point(161,168),m_:new Foundation.Point(10,0),a:new Foundation.Point(170,169),a_:new Foundation.Point(10,0),g:new Foundation.Point(178,168),g_:new Foundation.Point(10,0),c:new Foundation.Point(168,209),c_:new Foundation.Point(5,-7),f:new Foundation.Point(175,200),f_:new Foundation.Point(5,-7),b:new Foundation.Point(183,245),s:new Foundation.Point(167,220),s_:new Foundation.Point(0,7),d:new Foundation.Point(175,267),d_:new Foundation.Point(-4,-6)}
             },
             { // 118
              title:"United Kingdom Sea Zone",
              straits:{toIndexes:[70],checkIndices:[56,67]},
              abbreviation:"NOR",
              otherTitle:"North Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(154,161,154,64,226,64,226,3,311,3,311,36,268,101,269,115,266,128,218,161,154,161),
              hiliteOffset:new Foundation.Point(155,4),
              hiliteSize:new Foundation.Point(156,157),
              adjacentIndices:[17,19,62,67,70,80,90,117],
              musters:{t:new Foundation.Point(196,79),t_:new Foundation.Point(-15,0),m:new Foundation.Point(187,71),m_:new Foundation.Point(-15,0),a:new Foundation.Point(194,72),a_:new Foundation.Point(-15,0),g:new Foundation.Point(205,71),g_:new Foundation.Point(-15,0),c:new Foundation.Point(246,69),c_:new Foundation.Point(6,-9),f:new Foundation.Point(253,59),f_:new Foundation.Point(6,-9),b:new Foundation.Point(242,26),s:new Foundation.Point(169,91),s_:new Foundation.Point(8,-1),d:new Foundation.Point(168,124),d_:new Foundation.Point(-2,-9)}
             },
             { // 119
              title:"Wake Island Sea Zone",
              abbreviation:"WPO",
              otherTitle:"Western Pacific Ocean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(710,304,710,262,767,262,767,335,731,335,731,304,710,304),
              hiliteOffset:new Foundation.Point(711,263),
              hiliteSize:new Foundation.Point(56,72),
              adjacentIndices:[64,73,87,89,100,103,107],
              musters:{t:new Foundation.Point(754,283),t_:new Foundation.Point(0,-4),m:new Foundation.Point(746,276),m_:new Foundation.Point(0,-4),a:new Foundation.Point(752,276),a_:new Foundation.Point(0,-4),g:new Foundation.Point(762,275),g_:new Foundation.Point(0,-4),c:new Foundation.Point(751,330),c_:new Foundation.Point(0,-6),f:new Foundation.Point(760,322),f_:new Foundation.Point(0,-6),b:new Foundation.Point(751,296),s:new Foundation.Point(721,297),s_:new Foundation.Point(0,-5),d:new Foundation.Point(725,273),d_:new Foundation.Point(-2,-3)}
             },
             { // 120
              title:"West Alaska Sea Zone",
              abbreviation:"BER",
              otherTitle:"Bering Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(737,157,737,113,770,63,783,63,799,128,799,157,737,157),
              hiliteOffset:new Foundation.Point(738,64),
              hiliteSize:new Foundation.Point(61,93),
              adjacentIndices:[1,76,94,100,116],
              musters:{t:new Foundation.Point(752,154),t_:new Foundation.Point(-3,0),m:new Foundation.Point(744,147),m_:new Foundation.Point(-3,0),a:new Foundation.Point(752,148),a_:new Foundation.Point(-3,0),g:new Foundation.Point(756,148),g_:new Foundation.Point(-3,0),c:new Foundation.Point(775,153),c_:new Foundation.Point(5,0),f:new Foundation.Point(772,144),f_:new Foundation.Point(5,0),b:new Foundation.Point(789,141),s:new Foundation.Point(750,107),s_:new Foundation.Point(3,-5),d:new Foundation.Point(751,127),d_:new Foundation.Point(-2,-4)}
             },
             { // 121
              title:"West Argentina/Chile Sea Zone",
              abbreviation:"JFI",
              otherTitle:"Juan Fernandez Archipelago",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(3,505,3,380,21,380,53,419,55,430,56,462,54,505,3,505),
              hiliteOffset:new Foundation.Point(4,381),
              hiliteSize:new Foundation.Point(51,124),
              adjacentIndices:[5,46,96,108,111,125],
              musters:{t:new Foundation.Point(15,424),t_:new Foundation.Point(-1,-14),m:new Foundation.Point(9,417),m_:new Foundation.Point(-1,-14),a:new Foundation.Point(16,417),a_:new Foundation.Point(-1,-14),g:new Foundation.Point(25,416),g_:new Foundation.Point(-1,-14),c:new Foundation.Point(25,442),c_:new Foundation.Point(5,-6),f:new Foundation.Point(34,433),f_:new Foundation.Point(5,-6),b:new Foundation.Point(37,495),s:new Foundation.Point(23,474),s_:new Foundation.Point(-4,7),d:new Foundation.Point(34,457),d_:new Foundation.Point(-9,-2)}
             },
             { // 122
              title:"West South Africa Sea Zone",
              abbreviation:"CGH",
              otherTitle:"Cape of Good Hope",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(248,550,248,436,280,436,287,447,317,546,316,550,248,550),
              hiliteOffset:new Foundation.Point(249,437),
              hiliteSize:new Foundation.Point(67,113),
              adjacentIndices:[4,61,71,79,83,109],
              musters:{t:new Foundation.Point(295,545),t_:new Foundation.Point(-6,-7),m:new Foundation.Point(288,536),m_:new Foundation.Point(-6,-7),a:new Foundation.Point(296,537),a_:new Foundation.Point(-6,-7),g:new Foundation.Point(304,536),g_:new Foundation.Point(-6,-7),c:new Foundation.Point(264,487),c_:new Foundation.Point(-1,-8),f:new Foundation.Point(272,477),f_:new Foundation.Point(-1,-8),b:new Foundation.Point(261,535),s:new Foundation.Point(261,448),s_:new Foundation.Point(5,-3),d:new Foundation.Point(277,512),d_:new Foundation.Point(-7,-6)}
             },
             { // 123
              title:"Western Mediterranean Sea Zone",
              straits:{toIndexes:[117],checkIndices:[25,2]},
              abbreviation:"WMD",
              otherTitle:"Western Mediterranean",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(199,263,199,235,246,205,251,206,249,211,276,237,279,262,199,263),
              hiliteOffset:new Foundation.Point(200,207),
              hiliteSize:new Foundation.Point(80,56),
              adjacentIndices:[2,25,55,67,75,117],
              musters:{t:new Foundation.Point(240,244),t_:new Foundation.Point(0,-3),m:new Foundation.Point(231,237),m_:new Foundation.Point(0,-3),a:new Foundation.Point(238,237),a_:new Foundation.Point(0,-3),g:new Foundation.Point(245,237),g_:new Foundation.Point(0,-3),c:new Foundation.Point(244,225),c_:new Foundation.Point(3,-3),f:new Foundation.Point(248,219),f_:new Foundation.Point(3,-3),b:new Foundation.Point(205,249),s:new Foundation.Point(228,247),s_:new Foundation.Point(-1,-2),d:new Foundation.Point(260,236),d_:new Foundation.Point(0,-4)}
             },
             { // 124
              title:"Western U.S.A. Sea Zone",
              abbreviation:"WCO",
              otherTitle:"West Coast of America",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(815,262,815,157,834,157,852,176,863,245,863,262,815,262),
              hiliteOffset:new Foundation.Point(816,158),
              hiliteSize:new Foundation.Point(47,104),
              adjacentIndices:[66,68,76,87,93,94],
              musters:{t:new Foundation.Point(830,218),t_:new Foundation.Point(0,-6),m:new Foundation.Point(821,209),m_:new Foundation.Point(0,-6),a:new Foundation.Point(829,210),a_:new Foundation.Point(0,-6),g:new Foundation.Point(840,209),g_:new Foundation.Point(0,-6),c:new Foundation.Point(831,244),c_:new Foundation.Point(0,-4),f:new Foundation.Point(839,236),f_:new Foundation.Point(0,-4),b:new Foundation.Point(829,187),s:new Foundation.Point(827,256),s_:new Foundation.Point(7,-1),d:new Foundation.Point(828,173),d_:new Foundation.Point(-1,-5)}
             },
             { // 125
              title:"Western Panama Sea Zone",
              abbreviation:"GLP",
              otherTitle:"Galapagos Islands",
              canal:{toIndex:104,checkIndices:[44]},
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(3,380,3,314,17,320,39,336,21,380,3,380),
              hiliteOffset:new Foundation.Point(4,315),
              hiliteSize:new Foundation.Point(32,65),
              adjacentIndices:[44,63,93,104,121],
              musters:{t:new Foundation.Point(11,376),t_:new Foundation.Point(1,-4),m:new Foundation.Point(6,369),m_:new Foundation.Point(1,-4),a:new Foundation.Point(13,370),a_:new Foundation.Point(1,-4),g:new Foundation.Point(19,369),g_:new Foundation.Point(1,-4),c:new Foundation.Point(14,359),c_:new Foundation.Point(3,-3),f:new Foundation.Point(20,352),f_:new Foundation.Point(3,-3),b:new Foundation.Point(11,346),b_:new Foundation.Point(3,-4),s:new Foundation.Point(13,335),s_:new Foundation.Point(5,0),d:new Foundation.Point(12,327),d_:new Foundation.Point(-2,-3)}
             },
             { // 126
              title:"Caspian Sea Zone",
              abbreviation:"CAS",
              otherTitle:"Caspian Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(406,174,401,178,399,188,410,204,408,210,415,224,419,224,425,217,421,191,414,187,414,182,422,181,420,170,406,174),
              hiliteOffset:new Foundation.Point(400,172),
              hiliteSize:new Foundation.Point(24,52),
              adjacentIndices:[11,31,45,49],
              isLandLocked:true,
              musters:{t:new Foundation.Point(416,216),m:new Foundation.Point(414,206),a:new Foundation.Point(414,206),g:new Foundation.Point(414,206),c:new Foundation.Point(414,196),f:new Foundation.Point(414,186),b:new Foundation.Point(412,190),s:new Foundation.Point(414,176),d:new Foundation.Point(408,186)}
             },
             { // 127
              title:"Northwest Australia Sea Zone",
              abbreviation:"TIM",
              otherTitle:"Timor Sea",
              originalPowerIndex:6, // 6
              polygon:new Foundation.Polygon(548,528,548,425,602,425,602,433,634,510,569,528,548,528),
              hiliteOffset:new Foundation.Point(549,426),
              hiliteSize:new Foundation.Point(53,102),
              adjacentIndices:[6,74,78,98,114],
              musters:{t:new Foundation.Point(564,450),t_:new Foundation.Point(-1,-5),m:new Foundation.Point(555,442),m_:new Foundation.Point(-1,-5),a:new Foundation.Point(563,442),a_:new Foundation.Point(-1,-5),g:new Foundation.Point(571,442),g_:new Foundation.Point(-1,-5),c:new Foundation.Point(560,522),c_:new Foundation.Point(0,-5),f:new Foundation.Point(560,512),f_:new Foundation.Point(0,-5),b:new Foundation.Point(557,463),s:new Foundation.Point(585,433),s_:new Foundation.Point(-1,6),d:new Foundation.Point(560,491),d_:new Foundation.Point(-1,-7)}
             }
            ],
        units:{
               infantry:       {cost: 3,movement:1,attack:1,defend:2,numAttack:1,title:"Infantry"},
               armor:          {cost: 5,movement:2,attack:3,defend:2,numAttack:1,title:"Armor"},
               fighter:        {cost:12,movement:4,attack:3,defend:4,numAttack:1,title:"Fighter"},
               bomber:         {cost:15,movement:6,attack:4,defend:1,numAttack:1,title:"Bomber"},
               antiaircraftGun:{cost: 5,movement:1,range:3, defend:1,numAttack:0,title:"Antiaircraft Gun"},
               battleship:     {cost:24,movement:2,attack:4,defend:4,numAttack:1,title:"Battleship"},
               aircraftCarrier:{cost:18,movement:2,attack:1,defend:3,numAttack:1,title:"Aircraft Carrier"},
               transport:      {cost: 8,movement:2,attack:0,defend:1,numAttack:1,title:"Transport"},
               submarine:      {cost: 8,movement:2,attack:2,defend:2,numAttack:1,title:"Submarine"},
               industry:       {cost:15,                                         title:"Industrial Complex"},
               development:    {cost: 5},
               neutral:        {cost: 3},
               economicVictory:{cost:84}
              },
       developments:{
                     jetPower:            {roll:1,title:"Jet Power",            value:"team.units.fighter.defend++;team.units.fighter.title=team.units.fighter.title.replace(\"Fighter\",\"Jet Fighter\");"},
                     rockets:             {roll:2,title:"Rockets",              value:"team.units.antiaircraftGun.numAttack=1;team.units.antiaircraftGun.title=\"Rocket \"+team.units.antiaircraftGun.title;"},
                     superSubmarines:     {roll:3,title:"Super Submarines",     value:"team.units.submarine.attack++;team.units.submarine.title=\"Super \"+team.units.submarine.title;"},
                     longRangeAircraft:   {roll:4,title:"Long Range Aircraft",  value:"team.units.fighter.movement+=2;team.units.fighter.title=\"Long Range \"+team.units.fighter.title;team.units.bomber.movement+=2;team.units.bomber.title=\"Long Range \"+team.units.bomber.title;"},
                     industrialTechnology:{roll:5,title:"Industrial Technology",value:"team.units.infantry.cost--;team.units.armor.cost--;team.units.fighter.cost--;team.units.bomber.cost--;team.units.antiaircraftGun.cost--;team.units.battleship.cost--;team.units.aircraftCarrier.cost--;team.units.transport.cost--;team.units.submarine.cost--;team.units.industry.cost--;team.units.industry.title=\"Improved \"+team.units.industry.title;"},
                     heavyBombers:        {roll:6,title:"Heavy Bombers",        value:"team.units.bomber.numAttack+=2;team.units.bomber.title=team.units.bomber.title.replace(\"Bomber\",\"Heavy Bomber\");"}
                    },
       permanentControlList:["gameMessageRead","clearGameMessage","gameMessageWrite","sendGameMessage","teamMessageRead","clearTeamMessage","teamMessageWrite","sendTeamMessage"],
       "0":"Allies",
       "1":"Axis",
       "2":"U.S.S.R.",
       "3":"United Kingdom",
       "4":"United States",
       "5":"Germany",
       "6":"Japan",
       "7":"<b>%t</b> [%i] (%x,%y)<br>%p",
       "9":"<b>This is the beginning of your turn.</b><p style=\"margin-top:5px;margin-bottom:5px;\"><div style=\"width:100%;background-color:#cccccc\">You are playing:<table><tr><td valign=middle>%i</td><td valign=middle><b>%p</b> for the <b>%P</b>.</td></tr></table></div><p style=\"margin-top:5px;;margin-bottom:5px;color:#ff0000;font-weight:bold\">Click anywhere on the map to start.",
       "10":"<p>A turn consists of the following action sequence:<br>1. Develop special weapons and/or purchase units.<br>2. Combat Movement.<br>3. Combat.<br>4. Non-combat Movement.<br>5. Place newly purchased units on gameboard.<br>6. Collect income.",
       "11":"<b>You do not have enough I.P.C.s to develop any weapons.</b>",
       "12":"<b>There are no more weapons for you to develop.</b>",
       "13":"%B<b>You may research weapons development if you wish.</b> Buy any number of dice rolls for 5 I.P.C.s each. Each '6' rolled counts as a successful development, and everything else is unsuccessful. For each successful development, roll another die to determine which new technology you developed. If you already have that technology developed, keep rolling until you roll for a new technology. The technologies are as follows:<table cellspacing=2 cellpadding=0><tr><td valign=top><font color=%J><b>1.</b></font></td><td align=center valign=top>%j</td><td><font color=%J><b>Jet Power.</b> Your fighters defend at 5 instead of 4.</font></td></tr><tr><td valign=top><font color=%R><b>2.</b></font></td><td align=center valign=top>%r</td><td><font color=%R><b>Rockets.</b> One free rocket attack per turn. One antiaircraft gun can attack one industrial complex 3 adjacent spaces or less away with one die. The number on the die is the number of I.P.C.s the opponent must surrender to the bank. Industrial complexes are never destroyed.</font></td></tr><tr><td valign=top><font color=%S><b>3.</b></font></td><td align=center valign=middle>%s</td><td><font color=%S><b>Super Submarines.</b> Your submarines attack at 3 instead of 2.</font></td></tr><tr><td valign=top><font color=%L><b>4.</b></font></td><td align=center valign=top>%l</td><td><font color=%L><b>Long Range Aircraft.</b> Your fighters move up to 6 adjacent spaces instead of 4, and your bombers move up to 8 adjacent spaces instead of 6.</font></td></tr><tr><td valign=top><font color=%I><b>5.</b></font></td><td align=center valign=top>%i</td><td><font color=%I><b>Industrial Technology.</b> Your basic cost of buying any unit is reduced by one I.P.C. This does not include weapons development.</font></td></tr><tr><td valign=top><font color=%H><b>6.</b></font></td><td align=center valign=top>%h</td><td><font color=%H><b>Heavy Bombers.</b> Bombers attack with 3 dice instead of 1 die. (They still defend with 1 die.)</font></td></tr></table>This is your only chance to spend money on weapons development this turn. You will not receive a refund for unsuccessful or unused rolls. Any successful developments are immediately applied to all your present and future units.%ZBudget: %b I.P.C.s&nbsp;&nbsp;&nbsp;&nbsp;%p/%m",
       "14":"&nbsp;Spend %i I.P.C.s on %c chance(s) for weapons development: %s",
       "15":" + ",
       "16":" - ",
       "17":"Spend",
       "18":"You did not develop any weapons.",
       "19":"Congratulations, you developed:",
       "20":"OK",
       "21":"Jet Power",
       "22":"Rockets",
       "23":"Super Submarines",
       "24":"Long Range Aircraft",
       "25":"Industrial Technology",
       "26":"Heavy Bombers",
       "27":"<b>You cannot attack with rockets.</b> There are no enemy industrial complexes %r adjacent spaces or less from any of your antiaircraft guns.",
       "28":"%B<b>You may attack with rockets if you wish.</b> Choose one enemy industrial complex that is %r adjacent spaces or less from one of your antiaircraft guns to attack by rolling one die. The number rolled is the number of I.P.C.s that enemy must surrender to the bank. Industrial complexes are never destroyed, and an enemy must only surrender I.P.C.s they posses (they can't go negative and owe the bank.) You may make only one rocket attack per turn. %oRocket Attack Odds</a><p style=\"margin-top:5px;margin-bottom:5px;\">Choose an industrial complex to attack:%c<p style=\"margin-top:5px;margin-bottom:5px;\">You may %s instead if you wish.",
       "29":"Skip The Rocket Attack",
       "30":"<b>Rocket attack results:</b> You rolled a %r, and %p surrendered %s I.P.C.s to the bank.",
       "31":"<span %I>%i I.P.C.s</span>",
       "32":"Odds",
       "33":"<b>Units Within Range:</b>",
       "34":"<p style=\"margin:15px\"><b>You have no available units within range.</b>",
       "35":"<b>Defending Units:</b>",
       "36":">>",
       "37":"<<",
       "38":"%c&nbsp;%t with&nbsp;%f",
       "39":"Amphibious assault from<br>&nbsp;&nbsp;<b>%a</b> using:<br>&nbsp;&nbsp;&nbsp;&nbsp;%t&nbsp;%f",
       "40":"<br>&nbsp;&nbsp;&nbsp;&nbsp;%u&nbsp;%f",
       "41":"%u&nbsp;%f",
       "42":"<b>%t</b><br>%p",
       "43":"%BAttacking: <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To attack this territory, move desired units in the \"# Available\" column to the \"# Attacking\" column by pressing the %A or %a buttons below. Remove units from the \"# Attacking\" column by pressing the %R or %r buttons below. Defending units are shown in the \"Defending Units\" column.<p style=\"margin-top:5px;margin-bottom:5px;\">Note that some units may have several attack options, so be sure to choose the desired attack option for each unit.%H</div>",
       "44":"<table cellspacing=0 cellpadding=0 width=\"100%\"><tr><td width=\"100%\" rowspan=2>When you are done choosing your attacking units for this territory, press %d</td><td nowrap>%oBattle Odds</a></td></tr><tr><td nowrap>%bPreview Battle Board</a></td></tr></table>",
       "45":"Battle Odds",
       "46":"Total:",
       "47":"%B<b>You may purchase new units to use on your next turn.</b> The units you purchase will not go on the board immediately, you will place them at the end of this turn. The new land units must be placed in territories with an industrial complex that you held before combat this turn. The new sea units must be placed in a friendly sea zone immediately adjacent to an industrial complex that you held before combat this turn. You may not place the new units using an industrial complex in a territory you capture this turn.<p style=\"margin-top:5px;margin-bottom:5px;\">You may place new sea units in a sea zone you capture this turn. However, if you fail to capture the sea zone and there are no other friendly sea zones next to one of your industrial complexes, you will lose the new sea units and not get a refund.<p style=\"margin-top:5px;margin-bottom:5px;\">A territory cannot have more than one antiaircraft gun. Therefore, if you purchase antiaircraft guns but at the end of your turn all your territories with an industrial complex already have an antiaircraft gun (due to failure to capture an adjacent territory, or a transport ship was sunk, etc.), you will lose the new antiaircraft guns and not get a refund, even if you also bought a transport ship you could put one on.</p> %Z",
       "48":"<tr style=\"background-color:#cccccc\"><td align=center>Purchase</td><td colspan=3 align=center>Unit</td><td align=center>Cost</td><td align=center>Num</td><td align=center>Sub</td></tr>",
       "49":"Budget: %i I.P.C.s",
       "50":"%p/%m",
       "51":"<b>Make your combat moves.</b> Click on an enemy territory or sea zone you wish to attack, any sea zone you need to move supporting units to, neutral territory you wish to occupy, or friendly territory you wish to blitz to. <p style=\"margin-top:5px;margin-bottom:5px;\"><b>When you are done making your combat moves, click the &quot;%d&quot; button in the compass rose.</b><p style=\"margin-top:5px;margin-bottom:5px;\">Territories to which you have made combat moves will blink. You may click on those territories to change your forces.<p style=\"margin-top:5px;margin-bottom:5px;\">You must declare every territory you wish to attack (and with what forces) before any battle is fought. After you begin your first battle, you will not be able to choose additional territories to attack or reallocate attacking forces.<p style=\"margin-top:5px;margin-bottom:5px;\">You will be able to choose the order in which the battles will be fought, but you will not be able to fight more than one battle at a time. Each battle will need to be fully resolved in order to begin the next one. <p style=\"margin-top:5px;margin-bottom:5px;\"><font color=\"#ff0000\"><b>Warning:</b></font> Any land or sea units moved during this phase can not be moved during the non-combat phase of your turn. Units on a transport that gets loaded or moved during this phase will only be allowed to unload from where they are. <font color=\"#0000FF\"><b>Use F.A.Q.s link above.</b></font>",
       "52":"Strategic bombing using:<br>&nbsp;&nbsp;%u&nbsp;%f",
       "53":"%u&nbsp;%f,<br>&nbsp;&nbsp;blitzing&nbsp;<b>%b</b>",
       "54":"Start of Game",
       "55":"Resigns",
       "56":"Accepts Draw",
       "57":">",
       "58":"<",
       "59":"<p style=\"margin:15px\"><b>Searching for available units, please wait...</b><p style=\"margin:15px\">If a box asks you \"Do you want to abort the script?\", press 'No' to continue the search. If you press 'Yes', the search will have stopped but this message will not change, simply close this box by pressing it's 'OK' button below.",
       "60":"<font color=\"#0000FF\">Developed long range jet powered fighters.</font><br>Fighters can move up to 6 adjacent spaces instead of 4.<br>Fighters defend at 5 instead of 4.",
       "61":"<font color=\"#0000FF\">Developed jet powered fighters.</font><br>Fighters defend at 5 instead of 4.",
       "62":"<font color=\"#0000FF\">Developed long range fighters.</font><br>Fighters can move up to 6 adjacent spaces instead of 4.",
       "63":"<font color=\"#0000FF\">Developed long range heavy bombers.</font><br>Bombers can move up to 8 adjacent spaces instead of 6.<br>Bombers attack with 3 dice instead of 1 die.",
       "64":"<font color=\"#0000FF\">Developed heavy bombers.</font><br>Bombers attack with 3 dice instead of 1 die.",
       "65":"<font color=\"#0000FF\">Developed long range bombers.</font><br>Bombers can move up to 8 adjacent spaces instead of 6.",
       "66":"<font color=\"#0000FF\">Developed rockets.</font><br>One free rocket attack per turn. One antiaircraft gun<br>can attack one industrial complex 3 adjacent spaces<br>or less away with one die. The number on the die is<br>the number of I.P.C.s the opponent must surrender<br>to the bank.",
       "67":"<font color=\"#0000FF\">Developed super submarines.</font><br>Submarines attack at 3 instead of 2.",
       "68":"<font color=\"#0000FF\">Developed industrial technology.</font><br>The basic cost of buying any unit is reduced by one I.P.C.",
       "69":"<b>#&nbsp;Available:&nbsp;&nbsp;&nbsp;&nbsp;</b>",
       "70":"<b>#&nbsp;Attacking:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>",
       "71":"Attacks at: %a",
       "72":"Attacks at: %nx%a",
       "73":"%BOccupying: <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To occupy this territory, move desired land units in the \"# Available\" column to the \"# Occupying\" column by pressing the %A or %a buttons below. Remove units from the \"# Occupying\" column by pressing the %R or %r buttons below.<p style=\"margin-top:5px;margin-bottom:5px;\">By moving units into this territory, you are violating neutrality, and will have to pay %i I.P.C.s to the bank. This territory will be yours, and it will not cost anyone to move units to or through it for the rest of the game, even if taken by the enemy.<p style=\"margin-top:5px;margin-bottom:5px;\">Note that some units may have several options, so be sure to choose the desired option for each unit.%H",
       "74":"When you are done choosing your occupying units for this territory, press %d",
       "75":"<b>#&nbsp;Occupying:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>",
       "76":"<p style=\"margin:15px\"><b>You have no available land units within range.</b>",
       "77":"<p style=\"margin:15px\"><b>There are no units defending this territory.</b>",
       "78":"%BOccupying: <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To occupy this sea zone, move desired sea units in the \"# Available\" column to the \"# Occupying\" column by pressing the %A or %a buttons below. Remove units from the \"# Occupying\" column by pressing the %R or %r buttons below.<p style=\"margin-top:5px;margin-bottom:5px;\">Note that some units may have several options, so be sure to choose the desired option for each unit.%H</div>",
       "79":"When you are done choosing your occupying units for this sea zone, press %d",
       "80":"<p style=\"margin:15px\"><b>You have no available sea units within range.</b>",
       "81":"<b>Existing Units:</b>",
       "82":"<p style=\"margin:15px\"><b>There are no units occupying this sea zone.</b>",
       "83":"&nbsp;%t&nbsp;Load transport from <b>%f</b>, move to <b>%m</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To load and move this transport, choose the desired cargo and where to pick it up from the list below by pressing the appropriate 'Load & Move' button.%M<p style=\"margin-top:5px;margin-bottom:5px;\">Note that some transports may already have units loaded. These units cannot be unloaded at this time. You can only undo loads.%H</div>",
       "84":"&nbsp;<b>Units:<b>",
       "85":"To go back to the previous screen without loading and moving press %c",
       "86":"Cancel",
       "87":"Load & Move",
       "88":"<p style=\"margin:15px\"><b>You have no units available for pickup within range of this transport.</b>",
       "89":"Load >",
       "90":"Move without loading",
       "91":"< Unload",
       "92":"Preview Battle Board",
       "93":"Return To Attack Configuration",
       "94":"Or Less",
       "95":"<span style=\"font-size:20px;font-weight:bold\">No Units</span>",
       "96":"Number of rolls: %r",
       "97":"<br>Contested amphib. assalt<br>",
       "98":"<b>Resolve all combat.</b> Click on an enemy territory or sea zone you are attacking. Territories with combat needing to be resolved are blinking.<p style=\"margin-top:5px;margin-bottom:5px;\"><p style=\"margin-top:5px;margin-bottom:5px;\">You can choose the order in which the battles are fought, but you will not be able to fight more than one battle at a time. Each battle will need to be fully resolved in order to begin the next one. Amphibious assault units will need to have their sea zone battle resolved before the land battle can begin.",
       "99":"%B<b>Resolve amphibious assault unit's sea battles.</b> Amphibious assault units must have their sea zone battles resolved before the combat for <b>%t</b> can begin. Either %c or choose a sea battle to resolve first from the list below:",
       "100":"Choose a different territory",
       "101":"Roll for combat",
       "102":"Retreat",
       "103":"The attacking units got %a, and the defending units got %d.<br>",
       "104":"Select <span id=\"%i\">%n</span> to remove and press %d",
       "105":"Toggle hit",
       "106":"2px solid orange",
       "107":"All your units were hit. %d",
       "108":"<p style=\"margin:5px\">Planes en route to <b>%t</b>.<p style=\"margin:5px\">Calculating loses due to antiaircraft guns, please wait...",
       "109":"<p style=\"margin:5px\">Planes en route to <b>%t</b>.<p style=\"margin:5px\">%r<p style=\"margin:5px\">%d",
       "110":"<p style=\"margin:5px\">Strategic bombing raid on <b>%t</b>.<p style=\"margin:5px\">Calculating damage, please wait...",
       "111":"<p style=\"margin:5px\">Strategic bombing raid on <b>%t</b>.<p style=\"margin:5px\">%r<p style=\"margin:5px\">%y rolled a total of %b, and %e surrendered %i I.P.C.s to the bank.<p style=\"margin:5px\">%d",
       "112":"%i I.P.C.s",
       "113":"%BAmphibious Assault: <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To unload transports and set one-shot support attacks, move desired units in the \"Available\" column to the \"Unloaded\" column by pressing the %A or %a buttons below. Remove units from the \"Unloaded\" column by pressing the %R or %r buttons below.<p style=\"margin-top:5px;margin-bottom:5px;\">This is your only chance to unload units and set support attacks for this battle. If you decide not to unload some of the units before the first round of combat, those units will remain at sea and cannot be involved in this or any other amphibious assault this turn. Unused battleships can participate in other amphibious assaults from their sea zone. Each transport and battleship can only participate in one amphibious assault per turn.%H</div>",
       "114":"When you are done choosing your amphibious units for this battle, press %d",
       "115":"<b>Amphibious Units:</b>",
       "116":"<b>Available:&nbsp;&nbsp;&nbsp;&nbsp;</b>",
       "117":"<b>Unloaded:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>",
       "118":"One-Shot Support Attack",
       "119":"<b>%t</b> %d",
       "120":"The one-shot support attacks from battleships in %t have been canceled. At least one transport from that sea zone must unload for the battleships to participate in this amphibious assault.",
       "121":"%B<p style=\"margin:2px\">Attacking <b>%t</b>",
       "122":"Choose other territory",
       "123":"Retreat options",
       "124":"%BRetreat from <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">You may retreat all your units to one adjacent friendly territory or sea zone by pressing a button below. You can only retreat to a territory or sea zone from which one of your attacking units came. You will not be able to reassign retreated units to other embattled territories this turn, nor make non-combat moves with them later this turn.<p style=\"margin-top:5px;margin-bottom:5px;\">If some of the units are air units, you may not retreat to a territory that was not friendly at the beginning of your turn. If all the remaining units are air units, they may retreat as a group to any territory or sea zone that is within range of every unit, and can land every unit (when using carriers).%H</div>",
       "125":"Retreat to %t",
       "126":"Cancel retreat, return to combat",
       "127":"Done",
       "128":"None available.",
       "129":"The attacking units got %A plus %a, and the defending units got %D plus %d.<br>",
       "130":"The attacking units got %A plus %a, and the defending units got %d.<br>",
       "131":"The attacking units got %A plus %a, and the defending units got %D.<br>",
       "132":"The attacking units got %a, and the defending units got %D plus %d.<br>",
       "133":"The attacking units got %a, and the defending units got %d.<br>",
       "134":"The attacking units got %a, and the defending units got %D.<br>",
       "135":"The attacking units got %A, and the defending units got %D plus %d.<br>",
       "136":"The attacking units got %A, and the defending units got %d.<br>",
       "137":"The attacking units got %A, and the defending units got %D.<br>",
       "138":"Select <span id=\"%I\">%N</span> and <span id=\"%i\">%n</span> to remove and press %d",
       "139":"Select <span id=\"%I\">%N</span> to remove and press %d",
       "140":"%h hits",
       "141":"%h hit",
       "142":"%h naval hits",
       "143":"%h naval hit",
       "144":"%u units",
       "145":"%u unit",
       "146":"%u naval units",
       "147":"%u naval unit",
       "148":"<b>Land all combat aircraft.</b> Click on any territory or sea zone with combat aircraft to land. Territories with combat aircraft needing to be landed are blinking.<p style=\"margin-top:5px;margin-bottom:5px;\">When you have landed all your combat aircraft and are ready to move to the next phase, press the <b>Done</b> button in the compass rose.<p style=\"margin-top:5px;margin-bottom:5px;\">Aircraft cannot land in territories that were captured this turn. Aircraft do not have to endure antiaircraft fire during this phase.",
       "149":"%BLanding combat aircraft from <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To land combat aircraft, click the desired landing territory's button in the group. The aircraft are grouped by type and number of spaces they have left to move.<p style=\"margin-top:5px;margin-bottom:5px;\">&bull; Aircraft cannot land in territories that were captured this turn.<br>&bull; Aircraft that cannot land are lost and must be destroyed.<br>&bull; Aircraft do not have to endure antiaircraft fire during this phase.%H</div>",
       "150":"Aircraft",
       "151":"Range",
       "152":"Territories",
       "153":"Undo landing",
       "154":"%c x %p<br>Range:%r",
       "155":"%t (%n)",
       "156":"<b>Note:</b> You can temporarily hide this screen by holding down a CTRL key.",
       "157":"Destroy",
       "158":"Undestroy (%n)",
       "159":"<b>Click the Next button.</b> If you are satisfied with your combat aircraft landing assignments, click the <b>Next</b> button in the compass rose to move to the next phase of your turn.<p style=\"margin-top:5px;margin-bottom:5px;\">Click a territory to change landing assignments for combat aircraft used to attack it.",
       "160":"<b>Make your non-combat moves.</b> Click on any friendly territory or sea zone you wish to move units to.<p style=\"margin-top:5px;margin-bottom:5px;\"><b>When you are done making your non-combat moves, click the &quot;Done&quot; button in the compass rose.</b><p style=\"margin-top:5px;margin-bottom:5px;\">You cannot move units used in combat this turn.<p style=\"margin-top:5px;margin-bottom:5px;\">Territories <b>to</b> which you have made non-combat moves will blink. You may click on those territories to change your moves.",
       "161":"Next",
       "162":"%BNon-combat moves to <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To move units to this territory, move desired units in the \"# Available\" column to the \"# Moved\" column by pressing the %M or %m buttons below. Remove units from the \"# Moved\" column by pressing the %R or %r buttons below.<p style=\"margin-top:5px;margin-bottom:5px;\">Note that some units may have several move options, so be sure to choose the desired move option for each unit.%A%H</div>",
       "163":"<b>#&nbsp;Moved:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>",
       "164":"When you are done choosing units to move into this territory, press %d",
       "165":"To choose a different territory to land combat aircraft from, press %d",
       "166":"<font color=\"#0000FF\">Industrial Production Certificates (I.P.C.s):</font><br>The amount of money this player has in the bank<br>to purchase new units and research technology.",
       "167":"<font color=\"#0000FF\">National Production Level (N.P.L.):</font><br>The sum value of territories held, this is the amount of<br>money this player is currently due to receive at the end of<br>their next turn.",
       "168":" You can also %M the transport.",
       "169":"Load",
       "170":"<b>Place the new units you purchased at the beginning of your turn.</b> The new land units must be placed in territories with an industrial complex that you held before combat this turn. The new sea units must be placed in a friendly sea zone immediately adjacent to an industrial complex that you held before combat this turn. You may not place the new units using an industrial complex in a territory you captured this turn.<p style=\"margin-top:5px;margin-bottom:5px;\">You may place new sea units in a sea zone you captured this turn.<p style=\"margin-top:5px;margin-bottom:5px;\">A territory cannot have more than one antiaircraft gun. Therefore, if you purchased antiaircraft guns but all your territories with an industrial complex already have an antiaircraft gun (due to failure to capture an adjacent territory, or a transport ship was sunk, etc.), you will lose the new antiaircraft guns and not get a refund, even if you also bought a transport ship you could put one on.",
       "171":"When you have finished placing all your new units press %d",
       "172":"Units",
       "173":"Placement Territories",
       "174":"Undo Placement",
       "175":"Destroy",
       "176":"Undo Destroy",
       "177":"Destroy",
       "178":"Undestroy",
       "179":"%t (%u)",
       "180":"%B<b>Collect income.</b> Your N.P.L. is %n and you collected %n I.P.C.s from the bank.",
       "181":"%B<b>Collect income.</b> Your capital is in enemy hands, and you cannot collect income until it is liberated.",
       "182":"<b>Order combat units for defense.</b> Click on any territory or sea zone in which you have combat units to set the order in which they will be eliminated when defending. <p style=\"margin-top:5px;margin-bottom:5px;\">Territories with multiple combat unit types whose defenses you have not reviewed this turn are blinking. After you have reviewed each of these territories, you will be able to complete your turn.",
       "183":"<b>Click the Done button.</b> If you are satisfied with your defensive assignments, click the <b>Done</b> button in the compass rose to end your turn.<p style=\"margin-top:5px;margin-bottom:5px;\">Click a territory to change defensive assignments for combat units.<p style=\"margin-top:5px;margin-bottom:5px;\"><b><font color=\"#ff0000\">Warning:</font><b> When you click the <b>Done</b> button, your turn will be over and you will not be able to undo any of your non-combat moves or change defensive assignments until your next turn.",
       "184":"<b>The game is over, and the %W won.</b>",
       "185":"<div style=\"width:100%;background-color:#cccccc\"><p style=\"margin-top:5px;margin-bottom:5px;\">You were playing:<table><tr><td valign=middle>%i</td><td valign=middle><b>%p</b> for the <b>%P</b>.</td></tr></table></div>",
       "186":"<p style=\"margin-top:5px;margin-bottom:5px;\">The Allies achieved military victory by capturing both the Axis capitals, Germany and Japan.",
       "187":"<p style=\"margin-top:5px;margin-bottom:5px;\">The Axis achieved military victory by capturing at least two of the three Allies capitals, Russia, United&nbsp;Kingdom, and Eastern&nbsp;U.S.A.",
       "188":"<p style=\"margin-top:5px;margin-bottom:5px;\">The Axis achieved economic victory by ending the round with a combined N.P.L. of %n or more.<br>(Combined Axis N.P.L.: %t)",
       "189":"<p style=\"margin-top:5px;margin-bottom:5px;\">The Allies achieved military victory as both Axis powers resigned.",
       "190":"<p style=\"margin-top:5px;margin-bottom:5px;\">The Axis achieved military victory as all Allies powers resigned.",
       "191":"Playing <b>%t</b> for the <b>%T</b>.",
       "192":"<b>Game message board</b>, visible to all players.",
       "193":"<b>Team message board</b>, only visible to your team.&nbsp;&nbsp;&nbsp;%o(Open in window)</a>",
       "194":"%BOrder combat units for <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To order defensive units to this territory, click and drag your units to the desired position. Units at the <b>end</b> of the list (lower left) will be eliminated <b>first</b>, while units at the <b>beginning</b> (upper right) will be eliminated <b>last</b>.<p style=\"margin-top:5px;margin-bottom:5px;\">Although you can interleave your units with any friendly units however you wish, you can only reorder units of powers you control. Friendly units that you do not control will remain in their respective order.%H</div>",
       "195":"When you are done ordering combat units to defend this territory, press %d",
       "196":"<b>Combat Units:</b>",
       "197":"Last&nbsp;To&nbsp;Die",
       "198":"First&nbsp;To&nbsp;Die",
       "199":"You've captured %c and receive %i I.P.C.s from %p.",
       "200":"Transports unloading cargo will not show as<br>unloaded until after you have finished making<br>all your non-combat moves.",
       "201":"Attacker",
       "202":"Defender",
       "203":"%BBlitz to friendly: <b>%t</b><div style=\"background-color:#eeeeee\"><p style=\"margin-top:5px;margin-bottom:5px;\">To blitz through an enemy territory and into this territory, move the desired units in the \"# Available\" column to the \"# Blitzing\" column by pressing the %A or %a buttons below. Remove units from the \"# Blitzing\" column by pressing the %R or %r buttons below.<p style=\"margin-top:5px;margin-bottom:5px;\">Note that some units may have several blitz options, so be sure to choose the desired blitz option for each unit.%H</div>",
       "204":"<b># Blitzing</b>",
       "205":"When you are done choosing your blitzing units for this territory, press %d",
       "206":"Back",
       "207":"<html><head><title>W.W.II F.A.Q.s</title></head><style>\n"+
                            "body {font:%Z;margin:0;padding:0}\n"+
                            "input {font:%Z}\n"+
                            "a {color:#0000ee;text-decoration:underline;cursor:default}\n"+
                            "</style><body><div style=\"width:100%;height:100%;padding:5;overflow:auto\">\n"+
                            "<span id=\"FaqIndex\">\n"+
                            "<h3>W.W.II F.A.Q.s</h3>\n"+
                            "<"+"script language=javascript>\n"+
                            "function GoTo(Id){document.getElementById(Id).scrollIntoView(); return false}\n"+
                            "<"+"/script>\n"+
                            "A player who reads this entire FAQ will stomp any player that does not.\n"+
                            "<p><b>Recommendations:</b><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('TakeYourTime');\">Take your time!</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('ReadThePrompts');\">Read the prompts.</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('MoveNotes');\">General notes on moving.</a><br>\n"+
                            "<p><b>F.A.Q.s:</b><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('GoBack');\">How can I go back to a previous screen?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('HiddenMap');\">How can I see the map behind a box?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('Attacking');\">How do I attack?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('AmphibiousAssault');\">How do I amphibious assault?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('Blitz');\">How do I blitz?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('BlitzToFriendly');\">How do I blitz and return to a friendly territory?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('StrategicBombing');\">How do I conduct a strategic bombing raid?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('FightersCarriers');\">How do I coordinate a fighter with a carrier?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('TransportUnits');\">How do I transport units?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('DefendingSubRetreat');\">When and to where do defending submarines retreat?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('HitAircraft');\">How do I choose the aircraft with the least range to be hit?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('AmphibiousRetreat');\">How do I retreat my units during an amphibious assault?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('DevelopedTechnology');\">How do I know what technologies a player has developed?</a><br>\n"+
                            "<a href=\"#\" onclick=\"return GoTo('MapWrapping');\">What areas at the edge of the map are adjacent?</a><br>\n"+
                            "</span>\n"+
                            "<span id=\"TakeYourTime\"><p><b>Take your time!</b><br>W.W.II is a big game, and it's play was designed to be unforgiving of mistakes and inattention (as a war game should be!). You have all the time in the world to make your moves, so be sure you use a good portion of it!<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"ReadThePrompts\"><p><b>Read the prompts.</b><br>Until you get used to the interface, read each prompt carefully. Pay particular attention to the prompts that follow the mouse around. They let you know what phase of your turn you are in and what you need to do to progress.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"MoveNotes\"><p><b>General notes on moving.</b><br>The interface for this game is target-centric, not unit-centric. If you want to move a unit somewhere, do not click on the territory with the unit, click on the territory where you want the unit to go. Amphibious transport units should be brought to the sea zone first, and then unloaded (if desired) into an adjacent territory.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"GoBack\"><p><b>How can I go back to a previous screen?</b><br>Back buttons are available throughout the interface. However, if you are in such a state that you want to start all over, simply press the refresh button in your browser. As long as you have not completed your turn, that will take you as far back as possible, either to the start of your turn or to the last dice roll. You can then start over from that point.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"HiddenMap\"><p><b>How can I see the map behind a box?</b><br>Any time there is an unmovable box over the map, you can hold down a CTRL key to  temporarily hide the box and use the mouse to see units in territories. When the CTRL key is released, the box will reappear in its same state. This is easier than undoing moves!<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"Attacking\"><p><b>How do I attack?</b><br>Click the territory you want to attack. All units in range and not committed elsewhere will show up in the list, and you move the number you want with the <input type=button value=\"&gt;\"> and <input type=button value=\"&gt;&gt;\"> buttons.  Use the \"Preview Battle Board\" link often (at bottom right of combat moves box), which is handy to see how your units will stack up against the defender.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"AmphibiousAssault\"><p><b>How do I amphibious assault?</b><br>First, your transports must be loaded and moved to the adjacent sea zones. To do this, click on the sea zone adjacent to the territory you are going to attack and you will see a list of transports within range. For each one, click the \"Load & Move\" button. This will show you which unit combinations are available for loading to the transport. Choose the one you want. Repeat this for each transport you wish to amphibious assault with. Second, move your battleships into the same sea zone for their one shot support attack. Repeat the first and second steps for each adjacent sea zone you will mount attacks from. When you have all your sea units loaded and in place, click each territory you want to amphibious assault. <font color=\"red\"><b>Do not forget to do this part!</b></font> You will see the transports in the list, with the units available for unloading. For each, choose the number you want to assault with. Although the units are marked for the assault, they will not actually move into the territory until the \"Resolve Combat\" phase. <font color=\"red\"><b>The game does not assume an amphibious assault simply because a transport was moved adjacently, you must remember the previous step for each territory!</b></font>  When you click on the territory to resolve combat, you will be prompted to resolve any sea battles with amphibious assault units first. Then you will be prompted to unload your units and commit to the assault, and available battleships can be committed for their one shot support attack. After the units are unloaded and the first dice are thrown, any units not committed cannot participate or be reallocated.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"Blitz\"><p><b>How do I blitz?</b><br>To blitz an enemy territory, click the enemy or neutral territory you want your tanks to <b>end up at</b>. Tanks that can blitz an intermediate territory will show an option to do so. Choose at least one from that option when moving the units.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"BlitzToFriendly\"><p><b>How do I blitz and return to a friendly territory?</b><br>To blitz an enemy territory and move to a friendly territory, click the friendly territory you want your tanks to <b>end up at</b> (even if it's the same one they are starting from). Tanks within range and the territories they can blitz are shown, choose at least one from the desired options.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"StrategicBombing\"><p><b>How do I conduct a strategic bombing raid?</b><br>To bomb an industrial complex, click the enemy territory. Bomber units within range will show options to conduct regular attacks and strategic bombing raids. There may be more than one strategic bombing raid option per unit depending on range and number of antiaircraft guns along the route. Move the number of bombers from each option that you want to participate.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"FightersCarriers\"><p><b>How do I coordinate a fighter with a carrier?</b><br>The important part to remember here is to move the carrier first. Before you move your fighter to its combat zone or destination, first move the carrier it will land on to the sea zone where you plan on picking up the fighter. This allows moves that might not be available otherwise due to the &quot;no kamikaze&quot; rule.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"TransportUnits\"><p><b>How do I transport units?</b><br>First, your transports must be loaded and moved to the sea zones. To do this, click on the sea zone where you want the transport to <b>end up at</b> and you will see a list of transports within range. For each one, click the \"Load & Move\" button. This will show you which unit combinations are available for loading to the transport. Choose the one you want. Repeat this for each transport you wish to move. If you wish to then unload into an adjacent territory, click the territory you want to unload to. You will see the transports in the list, with the units available for unloading. For each, choose the number you want to unload. Although the units are marked for unloading, they will not actually move into the territory until the \"Non-Combat Movement\" phase is complete.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"DefendingSubRetreat\"><p><b>When and to where do defending submarines retreat?</b><br>Defending submarines will automatically retreat if all the following conditions are met:<br>&bull; The sea zone is being attacked by air units only.<br>&bull; The submarine is not absorbing hits for any other unit.<br>&bull; An adjacent sea zone is uncontested.<br>If all conditions are met, the defending submarine will retreat to the adjacent uncontested sea zone that has the most friendly units. If more than one sea zone has this number of units, the submarine will retreat to the one that brings it geographically closer to it's capital.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"HitAircraft\"><p><b>How do I choose the aircraft with the least range to be hit?</b><br>When you choose an aircraft to be hit when resolving combat, the aircraft of that type with the least range is removed first. For example, if you have a fighter with a remaining range of 3 and a fighter with a remaining range of 1 in a battle, and you select one fighter as hit, the fighter with the range of 1 is removed, regardless of which of the two fighter icons was selected. This does not apply when resolving antiaircraft gun casualties, where each aircraft rolls its own fate.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"AmphibiousRetreat\"><p><b>How do I retreat my units during an amphibious assault?</b><br>You can not retreat any units from an amphibious assault. All units, including air units and land units not brought by transport, must fight to the death.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"DevelopedTechnology\"><p><b>How do I know what technologies a player has developed?</b><br>If a player has developed a technology, a unit representing that technology will appear under their title at the top of the board. In addition, the improved units will look different on the board.<br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "<span id=\"MapWrapping\"><p><b>What areas at the edge of the map are adjacent?</b><br>Some adjacencies at the edge of the map are not obvious. <li>The <font color=\"red\"><b>Eastern Canada Sea Zone</b></font> goes to the edge of the board (between Eastern Canada and the mini-maps) and is therefore ajacent to <font color=\"red\"><b>Western Canada</b></font>.</li><li>The <font color=\"red\"><b>New Zealand Sea Zone</b></font> extends under the mini-maps to the edge of the board, and is therefore adjacent to the <font color=\"red\"><b>South East Pacific Sea Zone</b></font>, the <font color=\"red\"><b>West Argentina/Chile Sea Zone</b></font>, and the <font color=\"red\"><b>South Argentina/Chile Sea Zone</b></font>.</li><li>The <font color=\"red\"><b>Gulf Of Mexico Sea Zone</b></font> is adjacent to both the <font color=\"red\"><b>Eastern U.S.A. Sea Zone</b></font> and the <font color=\"red\"><b>Eastern Panama Sea Zone</b></font>.</li><li>No other edge adjacencies straddle territories, each border has a counterpart lining up on the other side of the board.</li><br><a href=\"#\" onclick=\"return GoTo('FaqIndex');\">Back to top.</a></span>\n"+
                            "</div></body></html>",
       "208":"<html><head><title>W.W.II Units</title><style>\n"+
                            "table {font:%Z}\n"+
                            "tr.OddRow {background-color:#ffffff}\n"+
                            "tr.EvenRow {background-color:#eeeeee}\n"+
                            ".Improvement {color:#0000cc}\n"+
                            ".LongRangeImprovement {color:#008800}\n"+
                            "td.Improved {padding-left:10px}\n"+
                            "td.ImprovedTwice {padding-left:20px}\n"+
                            "</style></head><body style=\"overflow:auto\">\n"+
                            "<table Id=\"AllUnits\" border=1 style=\"sdisplay:none\">\n"+
                            "<tr><th colspan=2>Unit</th><th>Cost</th><th>Movement</th><th>Attack</th><th>Defend</th></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%m</td><td nowrap>Infantry</td><td nowrap align=center>3</td><td nowrap align=center>1</td><td nowrap align=center>1</td><td nowrap align=center>2 or less</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%a</td><td nowrap>Armor</td><td nowrap align=center>5</td><td nowrap align=center>2</td><td nowrap align=center>3 or less</td><td nowrap align=center>2 or less</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%f</td><td nowrap>Fighter</td><td nowrap align=center rowspan=4>12</td><td nowrap align=center rowspan=2>4</td><td nowrap align=center rowspan=4>3 or less</td><td nowrap align=center>4 or less</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%j</td><td class=\"Improved\" nowrap><font class=Improvement>Jet</font> Fighter</td><td class=Improvement nowrap align=center rowspan=2>5 or less</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%J</td><td class=\"ImprovedTwice\" nowrap><font class=LongRangeImprovement>Long Range</font> <font class=Improvement>Jet</font> Fighter</td><td nowrap class=LongRangeImprovement align=center rowspan=2>6</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%F</td><td class=\"Improved\" nowrap><font class=LongRangeImprovement>Long Range</font> Fighter</td><td nowrap align=center>4 or less</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%b</td><td nowrap>Bomber</td><td nowrap align=center rowspan=4>15</td><td nowrap align=center rowspan=2>6</td><td nowrap align=center>4 or less</td><td nowrap align=center rowspan=4>1</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%h</td><td class=\"Improved\" nowrap><font class=Improvement>Heavy</font> Bomber</td><td nowrap align=center rowspan=2><font class=Improvement>3 @ </font>4 or less</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%H</td><td class=\"ImprovedTwice\" nowrap><font class=LongRangeImprovement>Long Range</font> <font class=Improvement>Heavy</font> Bomber</td><td nowrap class=LongRangeImprovement align=center rowspan=2>8</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%B</td><td class=\"Improved\" nowrap><font class=LongRangeImprovement>Long Range</font> Bomber</td><td nowrap align=center>4 or less</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%t</td><td nowrap>Transport</td><td nowrap align=center>8</td><td nowrap align=center>2</td><td nowrap align=center>-</td><td nowrap align=center>1</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%s</td><td nowrap>Submarine</td><td nowrap align=center rowspan=2>8</td><td nowrap align=center rowspan=2>2</td><td nowrap align=center>2 or less&sup1;</td><td nowrap align=center rowspan=2>2 or less&sup1;</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%S</td><td class=\"Improved\" nowrap><font class=Improvement>Super</font> Submarine</td><td nowrap class=Improvement align=center>3 or less&sup1;</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%c</td><td nowrap>Aircraft Carrier</td><td nowrap align=center>18</td><td nowrap align=center>2</td><td nowrap align=center>1</td><td nowrap align=center>3 or less</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%d</td><td nowrap>Battleship</td><td nowrap align=center>24</td><td nowrap align=center>2</td><td nowrap align=center>4 or less</td><td nowrap align=center>4 or less</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%g</td><td nowrap>Antiaircraft Gun</td><td nowrap align=center rowspan=2>5</td><td nowrap align=center rowspan=2>1</td><td nowrap align=center>-</td><td nowrap align=center rowspan=2>1</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>%G</td><td class=\"Improved\" nowrap><font class=Improvement>Rocket</font> Antiaircraft Gun</td><td class=Improvement nowrap align=center>Roll&sup2;</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%i</td><td nowrap>Industrial Complex</td><td nowrap align=center rowspan=2>15</td><td nowrap align=center colspan=3>-</td></tr>\n"+
                            "<tr class=\"EvenRow\"><td align=center nowrap>%I</td><td class=\"Improved\" nowrap><font class=Improvement>Improved</font> Industrial Complex</td><td class=Improvement nowrap colspan=3 align=center>Cost of buying any unit reduced by 1.</td></tr>\n"+
                            "<tr class=\"OddRow\"><td align=center nowrap>&nbsp;</td><td nowrap>Violate Neutral Territory</td><td nowrap align=center>3</td><td nowrap align=center colspan=3>-</td></tr>\n"+
                            "<tr><td nowrap colspan=6>\n"+
                            "&sup1;Submarines cannot attack or defend against aircraft, their hits must be applied to sea units.<br>\n"+
                            "&sup2;One rocket antiaircraft gun per turn can attack one industrial complex 3 or less spaces away.<br>\n"+
                            "</td></tr></table>\n"+
                            "</body></html>",
       "209":"%aW.W.II F.A.Q.s</a>",
       "210":"%aUnit Sheet</a>",
       "211":"Open FAQ",
       "212":"Open Unit Sheet",
       "213":"Did not research developments.",
       "214":"Spent %i I.P.C.s on research for %n chances of development, failing miserably with the following rolls: %r.",
       "215":null,
       "216":"Log",
       "217":"Spent %i I.P.C.s on research for %n chances of development, succeeding with %d development(s), %D, with the following rolls: %r and %R.",
       "218":"%d, %D",
       "219":"#C72918",
       "220":"#666666",
       "221":"#CB7838",
       "222":"#BCA20E",
       "223":"#809F55",
       "224":"#E6B477",
       "225":"#627EB0",
       "226":"The %p achieved military victory!",
       "227":"The Axis achieved economic victory!",
       "228":"Did not purchase units.",
       "229":"Purchased the following units for %i I.P.C.s: %u.",
       "230":"%n %u",
       "231":"%U, %u",
       "232":"Skipped the rocket attack.",
       "233":"Attacked <font color=\"%c\">%t</font> with rockets, rolling a %r, and <font color=\"%c\">%e</font> surrendered %i I.P.C.s to the bank.",
       "234":"Moved %n %u %U %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>%x.",
       "235":" for a strategic bombing raid",
       "236":", blitzing <font color=\"%c\">%t</font>",
       "237":", over %n antiaircraft gun",
       "238":", with %n neutral territory violation",
       "239":"Assigned %n %u %U from <font color=\"%f\">%F</font> to amphibious assault <font color=\"%t\">%T</font>.",
       "240":"Moved transport %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>.",
       "241":"Moved transport %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>, picking up 1 <font color=\"%p\">%P</font> from <font color=\"%q\">%Q</font>.",
       "242":"Moved transport %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>, picking up 2 <font color=\"%p\">%P</font> from <font color=\"%q\">%Q</font>.",
       "243":"Moved transport %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>, picking up 1 <font color=\"%p\">%P</font> from <font color=\"%q\">%Q</font> and 1 <font color=\"%c\">%C</font> from <font color=\"%d\">%D</font>.",
       "244":"Moved transport carrying 1 <font color=\"%c\">%C</font> %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>.",
       "245":"Moved transport carrying 1 <font color=\"%c\">%C</font> %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>, picking up 1 <font color=\"%p\">%P</font> from <font color=\"%q\">%Q</font>.",
       "246":"Moved transport carrying 2 <font color=\"%c\">%C</font> %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>.",
       "247":"Moved transport carrying 1 <font color=\"%c\">%C</font> and 1 <font color=\"%d\">%D</font> %s %S from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>.",
       "248":"Unloaded %n %u %U from <font color=\"%f\">%F</font> for amphibious assault to <font color=\"%t\">%T</font>.",
       "249":"BEGINNING OF TURN for %p.",
       "250":"END OF TURN for %p.",
       "251":"unit",
       "252":"units",
       "253":"space",
       "254":"spaces",
       "255":"Committed %n %u from <font color=\"%f\">%F</font> for one shot support attacks on <font color=\"%t\">%T</font>.",
       "256":"battleship",
       "257":"battleships",
       "258":"I.P.C.",
       "259":"I.P.C.s",
       "260":"<font color=\"%t\">%T</font> captured.",
       "261":"<font color=\"%t\">%T</font> captured, <font color=\"%c\">%C</font> turns over %i %I to <font color=\"%p\">%P</font>.",
       "262":"<font color=\"%t\">%T</font> liberated, returning to <font color=\"%p\">%P's</font> control.",
       "263":"<font color=\"%t\">%T</font> returns to <font color=\"%p\">%P's</font> control.",
       "264":"<font color=\"%p\">Attacker with %u %U got %h %H with the following rolls: %r</font>",
       "265":"<font color=\"%p\">Attacker with %u %U got %n naval %N with the following rolls: %r</font>",
       "266":"<font color=\"%p\">Attacker with %u %U got %n first strike naval %N with the following rolls: %r</font>",
       "267":"<font color=\"%p\">Attacker with %u %U got %h %H and %n naval %N with the following rolls: %r</font>",
       "268":"<font color=\"%p\">Attacker with %u %U got %h %H and %n first strike naval %N with the following rolls: %r</font>",
       "269":"<font color=\"%p\">Defender with %u %U got %h %H with the following rolls: %r</font>",
       "270":"<font color=\"%p\">Defender with %u %U got %n naval %N with the following rolls: %r</font>",
       "271":"<font color=\"%p\">Defender with %u %U got %h %H and %n naval %N with the following rolls: %r</font>",
       "272":"hit",
       "273":"hits",
       "274":"Resolving combat in <font color=\"%t\">%T</font>.",
       "275":"*",
       "276":",",
       "277":"Retreated %u %U from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>.",
       "278":"<font color=\"%t\">%P retains control of %T.</font>",
       "279":"All sea units destroyed, <font color=\"%t\">%T</font> is now <font color=\"%w\">open water</font>.",
       "280":"<font color=\"%t\">%T</font> is now controlled by %p.",
       "281":"%a air %U flew over %g %G on their way to <font color=\"%t\">%T</font>, resulting in %h %H with the following rolls: %r",
       "282":"antiaircraft gun",
       "283":"antiaircraft guns",
       "284":"bomber",
       "285":"bombers",
       "286":"bomb",
       "287":"bombs",
       "288":"%a %A dropped %b %B on the industrial complex in <font color=\"%t\">%T</font>, resulting in %d damage, and <font color=\"%t\">%P</font> surrendered %i %I to the bank. Bomb rolls: %r",
       "289":"<font color=\"%p\"><b>%P</b></font> did not get any developments.",
       "290":"<font color=\"%p\"><b>%P</b></font> developed:",
       "291":"< Prev",
       "292":"Next >",
       "293":"<b>Rocket attack results:</b> <font color=\"%a\"><b>%A</b></font> rolled a %r, and <font color=\"%d\"><b>%D</b></font> surrendered %i %I to the bank.",
       "294":"You",
       "295":"Landed %u combat %U (range %r) from <font color=\"%f\">%F</font> %s %S to <font color=\"%t\">%T</font>.",
       "296":"Combat %u (range %r) in <font color=\"%f\">%F</font> could not land as was lost at sea.",
       "297":"fighter",
       "298":"fighters",
       "299":"Landed %n %u %U from <font color=\"%f\">%F</font> to <font color=\"%t\">%T</font>.",
       "300":"Placed %n new %u %U in <font color=\"%t\">%T</font>.",
       "301":"%n new %u %U could not be placed and %w destroyed.",
       "302":"Ended turn with an N.P.L. of %n and collected %i %I from the bank.",
       "303":"Ended turn with capital in enemy hands and did not collect income.",
       "304":"<font color=\"%t\">Defender removes %u %U from %T.</font>",
       "305":"Attacker removes %u %U from <font color=\"%t\">%T</font>.",
       "306":"%aReport Problem</a>",
       "307":"Report Problem",
       "308":"Change Amphibious Units",
       "309":"<font color=\"%f\">Defender retreats %s %S from %F to <font color=\"%t\">%T</font>.</font>",
       "310":"submarine",
       "311":"submarines",
       "312":"Defender retreated %s %S to %T.",
       "313":"Could not land %a combat %A (range %r) in <font color=\"%f\">%F</font>, %u lost at sea.",
       "314":"Resign",
       "315":" <font color=\"#ee0000\">[Resigned]</font>",
       "316":"%p resigns.",
       "317":"All %l powers resigned, %w are victorious.",
       "318":"<span %L>%l N.P.L.</span>",
       "319":"was",
       "320":"were",
       "321":"<div style=\"width:100%;background-color:#cccccc\"><p style=\"margin-top:5px;margin-bottom:5px;\">You are playing:<table><tr><td valign=middle>%i</td><td valign=middle><b>%p</b> for the <b>%P</b>.</td></tr></table></div>",
       "322":"<p><b>Waiting on %p, playing %t for the %T.</b></p>",
       "323":"WARNING: You are purchasing more units than your factories can produce.\n\n",
       "324":"WARNING: You are purchasing more sea units than your coastal factories can produce.\n\n",
       "325":"WARNING: You are purchasing more sea units than you can place in uncontested sea zones.\nYou will need to destroy all enemy units in a sea zone to use it for production this turn.\n\n",
       "326":"Units you purchase but cannot place at the end of your turn will be lost, and you will not receive a refund.\nPress OK to purchase units anyway, or Cancel to change your purchases.",
       "327":"<p style=\"margin-top:5px;margin-bottom:5px;color:#ff0000;\">Air units cannot be moved into this territory as it was captured this turn.",
       "328":"Cancel<br>the<br>Game",
       "329":"You have transports in the following sea zones loaded with units not assigned for amphibious assault:\n\n%z\n\nPress OK to continue, or Cancel to assign the units for assault.",
       "330":"You have transports in the following sea zones loaded with units not assigned for landing:\n\n%z\n\nPress OK to continue, or Cancel to assign the units for landing.",
       "331":"Open team message",
       "332":"<html><head><title>Team Message</title><style>\n"+
                            "pre {font:%Z}\n"+
                            "</style></head><body style=\"margin:0\">\n"+
                            "<textarea readonly style=\"width:100%;height:100%;background-color:#eeeeee\" >\n"+
                            "%m\n\n\n\n"+
                            "</textarea>\n"+
                            "</body></html>",
       "333":"Call Off Assault",
       "334":"Called off assault in <font color=\"%t\">%T</font>.",
       "335":"<font color=\"%S\"><font color=\"%f\">%p fighter</font> in %s has no aircraft carrier and must land in <font color=\"%t\">%T</font>.</font>",
       "336":"<font color=\"%S\"><font color=\"%f\">%p fighter</font> in %s has no aircraft carrier or island to land on, and is lost at sea.</font>",
       "337":"<p style=\"margin-top:5px;margin-bottom:5px;margin-bottom:0px\">The Axis win by economic victory if their combined N.P.L.<br>(currently %a) is at or above %e at the end of a round (all 5<br>powers have had a turn).</p>",
       "338":"<p style=\"margin-top:5px;margin-bottom:5px;margin-bottom:0px\">Economic victory for the Axis has been disabled in this game.<br>The Axis can win only by capturing at least 2 Allied capitals.</p>",
       "339":"Order By Cost",
       "340":"%aGame log at your last move</a>",
       "341":"%aGame log</a>",
       "342":"%aSpectator URL</a>",
       "343":"No combat moves for U.S.S.R. first round.",
       "344":"U.S.S.R. can make combat moves first round.",
       "345":"No economic victory allowed for the Axis.",
       "346":"Economic victory allowed for the Axis. Game ends if combined Axis N.P.L. reaches or exceeds 84 at end of round.",
       "347":"Axis weapons development benefits. Germany starts the game with Jet Power and Japan with Super Subs.",
       "348":"No Axis weapons development benefits.",
       "349":"Surface ships are prohibited from passing through certain straits unless both sides are controlled. There are three straits: Gibraltar - Algeria, W. Europe - Sweden, and Turkey, which controls access to the North Mediterranean Sea Zone. While neutral, Sweden allows both sides access to its straits, meaning when Sweden is neutral then the straits are accessible to whomever holds W. Europe. While neutral, Turkey forbids access through its straits. Hence, to access the Northern Mediterranean Sea Zone with surface ships you must invade Turkey.",
       "350":"Surface ships may move freely through straits.",
       "351":"No new factories may be constructed.",
       "352":"Infantry defend at 1 (instead of 2).",
       "353":"No combat moves for U.S.S.R. until attacked.",
       logSize:new Foundation.Point(952,754),
       logMovesAreaSize:200,
       oddsDialogSize:new Foundation.Point(500,612),
       faqDialogSize:new Foundation.Point(500,612),
       unitSheetDialogSize:new Foundation.Point(580,480),
       teamMessageDialogSize:new Foundation.Point(580,680)
    }
;
GamesByEmail.WW2Game.getTypePath=GamesByEmail.Game.getTypePath;
GamesByEmail.WW2Game.resource=GamesByEmail.Game.resource;
GamesByEmail.WW2Game.resourceUrl=GamesByEmail.Game.resourceUrl;
GamesByEmail.WW2Game.getById=GamesByEmail.Game.getById;
GamesByEmail.WW2Game.getFirst=GamesByEmail.Game.getFirst;
GamesByEmail.WW2Game.getNext=GamesByEmail.Game.getNext;
GamesByEmail.WW2Game.processHtml=GamesByEmail.Game.processHtml;
GamesByEmail.WW2Game.isInstanceOf=GamesByEmail.Game.isInstanceOf;
GamesByEmail.WW2Game.addToPage=GamesByEmail.Game.addToPage;
GamesByEmail.WW2Game.folder=GamesByEmail.Game.folder;
GamesByEmail.WW2Game.$constructor();

GamesByEmail.WW2Log=function(game)
{
   this.game=game;
   this.mode=0;
   this.logs=new Array();
};
GamesByEmail.WW2Log.$parentClass=null;
GamesByEmail.WW2Log.$constructor=function(){};
GamesByEmail.WW2Log.$interfaces=new Array();
GamesByEmail.WW2Log.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Log);
GamesByEmail.WW2Log.$name="WW2Log";
GamesByEmail.WW2Log.$childClasses=new Array();
GamesByEmail.WW2Log.$container=GamesByEmail;
GamesByEmail.WW2Log.prototype={
   constructor:GamesByEmail.WW2Log,
   recordExtended:function(movePhase,team,arguments)
   {
      var args=new Array(arguments.length+1);
      args[0]=arguments[0];
      args[1]=team.powerIndex;
      for (var i=1;i<arguments.length;i++)
         args[i+1]=arguments[i];
      if (this.mode==0 || !this.logs[movePhase])
         this.logs[movePhase]="";
      this.logs[movePhase]+=this.game.logEntry.apply(this.game,args);
   },
   record:function()
   {
      this.recordExtended(this.game.movePhase,this.game.player.team,arguments);
   },
   recordPhase:function()
   {
      var args=new Array(arguments.length-1);
      for (var i=1;i<arguments.length;i++)
         args[i-1]=arguments[i];
      this.recordExtended(arguments[0],this.game.player.team,args);
   },
   clear:function()
   {
      this.clearPhase(this.game.movePhase);
   },
   clearPhase:function(movePhase)
   {
      this.logs[movePhase]="";
   },
   getMoves:function()
   {
      var value="";
      for (var i=0;i<this.logs.length;i++)
         if (this.logs[i] && this.logs[i].length>0)
            value+=this.logs[i];
      this.logs.length=0;
      return value;
   },
   hasEntry:function()
   {
      for (var i=0;i<this.logs.length;i++)
         if (this.logs[i] && this.logs[i].length>0)
            return true;
      return false;
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Log.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Log.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Log.$constructor();

GamesByEmail.WW2Pieces=function(territory)
{
   this.length=0;
   this.territory=territory;
   this.div=null;
   this.needUpdate=false;
   this.trackHtmlCache=null;
};
GamesByEmail.WW2Pieces.$parentClass=null;
GamesByEmail.WW2Pieces.$constructor=function(){};
GamesByEmail.WW2Pieces.$interfaces=new Array();
GamesByEmail.WW2Pieces.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Pieces);
GamesByEmail.WW2Pieces.$name="WW2Pieces";
GamesByEmail.WW2Pieces.$childClasses=new Array();
GamesByEmail.WW2Pieces.$container=GamesByEmail;
GamesByEmail.WW2Pieces.prototype={
   constructor:GamesByEmail.WW2Pieces,
   getString:function()
   {
      var string="";
      for (var i=0;i<this.length;i++)
         string+=this[i].getString();
      return string;
   },
   setString:function(piecesString)
   {
      var p;
      for (var i=0;i<piecesString.length;i++)
      {
         p=this[this.length]=new GamesByEmail.WW2Piece(this,this.length,piecesString.charAt(i));
         this.length++;
         i+=p.setAttributes(piecesString.substr(i+1));
         if (p.unit==7)
         {
            for (i++;i<piecesString.length && GamesByEmail.WW2Piece.isTransportable(piecesString.charAt(i));i++)
               i+=(p.carry[p.carry.length]=new GamesByEmail.WW2Piece(this,this.length-1,piecesString.charAt(i))).setAttributes(piecesString.substr(i+1));
            i--;
         }
      }
   },
   appendHtml:function(htmlBuilder)
   {
      htmlBuilder.append("<div id=\""+this.territory.game.elementId("piecesDiv_"+this.territory.index)+"\" style=\"position:absolute;left:0;top:0;width:1;height:1;z-index:500\"></div>");
      return htmlBuilder;
   },
   newUnit:function(unitChar)
   {
      this.needUpdate=true;
      var p=this[this.length]=new GamesByEmail.WW2Piece(this,this.length,unitChar);
      this.length++;
      return p;
   },
   createPiece:function(index,unitChar)
   {
      return new GamesByEmail.WW2Piece(this,index,unitChar);
   },
   addPiece:function(piece)
   {
      this.needUpdate=true;
      piece.pieces=this;
      piece.index=this.length;
      this[piece.index]=piece;
      this.length++;
      if (piece.unit==7)
         for (var i=0;i<piece.carry.length;i++)
         {
            piece.carry[i].pieces=this;
            piece.carry[i].index=piece.index;
         }
      return piece;
   },
   removePiece:function(piece)
   {
      this.needUpdate=true;
      for (var i=piece.index+1;i<this.length;i++)
      {
         this[i].index--;
         this[i-1]=this[i];
      }
      this[this.length-1]=null;
      this.length--;
      piece.pieces=null;
      piece.index=-1;
      return piece;
   },
   unitPowerList:function(holdingPower)
   {
      var powers=new Array();
      powers[0]=holdingPower;
      for (var i=0;i<this.length;i++)
      {
         var addPower=true;
         var p=this[i];
         for (var j=0;j<powers.length && addPower;j++)
            if (p.owner==powers[j])
               addPower=false;
         if (addPower)
            powers[powers.length]=p.owner;
         while (i<this.length-1 && this[i+1].owner==p.owner)
            i++;
      }
      return powers;
   },
   updateBoard:function(holdingPower)
   {
      var html="";
      var powerList=this.unitPowerList(holdingPower);
      if (this.div==null)
         this.div=this.territory.game.getElement("piecesDiv_"+this.territory.index);
      html+=this.unitBoardHtml(9,powerList);
      html+=this.unitBoardHtml(0,powerList);
      html+=this.unitBoardHtml(1,powerList);
      html+=this.unitBoardHtml(2,powerList);
      html+=this.unitBoardHtml(3,powerList);
      html+=this.unitBoardHtml(5,powerList);
      html+=this.unitBoardHtml(6,powerList);
      html+=this.unitBoardHtml(7,powerList);
      html+=this.unitBoardHtml(8,powerList);
      html+=this.unitBoardHtml(4,powerList);
      this.territory.game.setInnerHtml(this.div,html);
      this.needUpdate=false;
      this.trackHtmlCache=null;
   },
   unitBoardHtml:function(unit,powerList)
   {
      var html="";
      var m=GamesByEmail.WW2Piece.getMusterIndex(unit);
      var muster=this.territory.musters[m];
      if (muster)
      {
         muster=new Foundation.Point(muster);
         var musterOffset=this.territory.musters[m+"_"];
         for (var i=0;i<powerList.length;i++)
         {
            var power=powerList[i];
            for (var j=0;j<this.length;j++)
            {
               var piece=this[j];
               if (piece.unit==unit &&
                   piece.owner==power)
               {
                  var rect=piece.getRectangle();
                  html="<img src=\""+this.territory.game.getPieceSrc()+"\" style=\""+GamesByEmail.positionImage(null,muster,rect)+";z-index:500\">"+html;
                  if (musterOffset)
                  {
                     muster.add(musterOffset);
                     break;
                  }
                  else
                     return html;
               }
            }
         }
      }
      return html;
   },
   trackHtml:function()
   {
      if (!this.trackHtmlCache)
      {
         this.trackHtmlCache="";
         this.trackHtmlCache+="<table cellspacing=1 cellpadding=0 style=\"font:1px verdana\"><tr>";
         this.trackHtmlCache+="<td style=\"height:"+this.territory.game.board.maxPieceSize.y+"\">&nbsp;</td>";
         var trackCounter={count:0};
         for (var i=0;i<GamesByEmail.WW2Piece.unitTrackOrder.length;i++)
            this.trackHtmlCache+=this.unitTrackHtml(GamesByEmail.WW2Piece.unitTrackOrder[i],trackCounter);
         this.trackHtmlCache+="</tr></table>";
      }
      return this.trackHtmlCache;
   },
   unitTypeCount:function(unit)
   {
      var num=0;
      for (var i=0;i<this.length;i++)
         if (this[i].unit==unit)
            num++;
      return num;
   },
   unitTrackHtml:function(unit,trackCounter)
   {
      var html="";
      var numThreshold=6;
      var num=this.unitTypeCount(unit);
      if (num>0)
      {
         if (trackCounter.count>0 && num>=numThreshold)
         {
            html+="</tr></table>";
            html+="<table cellspacing=1 cellpadding=0 style=\"font:1px verdana\"><tr>";
            trackCounter.count=0;
         }
         var first=true;
         for (var i=0;i<this.length;i++)
            if (this[i].unit==unit)
            {
               if (trackCounter.count>0 && (trackCounter.count%this.territory.game.board.territoryPieceMod)==0)
               {
                  html+="</tr></table>";
                  html+="<table cellspacing=1 cellpadding=0 style=\"font:1px verdana\"><tr>";
               }
               if (first && num>=numThreshold)
               {
                  html+="<td valign=bottom style=\"font:10px verdana\">"+num+":</td>";
                  first=false;
               }
               html+="<td valign=bottom>"+this[i].getHtml()+"</td>";
               trackCounter.count++;
            }
         if (num>=numThreshold)
            trackCounter.count=this.territory.game.board.territoryPieceMod;
      }
      return html;
   },
   findByUnitTeamMoved:function(unit,team,moved,numSpacesMoved,transport)
   {
      for (var i=this.length-1;i>=0;i--)
         if (this[i].unit==unit && this[i].owner==team && !this[i].usedInBattle && this[i].moved==moved && this[i].numSpacesMoved==numSpacesMoved &&
             (!transport ||
              (this[i].unit==7 &&
               transport.isCarryingSameLoad(this[i]))))
            return this[i];
      return null;
   },
   findByUnitTeamUnlanded:function(unit,team,unlanded)
   {
      for (var i=this.length-1;i>=0;i--)
         if (this[i].unit==unit && this[i].owner==team && this[i].unlanded==unlanded)
            return this[i];
      return null;
   },
   getBattleBoardDetails:function(roll,attacking,rolls,rollsConsumed,selectHits,allowUnlanded,firstStrike)
   {
      var bbd={html:"",count:0,subStart:-1,subCount:0,numHit:0,numSubsHit:0,units:"",oneTimeShots:0};
      var bbud;
      for (var i=0;i<GamesByEmail.WW2Piece.unitTrackOrder.length;i++)
         if (GamesByEmail.WW2Piece.unitTrackOrder[i]!=4)
         {
            bbud=this.getBattleBoardUnitDetails(GamesByEmail.WW2Piece.unitTrackOrder[i],roll,attacking,rolls,selectHits,bbd.count);
            bbd.html+=bbud.html;
            if (GamesByEmail.WW2Piece.unitTrackOrder[i]==8)
            {
               bbd.subStart=bbd.count;
               bbd.subCount=bbud.count;
            }
            bbd.count+=bbud.count;
            bbd.numHit+=bbud.numHit;
            bbd.numSubsHit+=bbud.numSubsHit;
            bbd.units+=bbud.units;
            bbd.oneTimeShots+=bbud.oneTimeShots;
         }
      if (attacking)
      {
         bbud=this.territory.getBattleBoardAmphibAssaultDetails(roll,allowUnlanded,bbd.count);
         bbd.html+=bbud.html;
         bbd.count+=bbud.count;
         bbd.units+=bbud.units;
         bbd.oneTimeShots+=bbud.oneTimeShots;
      }
      if (bbd.count==0)
         bbd.html="&nbsp;";
      else
         if (roll>0)
         {
            bbd.html+="<br>"+this.territory.game.resource(96,'r',bbd.count);
            if (rolls)
            {
               bbd.html+="<br>";
               for (var i=0;i<bbd.count;i++)
               {
                  if (i>0 && (i%this.territory.game.board.battleBoardPieceMod)==0)
                     bbd.html+="<br>";
                  if (firstStrike && bbd.numHit>0)
                  {
                     rolls[rollsConsumed+i]=7;
                     bbd.numHit--;
                  }
                  else if (firstStrike && bbd.numSubsHit>0)
                  {
                     rolls[rollsConsumed+i]=8;
                     bbd.numSubsHit--;
                  }
                  bbd.html+=this.territory.game.dieHtml(rolls[rollsConsumed+i]<=roll,rolls[rollsConsumed+i]);
               }
            }
         }
      return bbd;
   },
   getBattleBoardUnitDetails:function(unit,roll,attacking,rolls,selectHits,currentCount)
   {
      var bbud={html:"",count:0,numHit:0,numSubsHit:0,units:"",oneTimeShots:0};
      var game=this.territory.game;
      var attackingPower=(game.isLog ? game.move.player.team : game.player.team);
      for (var i=0;i<this.length;i++)
      {
         var piece=this[i];
         if (piece.unit==unit &&
             attacking==piece.isFriendly(attackingPower) &&
             !piece.strategicBombingRaid &&
             piece.capabilities[attacking ? "attack" : "defend"]==roll)
         {
            if (currentCount>0 && (currentCount%game.board.battleBoardPieceMod)==0)
               bbud.html+="<br>";
            bbud.units+=piece.getPieceString();
            if (piece.hit)
               if (piece.unit==8)
                  bbud.numSubsHit++;
               else
                  bbud.numHit++;
            if (selectHits && attacking)
               bbud.html+=game.getAnchorHtml(game.resource(105),"hitPiece_"+piece.index,game.event("hitPieceAtIndex("+this.territory.index+","+piece.index+")"))+piece.getHtml()+"</a>";
            else
               bbud.html+=piece.getHtml();
            bbud.count+=(attacking ? piece.capabilities.numAttack : 1);
            currentCount++;
         }
      }
      return bbud;
   },
   getBattleBoardAmphibAssaultDetails:function(territory,roll,allowUnlanded,currentCount)
   {
      var bbaaad={html:"",count:0,units:"",oneTimeShots:0};
      for (var i=0;i<this.length;i++)
      {
         var piece=this[i];
         if (allowUnlanded && piece.unit==7)
         {
            for (var j=0;j<piece.carry.length;j++)
               if (piece.carry[j].amphibiousAssault==territory &&
                   piece.carry[j].capabilities.attack==roll)
               {
                  if (currentCount>0 && (currentCount%this.territory.game.board.battleBoardPieceMod)==0)
                     bbaaad.html+="<br>";
                  bbaaad.html+=piece.carry[j].getHtml();
                  bbaaad.count++;
                  bbaaad.units+=piece.carry[j].getPieceString();
                  currentCount++;
               }
         }
         else
            if (piece.amphibiousAssault==territory &&
                piece.capabilities.attack==roll)
            {
               if (currentCount>0 && (currentCount%this.territory.game.board.battleBoardPieceMod)==0)
                  bbaaad.html+="<br>";
               bbaaad.html+=piece.getHtml();
               bbaaad.count++;
               bbaaad.units+=piece.getPieceString();
               bbaaad.oneTimeShots++;
               currentCount++;
            }
      }
      return bbaaad;
   },
   amphibiousAssaultCount:function(territory)
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         count+=this[i].amphibiousAssaultCount(territory);
      return count;
   },
   antiaircraftFireCount:function()
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         count+=this[i].aaGunFlyover;
      return count;
   },
   antiaircraftFireLog:function(rolls)
   {
      var log="";
      var rollNum=0;
      for (var i=0;i<this.length;i++)
         if (this[i].aaGunFlyover>0)
         {
            log+=this[i].getPieceString()+this[i].aaGunFlyover;
            for (var j=0;j<this[i].aaGunFlyover;j++)
               log+=rolls[rollNum++];
         }
      return log;
   },
   shotDownSomePlanesHtml:function(rolls)
   {
      var html="";
      html+="<table cellspacing=0 cellpadding=0>";
      var hitThreshold=this.territory.game.player.team.units.antiaircraftGun.defend;
      var rollsConsumed=0;
      var bottomRowHtml="<tr>";
      for (var i=0;i<this.length;i++)
      {
         var piece=this[i];
         if (piece.aaGunFlyover>0)
         {
            bottomRowHtml+="<td align=center valign=top style=\"padding-left:2px;padding-right:2px\">";
            for (var j=0;j<piece.aaGunFlyover;j++)
            {
               var hit=(rolls[rollsConsumed]<=hitThreshold);
               if (j>0)
                  bottomRowHtml+="<br>";
               bottomRowHtml+=this.territory.game.dieHtml(hit,rolls[rollsConsumed]);
               piece.hit|=hit;
               rollsConsumed++;
            }
            bottomRowHtml+="</td>";
         }
      }
      bottomRowHtml+="</tr>";
      html+="<tr>";
      for (var i=0;i<this.length;i++)
         if (this[i].aaGunFlyover>0)
         {
            html+="<td align=center valign=bottom style=\"padding-left:2px;padding-right:2px\">"+this[i].getHtml()+"</td>";
            this[i].aaGunFlyover=0;
         }
      html+="</tr>";
      html+=bottomRowHtml;
      html+="</table>";
      return html;
   },
   getStrategicBombingRaidInfo:function()
   {
      var info={planes:0,bombs:0};
      for (var i=0;i<this.length;i++)
         if (this[i].strategicBombingRaid && !this[i].usedInBattle)
         {
            info.planes++;
            info.bombs+=this[i].owner.units.bomber.numAttack;
         }
      return info;
   },
   droppedSomeBombsHtml:function(rolls)
   {
      var html="";
      html+="<table cellspacing=0 cellpadding=0><tr>";
      for (var i=0;i<this.length;i++)
         if (this[i].strategicBombingRaid)
            html+="<td align=center valign=bottom style=\"padding-left:2px;padding-right:2px\">"+this[i].getHtml()+"</td>";
      html+="</tr><tr>";
      var rollsConsumed=0;
      for (var i=0;i<this.length;i++)
      {
         var piece=this[i];
         if (piece.strategicBombingRaid)
         {
            html+="<td align=center valign=top style=\"padding-left:2px;padding-right:2px\">";
            for (var j=0;j<piece.owner.units.bomber.numAttack;j++)
            {
               if (j>0)
                  html+="<br>";
               html+=this.territory.game.dieHtml(true,rolls[rollsConsumed++]);
            }
            html+="</td>";
            piece.usedInBattle=true;
         }
      }
      html+="</tr></table>";
      return html;
   },
   staticafyAmphibiousAssaultVessels:function(territory)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].amphibiousAssault==territory)
         {
            this[i].amphibiousAssault=null;
            this[i].usedInBattle=true;
            this[i].numSpacesMoved=1000;
         }
   },
   clearUnlandedAmphibiousUnits:function(territory)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].unit==7)
            for (var j=0;j<this[i].carry.length;j++)
               if (this[i].carry[j].amphibiousAssault==territory)
                  this[i].carry[j].amphibiousAssault=null;
   },
   clearHits:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].hit=false;
   },
   hitDefenders:function(numberOfHits,seaUnitsOnly)
   {
      var defenderPower=this.territory.game.player.team.team.opposingTeam.teams[0];
      for (var i=this.length-1;i>=0 && numberOfHits>0;i--)
         if (!this[i].hit &&
             this[i].isCombat() &&
             this[i].isFriendly(defenderPower) &&
             (!seaUnitsOnly || this[i].isSeaUnit()))
         {
            this[i].hit=true;
            numberOfHits--;
         }
   },
   hitAllAttackers:function()
   {
      var attackingPower=this.territory.game.player.team;
      for (var i=this.length-1;i>=0;i--)
         if (!this[i].hit &&
             this[i].isCombat() &&
             this[i].isFriendly(attackingPower) &&
             !this[i].strategicBombingRaid)
            this[i].hit=true;
   },
   attackingSeaUnitCount:function()
   {
      var numSeaUnits=0;
      var attackingPower=this.territory.game.player.team;
      for (var i=0;i<this.length;i++)
         if (this[i].isFriendly(attackingPower) &&
             this[i].isSeaUnit())
            numSeaUnits++;
      return numSeaUnits;
   },
   allAttackersHit:function(numUnitsHit,numSeaUnitsHit)
   {
      var numUnits=0,numSeaUnits=0;
      var attackingPower=this.territory.game.player.team;
      for (var i=0;i<this.length;i++)
         if (this[i].isFriendly(attackingPower) &&
             !this[i].strategicBombingRaid)
            if (this[i].isSeaUnit())
               numSeaUnits++;
            else
               numUnits++;
      if (numSeaUnitsHit<numSeaUnits)
         numUnits+=numSeaUnits-numSeaUnitsHit;
      return (numUnits<=numUnitsHit);
   },
   attackerHitsRemaining:function(numUnitsHit,numSeaUnitsHit)
   {
      var hits={units:numUnitsHit,seaUnits:numSeaUnitsHit};
      var attackingPower=this.territory.game.player.team;
      for (var i=0;i<this.length;i++)
         if (this[i].hit &&
             this[i].isFriendly(attackingPower))
            if (hits.seaUnits>0 && this[i].isSeaUnit())
               hits.seaUnits--;
            else
               hits.units--;
      return hits;
   },
   tradeHitWithLesserRangeUnhitUnit:function(piece)
   {
      if ((piece.unit==2 ||
           piece.unit==3) &&
          !piece.strategicBombingRaid)
         for (var i=0;i<this.length;i++)
         {
            var p=this[i];
            if (!p.hit &&
                p.unit==piece.unit &&
                p.owner==piece.owner &&
                p.numSpacesMoved>piece.numSpacesMoved &&
                !p.strategicBombingRaid)
            {
               piece.hit=false;
               piece=p;
               piece.hit=true;
            }
         }
      return piece;
   },
   removeHit:function(friendly)
   {
      var piecesHit="";
      var hitCount=0;
      for (var i=this.length-1;i>=0;i--)
         if (this[i].hit && this[i].isFriendly()==friendly)
            piecesHit+=this.removePiece(this.tradeHitWithLesserRangeUnhitUnit(this[i])).getPieceString();
      if (piecesHit.length>0)
         this.updateBoard();
      return piecesHit;
   },
   shoreBombardmentAvailable:function(power,unit)
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         if (this[i].unit==unit &&
             this[i].owner==power &&
             !this[i].usedInBattle &&
             !this[i].amphibiousAssault)
            count++;
      return count;
   },
   shoreBombardmentParticipating:function(power,unit,territory)
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         if (this[i].unit==unit &&
             this[i].owner==power &&
             !this[i].usedInBattle &&
             this[i].amphibiousAssault==territory)
            count++;
      return count;
   },
   setShoreBombardment:function(territory,power,unit,count)
   {
      for (var i=0;i<this.length && count>0;i++)
         if (this[i].owner==power &&
             this[i].unit==unit &&
             !this[i].amphibiousAssault)
         {
            this[i].amphibiousAssault=territory;
            count--;
         }
   },
   cancelShoreBombardment:function(power,unit,count)
   {
      for (var i=this.length-1;i>=0 && count>0;i--)
         if (this[i].owner==power &&
             this[i].unit==unit &&
             this[i].amphibiousAssault==territory)
         {
            this[i].amphibiousAssault=null;
            count--;
         }
   },
   retreatRange:function()
   {
      var range=-1;
      for (var i=0;i<this.length && range!=1;i++)
         if (this[i].isOurs())
         {
            var R=this[i].retreatRange();
            if (range<0 || R<range)
               range=R;
         }
      return range;
   },
   canRetreatToTerritory:function(territory)
   {
      var numFighters=0,numAirUnits=0,numLandUnits=0,numSeaUnits=0,numUnits=0;
      for (var i=0;i<this.length;i++)
         if (this[i].isOurs())
         {
            if (this[i].unit==2)
               numFighters++;
            if (this[i].isAirUnit())
               numAirUnits++;
            if (this[i].isLandUnit())
               numLandUnits++;
            if (this[i].isSeaUnit())
               numSeaUnits++;
            numUnits++;
         }
      if (territory.isLand() && numSeaUnits>0)
         return false;
      if (territory.isSeaZone() && (numLandUnits>0 || numAirUnits!=numFighters))
         return false;
      if (territory.conqueredThisTurn && numAirUnits>0)
         return false;
      if (territory.isSeaZone() && territory.pieces.availableCarrierSpace()<numFighters)
         return false;
      return true;
   },
   hasSeaUnits:function(friendly)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].isFriendly()==friendly &&
             this[i].isSeaUnit())
            return true;
      return false;
   },
   availableCarrierSpace:function()
   {
      var carrierCount=0,fighterCount=0;
      for (var i=0;i<this.length;i++)
      {
         var piece=this[i];
         if (piece.isFriendly())
            if (piece.unit==6)
               carrierCount++;
            else
               if (piece.unit==2 &&
                   !piece.unlanded)
                  fighterCount++;
      }
      return carrierCount*2-fighterCount;
   },
   retreatTo:function(territory)
   {
      var pieces="";
      for (var i=this.length-1;i>=0;i--)
         if (this[i].isOurs())
         {
            var unit=this[i];
            pieces+=unit.getPieceString();
            unit.usedInBattle=true;
            unit.amphibiousAssault=null;
            if (unit==7)
               for (var j=0;j<unit.carry.length;j++)
                  unit.carry[j].amphibiousAssault=null;
            unit.moveTo(territory);
         }
      this.territory.territories.updateAmphibiousAssault();
      this.updateBoard();
      territory.pieces.updateBoard();
      return pieces;
   },
   unlandedAircraftCount:function()
   {
      var count=0;
      for (var i=this.length-1;i>=0;i--)
         if (this[i].unlanded)
            count++;
      return count;
   },
   teamHasPlayableCombatUnits:function(team)
   {
      for (var i=0;i<this.length;i++)
      {
         var t=this[i];
         if (t.isOurs(team) &&
              t.isCombat())
         {
            var isStuck=false;
            if (t.isLandUnit() && this.territory.isSeaLocked())
               isStuck=true;
            if (t.isSeaUnit() && this.territory.isLandLocked)
               isStuck=true;
            if (!isStuck)
               return true;
         }
         if (t.unit==7)
            for (var j=0;j<t.carry.length;j++)
               if (t.carry[j].isOurs(team))
                  return true;
      }
      return false;
   },
   hasOneOfOurCombatUnits:function(power)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].isOurs(power) &&
             this[i].isCombat())
            return true;
      return false;
   },
   hasMoreThanOneTypeOfCombatUnit:function()
   {
      var piece=null;
      for (var i=this.length-1;i>=0;i--)
         if (this[i].isCombat())
            if (piece==null)
               piece=this[i];
            else
            {
               var p=this[i];
               if (p.unit!=piece.unit ||
                   p.owner!=piece.owner ||
                   (p.unit==7 &&
                    !p.isCarryingSameLoad(piece)))
                  return true;
            }
      return false;
   },
   moveUnitTowardFront:function(higherFromIndex,lowerToIndex)
   {
      var t=this[higherFromIndex];
      for (var i=higherFromIndex;i>lowerToIndex;i--)
         (this[i]=this[i-1]).index=i;
      (this[lowerToIndex]=t).index=lowerToIndex;
   },
   orderCombatUnitsByCost:function()
   {
      var dirty=false;
      for (var i=0;i<this.length;i++)
      {
         var pi=this[i];
         if (pi.weControl() && pi.isCombat())
         {
            var ci=pi.totalCost();
            var lowest=i;
            for (var j=i-1;j>=0;j--)
               if (this[j].isCombat() && ci>this[j].totalCost())
                  lowest=j;
            if (lowest<i)
            {
               this.moveUnitTowardFront(i,lowest);
               dirty=true;
            }
         }
      }
      if (dirty)
         this.updateBoard();
      return dirty;
   },
   moveNonCombatToFront:function()
   {
      var target=0;
      for (var i=0;i<this.length;i++)
         if (!this[i].isCombat())
         {
            if (target<i)
               this.moveUnitTowardFront(i,target);
            target++;
         }
   },
   setDefenseOrderHtml:function()
   {
      var html="";
      this.defenseOrderPiece=null;
      var game=this.territory.game;
      var eventBase=game.event("territories["+this.territory.index+"].pieces.");
      html+="<div id=\""+game.elementId("defenseOrder")+"\" onmousedown=\""+eventBase+"defenseOrderOnMouseDown(event);\" onmouseup=\""+eventBase+"defenseOrderOnMouseUp(event);\" onmousemove=\""+eventBase+"defenseOrderOnMouseMove(event);\">";
      for (var i=0;i<this.length;i++)
         if (this[i].isCombat())
            html+=this[i].setDefenseOrderHtml();
      html+="</div>";
      return html;
   },
   defenseOrderOnMouseDown:function(event)
   {
      if (event.preventDefault)
         event.preventDefault();
      var game=this.territory.game;
      var pieceIndex=this.defenseOrderIndexSpanFromEvent(event);
      if (pieceIndex>=0)
      {
         this.defenseOrderPiece=this[pieceIndex];
         if (this.defenseOrderPiece && this.defenseOrderPiece.weControl())
         {
            var span=game.getElement("defenseOrder");
            if (span.setCapture)
               span.setCapture();
         }
         else
            this.defenseOrderPiece=null;
      }
   },
   defenseOrderIndexSpanFromEvent:function(event)
   {
      var e=(event.srcElement ? event.srcElement : event.target);
      while (e && !e.id)
         e=e.parentNode;
      var baseId=this.territory.game.elementId("defenseOrder_");
      if (e.id.length>baseId.length &&
          e.id.substr(0,baseId.length)==baseId)
         return parseInt(e.id.substr(baseId.length));;
      return -1;
   },
   defenseOrderOnMouseMove:function(event)
   {
      var newIndex;
      if (this.defenseOrderPiece &&
          (newIndex=this.defenseOrderIndexSpanFromEvent(event))>=0 &&
          newIndex!=this.defenseOrderPiece.index)
         this.moveDefenseOrder(this.defenseOrderPiece,newIndex);
   },
   moveDefenseOrder:function(piece,newIndex)
   {
      var span=this.territory.game.getElement("defenseOrder_"+this.defenseOrderPiece.index);
      var origHtml=span.innerHTML;
      var origPadding=span.style.paddingTop;
      if (this.defenseOrderPiece.index<newIndex)
         for (var i=this.defenseOrderPiece.index;i<newIndex;i++)
         {
            this[i]=this[i+1];
            this[i].index=i;
            var ea=this.territory.game.getElement("defenseOrder_"+i);
            var eb=this.territory.game.getElement("defenseOrder_"+(i+1));
            ea.innerHTML=eb.innerHTML;
            ea.style.paddingTop=eb.style.paddingTop;
         }
      else
         for (var i=this.defenseOrderPiece.index;i>newIndex;i--)
         {
            this[i]=this[i-1];
            this[i].index=i;
            var ea=this.territory.game.getElement("defenseOrder_"+i);
            var eb=this.territory.game.getElement("defenseOrder_"+(i-1));
            ea.innerHTML=eb.innerHTML;
            ea.style.paddingTop=eb.style.paddingTop;
         }
      this[newIndex]=this.defenseOrderPiece;
      this.defenseOrderPiece.index=newIndex;
      var span=this.territory.game.getElement("defenseOrder_"+newIndex);
      span.innerHTML=origHtml;
      span.style.paddingTop=origPadding;
      this.territory.updateOrderStuff();
      this.updateBoard();
   },
   defenseOrderOnMouseUp:function(event)
   {
      if (this.defenseOrderPiece)
      {
         var span=this.territory.game.getElement("defenseOrder");
         if (span.releaseCapture)
            span.releaseCapture();
         this.defenseOrderPiece=null;
      }
   },
   setUsedInBattleThisTurn:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].usedInBattle=true;
   },
   clearForNextTurn:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].clearForNextTurn();
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Pieces.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Pieces.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Pieces.$constructor();

GamesByEmail.WW2Piece=function(pieces,index,pieceChar)
{
   this.pieces=pieces;
   this.index=index;
   this.unit=-1;
   if (pieceChar)
   {
      this.setByChar(pieceChar);
      this.setAttributes(pieceChar.substr(1));
   }
   else
      this.clearAttributes();
};
GamesByEmail.WW2Piece.$parentClass=null;
GamesByEmail.WW2Piece.$constructor=function(){};
GamesByEmail.WW2Piece.$interfaces=new Array();
GamesByEmail.WW2Piece.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Piece);
GamesByEmail.WW2Piece.$name="WW2Piece";
GamesByEmail.WW2Piece.$childClasses=new Array();
GamesByEmail.WW2Piece.$container=GamesByEmail;
GamesByEmail.WW2Piece.prototype={
   constructor:GamesByEmail.WW2Piece,
   cloneTransport:function()
   {
      var clone=new GamesByEmail.WW2Piece(this.pieces,this.index,this.getString());
      for (var i=0;i<this.carry.length;i++)
         clone.carry[i]=new GamesByEmail.WW2Piece(this.pieces,this.index,this.carry[i].getString());
      clone.original=this;
      return clone;
   },
   setByChar:function(pieceChar)
   {
      if (pieceChar && this.pieces)
      {
         this.setOwner(this.pieces.territory.game.powers[GamesByEmail.WW2Piece.powerIndexFromPieceChar(pieceChar)]);
         this.setUnit(GamesByEmail.WW2Piece.unitFromPieceChar(pieceChar));
      }
   },
   setOwner:function(owner)
   {
      this.owner=owner;
      if (this.owner && this.unit>=0)
         this.capabilities=this.owner.units[this.unit];
   },
   setUnit:function(unit)
   {
      this.unit=unit;
      if (this.owner && this.unit>=0)
         this.capabilities=this.owner.units[this.unit];
      if (this.unit==7 && !this.carry)
         this.carry=new Array();
      else
         this.carry=null;
   },
   clearForNextTurn:function()
   {
      this.clearAttributes();
      if (this.unit==7)
         for (var i=0;i<this.carry.length;i++)
            this.carry[i].clearForNextTurn();
   },
   clearAttributes:function()
   {
      this.moved=false;
      this.numSpacesMoved=0;
      this.amphibiousAssault=null;
      this.justLoaded=false;
      this.unloaded=false;
      this.unlanded=false;
      this.usedInBattle=false;
      this.aaGunFlyover=0;
      this.strategicBombingRaid=false;
      this.hasDamage=false;
   },
   setAttributes:function(attributesString)
   {
      var consumed=0;
      this.clearAttributes();
      if (attributesString.length>0 && attributesString.charAt(0)=="\t")
      {
         consumed++;
         while (attributesString.charAt(consumed)!="\t")
            consumed+=this.setAttribute(attributesString.substr(consumed));
         consumed++;
      }
      return consumed;
   },
   setAttribute:function(attributeString)
   {
      var consumed=1;
      switch (attributeString.charAt(0))
      {
      case 'm' :
         this.moved=true;
         break;
      case 'n' :
         consumed++;
         this.numSpacesMoved=parseInt(attributeString.charAt(1),16);
         break;
      case 'a' :
         consumed+=2;
         this.amphibiousAssault=this.pieces.territory.territories[parseInt(attributeString.substr(1,2),16)];
         break;
      case 'u' :
         this.unloaded=true;
         break;
      case 'U' :
         this.unlanded=true;
         break;
      case 'b' :
         this.usedInBattle=true;
         break;
      case 'g' :
         this.aaGunFlyover++;
         break;
      case 's' :
         this.strategicBombingRaid=true;
         break;
      case 'd' :
         this.hasDamage=true;
         break;
      }
      return consumed;
   },
   getPieceString:function(power,unit)
   {
      return String.fromCharCode(32+this.owner.powerIndex*13+this.unit);
   },
   getString:function()
   {
      var pieceString="";
      pieceString+=this.getPieceString();
      pieceString+=this.getAttributes();
      if (this.unit==7)
         for (var i=0;i<this.carry.length;i++)
            pieceString+=this.carry[i].getString();
      return pieceString;
   },
   getAttributes:function()
   {
      var attributes="";
      if (this.moved)
         attributes+='m';
      if (this.numSpacesMoved>0)
         attributes+='n'+GamesByEmail.getHexString(this.numSpacesMoved);
      if (this.amphibiousAssault!=null)
         attributes+='a'+GamesByEmail.getHexString(this.amphibiousAssault.index,2);
      if (this.unloaded)
         attributes+='u';
      if (this.unlanded)
         attributes+='U';
      if (this.usedInBattle)
         attributes+='b';
      for (var i=0;i<this.aaGunFlyover;i++)
         attributes+='g';
      if (this.strategicBombingRaid)
         attributes+='s';
      if (this.hasDamage)
         attributes+='d';
      return (attributes.length>0 ? "\t"+attributes+"\t" : "");
   },
   getHtml:function(numCarryHide)
   {
      var html=GamesByEmail.clippedImageHtml(this.pieces.territory.game.getPieceSrc(),this.getRectangle(),"margin:1px");
      if (this.unit==7 && this.carry.length>0)
      {
         var max=this.carry.length;
         if (arguments.length>0)
            max-=numCarryHide;
         if (max>0)
         {
            var t=html;
            html="<table cellspacing=0 cellpadding=0 style=\"display:inline\"><tr>";
            for (var i=0;i<max;i++)
               html+="<td nowrap align=center>"+this.carry[i].getHtml()+"</td>";
            html+="</tr><tr><td colspan="+max+" align=center>"+t+"</td></tr></table>";
         }
      }
      if (this.strategicBombingRaid)
      {
         html="<table cellspacing=0 cellpadding=0 style=\"display:inline\"><tr><td nowrap align=center colspan="+this.owner.units.bomber.numAttack+">"+html+"</td></tr><tr>";
         for (var i=0;i<this.owner.units.bomber.numAttack;i++)
            html+="<td nowrap align=center style=\"padding-left:"+(i>0 ? 1 : 0)+"\">"+this.pieces.territory.game.bombHtml(this.owner)+"</td>";
         html+="</tr></table>";
      }
      if (this.hit)
         html="<div style=\"display:inline;border:"+this.pieces.territory.game.resource(106)+"\">"+html+"</div>";
      return html;
   },
   isAirUnit:function()
   {
      return GamesByEmail.WW2Piece.isAirUnit(this.unit);
   },
   isLandUnit:function(noGuns)
   {
      return GamesByEmail.WW2Piece.isLandUnit(this.unit,noGuns);
   },
   isSeaUnit:function()
   {
      return GamesByEmail.WW2Piece.isSeaUnit(this.unit);
   },
   isCarryingSameLoad:function(otherTransport)
   {
      var isSame=(this.carry.length==otherTransport.carry.length);
      for (var i=0;isSame && i<this.carry.length;i++)
         isSame&=(this.carry[i].unit==otherTransport.carry[i].unit && this.carry[i].owner==otherTransport.carry[i].owner);
      return isSame;
   },
   canCarryMore:function()
   {
      return (this.carry.length==0 ||
              (this.carry.length==1 && this.carry[0].unit==0));
   },
   totalCost:function()
   {
      var cost=this.owner.units[this.unit].cost;
      if (this.unit==7)
         for (var i=0;i<this.carry.length;i++)
            cost+=this.carry[i].totalCost();
      return cost;
   },
   transportLoadPiece:function(piece,remove)
   {
      var oldPieces=piece.pieces;
      if (remove)
         oldPieces.removePiece(piece);
      this.carry[this.carry.length]=piece;
      piece.justLoaded=true;
      piece.pieces=this.pieces;
      piece.index=this.index;
      if (remove)
         oldPieces.updateBoard();
      piece.pieces.updateBoard();
      return piece;
   },
   transportUnloadPiece:function(index,toTerritory,realUnload)
   {
      var piece=this.carry[index];
      for (var i=index+1;i<this.carry.length;i++)
         this.carry[i-1]=this.carry[i];
      this.carry.length--;
      if (toTerritory)
      {
         toTerritory.pieces.addPiece(piece);
         if (realUnload)
         {
            piece.unloaded=true;
            piece.moved=true;
            piece.numSpacesMoved=1;
            piece.transport=this;
         }
         else
            piece.justLoaded=false;
         toTerritory.pieces.updateBoard();
      }
      return piece;
   },
   undoUnload:function(territory)
   {
      if (this.unloaded && this.transport)
      {
         this.transport.transportLoadPiece(this,true);
         this.amphibiousAssault=territory;
         this.unloaded=false;
         this.moved=false;
         this.numSpacesMoved=0;
         this.usedInBattle=false;
         this.transport.usedInBattle=false;
         this.transport=null;
      }
   },
   moveTo:function(territory,updateOld,updateNew)
   {
      var oldTerritory=this.pieces.territory;
      territory.pieces.addPiece(this.pieces.removePiece(this));
      if (updateOld)
         oldTerritory.pieces.updateBoard();
      if (updateNew)
         territory.pieces.updateBoard();
   },
   getRectangle:function()
   {
      if (this.unit==5 && this.hasDamage)
         return this._pieceRects[this.owner.powerIndex]['D'];
      return GamesByEmail.WW2Piece.getRectanglePU(this.owner,this.unit);
   },
   isOurs:function(power)
   {
      return (this.owner.powerIndex==(arguments.length>0 ? power.powerIndex : this.pieces.territory.game.player.team.powerIndex));
   },
   weControl:function()
   {
      return (this.owner.players[0].id!=0 || this.pieces.territory.game.testing);
   },
   isFriendly:function(power)
   {
      return (this.owner.team.powerIndex==(arguments.length>0 ? power.team.powerIndex : this.pieces.territory.game.player.team.team.powerIndex));
   },
   isCombat:function()
   {
      return (this.unit==0 ||
              this.unit==1 ||
              this.unit==2 ||
              this.unit==3 ||
              this.unit==5 ||
              this.unit==6 ||
              this.unit==7 ||
              this.unit==8);
   },
   amphibiousAssaultCount:function(territory)
   {
      var count=0;
      if (this.unit==7)
         for (var i=0;i<this.carry.length;i++)
            if (this.carry[i].amphibiousAssault==territory)
               if (!territory.isFriendly(this.carry[i].owner.team.powerIndex))
                  count++;
               else
                  this.carry[i].amphibiousAssault=null;
      return count;
   },
   unloadAmphibiousAssault:function(territory,count,unloadedUnits)
   {
      var numUnloaded=0;
      for (var i=this.carry.length-1;i>=0 && count>0;i--)
         if (this.carry[i].amphibiousAssault==territory)
         {
            unloadedUnits[unloadedUnits.length]=this.transportUnloadPiece(i,this.carry[i].amphibiousAssault);
            count--;
            numUnloaded++;
            this.usedInBattle=true;
         }
      this.pieces.updateBoard();
      return numUnloaded;
   },
   cancelAmphibiousAssault:function(count,unloadedUnits)
   {
      var numCanceled=0;
      for (var i=unloadedUnits.length-1;i>=0 && count>0;i--)
      {
         this.transportLoadPiece(unloadedUnits[i],true);
         unloadedUnits.length--;
         count--;
         numCanceled++;
      }
      if (unloadedUnits.length==0)
         this.usedInBattle=false;
      return numCanceled;
   },
   retreatRange:function()
   {
      if (this.unit==2)
         return this.owner.units.fighter.movement-this.numSpacesMoved;
      if (this.unit==3)
         return this.owner.units.bomber.movement-this.numSpacesMoved;
      return 1;
   },
   setDefenseOrderHtml:function()
   {
      var html="";
      var r=this.getRectangle();
      html+="<span id=\""+this.pieces.territory.game.elementId("defenseOrder_"+this.index)+"\" style=\"height:18px;padding-top:"+(17-r.height)+"px;padding-left:1px;padding-bottom:1px;padding-right:1px;\">";
      html+=this.getHtml();
      html+="</span>";
      return html;
   },
   getDefenseOrderSpan:function()
   {
      return this.pieces.territory.game.getElement("defenseOrder_"+this.index);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Piece.create=function(power,unit)
   {
      var piece=new this(null,-1,null);
      piece.setOwner(power);
      piece.setUnit(unit);
      return piece;
   };
GamesByEmail.WW2Piece.unitFromPieceChar=function(pieceChar)
   {
      return (pieceChar.charCodeAt(0)-32)%13;
   };
GamesByEmail.WW2Piece.powerIndexFromPieceChar=function(pieceChar)
   {
      return Math.floor((pieceChar.charCodeAt(0)-32)/13);
   };
GamesByEmail.WW2Piece.getRectanglePU=function(power,unit)
   {
      return this.getRectangle(power.powerIndex,unit,power.industrialTechnology,power.longRangeAircraft,power.jetPower,power.heavyBombers,power.rockets,power.superSubmarines);
   };
GamesByEmail.WW2Piece.getRectangle=function(powerIndex,unit,industrialTechnology,longRangeAircraft,jetPower,heavyBombers,rockets,superSubmarines)
   {
      var r=null;
      if (unit==0) r='m';
      if (unit==1) r='a';
      if (unit==2 && longRangeAircraft==false && jetPower==false) r='f';
      if (unit==2 && longRangeAircraft==true && jetPower==false) r='F';
      if (unit==2 && longRangeAircraft==false && jetPower==true) r='j';
      if (unit==2 && longRangeAircraft==true && jetPower==true) r='J';
      if (unit==3 && longRangeAircraft==false && heavyBombers==false) r='b';
      if (unit==3 && longRangeAircraft==true && heavyBombers==false) r='B';
      if (unit==3 && longRangeAircraft==false && heavyBombers==true) r='h';
      if (unit==3 && longRangeAircraft==true && heavyBombers==true) r='H';
      if (unit==4 && rockets==false) r='g';
      if (unit==4 && rockets==true) r='G';
      if (unit==5) r='d';
      if (unit==6) r='c';
      if (unit==7) r='t';
      if (unit==8 && superSubmarines==false) r='s';
      if (unit==8 && superSubmarines==true) r='S';
      if (unit==9 && industrialTechnology==false) r='i';
      if (unit==9 && industrialTechnology==true) r='I';
      return (r==null ? null : this._pieceRects[powerIndex][r]);
   };
GamesByEmail.WW2Piece._pieceRects=GamesByEmail.WW2Game.resource("board").pieceRects;
GamesByEmail.WW2Piece.getTitlePU=function(power,unit)
   {
      return power.units[unit].title;
   };
GamesByEmail.WW2Piece.getImageHtml=function(game,power,unit,noTitle)
   {
      var title="";
      if (!noTitle)
         title=this.getTitlePU(power,unit);
      return GamesByEmail.clippedImageHtml(game.getPieceSrc(),this.getRectanglePU(power,unit),null,"title=\""+title.htmlEncode()+"\"");
   };
GamesByEmail.WW2Piece.getMusterIndex=function(unit)
   {
      if (unit==0) return 'm';
      if (unit==1) return 'a';
      if (unit==2) return 'f';
      if (unit==3) return 'b';
      if (unit==4) return 'g';
      if (unit==5) return 'd';
      if (unit==6) return 'c';
      if (unit==7) return 't';
      if (unit==8) return 's';
      if (unit==9) return 'i';
      return null;
   };
GamesByEmail.WW2Piece.unitFromMusterIndex=function(muster)
   {
      if (muster=='m') return 0;
      if (muster=='a') return 1;
      if (muster=='f') return 2;
      if (muster=='b') return 3;
      if (muster=='g') return 4;
      if (muster=='d') return 5;
      if (muster=='c') return 6;
      if (muster=='t') return 7;
      if (muster=='s') return 8;
      if (muster=='i') return 9;
      return null;
   };
GamesByEmail.WW2Piece.isTransportable=function(pieceChar)
   {
      var unit=this.unitFromPieceChar(pieceChar);
      return (unit==0 ||
              unit==1 ||
              unit==4);
   };
GamesByEmail.WW2Piece.isAirUnit=function(unit)
   {
      return (unit==2 ||
              unit==3);
   };
GamesByEmail.WW2Piece.isLandUnit=function(unit,noGuns)
   {
      return (unit==0 ||
              unit==1 ||
              (!noGuns && unit==4));
   };
GamesByEmail.WW2Piece.isSeaUnit=function(unit)
   {
      return (unit==5 ||
              unit==6 ||
              unit==7 ||
              unit==8);
   };
GamesByEmail.WW2Piece.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Piece.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Piece.$constructor();

GamesByEmail.WW2Moves=function(territory,team,nonCombat)
{
   this.length=0;
   this.toTerritory=territory;
   this.team=team;
   this.nonCombat=nonCombat;
};
GamesByEmail.WW2Moves.$parentClass=null;
GamesByEmail.WW2Moves.$constructor=function(){};
GamesByEmail.WW2Moves.$interfaces=new Array();
GamesByEmail.WW2Moves.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Moves);
GamesByEmail.WW2Moves.$name="WW2Moves";
GamesByEmail.WW2Moves.$childClasses=new Array();
GamesByEmail.WW2Moves.$container=GamesByEmail;
GamesByEmail.WW2Moves.prototype={
   constructor:GamesByEmail.WW2Moves,
   loadAttackMoves:function()
   {
      var territory=this.toTerritory;
      var path=new Array();
      for (var i=0;i<this.length;i++)
      {
         this[i].numAvailable=0;
         this[i].numAttack=0;
      }
      path[0]=territory;
      if (territory.isLand())
         if (territory.isNeutral())
            for (var i=0;i<territory.adjacent.length;i++)
            {
               path[1]=territory.adjacent[i];
               this.loadNeutralAttackMoves(path,true,false);
            }
         else
            if (territory.isFriendly())
            {
               this.loadBlitzMoves(path);
               this.removeNonBlitzMoves();
            }
            else
               for (var i=0;i<territory.adjacent.length;i++)
               {
                  path[1]=territory.adjacent[i];
                  this.loadLandAttackMoves(path,true,false);
               }
      else
         if (territory.isEnemyOccupied())
            for (var i=0;i<territory.adjacent.length;i++)
            {
               path[1]=territory.adjacent[i];
               this.loadSeaAttackMoves(path,true,territory.isCanalTransitBlocked(territory.adjacent[i],this.team.team.powerIndex),territory.isStraitsTransitBlocked(territory.adjacent[i],this.team.team.powerIndex));
            }
         else
         {
            for (var i=0;i<territory.adjacent.length;i++)
            {
               path[1]=territory.adjacent[i];
               this.loadSeaOccupyMoves(path,true,territory.isCanalTransitBlocked(territory.adjacent[i],this.team.team.powerIndex),territory.isStraitsTransitBlocked(territory.adjacent[i],this.team.team.powerIndex));
            }
            path.length=1;
            var transportCounts=territory.transportCounts(this.team.powerIndex,true,true);
            for (var i=0;i<transportCounts.length;i++)
               this.addTransport(transportCounts[i].piece,transportCounts[i].count,path);
         }
      path=null;
      this.removeEmpty();
      this.compress();
      this.sort();
   },
   loadNonCombatMoves:function()
   {
      var territory=this.toTerritory;
      var path=new Array();
      for (var i=0;i<this.length;i++)
      {
         this[i].numAvailable=0;
         this[i].numAttack=0;
      }
      path[0]=territory;
      if (territory.isLand() && territory.isFriendly())
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[1]=territory.adjacent[i];
            this.loadLandNonCombatMoves(path,true,false,!territory.conqueredThisTurn);
         }
      else
         if (territory.isSeaZone() && !territory.isEnemyOccupied())
         {
            for (var i=0;i<territory.adjacent.length;i++)
            {
               path[1]=territory.adjacent[i];
               this.loadSeaNonCombatMoves(path,true,territory.isCanalTransitBlocked(territory.adjacent[i],this.team.team.powerIndex),territory.isStraitsTransitBlocked(territory.adjacent[i],this.team.team.powerIndex));
            }
            path.length=1;
            var transportCounts=territory.transportCounts(this.team.powerIndex,true,true,true);
            for (var i=0;i<transportCounts.length;i++)
               this.addTransport(transportCounts[i].piece,transportCounts[i].count,path);
         }
      path=null;
      this.removeEmpty();
      this.compress();
      this.sort();
   },
   sort:function()
   {
      for (var i=this.length-1;i>=0;i--)
         for (var j=0;j<i;j++)
            if (this[j].attacksAt*this[j].numAttack<this[j+1].attacksAt*this[j+1].numAttack)
            {
               t=this[j];
               (this[j]=this[j+1]).index=j;
               (this[j+1]=t).index=j+1;
            }
      for (var i=0;i<this.length;i++)
         this[i].paths.sort();
   },
   loadNeutralAttackMoves:function(path,landOnly,resistance)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var units=this.team.units;
      for (var i=0;i<movement;i++)
         if (territory==path[i])
            return;
      if (landOnly)
         landOnly&=territory.isLand();
      var count;
      if (landOnly && !resistance &&
          movement<=units.infantry.movement &&
          (count=territory.unitCount(0,this.team.powerIndex,true))>0)
         this.add(0,count,path);
      if (landOnly && !resistance &&
          movement<=units.armor.movement &&
          (count=territory.unitCount(1,this.team.powerIndex,true))>0)
         this.add(1,count,path);
      if (movement==1 && !landOnly)
         this.loadAmphibiousAssaultMoves(path);
      if (movement<units.armor.movement)
      {
         if (!resistance)
            resistance|=territory.isEnemyOccupied();
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[pathLength]=territory.adjacent[i];
            this.loadNeutralAttackMoves(path,landOnly,resistance);
         }
         path.length=pathLength;
      }
   },
   loadLandAttackMoves:function(path,landOnly,resistance)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var units=this.team.units;
      for (var i=0;i<movement;i++)
         if (territory==path[i])
            return;
      if (landOnly)
         landOnly&=territory.isLand();
      var count;
      if (landOnly && !resistance &&
          movement<=units.infantry.movement &&
          (count=territory.unitCount(0,this.team.powerIndex,true))>0)
         this.add(0,count,path);
      if (landOnly && !resistance &&
          movement<=units.armor.movement &&
          (count=territory.unitCount(1,this.team.powerIndex,true))>0)
         this.add(1,count,path);
      if (movement<=(units.fighter.movement-1) &&
          (count=territory.unitCount(2,this.team.powerIndex,true))>0 &&
          !GamesByEmail.WW2Moves.isKamikaze(this.team,path[0],territory,units.fighter.movement-movement,true))
         this.add(2,count,path);
      if ((count=territory.unitCount(3,this.team.powerIndex,true))>0 &&
          !GamesByEmail.WW2Moves.isKamikaze(this.team,path[0],territory,units.bomber.movement-movement,false))
         this.add(3,count,path);
      if (movement==1 && !landOnly)
         this.loadAmphibiousAssaultMoves(path);
      if (movement<units.bomber.movement-1)
      {
         if (!resistance)
            resistance|=territory.isEnemyOccupied();
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[pathLength]=territory.adjacent[i];
            this.loadLandAttackMoves(path,landOnly,resistance);
         }
         path.length=pathLength;
      }
   },
   loadBlitzMoves:function(path)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var count;
      if ((count=territory.unitCount(1,this.team.powerIndex,true))>0)
         this.add(1,count,path);
      if (movement<this.team.units.armor.movement)
      {
         for (var i=0;i<territory.adjacent.length;i++)
            if (territory.isLand() && !territory.isEnemyOccupied())
            {
               path[pathLength]=territory.adjacent[i];
               this.loadBlitzMoves(path);
            }
         path.length=pathLength;
      }
   },
   removeNonBlitzMoves:function()
   {
      for (var i=0;i<this.length;i++)
      {
         var hasBlitzed=false;
         var m=this[i];
         for (var j=0;j<m.paths.length;j++)
         {
            var p=m.paths[j];
            if (p.numBlitzed>0)
               hasBlitzed=true;
            else
            {
               for (var k=j+1;k<m.paths.length;k++)
                  m.paths[k-1]=m.paths[k];
               m.paths.length--;
               j--;
            }
         }
         if (!hasBlitzed)
         {
            for (j=i+1;j<this.length;j++)
            {
               this[j-1]=this[j];
               this[j-1].index=j-1;
            }
            this[this.length-1]=null;
            this.length--;
            i--;
         }
      }
   },
   loadAmphibiousAssaultMoves:function(path)
   {
      var seaZone=path[1];
      var seaBattle=seaZone.isEnemyOccupied();
      for (var i=0;i<seaZone.pieces.length;i++)
      {
         var p=seaZone.pieces[i];
         if (p.unit==7 &&
             p.isOurs(this.team) &&
             p.carry.length>0 &&
             p.carry[0].unit!=4)
         {
            var count=0;
            for (var j=0;j<p.carry.length;j++)
               if (p.carry[j].amphibiousAssault==null &&
                   p.carry[j].owner==p.owner)
                  count++;
            if (count>0)
               this.add(p.carry[0].unit,count,path,p,seaBattle);
         }
      }
   },
   loadUnloadTransportMoves:function(path)
   {
      var seaZone=path[1];
      var seaBattle=seaZone.isEnemyOccupied();
      for (var i=0;i<seaZone.pieces.length;i++)
      {
         var p=seaZone.pieces[i];
         if (p.unit==7 &&
             ((p.carry.length>0 &&
               p.carry[0].isOurs(this.team)) ||
              (p.carry.length>1 &&
               p.carry[1].isOurs(this.team))))
         {
            var count=0;
            var i;
            for (var j=0;j<p.carry.length;j++)
               if (p.carry[j].amphibiousAssault==null &&
                   p.carry[j].isOurs(this.team) &&
                   (p.isOurs(this.team) || !p.carry[j].justLoaded))
                  count++;
            if (count>0)
               this.add(p.carry[0].unit,count,path,p,seaBattle);
         }
      }
   },
   loadSeaAttackMoves:function(path,seaOnly,resistance,straitsBlocked)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var units=this.team.units;
      for (var i=0;i<movement;i++)
         if (territory==path[i])
            return;
      if (seaOnly)
         seaOnly&=territory.isSeaZone();
      var count;
      if (seaOnly && !resistance && !straitsBlocked &&	
          movement<=units.battleship.movement &&
          (count=territory.unitCount(5,this.team.powerIndex,true))>0)
         this.add(5,count,path);
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.aircraftCarrier.movement &&
          (count=territory.unitCount(6,this.team.powerIndex,true))>0)
         this.add(6,count,path);
      if (seaOnly && !resistance &&
          movement<=units.submarine.movement &&
          (count=territory.unitCount(8,this.team.powerIndex,true))>0)
         this.add(8,count,path);
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.transport.movement)
      {
         var transportCounts=territory.transportCounts(this.team.powerIndex,true,false);
         for (var i=0;i<transportCounts.length;i++)
            this.addTransport(transportCounts[i].piece,transportCounts[i].count,path);
      }
      if (movement<=units.fighter.movement &&
          (count=territory.unitCount(2,this.team.powerIndex,true))>0 &&
          !GamesByEmail.WW2Moves.isKamikaze(this.team,path[0],territory,units.fighter.movement-movement,true))
         this.add(2,count,path);
      if ((count=territory.unitCount(3,this.team.powerIndex,true))>0 &&
          !GamesByEmail.WW2Moves.isKamikaze(this.team,path[0],territory,units.bomber.movement-movement,false))
         this.add(3,count,path);
      if (movement<units.bomber.movement-1)
      {
         if (!resistance)
            resistance|=territory.isEnemyOccupied();
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[pathLength]=territory.adjacent[i];
            this.loadSeaAttackMoves(path,seaOnly,resistance || territory.isCanalTransitBlocked(territory.adjacent[i],this.team.team.powerIndex), straitsBlocked || territory.isStraitsTransitBlocked(territory.adjacent[i],this.team.team.powerIndex));
         }
         path.length=pathLength;
      }
   },
   loadSeaOccupyMoves:function(path,seaOnly,resistance,straitsBlocked)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var units=this.team.units;
      for (var i=0;i<movement;i++)
         if (territory==path[i])
            return;
      if (seaOnly)
         seaOnly&=territory.isSeaZone();
      var count;
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.battleship.movement &&
          (count=territory.unitCount(5,this.team.powerIndex,true))>0)
         this.add(5,count,path);
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.aircraftCarrier.movement &&
          (count=territory.unitCount(6,this.team.powerIndex,true))>0)
         this.add(6,count,path);
      if (seaOnly && !resistance &&
          movement<=units.submarine.movement &&
          (count=territory.unitCount(8,this.team.powerIndex,true))>0)
         this.add(8,count,path);
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.transport.movement)
      {
         var transportCounts=territory.transportCounts(this.team.powerIndex,true,false);
         for (var i=0;i<transportCounts.length;i++)
            this.addTransport(transportCounts[i].piece,transportCounts[i].count,path,true);
      }
      if (movement<units.battleship.movement ||
          movement<units.aircraftCarrier.movement ||
          movement<units.submarine.movement ||
          movement<units.transport.movement)
      {
         if (!resistance)
            resistance|=(territory.isEnemyOccupied());
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[pathLength]=territory.adjacent[i];
            this.loadSeaOccupyMoves(path,seaOnly,resistance || territory.isCanalTransitBlocked(territory.adjacent[i],this.team.team.powerIndex),straitsBlocked || territory.isStraitsTransitBlocked(territory.adjacent[i],this.team.team.powerIndex));
         }
         path.length=pathLength;
      }
   },
   loadLandNonCombatMoves:function(path,landOnly,resistance,airAllowed)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var units=this.team.units;
      for (var i=0;i<movement;i++)
         if (territory==path[i])
            return;
      if (landOnly)
         landOnly&=territory.isLand();
      var count;
      if (landOnly && !resistance &&
          movement<=units.antiaircraftGun.movement &&
          (count=territory.unitCount(4,this.team.powerIndex,true))>0)
         this.add(4,count,path);
      if (landOnly && !resistance &&
          movement<=units.infantry.movement &&
          (count=territory.unitCount(0,this.team.powerIndex,true))>0)
         this.add(0,count,path);
      if (landOnly && !resistance &&
          movement<=units.armor.movement &&
          (count=territory.unitCount(1,this.team.powerIndex,true))>0)
         this.add(1,count,path);
      if (airAllowed &&
          movement<=units.fighter.movement &&
          (count=territory.unitCount(2,this.team.powerIndex,true))>0)
         this.add(2,count,path);
      if (airAllowed &&
          movement<=units.bomber.movement &&
          (count=territory.unitCount(3,this.team.powerIndex,true))>0)
         this.add(3,count,path);
      if (movement==1 && !landOnly)
         this.loadUnloadTransportMoves(path);
      if (movement<units.bomber.movement)
      {
         if (!resistance)
            resistance|=!territory.isFriendly();
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[pathLength]=territory.adjacent[i];
            this.loadLandNonCombatMoves(path,landOnly,resistance,airAllowed);
         }
         path.length=pathLength;
      }
   },
   loadSeaNonCombatMoves:function(path,seaOnly,resistance,straitsBlocked)
   {
      var pathLength=path.length;
      var movement=pathLength-1;
      var territory=path[movement];
      var units=this.team.units;
      for (var i=0;i<movement;i++)
         if (territory==path[i])
            return;
      if (seaOnly)
         seaOnly&=territory.isSeaZone();
      var count;
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.battleship.movement &&
          (count=territory.unitCount(5,this.team.powerIndex,true))>0)
         this.add(5,count,path);
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.aircraftCarrier.movement &&
          (count=territory.unitCount(6,this.team.powerIndex,true))>0)
         this.add(6,count,path);
      if (seaOnly && !resistance &&
          movement<=units.submarine.movement &&
          (count=territory.unitCount(8,this.team.powerIndex,true))>0)
         this.add(8,count,path);
      if (movement<=units.fighter.movement &&
          (count=territory.unitCount(2,this.team.powerIndex,true))>0)
         this.add(2,count,path);
      if (seaOnly && !resistance && !straitsBlocked &&
          movement<=units.transport.movement)
      {
         var transportCounts=territory.transportCounts(this.team.powerIndex,true,false,false);
         for (var i=0;i<transportCounts.length;i++)
            this.addTransport(transportCounts[i].piece,transportCounts[i].count,path,true);
      }
      if (movement<units.fighter.movement)
      {
         if (!resistance)
            resistance|=(territory.isEnemyOccupied());
         for (var i=0;i<territory.adjacent.length;i++)
         {
            path[pathLength]=territory.adjacent[i];
            this.loadSeaNonCombatMoves(path,seaOnly,resistance || territory.isCanalTransitBlocked(territory.adjacent[i],this.team.team.powerIndex),straitsBlocked || territory.isStraitsTransitBlocked(territory.adjacent[i],this.team.team.powerIndex));
         }
         path.length=pathLength;
      }
   },
   add:function(unit,count,path,transport,seaBattle)
   {
      if (arguments.length<4)
      {
         transport=null;
         seaBattle=false;
      }
      if (unit==0 ||
          unit==1)
         for (var i=1;i<path.length-1;i++)
            if (path[i].isNeutral())
               return;
      var territory=path[path.length-1];
      for (var i=0;i<this.length;i++)
      {
         var m=this[i];
         if (m.unit==unit &&
             m.transport==transport &&
             m.paths[0].territories[m.paths[0].territories.length-1]==territory &&
             !m.paths[0].loadedPiecesTerritories)
         {
            m.numAvailable=count;
            m.paths.add(path);
            return;
         }
      }
      var index=this.length;
      this[index]=new GamesByEmail.WW2Move(this,index,unit,count,path,transport,seaBattle);
      this.length++;
   },
   addTransport:function(piece,count,path,seaBattle)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].transport &&
             this[i].transport.original==piece.original)
            return;
      var index=this.length;
      this[index]=new GamesByEmail.WW2Move(this,index,piece.unit,count,path,piece,seaBattle);
      this.length++;
   },
   removeAtIndex:function(index)
   {
      for (index++;index<this.length;index++)
      {
         this[index-1]=this[index];
         this[index-1].index=index-1;
      }
      this[this.length-1]=null;
      this.length--;
   },
   removeEmpty:function()
   {
      for (var i=this.length-1;i>=0;i--)
         if (this[i].numAvailable==0 && this[i].totalNumMoved()==0)
            this.removeAtIndex(i);
   },
   clearNonMoves:function()
   {
      for (var i=this.length-1;i>=0;i--)
         if (this[i].totalNumMoved()==0)
            this.removeAtIndex(i);
   },
   compress:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].paths.compress();
   },
   getHtml:function(nonCombat)
   {
      var game=this.toTerritory.game;
      if (this.length==0)
         if (this.toTerritory.isNeutral())
            return game.resource(76);
         else
            if (this.toTerritory.isSeaZone() && !this.toTerritory.isEnemyOccupied())
               return game.resource(80);
            else
               return game.resource(34);
      var html="";
      html+="<table cellspacing=0 cellpadding=0 width=\"100%\">";
      for (var i=0;i<this.length;i++)
      {
         html+="<tr style=\"background-color:"+(i%2 ? "#eeeeee" : "#ffffff")+"\"><td width=\"100%\" nowrap style=\"border-bottom:1px solid #cccccc\">";
         html+=this[i][nonCombat ? "nonCombatHtml" : "getHtml"](game);
         html+="</td></tr>";
      }
      html+="</table>";
      return html;
   },
   totalNumMoved:function()
   {
      var count=0;
      for (var i=0;i<this.length;i++)
         count+=this[i].totalNumMoved();
      return count;
   },
   updateMoveButtons:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].updateMoveButtons();
   },
   processNonCombat:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].processNonCombat();
   },
   recordUnitMovement:function(phase)
   {
      for (var i=0;i<this.length;i++)
         this[i].recordUnitMovement(phase);
   },
   undoAll:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].undoAll();
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Moves.isKamikaze=function(team,territory,originalTerritory,movement,isFighter)
   {
      this.checkKamikaze.checked=new Array();
      var isKamikaze=this.checkKamikaze(team,territory,originalTerritory.index,movement,isFighter);
      this.checkKamikaze.checked=null;
      return isKamikaze;
   };
GamesByEmail.WW2Moves.kamikazeChecked=function(territory)
   {
      for (var i=0;i<this.checkKamikaze.checked.length;i++)
         if (territory.index==this.checkKamikaze.checked[i])
            return true;
      return false;
   };
GamesByEmail.WW2Moves.checkKamikaze=function(team,territory,originalTerritoryIndex,movement,isFighter)
   {
      if (territory.index==originalTerritoryIndex)
         return false;
      if (this.kamikazeChecked(territory))
         return true;
      this.checkKamikaze.checked[this.checkKamikaze.checked.length]=territory.index;
      if (territory.hasRoomForAircraft(false,isFighter))
         return false;
      movement--;
      if (movement>=0)
         for (var i=0;i<territory.adjacent.length;i++)
            if (!this.checkKamikaze(team,territory.adjacent[i],originalTerritoryIndex,movement,isFighter))
               return false;
      this.checkKamikaze.checked.length--;
      return true;
   };
GamesByEmail.WW2Moves.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Moves.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Moves.$constructor();

GamesByEmail.WW2Move=function(moves,index,unit,count,path,transport,seaBattle)
{
   this.moves=moves;
   this.index=index;
   this.unit=unit;
   this.numAvailable=count;
   this.transport=transport;
   this.seaBattle=seaBattle;
   this.isAmphibiousAssault=(this.transport!=null && path[0].isLand());
   this.paths=new GamesByEmail.WW2MovePaths(this);
   this.paths.add(path);
   this.attacksAt=this.moves.team.units[this.unit].attack;
   this.numAttack=this.moves.team.units[this.unit].numAttack;
};
GamesByEmail.WW2Move.$parentClass=null;
GamesByEmail.WW2Move.$constructor=function(){};
GamesByEmail.WW2Move.$interfaces=new Array();
GamesByEmail.WW2Move.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Move);
GamesByEmail.WW2Move.$name="WW2Move";
GamesByEmail.WW2Move.$childClasses=new Array();
GamesByEmail.WW2Move.$container=GamesByEmail;
GamesByEmail.WW2Move.prototype={
   constructor:GamesByEmail.WW2Move,
   getHtml:function(game,nonCombat)
   {
      var html="";
      var toTerritory=this.paths[0].territories[0];
      var fromTerritory=this.paths[0].territories[this.paths[0].territories.length-1];
      html+="<table cellspacing=0 cellpadding=0 width=\"100%\"><tr><td align=center width=\""+game.board.maxPieceSize.x+"\">";
      if (this.transport)
         if (this.paths[0].loadedPiecesTerritories)
            html+=this.transport.getHtml(this.paths[0].loadedPiecesTerritories.length);
         else
            html+=this.transport.getHtml();
      else
         html+=GamesByEmail.WW2Piece.getImageHtml(game,this.moves.team,this.unit);
      html+="</td><td nowrap><b>";
      html+=fromTerritory.title.htmlEncode();
      html+="</b></td><td nowrap width=\"83px\" align=center>";
      html+=game.getTextHtml(this.numAvailable,"moveNumAvail_"+this.index,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
      html+="</td><td nowrap>";
      if (toTerritory.isNeutral() || (toTerritory.isSeaZone() && !toTerritory.isEnemyOccupied()))
         html+="&nbsp;";
      else
         html+=game.resource(this.numAttack>1 ? 72 : 71,
                                  'n',this.numAttack,
                                  'a',this.attacksAt);
      html+="</td></tr>";
      for (var i=0;i<this.paths.length;i++)
         if (this.transport && toTerritory.isSeaZone() && (this.transport.canCarryMore() || this.paths[i].loadedPiecesTerritories))
         {
            html+="<tr><td align=center valign=top>&nbsp;</td><td nowrap align=right>";
            html+=this.paths[i].getHtml();
            html+="</td><td nowrap width=\"83px\" align=center>";
            html+=game.getButtonHtml(game.resource(89),"moveAllNumAvail_"+this.index+"_"+i,game.event("moveAllNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getButtonHtml(game.resource(57),"moveOneNumAvail_"+this.index+"_"+i,game.event("moveOneNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+="</td><td nowrap width=\"83px\" align=center>";
            html+=game.getButtonHtml(this.paths[i].unloadButtonText(),"moveOneNumMoved_"+this.index+"_"+i,game.event("moveOneNumMovedAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getTextHtml(this.paths[i].numMoved,"moveNumMoved_"+this.index+"_"+i,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
            html+="</td></tr>";
         }
         else
         {
            var style=this.paths[i].strategicBombingRaid ? " style=\"background-color:#eeffee\"" : "";
            html+="<tr"+style+"><td align=center valign=top>&nbsp;</td><td nowrap align=right>";
            html+=this.paths[i].getHtml();
            html+="</td><td nowrap width=\"83px\" align=center>";
            html+=game.getButtonHtml(game.resource(36),"moveAllNumAvail_"+this.index+"_"+i,game.event("moveAllNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getButtonHtml(game.resource(57),"moveOneNumAvail_"+this.index+"_"+i,game.event("moveOneNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+="</td><td nowrap width=\"83px\" align=center>";
            html+=game.getButtonHtml(game.resource(58),"moveOneNumMoved_"+this.index+"_"+i,game.event("moveOneNumMovedAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getButtonHtml(game.resource(37),"moveAllNumMoved_"+this.index+"_"+i,game.event("moveAllNumMovedAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getTextHtml(this.paths[i].numMoved,"moveNumMoved_"+this.index+"_"+i,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
            html+="</td></tr>";
         }
      html+="</table>";
      return html;
   },
   nonCombatHtml:function(game)
   {
      var html="";
      var toTerritory=this.paths[0].territories[0];
      var fromTerritory=this.paths[0].territories[this.paths[0].territories.length-1];
      html+="<table cellspacing=0 cellpadding=0 width=\"100%\"><tr><td align=center width=\""+game.board.maxPieceSize.x+"\">";
      if (this.transport)
         if (this.paths[0].loadedPiecesTerritories)
            html+=this.transport.getHtml(this.paths[0].loadedPiecesTerritories.length);
         else
            html+=this.transport.getHtml();
      else
         html+=GamesByEmail.WW2Piece.getImageHtml(game,this.moves.team,this.unit);
      html+="</td><td nowrap><b>";
      html+=fromTerritory.title.htmlEncode();
      html+="</b></td><td nowrap width=\"83px\" align=center>";
      html+=game.getTextHtml(this.numAvailable,"moveNumAvail_"+this.index,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
      html+="</td><td nowrap>";
      if (this.isAmphibiousAssault)
         html+="unload:"
      html+="</td></tr>";
      for (var i=0;i<this.paths.length;i++)
      {
         if (this.transport && toTerritory.isSeaZone() && (this.transport.canCarryMore() || this.paths[i].loadedPiecesTerritories))
         {
            html+="<tr><td align=center valign=top>&nbsp;</td><td nowrap align=right>";
            html+=this.paths[i].nonCombatHtml();
            html+="</td><td nowrap width=\"83px\" align=center>";
            html+=game.getButtonHtml(game.resource(89),"moveAllNumAvail_"+this.index+"_"+i,game.event("moveAllNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getButtonHtml(game.resource(57),"moveOneNumAvail_"+this.index+"_"+i,game.event("moveOneNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+="</td><td nowrap width=\"83px\" align=center>";
            html+=game.getButtonHtml(this.paths[i].unloadButtonText(),"moveOneNumMoved_"+this.index+"_"+i,game.event("moveOneNumMovedAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getTextHtml(this.paths[i].numMoved,"moveNumMoved_"+this.index+"_"+i,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
            html+="</td></tr>";
         }
         else
         {
            html+="<tr>";
            if (this.isAmphibiousAssault)
               html+="<td colspan=2 align=left>"+game.resource(200);
            else
               html+="<td align=center valign=top>&nbsp;</td><td nowrap align=right>"+this.paths[i].nonCombatHtml();
            html+="</td><td nowrap width=\"83px\" align=center valign=top>";
            html+=game.getButtonHtml(game.resource(36),"moveAllNumAvail_"+this.index+"_"+i,game.event("moveAllNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getButtonHtml(game.resource(57),"moveOneNumAvail_"+this.index+"_"+i,game.event("moveOneNumAvailAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+="</td><td nowrap width=\"83px\" align=center valign=top>";
            html+=game.getButtonHtml(game.resource(58),"moveOneNumMoved_"+this.index+"_"+i,game.event("moveOneNumMovedAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getButtonHtml(game.resource(37),"moveAllNumMoved_"+this.index+"_"+i,game.event("moveAllNumMovedAtIndex("+toTerritory.index+","+this.index+","+i+")"),null,"disabled");
            html+=game.getTextHtml(this.paths[i].numMoved,"moveNumMoved_"+this.index+"_"+i,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
            html+="</td></tr>";
         }
      }
      html+="</table>";
      return html;
   },
   change:function(changeType,pathIndex)
   {
      var game=this.moves.toTerritory.game;
      var toTerritory=this.paths[0].territories[0];
      var fromTerritory=this.paths[0].territories[this.paths[0].territories.length-1];
      var path=this.paths[pathIndex];
      if (changeType=="moveAllNumAvail")
      {
         if (this.numAvailable<1) return;
         if (this.transport && toTerritory.isSeaZone() && this.transport.canCarryMore())
         {
            this.showTransportLoadMoves();
            return;
         }
         if (this.isAmphibiousAssault)
            this.changeAmphibiousAssault(path,this.transport,toTerritory,this.numAvailable);
         else
            fromTerritory.moveUnits(this.unit,this.transport ? this.transport.owner : this.moves.team,toTerritory,this.numAvailable,0,path.territories.length-1,true,path.numAntiaircraftGun,path.strategicBombingRaid,this.transport);
         if (path.numBlitzed>0 && path.numMoved==0)
         {
            path.territories[1].blitzed++;
            path.territories[1].updateBlink();
         }
         path.numMoved+=this.numAvailable;
         this.numAvailable=0;
      }
      else if (changeType=="moveOneNumAvail")
      {
         if (this.numAvailable<1) return;
         if (this.isAmphibiousAssault)
            this.changeAmphibiousAssault(path,this.transport,toTerritory,1);
         else
            fromTerritory.moveUnits(this.unit,this.transport ? this.transport.owner : this.moves.team,toTerritory,1,0,path.territories.length-1,true,path.numAntiaircraftGun,path.strategicBombingRaid,this.transport);
         if (path.numBlitzed>0 && path.numMoved==0)
         {
            path.territories[1].blitzed++;
            path.territories[1].updateBlink();
         }
         path.numMoved++;
         this.numAvailable--;
      }
      else if (changeType=="moveAllNumMoved")
      {
         if (path.numMoved<1) return;
         if (this.isAmphibiousAssault)
            this.changeAmphibiousAssault(path,this.transport,toTerritory,-path.numMoved);
         else
            toTerritory.moveUnits(this.unit,this.transport ? this.transport.owner : this.moves.team,fromTerritory,path.numMoved,path.territories.length-1,0,false,0,false,this.transport);
         path.unloadTransport();
         this.numAvailable+=path.numMoved;
         path.numMoved=0;
         if (path.numBlitzed>0)
         {
            path.territories[1].blitzed--;
            path.territories[1].updateBlink();
         }
      }
      else if (changeType=="moveOneNumMoved")
      {
         if (path.numMoved<1) return;
         if (this.isAmphibiousAssault)
            this.changeAmphibiousAssault(path,this.transport,toTerritory,-path.numMoved);
         else
            toTerritory.moveUnits(this.unit,this.transport ? this.transport.owner : this.moves.team,fromTerritory,1,path.territories.length-1,0,false,0,false,this.transport);
         path.unloadTransport();
         this.numAvailable++;
         path.numMoved--;
         if (path.numBlitzed>0 && path.numMoved==0)
         {
            path.territories[1].blitzed--;
            path.territories[1].updateBlink();
         }
      }
      var e;
      if (e=game.getElement("moveNumAvail_"+this.index))
         e.value=this.numAvailable;
      if (e=game.getElement("moveNumMoved_"+this.index+"_"+pathIndex))
         e.value=path.numMoved;
      this.moves.updateMoveButtons();
      toTerritory.updateBlink();
   },
   updateMoveButtons:function()
   {
      var game=this.moves.toTerritory.game;
      var specialMoveDisabled=false;
      var specialMoveOneHidden=false;
      var specialUnmoveDisabled=false;
      if (this.moves.nonCombat)
         if (this.unit==4)
         {
            specialMoveDisabled=this.paths[0].territories[0].hasAntiaircraftGun();
            specialUnmoveDisabled=this.paths[0].territories[this.paths[0].territories.length-1].hasAntiaircraftGun();
         }
         else if (this.unit==2)
         {
            specialMoveDisabled=!this.paths[0].territories[0].hasRoomForFighter(true);
            specialUnmoveDisabled=!this.paths[0].territories[this.paths[0].territories.length-1].hasRoomForFighter(true);
         }
         else if (this.unit==6)
         {
            specialMoveDisabled=!this.paths[0].territories[0].canSpareAircraftCarrier(game.player.team);
            specialUnmoveDisabled=!this.paths[0].territories[this.paths[0].territories.length-1].canSpareAircraftCarrier();
         }
         else if (this.unit==7)
         {
            specialMoveOneHidden=(this.transport.owner!=this.moves.team);
         }
      for (var i=0;i<this.paths.length;i++)
      {
         game.setDisabled("moveAllNumAvail_"+this.index+"_"+i,"moveOneNumAvail_"+this.index+"_"+i,(specialMoveDisabled || this.numAvailable<1));
         var e;
         if (specialMoveOneHidden &&
             (e=game.getElement("moveOneNumAvail_"+this.index+"_"+i)))
            e.style.display="none";
         game.setDisabled("moveOneNumMoved_"+this.index+"_"+i,"moveAllNumMoved_"+this.index+"_"+i,(specialUnmoveDisabled || this.paths[i].numMoved<1));
      }
   },
   changeAmphibiousAssault:function(path,transport,territory,numToChange)
   {
      territory.amphibiousAssaulted+=numToChange;
      for (var i=0;i<transport.carry.length && numToChange!=0;i++)
         if (numToChange>0 && transport.carry[i].amphibiousAssault==null && transport.carry[i].owner==transport.owner)
         {
            transport.carry[i].amphibiousAssault=territory;
            numToChange--;
         }
         else
            if (numToChange<0 && transport.carry[i].amphibiousAssault==territory && transport.carry[i].owner==transport.owner)
            {
               transport.carry[i].amphibiousAssault=null;
               numToChange++;
            }
      transport.unloaded=false;
      transport.amphibiousAssaultPath=null;
      for (var i=0;i<transport.carry.length;i++)
         if (transport.carry[i].amphibiousAssault!=null)
         {
            transport.unloaded=true;
            transport.amphibiousAssaultPath=path;
            break;
         }
   },
   totalNumMoved:function()
   {
      var count=0;
      for (var i=0;i<this.paths.length;i++)
         count+=this.paths[i].numMoved;
      return count;
   },
   showTransportLoadMoves:function()
   {
      this.moves.activeLoadTransportMove=this;
      var game=this.moves.toTerritory.game;
      var territories=this.paths[0].territories;
      this.loadTransportLoadMoves();
      var pm=game.getElement("primaryMoves");
      var size=new Foundation.Point(pm.offsetWidth,pm.offsetHeight);
      var html="";
      html+="<table style=\"border:2px solid #000000;background-color:#ffffff;\" cellpadding=0 width=\""+size.x+"px\" height=\""+size.y+"px\">";
      html+="<tr><td>";
      var moveWithoutLoading="";
      var loadOnly=(this.transport.owner!=this.moves.team);
      if (!loadOnly)
         moveWithoutLoading=game.resource(168,
                                               'M',game.getButtonHtml(game.resource(90),"moveTransport",game.event("moveTransportAtIndex("+this.moves.toTerritory.index+")")));
      html+=game.resource(83,
                               't',this.transport.getHtml(),
                               'f',territories[territories.length-1].title.htmlEncode(),
                               'm',territories[0].title.htmlEncode(),
                               'M',moveWithoutLoading,
                               'H',game.tempHidePrompt);
      html+="</td></tr>";
      html+="<tr><td>"+game.resource(84)+"</td></tr>";
      html+="<tr><td style=\"height:100%\"><div style=\"border:1px solid black;width:100%;height:100%;overflow:scroll;overflow-y:scroll;background-color:"+(this.transportLoadMoves.length%2==0 ? "#ffffff" : "#eeeeee")+"\">";
      html+=this.transportLoadMoves.getHtml(loadOnly);
      html+="</div></td></tr>";
      html+="<tr><td align=left>";
      html+=game.resource(85,
                               'c',game.getButtonHtml(game.resource(86),"closeSecondaryAttack",game.event("closeSecondaryAttackAtIndex("+this.moves.toTerritory.index+")")));
      html+="</td></tr></table>";
      var e=game.getElement("secondaryMoves");
      game.setInnerHtml(e,html);
      pm.style.display="none";
      e.style.display="";
   },
   loadTransportLoadMoves:function()
   {
      var territories=this.paths[0].territories;
      this.transportLoadMoves=new GamesByEmail.WW2TransportLoadMoves(this,territories[0],territories[territories.length-1],this.moves.team);
      this.transportLoadMoves.loadMoves(this.moves.nonCombat);
   },
   processNonCombat:function()
   {
      if (this.isAmphibiousAssault && this.transport)
         for (var i=0;i<this.paths[0].numMoved;i++)
            for (var j=0;j<this.transport.carry.length;j++)
               if (this.transport.carry[j].isOurs())
               {
                  this.transport.transportUnloadPiece(j--,this.moves.toTerritory,true);
                  this.transport.pieces.updateBoard();
                  break;
               }
   },
   recordUnitMovement:function(phase)
   {
      this.paths.recordUnitMovement(phase);
   },
   undoAll:function()
   {
      for (var i=0;i<this.paths.length;i++)
         this.change("moveAllNumMoved",i);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Move.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Move.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Move.$constructor();

GamesByEmail.WW2MovePaths=function(move)
{
   this.length=0;
   this.move=move;
};
GamesByEmail.WW2MovePaths.$parentClass=null;
GamesByEmail.WW2MovePaths.$constructor=function(){};
GamesByEmail.WW2MovePaths.$interfaces=new Array();
GamesByEmail.WW2MovePaths.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2MovePaths);
GamesByEmail.WW2MovePaths.$name="WW2MovePaths";
GamesByEmail.WW2MovePaths.$childClasses=new Array();
GamesByEmail.WW2MovePaths.$container=GamesByEmail;
GamesByEmail.WW2MovePaths.prototype={
   constructor:GamesByEmail.WW2MovePaths,
   add:function(path)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].pathEquals(path))
            return;
      var p=new GamesByEmail.WW2MovePath(this.move,path,false);
      for (var i=0;i<this.length;i++)
         if (this[i].canReplace(p))
            return;
      this[this.length]=p;
      this.length++;
      if (!this.move.moves.nonCombat &&
          this.move.unit==3 &&
          path[0].unitCount(9)>0)
      {
         this[this.length]=new GamesByEmail.WW2MovePath(this.move,path,true);
         this.length++;
      }
   },
   removePath:function(index)
   {
      for (var i=index+1;i<this.length;i++)
         this[i-1]=this[i];
      this[this.length-1]=null;
      this.length--;
   },
   compress:function()
   {
      for (var i=0;i<this.length;i++)
         for (var j=0;j<this.length;j++)
            if (i!=j && this[i].canReplace(this[j]))
            {
               this.removePath(j);
               if (j<i)
                  i--;
               j--;
            }
   },
   sort:function()
   {
      for (var i=this.length-1;i>=0;i--)
         for (var j=0;j<i;j++)
            if (this[j].rank>this[j+1].rank)
            {
               t=this[j];
               this[j]=this[j+1];
               this[j+1]=t;
            }
   },
   recordUnitMovement:function(phase)
   {
      for (var i=0;i<this.length;i++)
         this[i].recordUnitMovement(phase);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2MovePaths.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2MovePaths.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2MovePaths.$constructor();

GamesByEmail.WW2MovePath=function(move,path,strategicBombingRaid)
{
   this.move=move;
   this.numMoved=0;
   this.territories=GamesByEmail.shallowCopy(path);
   this.numSpaces=this.territories.length-1;
   this.numBlitzed=0;
   this.numAntiaircraftGun=0;
   this.numNeutralViolation=0;
   this.strategicBombingRaid=strategicBombingRaid;
   var landAttack=(this.move.unit==0 || this.move.unit==1);
   var airAttack=(this.move.unit==2 || this.move.unit==3);
   for (var i=0;i<this.numSpaces;i++)
   {
      var t=this.territories[i];
      if (t.isNeutral())
         this.numNeutralViolation++;
      else
         if (t.isLand() && t.isEnemy())
         {
            if (airAttack && t.hasAntiaircraftGun()>0)
               this.numAntiaircraftGun++;
            if (landAttack && i>0 && !t.isEnemyOccupied())
               this.numBlitzed++;
         }
   }
   this.rank=(this.strategicBombingRaid ? 10000 : 0)+(this.numAntiaircraftGun*1000)+(this.numNeutralViolation*100)-(this.numBlitzed*10)+this.numSpaces;
};
GamesByEmail.WW2MovePath.$parentClass=null;
GamesByEmail.WW2MovePath.$constructor=function(){};
GamesByEmail.WW2MovePath.$interfaces=new Array();
GamesByEmail.WW2MovePath.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2MovePath);
GamesByEmail.WW2MovePath.$name="WW2MovePath";
GamesByEmail.WW2MovePath.$childClasses=new Array();
GamesByEmail.WW2MovePath.$container=GamesByEmail;
GamesByEmail.WW2MovePath.prototype={
   constructor:GamesByEmail.WW2MovePath,
   pathEquals:function(path)
   {
      if (this.territories.length!=path.length ||
          this.strategicBombingRaid!=path.strategicBombingRaid)
         return false;
      for (var i=1;i<this.territories.length;i++)
         if (this.territories[i].index!=path[i].index)
            return false;
      return true;
   },
   canReplace:function(path)
   {
      if (this.numSpaces<=path.numSpaces &&
          this.numAntiaircraftGun<=path.numAntiaircraftGun &&
          this.numNeutralViolation<=path.numNeutralViolation &&
          this.strategicBombingRaid==path.strategicBombingRaid)
         if (this.numBlitzed==0)
            return (path.numBlitzed==0);
         else
            return (this.territories[1].index==path.territories[1].index);
      return false;
   },
   getHtml:function()
   {
      var html="";
      var game=this.move.moves.toTerritory.game;
      if (this.strategicBombingRaid>0)
         html+="strategic bombing raid";
      if (this.move.isAmphibiousAssault)
         html+="amphibious assault";
      if (this.numBlitzed>0)
         html+="&nbsp;blitz: <b>"+this.territories[1].title+"</b>";
      if (this.numNeutralViolation>0)
         html+="&nbsp;cost:"+(this.numNeutralViolation*this.move.moves.team.units.neutral.cost)+" I.P.C.";
      if (this.numAntiaircraftGun>0)
      {
         var g=GamesByEmail.WW2Piece.getImageHtml(game,this.move.moves.team,4);
         for (var i=0;i<this.numAntiaircraftGun;i++)
            html+="&nbsp;"+g;
      }
      if (this.move.unit==2 || this.move.unit==3)
         html+="&nbsp;spaces: "+this.numSpaces;
      if (this.move.unit==7)
      {
         html+="<span id=\""+game.elementId("loadedUnits_"+this.move.index)+"\">";
         html+=this.loadedUnitsHtml();
         html+="</span>";
      }
      return html;
   },
   nonCombatHtml:function()
   {
      var html="";
      var toTerritory=this.move.moves.toTerritory;
      var game=toTerritory.game;
      if (this.move.unit==7)
      {
         html+="<span id=\""+game.elementId("loadedUnits_"+this.move.index)+"\">";
         html+=this.loadedUnitsHtml();
         html+="</span>";
      }
      return html;
   },
   loadedUnitsHtml:function()
   {
      var html="";
      if (this.loadedPiecesTerritories && this.loadedPiecesTerritories.length>0)
      {
         var carry=this.move.transport.carry;
         var numLoaded=this.loadedPiecesTerritories.length;
         var firstLoaded=carry.length-numLoaded;
         var game=this.move.moves.toTerritory.game;
         if (this.loadedPiecesTerritories.length==2 &&
             this.loadedPiecesTerritories[0]==this.loadedPiecesTerritories[1])
         {
            html+="&nbsp;"+carry[firstLoaded].getHtml()+"&nbsp;"+carry[firstLoaded+1].getHtml()+"&nbsp;";
            html+="<b>"+this.loadedPiecesTerritories[0].title.htmlEncode()+"</b>";
         }
         else
         {
            html+="<table cellspacing=0 cellpadding=0>";
            for (var i=0;i<numLoaded;i++)
               html+="<tr><td align=center>"+carry[i+firstLoaded].getHtml()+"</td><td>&nbsp;<b>"+this.loadedPiecesTerritories[i].title.htmlEncode()+"</b></td></tr>";
            html+="</table>";
         }
      }
      return html;
   },
   unloadButtonText:function()
   {
      return this.move.moves.toTerritory.game.resource(58);
      if (this.loadedPiecesTerritories && this.loadedPiecesTerritories.length>0)
         return this.move.moves.toTerritory.game.resource(91);
      else
         return this.move.moves.toTerritory.game.resource(58);
   },
   updateLoadedUnits:function(pathIndex)
   {
      var game=this.move.moves.toTerritory.game;
      var e=game.getElement("loadedUnits_"+this.move.index);
      if (e)
         game.setInnerHtml(e,this.loadedUnitsHtml());
      e=game.getElement("moveOneNumMoved_"+this.move.index+"_0");
      if (e)
         e.value=this.unloadButtonText();
   },
   getRealTransport:function()
   {
      return this.territories[this.territories.length-1].pieces.findByUnitTeamMoved(this.move.transport.unit,this.move.transport.owner,false,0,this.move.transport);
   },
   unloadTransport:function()
   {
      if (this.loadedPiecesTerritories && this.loadedPiecesTerritories.length>0)
      {
         var carry=this.move.transport.carry;
         var numLoaded=this.loadedPiecesTerritories.length;
         var firstLoaded=carry.length-numLoaded;
         var realTransport=this.getRealTransport();
         for (var i=numLoaded-1;i>=0;i--)
         {
            realTransport.transportUnloadPiece(firstLoaded+i,this.loadedPiecesTerritories[i]);
            this.move.transport.transportUnloadPiece(firstLoaded+i);
         }
         this.loadedPiecesTerritories.length=0;
         this.updateLoadedUnits();
      }
   },
   recordUnitMovement:function(phase)
   {
      if (this.numMoved>0)
      {
         var toTerritory=this.territories[0];
         var fromTerritory=this.territories[this.territories.length-1];
         var game=toTerritory.game;
         if (this.move.unit==7)
         {
            var transport=this.move.transport;
            switch (transport.carry.length)
            {
            case 2 :
               if (!this.loadedPiecesTerritories || this.loadedPiecesTerritories.length==0)
                  if (transport.carry[0].unit==transport.carry[1].unit &&
                      transport.carry[0].owner==transport.carry[1].owner)
                     game.log.recordPhase(phase,246,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex);
                  else
                     game.log.recordPhase(phase,247,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex,transport.carry[1].unit,transport.carry[1].owner.powerIndex);
               else if (this.loadedPiecesTerritories.length==1)
                  game.log.recordPhase(phase,245,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex,transport.carry[1].unit,transport.carry[1].owner.powerIndex,this.loadedPiecesTerritories[0].index,this.loadedPiecesTerritories[0].preMoveLogPowerIndex);
               else if (this.loadedPiecesTerritories[0]==this.loadedPiecesTerritories[1])
                  game.log.recordPhase(phase,242,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex,this.loadedPiecesTerritories[0].index,this.loadedPiecesTerritories[0].preMoveLogPowerIndex);
               else
                  game.log.recordPhase(phase,243,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex,this.loadedPiecesTerritories[0].index,this.loadedPiecesTerritories[0].preMoveLogPowerIndex,transport.carry[1].unit,transport.carry[1].owner.powerIndex,this.loadedPiecesTerritories[1].index,this.loadedPiecesTerritories[1].preMoveLogPowerIndex);
               break;
            case 1 :
               if (!this.loadedPiecesTerritories || this.loadedPiecesTerritories.length==0)
                  game.log.recordPhase(phase,244,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex);
               else
                  game.log.recordPhase(phase,241,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,transport.carry[0].unit,transport.carry[0].owner.powerIndex,this.loadedPiecesTerritories[0].index,this.loadedPiecesTerritories[0].preMoveLogPowerIndex);
               break;
            default :
               game.log.recordPhase(phase,240,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex);
               break;
            }
         }
         else
            if (this.move.isAmphibiousAssault)
               game.log.recordPhase(phase,phase==6 ? 239 : 299,this.numMoved,this.move.unit,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex);
            else
            {
               var blitzedIndex=-1;
               var blitzedPower=-1;
               if (this.numBlitzed>0)
               {
                  blitzedIndex=this.territories[1].index;
                  blitzedPower=this.territories[1].preMoveLogPowerIndex;
               }
               game.log.recordPhase(phase,234,this.numMoved,this.move.unit,this.numSpaces,fromTerritory.index,fromTerritory.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,this.strategicBombingRaid>0 ? 1 : 0,this.numNeutralViolation,this.numAntiaircraftGun,this.numBlitzed,blitzedIndex,blitzedPower);
            }
      }
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2MovePath.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2MovePath.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2MovePath.$constructor();

GamesByEmail.WW2Defenses=function(ourOwn,game)
{
   this.length=0;
   this.ourOwn=ourOwn;
   this._82=game.resource(82);
   this._77=game.resource(77);
};
GamesByEmail.WW2Defenses.$parentClass=null;
GamesByEmail.WW2Defenses.$constructor=function(){};
GamesByEmail.WW2Defenses.$interfaces=new Array();
GamesByEmail.WW2Defenses.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Defenses);
GamesByEmail.WW2Defenses.$name="WW2Defenses";
GamesByEmail.WW2Defenses.$childClasses=new Array();
GamesByEmail.WW2Defenses.$container=GamesByEmail;
GamesByEmail.WW2Defenses.prototype={
   constructor:GamesByEmail.WW2Defenses,
   add:function(piece)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].defenceEquals(piece))
         {
            this[i].count++;
            return;
         }
      this[this.length]=new GamesByEmail.WW2Defense(piece);
      this.length++;
   },
   sort:function()
   {
      for (var i=this.length-1;i>=0;i--)
         for (var j=0;j<i;j++)
            if (this[j].defendsAt<this[j+1].defendsAt)
            {
               t=this[j];
               this[j]=this[j+1];
               this[j+1]=t;
            }
   },
   getHtml:function(game)
   {
      if (this.length==0)
         if (this.ourOwn)
            return this._82;
         else
            return this._77;
      var html="";
      html+="<table cellspacing=0 cellpadding=2 width=\"100%\">";
      for (var i=0;i<this.length;i++)
      {
         html+="<tr style=\"background-color:"+(i%2 ? "#eeeeee" : "#ffffff")+"\">";
         html+=this[i].getHtml(this.ourOwn);
         html+="</tr>";
      }
      html+="</table>";
      return html;
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Defenses.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Defenses.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Defenses.$constructor();

GamesByEmail.WW2Defense=function(piece)
{   
   this.piece=piece;
   this.count=1;
   this.defendsAt=this.piece.capabilities.defend;
};
GamesByEmail.WW2Defense.$parentClass=null;
GamesByEmail.WW2Defense.$constructor=function(){};
GamesByEmail.WW2Defense.$interfaces=new Array();
GamesByEmail.WW2Defense.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2Defense);
GamesByEmail.WW2Defense.$name="WW2Defense";
GamesByEmail.WW2Defense.$childClasses=new Array();
GamesByEmail.WW2Defense.$container=GamesByEmail;
GamesByEmail.WW2Defense.prototype={
   constructor:GamesByEmail.WW2Defense,
   defenceEquals:function(piece)
   {
      if (this.piece.unit!=piece.unit || this.piece.owner!=piece.owner)
         return false;
      if (this.piece.unit!=7)
         return true;
      if (this.piece.carry.length!=piece.carry.length)
         return false;
      if (this.piece.carry.length==0)
         return true;
      return (this.piece.carry[0].unit==piece.carry[0].unit);
   },
   getHtml:function(ourOwn)
   {
      var html="";
      html+="<td nowrap align=right width=\"1%\" style=\"border-bottom:1px solid #cccccc\">";
      html+=this.count+" x ";
      html+="<td nowrap align=left width=\"1%\" style=\"border-bottom:1px solid #cccccc\">";
      html+=this.piece.getHtml();
      html+="</td><td align=right nowrap style=\"border-bottom:1px solid #cccccc\">";
      if (ourOwn)
         html+="&nbsp;";
      else
         html+="["+this.defendsAt+"]";
      html+="</td>";
      return html;
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2Defense.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2Defense.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2Defense.$constructor();

GamesByEmail.WW2TransportLoadMoves=function(parentMove,toTerritory,fromTerritory,team)
{
   this.length=0;
   this.parentMove=parentMove;
   this.toTerritory=toTerritory;
   this.fromTerritory=fromTerritory;
   this.team=team;
};
GamesByEmail.WW2TransportLoadMoves.$parentClass=null;
GamesByEmail.WW2TransportLoadMoves.$constructor=function(){};
GamesByEmail.WW2TransportLoadMoves.$interfaces=new Array();
GamesByEmail.WW2TransportLoadMoves.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2TransportLoadMoves);
GamesByEmail.WW2TransportLoadMoves.$name="WW2TransportLoadMoves";
GamesByEmail.WW2TransportLoadMoves.$childClasses=new Array();
GamesByEmail.WW2TransportLoadMoves.$container=GamesByEmail;
GamesByEmail.WW2TransportLoadMoves.prototype={
   constructor:GamesByEmail.WW2TransportLoadMoves,
   loadMoves:function(nonCombat)
   {
      this.path=new Array();
      this.pieces=new Array();
      this.path[0]=this.fromTerritory;
      this.checkForLoadPieces(nonCombat);
      this.pieces=null;
      this.path=null;
   },
   checkForLoadPieces:function(nonCombat)
   {
      var movement=this.path.length-1;
      var canGoFarther=(movement<=this.team.units.transport.movement);
      var territory=this.path[movement];
      if ((territory==this.toTerritory || !territory.isEnemyOccupied()) && this.parentMove.transport.carry.length+this.pieces.length==0)
      {
         for (var i=0;i<territory.adjacent.length;i++)
         {
            var adjacent=territory.adjacent[i];
            if (!adjacent.isSeaZone())
            {
               var piece=adjacent.pieces.findByUnitTeamMoved(0,this.team,false,0,null);
               if (piece!=null)
               {
                  this.pieces[0]=piece;
                  this.pieces[0].moved=true;
                  piece=adjacent.pieces.findByUnitTeamMoved(0,this.team,false,0,null);
                  if (piece!=null)
                  {
                     this.pieces[1]=piece;
                     this.pieces[1].moved=true;
                     this.addOrLookFurther();
                     this.pieces[1].moved=false;
                     this.pieces.length=1;
                  }
                  this.addOrLookFurther();
                  this.checkForLoadPieces(nonCombat);
                  this.pieces[0].moved=false;
               }
               piece=adjacent.pieces.findByUnitTeamMoved(1,this.team,false,0,null);
               if (piece!=null)
               {
                  this.pieces[0]=piece;
                  this.pieces[0].moved=true;
                  this.addOrLookFurther();
                  this.pieces[0].moved=false;
               }
               piece=adjacent.pieces.findByUnitTeamMoved(4,this.team,false,0,null);
               if (piece!=null)
               {
                  this.pieces[0]=piece;
                  this.pieces[0].moved=true;
                  this.addOrLookFurther();
                  this.pieces[0].moved=false;
               }
            }
         }
         this.pieces.length=0;
      }
      if (this.parentMove.transport.carry.length+this.pieces.length==1 &&
          ((this.pieces.length==1 && this.pieces[0].unit==0) ||
           (this.parentMove.transport.carry.length==1 && this.parentMove.transport.carry[0].unit==0)))
      {
         var numPieces=this.pieces.length;
         for (var i=0;i<territory.adjacent.length;i++)
         {
            var adjacent=territory.adjacent[i];
            if (!adjacent.isSeaZone())
            {
               var piece=adjacent.pieces.findByUnitTeamMoved(0,this.team,false,0,null);
               if (piece!=null)
               {
                  this.pieces[numPieces]=piece;
                  this.pieces[numPieces].moved=true;
                  this.addOrLookFurther();
                  this.pieces[numPieces].moved=false;
               }
            }
         }
         this.pieces.length=numPieces;
      }
      this.addOrLookFurther();
   },
   addOrLookFurther:function()
   {
      if (this.parentMove.transport.owner!=this.team &&
          this.path.length>=3)
         return;
      var movement=this.path.length-1;
      var numPieces=this.pieces.length;
      var territory=this.path[movement];
      if (territory!=this.toTerritory && territory.isEnemyOccupied())
         return;
      var transportPowerIndex=this.parentMove.transport.owner.team.powerIndex;
      if (territory==this.toTerritory && this.pieces.length>0)
         this.addState();
      if (movement<this.team.units.transport.movement)
      {
         for (var i=0;i<territory.adjacent.length;i++)
         {
            var adjacent=territory.adjacent[i];
            if (adjacent.isSeaZone() &&
                !territory.isCanalTransitBlocked(adjacent,transportPowerIndex) &&
                !territory.isStraitsTransitBlocked(adjacent,transportPowerIndex))
            {
               this.path[movement+1]=adjacent;
               this.checkForLoadPieces();
            }
         }
         this.path.length=movement+1;
      }
   },
   addState:function()
   {
      var move=null;
      for (var i=0;i<this.length && move==null;i++)
      {
         var m=this[i];
         if (this.pieces.length==m.pieces.length &&
             ((this.pieces.length==1 &&
               this.pieces[0]==m.pieces[0]) ||
              (this.pieces.length==2 &&
               ((this.pieces[0]==m.pieces[0] && this.pieces[1]==m.pieces[1]) ||
                (this.pieces[0]==m.pieces[1] && this.pieces[1]==m.pieces[0])))))
            move=this[i];
      }
      if (move==null)
      {
         this[this.length]=new GamesByEmail.WW2TransportLoadMove(this,this.length,this.pieces);
         this.length++;
      }
      return move;
   },
   getHtml:function(loadOnly)
   {
      var html="";
      if (this.length==0)
         return this.toTerritory.game.resource(88);
      html+="<table cellspacing=0 cellpadding=0 width=\"100%\">";
      for (var i=0;i<this.length;i++)
      {
         html+="<tr style=\"background-color:"+(i%2 ? "#eeeeee" : "#ffffff")+"\">";
         html+=this[i].getHtml(loadOnly);
         html+="</tr>";
      }
      html+="</table>";
      return html;
   },
   moveTransport:function()
   {
      this.parentMove.change("moveOneNumAvail",0);
      this.parentMove.moves.toTerritory.closeSecondaryAttack();
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2TransportLoadMoves.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2TransportLoadMoves.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2TransportLoadMoves.$constructor();

GamesByEmail.WW2TransportLoadMove=function(moves,index,pieces)
{
   this.moves=moves;
   this.index=index;
   this.pieces=GamesByEmail.shallowCopy(pieces);
   this.numMoved=0;
};
GamesByEmail.WW2TransportLoadMove.$parentClass=null;
GamesByEmail.WW2TransportLoadMove.$constructor=function(){};
GamesByEmail.WW2TransportLoadMove.$interfaces=new Array();
GamesByEmail.WW2TransportLoadMove.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2TransportLoadMove);
GamesByEmail.WW2TransportLoadMove.$name="WW2TransportLoadMove";
GamesByEmail.WW2TransportLoadMove.$childClasses=new Array();
GamesByEmail.WW2TransportLoadMove.$container=GamesByEmail;
GamesByEmail.WW2TransportLoadMove.prototype={
   constructor:GamesByEmail.WW2TransportLoadMove,
   getHtml:function(loadOnly)
   {
      var html="";
      var pieceHtml="";
      var territoryHtml="";
      var game=this.moves.toTerritory.game;
      if (this.pieces.length==2 &&
          this.pieces[0].pieces.territory==this.pieces[1].pieces.territory)
      {
         pieceHtml="&nbsp;"+this.pieces[0].getHtml()+"&nbsp;"+this.pieces[1].getHtml()+"&nbsp;";
         territoryHtml="<b>"+this.pieces[0].pieces.territory.title.htmlEncode()+"</b>";
      }
      else
         for (var i=0;i<this.pieces.length;i++)
         {
            if (i>0)
            {
               pieceHtml+="<br>";
               territoryHtml+="<br>";
            }
            pieceHtml+="&nbsp;"+this.pieces[i].getHtml()+"&nbsp;";
            territoryHtml+="<b>"+this.pieces[i].pieces.territory.title.htmlEncode()+"</b>";
         }
      html+="<td nowrap align=center style=\"border-bottom:1px solid #cccccc\">"+pieceHtml+"</td>";
      html+="<td width=\"100%\" style=\"border-bottom:1px solid #cccccc\">"+territoryHtml+"</td>";
      html+="<td style=\"border-bottom:1px solid #cccccc\">"+game.getButtonHtml(game.resource(loadOnly ? 169 : 87),"loadAndMoveTransport",game.event("loadAndMoveTransportAtIndex("+this.moves.toTerritory.index+","+this.index+")"))+"</td>";
      return html;
   },
   loadAndMoveTransport:function()
   {
      var path=this.moves.parentMove.paths[0];
      path.loadedPiecesTerritories=new Array();
      for (var i=0;i<this.pieces.length;i++)
      {
         path.loadedPiecesTerritories[i]=this.pieces[i].pieces.territory;
         var realTransport=this.moves.fromTerritory.pieces.findByUnitTeamMoved(this.moves.parentMove.transport.unit,this.moves.parentMove.transport.owner,false,0,this.moves.parentMove.transport);
         realTransport.transportLoadPiece(this.pieces[i],true);
         this.moves.parentMove.transport.transportLoadPiece(this.pieces[i],false);
      }
      this.moves.moveTransport();
      this.moves.parentMove.paths[0].updateLoadedUnits();
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2TransportLoadMove.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2TransportLoadMove.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2TransportLoadMove.$constructor();

GamesByEmail.WW2AmphibiousAssaultOptions=function(territory)
{
   this.length=0;
   this.territory=territory;
   this.load();
};
GamesByEmail.WW2AmphibiousAssaultOptions.$parentClass=null;
GamesByEmail.WW2AmphibiousAssaultOptions.$constructor=function(){};
GamesByEmail.WW2AmphibiousAssaultOptions.$interfaces=new Array();
GamesByEmail.WW2AmphibiousAssaultOptions.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2AmphibiousAssaultOptions);
GamesByEmail.WW2AmphibiousAssaultOptions.$name="WW2AmphibiousAssaultOptions";
GamesByEmail.WW2AmphibiousAssaultOptions.$childClasses=new Array();
GamesByEmail.WW2AmphibiousAssaultOptions.$container=GamesByEmail;
GamesByEmail.WW2AmphibiousAssaultOptions.prototype={
   constructor:GamesByEmail.WW2AmphibiousAssaultOptions,
   load:function()
   {
      var us=this.territory.game.player.team;
      for (var i=0;i<this.territory.adjacent.length;i++)
      {
         var adjacent=this.territory.adjacent[i];
         if (adjacent.isSeaZone())
         {
            var transportCount=0;
            var battleshipOption=new GamesByEmail.WW2ShoreBombardmentOption(this,us,5,adjacent);
            var pieces=adjacent.pieces;
            for (var j=0;j<pieces.length;j++)
               if (pieces[j].isOurs(us))
                  if (pieces[j].amphibiousAssaultCount(this.territory)>0)
                  {
                     this[this.length]=new GamesByEmail.WW2AmphibiousAssaultTransportOption(this,this.length,pieces[j],battleshipOption,adjacent);
                     this.length++;
                     transportCount++;
                  }
            if (transportCount>0)
            {
               battleshipOption.index=this.length;
               this[this.length]=battleshipOption;
               this.length++;
            }
         }
      }
   },
   getHtml:function()
   {
      var html="";
      html+="<table cellspacing=0 cellpadding=0>";
      for (var i=0;i<this.length;i++)
         html+="<tr style=\"background-color:"+(i%2 ? "#eeeeee" : "#ffffff")+"\">"+this[i].getHtml()+"</tr>";
      html+="</table>";
      return html;
   },
   recordUnitMovement:function(phase)
   {
      for (var i=this.length-1;i>=0;i--)
         this[i].recordUnitMovement(phase);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2AmphibiousAssaultOptions.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2AmphibiousAssaultOptions.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2AmphibiousAssaultOptions.$constructor();

GamesByEmail.WW2AmphibiousAssaultTransportOption=function(options,index,transport,battleshipOption,seaZone)
{
   this.options=options;
   this.index=index;
   this.transport=transport;
   this.battleshipOption=battleshipOption;
   this.seaZone=seaZone;
   this.unloadedUnits=new Array();
};
GamesByEmail.WW2AmphibiousAssaultTransportOption.$parentClass=null;
GamesByEmail.WW2AmphibiousAssaultTransportOption.$constructor=function(){};
GamesByEmail.WW2AmphibiousAssaultTransportOption.$interfaces=new Array();
GamesByEmail.WW2AmphibiousAssaultTransportOption.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2AmphibiousAssaultTransportOption);
GamesByEmail.WW2AmphibiousAssaultTransportOption.$name="WW2AmphibiousAssaultTransportOption";
GamesByEmail.WW2AmphibiousAssaultTransportOption.$childClasses=new Array();
GamesByEmail.WW2AmphibiousAssaultTransportOption.$container=GamesByEmail;
GamesByEmail.WW2AmphibiousAssaultTransportOption.prototype={
   constructor:GamesByEmail.WW2AmphibiousAssaultTransportOption,
   getHtml:function()
   {
      var html="";
      var toTerritory=this.options.territory;
      var game=toTerritory.game;
      var count=this.transport.amphibiousAssaultCount(toTerritory);
      html+="<td style=\"border-bottom:1px solid #cccccc;padding:2px\" width=\"1px\">";
      html+=this.transport.getHtml();
      html+="</td><td nowrap width=\"100%\" style=\"border-bottom:1px solid #cccccc\">";
      html+=game.resource(119,
                               't',this.seaZone.title.htmlEncode(),
                               'd',"");
      html+="</td><td nowrap width=\"83px\" align=center style=\"border-bottom:1px solid #cccccc\">";
      html+=game.getTextHtml(count,"unloadNumAvail_"+this.index,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
      html+=game.getButtonHtml(game.resource(36),"unloadAllNumAvail_"+this.index,game.event("unloadAllNumAvailAtIndex("+toTerritory.index+","+this.index+")"),null,count<1 ? "disabled" : "");
      html+=game.getButtonHtml(game.resource(57),"unloadOneNumAvail_"+this.index,game.event("unloadOneNumAvailAtIndex("+toTerritory.index+","+this.index+")"),null,count<1 ? "disabled" : "");
      html+="</td><td nowrap width=\"83px\" align=center style=\"border-bottom:1px solid #cccccc\">";
      html+=game.getButtonHtml(game.resource(58),"unloadOneNumMoved_"+this.index,game.event("unloadOneNumMovedAtIndex("+toTerritory.index+","+this.index+")"),null,this.unloadedUnits.length<1 ? "disabled" : "");
      html+=game.getButtonHtml(game.resource(37),"unloadAllNumMoved_"+this.index,game.event("unloadAllNumMovedAtIndex("+toTerritory.index+","+this.index+")"),null,this.unloadedUnits.length<1 ? "disabled" : "");
      html+=game.getTextHtml(this.unloadedUnits.length,"unloadNumMoved_"+this.index,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
      html+="</td>";
      return html;
   },
   change:function(changeType)
   {
      var toTerritory=this.options.territory;
      var game=toTerritory.game;
      if (changeType=="unloadAllNumAvail")
         this.battleshipOption.unitsUnloaded+=this.transport.unloadAmphibiousAssault(toTerritory,this.transport.carry.length,this.unloadedUnits);
      else if (changeType=="unloadOneNumAvail")
         this.battleshipOption.unitsUnloaded+=this.transport.unloadAmphibiousAssault(toTerritory,1,this.unloadedUnits);
      else if (changeType=="unloadAllNumMoved")
         this.battleshipOption.unitsUnloaded-=this.transport.cancelAmphibiousAssault(this.unloadedUnits.length,this.unloadedUnits);
      else if (changeType=="unloadOneNumMoved")
         this.battleshipOption.unitsUnloaded-=this.transport.cancelAmphibiousAssault(1,this.unloadedUnits);
      var available=this.transport.amphibiousAssaultCount(toTerritory);
      game.getElement("unloadNumAvail_"+this.index).value=available;
      game.getElement("unloadNumMoved_"+this.index).value=this.unloadedUnits.length;
      game.setDisabled("unloadAllNumAvail_"+this.index,"unloadOneNumAvail_"+this.index,available<1);
      game.setDisabled("unloadAllNumMoved_"+this.index,"unloadOneNumMoved_"+this.index,this.unloadedUnits.length<1);
      this.battleshipOption.checkUnitsUnloaded();
   },
   recordUnitMovement:function(phase)
   {
      if (this.unloadedUnits.length>0)
      {
         var toTerritory=this.options.territory;
         var game=toTerritory.game;
         game.log.recordPhase(phase,248,this.unloadedUnits.length,this.seaZone.index,this.seaZone.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,this.unloadedUnits[0].unit,this.unloadedUnits[0].owner.powerIndex);
      }
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2AmphibiousAssaultTransportOption.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2AmphibiousAssaultTransportOption.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2AmphibiousAssaultTransportOption.$constructor();

GamesByEmail.WW2ShoreBombardmentOption=function(options,power,unit,seaZone)
{
   this.options=options;
   this.index=-1;
   this.power=power;
   this.unit=unit;
   this.available=0;
   this.participating=0;
   this.unitsUnloaded=0;
   this.seaZone=seaZone;
};
GamesByEmail.WW2ShoreBombardmentOption.$parentClass=null;
GamesByEmail.WW2ShoreBombardmentOption.$constructor=function(){};
GamesByEmail.WW2ShoreBombardmentOption.$interfaces=new Array();
GamesByEmail.WW2ShoreBombardmentOption.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2ShoreBombardmentOption);
GamesByEmail.WW2ShoreBombardmentOption.$name="WW2ShoreBombardmentOption";
GamesByEmail.WW2ShoreBombardmentOption.$childClasses=new Array();
GamesByEmail.WW2ShoreBombardmentOption.$container=GamesByEmail;
GamesByEmail.WW2ShoreBombardmentOption.prototype={
   constructor:GamesByEmail.WW2ShoreBombardmentOption,
   getHtml:function()
   {
      var html="";
      var toTerritory=this.options.territory;
      var game=toTerritory.game;
      this.available=this.seaZone.pieces.shoreBombardmentAvailable(this.power,this.unit);
      this.participating=this.seaZone.pieces.shoreBombardmentParticipating(this.power,this.unit,toTerritory);
      html+="<td style=\"border-bottom:1px solid #cccccc;padding:2px\"width=\"1px\" >";
      html+=GamesByEmail.WW2Piece.getImageHtml(game,this.power,this.unit);
      html+="</td><td nowrap width=\"100%\" style=\"border-bottom:1px solid #cccccc\">";
      html+=game.resource(119,
                               't',this.seaZone.title.htmlEncode(),
                               'd',game.resource(118));
      html+="</td>";
      if (this.available>0 || this.participating>0)
      {
         html+="<td nowrap width=\"83px\" align=center style=\"border-bottom:1px solid #cccccc\">";
         html+=game.getTextHtml(this.available,"unloadNumAvail_"+this.index,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
         html+=game.getButtonHtml(game.resource(36),"unloadAllNumAvail_"+this.index,game.event("unloadAllNumAvailAtIndex("+toTerritory.index+","+this.index+")"),null,this.available<1 || this.unitsUnloaded<1 ? "disabled" : "");
         html+=game.getButtonHtml(game.resource(57),"unloadOneNumAvail_"+this.index,game.event("unloadOneNumAvailAtIndex("+toTerritory.index+","+this.index+")"),null,this.available<1 || this.unitsUnloaded<1 ? "disabled" : "");
         html+="</td><td nowrap width=\"83px\" align=center style=\"border-bottom:1px solid #cccccc\">";
         html+=game.getButtonHtml(game.resource(58),"unloadOneNumMoved_"+this.index,game.event("unloadOneNumMovedAtIndex("+toTerritory.index+","+this.index+")"),null,this.participating<1 ? "disabled" : "");
         html+=game.getButtonHtml(game.resource(37),"unloadAllNumMoved_"+this.index,game.event("unloadAllNumMovedAtIndex("+toTerritory.index+","+this.index+")"),null,this.participating<1 ? "disabled" : "");
         html+=game.getTextHtml(this.participating,"unloadNumMoved_"+this.index,"readonly size=2 style=\"font:"+game.font+";background-color:#eeeeee\"");
         html+="</td>";
      }
      else
      {
         html+="<td colspan=2 nowrap width=\"166px\" align=center style=\"border-bottom:1px solid #cccccc\">";
         html+=game.resource(128);
         html+="</td>";
      }
      return html;
   },
   change:function(changeType)
   {
      var toTerritory=this.options.territory;
      var game=toTerritory.game;
      if (changeType=="unloadAllNumAvail")
      {
         if (this.available==0) return;
         this.seaZone.pieces.setShoreBombardment(toTerritory,this.power,this.unit,this.available);
         this.participating+=this.available;
         this.available=0;
      }
      else if (changeType=="unloadOneNumAvail")
      {
         if (this.available==0) return;
         this.seaZone.pieces.setShoreBombardment(toTerritory,this.power,this.unit,1);
         this.participating++;
         this.available--;
      }
      else if (changeType=="unloadAllNumMoved")
      {
         if (this.participating==0) return;
         this.seaZone.pieces.cancelShoreBombardment(toTerritory,this.power,this.unit,this.participating);
         this.available+=this.participating;
         this.participating=0;
      }
      else if (changeType=="unloadOneNumMoved")
      {
         if (this.participating==0) return;
         this.seaZone.pieces.cancelShoreBombardment(toTerritory,this.power,this.unit,1);
         this.available++;
         this.participating--;
      }
      var btn=game.getElement("unloadNumAvail_"+this.index);
      if (btn)
      {
         btn.value=this.available;
         game.getElement("unloadNumMoved_"+this.index).value=this.participating;
         game.setDisabled("unloadAllNumAvail_"+this.index,"unloadOneNumAvail_"+this.index,this.available<1 || this.unitsUnloaded<1);
         game.setDisabled("unloadAllNumMoved_"+this.index,"unloadOneNumMoved_"+this.index,this.participating<1);
      }
   },
   checkUnitsUnloaded:function()
   {
      if (this.index<0) return;
      if (this.unitsUnloaded<1 && this.participating>0)
      {
         this.change("unloadAllNumMoved");
         var game=this.options.territory.game;
         alert(game.resource(120,
                                  't',this.seaZone.title));
      }
      else
         this.change();
   },
   recordUnitMovement:function(phase)
   {
      if (this.participating>0)
      {
         var toTerritory=this.options.territory;
         var game=toTerritory.game;
         game.log.recordPhase(phase,255,this.participating,this.seaZone.index,this.seaZone.preMoveLogPowerIndex,toTerritory.index,toTerritory.preMoveLogPowerIndex,this.unit,this.power.powerIndex);
      }
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2ShoreBombardmentOption.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2ShoreBombardmentOption.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2ShoreBombardmentOption.$constructor();

GamesByEmail.WW2LandPlanesOptions=function(territory)
{
   this.length=0;
   this.territory=territory;
   var highestRange=this.load();
   this.territoriesList=new Array();
   for (var i=0;i<=highestRange;i++)
      this.territoriesList[i]=new Array();
   this.loadTerritoriesList(this.territory,highestRange,0,new Array());
};
GamesByEmail.WW2LandPlanesOptions.$parentClass=null;
GamesByEmail.WW2LandPlanesOptions.$constructor=function(){};
GamesByEmail.WW2LandPlanesOptions.$interfaces=new Array();
GamesByEmail.WW2LandPlanesOptions.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2LandPlanesOptions);
GamesByEmail.WW2LandPlanesOptions.$name="WW2LandPlanesOptions";
GamesByEmail.WW2LandPlanesOptions.$childClasses=new Array();
GamesByEmail.WW2LandPlanesOptions.$container=GamesByEmail;
GamesByEmail.WW2LandPlanesOptions.prototype={
   constructor:GamesByEmail.WW2LandPlanesOptions,
   load:function()
   {
      var highestRange=0;
      var pieces=this.territory.pieces;
      var us=this.territory.game.player.team;
      for (var i=0;i<pieces.length;i++)
      {
         var piece=pieces[i];
         if ((piece.unit==2 ||
              piece.unit==3) &&
             piece.isOurs(us))
         {
            var lpOption=this.findByPiece(piece);
            if (lpOption==null)
            {
               lpOption=this[this.length]=new GamesByEmail.WW2LandPlanesOption(this,this.length,piece);
               this.length++;
            }
            lpOption.count++;
            if (lpOption.range>highestRange)
               highestRange=lpOption.range;
         }
      }
      this.sort();
      return highestRange;
   },
   sort:function()
   {
      for (var i=this.length-1;i>=0;i--)
         for (var j=0;j<i;j++)
            if (this[j].sortValue()<this[j+1].sortValue())
            {
               t=this[j];
               this[j]=this[j+1];
               this[j+1]=t;
            }
      for (var i=0;i<this.length;i++)
         this[i].index=i;
   },
   findByPiece:function(piece)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].piece.unit==piece.unit && this[i].piece.numSpacesMoved==piece.numSpacesMoved)
            return this[i];
      return null;
   },
   updateRows:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].updateRow();
   },
   getHtml:function(landWidth)
   {
      var html="";
      html+="<table cellspacing=0 cellpadding=0>";
      for (var i=0;i<this.length;i++)
         html+="<tr style=\"background-color:"+(i%2 ? "#eeeeee" : "#ffffff")+"\">"+this[i].getHtml(landWidth)+"</tr>";
      html+="</table>";
      return html;
   },
   loadTerritoriesList:function(territory,range,index,triedList)
   {
      if (typeof(triedList[territory.index])=="number" &&
          triedList[territory.index]<=index)
         return;
      triedList[territory.index]=index;
      for (var i=0;i<this.territoriesList.length;i++)
      {
         var list=this.territoriesList[i];
         for (var j=0;j<list.length;j++)
            if (territory==(list[j].constructor==GamesByEmail.WW2Territory ? list[j] : list[j].pieces.territory))
               if (i<=index)
                  return;
               else
               {
                  for (var k=j+1;k<list.length;k++)
                     list[k-1]=list[k];
                  list.length--;
                  j--;
               }
      }
      var list=this.territoriesList[index];
      if (territory.isLand())
      {
         if (!territory.conqueredThisTurn &&
             territory.isFriendly())
            list[list.length]=territory;
      }
      else
         for (var i=0;i<territory.pieces.length;i++)
            if (territory.pieces[i].unit==6 &&
                territory.pieces[i].isFriendly())
            {
               list[list.length]=territory;
               break;
            }
      if (range>0)
         for (var i=0;i<territory.adjacent.length;i++)
            this.loadTerritoriesList(territory.adjacent[i],range-1,index+1,triedList);
   },
   recordLandedPlanes:function(phase)
   {
      for (var i=0;i<this.length;i++)
         this[i].recordLandedPlanes(phase);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2LandPlanesOptions.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2LandPlanesOptions.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2LandPlanesOptions.$constructor();

GamesByEmail.WW2LandPlanesOption=function(options,index,piece)
{
   this.options=options;
   this.index=index;
   this.piece=piece;
   this.range=this.piece.owner.units[this.piece.unit].movement-this.piece.numSpacesMoved;
   this.count=0;
   this.landed=new GamesByEmail.WW2LandedPlanes(this);
};
GamesByEmail.WW2LandPlanesOption.$parentClass=null;
GamesByEmail.WW2LandPlanesOption.$constructor=function(){};
GamesByEmail.WW2LandPlanesOption.$interfaces=new Array();
GamesByEmail.WW2LandPlanesOption.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2LandPlanesOption);
GamesByEmail.WW2LandPlanesOption.$name="WW2LandPlanesOption";
GamesByEmail.WW2LandPlanesOption.$childClasses=new Array();
GamesByEmail.WW2LandPlanesOption.$container=GamesByEmail;
GamesByEmail.WW2LandPlanesOption.prototype={
   constructor:GamesByEmail.WW2LandPlanesOption,
   sortValue:function()
   {
      return (this.piece.unit==3 ? 100 : 0)+this.range;
   },
   getHtml:function(landWidth)
   {
      var html="";
      var game=this.options.territory.game;
      var style="border-bottom:1px solid #888888";
      html+="<td id=\""+game.elementId("landPlaneOptionTypeTd_"+this.index)+"\" align=center style=\""+style+";width:50px\">";
      html+=this.optionTypeHtml();
      html+="</td>";
      html+="<td style=\""+style+"\" width=\""+landWidth+"\"><table cellspacing=0 cellpadding=0 border=0 width=\"100%\">";
      var buttonCount=0;
      var enabled,anyEnabled=false;
      for (var i=this.range;i>=0;i--)
      {
         var needRow=true;
         var l=this.options.territoriesList[i];
         for (var j=0;j<l.length;j++)
         {
            if (l[j].isLand() || this.piece.unit==2)
            {
               if (needRow)
                  html+="<tr><td style=\""+(i<this.range ? "border-top:1px solid "+(this.index%2 ? "#bbbbbb" : "#dddddd") : "")+"\">";
               enabled=(this.count>0 && l[j].availableLandingSlots()>0);
               if (enabled)
                  anyEnabled=true;
               html+=game.getButtonHtml(l[j].title,"landPlane:"+this.options.territory.index+":"+this.index+":"+i+":"+j,game.event("landPlaneAtIndex("+this.options.territory.index+","+this.index+","+i+","+j+")"),null,enabled ? "" : "disabled")+" ";
               buttonCount++;
               needRow=false;
            }
         }
         if (!needRow)
            html+="</td></tr>";
      }
      if (this.piece.unit==2)
      {
         html+="<tr><td style=\""+(i<this.range ? "border-top:1px solid "+(this.index%2 ? "#bbbbbb" : "#dddddd") : "")+"\">";
         enabled=(!anyEnabled && this.count>0);
         html+=game.getButtonHtml(game.resource(157),"landPlane:"+this.options.territory.index+":"+this.index+":-1:-1",game.event("landPlaneAtIndex("+this.options.territory.index+","+this.index+",-1,-1)"),null,enabled ? "" : "disabled");
         html+="</td></tr>";
      }
      html+="</table></td>";
      html+="<td id=\""+game.elementId("unlandPlaneTd_"+this.index)+"\" style=\""+style+";width:190;border-left:1px solid "+(this.index%2 ? "#bbbbbb" : "#dddddd")+"\">";
      html+=this.landed.getHtml();
      html+="</td>";
      return html;
   },
   optionTypeHtml:function()
   {
      var game=this.options.territory.game;
      return game.resource(154,
                                'p',this.piece.getHtml(),
                                'r',this.range,
                                'c',this.count);
   },
   land:function(listIndex,subIndex)
   {
      if (listIndex>=0)
      {
         var targetTerritory=this.options.territoriesList[listIndex][subIndex];
         this.options.territory.landPlane(this.piece.unit,this.piece.owner,targetTerritory,true);
         this.landed.landOne(targetTerritory,listIndex);
      }
      else
         this.landed.destroyOne(this.options.territory.destroyPlane(this.piece.unit,this.piece.owner));
      this.count--;
      this.options.updateRows();
   },
   unland:function(index)
   {
      if (this.landed[index].territory)
      {
         this.landed[index].territory.landPlane(this.piece.unit,this.piece.owner,this.options.territory,false);
         this.landed.unlandOne(index);
      }
      else
         this.options.territory.undestroyPlane(this.landed.undestroyOne(index));
      this.count++;
      this.options.updateRows();
   },
   updateRow:function()
   {
      var game=this.options.territory.game;
      game.setInnerHtml("landPlaneOptionTypeTd_"+this.index,this.optionTypeHtml());
      var noneLeft=(this.count<=0);
      var disabled;
      var nowhereToLand=true;
      for (var i=this.range;i>=0;i--)
      {
         var l=this.options.territoriesList[i];
         for (var j=0;j<l.length;j++)
         {
            var e=game.getElement("landPlane:"+this.options.territory.index+":"+this.index+":"+i+":"+j);
            if (e)
            {
               if (!e.disabled)
               {
                  e.style.width=e.offsetWidth;
                  e.style.height=e.offsetHeight;
               }
               disabled=noneLeft || l[j].availableLandingSlots()<=0;
               if (!disabled)
                  nowhereToLand=false;
               game.setDisabled(e,disabled);
            }
         }
      }
      var e=game.getElement("landPlane:"+this.options.territory.index+":"+this.index+":-1:-1");
      if (e)
      {
         if (!e.disabled)
         {
            e.style.width=e.offsetWidth;
            e.style.height=e.offsetHeight;
         }
         game.setDisabled(e,noneLeft || !nowhereToLand);
      }
      game.setInnerHtml("unlandPlaneTd_"+this.index,this.landed.getHtml());
   },
   recordLandedPlanes:function(phase)
   {
      this.landed.recordLandedPlanes(phase);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2LandPlanesOption.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2LandPlanesOption.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2LandPlanesOption.$constructor();

GamesByEmail.WW2LandedPlanes=function(option)
{
   this.length=0;
   this.option=option;
   this.destroyed=new Array();
};
GamesByEmail.WW2LandedPlanes.$parentClass=null;
GamesByEmail.WW2LandedPlanes.$constructor=function(){};
GamesByEmail.WW2LandedPlanes.$interfaces=new Array();
GamesByEmail.WW2LandedPlanes.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2LandedPlanes);
GamesByEmail.WW2LandedPlanes.$name="WW2LandedPlanes";
GamesByEmail.WW2LandedPlanes.$childClasses=new Array();
GamesByEmail.WW2LandedPlanes.$container=GamesByEmail;
GamesByEmail.WW2LandedPlanes.prototype={
   constructor:GamesByEmail.WW2LandedPlanes,
   find:function(territory)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].territory==territory)
            return this[i];
      var lp=this[this.length]=new GamesByEmail.WW2LandedPlane(this,this.length,territory);
      this.length++;
      return lp;
   },
   landOne:function(territory,spaces)
   {
      this.find(territory).landOne(spaces);
      this.option.options.territory.updateBlink();
   },
   unlandOne:function(index)
   {
      var landed=this[index];
      landed.unlandOne();
      if (landed.count<=0)
      {
         for (var i=landed.index+1;i<this.length;i++)
         {
            this[i-1]=this[i];
            this[i-1].index=i-1;
         }
         this[this.length-1]=null;
         this.length--;
      }
      this.option.options.territory.updateBlink();
   },
   destroyOne:function(piece)
   {
      this.landOne(null,-1);
      this.destroyed[this.destroyed.length]=piece;
   },
   undestroyOne:function(index)
   {
      var piece=this.destroyed[this.destroyed.length-1];
      this.destroyed.length--;
      this.unlandOne(index);
      return piece;
   },
   getHtml:function()
   {
      var html="";
      if (this.length==0)
         html+="&nbsp;";
      else
         for (var i=0;i<this.length;i++)
         {
            if (i>0)
               html+="<br>";
            html+=this[i].getHtml();
         }
      return html;
   },
   recordLandedPlanes:function(phase)
   {
      for (var i=0;i<this.length;i++)
         this[i].recordLandedPlanes(phase);
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2LandedPlanes.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2LandedPlanes.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2LandedPlanes.$constructor();

GamesByEmail.WW2LandedPlane=function(landedList,index,territory)
{
   this.landedList=landedList;
   this.index=index;
   this.territory=territory;
   this.count=0;
   this.spaces=-1;
};
GamesByEmail.WW2LandedPlane.$parentClass=null;
GamesByEmail.WW2LandedPlane.$constructor=function(){};
GamesByEmail.WW2LandedPlane.$interfaces=new Array();
GamesByEmail.WW2LandedPlane.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2LandedPlane);
GamesByEmail.WW2LandedPlane.$name="WW2LandedPlane";
GamesByEmail.WW2LandedPlane.$childClasses=new Array();
GamesByEmail.WW2LandedPlane.$container=GamesByEmail;
GamesByEmail.WW2LandedPlane.prototype={
   constructor:GamesByEmail.WW2LandedPlane,
   getHtml:function()
   {
      var html="";
      var game=this.landedList.option.options.territory.game;
      var title;
      if (this.territory)
         title=game.resource(155,
                                  't',this.territory.title,
                                  'n',this.count);
      else
         title=game.resource(158,
                                  'n',this.count);
      html+=game.getButtonHtml(title,"unlandPlane:"+this.landedList.option.options.territory.index+":"+this.landedList.option.index+":"+this.index,game.event("unlandPlaneAtIndex("+this.landedList.option.options.territory.index+","+this.landedList.option.index+","+this.index+")"),null,null,"width:100%");
      return html;
   },
   landOne:function(spaces)
   {
      this.count++;
      this.spaces=spaces;
   },
   unlandOne:function()
   {
      this.count--;
   },
   recordLandedPlanes:function(phase)
   {
      if (this.count>0)
      {
         var fromTerritory=this.landedList.option.options.territory;
         var game=fromTerritory.game;
         if (this.territory)
            game.log.recordPhase(phase,295,
                                  fromTerritory.index,
                                  fromTerritory.preMoveLogPowerIndex,
                                  this.territory.index,
                                  this.territory.preMoveLogPowerIndex,
                                  this.landedList.option.piece.unit,
                                  this.landedList.option.range,
                                  this.count,
                                  this.spaces);
         else
            game.log.recordPhase(phase,313,
                                  fromTerritory.index,
                                  fromTerritory.preMoveLogPowerIndex,
                                  this.landedList.option.piece.unit,
                                  this.landedList.option.range,
                                  this.count);
      }
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2LandedPlane.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2LandedPlane.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2LandedPlane.$constructor();

GamesByEmail.WW2PlacePurchasedUnits=function(game,team,purchasedUnits)
{
   this.length=0;
   this.game=game;
   this.team=team;
   this.purchasedUnits=purchasedUnits;
   this.processed=false;
   this.load(purchasedUnits);
   game.territories.clearUnitsManufactured();
};
GamesByEmail.WW2PlacePurchasedUnits.$parentClass=null;
GamesByEmail.WW2PlacePurchasedUnits.$constructor=function(){};
GamesByEmail.WW2PlacePurchasedUnits.$interfaces=new Array();
GamesByEmail.WW2PlacePurchasedUnits.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2PlacePurchasedUnits);
GamesByEmail.WW2PlacePurchasedUnits.$name="WW2PlacePurchasedUnits";
GamesByEmail.WW2PlacePurchasedUnits.$childClasses=new Array();
GamesByEmail.WW2PlacePurchasedUnits.$container=GamesByEmail;
GamesByEmail.WW2PlacePurchasedUnits.prototype={
   constructor:GamesByEmail.WW2PlacePurchasedUnits,
   load:function(purchasedUnits)
   {
      var lastUnit=null;
      for (var i=0;i<purchasedUnits.length;i++)
      {
         var unit=GamesByEmail.WW2Piece.unitFromMusterIndex(purchasedUnits.charAt(i));
         if (unit==lastUnit)
            this[this.length-1].count++;
         else
         {
            this[this.length]=new GamesByEmail.WW2PlacePurchasedUnit(this,this.length,lastUnit=unit);
            this.length++;
         }
      }
      for (var i=0;i<this.length;i++)
         this[i].loadTargets();
   },
   getHtml:function()
   {
      var html="";
      html+="<table cellspacing=0 cellpadding=0 border=0 width=\"100%\">";
      for (var i=0;i<this.length;i++)
         html+=this[i].getHtml(i);
      html+="</table>";
      return html;
   },
   updateButtons:function()
   {
      var enableDone=true;
      for (var i=0;i<this.length;i++)
         enableDone&=this[i].updateButtons();
      this.game.setDisabled("placePurchasedUnits",!enableDone);
   },
   process:function()
   {
      if (!this.processed)
      {
         for (var i=0;i<this.length;i++)
            this[i].process();
         this.processed=true;
      }
   },
   unprocess:function()
   {
      if (this.processed)
      {
         for (var i=0;i<this.length;i++)
            this[i].unprocess();
         this.processed=false;
      }
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2PlacePurchasedUnits.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2PlacePurchasedUnits.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2PlacePurchasedUnits.$constructor();

GamesByEmail.WW2PlacePurchasedUnit=function(unitList,index,unit)
{
   this.unitList=unitList;
   this.index=index;
   this.unit=unit;
   this.count=1;
};
GamesByEmail.WW2PlacePurchasedUnit.$parentClass=null;
GamesByEmail.WW2PlacePurchasedUnit.$constructor=function(){};
GamesByEmail.WW2PlacePurchasedUnit.$interfaces=new Array();
GamesByEmail.WW2PlacePurchasedUnit.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2PlacePurchasedUnit);
GamesByEmail.WW2PlacePurchasedUnit.$name="WW2PlacePurchasedUnit";
GamesByEmail.WW2PlacePurchasedUnit.$childClasses=new Array();
GamesByEmail.WW2PlacePurchasedUnit.$container=GamesByEmail;
GamesByEmail.WW2PlacePurchasedUnit.prototype={
   constructor:GamesByEmail.WW2PlacePurchasedUnit,
   loadTargets:function()
   {
      var territories=this.unitList.game.territories;
      var team=this.unitList.team;
      this.targets=new Array();
      if (this.unit==9)
      {
         for (var i=0;i<territories.length;i++)
         {
            var t=territories[i];
            if (t.ipcValue>0 &&
                t.holdingPower()==team &&
                !t.conqueredThisTurn &&
                !t.hasIndustry())
               this.targets[this.targets.length]=new GamesByEmail.WW2PlacePurchasedUnitTarget(this,t);
         }
      }
      else if (this.unit==4)
      {
         for (var i=0;i<territories.length;i++)
         {
            var t=territories[i];
            if (t.maximumOutput()>0 &&
                !t.hasAntiaircraftGun())
               this.targets[this.targets.length]=new GamesByEmail.WW2PlacePurchasedUnitTarget(this,t);
         }
      }
      else
      {
         for (var i=0;i<territories.length;i++)
         {
            var t=territories[i];
            if (t.maximumOutput()>0)
               this.targets[this.targets.length]=t;
         }
         if (GamesByEmail.WW2Piece.isSeaUnit(this.unit))
         {
            function alreadyAddedTerritory(targets,territory)
            {
               for (var i=0;i<targets.length;i++)
                  if (targets[i]==territory)
                     return true;
               return false;
            }
            territories=this.targets;
            this.targets=new Array();
            for (var i=0;i<territories.length;i++)
            {
               var a=territories[i].adjacent;
               for (var j=0;j<a.length;j++)
               {
                  var t=a[j];
                  if (!alreadyAddedTerritory(this.targets,t) &&
                      t.isSeaZone() &&
                      !t.isEnemyOccupied())
                     this.targets[this.targets.length]=t;
               }
            }
         }
         for (var i=0;i<this.targets.length;i++)
            this.targets[i]=new GamesByEmail.WW2PlacePurchasedUnitTarget(this,this.targets[i]);
      }
      this.targets[this.targets.length]=new GamesByEmail.WW2PlacePurchasedUnitTarget(this,null);
   },
   getHtml:function(rowNum)
   {
      var html="";
      var rowStyle=" style=\"background-color:"+(rowNum%2==0 ? "#eeeeee" : "#ffffff")+"\"";
      var game=this.unitList.game;
      html+="<tr "+rowStyle+">";
      var tdStyle=" style=\"border-top:1px solid #bbbbbb\" ";
      html+="<td align=center rowspan=\""+this.targets.length+"\" "+tdStyle+">";
      html+=GamesByEmail.WW2Piece.getImageHtml(game,this.unitList.team,this.unit);
      html+="<br><span id=\""+game.elementId("placeNewUnit:"+this.index)+"\">";
      html+=this.count;
      html+="</span></td>";
      for (var i=0;i<this.targets.length;i++)
      {
         if (i>0)
         {
            html+="</tr><tr "+rowStyle+">";
            tdStyle="";
         }
         html+="<td width=\"45%\" "+tdStyle+">";
         html+=game.getButtonHtml(this.targets[i].territory==null ? game.resource(177) : this.targets[i].territory.title,"placeNewUnit:"+this.index+":"+i,game.event("placeNewUnitAtIndex("+this.index+","+i+")"),null,"disabled","width:100%;"+(this.targets[i].territory==null ? "color:#ff0000" : ""));
         html+="</td><td width=\"45%\" "+tdStyle+">&nbsp;";
         html+=game.getButtonHtml(game.resource(179,
                                               't',this.targets[i].territory==null ? game.resource(178) : this.targets[i].territory.title,
                                               'u',this.targets[i].count),
                            "unplaceNewUnit:"+this.index+":"+i,game.event("unplaceNewUnitAtIndex("+this.index+","+i+")"),null,null,"width:100%;display:none");
         html+="</td>";
      }
      html+="</tr>";
      return html;
   },
   place:function(index)
   {
      if (this.count>0 &&
          this.targets[index].canTakeMore(this.unit))
      {
         this.count--;
         this.targets[index].place(this.unit);
         this.unitList.updateButtons();
      }
      return true;
   },
   unplace:function(index)
   {
      if (this.targets[index].count>0)
      {
         this.count++;
         this.targets[index].unplace(this.unit);
         this.unitList.updateButtons();
      }
      return true;
   },
   updateButtons:function()
   {
      var game=this.unitList.game;
      var anyRoom=false;
      if (this.unit==9)
      {
         for (var i=0;i<this.targets.length-1;i++)
         {
            var e=game.getElement("placeNewUnit:"+this.index+":"+i);
            var hasRoom=(this.targets[i].count==0);
            anyRoom|=hasRoom;
            game.setDisabled(e,this.count==0 || !hasRoom);
         }
      }
      else if (this.unit==4)
      {
         for (var i=0;i<this.targets.length-1;i++)
         {
            var e=game.getElement("placeNewUnit:"+this.index+":"+i);
            var hasRoom=(this.targets[i].count==0 && this.targets[i].canManufactureAnother());
            anyRoom|=hasRoom;
            game.setDisabled(e,this.count==0 || !hasRoom);
         }
      }
      else
      {
         for (var i=0;i<this.targets.length-1;i++)
         {
            var hasRoom=this.targets[i].canManufactureAnother();
            anyRoom|=hasRoom;
            game.setDisabled("placeNewUnit:"+this.index+":"+i,this.count==0 || !hasRoom);
         }
      }
      var e=game.getElement("placeNewUnit:"+this.index+":"+(this.targets.length-1));
      game.setDisabled(e,this.count==0 || anyRoom);

      for (var i=0;i<this.targets.length;i++)
      {
         var e=game.getElement("unplaceNewUnit:"+this.index+":"+i);
         e.value=game.resource(179,
                                    't',(this.targets[i].territory==null ? game.resource(178) : this.targets[i].territory.title),
                                    'u',this.targets[i].count);
         e.style.display=(this.targets[i].count==0 ? "none" : "");
      }
      game.setInnerHtml("placeNewUnit:"+this.index,this.count);
      return (this.count==0);
   },
   process:function()
   {
      for (var i=0;i<this.targets.length;i++)
         this.targets[i].process();
   },
   unprocess:function()
   {
      for (var i=0;i<this.targets.length;i++)
         this.targets[i].unprocess();
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2PlacePurchasedUnit.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2PlacePurchasedUnit.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2PlacePurchasedUnit.$constructor();

GamesByEmail.WW2PlacePurchasedUnitTarget=function(purchasedUnit,territory)
{
   this.purchasedUnit=purchasedUnit;
   this.territory=territory;
   this.count=0;
};
GamesByEmail.WW2PlacePurchasedUnitTarget.$parentClass=null;
GamesByEmail.WW2PlacePurchasedUnitTarget.$constructor=function(){};
GamesByEmail.WW2PlacePurchasedUnitTarget.$interfaces=new Array();
GamesByEmail.WW2PlacePurchasedUnitTarget.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.WW2PlacePurchasedUnitTarget);
GamesByEmail.WW2PlacePurchasedUnitTarget.$name="WW2PlacePurchasedUnitTarget";
GamesByEmail.WW2PlacePurchasedUnitTarget.$childClasses=new Array();
GamesByEmail.WW2PlacePurchasedUnitTarget.$container=GamesByEmail;
GamesByEmail.WW2PlacePurchasedUnitTarget.prototype={
   constructor:GamesByEmail.WW2PlacePurchasedUnitTarget,
   canManufactureAnother:function()
   {
      return (this.territory==null || this.territory.canManufactureAnother());
   },
   canTakeMore:function(unit)
   {
      if (unit==9)
         return (this.territory==null || this.count==0);
      if (unit==4)
         return (this.territory==null || (this.count==0 && this.territory.canManufactureAnother()));
      return this.canManufactureAnother();
   },
   place:function(unit)
   {
      this.count++;
      if (this.territory)
         this.territory.incrementUnitsManufactured();
   },
   unplace:function(unit)
   {
      this.count--;
      if (this.territory)
         this.territory.decrementUnitsManufactured();
   },
   process:function()
   {
      if (this.count>0)
         if (this.territory)
         {
            for (var i=0;i<this.count;i++)
               this.territory.pieces.addPiece(GamesByEmail.WW2Piece.create(this.purchasedUnit.unitList.team,this.purchasedUnit.unit));
            this.territory.game.log.record(300,this.count,this.purchasedUnit.unit,this.territory.index,this.territory.preMoveLogPowerIndex);
            this.territory.pieces.updateBoard();
         }
         else
            this.purchasedUnit.unitList.game.log.record(301,this.count,this.purchasedUnit.unit);
   },
   unprocess:function()
   {
      if (this.count>0 && this.territory)
      {
         for (var i=0;i<this.count;i++)
            this.territory.pieces.removePiece(this.territory.pieces.findByUnitTeamMoved(this.purchasedUnit.unit,this.purchasedUnit.unitList.team,false,0,null));
         this.territory.pieces.updateBoard();
      }
   },
   dispose:function()
   {
   }
};
GamesByEmail.WW2PlacePurchasedUnitTarget.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.WW2PlacePurchasedUnitTarget.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.WW2PlacePurchasedUnitTarget.$constructor();

GamesByEmail.WW2Game.TEAM={ALLIES:0,AXIS:1};
GamesByEmail.WW2Game.POWER={USSR:0,GERMANY:1,UNITED_KINGDOM:2,JAPAN:3,UNITED_STATES:4,NEUTRAL:5,SEAZONE:6,UNKNOWN:7};
GamesByEmail.WW2Game.DICE={ATTACKERS:6,DEFENDERS:7};
GamesByEmail.WW2Game.DEVELOPMENT={NONE:0,JETPOWER:1,ROCKETS:2,SUPERSUBMARINES:4,LONGRANGEAIRCRAFT:8,INDUSTRIALTECHNOLOGY:16,HEAVYBOMBERS:32};
GamesByEmail.WW2Log.MODE={OVERWRITE:0,APPEND:1};
GamesByEmail.WW2Piece.UNIT={NONE:-1,INFANTRY:0,ARMOR:1,FIGHTER:2,BOMBER:3,ANTIAIRCRAFT_GUN:4,BATTLESHIP:5,AIRCRAFT_CARRIER:6,TRANSPORT:7,SUBMARINE:8,INDUSTRY:9,DEVELOPMENT:12,DIVISOR:13};
GamesByEmail.WW2Piece.unitTrackOrder=[9,4,0,1,2,3,5,6,7,8];


GamesByEmail.WW2Game.resourcePack.board.pieceRects[0]=
{
   y:new Foundation.Rectangle(  0,  1,15,15),
   m:new Foundation.Rectangle( 15,  6,8,10),
   a:new Foundation.Rectangle( 23,  8,14,8),
   f:new Foundation.Rectangle( 37,  4,13,12),
   b:new Foundation.Rectangle( 50,  2,21,14),
   g:new Foundation.Rectangle( 71,  6,8,10),
   D:new Foundation.Rectangle(381,0,21,16),
   d:new Foundation.Rectangle( 79,  7,21,9),
   c:new Foundation.Rectangle(100,  8,26,8),
   t:new Foundation.Rectangle(126, 10,17,6),
   s:new Foundation.Rectangle(143,  9,19,7),
   p:new Foundation.Rectangle(162,  8,16,8),
   i:new Foundation.Rectangle(178,  6,10,10),
   F:new Foundation.Rectangle(188,  1,13,15),
   B:new Foundation.Rectangle(201,  0,21,16),
   j:new Foundation.Rectangle(222,  4,13,12),
   h:new Foundation.Rectangle(235,  2,21,14),
   G:new Foundation.Rectangle(256,  6,8,10),
   S:new Foundation.Rectangle(264,  9,19,7),
   P:new Foundation.Rectangle(283,  8,16,8),
   I:new Foundation.Rectangle(299,  6,10,10),
   J:new Foundation.Rectangle(309,  1,13,15),
   H:new Foundation.Rectangle(322,  0,21,16),
   q:new Foundation.Rectangle(343,  9,19,7),
   Q:new Foundation.Rectangle(362,  9,19,7),
   x:new Foundation.Rectangle( 71,  1,8,4),
   X:new Foundation.Rectangle(256,  1,8,4)
};
GamesByEmail.WW2Game.resourcePack.board.pieceRects[1]=
{
   y:new Foundation.Rectangle(  0, 17,15,15),
   m:new Foundation.Rectangle( 15, 22,8,10),
   a:new Foundation.Rectangle( 23, 24,14,8),
   f:new Foundation.Rectangle( 37, 20,13,12),
   b:new Foundation.Rectangle( 50, 18,21,14),
   g:new Foundation.Rectangle( 71, 22,8,10),
   D:new Foundation.Rectangle(381,16,21,16),
   d:new Foundation.Rectangle( 79, 23,21,9),
   c:new Foundation.Rectangle(100, 24,26,8),
   t:new Foundation.Rectangle(126, 26,17,6),
   s:new Foundation.Rectangle(143, 25,19,7),
   p:new Foundation.Rectangle(162, 24,16,8),
   i:new Foundation.Rectangle(178, 22,10,10),
   F:new Foundation.Rectangle(188, 17,13,15),
   B:new Foundation.Rectangle(201, 16,21,16),
   j:new Foundation.Rectangle(222, 20,13,12),
   h:new Foundation.Rectangle(235, 18,21,14),
   G:new Foundation.Rectangle(256, 22,8,10),
   S:new Foundation.Rectangle(264, 25,19,7),
   P:new Foundation.Rectangle(283, 24,16,8),
   I:new Foundation.Rectangle(299, 22,10,10),
   J:new Foundation.Rectangle(309, 17,13,15),
   H:new Foundation.Rectangle(322, 16,21,16),
   q:new Foundation.Rectangle(343, 25,19,7),
   Q:new Foundation.Rectangle(362, 25,19,7),
   x:new Foundation.Rectangle( 71, 17,8,4),
   X:new Foundation.Rectangle(256, 17,8,4)
};
GamesByEmail.WW2Game.resourcePack.board.pieceRects[2]=
{
   y:new Foundation.Rectangle(  0, 33,15,15),
   m:new Foundation.Rectangle( 15, 38,8,10),
   a:new Foundation.Rectangle( 23, 40,14,8),
   f:new Foundation.Rectangle( 37, 36,13,12),
   b:new Foundation.Rectangle( 50, 34,21,14),
   g:new Foundation.Rectangle( 71, 38,8,10),
   D:new Foundation.Rectangle(381,32,21,16),
   d:new Foundation.Rectangle( 79, 39,21,9),
   c:new Foundation.Rectangle(100, 40,26,8),
   t:new Foundation.Rectangle(126, 42,17,6),
   s:new Foundation.Rectangle(143, 41,19,7),
   p:new Foundation.Rectangle(162, 40,16,8),
   i:new Foundation.Rectangle(178, 38,10,10),
   F:new Foundation.Rectangle(188, 33,13,15),
   B:new Foundation.Rectangle(201, 32,21,16),
   j:new Foundation.Rectangle(222, 36,13,12),
   h:new Foundation.Rectangle(235, 34,21,14),
   G:new Foundation.Rectangle(256, 38,8,10),
   S:new Foundation.Rectangle(264, 41,19,7),
   P:new Foundation.Rectangle(283, 40,16,8),
   I:new Foundation.Rectangle(299, 38,10,10),
   J:new Foundation.Rectangle(309, 33,13,15),
   H:new Foundation.Rectangle(322, 32,21,16),
   q:new Foundation.Rectangle(343, 41,19,7),
   Q:new Foundation.Rectangle(362, 41,19,7),
   x:new Foundation.Rectangle( 71, 33,8,4),
   X:new Foundation.Rectangle(256, 33,8,4)
};
GamesByEmail.WW2Game.resourcePack.board.pieceRects[3]=
{
   y:new Foundation.Rectangle(  0, 49,15,15),
   m:new Foundation.Rectangle( 15, 54,8,10),
   a:new Foundation.Rectangle( 23, 56,14,8),
   f:new Foundation.Rectangle( 37, 52,13,12),
   b:new Foundation.Rectangle( 50, 50,21,14),
   g:new Foundation.Rectangle( 71, 54,8,10),
   D:new Foundation.Rectangle(381,48,21,16),
   d:new Foundation.Rectangle( 79, 55,21,9),
   c:new Foundation.Rectangle(100, 56,26,8),
   t:new Foundation.Rectangle(126, 58,17,6),
   s:new Foundation.Rectangle(143, 57,19,7),
   p:new Foundation.Rectangle(162, 56,16,8),
   i:new Foundation.Rectangle(178, 54,10,10),
   F:new Foundation.Rectangle(188, 49,13,15),
   B:new Foundation.Rectangle(201, 48,21,16),
   j:new Foundation.Rectangle(222, 52,13,12),
   h:new Foundation.Rectangle(235, 50,21,14),
   G:new Foundation.Rectangle(256, 54,8,10),
   S:new Foundation.Rectangle(264, 57,19,7),
   P:new Foundation.Rectangle(283, 56,16,8),
   I:new Foundation.Rectangle(299, 54,10,10),
   J:new Foundation.Rectangle(309, 49,13,15),
   H:new Foundation.Rectangle(322, 48,21,16),
   q:new Foundation.Rectangle(343, 57,19,7),
   Q:new Foundation.Rectangle(362, 57,19,7),
   x:new Foundation.Rectangle( 71, 49,8,4),
   X:new Foundation.Rectangle(256, 49,8,4)
};
GamesByEmail.WW2Game.resourcePack.board.pieceRects[4]=
{
   y:new Foundation.Rectangle(  0, 65,15,15),
   m:new Foundation.Rectangle( 15, 70,8,10),
   a:new Foundation.Rectangle( 23, 72,14,8),
   f:new Foundation.Rectangle( 37, 68,13,12),
   b:new Foundation.Rectangle( 50, 66,21,14),
   g:new Foundation.Rectangle( 71, 70,8,10),
   D:new Foundation.Rectangle(381,64,21,16),
   d:new Foundation.Rectangle( 79, 71,21,9),
   c:new Foundation.Rectangle(100, 72,26,8),
   t:new Foundation.Rectangle(126, 74,17,6),
   s:new Foundation.Rectangle(143, 73,19,7),
   p:new Foundation.Rectangle(162, 72,16,8),
   i:new Foundation.Rectangle(178, 70,10,10),
   F:new Foundation.Rectangle(188, 65,13,15),
   B:new Foundation.Rectangle(201, 64,21,16),
   j:new Foundation.Rectangle(222, 68,13,12),
   h:new Foundation.Rectangle(235, 66,21,14),
   G:new Foundation.Rectangle(256, 70,8,10),
   S:new Foundation.Rectangle(264, 73,19,7),
   P:new Foundation.Rectangle(283, 72,16,8),
   I:new Foundation.Rectangle(299, 70,10,10),
   J:new Foundation.Rectangle(309, 65,13,15),
   H:new Foundation.Rectangle(322, 64,21,16),
   q:new Foundation.Rectangle(343, 73,19,7),
   Q:new Foundation.Rectangle(362, 73,19,7),
   x:new Foundation.Rectangle( 71, 65,8,4),
   X:new Foundation.Rectangle(256, 65,8,4)
};
GamesByEmail.WW2Game.resourcePack.board.pieceRects[7]=
{
   y:new Foundation.Rectangle(  0, 81,15,15),
   m:new Foundation.Rectangle( 15, 86,8,10),
   a:new Foundation.Rectangle( 23, 88,14,8),
   f:new Foundation.Rectangle( 37, 84,13,12),
   b:new Foundation.Rectangle( 50, 82,21,14),
   g:new Foundation.Rectangle( 71, 86,8,10),
   D:new Foundation.Rectangle(381,80,21,16),
   d:new Foundation.Rectangle( 79, 87,21,9),
   c:new Foundation.Rectangle(100, 88,26,8),
   t:new Foundation.Rectangle(126, 90,17,6),
   s:new Foundation.Rectangle(143, 89,19,7),
   p:new Foundation.Rectangle(162, 88,16,8),
   i:new Foundation.Rectangle(178, 86,10,10),
   F:new Foundation.Rectangle(188, 81,13,15),
   B:new Foundation.Rectangle(201, 80,21,16),
   j:new Foundation.Rectangle(222, 84,13,12),
   h:new Foundation.Rectangle(235, 82,21,14),
   G:new Foundation.Rectangle(256, 86,8,10),
   S:new Foundation.Rectangle(264, 89,19,7),
   P:new Foundation.Rectangle(283, 88,16,8),
   I:new Foundation.Rectangle(299, 86,10,10),
   J:new Foundation.Rectangle(309, 81,13,15),
   H:new Foundation.Rectangle(322, 80,21,16),
   q:new Foundation.Rectangle(343, 80,19,7),
   Q:new Foundation.Rectangle(362, 80,19,7),
   x:new Foundation.Rectangle( 71, 81,8,4),
   X:new Foundation.Rectangle(256, 81,8,4)
};
GamesByEmail.WW2Game.resourcePack.board.pieceRects[6]=
[
null,
new Foundation.Rectangle(  0, 96,24,24),
new Foundation.Rectangle( 24, 96,24,24),
new Foundation.Rectangle( 48, 96,24,24),
new Foundation.Rectangle( 72, 96,24,24),
new Foundation.Rectangle( 96, 96,24,24),
new Foundation.Rectangle(120, 96,24,24)
];
GamesByEmail.WW2Game.resourcePack.board.pieceRects[7]=
[
null,
new Foundation.Rectangle(144, 96,24,24),
new Foundation.Rectangle(168, 96,24,24),
new Foundation.Rectangle(192, 96,24,24),
new Foundation.Rectangle(216, 96,24,24),
new Foundation.Rectangle(240, 96,24,24),
new Foundation.Rectangle(264, 96,24,24),
new Foundation.Rectangle(355, 93,26,27),
new Foundation.Rectangle(355, 93,26,27)
];
GamesByEmail.WW2Game.resourcePack.board.pieceRects.downArrow=new Foundation.Rectangle(288,100,7,8);
GamesByEmail.WW2Game.resourcePack.board.pieceRects.upArrow=new Foundation.Rectangle(288, 96,7,8);
