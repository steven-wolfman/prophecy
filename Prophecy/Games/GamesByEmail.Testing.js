/*
GamesByEmail.Testing
Copyright © 1998-2011 Scott Nesin, all rights reserved.
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
var GamesByEmail_Testing_gameFiles;
if (typeof(GamesByEmail)=="undefined")
{
   var foundationFolder="../";
   window.location.href.search(/(.*\/)([^\/]+)\/[^\/]*$/);
   var base=RegExp.$1;
   var game=RegExp.$2;
   document.write("<html><head><title>GamesByEmail Games</title>\n");
   document.write("<base href=\""+base+"\"/>\n");
   document.write("<"+"script id=\"Foundation.js\" src=\""+foundationFolder+"Foundation.js\"><"+"/script>\n");
   document.write("<"+"script id=\"Foundation.Geometry.js\" src=\""+foundationFolder+"Foundation.Geometry.js\"><"+"/script>\n");
   document.write("<"+"script id=\"Foundation.Server.js\" src=\""+foundationFolder+"Foundation.Server.js\"><"+"/script>\n");
   document.write("<"+"script id=\"GamesByEmail.js\" src=\"GamesByEmail.js\"><"+"/script>\n");
   if (!GamesByEmail_Testing_gameFiles)
      GamesByEmail_Testing_gameFiles=["<folder>/Game.js"];
   for (var i=0;i<GamesByEmail_Testing_gameFiles.length;i++)
      document.write("<"+"script src=\""+GamesByEmail_Testing_gameFiles[i].replace(/<folder>/gi,game)+"\"><"+"/script>\n");
   document.write("<"+"script id=\"GamesByEmail.Testing.js\" src=\"GamesByEmail.Testing.js\"><"+"/script>\n");
   document.write("</head><body onload=\"GamesByEmail.Testing.beginTest(&quot;"+game+"&quot;);\"><div id=\"GamesByEmailTest\"></div><center><nobr><span style=\"font:10px verdana;color:#444444\">All content and scripts copyright &copy; 1998-2011, <a target=\"_\" href=\"http://GamesByEmail.com/\">GamesByEmail.com</a></span></nobr></center></body></html>\n");
}
else
{
   var base=document.location.href.toLowerCase().indexOf("developer.gamesbyemail.com/wwwroot/games/");
   if (base>=0)
      GamesByEmail.Game.$staticFolder=document.location.href.substr(0,base)+"Static.GamesByEmail.com/wwwroot/";
   else if (document.location.href.toLowerCase().indexOf("developer.gamesbyemail.com/games/")>=0)
      GamesByEmail.Game.$staticFolder="http://Static.GamesByEmail.com/";
   
GamesByEmail.Testing=function(){};
GamesByEmail.Testing.$parentClass=null;
GamesByEmail.Testing.$constructor=function(){};
GamesByEmail.Testing.$interfaces=new Array();
GamesByEmail.Testing.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Testing);
GamesByEmail.Testing.$name="Testing";
GamesByEmail.Testing.$childClasses=new Array();
GamesByEmail.Testing.$container=GamesByEmail;
GamesByEmail.Testing.prototype={
   constructor:GamesByEmail.Testing,
   appendTestControlsHtml:function(htmlBuilder)
   {
      if (this.isLog)
         return htmlBuilder;
      var gameTypesSelect="";
      var gameTypes=this.resource("gameTypes");
      var gameTypeTitles=this.resource("gameTypeTitles");
      gameTypesSelect+=this.getSelectHtml("testingGameType",this.event("testingGameTypeChanged(this.value)"),"value=\""+this.type+"\"");
      var numGameTypes=(this.canPie ? gameTypes.length/2 : gameTypes.length);
      for (var i=0;i<numGameTypes;i++)
         gameTypesSelect+="<option value=\""+gameTypes[i]+"\">"+gameTypeTitles[i].htmlEncode()+"</option>";
      gameTypesSelect+="</select>";

      var numPlayersSelect="";
      var allowedNumPlayers=this.resource("allowedNumPlayers");
      var defaultNumTeamsPlaying=-1;
      var numTeamsPlaying=this.numTeamsPlaying();
      for (var i=0;i<allowedNumPlayers.length;i++)
         if (numTeamsPlaying==allowedNumPlayers[i])
         {
            defaultNumTeamsPlaying=numTeamsPlaying;
            break;
         }
      if (defaultNumTeamsPlaying<0)
         defaultNumTeamsPlaying=allowedNumPlayers[0];
      numPlayersSelect+=this.getSelectHtml("testingNumPlayers",this.event("testingNumPlayersChanged(this.value)"),"value=\""+defaultNumTeamsPlaying+"\"");
      for (var i=0;i<allowedNumPlayers.length;i++)
         numPlayersSelect+="<option value=\""+allowedNumPlayers[i]+"\">"+allowedNumPlayers[i]+"</option>";
      numPlayersSelect+="</select>";

      var display="";
      if (this.constructor==GamesByEmail.TutorialGame || this.constructor.$parentClass==GamesByEmail.TutorialGame || this.hideTestControls)
         display=" style=\"display:none\"";
      htmlBuilder.append("<tr"+display+"><td colspan=2 nowrap>");
      htmlBuilder.append(this.resource("testingControlsLayout"
                                       ,'t',gameTypesSelect
                                       ,'p',numPlayersSelect
                                       ,'v',this.getCheckboxHtml(this.verbose,"testingVerbose",this.event("testingVerboseChanged(this.checked)"))
                                       ,'V',this.elementId("testingVerbose")
                                       ,'a',this.getButtonHtml(this.resource("testingStartOver"),"testingStartOver",this.event("startAnotherGame()"))
                                       ,'b',this.getButtonHtml(this.resource("testingBlurt"),"testingBlurt",this.event("blurt()"))
                                       ,'P',this.getButtonHtml(this.resource("testingProfiler"),"testingProfiler",this.event("addProfiler()"))
                                       ,'x',GamesByEmail.inProduction() ? "none" : ""
                                       ,'s',this.getCheckboxHtml(this.spectating,"testingSpectating",this.event("testingSpectatingChanged(this.checked)"))
                                       ,'S',this.elementId("testingSpectating")
                                      ));
      return htmlBuilder.append("</td></tr>");
   },
   testingGameTypeChanged:function(gameType)
   {
      this.type=this.rawGame.type=gameType;
      this.testingStartAnotherTestGame();
   },
   testingNumPlayersChanged:function(numPlayers)
   {
      this.testingStartAnotherTestGame();
   },
   testingStartAnotherTestGame:function()
   {
      window.setTimeout(this.event("$startTest()"),100);
   },
   testingVerboseChanged:function(verbose)
   {
      this.player.info.b_noVerbose=!(this.verbose=verbose);
      this.synch();
   },
   testingSpectatingChanged:function(spectating)
   {
      this.undo();
      this.enablePermanentControls();
   },
   setSpectatingStatus:function(spectating,indexString)
   {
      var e=this.getElement("testingSpectating");
      this.spectating=(spectating || this.player==null || (e && e.checked));
      if (this.spectating)
      {
         if (indexString)
            this.player=this.findPlayerByIndices(indexString);
         else
         {
            var t=this.getTurnTeam();
            if (t && t.players.length>0)
               this.player=t.players[0];
            else
               this.player=this.move.player;
         }
         if (!this.player)
            this.player=this.findPlayer(0);
      }
   },
   sendInitializationToServer:function()
   {
      this.created=new Date();
      this.player=this.findPlayer(0);
      if (this.move.player==null)
         this.move.player=this.player;
      //this.move.player=this.player=this.findPlayer(0);
      //this.maxMoveNumber=this.move.number=0;
      this.status.uninitialized=false;
      var player;
      for (var i=0;player=this.findPlayer(i);i++)
         player.title="?Player "+i;
      this.$recordState();
      this.$setTestIds();
      window.setTimeout(this.event("receiveData("+Foundation.jsSerialize(this.rawGame)+")"),1000);
   },
   requiredScripts:function()
   {
      var scripts=new Array();
      scripts.push(this.getStaticFolder()+"Foundation.js");
      scripts.push(this.getStaticFolder()+"Foundation.Server.js");
      scripts.push(this.getStaticFolder()+"Foundation.Geometry.js");
      scripts.push(this.getCodeFolder()+"GamesByEmail.js");
      var gf=this.resource("gameFolder");
      for (var i=0;i<GamesByEmail_Testing_gameFiles.length;i++)
         scripts.push(this.getCodeFolder()+GamesByEmail_Testing_gameFiles[i].replace(/<folder>/gi,gf));
      scripts.push(this.getCodeFolder()+"GamesByEmail.Testing.js");
      return scripts;
   },
   $setTestIds:function()
   {
      this.$clearTestIds(this.rawGame.teams);
      var indices=this.rawGame.player.split(",");
      var teams=this.rawGame.teams;
      var team;
      var i;
      for (i=0;i<indices.length-1;i++)
      {
         team=teams[indices[i]];
         team.id=i+1;
         teams=team.teams;
      }
      team.players[indices[i]].id=i+1;
   },
   $clearTestIds:function(teams)
   {
      for (var i=0;i<teams.length;i++)
      {
         var t=teams[i];
         t.id=0;
         for (var j=0;j<t.players.length;j++)
            t.players[j].id=0;
         this.$clearTestIds(t.teams);
      }
   },
   $recordState:function()
   {
      this.$updateGameData(this.rawGame);
      this.$addToLog(this.rawGame);
      var t=this.getTurnTeam();
      if (!t)
         t=this.teams[0];
      this.rawGame.player=t.players[0].indexString();
      return this.rawGame;
   },
   $updateInfoData:function(infoData,info,fromData,clearSecureToo)
   {
      //clearSecureToo=true;
      for (var i in infoData)
         if (i!="constructor" && i!="prototype" && typeof(infoData[i])!="function" &&
             (clearSecureToo || i.length<7 || i.substr(0,7)!="secure_"))
            infoData[i]=null;
      for (var i in info)
         if (i!="constructor" && i!="prototype" && typeof(info[i])!="function")
         {
            infoData[i]=info[i];
            if (i.length>32)
               this.debug("WARNING: Key name '"+i+"' is "+(i.length-32)+" characters too long, name must be 32 characters max.");
         }
   },
   $updatePlayerData:function(playerData,player,fromData)
   {
      if (fromData)
         playerData.message=player.message;
      else
      {
         var message="";
         var playerMessageWrite=player.game.getElement("playerMessageWrite");
         if (playerMessageWrite)
         {
            message=playerMessageWrite.value.trim();
            playerMessageWrite.value="";
         }
         if (message.length>0)
            playerData.message=player.message+"\n\n"+player.title+": "+message;
         else
            playerData.message=player.message;
      }
      this.$updateInfoData(playerData.info,player.info,fromData,true);
   },
   $updatePlayersData:function(playersData,players,fromData)
   {
      for (var i=0;i<players.length;i++)
      {
         if (i==playersData.length)
            playersData[i]={id:0,index:i,title:"Player "+(this.$newPlayerIndex++),message:"",chatId:this.$newPlayerIndex,info:{}};
         this.$updatePlayerData(playersData[i],players[i],fromData);
      }
   },
   $hasSecure:function(infoData)
   {
      for (var i in infoData)
         if (i.length>6 && i.substr(0,7)=="secure_")
            return true;
      return false;
   },
   $updateTeamData:function(teamData,team,fromData)
   {
      teamData.index=team.index;
      if (fromData)
      {
         teamData.message=team.message;
         teamData.status=team.status;
      }
      else
      {
         eval("teamData.status="+Foundation.jsSerialize(team.status));
         var message="";
         if (team==team.game.player.team)
         {
            var teamMessageWrite=team.game.getElement("teamMessageWrite");
            if (teamMessageWrite)
            {
               message=teamMessageWrite.value.trim();
               window.setTimeout("var e=document.getElementById('"+teamMessageWrite.id+"');e.value='';try{e.onkeyup();}catch(e){}",1);
            }
         }
         if (message.length>0)
            teamData.message=team.message+"\n\n"+team.game.player.title+": "+message;
         else
            teamData.message=team.message;
      }
      //this.debug("GamesByEmail.Testing\nindex:"+team.index+"\nid:"+team.id+"\nisUs:"+team.isUs+"\nteam.hasSecure:"+this.$hasSecure(team.info)+"\nteamInfo.hasSecure:"+this.$hasSecure(teamData.info));
      this.$updateInfoData(teamData.info,team.info,fromData,team.isUs);
      if (typeof(team.teams)!="undefined")
      {
         if (typeof(teamData.teams)=="undefined")
            teamData.teams=new Array();
         this.$updateTeamsData(teamData.teams,team.teams,fromData);
      }
      this.$updatePlayersData(teamData.players,team.players,fromData);
   },
   $updateTeamsData:function(teamsData,teams,fromData)
   {
      for (var i=0;i<teams.length;i++)
      {
         if (i==teamsData.length)
            teamsData[i]={id:0,index:i,message:"",players:[],status:0,info:{}};
         this.$updateTeamData(teamsData[i],teams[i],fromData);
      }
   },
   $updateMoveData:function(moveData,move,fromData)
   {
      moveData.number=move.number;
      if (fromData || typeof(move.player)=="string")
         moveData.player=move.player;
      else
         moveData.player=move.player.indexString();
      moveData.log=move.log;
   },
   $noteTitle:function(note)
   {
      note=note.trim();
      if (note.length>0)
         note=" "+note+" ";
      var length=Math.floor((28-note.length)/2);
      if (length<3)
         length=3;
      note="///////////////".substr(0,length)+note+"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\".substr(0,length);
      if (note.length%2==1)
         note+="\\";
      return note;
   },
   $updateGameData:function(gameData,fromData)
   {
      this.$newPlayerIndex=1;
      if (fromData)
      {
         gameData.message=this.message;
         gameData.status=this.status;
      }
      else
      {
         eval("gameData.status="+Foundation.jsSerialize(this.status));
         var message="";
         var messageWrite=this.getElement("messageWrite");
         if (messageWrite && messageWrite.value!="debug" && messageWrite.value!="debugport")
         {
            message=messageWrite.value.trim();
            window.setTimeout("var e=document.getElementById('"+messageWrite.id+"');e.value='';try{e.onkeyup();}catch(e){}",1);
         }
         if (message.length>0)
            gameData.message=this.message+"\n\n"+this.player.title+": "+message;
         else
            gameData.message=this.message;
         var note=this.note;
         if (note==null) note="";
         note=note.trim();
         if (note.length>0)
         {
            if (gameData.message.length>0)
               gameData.message+="\n\n";
            var notes=note.split('\n');
            if (notes[0].charAt(0)!='#')
               gameData.message+=this.$noteTitle("")+"\n";
            for (var i=0;i<notes.length;i++)
               if (notes[i].length>0 && notes[i].charAt(0)=='#')
                  gameData.message+=this.$noteTitle(notes[i].substr(1))+"\n";
               else
                  gameData.message+=notes[i]+"\n";
            gameData.message+=this.$noteTitle("");
         }
      }
      gameData.maxMoveNumber=this.maxMoveNumber;
      this.$updateInfoData(gameData.info,this.info,fromData,true);
      this.$updateTeamsData(gameData.teams,this.teams,fromData);
      if (gameData.move==null)
         gameData.move={number:-1,player:"",log:""};
      this.$updateMoveData(gameData.move,this.move,fromData);
   },
   $getTestGameType:function()
   {
      return parseInt(this.getElement("testingGameType").value);
   },
   $getTestNumPlayers:function()
   {
      return parseInt(this.getElement("testingNumPlayers").value);
   },
   $getTestGameData:function(numPlayers,gameType)
   {
      this.type=typeof(gameType)=="number" ? gameType : this.$getTestGameType();
      var data={
         id:1,
         type:this.type,
         title:this.typeTitle()+" Game",
         message:"",
         status:GamesByEmail.GameStatus.PLAYING+GamesByEmail.GameStatus.UNINITIALIZED,
         maxMoveNumber:-1,
         info:{},
         teams:[],
         move:null,
         player:"0,0",
         numUninitializedPlayers:numPlayers,
         numberOfDistinctPlayers:numPlayers,
         created:new Date(),
         lastMove:new Date()
        };
      var formIndex;
      try
      {
         if (window.location.hash.length>1 &&
             !isNaN(formIndex=parseInt(window.location.hash.substr(1))) &&
             window.opener &&
             window.opener.Foundation &&
             window.opener.Foundation.$registry &&
             window.opener.Foundation.$registry.length>formIndex &&
             typeof(window.opener.Foundation.$registry[formIndex].gameType)!="undefined")
            this.$startGameForm=window.opener.Foundation.$registry[formIndex];
      }
      catch (e)
      {
      }
      if (this.$startGameForm)
      {
         data.type=this.$startGameForm.gameType;
         data.title=this.$startGameForm.gameTitle;
         data.numberOfDistinctPlayers=data.numUninitializedPlayers=data.numPlayers=this.$startGameForm.numPlayers;
         data.message=this.$startGameForm.gameMessage;
         for (var i in this.$startGameForm.info)
            if (i!="constructor" && i!="prototype" && typeof(this.$startGameForm.info[i])!="function")
               data.info[i]=this.$startGameForm.info[i];
      }
      return data;
   },
   sendToServer:function(sendNow)
   {
      this.maxMoveNumber=this.move.number;
      var gameData=this.rawGame;
      this.$updateGameData(gameData,false);
      this.processSecureMove(gameData);
      this.$addToLog(gameData);
      if (!sendNow)
         return false;
      var team=this.status.playing ? this.getTurnTeam() : this.findWinningTeam();
      if (!team)
         team=this.player.team;
      var player=team.getMostProbablePlayer();
      if (!player)
         player=this.player;
      gameData.player=player.indexString();
      this.$setTestIds();
      gameData.lastMove=new Date();
      window.setTimeout(this.event("receiveSendMoveResults(["+Foundation.jsSerialize(gameData)+"])"),100);
      return false;
   },
   $logifyInfoData:function(infoData)
   {
      var info=new Object();
      for (var i in infoData)
         if (i!="prototype" && i!="constructor" && typeof(infoData[i])!="function")
            info[i]=infoData[i];
      return info;
   },
   $logifyMoveData:function(moveData)
   {
      return {number:moveData.number,player:moveData.player,log:moveData.log};
   },
   $addTeamToLog:function(teamLog,teamData,moveIndex)
   {
      teamLog.infos[moveIndex]=this.$logifyInfoData(teamData.info);
      teamLog.status[moveIndex]=teamData.status;
      if (typeof(teamData.teams)!="undefined")
         for (var i=0;i<teamData.teams.length;i++)
            this.$addTeamToLog(teamLog.teams[i],teamData.teams[i],moveIndex);
   },
   $addGameToLog:function(gameLog,gameData)
   {
      var moveIndex=gameLog.moves.length;
      gameLog.infos[moveIndex]=this.$logifyInfoData(gameData.info);
      gameLog.status[moveIndex]=gameData.status;
      if (typeof(gameData.teams)!="undefined")
         for (var i=0;i<gameData.teams.length;i++)
            this.$addTeamToLog(gameLog.teams[i],gameData.teams[i],moveIndex);
      gameLog.moves[moveIndex]=this.$logifyMoveData(gameData.move);
   },
   $conformLogTeams:function(parent,data)
   {
      if (typeof(data.teams)=="undefined") return;
      for (var i=parent.teams.length;i<data.teams.length;i++)
      {
         parent.teams[i]={infos:[],status:[],teams:[]};
         this.$conformLogTeams(parent.teams[i],data.teams[i]);
      }
   },
   $addToLog:function(gameData)
   {
      this.$conformLogTeams(this._rawGameLog,gameData);
      this.$addGameToLog(this._rawGameLog,gameData);
   },
   $clearTeamFromLog:function(teamLog,num)
   {
      teamLog.infos.length-=num;
      for (var i=0;i<teamLog.teams.length;i++)
         this.$clearTeamFromLog(teamLog.teams[i],num);
   },
   $clearGameFromLog:function(gameLog,num)
   {
      gameLog.infos.length-=num;
      for (var i=0;i<gameLog.teams.length;i++)
         this.$clearTeamFromLog(gameLog.teams[i],num);
      gameLog.moves.length-=num;
   },
   $clearFromLog:function(num)
   {
      this.$clearGameFromLog(this._rawGameLog,num);
   },
   sendLogRequestToServer:function()
   {
      window.setTimeout(this.event("receiveLog("+Foundation.jsSerialize(this.parentGame._rawGameLog)+")"),1000);
   },
   sendProblemReportToServer:function()
   {
      window.setTimeout(this.event("sendProblemReportResponse(null)"),500);
   },
   savePreferencesToServer:function(allGames,preferences)
   {
      window.setTimeout(this.event("savePreferencesResponse("+Foundation.jsSerialize({gameTypes:allGames ? this.resource("gameTypes") : null,preferences:preferences})+")"),500);
   },
   clearMessage:function()
   {
      window.setTimeout(this.event("receiveMessage(\"\")"),500);
   },
   sendMessageToServer:function(message)
   {
      message=message.trim();
      if (message.length>0)
         message=this.player.title+": "+message;
      var m=this.getElement("messageRead").value;
      if (message.length==0)
         message=m;
      else
         if (m.length>0)
            message=m+"\n\n"+message;
      window.setTimeout(this.event("receiveMessage("+Foundation.jsSerialize(message)+")"),500);
   },
   sendPlayerNotesToServer:function(notes)
   {
      if (notes.length>5 &&
          notes.substr(0,5)=="this.")
         this.debug(eval(notes));
      window.setTimeout(this.event("receivePlayerNotes("+Foundation.jsSerialize(notes)+")"),500);
   },
   cancelGame:function()
   {
      alert("[Cancel game]");
      this.getElement("cancelGame").disabled=false;
   },
   refreshGame:function()
   {
      alert("[Refresh game]");
      this.getElement("refreshGame").disabled=false;
   },
   sendReminder:function()
   {
      alert("[Send reminder]");
      this.getElement("sendReminder").disabled=false;
   },
   fillNewGameUserInfo:function(userInfo,teams,indexString)
   {
      for (var i=0;i<teams.length;i++)
      {
         var team=teams[i];
         if (team.players.length>0)
         {
            var id=userInfo.length+1;
            userInfo[userInfo.length]={title:team.players[0].title,id:id,indexString:indexString+i+",0"};
         }
         this.fillNewGameUserInfo(userInfo,team.teams,indexString+i+",");
      }
   },
   requestNewGameUserInfo:function()
   {
      var userInfo=new Array();
      this.fillNewGameUserInfo(userInfo,this.teams,"");
      window.setTimeout(this.event("showStartAnotherGameForm("+Foundation.jsSerialize(userInfo)+")"),500);
   },
   closeWindow:function()
   {
      alert("[Close window]");
      this.getElement("closeWindow").disabled=false;
   },
   acknowledgeClick:function(message)
   {
      alert("["+message+"]"+"\nNot available in test mode.");
   },
   showMarks:function()
   {
      this.$markHandle=null;
      this.$marks.push({title:"[END]",time:new Date()});
      var msg="";
      this.debug("MARKS ["+this.$marks.length+"]:");
      for (var i=0;i<this.$marks.length;i++)
      {
         if (i>0)
            this.debug("      "+(this.$marks[i].time.valueOf()-this.$marks[i-1].time.valueOf()));
         this.debug("   "+this.$marks[i].title+":"+this.$marks[i].time);
      }
   },
   mark:function(title)
   {
      if (arguments.length==0 || !this.$marks)
         this.$marks=new Array();
      if (arguments.length==0)
         title="[TARE]";
      this.$marks.push({title:title,time:new Date()});
      if (!this.$markHandle)
         this.$markHandle=window.setTimeout(this.event("showMarks()"),1);
   },
   gameFormOnCreateEvent:function(gameForm)
   {
      this.constructor.prototype.gameFormOnCreateEvent.apply(this,arguments);
      this.$startGameForm=gameForm;
      this.$startTest();
      this.$startGameForm=(function(){})();
      return false;
   },
   requestPlayerChatMessage:function(chatIds)
   {
      if (!this._chatMessages)
         this._chatMessages=new Object();
      if (!this._chatMessages[chatIds])
         this._chatMessages[chatIds]="";
      var response={chatIds:chatIds,success:true,message:this._chatMessages[chatIds]};
      window.setTimeout(this.event("receivePlayerChatMessage("+Foundation.jsSerialize(response)+")"),500);
   },
   sendSetChatStatusRequest:function()
   {
      var response={noChat:this.status.noChat,success:true,message:null};
      window.setTimeout(this.event("receivePlayerChatMessage("+Foundation.jsSerialize(response)+")"),500);
   },
   postPlayerChatMessage:function(chatIds,newMessage)
   {
      if (this.status.noChat)
      {
         var response={chatIds:chatIds,success:false,message:"[Chatting not allowed]"};
         window.setTimeout(this.event("receivePlayerChatMessage("+Foundation.jsSerialize(response)+")"),500);
         return;
      }
      var message=this._chatMessages[chatIds];
      if (message.length>0)
         message+="\n\n";
      message+=this.player.title+": "+newMessage.replace(/\r/g,"").trim();
      this._chatMessages[chatIds]=message;
      this.requestPlayerChatMessage(chatIds);
   },
   sendSetChatStatusRequest:function()
   {
      var response={noChat:this.status.noChat,success:true,message:null};
      window.setTimeout(this.event("receivePlayerChatMessage("+Foundation.jsSerialize(response)+")"),500);
   },
   sendSetGameEndedTurnsOff:function()
   {
      window.setTimeout(this.event("receiveSetGameEndedTurnsOff(true)"),500);
   },
   sendPie:function(gameType)
   {
      this.rawGame.type=gameType;
      this.sendToServer(true);
   },
   openRules:function(event,index)
   {
      var rules=this.resource("rules");
      if (typeof(rules)=="string")
      {
         var names=new Array();
         var parts=rules.replace(/<a[^>]*\sname=/gi,"<a name=").split("<a name=");
         for (var i=1;i<parts.length;i++)
         {
            var name=parts[i]+" />";
            if (name.charAt(0)=='\"')
               name=name.substr(1,name.indexOf('\"',1)-1);
            else
               name=name.substr(0,Math.min(name.indexOf(' '),name.indexOf('/'),name.indexOf('>')));
            names.push(name);
         }
         var duplicates=new Array();
         if (names.length>0)
         {
            names.sort();
            var count=1;
            for (var i=1;i<names.length;i++)
               if (names[i]==names[i-1])
                  count++;
               else
               {
                  if (count>1)
                     duplicates.push(names[i-1]+" ("+count+")");
                  count=1;
               }
            if (count>1)
               duplicates.push(names[names.length-1]+" ("+count+")");
         }
         var allOrphans=new Array();
         parts=rules.replace(/<a[^>]*\shref="#/gi,"<a href=\"#").split("<a href=\"#");
         for (var i=1;i<parts.length;i++)
         {
            var name=parts[i];
            name=name.substr(0,name.indexOf('\"'));
            var foundIt=false;
            for (var j=0;j<names.length;j++)
               if (name==names[j])
               {
                  foundIt=true;
                  break;
               }
            if (!foundIt)
               allOrphans.push(name);
         }
         var orphans=new Array();
         if (allOrphans.length>0)
         {
            allOrphans.sort();
            var count=1;
            for (var i=1;i<allOrphans.length;i++)
               if (allOrphans[i]==allOrphans[i-1])
                  count++;
               else
               {
                  orphans.push(allOrphans[i-1]+" ("+count+")");
                  count=1;
               }
            orphans.push(allOrphans[allOrphans.length-1]+" ("+count+")");
         }
         var message="";
         if (duplicates.length>0)
            message+="The rules have the following duplicately named anchors:\n"+duplicates.join("\n")+"\n\n";
         if (orphans.length>0)
            message+="The rules reference the following non-existent anchors:\n"+orphans.join("\n")+"\n\n";
         if (message.length>0)
            alert(message.trim());
      }
      return this.constructor.prototype.openRules.apply(this,arguments);
   },
   $startTest:function(numPlayers,gameType)
   {
      this._rawGameLog={infos:[],status:[],teams:[],moves:[]};
      this.receiveData(this.$getTestGameData(numPlayers && numPlayers>0 ? numPlayers : this.$getTestNumPlayers(),gameType));
   },
   loadProfiler:function(profiler)
   {
      profiler.onAfterUpdate=new Function("profiler","update","GamesByEmail.Testing.profilerOnAfterUpdate(profiler,update);");
      this.$loadProfiler(profiler);
   },
   dispose:function()
   {
   }
};
GamesByEmail.Testing.$opacityMax=0.1;
GamesByEmail.Testing.$opacityValue=0;
GamesByEmail.Testing.$opacityTarget=0;
GamesByEmail.Testing.$opacityScrollStep=0.1;
GamesByEmail.Testing.$opacityUpDelay=500;
GamesByEmail.Testing.$opacityUpStep=0.01;
GamesByEmail.Testing.$opacityDownDelay=1;
GamesByEmail.Testing.$opacityDownStep=0.03;
GamesByEmail.Testing.$opacityInterval=50;
GamesByEmail.Testing.$opacityHandle=0;
GamesByEmail.Testing.$stealthFile="Stealth.png";
GamesByEmail.Testing.$stealthPanicUrl="http://msdn.microsoft.com/en-us/library/ms533054(VS.85).aspx";
GamesByEmail.Testing.setOpacity=function(opacity)
   {
      if (arguments.length>0)
         this.$opacityTarget=opacity;
      if (this.$opacityValue<this.$opacityTarget)
      {
         this.$opacityValue+=this.$opacityUpStep;
         if (this.$opacityValue>this.$opacityTarget)
            this.$opacityValue=this.$opacityTarget;
      }
      else
      {
         if (this.$opacityValue>this.$opacityMax)
            this.$opacityValue-=4*this.$opacityDownStep;
         else
            this.$opacityValue-=this.$opacityDownStep;
         if (this.$opacityValue<this.$opacityTarget)
            this.$opacityValue=this.$opacityTarget;
      }
      var e=document.getElementById("GamesByEmail_Testing_alphacontainer");
      if (e)
         if (document.all)
            e.style.filter="alpha(opacity="+Math.floor(this.$opacityValue*100)+")";
         else
            e.style.opacity=this.$opacityValue;
      if (this.$opacityValue==this.$opacityTarget)
      {
         if (this.$opacityHandle)
            this.$opacityHandle=window.clearInterval(this.$opacityHandle);
      }
      else
      {
         if (!this.$opacityHandle)
            this.$opacityHandle=window.setInterval("GamesByEmail.Testing.setOpacity()",this.$opacityInterval);
      }
   };
GamesByEmail.Testing.$opacityToggleHandle=0;
GamesByEmail.Testing.$opacityScrollPanic=false;
GamesByEmail.Testing.toggleOpacity=function(hide)
   {
      if (this.$opacityToggleHandle)
         window.clearTimeout(this.$opacityToggleHandle);
      if (hide)
         this.$opacityToggleHandle=window.setTimeout("GamesByEmail.Testing.setOpacity(0)",this.$opacityDownDelay);
      else
         if (this.$opacityValue<this.$opacityMax && !this.$opacityScrollPanic)
            this.$opacityToggleHandle=window.setTimeout("GamesByEmail.Testing.setOpacity("+this.$opacityMax+")",this.$opacityUpDelay);
   };
GamesByEmail.Testing.$opacityScrollTime=0;
GamesByEmail.Testing.scrollOpacity=function(event)
   {
      if (event.preventDefault)
         event.preventDefault();
      if (event.wheelDelta<0)
      {
         this.$opacityScrollTime=(new Date()).valueOf();
         if (this.$opacityValue<this.$opacityMax)
            this.setOpacity(this.$opacityMax);
         else
            this.setOpacity(this.$opacityValue+this.$opacityScrollStep);
         this.$opacityScrollPanic=false;
      }
      else
         if ((new Date()).valueOf()>this.$opacityScrollTime+250)
            if (this.$opacityValue<=this.$opacityMax)
            {
               this.$opacityScrollPanic=true;
               this.setOpacity(0);
            }
            else
               this.setOpacity(this.$opacityMax);
   };
GamesByEmail.Testing.setStealthMode=function()
   {
      //<div id=\"GamesByEmail_Testing_alphacontainer\" style=\"position:absolute;visibility:hidden;background-color:#ffffff\"></div>
      if (false && GamesByEmail_Testing_enableStealthMode)
      {
         this.setOpacity(0);
         document.body.style.backgroundImage="url("+GamesByEmail.Game.$getCodeFolder()+this.$stealthFile+")";
         var overCode="GamesByEmail.Testing.toggleOpacity(false)";
         var outCode="GamesByEmail.Testing.toggleOpacity(true)";
         var wheelCode="GamesByEmail.Testing.scrollOpacity(event)";
         var panicCode="if (GamesByEmail.Testing.$opacityValue==0){GamesByEmail.Testing.setOpacity=new Function;window.location.href='"+this.$stealthPanicUrl.cEncode()+"';return false;}";
         if (document.attachEvent)
         {
            document.body.attachEvent("onmouseover",new Function(overCode));
            document.body.attachEvent("onmouseout",new Function(outCode));
            document.body.attachEvent("onmousewheel",new Function(wheelCode));
            document.body.attachEvent("onmousedown",new Function(panicCode));
         }
         else
         {
            document.body.addEventListener("mouseover",new Function("event",overCode),false);
            document.body.addEventListener("mouseout",new Function("event",outCode),false);
            document.body.addEventListener("mousewheel",new Function("event",wheelCode),false);
            document.body.addEventListener("mousedown",new Function("event",panicCode),false);
         }
      }
      var e=document.getElementById("GamesByEmail_Testing_alphacontainer");
      if (e)
         e.style.visibility="visible";
   };
GamesByEmail.Testing.beginTest=function(classNameHint)
   {
      GamesByEmail.Testing.setStealthMode();
      GamesByEmail.Game.$popupBase="../";
      var game=GamesByEmail.Testing.addTestGame("GamesByEmailTest",classNameHint);
      if (window.location.hash.search(/Pl(\-?\d+)t(\-?\d+)w(\d+)h(\d+)p/)>=0)
         game.addProfiler({popupLeft:parseInt(RegExp.$1),popupTop:parseInt(RegExp.$2),popupWidth:parseInt(RegExp.$3),popupHeight:parseInt(RegExp.$4)});
      return game;
   };
GamesByEmail.Testing.profilerOnAfterUpdate=function(profiler,update)
   {
      var r=profiler.getWindowRectangle();
      if (r)
         window.location.hash="#Pl"+r.left+"t"+r.top+"w"+r.width+"h"+r.height+"p";
      else
         window.location.hash="#";
   };
GamesByEmail.Testing.extendGameForTesting=function(game,previewing)
   {
      game.testing=true;
      game.previewing=previewing;
      var property=null;
      game.$loadProfiler=game.loadProfiler;
      while (property=Foundation.getNextCustomPropertyName(this.prototype,property))
         game[property]=this.prototype[property];
      return game;
   };
GamesByEmail.Testing.addTestGame=function(elementId,classNameHint,hideTestControls)
   {
      var gameClass=GamesByEmail.Game.$classFromNameHint(classNameHint);
      var game=new gameClass();
      if (hideTestControls)
         game.hideTestControls=true;
      this.extendGameForTesting(game,false);
      document.getElementById(elementId).innerHTML=game.getHtml();
      game.$startTest();
      return game;
   };
GamesByEmail.Testing.previewGame=function(elementId,gameType,numPlayers,properties)
   {
      var gameClass=GamesByEmail.Game.$classFromGameType(gameType);
      var game=new gameClass();
      this.extendGameForTesting(game,true);
      if (properties)
         for (var i in properties)
            if (i!="prototype" && i!="constructor")
               game[i]=properties[i];
      
      document.getElementById(elementId).innerHTML=game.getHtml();
      game.$startTest(numPlayers);
      return game;
   };
GamesByEmail.Testing.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Testing.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Testing.$constructor();

}
function debug()
{
   return GamesByEmail.debug.apply(GamesByEmail,arguments);
}