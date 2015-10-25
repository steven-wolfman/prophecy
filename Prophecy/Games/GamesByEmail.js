/*
GamesByEmail
Copyright © 1998-2011 Scott Nesin, all rights reserved.
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
Foundation.establishNamespace("GamesByEmail");
GamesByEmail.GAME_TYPE={CHESS:0,
              BACKGAMMON:1,
              CHECKERS:2,
              REVERSI:3,
              LINK_4:4,
              ATAXX:5,
              TWIXT:6,
              XIANGQI:7,
              DARK_CHESS:8,
              OMEGA_CHESS:9,
              DARK_OMEGA_CHESS:10,
              CHINESE_CHECKERS:11,
              TRIVERSI:12,
              DEADGAMMON:13,
              HYPERGAMMON:14,
              NACKGAMMON:15,
              GAMBIT:16,
              DARK_GAMBIT:17,
              BLIND_GAMBIT:18,
              SPY_GAMBIT:19,
              GIPF:20,
              ZERTZ:21,
              DVONN:22,
              DARK_XIANGQI:23,
              TIC_TAC_TOE:24,
              REFLEKTIT:25,
              BLIND_TRIVERSI:26,
              MCCOOEY_HEX_CHESS:27,
              DARK_MCCOOEY_HEX_CHESS:28,
              GO:29,
              GO_13X13:30,
              GO_9X9:31,
              POLITICS:32,
              WW2:33,
              YINSH:34,
              BLITZ_YINSH:35,
              BYTE_8X8:36,
              BYTE_10X10:37,
              SNAG:38,
              ELUDE:39,
              DARK_ELUDE:40,
              PLOT:41,
              DARK_PLOT:42,
              BLIND_PLOT:43,
              MERGERS:44,
              FIVES:45,
              DARK_ATAXX:46,
              NINE_MENS_MORRIS:47,
              TANBO:48,
              DIPOLE:49,
              CEPHALOPOD:50,
              ATOLL:51,
              RUSH:52,
              CROSSWAY:53,
              CROSSWAY_PIED:54,
              SCRIBE:55,
              SUPERGLYPH_SCRIBE:56,
              DIFFUSION:57,
              COPOLYMER:58,
              OUST_SQUARE_OLD:59,
              BEGIRD:60,
              BEGIRD_PIED:61,
              PALISADE:62,
              IMPASSE:63,
              QUADRATURE:64,
              MECHA:65,
              EMPIRES:66,
              LARIAT:67,
              LARIAT_PIED:68,
              VIKTORY2:69,
              ATOLL_PIED:70,
              LOOPHOLE_2D:71,
              GOMOKU:72,
              PLATEAU:73,
              CAPTURE_THE_FLAG:74,
              BATTLE_BOATS:75,
              CAGE:76,
              OUST_SQUARE:77,
              OUST_HEX:78,
              FLUME_SQUARE:79,
              FLUME_SQUARE_PIED:80,
              FLUME_HEX:81,
              FLUME_HEX_PIED:82,
              FRACTAL:83,
              X:84,
              RIVE:85,
              PHALANX:86
             };
GamesByEmail.ARROW_KEY_CODE={LEFT:37,RIGHT:39,UP:38,DOWN:40
                  };
GamesByEmail.CURSOR=(typeof(document)=="object" && typeof(navigator)=="object" && document.all && navigator.userAgent.indexOf("Opera")<0) ? {HAND:"hand"} : {HAND:"pointer"};
GamesByEmail.notIe=(typeof(document)!="object" || typeof(document.all)!="object");
GamesByEmail.isIe=(typeof(document)=="object" && typeof(document.all)=="object");
GamesByEmail.isLeftButtonEvent=function(event,allowKeyboardModifier)
   {
      if (allowKeyboardModifier && event.shiftKey)
         return false;
      if (typeof(event.which)=="undefined")
         return event.button==1;
      return (event.which==1);
   };
GamesByEmail.isMiddleButtonEvent=function(event)
   {
      if (typeof(event.which)=="undefined")
         return event.button==4;
      if (typeof(event.button)=="undefined")
         return event.which==2;
      if (event.which==2)
         return event.button==1 || event.button==2 || event.button==4;
      if (event.which==3)
         return event.button==3;
      return false;
   };
GamesByEmail.isRightButtonEvent=function(event,allowKeyboardModifier)
   {
      if (allowKeyboardModifier && event.shiftKey)
         return true;
      if (typeof(event.which)=="undefined")
         return event.button==2;
      if (typeof(event.button)=="undefined")
         return event.which==3;
      if (event.which==3)
         return event.button==2;
      if (event.which==2)
         return event.button==3;
      return false;
   };
GamesByEmail.inProduction=function()
   {
      return (window.location.protocol=="http:" && window.location.href.indexOf("localhost")<0 && window.location.href.indexOf("192.168")<0 && window.location.href.indexOf("127.0")<0);
   };
GamesByEmail.imgSetClip=function(img,bx,by,ix,iy,iw,ih)
   {
      if (img)
      {
         img.style.left=bx-ix;
         img.style.top=by-iy;
         img.style.clip="rect("+iy+"px,"+(iw+ix)+"px,"+(ih+iy)+"px,"+ix+"px)";
      }
      return ";display:block;position:absolute;left:"+(bx-ix)+";top:"+(by-iy)+";clip:rect("+iy+"px,"+(iw+ix)+"px,"+(ih+iy)+"px,"+ix+"px)";
   };
GamesByEmail.positionImage=function(img,b,i)
   {
      if (b.constructor==Foundation.Rectangle)
         return GamesByEmail.imgSetClip(img,b.x+Math.floor((b.width-i.width)/2),b.y+Math.floor((b.height-i.height)/2),i.x,i.y,i.width,i.height);
      else
         return GamesByEmail.imgSetClip(img,b.x-Math.floor(i.width/2),b.y-Math.floor(i.height/2),i.x,i.y,i.width,i.height);
   };
GamesByEmail.clippedImageHtml=function(src,clipRect,styles,attributes)
   {
      var html="";
      if (typeof(styles)!="string") styles="";
      if (typeof(attributes)!="string") attributes="";
      html+="<table style=\"display:inline;\" cellspacing=0 cellpadding=0 border=0><tr><td style=\"width:"+clipRect.width+"px;height:"+clipRect.height+"px;"+styles+"\" "+attributes+" onmousedown=\"if(event.preventDefault)event.preventDefault();\">";
      html+="<div style=\"overflow:hidden;width:"+clipRect.width+"px;height:"+clipRect.height+"px;\">";
      html+="<img src=\""+src.htmlEncode()+"\" style=\"position:relative;left:-"+clipRect.x+";top:-"+clipRect.y+"\" border=0 galleryimg=false>";
      html+="</div>";
      html+="</td></tr></table>";
      return html;
   };
GamesByEmail.clippedImageHtml_I_HATE_SAFARI=function(src,clipRect,styles,attributes)
   {
      var html="";
      if (typeof(styles)!="string") styles="";
      if (typeof(attributes)!="string") attributes="";
      html+="<div style=\"display:inline;overflow:hidden;width:"+clipRect.width+"px;height:"+clipRect.height+"px;\">";
      html+="<img src=\""+src.htmlEncode()+"\" style=\"position:relative;left:-"+clipRect.x+";top:-"+clipRect.y+"\" border=0>";
      html+="</div>";
      return html;
   };
GamesByEmail.transparentPngUnsupported=(typeof(navigator)=="object" && navigator.appVersion.split("MSIE").length>1 && parseFloat(navigator.appVersion.split("MSIE")[1])<7);
GamesByEmail.getHaloedTextHtml=function(text,oneLine,textColor,haloColor)
   {
      var html="";
      if (oneLine)
      {
         if (!textColor)
            textColor="white";
         if (!haloColor)
            haloColor="black";
         html+="<span style=\"white-space:nowrap;position:relative;color:"+textColor+";\">";
         html+=text.htmlEncode();
         html+="<span style=\"position:absolute;left:0;top:-1;color:"+haloColor+";z-index:-1\">";
         html+=text.htmlEncode();
         html+="</span>";
         html+="<span style=\"position:absolute;left:-1;top:0;color:"+haloColor+";z-index:-1\">";
         html+=text.htmlEncode();
         html+="</span>";
         html+="<span style=\"position:absolute;left:1;top:0;color:"+haloColor+";z-index:-1\">";
         html+=text.htmlEncode();
         html+="</span>";
         html+="<span style=\"position:absolute;left:0;top:1;color:"+haloColor+";z-index:-1\">";
         html+=text.htmlEncode();
         html+="</span>";
         html+="</span>";
      }
      else
         for (var i=0;i<text.length;i++)
            html+=arguments.callee(text.charAt(i),true,textColor,haloColor);
      return html;   
   };
GamesByEmail.random=function(h,l)
   {
      if (arguments.length<2) l=0;
      var d=h-l+1;
      return Math.floor(Math.random()*d*1000000)%d+l;
   };
GamesByEmail.dieRoll=function()
   {
      return GamesByEmail.random(6,1);
   };
GamesByEmail.diceRolls=function(num)
   {
      var rolls=new Array(num);
      for (var i=0;i<num;i++)
         rolls[i]=GamesByEmail.dieRoll();
      return rolls;
   };
GamesByEmail.elementPageOffset=function(element)
   {
      var offset=new Foundation.Point(0,0);
      while (element!=null)
      {
         offset.x+=element.offsetLeft;
         if (element.clientLeft)
            offset.x+=element.clientLeft;
         offset.y+=element.offsetTop;
         if (element.clientTop)
            offset.y+=element.clientTop;
         if (element!=document.body)
         {
            offset.x-=element.scrollLeft;
            offset.y-=element.scrollTop;
         }
         element=element.offsetParent;
      }
      return offset;
   };
GamesByEmail.elementPageRectangle=function(element)
   {
      var rectangle=new Foundation.Rectangle();
      rectangle.resize(element.offsetWidth,element.offsetHeight);
      rectangle.add(GamesByEmail.elementPageOffset(element));
      rectangle.subtract(document.body.scrollLeft,document.body.scrollTop);
      return rectangle;
   };
GamesByEmail.elementHasIdInHierarchy=function(element,id)
   {
      if (id)
         while (element)
            if (element.id==id)
               return true;
            else
               element=element.parentNode;
      return false;
   };
GamesByEmail.expandingTextareaHtml=function(id,width,lineHeight,maxLines,additionalStyle,additionalAttributes)
   {
      var html="";
      if (!additionalStyle)
         additionalStyle="";
      if (!additionalAttributes)
         additionalAttributes="";
      if (window.navigator.appVersion.toLowerCase().indexOf("safari")>=0)
         html+="<textarea id=\""+id+"\" name=\""+id+"\" rows=2 style=\"width:"+width+";"+additionalStyle+"\" "+additionalAttributes+"></textarea>";
      else
      {
         html+="<div id=\"asdf\" style=\"position:relative;width:"+width+";height:"+(lineHeight+6)+"px\">";
         html+="<textarea id=\""+id+"\" name=\""+id+"\" rows=1 onkeyup=\"GamesByEmail.expandingTextarea_onkeyup(this,"+lineHeight+","+maxLines+");\" style=\"position:absolute;top:0;width:100%;height:"+(lineHeight+6)+";"+additionalStyle+"\" onfocus=\"this.onkeyup();\" onblur=\"this.onkeyup();\" onpaste=\"window.setTimeout(&quot;document.getElementById('&quot;+this.id+&quot;').onkeyup();&quot;,1);\" oncut=\"this.onpaste();\" "+additionalAttributes+"></textarea>";
         html+="</div>";
      }
      return html;
   };
GamesByEmail.expandingTextarea_onkeyup=function(element,lineHeight,maxLines)
   {
      if (document.all)
      {
         var sh=element.scrollHeight;
         if (sh>maxLines*lineHeight+4)
         {
            element.style.overflow="auto";
            sh=maxLines*lineHeight+4;
         }
         else
            element.style.overflow="hidden";
         element.style.top=parseInt(element.style.top)-(sh-element.clientHeight);
         element.style.height=element.offsetHeight+(sh-element.clientHeight);
      }
      else
      {
         var h;
         if (element.scrollHeight>maxLines*lineHeight)
            if (element.offsetHeight>maxLines*lineHeight)
               return;
            else
               h=maxLines*lineHeight+2;
         else
         {
            element.style.height=0;
            var x=(element.scrollHeight-element.clientHeight);
            h=element.offsetHeight+x;
         }
         var t=0;
         if (element.scrollWidth>element.clientWidth)
            h+=(t=lineHeight+4);
         if (h>maxLines*lineHeight+2)
            h=maxLines*lineHeight+2;
         element.style.top=lineHeight+2-h+t;
         element.style.height=h;
      }
   };
GamesByEmail.insertStyleForElements=function(html,tagName,style)
   {
      tagName=tagName.toLowerCase();
      style=style.htmlEncode();
      html=html.replace(new RegExp("<"+tagName,"i"),"<"+tagName);
      var tables=html.split("<"+tagName);
      html=new Foundation.StringBuilder();
      html.append(tables[0]);

      for (var i=1;i<tables.length;i++)
      {
         html.append("<").append(tagName);
         var t=tables[i];
         var e=t.indexOf(">");
         var s=t.indexOf("style=\"");
         if (s<0 || e<s)
            html.append(" style=\"").append(style).append("\"").append(t);
         else
            html.append(t.substr(0,s+7)).append(style).append(";").append(t.substr(s+7));
      }
      return html.toString();
   };
GamesByEmail.getHexString=function(value,minLength)
   {
      var hex=value.toString(16);
      while (minLength && hex.length<minLength)
         hex="0"+hex;
      return hex;
   };
GamesByEmail.deepCopy=function(o)
   {
      if (o==null)
         return null;
      var c;
      if (o.constructor==Array)
         c=new Array();
      else
         c=new Object();
      for (var i in o)
         if (typeof(o[i])=="object")
            c[i]=GamesByEmail.deepCopy(o[i]);
         else
            if (typeof(o[i])!="function")
               c[i]=o[i];
      return c;
   };
GamesByEmail.shallowCopy=function(o)
   {
      if (o==null)
         return null;
      var c;
      if (o.constructor==Array)
         c=new Array();
      else
         c=new Object();
      for (var i in o)
         c[i]=o[i];
      return c;
   };
GamesByEmail.elementTitleAttributes=function(title)
   {
      return " onmouseover=\"GamesByEmail.elementTitleOpen(event,'"+title.cEncode().htmlEncode()+"');\" onmousemove=\"GamesByEmail.elementTitleMove(event);\" onmouseout=\"GamesByEmail.elementTitleClose();\" ";
   };
GamesByEmail.elementTitleOpenDelay=0;
GamesByEmail.elementTitle=null;
GamesByEmail.elementTitleTimer=0;
GamesByEmail.elementTitleAdded=false;
GamesByEmail.elementTitleOpen=function(event,titleHtml)
   {
      GamesByEmail.elementTitle=document.getElementById("GamesByEmail_ElementTitle");
      GamesByEmail.elementTitleClose();
      GamesByEmail.elementTitle.innerHTML="<div style=\"padding:4;border:1px solid #000000\">"+titleHtml+"</div>";
      GamesByEmail.elementTitleOffset(event);
      GamesByEmail.elementTitleTimer=window.setTimeout("GamesByEmail.elementTitleShow();",GamesByEmail.elementTitleOpenDelay);
   };
GamesByEmail.elementTitleHtml=function()
   {
      var html="";
      if (!GamesByEmail.elementTitleAdded)
      {
         html+="<table width=\"100%\"><tr><td><div id=\"GamesByEmail_ElementTitle\" style=\"position:absolute;visibility:hidden;left:0;top:0;background-color:#FFFFE1;color:#000000;font:11px arial;z-index:100000;border:1px solid #ffffff\"></div></td></tr></table>";
         GamesByEmail.elementTitleAdded=true;
      }
      return html;
   };
GamesByEmail.elementTitleOffset=function(event)
   {
      if (!GamesByEmail.elementTitle)
         GamesByEmail.elementTitle=document.getElementById("GamesByEmail_ElementTitle");
      var x,y,w,h;
      w=GamesByEmail.elementTitle.offsetWidth;
      h=GamesByEmail.elementTitle.offsetHeight;
      if (GamesByEmail.notIe)
      {
         x=event.pageX;
         y=event.pageY-4;
         if (x-document.body.scrollLeft>document.body.clientWidth-w)
            x-=w;
         if (y-document.body.scrollTop>document.body.clientHeight-h)
            y-=h+14;
         else
            y+=14;
         if (event.target.tagName!="SPAN" && event.target.tagName!="TD")
            y+=14;
      }
      else
      {
         x=event.clientX+document.body.scrollLeft;
         y=event.clientY+document.body.scrollTop+5;
         if (x-document.body.scrollLeft>document.body.clientWidth-w)
            x-=w;
         if (y-document.body.scrollTop>document.body.clientHeight-h)
            y-=h+10;
         else
            y+=14;
      }
      GamesByEmail.elementTitle.style.left=x;
      GamesByEmail.elementTitle.style.top=y;
   };
GamesByEmail.elementTitleMove=function(event)
   {
      if (GamesByEmail.elementTitle && GamesByEmail.elementTitle.style.visibility!="visible")
      {
         GamesByEmail.elementTitleOffset(event);
         if (GamesByEmail.elementTitleTimer!=0)
            window.clearTimeout(GamesByEmail.elementTitleTimer);
         GamesByEmail.elementTitleTimer=window.setTimeout("GamesByEmail.elementTitleShow();",GamesByEmail.elementTitleOpenDelay);
      }
   };
GamesByEmail.elementTitleShow=function()
   {
      if (GamesByEmail.elementTitle)
         GamesByEmail.elementTitle.style.visibility="visible";
      GamesByEmail.elementTitleTimer=0;
   };
GamesByEmail.elementTitleClose=function()
   {
      if (GamesByEmail.elementTitle)
         GamesByEmail.elementTitle.style.visibility="hidden";
      if (GamesByEmail.elementTitleTimer!=0)
      {
         window.clearTimeout(GamesByEmail.elementTitleTimer);
         GamesByEmail.elementTitleTimer=0;
      }
   };
GamesByEmail.getBestBwContrast=function(r,g,b)
   {
      if (arguments.length==1)
         return arguments.callee(parseInt(r.substr(1,2),16),parseInt(r.substr(3,2),16),parseInt(r.substr(5,2),16)) ? "#000000" : "#ffffff";
      var brightness=0.3126*Math.pow((r/255),2.2)+0.5152*Math.pow((g/255),2.2)+0.1722*Math.pow((b/255),2.2);
      return brightness>0.333;
   };
GamesByEmail.findFirstGame=function()
   {
      return GamesByEmail.Game.getFirst(true);
   };
GamesByEmail.debug=function()
   {
      var g=GamesByEmail.findFirstGame();
      if (g)
         g.debug.apply(g,arguments);
      return true;
   };
GamesByEmail.Piece=function(pieces,index,boardValue,valueIndex,hidden)
{
   this.pieces=pieces;
   this.index=index;
   this.valueIndex=valueIndex;
   this.setBoardValue(boardValue,true);
   this.boardPoint=this.pieces.game.boardPointFromValueIndex(this.valueIndex);
   this.hidden=(hidden || this.pieces.game.isBoardPointHidden(this.boardPoint) ? true : false);
};
GamesByEmail.Piece.$parentClass=null;
GamesByEmail.Piece.$constructor=function(){};
GamesByEmail.Piece.$interfaces=new Array();
GamesByEmail.Piece.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Piece);
GamesByEmail.Piece.$name="Piece";
GamesByEmail.Piece.$childClasses=new Array();
GamesByEmail.Piece.$container=GamesByEmail;
GamesByEmail.Piece.prototype={
   constructor:GamesByEmail.Piece,
   center:function(screenPoint,noConstrain)
   {
      var img=this.getElement();
      if (img)
      {
         var screenRect=new Foundation.Rectangle();
         screenRect.resize(this.pieces.game.board.squareSize);
         var clipRect=this.getClipRect();
         if (screenRect.width%2!=clipRect.width%2)
            screenRect.width++;
         if (screenRect.height%2!=clipRect.height%2)
            screenRect.height++;
         screenRect.center(screenPoint).floor();
         if (!noConstrain)
            screenRect=this.pieces.game.constrainRectangle(screenRect);
         img.style.zIndex=900;
         GamesByEmail.positionImage(img,screenRect,clipRect);
         img.style.visibility="visible";
      }
   },
   positionImage:function(img,screenRect,clipRect)
   {
      return GamesByEmail.positionImage(img,screenRect,clipRect);
   },
   snap:function(boardPoint,boardValueOverride)
   {
      var img=this.getElement();
      if (img)
      {
         var clipRect=arguments.length>1 && boardValueOverride!=null ? this.pieces.game.getPieceRect(boardValueOverride,this.pieces.game.valueFromBoardValue(boardValueOverride),this.pieces.game.colorFromBoardValue(boardValueOverride),this.boardPoint) : this.getClipRect();
         img.style.zIndex=900;
         this.positionImage(img,this.getScreenRect(boardPoint),clipRect);
         img.style.visibility="visible";
      }
   },
   move:function(boardPoint,hidden)
   {
      this.boardPoint=(boardPoint ? boardPoint.clone() : null);
      this.pieces.setModified(this);
      if (arguments.length>1)
         this.hidden=hidden;
      this.reset();
   },
   setValue:function(value,noReset)
   {
      this.value=value;
      this.boardValue=this.pieces.game.boardValueFromValueColor(this.value,this.color);
      this.pieces.setModified(this);
      if (!noReset)
         this.reset();
   },
   setColor:function(color,noReset)
   {
      this.color=color;
      this.boardValue=this.pieces.game.boardValueFromValueColor(this.value,this.color);
      this.pieces.setModified(this);
      if (!noReset)
         this.reset();
   },
   setValueAndColor:function(value,color,noReset)
   {
      this.value=value;
      this.color=color;
      this.boardValue=this.pieces.game.boardValueFromValueColor(this.value,this.color);
      this.pieces.setModified(this);
      if (!noReset)
         this.reset();
   },
   setBoardValue:function(boardValue,noReset)
   {
      this.boardValue=boardValue;
      this.value=this.pieces.game.valueFromBoardValue(this.boardValue);
      this.color=this.pieces.game.colorFromBoardValue(this.boardValue);
      this.pieces.setModified(this);
      if (!noReset)
         this.reset();
   },
   getBoardValue:function()
   {
      return this.boardValue;
   },
   setHidden:function(hidden)
   {
      this.setVisibility(this.hidden=hidden);
   },
   setVisibility:function(hidden)
   {
      var img=this.getElement();
      if (img)
         img.style.visibility=hidden ? "hidden" : "visible";
   },
   remove:function()
   {
      this.setVisibility(true);
      this.pieces[this.index]=null;
      this.pieces.setModified(this);
   },
   reset:function(boardValueOverride,visibilityOverride)
   {
      var img=this.getElement();
      if (img)
      {
         var clipRect=arguments.length>0 && boardValueOverride!=null ? this.pieces.game.getPieceRect(boardValueOverride,this.pieces.game.valueFromBoardValue(boardValueOverride),this.pieces.game.colorFromBoardValue(boardValueOverride),this.boardPoint) : this.getClipRect();
         img.style.zIndex=800;
         img.style.visibility=(arguments.length>1 ? !visibilityOverride : ((!clipRect || !this.boardPoint || this.hidden))) ? "hidden" : "visible";
         if (this.boardPoint && clipRect)
            this.positionImage(img,this.getScreenRect(),clipRect);
      }
   },
   getImageSrc:function()
   {
      return this.pieces.game.getPieceSrc();
   },
   getClipRect:function()
   {
      return this.pieces.game.getPieceRect(this.boardValue,this.value,this.color,this.boardPoint);
   },
   getScreenRect:function(boardPoint)
   {
      if (typeof(boardPoint)=="undefined")
         boardPoint=this.boardPoint;
      return (boardPoint ? this.pieces.game.screenRectFromBoardPoint(boardPoint) : new Foundation.Rectangle());
   },
   isColor:function(color)
   {
      return (this.boardPoint && !this.hidden && this.color==color);
   },
   isOurs:function()
   {
      return this.isColor(this.pieces.game.player.team.color);
   },
   appendHtml:function(htmlBuilder)
   {
      var screenRect=this.getScreenRect();
      var clipRect=this.getClipRect();
      if (screenRect && clipRect)
         htmlBuilder.append("<img id=\""+this.elementId()+"\" src=\""+this.getImageSrc().htmlEncode()+"\" style=\""+this.positionImage(null,screenRect,clipRect).htmlEncode()+";visibility:"+(!this.hidden && this.boardPoint ? "visible" : "hidden")+";z-index:"+(this.valueIndex<0 ? "850" : "800")+"\">");
      else
         htmlBuilder.append("<img id=\""+this.elementId()+"\" src=\""+this.getImageSrc().htmlEncode()+"\" style=\"position:absolute;top:0;left:0;visibility:hidden;z-index:"+(this.valueIndex<0 ? "850" : "800")+"\">");
      return htmlBuilder;
   },
   event:function(code,delayed)
   {
      return this.pieces.game.event("pieces["+this.index+"]"+(code ? "."+code : ""),delayed);
   },
   getElement:function(id)
   {
      return this.pieces.game.getElement("piece_"+this.index+(id ? "_"+id : ""));
   },
   elementId:function(id)
   {
      return this.pieces.game.elementId("piece_"+this.index+(id ? "_"+id : ""));
   },
   occupiesBoardPoint:function(boardPoint)
   {
      if (boardPoint==null)
         return this.boardPoint==null;
      return boardPoint.equals(this.boardPoint);
   },
   doFlash:function(flashOn,flashValue)
   {
      if (flashValue==null)
         this.setVisibility(flashOn);
      else
         this.reset(flashOn ? flashValue : null);
   },
   dispose:function()
   {
   }
};
GamesByEmail.Piece.create=function(pieces,index,value,valueIndex)
   {
      return new this(pieces,index,value,valueIndex);
   };
GamesByEmail.Piece.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Piece.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Piece.$constructor();
GamesByEmail.Pieces=function(){var $_=null;if(this.constructor==arguments.callee){$_=new Array;$_.constructor=arguments.callee;for(var i in arguments.callee.prototype)$_[i]=arguments.callee.prototype[i];}(function(game)
{
   this.game=game;
   this.flashValue=null;
}).apply($_!=null?$_:this,arguments);if($_!=null)return $_;};
GamesByEmail.Pieces.$parentClass=Array;
if (!Array.$childClasses) Array.$childClasses=new Array();
Array.$childClasses.push(GamesByEmail.Pieces);
GamesByEmail.Pieces.$constructor=function(){};
GamesByEmail.Pieces.$interfaces=new Array();
GamesByEmail.Pieces.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Pieces);
GamesByEmail.Pieces.$name="Pieces";
GamesByEmail.Pieces.$childClasses=new Array();
GamesByEmail.Pieces.$container=GamesByEmail;
GamesByEmail.Pieces.prototype={
   constructor:GamesByEmail.Pieces,
   setValue:function(value)
   {
      var pieceClass=this.game.resource("pieceClass");
      this.clear();
      var html=new Foundation.StringBuilder();
      var dataLength=this.game.blankValue.length;
      if (dataLength==0)
         dataLength=value.length;
      var piece;
      if (this.game.board.pieceDataSize<0)
      {
         var v=value.split(this.game.board.pieceDelimeterChar);
         for (var i=1;i<v.length;i+=2)
            if (piece=pieceClass.create(this,this.length,v[i],parseInt(v[i-1])))
            {
               this.push(piece);
               piece.appendHtml(html);
            }
      }
      else
      {
         var pieceDataSize=this.game.board.pieceDataSize;
         var clearPointValue=this.game.board.clearPointValue;
         for (var i=0;i<value.length && i<dataLength;i+=pieceDataSize)
         {
            var v=value.substr(i,pieceDataSize);
            if (v!=clearPointValue && (piece=pieceClass.create(this,this.length,v,i)))
            {
               this.push(piece);
               piece.appendHtml(html);
            }
         }
      }
      piece=pieceClass.create(this,this.length,"",-1,true);
      this.push(piece);
      this.valueCache=value.substr(0,Math.min(value.length,dataLength));
      piece.appendHtml(html);
      this.game.setInnerHtml("pieces",html.toString());
   },
   getNewPiece:function()
   {
      return this[this.length-1];
   },
   getValue:function()
   {
      var value;
      if (this.game.board.pieceDataSize<0)
         if (this.valueCache)
         {
            value=this.valueCache;
            var piece,valueIndex,v;
            if ((piece=this.getNewPiece()) &&
                (valueIndex=this.game.valueIndexFromBoardPoint(piece.boardPoint))>=0 &&
                (v=piece.getBoardValue())!=null)
            {
               if (value.length>0)
                  value+=this.game.board.pieceDelimeterChar;
               value+=valueIndex+this.game.board.pieceDelimeterChar+v;
            }
         }
         else
         {
            value="";
            var v;
            for (var i=0;i<this.length;i++)
            {
               var piece=this[i];
               if (piece)
               {
                  var valueIndex=this.game.valueIndexFromBoardPoint(piece.boardPoint);
                  if (valueIndex>=0 && (v=piece.getBoardValue())!=null)
                  {
                     if (value.length>0)
                        value+=this.game.board.pieceDelimeterChar;
                     value+=valueIndex+this.game.board.pieceDelimeterChar+v;
                  }
               }
            }
         }
      else
         if (this.valueCache)
         {
            value=this.valueCache;
            var piece,valueIndex,v;
            if ((piece=this.getNewPiece()) &&
                (valueIndex=this.game.valueIndexFromBoardPoint(piece.boardPoint))>=0 &&
                (v=piece.getBoardValue())!=null)
               value=value.setAt(valueIndex,v);
         }
         else
         {
            value=this.game.blankValue;
            var v;
            for (var i=0;i<this.length;i++)
            {
               var piece=this[i];
               if (piece)
               {
                  var valueIndex=this.game.valueIndexFromBoardPoint(piece.boardPoint);
                  if (valueIndex>=0 && (v=piece.getBoardValue())!=null)
                     value=value.setAt(valueIndex,v);
               }
            }
         }
      return value;
   },
   clear:function()
   {
      this.length=0;
   },
   countColor:function(color)
   {
      var num=0;
      for (var i=0;i<this.length;i++)
         if (this[i] &&
             this[i].boardPoint &&
             this[i].color==color)
            num++;
      return num;
   },
   updateInnerHtml:function(htmlBuilder)
   {
      this.game.setInnerHtml("pieces",this.appendInnerHtml(new Foundation.StringBuilder()).toString());
   },
   appendInnerHtml:function(htmlBuilder)
   {
      for (var i=0;i<this.length;i++)
         if (this[i])
            this[i].appendHtml(htmlBuilder);
      this.appendHiliteHtml(htmlBuilder);
      return htmlBuilder;
   },
   appendHtml:function(htmlBuilder,boardSize)
   {
      htmlBuilder.append("<div id=\""+this.game.elementId("pieces")+"\" style=\"position:absolute;width:"+boardSize.x+"; height:"+boardSize.y+";overflow:hidden;z-index:800\">");
      this.appendInnerHtml(htmlBuilder);
      htmlBuilder.append("</div>");
      return htmlBuilder;
   },
   appendHiliteHtml:function(htmlBuilder)
   {
      return htmlBuilder;
   },
   updateBoardImageSize:function(imageSize)
   {
      var e;
      if (e=this.game.getElement("pieces"))
      {
         e.style.width=imageSize.x;
         e.style.height=imageSize.y;
      }
   },
   findAtPoint:function(boardPoint)
   {
      for (var i=0;i<this.length;i++)
         if (this[i] &&
             this[i].occupiesBoardPoint(boardPoint))
            return this[i];
      return null;
   },
   flash:function(numFlashes,doneCode)
   {
      if (!this.flashList)
         this.flashList=new Array();
      var flash=new Object();
      this.flashList[flash.index=this.flashList.length]=flash;
      flash.pieces=new Array();
      var points=new Array();
      flash.points=flash.points;
      for (var i=2;i<arguments.length;i++)
         if (typeof(arguments[i].length)=="number")
         {
            var list=arguments[i],j;
            for (var j=0;j<list.length;j++)
               points[points.length]=list[j].clone();
         }
         else
            points[points.length]=arguments[i].clone();
      for (var i=1;i<points.length;i++)
         for (var j=0;j<i;j++)
            if (points[i].equals(points[j]))
            {
               for (j=i+1;j<points.length;j++)
                  points[j-1]=points[j];
               points.length--;
               i--;
               break;
            }
      for (var i=0;i<points.length;i++)
         flash.pieces[flash.pieces.length]=this.findAtPoint(points[i]);
      flash.numberOfFlashes=numFlashes;
      flash.doneCode=doneCode;
      flash.count=0;
      flash.timerHandle=window.setInterval(this.game.event("pieces.doFlash("+flash.index+")"),this.game.resource("pieceFlashInterval"));
      this.doFlash(flash.index);
   },
   doFlash:function(flashIndex,cancel)
   {
      var flash=this.flashList[flashIndex];
      if (!flash)
         return;
      if (cancel)
         flash.count=2*flash.numberOfFlashes-1;
      for (var i=0;i<flash.pieces.length;i++)
         if (flash.pieces[i])
            flash.pieces[i].doFlash(flash.count%2==0,this.flashValue);
      flash.count++;
      if (flash.count/2==flash.numberOfFlashes)
      {
         this.flashList[flashIndex]=null;
         window.clearTimeout(flash.timerHandle);
         if (flash.doneCode && !cancel)
            eval(flash.doneCode,flash.points);
      }
   },
   cancelFlashes:function()
   {
      if (this.flashList)
         for (var i=0;i<this.flashList.length;i++)
            this.doFlash(i,true);
   },
   setModified:function(piece)
   {
      if (piece.index!=(this.length-1))
         this.valueCache=null;
   },
   dispose:function()
   {
      if (Array.prototype.dispose) Array.prototype.dispose.call(this);
   },
   indexOf:Array.prototype.indexOf
};
GamesByEmail.Pieces.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Pieces.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Pieces.$constructor();
GamesByEmail.Game=function()
{
      Foundation.Elemental.call(this);
      Foundation.Resourceful.call(this);
      Foundation.Server.call(this);
   this.id=0;
   this.testing=false;
   this.previewing=false;
   this.font=this.resource("defaultFont");
   this.type=(this.resource("gameTypes"))[0];
   this.setBoard("board");
   this.status=new GamesByEmail.GameStatus();
   this.status.uninitialized=true;
   this.title="";
   this.note="";
   this.message="";
   this.maxMoveNumber=-1;
   this.lastMove=null;
   this.areOfferingDraw=false;
   this.info=new GamesByEmail.Info();
   this.teams=new GamesByEmail.Teams(this,null);
   this.move=new GamesByEmail.Move(this);
   this.notify=new GamesByEmail.GameNotify();
   this.notify.play=true;
   this.rawGame=null;
   this.isLog=false;
   this.canPie=false;
   this.constrainer=null;
   this.logSettings=new GamesByEmail.LogSettings();
   this._lastLogIndex=-1;
   this.rotation=0;
   this.perspectiveColor=null;
   this.$dragByClickState=null;
   this.allowMouseKeyboardModifier=true;
   var piecesClass=this.resource("piecesClass");
   if (piecesClass)
      this.pieces=new piecesClass(this);
   else
   {
      var territoriesClass=this.resource("territoriesClass");
      if (territoriesClass)
         this.territories=new territoriesClass(this,this.resource("territoryClass"),this.resource("territories"));
   }
};
GamesByEmail.Game.$parentClass=null;
GamesByEmail.Game.$constructor=function(){};
GamesByEmail.Game.$interfaces=new Array();
GamesByEmail.Game.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Game);
GamesByEmail.Game.$interfaces.push(Foundation.Elemental);
if (!Foundation.Elemental.$childClasses) Foundation.Elemental.$childClasses=new Array();
Foundation.Elemental.$childClasses.push(GamesByEmail.Game);
GamesByEmail.Game.$interfaces.push(Foundation.Resourceful);
if (!Foundation.Resourceful.$childClasses) Foundation.Resourceful.$childClasses=new Array();
Foundation.Resourceful.$childClasses.push(GamesByEmail.Game);
GamesByEmail.Game.$interfaces.push(Foundation.Server);
if (!Foundation.Server.$childClasses) Foundation.Server.$childClasses=new Array();
Foundation.Server.$childClasses.push(GamesByEmail.Game);
GamesByEmail.Game.$name="Game";
GamesByEmail.Game.$childClasses=new Array();
GamesByEmail.Game.$container=GamesByEmail;
GamesByEmail.Game.prototype={
   constructor:GamesByEmail.Game,
   setBoard:function(resourceKey)
   {
      var b=this.resource(resourceKey);
      if (this.board!=b)
      {
         this.board=b;
         if (!this.board.pieceDataSize)
            this.board.pieceDataSize=1;
         if (this.board.pieceDataSize<0)
         {
            this.board.pieceDataScale=1;
            if (!this.board.pieceDelimeterChar)
               this.board.pieceDelimeterChar=' ';
         }
         else
         {
            this.board.pieceDataScale=this.board.pieceDataSize;
            if (!this.board.clearPointValue)
            {
               this.board.clearPointValue=" ";
               while (this.board.clearPointValue.length<this.board.pieceDataSize)
                  this.board.clearPointValue+=" ";
            }
         }
         this.perspectiveColor=null;
         this.updateBoardImageSize();
         this.updateBoardCaches();
         if (this.board && this.board.blankValue)
            this.blankValue=this.board.blankValue;
         else
            this.calculateBlankValue();
         return true;
      }
      return false;
   },
   updateBoardCaches:function()
   {
   },
   addToBlankValue:function(point)
   {
      if (this.valueIndexFromBoardPoint(point)>=0)
         this.blankValue+=this.board.clearPointValue;
   },
   calculateBlankValue:function()
   {
      this.blankValue="";
      if (this.board && this.board.size)
         this.forEachBoardPoint("addToBlankValue");
   },
   initialize:function(numPlayers,turnTeamIndex)
   {
      for (var i=0;i<numPlayers;i++)
      {
         var team=this.teams.add();
         team.players.add().id=i;
         team.status.inPlay=true;
         team.status.myTurn=(turnTeamIndex<0 || i==turnTeamIndex);
      }
   },
   elementTitleAttributes:function(title)
   {
      return GamesByEmail.elementTitleAttributes(this.washHtml(title));
   },
   setPlayerPrefs:function()
   {
      this.verbose=true;
      if (!this.spectating)
      {
         this.font=this.player.info.getValue("font");
         this.verbose=!this.player.info.getValue("b_noVerbose",!this.verbose);
      }
      if (!this.font)
         this.font=this.resource("defaultFont");
      return false;
   },
   assembleHeaderHtml:function(resourceName,defaultResource,team)
   {
      if (!team)
      {
         var team=this.status.playing ? this.getTurnTeam() : this.findWinningTeam();
      }
      if (!team)
         team=this.move.player.team;
      return this.resource(resourceName ? resourceName : defaultResource
                           ,'t',team ? team.title.htmlEncode() : ""
                           ,'p',team && team.players.length>0 ? team.players[0].title.htmlEncode() : ""
                          );
   },
   getHeaderHtml:function(resourceName)
   {
      if (this.status.playing)
         return this.gameInProgressHeaderHtml(resourceName);
      else
         return this.gameOverHeaderHtml(resourceName);
   },
   gameInProgressHeaderHtml:function(resourceName)
   {
      if (this.status.drawOffered && !this.madeMove)
         return this.drawOfferedHeaderHtml(resourceName);
      else
         if (this.status.drawDeclined && !this.madeMove)
            return this.drawDeclinedHeaderHtml(resourceName);
         else
            return this.turnHeaderHtml(resourceName);
   },
   drawOfferedHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"drawOfferedHeader");
   },
   drawDeclinedHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"drawDeclinedHeader");
   },
   turnHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"turnHeader");
   },
   gameOverHeaderHtml:function(resourceName)
   {
      if (this.status.draw)
         if (this.status.stalemate)
            return this.tieGameHeaderHtml(resourceName);
         else
            return this.drawAcceptedHeaderHtml(resourceName);
      else
         if (this.move.player.team.status.resigned)
            return this.resignedHeaderHtml(resourceName);
         else
            return this.wonHeaderHtml(resourceName);
   },
   drawAcceptedHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"drawGameHeader");
   },
   tieGameHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"tieGameHeader");
   },
   resignedHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"resignedHeader",this.move.player.team);
   },
   wonHeaderHtml:function(resourceName)
   {
      return this.assembleHeaderHtml(resourceName,"wonHeader");
   },
   getTeamAtDistance:function(distance)
   {
      var index=this.player.team.index+distance;
      while (index<0)
         index+=this.teams.length;
      while (index>=this.teams.length)
         index-=this.teams.length;
      return this.teams[index];
   },
   getTeamsForTitles:function(top)
   {
      var numTeams=this.teams.length;
      var howManyAcross=Math.floor((numTeams-1)/4)*2+1;
      var start=Math.floor(howManyAcross/2);
      var direction=-1;
      if (top)
      {
         howManyAcross=numTeams-howManyAcross;
         start++;
         direction=1;
      }
      var teams=new Array(howManyAcross);
      for (var i=0;i<howManyAcross;i++)
         teams[i]=this.getTeamAtDistance(start+(i*direction));
      return teams;
   },
   valueFromBoardValue:function(boardValue)
   {
      return boardValue==null ? null : boardValue.toLowerCase();
   },
   colorFromBoardValue:function(boardValue)
   {
      if (boardValue!=null)
      {
         var code=boardValue.charCodeAt(0);
         if (code>=97 && code<=122)
            return 0;
         if (code>=65 && code<=90)
            return 1;
      }
      return -1;
   },
   boardValueFromValueColor:function(value,color)
   {
      return color==0 ? value : value.toUpperCase();
   },
   getTeamResource:function(team,resourceName,defaultValue)
   {
      if (typeof(team)=="number" || team)
      {
         var color;
         if (typeof(team)=="number")
            color=team;
         else
         {
            color=team.color;
            if (color<0)
               color=this.teamColorFromTeam(team);
         }
         var r=this.resource(resourceName);
         if (r && r.length>0 && color<r.length)
            return r[color];
      }
      return defaultValue;
   },
   getTeamFontColor:function(team)
   {
      return this.getTeamResource(team,"teamFontColors","#000000");
   },
   getTeamLogFontColor:function(team)
   {
      var color=this.getTeamResource(team,"teamLogFontColors",null);
      return (color!=null ? color : this.getTeamFontColor(team));
   },
   getTeamLogFontBgColor:function(team)
   {
      return this.getTeamResource(team,"teamLogFontBgColors","");
   },
   getTeamTitleHtml:function(team,top)
   {
      if (team)
         return this.resource(team.isMyTurn() ? "turnTeamTitle" : "teamTitle"
                              ,'t',team.title.htmlEncode()
                              ,'p',team.players[0].title.htmlEncode()
                              ,'c',this.getTeamFontColor(team)
                             );
      return "";
   },
   getTeamTitlesHtml:function(top)
   {
      var teams=this.getTeamsForTitles(top);
      var html="";
      html+="<table border=0 cellspacing=0 cellpadding=0 width=\"100%\">";
      if (top)
         html+=this.aboveTeamTitleRowHtml(teams.length);
      html+="<tr>";
      var width=Math.floor(100/teams.length);
      for (var i=0;i<teams.length;i++)
      {
         html+="<td nowrap align=\""+this.getTeamTitleAlignment(teams[i],top,i,teams.length)+"\" width=\""+width+"%\" style=\"color:"+this.getTeamFontColor(teams[i])+"\">";
         html+=this.getTeamTitleHtml(teams[i],top);
         html+="</td>";
      }
      html+="</tr>";
      if (!top)
         html+=this.belowTeamTitleRowHtml(teams.length);
      html+="</table>";
      return html;
   },
   getTeamTitleAlignment:function(team,top,index,numTeams)
   {
      return "center";
   },
   aboveTeamTitleRowHtml:function(numCols)
   {
      return "";
   },
   belowTeamTitleRowHtml:function(numCols)
   {
      return "";
   },
   getGamePromptsHtml:function()
   {
      var html="";
      this.clearMouseEvents();
      if (this.spectating)
         html+=this.spectatingHtml();
      else
         if (!this.status.playing)
         {
            html+=this.gameOverHtml();
            html+=this.startAnotherGameHtml();
            html+=this.closeWindowHtml();
         }
         else
            if (!this.isMyTurn())
               html+=this.notYourTurnHtml();
            else
               html+=this.getTurnHtml();
      return html;
   },
   undoMoveHtml:function(resourceName)
   {
      var html="";
      if (this.verbose)
         html+=this.resource(resourceName ? resourceName : "youMayUndoYourMove"
                             ,'u',this.undoButtonHtml()
                            );
      else
         html+=this.undoButtonHtml();
      return html;
   },
   sendMoveHtml:function(resourceName)
   {
      var html="";
      if (this.readyToSend)
         if (this.verbose)
            html+=this.resource(resourceName ? resourceName : "youMaySendYourMove"
                                ,'s',this.sendMoveButtonHtml()
                               );
         else
            html+=this.sendMoveButtonHtml();
      return html;
   },
   offerDrawHtml:function(resourceName)
   {
      var html="";
      if (this.teams.length==2 && !this.status.drawOffered)
      {
         if (this.verbose)
            html+=this.resource(resourceName ? resourceName : "youMayOfferDraw"
                                ,'t',this.player.team.nextTeam().title.htmlEncode()
                               );
         html+=this.resource("offerDrawWithThisMove"
                             ,'c',this.offerDrawCheckBoxHtml()
                             ,'i',this.elementId("offerDraw")
                            );
      }
      return html;
   },
   acceptDeclineDrawHtml:function(resourceName)
   {
      var html="";
      if (this.status.drawOffered)
         if (this.verbose)
            html+=this.resource(resourceName ? resourceName : "acceptOrDeclineDraw"
                                ,'t',this.player.team.nextTeam().title.htmlEncode()
                                ,'a',this.acceptDrawButtonHtml()
                               );
         else
            html+=this.acceptDrawButtonHtml();
      return html;
   },
   drawDeclinedHtml:function(resourceName)
   {
      var html="";
      if (this.verbose && this.status.drawDeclined)
         html+=this.resource(resourceName ? resourceName : "theyDeclinedTheDraw"
                             ,'t',this.move.player.team.title.htmlEncode()
                            );
      return html;
   },
   resignHtml:function(resourceName)
   {
      var html="";
      if (this.maxMoveNumber>0)
         if (this.verbose)
            html+=this.resource(resourceName ? resourceName : "youMayResign"
                                ,'r',this.resignButtonHtml()
                               );
         else
            html+=this.resignButtonHtml();
      return html;
   },
   isMyTurn:function(checkEverything)
   {
      if (checkEverything && (!this.status.playing || this.spectating || this.isLog))
         return false;
      return this.player.team.isMyTurn();
   },
   getTurnHtml:function()
   {
      if (!this.madeMove)
         return this.beginTurnHtml();
      else
         if (!this.readyToSend)
            return this.continueTurnHtml();
         else
            return this.completeTurnHtml();
   },
   beginTurnHtml:function()
   {
      var html="";
      html+=this.drawDeclinedHtml();
      html+=this.itsYourTurnHtml();
      html+=this.pieHtml();
      html+=this.acceptDeclineDrawHtml();
      html+=this.offerDrawHtml();
      html+=this.cancelGameHtml();
      html+=this.resignHtml();
      return html;
   },
   continueTurnHtml:function()
   {
      var html="";
      html+=this.undoMoveHtml();
      html+=this.continueYourTurnHtml();
      html+=this.pieHtml();
      html+=this.offerDrawHtml();
      html+=this.sendMoveHtml();
      return html;
   },
   completeTurnHtml:function()
   {
      var html="";
      html+=this.undoMoveHtml();
      html+=this.completeYourTurnHtml();
      html+=this.pieHtml();
      html+=this.offerDrawHtml();
      html+=this.sendMoveHtml();
      return html;
   },
   spectatingHtml:function()
   {
      var html="";
      if (this.status.playing)
      {
         html+=this.refreshGameButtonHtml();
         html+=" ";
      }
      html+=this.closeWindowButtonHtml();
      return html;
   },
   theyResignedHtml:function(resourceName)
   {
      return this.resource(resourceName ? resourceName : "theyResigned"
                           ,'t',this.move.player.team.title.htmlEncode()
                          );
   },
   youResignedHtml:function(resourceName)
   {
      return this.resource(resourceName ? resourceName : "youResigned");
   },
   youTiedHtml:function(resourceName)
   {
      return this.resource(resourceName ? resourceName : "youTie"
                           ,'r',this.openRulesAnchorHtml()
                          );
   },
   drawAcceptedHtml:function(resourceName)
   {
      return this.resource(resourceName ? resourceName : "theyAcceptedTheDraw"
                           ,'t',this.move.player.team.title.htmlEncode()
                          );
   },
   youWinHtml:function(resourceName)
   {
      return this.resource(resourceName ? resourceName : "youWin");
   },
   youLoseHtml:function(resourceName)
   {
      var winner=this.findWinningTeam();
      if (!winner)
         winner=this.move.player.team;
      return this.resource(resourceName ? resourceName : "youLose"
                           ,'t',winner.title.htmlEncode()
                           ,'r',this.openRulesAnchorHtml()
                          );
   },
   gameOverHtml:function()
   {
      if (this.verbose)
         if (this.status.resigned)
            if (this.player.team.status.won)
               return this.theyResignedHtml();
            else
               return this.youResignedHtml();
         else
            if (this.status.stalemate)
               return this.youTiedHtml();
            else
               if (this.status.draw)
                  return this.drawAcceptedHtml();
               else
                  if (this.player.team.status.won)
                     return this.youWinHtml();
                  else
                     return this.youLoseHtml();
      return "";
   },
   startAnotherGameHtml:function(resourceName)
   {
      var html="";
      if (this.spectating) return "";
      if (this.player.team.status.won ||
          (this.player.team.status.drew &&
           this.player==this.move.player))
         if (this.verbose)
            html+=this.resource(resourceName ? resourceName : "youMayStartAnotherGame"
                                ,'s',this.startAnotherGameButtonHtml()
                               );
         else
            html+="<p>"+this.startAnotherGameButtonHtml()+"</p>";
      return html;
   },
   closeWindowHtml:function()
   {
      var html="";
      if (this.verbose)
         html+="<p>";
      else
         html+=" ";
      html+=this.closeWindowButtonHtml();
      return html;
   },
   gameletHtml:function()
   {
      var html="";
      if (typeof(GamesByEmail.SetGame)!="undefined")
      {
         if (!this.__setGame)
            this.__setGame=new GamesByEmail.SetGame({deck:GamesByEmail.SetGame.DECK.SMALL_HORIZONTAL});
         html+="<p><span style=\"padding:6px;background-color:#eeeeff;border:1px solid #8888ff;font-size:10pt\"><b>&darr;</b>&nbsp;<a target=\"_blank\" href=\"http://GamesByEmail.com/Games/Set/Tutorial\">Learn to play <b>SET</b></a>&nbsp;<b>&darr;</b></span><br><br>";
         html+=this.__setGame.getHtml();
      }
      return html;
   },
   notYourTurnHtml:function(resourceName)
   {
      var html="";
      html+=this.resource(resourceName ? resourceName : "notYourTurn"
                          ,'r',this.sendReminderButtonHtml()
                          ,'u',this.refreshGameButtonHtml()
                          ,'c',this.closeWindowButtonHtml()
                         );
      html+=this.gameletHtml();
      return html;
   },
   itsYourTurnHtml:function(resourceName)
   {
      var html="";
      if (this.verbose)
         html+=this.resource(resourceName ? resourceName : "itIsYourTurnToMove"
                             ,'t',this.player.team.title.htmlEncode()
                             ,'o',this.player.team.nextTeam().title.htmlEncode()
                             ,'r',this.openRulesAnchorHtml()
                            );
      return html;
   },
   pieHtml:function(resourceName)
   {
      var html="";
      if (this.canPie && this.move.number==0)
         html+=this.resource(resourceName ? resourceName : "theyMayPie"
                             ,'t',this.player.team.title.htmlEncode()
                             ,'o',this.player.team.nextTeam().title.htmlEncode()
                             ,'r',this.openRulesAnchorHtml()
                            );
      if (this.canPie && this.move.number==1 && !this.madeMove)
         html+=this.resource(resourceName ? resourceName : "youMayPie"
                             ,'t',this.player.team.title.htmlEncode()
                             ,'o',this.player.team.nextTeam().title.htmlEncode()
                             ,'r',this.openRulesAnchorHtml()
                             ,'p',this.pieButtonHtml()
                            );
      return html;
   },
   continueYourTurnHtml:function(resourceName)
   {
      var html="";
      if (this.verbose)
         html+=this.resource(resourceName ? resourceName : "continueYourTurn"
                             ,'t',this.player.team.title.htmlEncode()
                             ,'o',this.player.team.nextTeam().title.htmlEncode()
                             ,'r',this.openRulesAnchorHtml()
                            );
      return html;
   },
   completeYourTurnHtml:function(resourceName)
   {
      var html="";
      if (this.verbose)
         html+=this.resource(resourceName ? resourceName : "completeYourTurn"
                             ,'t',this.player.team.title.htmlEncode()
                             ,'o',this.player.team.nextTeam().title.htmlEncode()
                             ,'r',this.openRulesAnchorHtml()
                            );
      return html;
   },
   cancelGameHtml:function(resourceName)
   {
      var html="";
      if (this.maxMoveNumber==0)
         if (this.verbose)
            html+=this.resource(resourceName ? resourceName : "youMayCancelTheGame"
                                ,'c',this.cancelGameButtonHtml()
                               );
         else
            html+=this.cancelGameButtonHtml();
      return html;
   },
   sendPie:function(pieGameType)
   {
      this.setCatchAndDebug();
      this.server("receiveSendMoveResults","methodDomain","serverMethods","Pie",this,this.player.id,pieGameType);
   },
   pie:function(pieGameType)
   {
      this.clearMouseEvents();
      this.player.team.nextTeam().setExclusiveTurn();
      this.move.player=this.player;
      this.move.number++;
      this.sendPie(pieGameType);
   },
   getPieType:function()
   {
      var gameTypes=this.resource("gameTypes");
      var half=gameTypes.length/2;
      for (var i=0;i<half;i++)
         if (gameTypes[i]==this.type)
            return gameTypes[half+i];
   },
   maybePie:function(resourceName)
   {
      if (window.confirm(this.resource(resourceName ? resourceName : "confirmPie")))
         this.pie(this.getPieType());
      else
         this.getElement("pie").disabled=false;
   },
   pieButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("pie"),"pie",this.event("maybePie();",true));
   },
   resign:function()
   {
      this.clearMouseEvents();
      this.setResigned();
      this.send(true);
   },
   maybeResign:function(resourceName)
   {
      if (window.confirm(this.resource(resourceName ? resourceName : "confirmResign")))
         this.resign();
      else
         this.getElement("resign").disabled=false;
   },
   resignButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("resign"),"resign",this.event("maybeResign();",true));
   },
   acceptDraw:function()
   {
      this.move.player=this.player;
      this.setEnded();
      this.status.draw=true;
      this.status.drawAccepted=true;
      this.notify.drawAccepted=true;
      for (var i=0;i<this.teams.length;i++)
      {
         this.teams[i].status.drew=true;
         this.teams[i].notify.drawAccepted=true;
      }
      this.player.team.status.acceptingDraw=true;
      return this.send(true);
   },
   acceptDrawButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("acceptDraw"),"acceptDraw",this.event("acceptDraw();",true));
   },
   sendMove:function(sendNow,player)
   {
      return this.send(sendNow,player);
   },
   send:function(sendNow,player)
   {
      if (typeof(sendNow)=="undefined" || sendNow==null)
         sendNow=true;
      if (typeof(player)=="undefined" || player==null)
         player=this.player;
      if (player!=this.move.player)
      {
         this.status.drawDeclined=this.status.drawOffered;
         this.notify.drawDeclined=this.status.drawDeclined;
         player.team.status.decliningDraw=this.status.drawDeclined;
         this.move.player.team.notify.drawDeclined=this.notify.drawDeclined;
      }
      this.status.drawOffered=(this.status.playing && this.areOfferingDraw);
      if (this.status.drawOffered)
      {
         this.status.drawOffered=true;
         this.notify.drawOffered=true;
         player.team.status.offeringDraw=true;
         this.move.player.team.notify.offeredDraw=true;
      }
      if (typeof(this._movesToSend)=="undefined" || this._movesToSend==null)
      {
         this._movesToSend=new Array();
         this._PreMoveNumber=this.move.number;
         this._PreMoveLog=this.move.log;
      }
      this.move.player=player;
      this.move.number++;
      this._movesToSend[this._movesToSend.length]=Foundation.jsSerialize(this);
      this.sendToServer(sendNow);
      this.move.log="";
      return true;
   },
   processSecureMove:function(game)
   {
      return false;
   },
   showTransactionPrompt:function(resourceName)
   {
      this.setInnerHtml("gamePrompts",this.resource(resourceName));
   },
   catchResponseError:function(url,postData,responseText,errorObject)
   {
      this.serverDebug=false;
      this.serverCatch=null;
      var gameFolder=this.resource("gameFolder");
      var classFile="GamesByEmail.js";
      if (gameFolder!=null)
         classFile+=","+gameFolder+"/Game.js";
      var gameClass="GamesByEmail.Game";
      if (gameFolder!=null)
         gameClass+=","+this.constructor.getTypePath();
      gameClass+=" (type:"+this.type+")";
      var windowUrl=window.location.href;
      if (windowUrl.toLowerCase().indexOf("/popup.htm?")>=0)
      {
         try
         {
            windowUrl+="\n\t\t"+window.opener.location.href;
         }
         catch (e)
         {
            windowUrl+="\n\t\t"+"[access denied]: "+e.toString();
         }
      }
      if (this.player && this.player.id)
         windowUrl+="\n\t\thttp://GamesByEmail.com/Games/Play?"+this.player.id;
      this.server("responseErrorReported","methodDomain","serverMethods","ReportResponseError",classFile,gameClass,window.navigator.appName,window.navigator.appVersion,windowUrl,url,postData,responseText,errorObject.toString());
   },
   responseErrorReported:function(message)
   {
      if (typeof(message)=="string" && message.length>0)
         alert(message);
   },
   setCatchAndDebug:function(doCatch,doDebug)
   {
      this.serverCatch=(doCatch || window.location.href.indexOf("&nocatch")>0 ? null : this.event("catchResponseError"));
      this.serverDebug=(doDebug || window.location.href.indexOf("&debugcalls")>0);
   },
   sendToServer:function(sendNow)
   {
      if (sendNow)
      {
         this.setCatchAndDebug();
         this.serverSerialized("receiveSendMoveResults","methodDomain","serverMethods","SendMoves",this._movesToSend,Foundation.jsSerialize(this.player.id),Foundation.jsSerialize(1));
         this.showTransactionPrompt("sendingMoves");
      }
   },
   receiveSendMoveResults:function(gameData)
   {
      if (gameData==null)
         this.catchResponseError("SendMoves","game","gameData came back null","no error reported");
      else
         if (gameData[0]==null)
            this.catchResponseError("SendMoves","game","gameData[0] came back null","no error reported");
         else
            if (gameData.length>1)
            {
               var collisionMoves=new Array(gameData.length-1);
               for (var i=1;i<gameData.length;i++)
                  collisionMoves[i-1]=gameData[i];
               this.handleMoveCollision(gameData[0],collisionMoves);
            }
            else
               this.receiveData(gameData[0]);
      GamesByEmail.Game.$maybeNotifyBrowser();
   },
   handleMoveCollision:function(gameData,collisionMoves)
   {
      this.receiveData(gameData);
   },
   sendMoveButtonHtml:function(resourceName)
   {
      return this.getButtonHtml(this.resource(resourceName ? resourceName : "sendMove"),"sendMove",this.event("sendMove();",true));
   },
   undo:function(skipUpdate)
   {
      this.clearUnsentMoves(true);
      this.importData(this.rawGame);
      this.setSpectatingStatus();
      this.synch();
      if (!skipUpdate)
         this.update();
   },
   undoButtonHtml:function(resourceName)
   {
      return this.getButtonHtml(this.resource(resourceName ? resourceName : "undo"),"undo",this.event("undo();",true));
   },
   offerDrawCheckBoxHtml:function()
   {
      return this.getCheckboxHtml(this.areOfferingDraw,"offerDraw",this.event("areOfferingDraw=this.checked"));
   },
   cancelGameResponse:function(canceled)
   {
      if (canceled)
         this.closeWindow();
   },
   cancelGame:function()
   {
      this.setCatchAndDebug();
      this.server("cancelGameResponse","methodDomain","serverMethods","CancelGame",this.player.id);
   },
   cancelGameButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("cancelGame"),"cancelGame",this.event("cancelGame();",true));
   },
   refreshResponse:function(refreshGameResponse)
   {
      if (refreshGameResponse.scriptList)
      {
         currScripts=this.requiredScripts();
         for (var i=0;i<refreshGameResponse.scriptList.length;i++)
         {
            var foundIt=false;
            var s=refreshGameResponse.scriptList[i];
            for (var j=0;j<currScripts.length;j++)
               if (s==currScripts[j])
               {
                  foundIt=true;
                  break;
               }
            if (!foundIt)
            {
               window.location.reload(true);
               return;
            }
         }
      }
      if (refreshGameResponse.fresherGame)
         this.receiveData(refreshGameResponse.fresherGame);
      else
         this.getElement("refreshGame").disabled=false;
   },
   refreshGame:function()
   {
      this.setCatchAndDebug();
      var currScripts=this.requiredScripts();
      var scriptList=new Array();
      var parts;
      for (var i=0;i<currScripts.length;i++)
         if (currScripts[i] &&
             (parts=currScripts[i].split("?")).length==2)
            scriptList[scriptList.length]=parts[0];
      this.server("refreshResponse","methodDomain","serverMethods","RefreshGame",this.id,this.player.id,this.move.number,scriptList);
   },
   refreshGameButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("refreshGame"),"refreshGame",this.event("refreshGame();",true));
   },
   sendReminderResponse:function(reminderResponse)
   {
      if (reminderResponse==null)
         return alert(this.resource("gameWasDeleted"));
      if (reminderResponse.game)
         return this.receiveData(reminderResponse.game);
      if (reminderResponse.reminderList)
         return alert(this.resource("reminderSentTo"
                                    ,'s',reminderResponse.reminderList
                                   ));
   },
   sendReminder:function()
   {
      this.setCatchAndDebug();
      this.server("sendReminderResponse","methodDomain","serverMethods","SendReminders",this.id,this.player.id,this.player.title);
   },
   sendReminderButtonHtml:function()
   {
      if (arguments.length>0 && arguments[0])
      {
         this._reminderTimeoutHandle=null;
         var e=this.getElement("sendReminder");
         if (e)
         {
            e.value=this.resource("sendReminder");
            e.disabled=false;
         }
         return null;
      }
      if (this._reminderTimeoutHandle)
         window.clearTimeout(this._reminderTimeoutHandle);
      var reminderTime=new Date(this.lastMove.valueOf()+1000*this.resource("reminderIntervalSecs"));
      var currentTime=new Date();
      var allowReminders=(reminderTime<=currentTime);
      if (!allowReminders)
         this._reminderTimeoutHandle=window.setTimeout(this.event("sendReminderButtonHtml(true)"),reminderTime.valueOf()-currentTime.valueOf());
      return this.getButtonHtml(this.resource(allowReminders ? "sendReminder" : "emailSent"),"sendReminder",this.event("sendReminder();",true),this.resource("sendingReminder"),allowReminders ? "" : "disabled");
   },
   getNewGamePlayerOrder:function(userInfo)
   {
      return userInfo.reverse();
   },
   getNextGamesTitle:function()
   {
      var title=this.title;
      var round=1;
      if (this.title.search(this.resource("newGameTitleSearchRE"))==0)
      {
         title=RegExp.$1;
         round=parseInt(RegExp.$2);
      }
      round++;
      return this.resource("newGameTitleTemplate"
                           ,'t',title
                           ,'r',round
                          );
   },
   gameFormOnCreateEvent:function(gameForm)
   {
      gameForm.gameMessage=this.getElement("gameMessageRead").value;
      gameForm.gameMessage+=this.resource("newGameMessage"
                                          ,'t',gameForm.gameTitle
                                         );
      return true;
   },
   gameFormOnCancelEvent:function(gameForm)
   {
      this.update();
   },
   initializeNewGameForm:function(gameForm,userInfo)
   {
      gameForm.setStartAnotherGamePlayers(this.getNewGamePlayerOrder(userInfo));
      gameForm.gameType=this.type;
      gameForm.gameTitle=this.getNextGamesTitle();
      gameForm.onCreateEvent=new Function("gameForm","return "+this.event("gameFormOnCreateEvent(gameForm)"));
      gameForm.onCancelEvent=new Function("gameForm",this.event("gameFormOnCancelEvent(gameForm)"));
      //gameForm.onGameStarted=new Function("response",this.event("anotherGameStarted(response)"));
      gameForm.setShowGameControl(this,"anotherGameStarted");
   },
   displayStartGameForm:function(gameForm)
   {
      this.setInnerHtml("gamePrompts",gameForm.getHtml());
   },
   showStartAnotherGameForm:function(userInfo)
   {
      if (userInfo)
         this.playAgainUserInfo=userInfo;
      var formClass=GamesByEmail.GameForm ? GamesByEmail.GameForm.$classFromNameHint(this.resource("gameFolder")) : null;
      if (this.playAgainUserInfo && formClass)
      {
         GamesByEmail.GameForm.changeDomain(this.resource("methodDomain"),window.location.href.indexOf(".aspx")>0 ? ".aspx" : null);
         var gameForm=new formClass({resourcePack:{staticDomain:this.getStaticFolder()}});
         this.initializeNewGameForm(gameForm,this.playAgainUserInfo);
         this.displayStartGameForm(gameForm);
         this.playAgainUserInfo=null;
      }
   },
   anotherGameStarted:function(playerId,gameTitle)
   {
      this.load(playerId);
   },
   requestNewGameUserInfo:function()
   {
      this.setCatchAndDebug();
      this.server("showStartAnotherGameForm","methodDomain","startAnotherGameServerMethods","GetStartAnotherGameUserIds",this.player.id);
   },
   startAnotherGame:function()
   {
      var formLoader=new Foundation.ClientLoader();
      formLoader.readyToProcess=new Function(this.event("showStartAnotherGameForm(null)"));
      formLoader.receiveScriptList([{test:"typeof(GamesByEmail.GameForm)=='undefined'",src:this.getCodeFolder()+"GamesByEmail.GameForm.js?"+(new Date()).valueOf()},
                                    {test:"GamesByEmail.GameForm.$classFromNameHint('"+this.resource("gameFolder")+"')==null",src:this.getCodeFolder(true)+"GameForm.js?"+(new Date()).valueOf()}]);
      this.requestNewGameUserInfo();
   },
   startAnotherGameButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("startAnotherGame"),"startAnotherGame",this.event("startAnotherGame();",true));
   },
   closeWindow:function()
   {
      window.close();
   },
   closeWindowButtonHtml:function()
   {
      return this.getButtonHtml(this.resource("closeWindow"),"closeWindow",this.event("closeWindow();"));
   },
   transformHashLinksToOnClicks:function(html)
   {
      return html.replace(/<a\s+href="#/gi,"<a href=\"#").replace(/<\/a>/gi,"</a>").split("<a href=\"#").join("<a onclick=\"event.returnValue=false;document.getElementsByName(unescape(this.href.substr(this.href.indexOf('#')+1).replace(/\\+/g,' ')))[0].scrollIntoView();return false;\" href=\"#");
   },
   processText_clippedPiece:function(boardValue)
   {
      return GamesByEmail.clippedImageHtml(this.getPieceSrc(),this.getPieceRect(boardValue));
   },
   processText_staticBoardUrl:function(url,htmlEncoded)
   {
      url=this.getImageSrc(url);
      if (htmlEncoded=="true")
         url=url.htmlEncode();
      return url;
   },
   processText:function(text)
   {
      var parts=text.split("<%=");
      text=new Foundation.StringBuilder();
      text.append(parts[0]);
      var notifyOnError=true;
      var cache=new Object();
      for (var i=1;i<parts.length;i++)
      {
         var e=parts[i].indexOf("%>");
         var action=parts[i].substr(0,e);
         if (typeof(cache[action])=="undefined")
         {
            var sp=action.indexOf('(');
            var args="";
            if (sp>0)
            {
               args=action.substr(sp+1,action.indexOf(')')-sp-1);
               action=action.substr(0,sp);
            }
            if (typeof(this["processText_"+action])=="function")
               cache[action]=this["processText_"+action].apply(this,args.split(','))
            else
            {
               cache[action]="";
               if (notifyOnError)
                  alert("Method \"processText_"+action+"\" not defined.");
               notifyOnError=false;
            }
         }
         text.append(cache[action]);
         text.append(parts[i].substr(e+2));
      }
      cache=null;
      return text.toString();
   },
   cookRule:function(rule)
   {
      return this.transformHashLinksToOnClicks(this.processText(rule));
   },
   showRule:function(ruleWindow,rule)
   {
      ruleWindow.document.getElementById("rules").innerHTML=this.cookRule(this.resource("rules")[rule]);
      return false;
   },
   resizeFont:function(increase,font)
   {
      if (!font)
         font=this.font;
      font.search(/(\d+)(.*)/);
      return (parseInt(RegExp.$1)+increase).toString()+RegExp.$2;
   },
   appendPopupOnLoadScript:function(htmlBuilder,focusIndex)
   {
      htmlBuilder.append("<"+"script language=\"javascript\">\n");
      htmlBuilder.append("function body_onload()\n");
      htmlBuilder.append("{\n");
      htmlBuilder.append("   var x=document.body.scrollWidth-document.body.clientWidth;\n");
      htmlBuilder.append("   var y=document.body.scrollHeight-document.body.clientHeight;\n");
      htmlBuilder.append("   if (x>0 || y>0)\n");
      htmlBuilder.append("      window.resizeBy(x,y);\n");
      if (arguments.length>1 && focusIndex!=null)
      {
         htmlBuilder.append("   var e=document.getElementById('"+focusIndex.toString().cEncode()+"');\n");
         htmlBuilder.append("   if (e)\n");
         htmlBuilder.append("      e.scrollIntoView();\n");
      }
      htmlBuilder.append("}\n");
      htmlBuilder.append("<"+"/script>\n");
      return htmlBuilder;
   },
   rulesPopupHtml:function(index)
   {
      var gameTitle=this.resource("gameTypeTitles")[0];
      var html=new Foundation.StringBuilder();
      var font=this.resizeFont(4);
      this.appendPopupOnLoadScript(html,index);
      html.append("<html><head><title>");
      html.append(this.resource("rulesTitle",'t',gameTitle).htmlEncode());
      html.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</title><style>");
      html.append("body{font:"+font.htmlEncode()+";margin:0}");
      html.append("table{font:"+font.htmlEncode()+"}");
      html.append("input{font:"+font.htmlEncode()+"}");
      html.append("a.rule{color:#aaaaaa;text-decoration:underline;cursor:"+GamesByEmail.CURSOR.HAND+"}");
      html.append("a.rule:hover{color:#ffffff}");
      html.append("</style>");
      html.append("<base href=\""+GamesByEmail.Game.$popupBase+"\" />");
      html.append("</head><body onload=\"body_onload();\">");
      html.append("<table id=\"master\" cellspacing=0 cellpadding=0 style=\"width:100%;height:100%\">");
      html.append("<tr><td colspan=2 style=\"height:1;background-color:#000000\">");
      html.append("<table cellspacing=0 cellpadding=0 width=\"100%\">");
      html.append("<tr><td nowrap align=left valign=middle style=\"font:"+this.resizeFont(8).htmlEncode()+";padding:5px;color:#ffffff\"><b>");
      html.append(this.resource("rulesHeader"));
      html.append("<b></td><td align=right valign=middle>");
      html.append("<input type=button value=\"");
      html.append(this.resource("rulesClose").htmlEncode());
      html.append("\" onclick=\"window.close();\">");
      html.append("</td></tr></table>");
      html.append("</td></tr>");
      html.append("<tr><td valign=top width=\"100\" style=\"background-color:#404040\">");
      html.append("<table cellspacing=0 cellpadding=0 style=\"width:100%;\">");
      html.append("<tr><td align=center nowrap style=\"background-color:#808080;color:#ffffff\"><b>");
      html.append(gameTitle.htmlEncode());
      html.append("</b></td></tr>");
      var rules=this.resource("rules");
      html.append("<tr><td nowrap style=\"padding-left:5px;padding-right:5px\">");
      var parts=rules.replace(/<a[^>]*\sname=/gi,"<a name=").split("<a name=");
      for (var i=1;i<parts.length;i++)
      {
         var name=parts[i]+" />";
         if (name.charAt(0)=='\"')
            name=name.substr(1,name.indexOf('\"',1)-1).htmlDecode();
         else
            name=name.substr(0,Math.min(name.indexOf(' '),name.indexOf('/'),name.indexOf('>'))).htmlDecode();
         if (i>1)
            html.append("<br>");
         var subParts=name.split(".");
         for (var j=1;j<subParts.length;j++)
            html.append("&nbsp;&nbsp;&nbsp;");
         html.append(this.transformHashLinksToOnClicks("<a href=\"#"+name.urlEncode().htmlEncode()+"\" class=\"rule\">"));
         html.append(subParts[subParts.length-1].htmlEncode());
         html.append("</a>");
      }
      html.append("</td></tr>");
      html.append("</table>");
      html.append("</td><td valign=top width=\"99%\" style=\"background-color:#aaaaaa\">");
      html.append("<div style=\"position:relative;width:100%;height:100%;overflow:auto\">");
      html.append("<div id=\"rules\" style=\"position:absolute;padding:5px\">");
      html.append(this.cookRule(rules));
      html.append("</div>");
      html.append("</div>");
      html.append("</td></tr>");
      html.append("<tr><td colspan=2 style=\"height:1;background-color:#000000;\">");
      html.append("<table cellspacing=0 cellpadding=0 width=\"100%\">");
      html.append("<tr><td nowrap align=center valign=middle style=\"font:"+this.resizeFont(-1).htmlEncode()+";padding:5px;color:#ffffff\">");
      html.append(this.resource("rulesFooter"));
      html.append("</td><td align=right valign=middle>");
      html.append("<input type=button value=\"");
      html.append(this.resource("rulesClose").htmlEncode());
      html.append("\" onclick=\"window.close();\">");
      html.append("</td></tr></table>");
      html.append("</td></tr></table>");
      html.append("</body>");
      html.append("</html>");
      return html.toString();
   },
   openRules:function(event,index)
   {
      if (typeof(index)=="string")
         index="'"+index.cEncode()+"'";
      this.openPopup(event,this.resource("rulesSize"),this.event("rulesPopupHtml("+index+");"));
   },
   openRulesAnchorHtml:function(index)
   {
      if (!index)
         index=0;
      if (typeof(index)=="string")
         index="'"+index.cEncode()+"'";
      return this.getAnchorHtml(this.resource("openRules"),"openRules",this.event("openRules(event,"+index+")"));
   },
   requestLog:function()
   {
      this.sendLogRequestToServer();
   },
   sendLogRequestToServer:function(debugCalls)
   {
      this.setCatchAndDebug(null,debugCalls);
      this.server("receiveLog","methodDomain","serverMethods","RequestLog",this.player && this.player.id!=0 ? this.player.id : this.id);
   },
   requiredScripts:function()
   {
      var scripts=new Array();
      if (typeof(GamesByEmail.GameLoader)=="function")
      {
         scripts.push(GamesByEmail.GameLoader.getScriptSrc("Foundation.js"));
         scripts.push(GamesByEmail.GameLoader.getScriptSrc("Foundation.Server.js"));
         scripts.push(GamesByEmail.GameLoader.getScriptSrc("Foundation.Geometry.js"));
         scripts.push(GamesByEmail.GameLoader.getScriptSrc("GamesByEmail.js"));
         scripts.push(GamesByEmail.GameLoader.getScriptSrc("GamesByEmail."+this.resource("gameFolder")+"Game.js"));
      }
      else
      {
         scripts.push(this.getStaticFolder()+"Foundation.js");
         scripts.push(this.getStaticFolder()+"Foundation.Server.js");
         scripts.push(this.getStaticFolder()+"Foundation.Geometry.js");
         scripts.push(this.getCodeFolder()+"GamesByEmail.js");
         scripts.push(this.getCodeFolder(true)+"Game.js");
      }
      return scripts;
   },
   setAsLog:function(parentGame)
   {
      this.parentGame=parentGame;
      this.isLog=true;
      this.debug=new Function("value","return arguments.length==0 ? this.parentGame.debug() : this.parentGame.debug(value);");
      this.setCatchAndDebug=new Function("this.parentGame.setCatchAndDebug();this.serverCatch=this.parentGame.serverCatch;this.serverDebug=this.parentGame.serverDebug;");
   },
   logPopupHtml:function()
   {
      var html=new Foundation.StringBuilder();
      var gameClass=this.constructor.getTypePath();
      var scripts=this.requiredScripts();
      this.appendPopupOnLoadScript(html);
      for (var i=0;i<scripts.length;i++)
         html.append("<").append("script language=\"javascript\" src=\"").append(scripts[i].htmlEncode()).append("\"><").append("/script>\n");
      html.append("<html><head><title>");
      html.append(this.resource("logTitle",'t',this.title).htmlEncode());
      html.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</title><style>");
      html.append("body{font:"+this.font.htmlEncode()+";margin:0}");
      html.append("a {text-decoration:none;color:#000000}");
      html.append("a:hover {text-decoration:underline}");
      html.append("</style>");
      html.append("</head><body onload=\"addGameLog();body_onload();\">");
      html.append("<div id=\"logHolder\"></div>");
      html.append("<"+"script language=javascript>\n");
      html.append("function addGameLog()\n");
      html.append("{\n");
      html.append("   GamesByEmail.Game.$setBaseFolders(\"").append(GamesByEmail.Game.$getWebMethodsFolder().cEncode()).append("\",\"").append(GamesByEmail.Game.$getStaticFolder().cEncode()).append("\",\"").append(GamesByEmail.Game.$getCodeFolder().cEncode()).append("\");\n");
      html.append("   var game=new ("+gameClass+")();\n");
      if (this.testing)
         html.append("   GamesByEmail.Testing.extendGameForTesting(game);\n");
      html.append("   game.setAsLog(window.opener."+this.event()+");\n");
      html.append("   game.importData(game.parentGame.rawGame);\n");
      html.append("   game.setSpectatingStatus("+(this.spectating ? "true" : "false")+",'"+this.player.indexString()+"');\n");
      html.append("   document.getElementById('logHolder').innerHTML=game.getHtml();\n");
      html.append("   game.requestLog();\n");
      html.append("}\n");
      html.append("<"+"/script><center style=\"color:#444444\">");
      html.append(this.resource("logFooter"));
      html.append("<center></body>");
      html.append("</html>");
      return html.toString();
   },
   getLogDialogSize:function(resourceName)
   {
      return this.resource(resourceName);
   },
   openLog:function(event)
   {
      this.openPopup(event,this.getLogDialogSize("logSize"),this.event("logPopupHtml();"));
   },
   openLogAnchorHtml:function()
   {
      return this.getAnchorHtml(this.resource("openLog"),"openLog",this.event("openLog(event)"),this.id==0 ? "disabled" : "");
   },
   setPreferences:function(preferences)
   {
      this.player.info.importData(preferences,true);
      var needSynch=this.setPlayerPrefs();
      var id=this.elementId("updateFonts");
      var tables=document.getElementsByName("TABLE");
      for (var i=0;i<tables.length;i++)
         tables[i].style.font=this.font;
      if (needSynch)
         this.synch();
      this.update();
   },
   savePreferencesResponse:function(savePreferencesResponse)
   {
      this.$prefWindow.close();
      if (savePreferencesResponse.gameTypes)
         for (var g=this.constructor.getFirst();g;g=this.constructor.getNext(g))
            g.setPreferences(savePreferencesResponse.preferences,false);
      else
         this.setPreferences(savePreferencesResponse.preferences,false);
   },
   savePreferencesToServer:function(allGames,prefs)
   {
      this.setCatchAndDebug();
      this.server("savePreferencesResponse","methodDomain","serverMethods","SavePeferences",this.player.id,prefs,allGames ? this.resource("gameTypes") : null);
   },
   extractPreferences:function(preferences,preferencesWindow)
   {
      preferences.b_noVerbose=preferencesWindow.document.getElementById("b_noVerbose").checked;
      var f=preferencesWindow.document.getElementById("font");
      preferences.font=f.options[f.selectedIndex].value;
   },
   savePreferences:function(allGames,prefWindow)
   {
      this.$prefWindow=prefWindow;
      var prefs=new Object();
      this.extractPreferences(prefs,prefWindow);
      this.savePreferencesToServer(allGames,prefs);
   },
   appendAdditionalPreferencesHtml:function(htmlBuilder)
   {
      return htmlBuilder;
   },
   preferencesPopupHtml:function()
   {
      var html=new Foundation.StringBuilder();
      var gameTitle=this.resource("gameTypeTitles")[0];
      var title=this.resource("preferencesTitle",'t',gameTitle);
      this.appendPopupOnLoadScript(html);
      html.append("<html>\n");
      html.append("<head>\n");
      html.append("<title>");
      html.append(title.htmlEncode());
      html.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</title>\n");
      html.append("<style>\n");
      html.append("table {font:"+this.font+"}\n");
      html.append("th {font-size:125%;text-align:center;background-color:#000000;color:#ffffff}\n");
      html.append("input {font:"+this.font+"}\n");
      html.append("select {font:"+this.font+"}\n");
      html.append("</style>\n");
      html.append("</head>\n");
      html.append("<body onload=\"body_onload();\">\n");
      html.append("<table border=0 cellspacing=0 cellpadding=0 width=\"100%\">\n");
      html.append("<tr><th colspan=2 nowrap align=center>");
      html.append(title.htmlEncode());
      html.append("</th></tr>\n");
      html.append("<tr><td colspan=2 nowrap>&nbsp;</td></tr>\n");
      html.append("<tr>\n");
      html.append("<td nowrap><input type=checkbox id=\"b_noVerbose\" value=\"true\" "+(this.verbose ? "" : "checked")+"><label for=\"b_noVerbose\">").append(this.resource("preferencesHideExplanations")).append("</label>&nbsp;&nbsp;&nbsp;&nbsp;</td>\n");
      html.append("<td nowrap valign=middle>").append(this.resource("preferencesFont")).append("&nbsp;<select id=\"font\">\n");
      var fonts=this.resource("preferencesAvailableFonts");
      for (var i=0;i<fonts.length;i++)
         html.append("<option value=\""+(i==0 ? "" : fonts[i])+"\" "+(this.font==(i==0 ? "" : fonts[i]) ? "selected" : "")+">"+fonts[i]+"</option>\n");
      html.append("</select>\n");
      html.append("</td>\n");
      html.append("</tr>\n");
      this.appendAdditionalPreferencesHtml(html);
      html.append("<tr><td colspan=2 nowrap>&nbsp;</td></tr>\n");
      html.append("<tr><td colspan=2 nowrap>&nbsp;</td></tr>\n");
      html.append("<tr><td colspan=2 nowrap align=center><input type=submit value=\"");
      html.append(this.resource("preferencesAllGames",'t',gameTitle).htmlEncode());
      html.append("\" onclick=\"this.disabled=true;savePreferences(true);\" style=\"width:100%\"></td></tr>\n");
      html.append("<tr><td colspan=2>&nbsp;</td></tr>\n");
      html.append("<tr><td nowrap align=left><input type=submit value=\"");
      html.append(this.resource("preferencesThisGame").htmlEncode());
      html.append("\" onclick=\"this.disabled=true;savePreferences(false);\" style=\"overflow:visible;width:125px\"></td><td nowrap align=right><input type=button value=\"");
      html.append(this.resource("preferencesCancel").htmlEncode());
      html.append("\" onclick=\"window.close();\" style=\"width:125px\"></td></tr>\n");
      html.append("</table>\n");
      html.append("<"+"script language=\"javascript\">\n");
      html.append("function savePreferences(allGames)\n");
      html.append("{\n");
      html.append("   window.opener."+this.event("savePreferences(allGames,window)")+";\n");
      html.append("   return false;\n");
      html.append("}\n");
      html.append("</script>");
      html.append("</body>\n");
      html.append("</html>\n");
      return html.toString();
   },
   openPreferences:function(event)
   {
      this.openPopup(event,this.resource("preferencesSize"),this.event("preferencesPopupHtml();"));
   },
   openPreferencesAnchorHtml:function()
   {
      return this.getAnchorHtml(this.resource("openPreferences"),"openPreferences",this.event("openPreferences(event)"),this.id==0 ? "disabled" : "");
   },
   sendProblemReport:function(problem,w)
   {
      this.$reportProblemWindow=w;
      this.sendProblemReportToServer(problem);
   },
   sendProblemReportToServer:function(problem)
   {
      this.setCatchAndDebug();
      this.server("sendProblemReportResponse","methodDomain","serverMethods","ReportProblem",this.id,this.type,this.player.id,window.navigator.appName+"\n"+window.navigator.appVersion,problem);
   },
   sendProblemReportResponse:function(message)
   {
      if (message==null)
         message=this.resource("reportProblemThanks");
      else
      {
         var m=this.resource(message);
         if (m==null)
            message=message.toString().htmlEncode();
         else
            message=m;
      }
      this.$reportProblemWindow.document.body.innerHTML=message;
   },
   reportProblemPopupHtml:function()
   {
      var html=new Foundation.StringBuilder();
      this.appendPopupOnLoadScript(html);
      html.append("<html><head><title>");
      html.append(this.resource("reportProblemTitle").htmlEncode());
      html.append("</title><style>");
      html.append("body{font:"+this.font.htmlEncode()+"}");
      html.append("input{font:"+this.font.htmlEncode()+"}");
      html.append("</style></head><body onload=\"body_onload();\">");
      html.append(this.resource("reportProblemWeAreListening"));
      html.append("<textarea id=\"problem\" rows=10 style=\"width:100%\"></textarea><br>");
      html.append("<center><input type=submit id=\"Submit\" value=\"");
      html.append(this.resource("reportProblemSend").htmlEncode());
      html.append("\" style=\"width:100px\" onclick=\"return submitProblem();\">&nbsp;&nbsp;&nbsp;<input type=reset value=\"");
      html.append(this.resource("reportProblemCancel").htmlEncode());
      html.append("\" style=\"width:100px\" onclick=\"window.close();\">");
      html.append("<"+"script language=\"javascript\">\n");
      html.append("function submitProblem()\n");
      html.append("{\n");
      html.append("   var problem=document.getElementById(\"problem\");\n");
      html.append("   if (problem.value.search(/\\S/)<0)\n");
      html.append("   {\n");
      html.append("      alert(\""+this.resource("reportProblemEnterDescription").cEncode()+"\");\n");
      html.append("      problem.focus();\n");
      html.append("      return false;\n");
      html.append("   }\n");
      html.append("   var s=document.getElementById(\"Submit\");\n");
      html.append("   s.disabled=true;\n");
      html.append("   s.value=\""+this.resource("reportProblemSending").cEncode()+"\";\n");
      html.append("   window.opener."+this.event("sendProblemReport(problem.value,window)")+";\n");
      html.append("   return false;\n");
      html.append("}\n");
      html.append("</script>");
      html.append("</center>");
      html.append("</body>");
      html.append("</html>");
      return html.toString();
   },
   reportProblem:function(event)
   {
      this.openPopup(event,this.resource("reportProblemSize"),this.event("reportProblemPopupHtml();"));
   },
   reportProblemAnchorHtml:function()
   {
      return this.getAnchorHtml(this.resource("reportProblem"),"reportProblem",this.event("reportProblem(event)"),this.id==0 ? "disabled" : "");
   },
   getSpectatorUrl:function()
   {
      var url=this.resource("methodDomain")+this.resource("spectatorUrl",'i',this.id);
      if (document.domain.toLowerCase()=="gamesbyemail.com" ||
          document.domain.toLowerCase()=="www.gamesbyemail.com")
         url=url.replace(".aspx?","?");
      if (this.testing)
         url=window.location.href;
      return url;
   },
   getSpectatorAnchorHtml:function()
   {
      return "<a id=\""+this.elementId("spectatorAnchor")+"\" "+(this.id==0 ? "disabled" : "")+" target=\"_blank\" href=\""+this.getSpectatorUrl().htmlEncode()+"\">";
   },
   getActionLinksHtml:function()
   {
      var args=[this.spectating ? "spectatorActionLinks" : "actionLinks"
                ,'l',this.openLogAnchorHtml()
                ,'r',this.openRulesAnchorHtml()
                ,'g',this.typeTitle().htmlEncode().replace(/ /g,"&nbsp;")
                ,'p',this.openPreferencesAnchorHtml()
                ,'e',this.reportProblemAnchorHtml()
                ,'s',this.getSpectatorAnchorHtml()];
      for (var i=0;i<arguments.length;i++)
         args.push(arguments[i]);
      return this.resource.apply(this,args);
   },
   openPopup:function(mouseEvent,size,htmlFunction,popupFeatures)
   {
      var popupName=(new Date()).valueOf().toString();
      var left=mouseEvent.screenX-size.x/2;
      var top=mouseEvent.screenY-(size.y-10);
      if (!popupFeatures)
         popupFeatures="defaultPopupFeatures";
      popupFeatures=this.resource(popupFeatures,'l',left,'t',top,'w',size.x,'h',size.y);
      var w=null;
      var base=(GamesByEmail.notIe ? "" : GamesByEmail.Game.$popupBase);
      if (document.domain.toLowerCase()=="gamesbyemail.com" ||
          document.domain.toLowerCase()=="www.gamesbyemail.com")
         base="/Games/";
      try
      {
         if (!GamesByEmail.isIe && !GamesByEmail.inProduction())
            throw("Firefox sux");
         w=window.open(base+"Popup.htm?"+htmlFunction.urlEncode(),popupName,popupFeatures);
         w.focus();
      }
      catch(e)
      {
         try
         {
            w=window.open("javascript:window.opener."+htmlFunction,popupName,popupFeatures);
            w.focus();
         }
         catch(e2)
         {
         }
      }
      return w;
   },
   updateTeamTitles:function()
   {
      this.setInnerHtml("topTeamTitles",this.getTeamTitlesHtml(true));
      this.setInnerHtml("bottomTeamTitles",this.getTeamTitlesHtml(false));
   },
   update:function()
   {
      var e=this.getElement("gameState");
      if (e)
         this.setInnerHtml(e,this.getHeaderHtml());
      this.updateTeamTitles();
      if (this.isLog)
         this.logUpdate();
      else
      {
         this.setInnerHtml("gameTitle",this.title.htmlEncode());
         this.setInnerHtml("gameMessagePrompt",(this.verbose ? this.resource("gameMessagePrompt") : ""));
         this.setInnerHtml("playerNotesPrompt",(this.verbose ? this.resource("playerNotesPrompt") : ""));
         this.setInnerHtml("gamePrompts",this.getGamePromptsHtml());
         this.setInnerHtml("actionLinks",this.getActionLinksHtml());
      }
   },
   logUpdate:function()
   {
   },
   titleFromTeamColor:function(color)
   {
      var titles=this.resource("teamTitles");
      return (titles ? titles[color] : null);
   },
   hiliteImageHtml:function(boardPoint,clipRect,zIndex,offset)
   {
      if (!zIndex)
         zIndex=400;
      var screenRect=this.screenRectFromBoardPoint(boardPoint);
      if (offset)
         screenRect.add(offset);
      return "<img id=\""+this.elementId("hilite_"+(this.hiliteIndex++))+"\" src=\""+this.getImageSrc(this.board.pieceImage).htmlEncode()+"\" style=\""+GamesByEmail.positionImage(null,screenRect,clipRect).htmlEncode()+";z-index:"+zIndex+"\">";
   },
   teamColorFromTeam:function(team)
   {
      return team.index;
   },
   synchTeam:function(team)
   {
      team.color=this.teamColorFromTeam(team);
      team.title=this.titleFromTeamColor(team.color);
      if (team.title==null)
         team.title="";
   },
   setPerspective:function(color)
   {
      this.rotation=0;
   },
   synch:function()
   {
      if (this.pieces &&
          this.pieces.cancelFlashes)
         this.pieces.cancelFlashes();
      this.clearNotifications();
      this.move.log="";
      this.note="";
      for (var i=0;i<this.teams.length;i++)
         this.synchTeam(this.teams[i]);
      this.madeMove=false;
      this.readyToSend=false;
      if (this.perspectiveColor!=this.player.team.color)
         this.setPerspective(this.player.team.color);
      this.perspectiveColor=this.player.team.color;
      this.hiliteIndex=0;
   },
   addNote:function(message)
   {
      this.note+=message+"\n";
   },
   clearNotifications:function()
   {
      this.notify.clear();
      this.teams.clearNotifications();
   },
   setMessageAndNotes:function(message,notes,teamMessage)
   {
      if (!this.isLog && arguments.length>0 && message!=null)
      {
         var mr=this.getElement("gameMessageRead");
         if (mr && mr.value!=message)
         {
            mr.value=message;
            window.setTimeout("var e=document.getElementById('"+mr.id+"'); var m=e.value; e.value=''; e.value=m;window.setTimeout(\"document.getElementById('"+mr.id+"').scrollTop=1000000;\",1);",1);
         }
      }
      if (!this.isLog && arguments.length>1 && notes!=null)
      {
         var pn=this.getElement("playerNotes");
         if (pn)
            pn.value=notes;
      }
      if (!this.isLog && arguments.length>2 && teamMessage!=null)
      {
         var mr=this.getElement("teamMessageRead");
         if (mr && mr.value!=teamMessage)
         {
            mr.value=teamMessage;
            window.setTimeout("var e=document.getElementById('"+mr.id+"'); var m=e.value; e.value=''; e.value=m;window.setTimeout(\"document.getElementById('"+mr.id+"').scrollTop=1000000;\",1);",1);
         }
      }
   },
   clearUnsentMoves:function(dump)
   {
      if (dump)
      {
         this._movesToSend=null;
         this._preMoveLog="";
      }
      else
         if (typeof(this._movesToSend)!="undefined" && this._movesToSend!=null && this._movesToSend.length>0)
         {
            if (this.testing)
               GamesByEmail.Testing.clearUnsentMoves(this._movesToSend.length);
            this._movesToSend.length=0;
            this.move.log=this._preMoveLog;
            this.move.number=this._preMoveNumber;
         }
   },
   doInitialization:function(numPlayers)
   {
      this.move.number=0;
      this.note="";
      this.initialize(numPlayers,0);
      if (typeof(this.move.player)=="string")
         this.move.player=this.findPlayerByIndices(this.move.player);
      this.sendInitializationToServer();
   },
   sendInitializationToServer:function()
   {
      this._movesToSend=Foundation.jsSerialize(this);
      this.setCatchAndDebug();
      this.serverSerialized("receiveData","methodDomain","serverMethods","GameInitialization",this._movesToSend,Foundation.jsSerialize(this._playerId),Foundation.jsSerialize(1));
      this.showTransactionPrompt("sendingInitialization");
   },
   maybeSwitchPlayers:function()
   {
      var team;
      if (!this.player.team.status.myTurn &&
          (team=(this.status.playing ? this.getTurnTeam() : this.findWinningTeam())) &&
          team.id!=0 &&
          team.players.length>0 &&
          team.players[0].id!=0)
         this.player=team.players[0];
   },
   sendSetGameEndedTurnsOff:function()
   {
      this.setCatchAndDebug();
      this.server("receiveSetGameEndedTurnsOff","methodDomain","serverMethods","SetGameEndedTurnsOff",this.player.id);
   },
   receiveSetGameEndedTurnsOff:function(status)
   {
   },
   setMyTurnsOffForUs:function(team)
   {
      if (team.isUs)
         team.status.myTurn=false;
   },
   setGameEndedTurnsOff:function()
   {
      if (!this.spectating && !this.status.playing && this.player.team.status.myTurn)
      {
         this.forEachTeam("setMyTurnsOffForUs");
         this.sendSetGameEndedTurnsOff();
      }
   },
   setSpectatingStatus:function(spectating,indexString)
   {
      this.spectating=(spectating || this.player==null);
      if (this.spectating)
      {
         if (!indexString &&
             window.location.hash.search(/#(\d{1,2}(,\d{1,2})*)/)==0)
            indexString=RegExp.$1;
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
            this.player=this.findPlayer();
      }
   },
   doSyncronization:function()
   {
      GamesByEmail.Game.$maybeSetWindowTitle(this.title);
      this.move.log="";
      this.setSpectatingStatus();
      this.setPlayerPrefs();
      this.enablePermanentControls();
      this.areOfferingDraw=false;
      this.setGameEndedTurnsOff();
      this.maybeSwitchPlayers();
      this.synch();
      this.setMessageAndNotes(this.message,this.player.message,this.player.team.team ? this.player.team.team.message : null);
      this.setConstrainer();
      this.update();
   },
   enablePermanentControls:function()
   {
      var list=this.resource("permanentControlList");
      var e;
      if (list)
         for (var i=0;i<list.length;i++)
            if (e=this.getElement(list[i]))
               e.disabled=this.spectating;
   },
   load:function(id)
   {
      this.setCatchAndDebug();
      this.server("receiveData","methodDomain","serverMethods","GetGame",id.toString());
   },
   receiveData:function(rawGame)
   {
      this.importRawGame(rawGame);
      if (this.status.uninitialized)
         this.doInitialization(this.rawGame.numUninitializedPlayers);
      else
         this.doSyncronization();
   },
   importRawGame:function(rawGame)
   {
      this.clearUnsentMoves(true);
      this.rawGame=rawGame;
      this.importData(this.rawGame);
   },
   importData:function(gameData)
   {
      var logOnly=(arguments.length>=2);
      this.id=gameData.id;
      this.type=gameData.type;
      this.title=gameData.title;
      this.message=gameData.message;
      this.maxMoveNumber=gameData.maxMoveNumber;
      this.status.importData(gameData.status);
      this.info.importData(gameData.info,true);
      this.teams.importData(gameData.teams,logOnly);
      this.move.importData(gameData.move,logOnly);
      this._playerId=gameData._playerId;
      this.created=new Date(gameData.created);
      this.lastMove=new Date(gameData.lastMove);
      this.numberOfDistinctPlayers=gameData.numberOfDistinctPlayers;
      if (!this.status.uninitialized)
         this.player=this.findPlayerByIndices(gameData.player);
   },
   importLog:function(gameData,index)
   {
      try
      {
         this.status.importData(gameData.status[index]);
         this.info.importData(gameData.infos[index],true);
         this.teams.importLog(gameData.teams,index);
         this.move.importLog(gameData.moves[index]);
      }
      catch(e)
      {
         return false;
      }
      return true;
   },
   findPlayerByIndices:function(indices)
   {
      if (indices.length==0)
         return null;
      indices=indices.split(",");
      var p=this;
      var last=parseInt(indices.pop());
      for (var i=0;i<indices.length;i++)
         p=p.teams[parseInt(indices[i])];
      if (p.players && last<p.players.length)
         return p.players[last];
      return p=p.teams[last].players[0];
   },
   washHtml:function(html)
   {
      html=html.toString();
      html=html.replace(/<img /gi,"<img galleryimg=false ");
      html=GamesByEmail.insertStyleForElements(html,"p","margin-top:2px;margin-bottom:10px");
      html=GamesByEmail.insertStyleForElements(html,"table","font:"+this.font);
      return html;
   },
   getHtml:function()
   {
      return this.washHtml(this.appendHtml(new Foundation.StringBuilder()).toString()+GamesByEmail.elementTitleHtml());
   },
   setInnerHtml:function(o,html)
   {
      if (typeof(o)=="string")
         o=this.getElement(o);
      if (o)
         o.innerHTML=this.washHtml(html);
   },
   appendBoardHtml:function(htmlBuilder)
   {
      var imageSize=this.board.image.size;
      if (this.territories)
         this.territories.appendHtml(htmlBuilder,this.board.image.size);
      else
         this.pieces.appendHtml(htmlBuilder,this.board.image.size);
      htmlBuilder.append("<img id=\""+this.elementId("boardImage")+"\" src=\""+this.getImageSrc(this.board.image.src).htmlEncode()+"\" width=\""+this.board.image.size.x+"\" height=\""+this.board.image.size.y+"\" style=\"z-index:0\">");
      return htmlBuilder;
   },
   appendBoardLayoutHtml:function(htmlBuilder)
   {
      var imageSize=this.board.image.size;
      htmlBuilder.append("<div id=\""+this.elementId("boardContainer")+"\" style=\"width:"+imageSize.x+"; height:"+imageSize.y+"\">");
      htmlBuilder.append("<div id=\""+this.elementId("aboveBoard")+"\" style=\"position:absolute;z-index:1000\" "+this.mouseEvents(true)+"></div>");
      htmlBuilder.append("<div id=\""+this.elementId("mouseEventContainer")+"\" style=\"position:absolute;width:"+imageSize.x+"; height:"+imageSize.y+"\" "+this.mouseEvents()+">");
      htmlBuilder.append("<div id=\""+this.elementId("overlay")+"\" style=\"position:absolute;width:"+imageSize.x+"; height:"+imageSize.y+";overflow:hidden;z-index:400\"></div>");
      htmlBuilder.append("<div id=\""+this.elementId("mouse")+"\" style=\"position:absolute;top:0;left:0;visibility:hidden;z-index:1000;"+this.resource("mouseStyle")+"\"></div>");
      this.appendBoardHtml(htmlBuilder);
      htmlBuilder.append("</div>");
      htmlBuilder.append("<div id=\""+this.elementId("floatContainer")+"\" style=\"position:absolute;width:"+imageSize.x+"; height:"+imageSize.y+";overflow:hidden;visibility:hidden;z-index:1000\">");
      htmlBuilder.append("<div id=\""+this.elementId("float")+"\" style=\"position:absolute;top:0;left:0;visibility:hidden;z-index:1000;"+this.resource("floatStyle")+"\"></div>");
      htmlBuilder.append("</div>");
      htmlBuilder.append("</div>");
      return htmlBuilder;
   },
   appendControlsHtml:function(htmlBuilder)
   {
      var updateFontId=this.elementId("updateFonts");
      htmlBuilder.append("  <table name=\""+updateFontId+"\" cellspacing=\"1px\" cellpadding=0 border=0>");
      htmlBuilder.append("   <tr><td width=\"100%\">"+this.getTextareaHtml("gameMessageRead","disabled wrap=soft rows=7 cols=\"\" readonly style=\"background-color:#eeeeee;width:100%\"")+"</textarea></td><td>"+this.getVButtonHtml(this.resource("clear"),"clearGameMessage",this.event("clearGameMessage()",true),"disabled")+"</td></tr>");
      htmlBuilder.append("   <tr><td colspan=2 id=\""+this.elementId("gameMessagePrompt")+"\"></td></tr>");
      htmlBuilder.append("   <tr><td colspan=2 nowrap><table name=\""+updateFontId+"\" cellspacing=0 cellpadding=0 width=\"100%\"><tr><td width=\"100%\" valign=middle>"+GamesByEmail.expandingTextareaHtml(this.elementId("gameMessageWrite"),"100%",16,5,null,"disabled")+"</td><td valign=middle>"+this.getButtonHtml(this.resource("post"),"sendGameMessage",this.event("sendGameMessage()",true),null,"disabled")+"</td></tr></table></td></tr>");
      htmlBuilder.append("   <tr><td colspan=2 width=\"100%\" id=\""+this.elementId("gamePrompts")+"\"></td></tr>");
      htmlBuilder.append("   <tr><td colspan=2 id=\""+this.elementId("actionLinks")+"\"></td></tr>");
      htmlBuilder.append("   <tr><td colspan=2 id=\""+this.elementId("playerNotesPrompt")+"\"></td></tr>");
      htmlBuilder.append("   <tr><td>"+this.getTextareaHtml("playerNotes","disabled wrap=soft rows=3 cols=\"\" style=\"width:100%\"")+"</textarea></td><td>"+this.getVButtonHtml(this.resource("save"),"savePlayerNotes",this.event("savePlayerNotes()",true),"disabled")+"</td></tr>");
      htmlBuilder.append("  </table>");
      return htmlBuilder;
   },
   printerFriendlyLogHtml:function()
   {
      var html=new Foundation.StringBuilder();
      var log=this.getElement("log");
      html.append("<html>\n");
      html.append("<head>\n");
      html.append("<title>"+window.document.title.htmlEncode()+"</title>\n");
      html.append("</head>\n");
      html.append("<body>\n");
      html.append("<h3 style=\"margin:5\">"+this.title.htmlEncode()+"</h3>");
      var player=null;
      while (player=this.findNextPlayer(player))
         html.append("<h4 style=\"margin:0\">"+player.logTitle().htmlEncode()+"</h4>");
      html.append("<p><div style=\"width:"+log.offsetWidth+"\">\n");
      html.append(log.innerHTML.replace(/<A[^>]*style=/gi,"<SPAN style=").replace(/onfocus=[^>]*>/gi,">").replace(/<\/A>/gi,"</SPAN>"));
      html.append("</div>\n");
      html.append("</body>\n");
      html.append("</html>\n");
      return html.toString();
   },
   printerFriendlyLog:function(event)
   {
      this.openPopup(event,this.resource("printerFriendlyLogSize"),this.event("printerFriendlyLogHtml();"),"printerFriendlyFeatures");
   },
   appendLogHtml:function(htmlBuilder)
   {
      var logMovesAreaSize=this.resource("logMovesAreaSize");
      if (logMovesAreaSize==null)
         logMovesAreaSize=this.getLogDialogSize("logSize").y-45;
      htmlBuilder.append("  "+this.getAnchorHtml(this.resource("printerFriendlyLog"),"printerFriendlyLog",this.event("printerFriendlyLog(event)"),"style=\"width:100%\"")+this.resource("printerFriendlyLog")+"</a><div id=\""+this.elementId("log")+"\" style=\"background-color:#eeeeee;width:100%;height:"+logMovesAreaSize+"px;margin-bottom:5px;overflow:auto\"></div><input type=button value=\""+this.resource("closeWindow")+"\" onclick=\"window.close();\" style=\"width:100%\">");
      return htmlBuilder;
   },
   appendGameStateRowHtml:function(htmlBuilder)
   {
      htmlBuilder.append("   <tr><td align=center valign=middle id=\""+this.elementId("gameState")+"\" style=\"font-size:200%;font-weight:bold\">&nbsp;</td></tr>");
      return htmlBuilder;
   },
   appendBoardSpaceHtml:function(htmlBuilder)
   {
      htmlBuilder.append("  <table id=\""+this.elementId("boardSpaceTable")+"\" name=\""+this.elementId("updateFonts")+"\" cellspacing=0 cellpadding=0 border=0 width=\""+this.board.image.size.x+"px\">");
      this.appendGameStateRowHtml(htmlBuilder);
      htmlBuilder.append("   <tr><td id=\""+this.elementId("topTeamTitles")+"\" align=right valign=bottom>&nbsp;</td></tr>");
      htmlBuilder.append("   <tr><td id=\""+this.elementId("boardSpaceCell")+"\" align=left valign=top height=\""+this.board.image.size.y+"px\" oncontextmenu=\"return false;\">");
      this.appendBoardLayoutHtml(htmlBuilder);
      htmlBuilder.append("       </td></tr>");
      htmlBuilder.append("   <tr><td align=right valign=center id=\""+this.elementId("bottomTeamTitles")+"\">&nbsp;</td></tr>");
      htmlBuilder.append("  </table>");
      return htmlBuilder;
   },
   appendTestControlsHtml:function(htmlBuilder)
   {
      return htmlBuilder;
   },
   appendInnerHtml:function(htmlBuilder)
   {
      var updateFontId=this.elementId("updateFonts");
      htmlBuilder.append("<table name=\""+updateFontId+"\" cellspacing=\"5px\" cellpadding=0 border=0 width=\"100%\" ondragstart=\"return false\">");
      this.appendTestControlsHtml(htmlBuilder);
      if (!this.isLog)
         htmlBuilder.append(" <tr><td id=\""+this.elementId("gameTitle")+"\" colspan=2 align=center style=\"font-size:200%;font-weight:bold\">&nbsp;</td></tr>");
      var width="";
      try {width=this.board.image.size.x;}catch(e){};
      htmlBuilder.append(" <tr><td id=\""+this.elementId("boardSpace")+"\" valign=top width=\""+width+"px\">");
      this.appendBoardSpaceHtml(htmlBuilder);
      if (this.isLog)
      {
         if (this.logSettings.placement==1)
            htmlBuilder.append(" </td></tr><tr><td id=\""+this.elementId("controlSpace")+"\" valign=top width=\"100%\">");
         else if (this.logSettings.placement==2)
            htmlBuilder.append(" </td><td id=\""+this.elementId("controlSpace")+"\" valign=top width=\"100%\"></td></tr><tr><td colspan=2 valign=top width=\"100%\">");
         else if (this.logSettings.placement==3)
            htmlBuilder.append(" </td><td rowspan=2 valign=top width=\"100%\"><div id=\""+this.elementId("controlSpace")+"\" style=\"overflow:auto;width:100%;height:"+this.resource("logSize").y+"\"></div></td></tr><tr><td valign=top height=\"100%\">");
         else
            htmlBuilder.append(" </td><td id=\""+this.elementId("controlSpace")+"\" valign=top width=\"100%\">");
         this.appendLogHtml(htmlBuilder);
      }
      else
      {
         htmlBuilder.append(" </td><td id=\""+this.elementId("controlSpace")+"\" valign=top width=\"100%\">");
         this.appendControlsHtml(htmlBuilder);
      }
      htmlBuilder.append(" </td></tr>");
      htmlBuilder.append("</table>");
      return htmlBuilder;
   },
   appendHtml:function(htmlBuilder)
   {
      htmlBuilder.append("<span id=\""+this.elementId("gameContainer")+"\">");
      this.appendInnerHtml(htmlBuilder);
      htmlBuilder.append("</span>");
      return htmlBuilder;
   },
   updateBoardImageSize:function()
   {
      if (this.board && this.board.image && this.board.image.size)
      {
         var imageSize=this.board.image.size;
         var e;
         if (e=this.getElement("boardSpace"))
            e.width=imageSize.x;
         if (e=this.getElement("boardSpaceTable"))
            e.width=imageSize.x;
         if (e=this.getElement("boardSpaceCell"))
            e.height=imageSize.y;
         if (e=this.getElement("boardImage"))
         {
            e.width=imageSize.x;
            e.height=imageSize.y;
         }
         if (e=this.getElement("boardContainer"))
         {
            e.style.width=imageSize.x;
            e.style.height=imageSize.y;
         }
         if (e=this.getElement("mouseEventContainer"))
         {
            e.style.width=imageSize.x;
            e.style.height=imageSize.y;
         }
         if (e=this.getElement("overlay"))
         {
            e.style.width=imageSize.x;
            e.style.height=imageSize.y;
         }
         if (e=this.getElement("floatContainer"))
         {
            e.style.width=imageSize.x;
            e.style.height=imageSize.y;
         }
         if (this.pieces && this.pieces.updateBoardImageSize)
            this.pieces.updateBoardImageSize(imageSize);
         if (this.territories && this.territories.updateBoardImageSize)
            this.territories.updateBoardImageSize(imageSize);
      }
   },
   clearCachedElements:function()
   {
   },
   setAboveBoardHtml:function(html,zIndex)
   {
      var e=this.getElement("aboveBoard");
      if (zIndex)
         e.style.zIndex=zIndex;
      this.setInnerHtml(e,html);
   },
   setOverlayHtml:function(html,zIndex)
   {
      var e=this.getElement("overlay");
      if (zIndex)
         e.style.zIndex=zIndex;
      this.setInnerHtml(e,html);
   },
   redraw:function()
   {
      var e;
      var savedMessages=new Object();
      savedMessages.gameMessageRead=((e=this.getElement("gameMessageRead"))!=null ? e.value : null);
      savedMessages.gameMessageWrite=((e=this.getElement("gameMessageWrite"))!=null ? e.value : null);
      savedMessages.playerNotes=((e=this.getElement("playerNotes"))!=null ? e.value : null);
      savedMessages.teamMessageRead=((e=this.getElement("teamMessageRead"))!=null ? e.value : null);
      savedMessages.teamMessageWrite=((e=this.getElement("teamMessageWrite"))!=null ? e.value : null);
      this.clearCachedElements();
      this.setInnerHtml("gameContainer",this.appendInnerHtml(new Foundation.StringBuilder()).toString());
      if (savedMessages.gameMessageRead && (e=this.getElement("gameMessageRead"))!=null)
      {
          e.value=savedMessages.gameMessageRead;
          e.scrollTop=10000000;
      }
      if (savedMessages.gameMessageWrite && (e=this.getElement("gameMessageWrite"))!=null)
      {
          e.value=savedMessages.gameMessageWrite;
          e.scrollTop=10000000;
      }
      if (savedMessages.playerNotes && (e=this.getElement("playerNotes"))!=null)
      {
          e.value=savedMessages.playerNotes;
          e.scrollTop=10000000;
      }
      if (savedMessages.teamMessageRead && (e=this.getElement("teamMessageRead"))!=null)
      {
          e.value=savedMessages.teamMessageRead;
          e.scrollTop=10000000;
      }
      if (savedMessages.teamMessageWrite && (e=this.getElement("teamMessageWrite"))!=null)
      {
          e.value=savedMessages.teamMessageWrite;
          e.scrollTop=10000000;
      }
      e=savedMessages=null;
   },
   receiveGameMessage:function(message)
   {
      if (typeof(message)=="undefined" || message==null)
         message="";
      else
         message=message.toString();
      var e=this.getElement("gameMessageRead");
      e.value=message;
      e.scrollTop=1000000;
      e=this.getElement("gameMessageWrite");
      if (message.replace(/\r/g,"").indexOf(e.value.replace(/\r/g,"").trim())>=0)
      {
         e.value="";
         if (typeof(e.onkeyup)=="function")
            e.onkeyup();
      }
      this.getElement("clearGameMessage").disabled=this.spectating;
      this.getElement("sendGameMessage").disabled=this.spectating;
   },
   sendGameMessageToServer:function(message)
   {
      this.setCatchAndDebug();
      this.server("receiveGameMessage","methodDomain","serverMethods","GameMessage",this.player.id,message);
   },
   clearGameMessage:function()
   {
      this.sendGameMessageToServer(null);
   },
   sendGameMessage:function()
   {
      this.sendGameMessageToServer(this.getElement("gameMessageWrite").value.trim());
   },
   receivePlayerNotes:function(notes)
   {
      this.player.message=this.getElement("playerNotes").value=notes;
      this.getElement("savePlayerNotes").disabled=this.spectating;
   },
   sendPlayerNotesToServer:function(notes)
   {
      this.setCatchAndDebug();
      this.server("receivePlayerNotes","methodDomain","serverMethods","PlayerMessage",this.player.id,notes);
   },
   savePlayerNotes:function()
   {
      this.sendPlayerNotesToServer(this.getElement("playerNotes").value);
   },
   receiveTeamMessage:function(teamMessageResponse)
   {
      if (typeof(teamMessageResponse.message)=="undefined" || teamMessageResponse.message==null)
         teamMessageResponse.message="";
      else
         teamMessageResponse.message=teamMessageResponse.message.toString();
      var e=this.getElement("teamMessageRead");
      e.value=teamMessageResponse.message;
      e.scrollTop=1000000;
      e=this.getElement("teamMessageWrite");
      if (teamMessageResponse.message.replace(/\r/g,"").indexOf(e.value.replace(/\r/g,"").trim())>=0)
      {
         e.value="";
         if (typeof(e.onkeyup)=="function")
            e.onkeyup();
      }
      this.getElement("clearTeamMessage").disabled=this.spectating;
      this.getElement("sendTeamMessage").disabled=this.spectating;
   },
   sendTeamMessageToServer:function(message,teamId)
   {
      this.setCatchAndDebug();
      this.server("receiveTeamMessage","methodDomain","serverMethods","TeamMessage",this.player.id,teamId,message);
   },
   sendTeamMessage:function(teamId)
   {
      this.sendTeamMessageToServer(this.getElement("teamMessageWrite").value.trim(),teamId);
   },
   clearTeamMessage:function(teamId)
   {
      this.sendTeamMessageToServer(null,teamId);
   },
   getScriptId:function()
   {
      return GamesByEmail.constructorName(this.constructor)+"_js";
   },
   getScriptSrc:function()
   {
      return GamesByEmail.getScriptSrc(this.getScriptId());
   },
   mouseEvents:function(overboard,skipId)
   {
      var e=" ";
      if (skipId)
         skipId="'"+this.elementId(skipId).cEncode()+"'";
      else
         skipId="null";
      if (overboard)
         e+="onmouseover=\"GamesByEmail.Game.$mouseEvent(this,event,'onMouseOut',"+this.$Foundation_$registry_index+","+skipId+");\" ";
      else
      {
         var events=new Array("onMouseOver","onMouseOut","onMouseMove","onMouseDown","onMouseUp");
         for (var i=0;i<events.length;i++)
            e+=events[i].toLowerCase()+"=\"GamesByEmail.Game.$mouseEvent(this,event,'"+events[i]+"',"+this.$Foundation_$registry_index+","+skipId+");\" ";
      }
      return e;
   },
   getTextHtml:function(value,id,attributes)
   {
      if (value==null) value="";
      if (!attributes) attributes="";
      return "<input id=\""+this.elementId(id).htmlEncode()+"\" type=text value=\""+value.toString().htmlEncode()+"\" "+attributes+">";
   },
   getTextareaHtml:function(id,attributes)
   {
      if (!attributes) attributes="";
      return "<textarea id=\""+this.elementId(id).htmlEncode()+"\" "+attributes+">";
   },
   getSelectHtml:function(id,eventCode,attributes)
   {
      eventCode=eventCode ? "onchange=\""+eventCode.htmlEncode()+"\"" : "";
      if (!attributes) attributes="";
      return "<select id=\""+this.elementId(id).htmlEncode()+"\" "+eventCode+" "+attributes+">";
   },
   getOptionHtml:function(title,value,defaultValue)
   {
      return "<option value=\""+value.toString().htmlEncode()+"\" "+(value==defaultValue ? "selected" : "")+">"+title.toString().htmlEncode()+"</option>";
   },
   getButtonHtml:function(title,id,eventCode,clickTitle,attributes,styles)
   {
      if (clickTitle)
         eventCode="this.value=\""+clickTitle.cEncode()+"\";"+eventCode;
      eventCode=eventCode ? "onclick=\""+eventCode.htmlEncode()+"\"" : "";
      if (document.all && eventCode.length>0)
         eventCode+=" ondblclick=\"return this.onclick();\"";
      if (!attributes) attributes="";
      if (!styles) styles="";
      attributes+=" align=absmiddle style=\""+styles+";padding-left:2;padding-right:2;padding-top:0;padding-bottom:0;margin:0;overflow:visible;"+(styles.indexOf("font:")<0 ? "font:"+this.font : "")+"\"";
      return "<input type=button id=\""+this.elementId(id).htmlEncode()+"\" value=\""+title.toString().htmlEncode()+"\" "+eventCode+" "+attributes+">";
   },
   getHtmlButtonHtml:function(id,eventCode,attributes)
   {
      eventCode=eventCode ? "onclick=\""+eventCode.htmlEncode()+"\"" : "";
      if (document.all && eventCode.length>0)
         eventCode+=" ondblclick=\"return this.onclick();\"";
      if (!attributes) attributes="";
      return "<button type=\"button\" id=\""+this.elementId(id).htmlEncode()+"\" "+eventCode+" "+attributes+">";
   },
   getVButtonHtml:function(title,id,eventCode,attributes,styles)
   {
      if (!attributes) attributes="";
      if (!styles) styles="";
      attributes=attributes+" style=\""+styles+";font-size:100%;font-family:lucida console\"";
      var vTitle="";
      for (var i=0;i<title.length;i++)
      {
         if (i>0)
            vTitle+="<br>";
         vTitle+=title.charAt(i).htmlEncode();
      }
      return this.getHtmlButtonHtml(id,eventCode,attributes)+vTitle+"</button>";
   },
   getCheckboxHtml:function(checked,id,eventCode,attributes)
   {
      checked=checked ? "checked" : "";
      eventCode=eventCode ? "onclick=\""+eventCode.htmlEncode()+"\"" : "";
      if (!attributes) attributes="";
      return "<input type=checkbox id=\""+this.elementId(id).htmlEncode()+"\" "+eventCode+" "+attributes+" "+checked+">";
   },
   getRadioHtml:function(checked,id,index,eventCode,attributes)
   {
      checked=checked ? "checked" : "";
      eventCode=eventCode ? "onclick=\""+eventCode.htmlEncode()+"\"" : "";
      if (!attributes) attributes="";
      return "<input type=radio id=\""+this.elementId(id,index).htmlEncode()+"\" name=\""+this.elementId(id).htmlEncode()+"\" "+eventCode+" "+attributes+" "+checked+">";
   },
   getAnchorHtml:function(title,id,eventCode,attributes)
   {
      eventCode=eventCode ? "onclick=\"event.returnValue=false;event.cancelBubble=true;"+eventCode.htmlEncode()+";return false;\"" : "";
      if (!attributes) attributes="";
      var statusTitle=this.typeTitle()+": "+title.toString();
      if (GamesByEmail.notIe)
         statusTitle="#";
      return "<a id=\""+this.elementId(id).htmlEncode()+"\" href=\""+statusTitle.replace(/\s+/g,"").htmlEncode()+"\" "+eventCode+" "+attributes+" onmouseover=\"this._PreviousStatus=window.status; window.status='"+statusTitle.cEncode().htmlEncode()+"';return true;\" onmouseout=\"window.status=this._PreviousStatus;return true;\">";
   },
   clearMouseEvents:function()
   {
      this.onMouseDown=null;
      this.onMouseUp=null;
      this.onLeftMouseDown=null;
      this.onLeftMouseUp=null;
      this.onRightMouseDown=null;
      this.onRightMouseUp=null;
      this.onMiddleMouseDown=null;
      this.onMiddleMouseUp=null;
      this.onMouseOver=null;
      this.onMouseMove=null;
      this.onMouseOut=null;
      this.lastMousePoint=null;
      this.onDragByClicks=null;
      this.$dragByClickState=null;
      if (this.territories && this.territories.clearMouseEvents)
         this.territories.clearMouseEvents();
   },
   clearHilites:function(unclear)
   {
      var e;
      for (var i=0;i<this.hiliteIndex;i++)
         if (e=this.getElement("hilite_"+i))
            e.style.visibility=unclear ? "visible" : "hidden";
   },
   showPoint:function(point,size)
   {
      this.showPolygon(new Array(point),size);
   },
   showPolygon:function(polygon,size)
   {
      if (!size)
         size=0;
      var offset=GamesByEmail.elementPageOffset(this.getElement("pieces"));
      for (var i=0;i<polygon.length;i++)
      {
         point=point.clone().add(offset);
         var d=document.createElement("DIV");
         d.style.position="absolute";
         d.style.font="1px verdana";
         d.style.backgroundColor=(new Array("#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"))[size%6];
         d.style.left=point.x-2*(size+1);
         d.style.top=point.y-2*(size+1);
         d.style.width=d.style.height=5+(4*size);
         d.style.zIndex=100000;
         d.innerHTML="&nbsp;";
         document.body.appendChild(d);
      }
   },
   getPieceRect:function(boardValue,value,color,boardPoint)
   {
      return boardValue==null ? null : this.board.pieceRects[boardValue];
   },
   getPieceSrc:function()
   {
      if (!this.board.__pieceImage)
         this.board.__pieceImage=this.getImageSrc(this.board.pieceImage);
      return this.board.__pieceImage;
   },
   getImageSrc:function(image)
   {
      return this.getStaticFolder()+"Games/"+this.resource("gameFolder")+"/Boards/"+this.resource("boardFolder")+"/"+(image ? image : "");
   },
   getStaticFolder:function()
   {
      return GamesByEmail.Game.$getStaticFolder();
   },
   getCodeFolder:function(forGame)
   {
      var folder=GamesByEmail.Game.$getCodeFolder();
      if (forGame)
         folder+=this.resource("gameFolder")+"/";
      return folder;
   },
   folder:function(html)
   {
      return GamesByEmail.Game.folder(this.resource("gameFolder")+"/"+(html ? html : ""));
   },
   typeTitle:function()
   {
      var types=this.resource("gameTypes");
      for (var i=0;i<types.length;i++)
         if (this.type==types[i])
            return (this.resource("gameTypeTitles"))[i];
      return this.resource("unknownGameTypeTitle");
   },
   jsSerialize:function(stringBuilder)
   {
      var comma=false;
      stringBuilder.append("{");
      comma=Foundation.jsSerializeProperty(stringBuilder,"id",this.id,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"status",this.status,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"info",this.info,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"teams",this.teams,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"move",this.move,comma);
      var messageWrite=this.getElement("gameMessageWrite");
      if (messageWrite && messageWrite.value.length>0 && messageWrite.value.toLowerCase()!="debug" && messageWrite.value.toLowerCase()!="debugport")
      {
         comma=Foundation.jsSerializeProperty(stringBuilder,"message",messageWrite.value,comma);
         messageWrite.value="";
         if (typeof(messageWrite.onkeyup)=="function")
            messageWrite.onkeyup();
      }
      else
         comma=Foundation.jsSerializeProperty(stringBuilder,"message","",comma);
      if (typeof(this.note)!="string")
         this.note="";
      comma=Foundation.jsSerializeProperty(stringBuilder,"note",this.note,comma);
      this.note="";
      comma=Foundation.jsSerializeProperty(stringBuilder,"notify",this.notify,comma);
      return stringBuilder.append("}");
   },
   findPlayer:function(id)
   {
      return this.teams.findPlayer(id);
   },
   findNextPlayer:function(player)
   {
      if (typeof(player)=="undefined")
         player=null;
      return this.teams.findNextPlayer({player:player});
   },
   getTurnTeam:function()
   {
      return this.teams.getTurnTeam();
   },
   findTeamByIndexString:function(indexString)
   {
      var indices=indexString.split("_");
      var teams=this.teams;
      var i;
      for (i=0;i<indices.length-1;i++)
         if (indices[i]<0 || indices[i]>=teams.length)
            return null;
         else
            teams=teams[indices[i]].teams;
      if (indices[i]<0 || indices[i]>=teams.length)
         return null;
      return teams[indices[i]];
   },
   findPlayersByChatIds:function(chatIds)
   {
      return this.teams.addPlayersByChatIds(new Array(),chatIds);
   },
   nextTeam:function(playing)
   {
      return this.player.team.nextTeam(playing);
   },
   findWinningTeam:function()
   {
      return this.teams.findWinningTeam();
   },
   numTeamsPlaying:function()
   {
      return this.teams.numPlaying();
   },
   setEnded:function(winningTeam)
   {
      this.clearNotifications();
      if (!winningTeam)
         winningTeam=null;
      this.status.playing=false;
      this.notify.ended=true;
      this.notify.winner=true;
      this.notify.elimination=true;
      this.teams.setEnded(winningTeam);
   },
   setTeamResigned:function(team)
   {
      team.status.clear();
      team.status.inPlay=true;
      team.status.myTurn=false;
      team.status.resigned=true;
      this.status.resigned=true;
      this.notify.elimination=true;
      this.notify.resigned=true;
   },
   setResigned:function()
   {
      this.setTeamResigned(this.player.team);
      var team=this.nextTeam(true);
      if (this.numTeamsPlaying()==1)
      {
         this.setEnded();
         team.status.clear();
         team.status.won=true;
         team.notify.won=true;
      }
      else
      {
         team.status.myTurn=true;
         team.notify.turn=true;
         this.notify.play=true;
      }
   },
   clearTurns:function()
   {
      this.teams.clearTurns();
   },
   isXYBoardClear:function(x,y,board)
   {
      var value=this.valueFromXYBoard(x,y,board);
      return value==null || value==this.board.clearPointValue;
   },
   isPointBoardClear:function(point,board)
   {
      return this.isXYBoardClear(point.x,point.y,board);
   },
   isXYOnBoard:function(x,y)
   {
      return this.valueIndexFromBoardXY(x,y)>=0;
   },
   isPointOnBoard:function(point)
   {
      return this.isXYOnBoard(point.x,point.y);
   },
   numInPath:function(toPoint,fromPoint,board)
   {
      var num=0;
      var step=toPoint.clone();
      step.subtract(fromPoint);
      step.sign();
      var p=fromPoint.clone();
      while (true)
      {
         p.add(step);
         if (p.equals(toPoint))
            break;
         if (this.valueFromPointBoard(p,board)!=this.board.clearPointValue)
            num++;
      }
      return num;
   },
   isPathClear:function(toPoint,fromPoint,board)
   {
      return this.numInPath(toPoint,fromPoint,board)==0;
   },
   setValueAtXY:function(x,y,board,value)
   {
      return board.setAt(this.valueIndexFromBoardXY(x,y),value);
   },
   setValueAtPoint:function(point,board,value)
   {
      return this.setValueAtXY(point.x,point.y,board,value);
   },
   movePiece:function(toPoint,fromPoint,board)
   {
      var piece=this.valueFromPointBoard(fromPoint,board);
      board=this.setValueAtPoint(fromPoint,board,this.board.clearPointValue);
      board=this.setValueAtPoint(toPoint,board,piece);
      return board;
   },
   forEachTeam:function(methodName)
   {
      return this.teams.forEach(methodName);
   },
   forEachBoardPoint:function(methodName)
   {
      var method=this[arguments[0]];
      var point=new Foundation.Point(0,0);
      var value,sizeX=this.board.size.x,sizeY=this.board.size.y;
      for (arguments[0]=point;point.y<sizeY;point.y++)
         for (point.x=0;point.x<sizeX;point.x++)
            if (this.isPointOnBoard(point) &&
                (value=method.apply(this,arguments)))
               return value;
      return null;
   },
   colorFromXYBoard:function(x,y,board)
   {
      var p=this.valueFromXYBoard(x,y,board);
      return (p==null ? -1 : this.colorFromBoardValue(p));
   },
   colorFromPointBoard:function(point,board)
   {
      return this.colorFromXYBoard(point.x,point.y,board);
   },
   isColorAtXY:function(x,y,board,color)
   {
      var p=this.valueFromXYBoard(x,y,board);
      return (p!=null && this.colorFromBoardValue(p)==color);
   },
   isColorAtPoint:function(point,board,color)
   {
      return this.isColorAtXY(point.x,point.y,board,color);
   },
   isValueColorAtXY:function(x,y,board,value,color)
   {
      var p=this.valueFromXYBoard(x,y,board);
      return (p!=null && this.colorFromBoardValue(p)==color && this.valueFromBoardValue(p)==value);
   },
   isValueColorAtPoint:function(point,board,value,color)
   {
      return this.isValueColorAtXY(point.x,point.y,board,value,color);
   },
   valueIndexFromBoardXY:function(x,y)
   {
      if (x<0 || y<0 || x>=this.board.size.x || y>=this.board.size.y)
         return -1;
      return (x+y*this.board.size.x)*this.board.pieceDataScale;
   },
   valueIndexFromBoardPoint:function(boardPoint)
   {
      if (boardPoint==null)
         return -1;
      return this.valueIndexFromBoardXY(boardPoint.x,boardPoint.y);
   },
   valueFromXYBoard:function(x,y,board)
   {
      var index=this.valueIndexFromBoardXY(x,y);
      if (index<0)
         return null;
      if (this.board.pieceDataSize<0)
      {
         var b=board.split(this.board.pieceDelimeterChar);
         for (var i=1;i<b.length;i+=2)
            if (parseInt(b[i-1])==index)
               return b[i];
         return null;
      }
      return board.substr(index,this.board.pieceDataSize);
   },
   valueFromPointBoard:function(boardPoint,board)
   {
      var index=this.valueIndexFromBoardPoint(boardPoint);
      if (index<0)
         return null;
      if (this.board.pieceDataSize<0)
      {
         var b=board.split(this.board.pieceDelimeterChar);
         for (var i=1;i<b.length;i+=2)
            if (parseInt(b[i-1])==index)
               return b[i];
         return null;
      }
      return board.substr(index,this.board.pieceDataSize);
   },
   boardPointFromValueIndex:function(index)
   {
      index/=this.board.pieceDataScale;
      return index<0 ? null : new Foundation.Point(index%this.board.size.x,Math.floor(index/this.board.size.x));
   },
   screenRectFromBoardXY:function(boardX,boardY)
   {
      var rect=new Foundation.Rectangle();
      rect.add(boardX*this.board.squareSize.x+this.board.border.x,(this.board.size.y-boardY-1)*this.board.squareSize.y+this.board.border.y);
      rect.resize(this.board.squareSize);
      if (this.rotation!=0)
      {
         var center=this.board.image.size.clone();
         center.subtract(1,1);
         center.scale(0.5);
         rect.subtract(center);
         rect.rotate(this.rotation);
         rect.add(center);
         rect.round();
      }
      return rect;
   },
   screenRectFromBoardPoint:function(boardPoint)
   {
      return this.screenRectFromBoardXY(boardPoint.x,boardPoint.y);
   },
   boardPointFromScreenXY:function(screenX,screenY)
   {
      var point=new Foundation.Point(screenX,screenY);
      if (this.rotation!=0)
      {
         var center=this.board.image.size.clone();
         center.subtract(1,1);
         center.scale(0.5);
         point.subtract(center);
         point.rotate(-this.rotation);
         point.add(center);
         point.round();
      }
      point.subtract(this.board.border);
      point.x=Math.floor(point.x/this.board.squareSize.x);
      point.y=this.board.size.y-Math.floor(point.y/this.board.squareSize.y)-1;
      return point;
   },
   boardPointFromScreenPoint:function(screenPoint)
   {
      return this.boardPointFromScreenXY(screenPoint.x,screenPoint.y);
   },
   isBoardPointHidden:function(boardPoint)
   {
      return false;
   },
   setConstrainer:function()
   {
      if (this.board.constrainer)
         this.constrainer=this.board.constrainer;
      else
         if (typeof(this.board.border)!="undefined" &&
             typeof(this.board.squareSize)!="undefined" &&
             typeof(this.board.size)!="undefined")
         {
            var rect=new Foundation.Rectangle();
            rect.resize(this.board.image.size);
            if (!this.constructor.isInstanceOf(GamesByEmail.Hex) && this.rotation!=0)
            {
               var center=this.board.image.size.clone();
               center.subtract(1,1);
               center.scale(0.5);
               rect.subtract(center);
               rect.rotate(this.rotation);
               rect.add(center);
               rect.round();
            }
            rect.inset(this.board.border);
            this.constrainer=rect;
         }
         else
            this.constrainer=null;
   },
   constrainPoint:function(screenPoint)
   {
      if (this.constrainer)
         screenPoint=this.constrainer.constrainPoint(screenPoint);
      return screenPoint;
   },
   constrainRectangle:function(screenRect)
   {
      if (this.constrainer)
         screenRect=this.constrainer.constrainRectangle(screenRect);
      return screenRect;
   },
   checkMove:function(toPoint,fromPoint)
   {
      return this.isMoveLegal(toPoint,fromPoint,this.territories ? this.territories.getValue() : this.pieces.getValue());
   },
   logAnchorOnKeyDown:function(anchor,event)
   {
      if (event.keyCode==37 ||
          event.keyCode==39 ||
          event.keyCode==38 ||
          event.keyCode==40)
      {
         var parentElement=(typeof(anchor.parentElement)=="undefined" ? "parentNode" : "parentElement");
         var children=(typeof(anchor.children)=="undefined" ? "childNodes" : "children");
         var cellIndex=anchor[parentElement].cellIndex;
         var rowIndex=anchor[parentElement][parentElement].rowIndex;
         var table=anchor[parentElement][parentElement][parentElement][parentElement];
         var row=table.rows[rowIndex];
         if (event.keyCode==37)
         {
            for (cellIndex--;cellIndex>=1 && row.cells[cellIndex][children].length==0;cellIndex--);
            if (cellIndex<1)
            {
               rowIndex--;
               if (rowIndex<0)
                  return false;
               cellIndex=table.rows[rowIndex].cells.length-1;
            }
         }
         else
            if (event.keyCode==39)
            {
               for (cellIndex++;cellIndex<row.cells.length && row.cells[cellIndex][children].length==0;cellIndex++);
               if (cellIndex>=row.cells.length)
               {
                  rowIndex++;
                  if (rowIndex>=table.rows.length)
                     return false;
                  cellIndex=1;
               }
            }
            else
            {
               rowIndex+=(event.keyCode==38 ? -1 : 1);
               if (rowIndex<0 || rowIndex>=table.rows.length)
                  return false;
               if (cellIndex>=table.rows[rowIndex].cells.length)
                  cellIndex=table.rows[rowIndex].cells.length-1;
            }
         row=table.rows[rowIndex];
         var bestIndex=-1;
         for (var i=0;i<row.cells.length;i++)
            if (row.cells[i][children].length>0 &&
                (bestIndex<0 || (Math.abs(cellIndex-i)<Math.abs(cellIndex-bestIndex))))
               bestIndex=i;
         row.cells[bestIndex][children][0].focus();
         return false;
      }
      return true;
   },
   getPlayerLogCol:function(player)
   {
      if (this.logSettings.format!=0)
         return 1;
      if (typeof(this._playerLogCols)=="undefined")
      {
         this._playerLogCols=new Object();
         for (var i=0;i<this.teams.length;i++)
            this._playerLogCols[this.teams[i].players[0].indexString()]=i+1;
      }
      return this._playerLogCols[player];
   },
   rowByRoundTurnLogEntriesHtml:function()
   {
      var html=new Foundation.StringBuilder();
      var numCols=(this.logSettings.format==0 ? this.teams.length : 1);
      var colWidth=Math.floor(100/numCols);
      var playerIndex=this.player.indexString();
      var log,move,player;
      html.append("<table width=\"100%\">");
      rowIndex=1;
      var lastLogCol=0,logCol;
      var timedProcessing=(this.logSettings.processing!=0);
      var numberVAlign=this.logSettings.numberVAlign;
      for (var i=0;i<this.gameLog.moves.length;i++)
      {
         move=this.gameLog.moves[i];
         log=move.log;
         if (move.log==null)
            continue;
         player=move.player;
         if (log.length==0)
            log="[Untitled]";
         else
            if (timedProcessing && !move.processed)
               log="[Processing...]";
         if (i==0)
         {
            html.append("<tr><td valign=\"top\" align=\"right\"><b>0.</b></td><td colspan=\""+numCols+"\" valign=\"top\">"+this.getAnchorHtml("","viewLog_"+i,this.event("viewLog("+i+")"),"onfocus=\"this.onclick(event);\" onkeydown=\"return "+this.event("logAnchorOnKeyDown(this,event);")+"\" style=\"font-weight:bold\"")+log+"</a></td>");
            lastLogCol=numCols;
         }
         else
         {
            logCol=this.getPlayerLogCol(player);
            if (rowIndex==1 || logCol<=lastLogCol)
            {
               while (lastLogCol<numCols)
               {
                  html.append("<td width=\""+colWidth+"%\"></td>");
                  lastLogCol++;
               }
               html.append("</tr><tr><td valign=\""+numberVAlign+"\" align=\"right\"><b>"+rowIndex+".</b></td>");
               rowIndex++;
            }
            else
               while (lastLogCol+1<logCol)
               {
                  html.append("<td width=\""+colWidth+"%\"></td>");
                  lastLogCol++;
               }
            lastLogCol=logCol;
            html.append("<td width=\""+colWidth+"%\" valign=\"top\">"+this.getAnchorHtml("","viewLog_"+i,this.event("viewLog("+i+")"),"onfocus=\"this.onclick(event);\" onkeydown=\"return "+this.event("logAnchorOnKeyDown(this,event);")+"\" style=\"font-weight:bold\"")+log+"</a></td>");
            if (player==playerIndex || this.spectating)
               this.defaultLogIndex=i;
         }
      }
      while (lastLogCol<numCols)
      {
         html.append("<td width=\""+colWidth+"%\"></td>");
         lastLogCol++;
      }
      if (rowIndex>1)
         html.append("</tr>");
      html.append("</table>");
      return html.toString();
   },
   rowByMoveLogEntriesHtml:function()
   {
      var html=new Foundation.StringBuilder();
      var playerIndex=this.player.indexString();
      var log,move,player;
      html.append("<table width=\"100%\">");
      var timedProcessing=(this.logSettings.processing!=0);
      var numberVAlign=this.logSettings.numberVAlign;
      for (var i=0;i<this.gameLog.moves.length;i++)
      {
         move=this.gameLog.moves[i];
         log=move.log;
         if (move.log==null)
            continue;
         player=move.player;
         if (log.length==0)
            log="[Untitled]";
         else
            if (timedProcessing && !move.processed)
               log="[Processing...]";
         html.append("<tr><td valign=\""+numberVAlign+"\" align=\"right\"><b>"+i+".</b></td><td width=\"100%\" valign=\"top\">"+this.getAnchorHtml("","viewLog_"+i,this.event("viewLog("+i+")"),"onfocus=\"this.onclick(event);\" onkeydown=\"return "+this.event("logAnchorOnKeyDown(this,event);")+"\" style=\"font-weight:bold\"")+log+"</a></td></tr>");
         if (player==playerIndex || this.spectating)
            this.defaultLogIndex=i;
      }
      html.append("</table>");
      return html.toString();
   },
   freeFormLogEntriesHtml:function()
   {
      var html=new Foundation.StringBuilder();
      var playerIndex=this.player.indexString();
      var log,move,player;
      var timedProcessing=(this.logSettings.processing!=0);
      for (var i=0;i<this.gameLog.moves.length;i++)
      {
         move=this.gameLog.moves[i];
         log=move.log;
         if (move.log==null)
            continue;
         player=move.player;
         if (log.length==0)
            log="[Untitled]";
         else
            if (timedProcessing && !move.processed)
               log="[Processing...]";
         html.append(this.getAnchorHtml("","viewLog_"+i,this.event("viewLog("+i+")"),"onfocus=\"this.onclick(event);\" onkeydown=\"return "+this.event("logAnchorOnKeyDown(this,event);")+"\" style=\"font-weight:bold\"")+log+"</a>");
         if (move.seperator)
            html.append(move.seperator);
         this.defaultLogIndex=i;
      }
      return html.toString();
   },
   logEntriesHtml:function()
   {
      if (this.logSettings.format==2)
         return this.rowByMoveLogEntriesHtml();
      if (this.logSettings.format==3)
         return this.freeFormLogEntriesHtml();
      return this.rowByRoundTurnLogEntriesHtml();
   },
   updateLogEntry:function(index,html)
   {
      var li=this.getElement("viewLog_"+index);
      if (li)
      {
         var h=li.offsetHeight;
         this.setInnerHtml(li,html);
         if (li.offsetParent.offsetTop<this.logDiv.scrollTop)
            this.logDiv.scrollTop+=(li.offsetHeight-h);
      }
   },
   processLogMove:function(move,moveIndex,info)
   {
   },
   processLogMoveEvent:function()
   {
      var move=this.gameLog.moves[this.logProcessingMove];
      move.rawLog=move.log;
      if (move.log!=null)
         this.processLogMove(move,this.logProcessingMove,this.logProcessingInformation);
      move.processed=true;
      if (move.log!=null)
      {
         if (move.log=="")
            if (this.logProcessingMove==0)
               move.log=this.resource("logStartOfGame");
            else
            {
               var p=this.findPlayerByIndices(move.player);
               if (p.team.status.resigned)
                  move.log=this.resource("logPlayerResigns"
                                        ,'p',p.title
                                        ,'t',p.team.title
                                        );
            }
         if (this.logProcessingMove>0 && this.logSettings.color==1)
            move.log=this.logColoringSpans[move.player]+move.log+"</span>";
         this.updateLogEntry(this.logProcessingMove,move.log);
      }
      this.logProcessingMove--;
      if (this.logProcessingMove<0)
      {
         var pfl=this.getElement("printerFriendlyLog");
         if (pfl)
         {
            pfl.style.visibility="visible";
            pfl.style.zIndex=10000;
         }
         if (this.logProcessingHandle)
            window.clearInterval(this.logProcessingHandle);
         this.logProcessingHandle=0;
         this.logProcessingInformation=null;
         this.logColoringSpans=null;
      }
   },
   getLogProcessingInformation:function(info)
   {
      return null;
   },
   receiveLog:function(gameLog)
   {
      this.gameLog=gameLog;
      this.logProcessingInformation=this.getLogProcessingInformation(gameLog.infos[0]);
      this.logColoringSpans=(this.logSettings.color==1 ? this.getLogColoringSpans() : null);
      this.logProcessingMove=gameLog.moves.length-1;
      if (this.logProcessingMove>=0)
         this.processLogMoveEvent();
      if (this.logSettings.processing==1 &&
          this.logProcessingMove>=0)
         this.logProcessingHandle=window.setInterval(this.event("processLogMoveEvent()"),10);
      else
         while (this.logProcessingMove>=0)
            this.processLogMoveEvent();
      this.logDiv=this.getElement("log");
      this.defaultLogIndex=0;
      this.setInnerHtml(this.logDiv,this.logEntriesHtml());
      this.logDiv.scrollTop=100000;
      var li=this.getElement("viewLog_"+this.defaultLogIndex);
      li.focus();
      body_onload();
   },
   getLogColoringSpans:function()
   {
      var spans=new Object();
      for (var i=0;i<this.teams.length;i++)
      {
         var team=this.teams[i];
         spans[team.players[0].indexString()]="<span style=\"color:"+this.getTeamLogFontColor(team)+";background-color:"+this.getTeamLogFontBgColor(team)+"\">";
      }
      return spans;
   },
   viewLog:function(index)
   {
      if (index==this._lastLogIndex)
         return;
      if (this._lastLogIndex>=0)
         this.getElement("viewLog_"+this._lastLogIndex).style.backgroundColor="";
      if (this.importLog(this.gameLog,index))
      {
         this.synch();
         this.update();
         this.getElement("viewLog_"+index).style.backgroundColor="#ffffff";
         this._lastLogIndex=index;
      }
      else
         window.close();
   },
   logEntryParts:function()
   {
      var entry="",a;
      for (var i=0;i<arguments.length;i++)
      {
         if (entry.length>0)
            entry+=",";
         a=arguments[i];
         if (typeof(a)=="string" || typeof(a)=="number")
            entry+=a;
         else if (a.constructor==Foundation.Point)
            entry+=a.x+","+a.y;
         else if (entry.length)
            for (var j=0;j<a.length;j++)
            {
               if (j>0)
                  entry+=",";
               entry+=this.logEntryParts(a[j]);
            }
      }
      return entry;
   },
   logEntry:function()
   {
      return this.logEntryParts.apply(this,arguments)+"\n";
   },
   parseLogEntries:function(log)
   {
      var entries=log.split("\n");
      entries.length--;
      for (var i=0;i<entries.length;i++)
         entries[i]=entries[i].split(',');
      return entries;
   },
   parseLastLogEntry:function(log)
   {
      var entries=log.split("\n");
      entries.length--;
      return entries[entries.length-1].split(',');
   },
   setFloatHtml:function(html,width,height,left,top)
   {
      var e=this.getElement("float");
      if (!e)
         return;
      if (typeof(html)=="undefined" || html==null || html.length==0)
      {
         e.parentNode.style.visibility="hidden";
         e.style.visibility="hidden";
         e.innerHTML="";
         return;
      }
      e.style.left=(typeof(left)=="number" ? left : 0);
      e.style.top=(typeof(top)=="number" ? top : 0);
      e.style.width=(width ? (width<1 ? Math.round(width*100)+"%" : width+"px") : "");
      e.style.height=(height ? (height<1 ? Math.round(height*100)+"%" : height+"px") : "");
      e.style.visibility="visible";
      e.parentNode.style.visibility="visible";
      this.setInnerHtml(e,html);
      if (typeof(left)!="number")
         e.style.left=Math.round((this.board.image.size.x-e.offsetWidth)/2);
      if (typeof(top)!="number")
         e.style.top=Math.round((this.board.image.size.y-e.offsetHeight)/2);
   },
   setMouseHtml:function(html,width,height)
   {
      var e=this.getElement("mouse");
      if (html==null || html.length==0)
      {
         e.style.visibility="hidden";
         e.innerHTML="";
         this.mouseHtmlSet=false;
         return;
      }
      e.style.width=(width ? (width<1 ? Math.round(width*100)+"%" : width+"px") : "");
      e.style.height=(height ? (height<1 ? Math.round(height*100)+"%" : height+"px") : "");
      this.setInnerHtml(e,html);
      this.mouseHtmlSet=true;
      this.updateMouseHtmlPosition();
   },
   updateMouseHtmlPosition:function(setVisibility)
   {
      if (this.mouseHtmlSet)
         if (this.lastMousePoint)
         {
            var e=this.getElement("mouse");
            if (setVisibility)
               e.style.visibility="visible";
            e.style.left=this.lastMousePoint.x-e.offsetWidth*this.lastMousePoint.x/this.board.image.size.x;
            e.style.top=this.lastMousePoint.y+40;
         }
         else
            if (setVisibility)
               this.getElement("mouse").style.visibility="hidden";
   },
   dieRoll:function(rollCacheSize)
   {
      return this.diceRolls(1,rollCacheSize)[0];
   },
   diceRolls:function(num,rollCacheSize)
   {
      if (false && this.inProduction())
      {
         try
         {
            this.setCatchAndDebug();
            return this.serverSynchronous("methodDomain","serverMethods","RollDice",num);
         }
         catch(e)
         {
         }
      }
      return GamesByEmail.diceRolls(num);
   },
   openPlayerChatAnchorHtml:function(id,attributes)
   {
      if (!id)
         id=null;
      if (!attributes)
         attributes=null;
      var chatIds=new Array();
      chatIds[chatIds.length]=this.player.chatId;
      for (var i=2;i<arguments.length;i++)
      {
         var player=arguments[i];
         if (player && !player.isUs && player.chatId>0)
         {
            var alreadyIn=false;
            for (var j=0;j<chatIds.length;j++)
               if (chatIds[j]==player.chatId)
               {
                  alreadyIn=true;
                  break;
               }
            if (!alreadyIn)
               chatIds[chatIds.length]=player.chatId;
         }
      }
      if (chatIds.length<2)
         return "<a>";
      chatIds.sort(function(a,b){return a-b;});
      return this.getAnchorHtml(this.resource("openChatWindow"),id,this.event("openPlayerChat(event,\""+chatIds.join(",")+"\")"),attributes);
   },
   openPlayerChat:function(mouseEvent,chatIds)
   {
      if (!this.playerChatWindows)
         this.playerChatWindows=new Object();
      if (!this.playerChatWindows[chatIds] ||
          this.playerChatWindows[chatIds].closed)
         this.playerChatWindows[chatIds]=this.openPopup(mouseEvent,this.resource("chatWindowSize"),this.event("playerChatPopupHtml(\""+chatIds+"\");"));
      if (this.playerChatWindows[chatIds].closed)
      {
         alert(this.resource("chatWindowBlocked"));
         return;
      }
      this.playerChatWindows[chatIds].focus();
   },
   playerChatPopupHtml:function(chatIds)
   {
      var html="";
      var textareaHeight="100%";
      if (window.navigator.appVersion.toLowerCase().indexOf(" (macintosh;")>0 &&
          window.navigator.appVersion.toLowerCase().indexOf(") safari/")>0)
      {
         var windowSize=this.resource("chatWindowSize");
         textareaHeight=(windowSize.y-120-30)+"px";
      }
      var players=this.findPlayersByChatIds(chatIds.split(","));
      html+="<table cellspacing=0 cellpadding=0 border=1 style=\"font:"+this.font+";width:100%;height:100%\">";
      html+="<tr>";
      var num=0;
      for (var i=0;i<players.length;i++)
         if (!players[i].isUs)
         {
            html+="<td style=\"height:30px;color:"+this.getTeamFontColor(players[i].team)+"\" align=center>"+players[i].title.htmlEncode()+"<br>"+players[i].team.title.htmlEncode()+"</td>";
            num++;
         }
      html+="</tr>";
      html+="<tr><td colspan=\""+num+"\" style=\"height:"+textareaHeight+"\">";
      html+="<textarea id=\"chatRead\" readonly style=\"width:100%;height:"+textareaHeight+";background-color:#eeeeee\">"+this.resource("loadingChatMessage").htmlEncode()+"</textarea>";
      html+="</td></tr>";
      html+="<tr><td colspan=\""+num+"\">";
      html+="<table cellspacing=0 cellpadding=0 width=\"100%\"><tr><td width=\"100%\">";
      html+="<textarea id=\"chatWrite\" rows=3 style=\"width:100%;\"></textarea>";
      html+="</td><td>";
      html+="<button type=\"button\" onclick=\"var r=window.opener."+this.event("postPlayerChatOnClick(window,'"+chatIds+"')").htmlEncode()+";if(r)alert(r);\" >"+this.resource("postChatLabelHtml")+"</button>";
      html+="</td></tr></table>";
      html+="</td></tr>";
      html+="</table>";
      this.requestPlayerChatMessage(chatIds);
      return html;
   },
   requestPlayerChatMessage:function(chatIds)
   {
      this.setCatchAndDebug();
      this.server("receivePlayerChatMessage","methodDomain","serverMethods","GetChat",this.player.id,chatIds);
   },
   receivePlayerChatMessage:function(chatMessageResponse)
   {
      if (!this.playerChatWindows)
         return;
      var win=this.playerChatWindows[chatMessageResponse.chatIds];
      if (!win.closed)
         if (chatMessageResponse.success)
         {
            var e=win.document.getElementById("chatRead");
            if (e)
            {
               e.value=chatMessageResponse.message;
               e.scrollTop=100000000;
               var e=win.document.getElementById("chatWrite");
               if (e)
               {
                  var m=e.value.replace(/\r/g,"").trim();
                  if (chatMessageResponse.message.length>m.length &&
                      chatMessageResponse.message.substr(chatMessageResponse.message.length-m.length)==m)
                     e.value="";
               }
               this.chatMessageShown(chatMessageResponse.chatIds);
            }
         }
         else
            if (chatMessageResponse.message=="[Chatting not allowed]")
               win.alert(this.resource("noChatMessage"));
            else
               win.alert(chatMessageResponse.message);
   },
   chatMessageShown:function(chatIds)
   {
      if (this.player.info[chatIds])
      {
         this.player.info[chatIds]="";
         this.updateTeamTitles();
      }
   },
   setChatStatus:function(allowChat)
   {
      this.status.noChat=!allowChat;
      this.status.checkChat=false;
      if (!this.isLog)
      {
         if (this.status.noChat)
            this.rawGame.status|=256;
         else
            this.rawGame.status&=~256;
         this.rawGame.status&=~512;
      }
      this.sendSetChatStatusRequest();
   },
   sendSetChatStatusRequest:function()
   {
      this.setCatchAndDebug();
      this.server("receiveSetChatStatusResponse","methodDomain","serverMethods","SetChatStatus",this.player.id,this.move.number,this.status.noChat);
   },
   receiveSetChatStatusResponse:function(response)
   {
      if (!response.success)
         alert(response.message);
   },
   okToChat:function()
   {
      return (this.status.noChat ? this.resource("noChatMessage") : null);
   },
   postPlayerChatOnClick:function(win,chatIds)
   {
      var r=this.okToChat();
      if (!r)
         this.postPlayerChatMessage(chatIds,win.document.getElementById('chatWrite').value);
      return r;
   },
   postPlayerChatMessage:function(chatIds,message)
   {
      this.setCatchAndDebug();
      this.server("receivePlayerChatMessage","methodDomain","serverMethods","PostChat",this.player.id,chatIds,message);
   },
   blurt:function()
   {
      this.debug();
      this.debug("      Super"+".initialize("+this.teams.length+",turnTeamIndex);");
      this.debug("      this.type="+this.type+";");
      this.status.blurt("      this.status.",this);
      this.info.blurt("      this.info.",this);
      this.teams.blurt("      this.teams");
      this.move.blurt("      this.move.",this);
      this.debug("      return;");
   },
   debug:function(value)
   {
      if (!this.debugStringBuilder)
      {
         this.debugStringBuilder=new Foundation.StringBuilder();
         this.debugClearFirst=false;
      }
      if (this.debugTimerHandle)
         window.clearTimeout(this.debugTimerHandle);
      this.debugTimerHandle=window.setTimeout(this.event("debugUpdate();"),1);
      if (arguments.length==0)
      {
         this.debugStringBuilder.clear();
         this.debugClearFirst=true;
      }
      else
         for (var i=0;i<arguments.length;i++)
         {
            if (typeof(arguments[i])=='undefined')
               this.debugStringBuilder.append('[undefined]');
            else if (arguments[i]==null)
               this.debugStringBuilder.append('[null]');
            else
               this.debugStringBuilder.append(arguments[i].toString());
            this.debugStringBuilder.append("\n");
         }
      return true;
   },
   debugUpdate:function()
   {
      this.debugTimerHandle=0;
      var e=this.getElement("gameMessageRead");
      if (e && this.debugStringBuilder)
      {
         if (this.debugClearFirst)
            e.value=this.debugStringBuilder.toString();
         else
            e.value+=this.debugStringBuilder.toString();
         e.scrollTop=1000000;
         this.debugStringBuilder=null;
      }
   },
   addProfiler:function(resourcePack)
   {
      var formLoader=new Foundation.ClientLoader();
      if (resourcePack)
         resourcePack=Foundation.jsSerialize(resourcePack);
      else
         resourcePack="";
      formLoader.readyToProcess=new Function(this.event("openProfiler("+resourcePack.cEncode()+")"));
      var src=document.all ? this.getCodeFolder()+"../Foundation.Tools.SimpleProfiler.js" : this.getStaticFolder()+"Foundation.Tools.SimpleProfiler.js";
      formLoader.receiveScriptList([{test:"!Foundation.exists('Foundation.Tools.SimpleProfiler')",src:src},
                                    {test:"true",execute:"Foundation.Tools.SimpleProfiler.doInitialScriptCommands=false"}]);
   },
   openProfiler:function(resourcePack)
   {
      if (!this.profiler)
      {
         var settings=this.resource("profilerSettings");
         if (resourcePack)
            if (settings)
               for (var i in resourcePack)
                  settings[i]=resourcePack[i];
            else
               settings=resourcePack;
         this.profiler=new Foundation.Tools.SimpleProfiler(settings);
         this.loadProfiler(this.profiler);
      }
      this.profiler.show();
      return this.profiler;
   },
   loadProfiler:function(profiler)
   {
      profiler.addClasses("GamesByEmail."+this.resource("gameFolder")+"*");
   },
   dispose:function()
   {
      Foundation.Server.prototype.dispose.call(this);
      Foundation.Resourceful.prototype.dispose.call(this);
      Foundation.Elemental.prototype.dispose.call(this);
   },
   server:Foundation.Server.prototype.server,
   serverSerialized:Foundation.Server.prototype.serverSerialized,
   serverSynchronous:Foundation.Server.prototype.serverSynchronous,
   resource:Foundation.Resourceful.prototype.resource,
   resourceUrl:Foundation.Resourceful.prototype.resourceUrl,
   event:Foundation.Elemental.prototype.event,
   elementId:Foundation.Elemental.prototype.elementId,
   getElement:Foundation.Elemental.prototype.getElement,
   getElements:Foundation.Elemental.prototype.getElements,
   getElementValue:Foundation.Elemental.prototype.getElementValue,
   parseElementId:Foundation.Elemental.prototype.parseElementId,
   attachEvent:Foundation.Elemental.prototype.attachEvent,
   detachEvent:Foundation.Elemental.prototype.detachEvent,
   processHtml:Foundation.Elemental.prototype.processHtml
};
GamesByEmail.Game.addToPage=function(elementId,gameId)
   {
      var game=new this();
      document.getElementById(elementId).innerHTML=game.getHtml();
      game.load(gameId);
      return game;
   };
GamesByEmail.Game.$classFromGameType=function(gameType)
   {
      if (!this.$childClasses)
         return null;
      for (var i=0;i<this.$childClasses.length;i++)
      {
         var gameTypes=this.$childClasses[i].resource("gameTypes");
         for (var j=0;j<gameTypes.length;j++)
            if (gameTypes[j]==gameType)
               return this.$childClasses[i];
      }
      return null;
   };
GamesByEmail.Game.$classFromNameHint=function(nameHint)
   {
      if (!this.$childClasses)
         return null;
      nameHint=nameHint.toLowerCase();
      function check(classList)
      {
         var c;
         for (var i=0;i<classList.length;i++)
            if (classList[i].$name.toLowerCase().indexOf(nameHint)>=0)
               return classList[i];
            else
               if (c=check(classList[i].$childClasses))
                  return c;
         return null;
      }
      return check(this.$childClasses);
   };
GamesByEmail.Game.$popupBase="";
GamesByEmail.Game.folder=function()
   {
      return "./";
   };
GamesByEmail.Game.$webMethodsFolder="../";
GamesByEmail.Game.$getWebMethodsFolder=function()
   {
      return this.$webMethodsFolder;
   };
GamesByEmail.Game.$staticFolder="../";
GamesByEmail.Game.$getStaticFolder=function()
   {
      return this.$staticFolder;
   };
GamesByEmail.Game.$codeFolder="./";
GamesByEmail.Game.$getCodeFolder=function()
   {
      return this.$codeFolder;
   };
GamesByEmail.Game.$setBaseFolders=function(webMethodsFolder,staticFolder,codeFolder)
   {
      if (webMethodsFolder)
      {
         this.resourcePack.methodDomain=this.$webMethodsFolder=webMethodsFolder;
      }
      if (staticFolder)
         this.$staticFolder=staticFolder;
      if (codeFolder)
         this.$codeFolder=codeFolder;
   };
GamesByEmail.Game.$maybeSetWindowTitle=function(title)
   {
      if (window.document.title==title)
         return;
      if (!this.$windowTitleAlreadySet && window.document.title=="GamesByEmail Games")
      {
         window.document.title=title;
         this.$windowTitleAlreadySet=true;
         return;
      }
      if (this.$windowTitleAlreadySet)
         window.document.title="GamesByEmail Games";
   };
GamesByEmail.Game.$cancelScroll=function(element,game)
   {
      if (element.scrollLeft!=0 || element.scrollTop!=0)
      {
         element.scrollLeft=element.scrollTop=0;
         if (typeof(element.id)!="string" || element.id.length==0)
            element.id=game.elementId("_CANCELSCROLL");
         window.setTimeout("GamesByEmal.Game.$cancelScroll(document.getElementById(\""+element.id.cEncode()+"\"));",100);
      }
   };
GamesByEmail.Game.$mousePoint=function(event,element)
   {
      if (GamesByEmail.notIe)
         if (element)
            return new Foundation.Point(event.pageX-element.offsetLeft,event.pageY-element.offsetTop);
         else
            return new Foundation.Point(event.pageX,event.pageY);
      var point=new Foundation.Point(event.clientX+document.body.scrollLeft,event.clientY+document.body.scrollTop);
      if (element)
         point.subtract(GamesByEmail.elementPageOffset(element));
      return point;
   };
GamesByEmail.Game.$dropMouseEvent=function(eventType,event,game)
   {
      if (eventType=="onMouseOver" || eventType=="onMouseOut")
      {
         var otherE=event.relatedTarget ? event.relatedTarget : (eventType=="onMouseOver" ? event.fromElement : event.toElement);
         if (!otherE)
            return true;
         var e=game.getElement("boardContainer");
         while (otherE)
            if (otherE==e)
               return true;
            else
            {
               try{otherE=otherE.parentNode;}
               catch(e){otherE=null;}
            }
      }
      return false;
   };
GamesByEmail.Game.$mouseEvent=function(element,event,eventType,registryIndex,skipId,noDrop)
   {
      if (event &&
          event.srcElement &&
          (event.srcElement.tagName=="INPUT" ||
           event.srcElement.tagName=="BUTTON" ||
           event.srcElement.tagName=="SELECT" ||
           event.srcElement.tagName=="TEXTAREA" ||
           GamesByEmail.elementHasIdInHierarchy(event.srcElement,skipId)))
         return false;
      if (event &&
          event.target &&
          GamesByEmail.elementHasIdInHierarchy(event.target,skipId))
         return false;
      var game=Foundation.$registry[registryIndex];
      this.$cancelScroll(element,game);
      if (!noDrop && this.$dropMouseEvent(eventType,event,game))
         return;
      var altEventType=null;
      var point=this.$mousePoint(event,element);
      var debugDrag=false;
      //debugDrag=true;
      if (debugDrag)
      {
         game.debug("");
         game.debug("begin "+eventType+":"+game.onDragByClicks+":"+game.$dragByClickState);
      }
      if (eventType=="onMouseDown")
      {
         if (typeof(element.setCapture)!="undefined") 
            element.setCapture(true);
         if (event.preventDefault)
            event.preventDefault();
         if (game.onDragByClicks)
            if ((game.$dragByClickState=game[game.onDragByClicks](false,game.$dragByClickState,point,event))==null)
               game.onDragByClicks=null;
            else
               return debugDrag ? game.debug("abort "+eventType+":"+game.onDragByClicks+":"+game.$dragByClickState) : null;
         else
            game.$dragByClickState=null;
         if (GamesByEmail.isLeftButtonEvent(event,this.allowMouseKeyboardModifier))
            altEventType="onLeftMouseDown";
         else if (GamesByEmail.isMiddleButtonEvent(event))
            altEventType="onMiddleMouseDown";
         else
            altEventType="onRightMouseDown";
      }
      else if (eventType=="onMouseUp")
      {
         if (typeof(element.releaseCapture)!="undefined")
            element.releaseCapture();
         if (game.onDragByClicks)
            if ((game.$dragByClickState=game[game.onDragByClicks](true,game.$dragByClickState,point,event))==null)
               game.onDragByClicks=null;
            else
               return debugDrag ? game.debug("abort "+eventType+":"+game.onDragByClicks+":"+game.$dragByClickState) : null;
         if (GamesByEmail.isLeftButtonEvent(event,this.allowMouseKeyboardModifier))
            altEventType="onLeftMouseUp";
         else if (GamesByEmail.isMiddleButtonEvent(event))
            altEventType="onMiddleMouseUp";
         else
            altEventType="onRightMouseUp";
      }
      else if (eventType=="onMouseOver")
      {
         game.lastMousePoint=point.clone();
         game.updateMouseHtmlPosition(true);
      }
      else if (eventType=="onMouseMove")
      {
         if (game.onDragByClicks)
            if (game.$dragByClickState==null)
               game.onDragByClicks=null;
            else
               return debugDrag ? game.debug("abort "+eventType+":"+game.onDragByClicks+":"+game.$dragByClickState) : null;
         if (game.lastMousePoint)
         {
            game.lastMousePoint=point.clone();
            game.updateMouseHtmlPosition(true);
         }
         else
            this.$mouseEvent(element,event,"onMouseOver",registryIndex,skipId,true);
      }
      else if (eventType=="onMouseOut")
      {
         game.lastMousePoint=null;
         game.updateMouseHtmlPosition(true);
      }
      var methodName=game[eventType];
      if (typeof(methodName)=="string" && typeof(game[methodName])=="function")
         game[methodName](point,event);
      methodName=game[altEventType];
      if (typeof(methodName)=="string" && typeof(game[methodName])=="function")
         game[methodName](point,event);
      if (game.territories && game.territories.mouseEvent)
         game.territories.mouseEvent(eventType,altEventType,point,event);
      if (debugDrag)
         game.debug("end "+eventType+":"+game.onDragByClicks+":"+game.$dragByClickState);
   };
GamesByEmail.Game.$maybeNotifyBrowser=function()
   {
      for (var i=0;i<Foundation.$registry.length;i++)
      {
         var g=Foundation.$registry[i];
         if (g && g.constructor && g.constructor.isInstanceOf &&
             g.constructor.isInstanceOf(this) &&
             g.player && g.player.team &&
             g.player.team.isMyTurn(true))
            return;
      }
      for (var i=0;i<this.$browserNotificationCallbackList.length;i++)
      {
         try{this.$browserNotificationCallbackList[i]();}
         catch(e){}
      }
   };
GamesByEmail.Game.$browserNotificationCallbackList=new Array();
GamesByEmail.Game.$registerBrowserNotification=function(callback)
   {
      for (var i=0;i<this.$browserNotificationCallbackList.length;i++)
         if (this.$browserNotificationCallbackList[i]==callback)
            return false;
      this.$browserNotificationCallbackList.push(callback);
      return true;
   };
GamesByEmail.Game.resourcePack={
      methodDomain:"http://www.GamesByEmail.com/",
      serverMethods:"Games/GameMethods.aspx",
      startAnotherGameServerMethods:"Games/GameMethods.aspx",
      spectatorUrl:"Games/Play.aspx?%i",
      defaultType:-1,
      piecesClass:GamesByEmail.Pieces,
      pieceClass:GamesByEmail.Piece,
      pieceFlashInterval:250,
      boardFolder:"Default",
      teamTitle:"%t - %p",
      turnTeamTitle:"--&gt; %t - %p",
      floatStyle:"background-color:#ffffff;border:2px solid black;padding:3px",
      mouseStyle:"background-color:#ffffff;border:2px solid black;padding:3px",
      sendingInitialization:"<h3>Sending Initialization...</h3>",
      sendingMoves:"<h3>Sending Move...</h3>",
      notYourTurn:"<p>%r %u %c",
      sendAReminder:"Send a reminder",
      errorSendingReminder:"Error sending reminder.",
      reminderSentTo:"Reminder sent to %s.",
      sendingReminder:"Sending reminder...",
      gameWasDeleted:"Game was deleted.",
      gameMessagePrompt:"Write messages to your opponent by entering them below and pressing 'Post'.",
      playerNotesPrompt:"Keep private notes for yourself by entering them below and pressing 'Save'.",
      sendingGame:"Sending game...",
      refreshTheGame:"Refresh the game",
      refreshingGame:"Refreshing game...",
      clear:"Clear",
      post:"Post",
      save:"Save",
      confirmCancelGame:"Are you sure you want to cancel the game?",
      confirmResign:"Are you sure you want to resign?",
      confirmOfferDraw:"Are you sure you want to offer a draw?",
      youMayPie:"<p>You may %p if you wish, switching colors with your opponent. You will become %o and claim %o's first move as your own. It will then be your opponent's turn to place the second piece as %t.",
      theyMayPie:"<p><b>Your opponent may pie your first move</b> if they wish, switching colors instead of moving. If so, they would become %t and claim your first move as their own. It would then be your turn again to place the second piece as %o.",
      pie:"Pie",
      confirmPie:"Are you sure you want to switch colors?",
      defaultFont:"10px Verdana",
      closeWindow:"Close window",
      newGameTitleTemplate:"%t Round %r",
      newGameTitleSearchRE:/^(.+) Round (\d+)$/,
      newGameMessage:"\n\n////////[Begin new game '%t']\\\\\\\\\\\\\\\\",
      play:"Play",
      pleaseWait:"Please wait...",
      printerFriendlyLog:"Open printer friendly log",
      unknownGameTypeTitle:"[unknown]",
      actionLinks:"<p style=\"background-color:#dddddd;padding-left:5px;padding-right:5px;padding-top:2px;padding-bottom:5px\">%lGame&nbsp;log&nbsp;at&nbsp;your&nbsp;last&nbsp;move</a>&nbsp;| %rRules&nbsp;of&nbsp;%g</a>&nbsp;| %pPreferences</a>&nbsp;| %eReport&nbsp;problem</a>&nbsp;| %sSpectator&nbsp;URL</a></p>",
      spectatorActionLinks:"<p style=\"background-color:#dddddd;padding-left:5px;padding-right:5px;padding-top:2px;padding-bottom:5px\">%lGame&nbsp;log</a>&nbsp;| %rRules&nbsp;of&nbsp;%g</a></p>",
      openLog:"Open log",
      openRules:"Open rules",
      openPreferences:"Open preferences",
      reportProblem:"Report problem",
      sendReminder:"Send reminder",
      emailSent:"Email sent",
      reminderIntervalSecs:300,
      startAnotherGame:"Start another game",
      refreshGame:"Refresh the game",
      cancelGame:"Cancel the game",
      done:"Done",
      ok:"OK",
      cancel:"Cancel",
      commit:"Commit",
      committing:"Committing...",
      back:"Back",
      undo:"Undo",
      resign:"Resign",
      acceptDraw:"Accept the draw",
      sendMove:"Send this move",
      drawOfferedHeader:"Accept Draw?",
      drawDeclinedHeader:"Draw Declined",
      drawGameHeader:"The Game Is A Draw",
      tieGameHeader:"Tie Game",
      resignedHeader:"%t Resigns",
      wonHeader:"%t Wins",
      turnHeader:"&nbsp;",
      itIsYourTurnToMove:"<p>It is your turn to move. Click and drag one of your pieces to make any %rlegal move</a>. After you move you will have the option of sending or undoing the move.</p>",
      opponentCannotMoveAlert:"%t cannot move, it is still your turn.",
      continueYourTurn:"",
      completeYourTurn:"",
      youMayUndoYourMove:"<p>You may %u your move or make a different move if you wish.</p>",
      youMaySendYourMove:"<p>If you are ready, you can %s to complete your turn.</p>",
      youMayOfferDraw:"<p>You may also offer a draw with your move if you wish. If %t accepts the draw, the game will be over and considered a tie.<br>",
      offerDrawWithThisMove:"%c<label for=\"%i\">Offer a draw with this move.</label>",
      acceptOrDeclineDraw:"<p>%t has offered a draw. You may either %a or decline the draw by moving. If you accept, the game will be over and considered a tie.</p>",
      theyDeclinedTheDraw:"<p>%t declined the draw.</p>",
      youMayResign:"<p>You may %r if you wish. The game will be over and you will have lost.</p>",
      youWin:"<p>You win!</p>",
      youLose:"<p>%t has %rwon</a>, the game is over and you lose.</p>",
      youTie:"<p>The players %rdrew</a>, the game is over and is considered a tie.</p>",
      theyResigned:"<p>%t resigned, the game is over and you win.</p>",
      youResigned:"<p>You resigned, the game is over and you lose.</p>",
      theyAcceptedTheDraw:"<p>%t accepted the draw, the game is over and is considered a tie.</p>",
      youMayStartAnotherGame:"<p>You can %s if you would like. The players will switch sides.</p>",
      youMayCancelTheGame:"<p>You may %c if you wish. The game will be deleted permanently and the links will no longer work.</p>",
      defaultPopupFeatures:"height=%h,width=%w,left=%l,top=%t,resizable=yes,fullscreen=no,channelmode=no,directories=no,status=yes,toolbar=no,menubar=no,location=no",
      reportProblemSize:new Foundation.Point(500,300),
      reportProblemTitle:"Report Problem",
      reportProblemFont:"12px verdana",
      reportProblemWeAreListening:"<h3>We are listening...</h3>\n<p style=\"font-size:125%\">Please describe the problem or your comments or suggestions:<br>",
      reportProblemSend:"Send",
      reportProblemCancel:"Cancel",
      reportProblemEnterDescription:"Please enter a description of the problem",
      reportProblemSending:"Sending...",
      reportProblemThanks:"<p>Thanks, we will get back to you as soon as we can.</p><input type=\"submit\" value=\"Close\" onclick=\"window.close();return false\" style=\"width:100%\">",
      preferencesSize:new Foundation.Point(350,150),
      preferencesTitle:"%t Game Player Preferences",
      preferencesHideExplanations:"Hide game explanations",
      preferencesFont:"Font:",
      preferencesAvailableFonts:["10px Verdana","12px Verdana","14px Verdana","16px Verdana","18px Verdana"],
      preferencesAllGames:"All %t Games",
      preferencesThisGame:"This Game Only",
      preferencesCancel:"Cancel",
      rulesSize:new Foundation.Point(500,500),
      rulesTitle:"Rules of %t",
      rulesHeader:"GamesByEmail.com <font color=\"#aaaaaa\">Rules!</font>",
      rulesFooter:"Copyright &copy; 2000-2011, GamesByEmail.com",
      rulesClose:"Close",
      rules:"<h5>Object</h5><p>Win.</p><p>Somebody feel free to fill in the details...</p>",
      logStartOfGame:"Start of game",
      logPlayerResigns:"%t Resigns",
      logSize:new Foundation.Point(600,500),
      logTitle:"%t - Game Log",
      logFooter:"Copyright &copy; 2000-2011, GamesByEmail.com",
      printerFriendlyLogSize:new Foundation.Point(400,500),
      printerFriendlyFeatures:"height=%h,width=%w,left=%l,top=%t,resizable=yes,scrollbars=yes,fullscreen=no,channelmode=no,directories=no,status=yes,toolbar=no,menubar=yes,location=no",
      openChatWindow:"Open chat window",
      chatWindowSize:new Foundation.Point(500,500),
      chatWindowBlocked:"Chat popup window blocked.",
      loadingChatMessage:"[Loading...]",
      postChatLabelHtml:"<span style=\"font:10px lucida console\">P<br>o<br>s<br>t</span>",
      noChatMessage:"Chatting is not allowed during this phase of the game.",
      permanentControlList:["gameMessageRead","clearGameMessage","gameMessageWrite","sendGameMessage","playerNotes","savePlayerNotes"],
      testingControlsLayout:"Game:%t&nbsp;&nbsp;#&nbsp;Players:%p&nbsp;&nbsp;%v<label for=\"%V\">Verbose</label>&nbsp;&nbsp;%a<span style=\"display:%x\">&nbsp;&nbsp;%b&nbsp;&nbsp;%P&nbsp;&nbsp;%s<label for=\"%S\">Spectating</label></span>&nbsp;&nbsp;&nbsp;<a href=\"http://Developer.GamesByEmail.com/Documentation/GameApi/\" target=\"GbeGameApi\">Game&nbsp;Docs</a>&nbsp;&nbsp;&nbsp;<a href=\"http://Developer.GamesByEmail.com/Documentation/Api/\" target=\"GbeFullApi\">Full&nbsp;Docs</a>",
      testingStartOver:"Start Over",
      testingBlurt:"Blurt",
      testingProfiler:"Profiler"
   }
;
GamesByEmail.Game.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Game.resource=Foundation.Resourceful.resource;
GamesByEmail.Game.resourceUrl=Foundation.Resourceful.resourceUrl;
GamesByEmail.Game.getById=Foundation.Elemental.getById;
GamesByEmail.Game.getFirst=Foundation.Elemental.getFirst;
GamesByEmail.Game.getNext=Foundation.Elemental.getNext;
GamesByEmail.Game.processHtml=Foundation.Elemental.processHtml;
GamesByEmail.Game.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Game.$constructor();
GamesByEmail.GameStatus=function()
{
   this.clear();
};
GamesByEmail.GameStatus.$parentClass=null;
GamesByEmail.GameStatus.$constructor=function(){};
GamesByEmail.GameStatus.$interfaces=new Array();
GamesByEmail.GameStatus.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.GameStatus);
GamesByEmail.GameStatus.$name="GameStatus";
GamesByEmail.GameStatus.$childClasses=new Array();
GamesByEmail.GameStatus.$container=GamesByEmail;
GamesByEmail.GameStatus.prototype={
   constructor:GamesByEmail.GameStatus,
   clear:function()
   {
      this.set(0);
   },
   set:function(value)
   {
      this.playing=((value&1)>0);
      this.draw=((value&2)>0);
      this.resigned=((value&4)>0);
      this.stalemate=((value&8)>0);
      this.drawOffered=((value&16)>0);
      this.drawDeclined=((value&32)>0);
      this.drawAccepted=((value&64)>0);
      this.uninitialized=((value&128)>0);
      this.noChat=((value&256)>0);
      this.checkChat=((value&512)>0);
   },
   importData:function(statusData)
   {
      this.set(statusData);
   },
   jsSerialize:function(stringBuilder)
   {
      var value=0;
      if (this.playing) value|=1;
      if (this.draw) value|=2;
      if (this.resigned) value|=4;
      if (this.stalemate) value|=8;
      if (this.drawOffered) value|=16;
      if (this.drawDeclined) value|=32;
      if (this.drawAccepted) value|=64;
      if (this.uninitialized) value|=128;
      if (this.noChat) value|=256;
      if (this.checkChat) value|=512;
      return stringBuilder.append(value);
   },
   blurt:function(prefix,game)
   {
      if (!this.playing) game.debug(prefix+"playing=false;");
      if (this.draw) game.debug(prefix+"draw=true;");
      if (this.resigned) game.debug(prefix+"resigned=true;");
      if (this.stalemate) game.debug(prefix+"stalemate=true;");
      if (this.drawOffered) game.debug(prefix+"drawOffered=true;");
      if (this.drawDeclined) game.debug(prefix+"drawDeclined=true;");
      if (this.drawAccepted) game.debug(prefix+"drawAccepted=true;");
      if (this.uninitialized) game.debug(prefix+"uninitialized=true;");
      if (this.noChat) game.debug(prefix+"noChat=true;");
      if (this.checkChat) game.debug(prefix+"checkChat=true;");
   },
   dispose:function()
   {
   }
};
GamesByEmail.GameStatus.PLAYING=0x001;
GamesByEmail.GameStatus.DRAW=0x002;
GamesByEmail.GameStatus.RESIGNED=0x004;
GamesByEmail.GameStatus.STALEMATE=0x008;
GamesByEmail.GameStatus.DRAW_OFFERED=0x010;
GamesByEmail.GameStatus.DRAW_DECLINED=0x020;
GamesByEmail.GameStatus.DRAW_ACCEPTED=0x040;
GamesByEmail.GameStatus.UNINITIALIZED=0x080;
GamesByEmail.GameStatus.NO_CHAT=0x100;
GamesByEmail.GameStatus.CHECK_CHAT=0x200
;
GamesByEmail.GameStatus.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.GameStatus.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.GameStatus.$constructor();
GamesByEmail.GameNotify=function()
{
   this.clear();
};
GamesByEmail.GameNotify.$parentClass=null;
GamesByEmail.GameNotify.$constructor=function(){};
GamesByEmail.GameNotify.$interfaces=new Array();
GamesByEmail.GameNotify.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.GameNotify);
GamesByEmail.GameNotify.$name="GameNotify";
GamesByEmail.GameNotify.$childClasses=new Array();
GamesByEmail.GameNotify.$container=GamesByEmail;
GamesByEmail.GameNotify.prototype={
   constructor:GamesByEmail.GameNotify,
   clear:function()
   {
      this.set(0);
   },
   set:function(value)
   {
      this.play=((value&1)>0);
      this.turn=((value&2)>0);
      this.elimination=((value&4)>0);
      this.winner=((value&8)>0);
      this.drawOffered=((value&16)>0);
      this.drawDeclined=((value&32)>0);
      this.drawAccepted=((value&64)>0);
      this.ended=((value&128)>0);
    //this.switch=((value&GamesByEmail.GameNotify.SWITCH)>0);
      this.resigned=((value&512)>0);
      this.draw=((value&1024)>0);
   },
   jsSerialize:function(stringBuilder)
   {
      var value=0;
      if (this.play) value|=1;
      if (this.turn) value|=2;
      if (this.elimination) value|=4;
      if (this.winner) value|=8;
      if (this.drawOffered) value|=16;
      if (this.drawDeclined) value|=32;
      if (this.drawAccepted) value|=64;
      if (this.ended) value|=128;
    //if (this.switch) value|=GamesByEmail.GameNotify.SWITCH;
      if (this.resigned) value|=512;
      if (this.draw) value|=1024;
      stringBuilder.append(value);
   },
   dispose:function()
   {
   }
};
GamesByEmail.GameNotify.PLAY=0x001;
GamesByEmail.GameNotify.TURN=0x002;
GamesByEmail.GameNotify.ELIMINATION=0x004;
GamesByEmail.GameNotify.WINNER=0x008;
GamesByEmail.GameNotify.DRAW_OFFERED=0x010;
GamesByEmail.GameNotify.DRAW_DECLINED=0x020;
GamesByEmail.GameNotify.DRAW_ACCEPTED=0x040;
GamesByEmail.GameNotify.ENDED=0x080;
//SWITCH       :0x100,
GamesByEmail.GameNotify.RESIGNED=0x200;
GamesByEmail.GameNotify.DRAW=0x400
;
GamesByEmail.GameNotify.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.GameNotify.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.GameNotify.$constructor();
GamesByEmail.LogSettings=function()
{
   this.format=0;
   this.placement=0;
   this.processing=0;
   this.color=1;
   this.numberVAlign="top";
};
GamesByEmail.LogSettings.$parentClass=null;
GamesByEmail.LogSettings.$constructor=function(){};
GamesByEmail.LogSettings.$interfaces=new Array();
GamesByEmail.LogSettings.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.LogSettings);
GamesByEmail.LogSettings.$name="LogSettings";
GamesByEmail.LogSettings.$childClasses=new Array();
GamesByEmail.LogSettings.$container=GamesByEmail;
GamesByEmail.LogSettings.prototype={
   constructor:GamesByEmail.LogSettings
};
GamesByEmail.LogSettings.FORMAT={ROW_BY_ROUND:0,
           ROW_BY_TURN:1,
           ROW_BY_MOVE:2,
           FREE_FORM:3
   };
GamesByEmail.LogSettings.PROCESSING={WHEN_RECEIVED:0,
               ON_TIMER:1
   };
GamesByEmail.LogSettings.COLOR={NONE:0,
          BY_TEAM:1
   };
GamesByEmail.LogSettings.NUMBER_VALIGN={TOP:"top",
                  MIDDLE:"middle",
                  BOTTOM:"bottom"
   };
GamesByEmail.LogSettings.PLACEMENT={RIGHT:0,
              BOTTOM:1,
              BOTTOM_WITH_CONTROLS:2,
              HALF_BOTTOM_WITH_CONTROLS:3
   }
;
GamesByEmail.LogSettings.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.LogSettings.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.LogSettings.$constructor();
GamesByEmail.Teams=function(){var $_=null;if(this.constructor==arguments.callee){$_=new Array;$_.constructor=arguments.callee;for(var i in arguments.callee.prototype)$_[i]=arguments.callee.prototype[i];}(function(game,team)
{
   this.game=game;
   this.team=team;
}).apply($_!=null?$_:this,arguments);if($_!=null)return $_;};
GamesByEmail.Teams.$parentClass=Array;
if (!Array.$childClasses) Array.$childClasses=new Array();
Array.$childClasses.push(GamesByEmail.Teams);
GamesByEmail.Teams.$constructor=function(){};
GamesByEmail.Teams.$interfaces=new Array();
GamesByEmail.Teams.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Teams);
GamesByEmail.Teams.$name="Teams";
GamesByEmail.Teams.$childClasses=new Array();
GamesByEmail.Teams.$container=GamesByEmail;
GamesByEmail.Teams.prototype={
   constructor:GamesByEmail.Teams,
   add:function()
   {
      var team=new GamesByEmail.Team(this.length,this.game,this.team);
      this[this.length]=team;
      return team;
   },
   importData:function(teamsData)
   {
      if (typeof(teamsData)=="undefined" || teamsData==null) return;
      while (this.length<teamsData.length)
         this.add();
      if (this.length>teamsData.length)
         this.length=teamsData.length;
      for (var i=0;i<teamsData.length;i++)
         this[i].importData(teamsData[i]);
   },
   importLog:function(teamsData,index)
   {
      for (var i=0;i<teamsData.length;i++)
         this[i].importLog(teamsData[i],index);
   },
   setEnded:function(winningTeam)
   {
      for (var i=0;i<this.length;i++)
         this[i].setEnded(winningTeam);
   },
   clearNotifications:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].clearNotifications();
   },
   clearTurns:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].clearTurns();
   },
   numPlaying:function()
   {
      var num=0;
      for (var i=0;i<this.length;i++)
         num+=this[i].numPlaying();
      return num;
   },
   getTurnTeam:function()
   {
      var team=null;
      for (var i=0;i<this.length && team==null;i++)
         team=this[i].getTurnTeam();
      return team;
   },
   findTeamByIndex:function(index)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].index==index)
            return this[i];
      return null;
   },
   findTeamByColor:function(color)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].color==color)
            return this[i];
      return null;
   },
   findPlayer:function(id)
   {
      var player=null;
      for (var i=0;i<this.length && player==null;i++)
         player=this[i].findPlayer(id);
      return player;
   },
   addPlayersByChatIds:function(list,chatIds)
   {
      for (var i=0;i<this.length;i++)
         this[i].addPlayersByChatIds(list,chatIds);
      return list;
   },
   findNextPlayer:function(playerHolder)
   {
      var player=null;
      for (var i=0;i<this.length && player==null;i++)
         player=this[i].findNextPlayer(playerHolder);
      return player;
   },
   findWinningTeam:function()
   {
      var team=null;
      for (var i=0;i<this.length;i++)
         if (team=this[i].findWinningTeam())
            return team;
      return null;
   },
   forEach:function(gameMethodName)
   {
      for (var i=0;i<this.length;i++)
      {
         var team=this[i];
         var v=team.game[gameMethodName](team);
         if (v)
            return v;
         team.teams.forEach(gameMethodName);
      }
   },
   blurt:function(prefix)
   {
      for (var i=0;i<this.length;i++)
         this[i].blurt(prefix+"["+i+"].");
   },
   dispose:function()
   {
      if (Array.prototype.dispose) Array.prototype.dispose.call(this);
   },
   indexOf:Array.prototype.indexOf
};
GamesByEmail.Teams.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Teams.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Teams.$constructor();
GamesByEmail.Team=function(index,game,team)
{
   this.id=0;
   this.isUs=false;
   this._index=index;
   this.index=index;
   this.game=game;
   this.team=team;
   this.status=new GamesByEmail.TeamStatus();
   this.title="";
   this.message="";
   this.info=new GamesByEmail.Info();
   this.teams=new GamesByEmail.Teams(this.game,this);
   this.players=new GamesByEmail.Players(this.game,this);
   this.notify=new GamesByEmail.TeamNotify();
   this.color=-1;
};
GamesByEmail.Team.$parentClass=null;
GamesByEmail.Team.$constructor=function(){};
GamesByEmail.Team.$interfaces=new Array();
GamesByEmail.Team.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Team);
GamesByEmail.Team.$name="Team";
GamesByEmail.Team.$childClasses=new Array();
GamesByEmail.Team.$container=GamesByEmail;
GamesByEmail.Team.prototype={
   constructor:GamesByEmail.Team,
   hasSecure:function(infoData)
   {
      for (var i in infoData)
         if (i.length>6 && i.substr(0,7)=="secure_")
            return true;
      return false;
   },
   importData:function(teamData)
   {
      this.id=teamData.id;
      this.isUs=(this.id!=0);
      this.index=teamData.index;
      this.message=teamData.message;
      this.status.importData(teamData.status);
      //this.game.debug("GamesByEmail.Info\nindex:"+this.index+"\nid:"+this.id+"\nisUs:"+this.isUs+"\nhasSecure:"+this.hasSecure(teamData.info));
      this.info.importData(teamData.info,this.isUs);
      this.teams.importData(teamData.teams);
      this.players.importData(teamData.players);
   },
   importLog:function(teamData,index)
   {
      this.status.importData(teamData.status[index]);
      this.info.importData(teamData.infos[index],this.isUs);
      this.teams.importLog(teamData.teams,index);
   },
   clearNotifications:function()
   {
      this.notify.clear();
      this.teams.clearNotifications();
   },
   clearTurns:function()
   {
      this.status.myTurn=false;
      this.teams.clearTurns();
   },
   setEnded:function(winningTeam)
   {
      this.status.myTurn=false;
      this.status.inPlay=false;
      if (winningTeam)
         if (winningTeam==this)
         {
            this.status.won=true;
            this.notify.won=true;
         }
         else
            this.notify.lost=true;
      this.teams.setEnded(winningTeam);
   },
   numPlaying:function()
   {
      return (this.isPlaying() ? 1 : 0)+this.teams.numPlaying();
   },
   equals:function()
   {
      return (this.index==team.index);
   },
   jsSerialize:function(stringBuilder)
   {
      var comma=false;
      stringBuilder.append("{");
      comma=Foundation.jsSerializeProperty(stringBuilder,"status",this.status,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"info",this.info,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"message",this.message,comma);
      if (this.teams!=null)
         comma=Foundation.jsSerializeProperty(stringBuilder,"teams",this.teams,comma);
      if (this.game.status.uninitialized)
         comma=Foundation.jsSerializeProperty(stringBuilder,"players",this.players,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"index",this.index,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"notify",this.notify,comma);
      return stringBuilder.append("}");
   },
   getParent:function()
   {
      return (this.team==null ? this.game : this.team);
   },
   isPlaying:function()
   {
      return (this.status.inPlay && !this.status.won && !this.status.drew && !this.status.resigned && !this.status.nonPlaying);
   },
   getTurnTeam:function()
   {
      return (this.status.myTurn ? this : this.teams.getTurnTeam());
   },
   setExclusiveTurn:function()
   {
      this.game.clearTurns();
      this.game.clearNotifications();
      this.status.myTurn=true;
      if (this.players.length==0 || this.players[0].id==0)
         this.notify.turn=true;
   },
   nextTeam:function(playing)
   {
      if (typeof(playing)=="undefined") playing=false;
      var team=null;
      var parent=this.getParent();
      for (var i=this.index+1;team==null && i<parent.teams.length;i++)
      {
         team=parent.teams.findTeamByIndex(i);
         if (playing && !team.isPlaying())
            team=null;
      }
      for (var i=0;team==null && i<this.index;i++)
      {
         team=parent.teams.findTeamByIndex(i);
         if (playing && !team.isPlaying())
            team=null;
      }
      if (team==null && (!playing || this.isPlaying()))
         team=this;
      return team;
   },
   teamAtOffset:function(offset)
   {
      var index=this.index+offset;
      var parent=this.getParent();
      while (index<0)
         index+=parent.teams.length;
      while (index>=parent.teams.length)
         index-=parent.teams.length;
      return parent.teams.findTeamByIndex(index);
   },
   isMyTurn:function()
   {
      return this.status.myTurn;
   },
   indexString:function()
   {
      return (this.team==null ? "" : this.team.indexString()+",")+this._index;
   },
   findPlayer:function(id)
   {
      var player=this.players.findPlayer(id);
      if (player==null)
         player=this.teams.findPlayer(id);
      return player;
   },
   addPlayersByChatIds:function(list,chatIds)
   {
      this.players.addPlayersByChatIds(list,chatIds);
      this.teams.addPlayersByChatIds(list,chatIds);
      return list;
   },
   getMostProbablePlayer:function()
   {
      var holder={player:null};
      var player=null;
      while (holder.player=this.findNextPlayer(holder))
      {
         if (!holder.player.team.status.resigned)
            return holder.player;
         if (player==null)
            player=holder.player;
      }
      return player;
   },
   findNextPlayer:function(playerHolder)
   {
      for (var i=0;i<this.players.length;i++)
         if (playerHolder.player==null)
            return this.players[i];
         else
            if (this.players[i]==playerHolder.player)
               playerHolder.player=null;
      return this.teams.findNextPlayer(playerHolder);
   },
   findWinningTeam:function()
   {
      if (this.status.won)
         return this;
      return this.teams.findWinningTeam();
   },
   blurt:function(prefix)
   {
      this.status.blurt(prefix+"status.",this.game);
      this.info.blurt(prefix+"info.",this.game);
      this.teams.blurt(prefix+"teams");
   },
   dispose:function()
   {
   }
};
GamesByEmail.Team.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Team.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Team.$constructor();
GamesByEmail.TeamStatus=function()
{
   this.clear();
};
GamesByEmail.TeamStatus.$parentClass=null;
GamesByEmail.TeamStatus.$constructor=function(){};
GamesByEmail.TeamStatus.$interfaces=new Array();
GamesByEmail.TeamStatus.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.TeamStatus);
GamesByEmail.TeamStatus.$name="TeamStatus";
GamesByEmail.TeamStatus.$childClasses=new Array();
GamesByEmail.TeamStatus.$container=GamesByEmail;
GamesByEmail.TeamStatus.prototype={
   constructor:GamesByEmail.TeamStatus,
   clear:function()
   {
      this.set(0);
   },
   set:function(value)
   {
      this.myTurn=((value&1)>0);
      this.inPlay=((value&2)>0);
      this.nonPlaying=((value&4)>0);
      this.won=((value&8)>0);
      this.drew=((value&16)>0);
      this.resigned=((value&32)>0);
      this.offeringDraw=((value&64)>0);
      this.decliningDraw=((value&128)>0);
      this.acceptingDraw=((value&256)>0);
   },
   importData:function(statusData)
   {
      this.set(statusData);
   },
   jsSerialize:function(stringBuilder)
   {
      var value=0;
      if (this.myTurn) value|=1;
      if (this.inPlay) value|=2;
      if (this.nonPlaying) value|=4;
      if (this.won) value|=8;
      if (this.drew) value|=16;
      if (this.resigned) value|=32;
      if (this.offeringDraw) value|=64;
      if (this.decliningDraw) value|=128;
      if (this.acceptingDraw) value|=256;
      return stringBuilder.append(value);
   },
   blurt:function(prefix,game)
   {
      game.debug(prefix+"myTurn="+this.myTurn+";");
      if (!this.inPlay) game.debug(prefix+"inPlay=false;");
      if (this.nonPlaying) game.debug(prefix+"nonPlaying=true;");
      if (this.won) game.debug(prefix+"won=true;");
      if (this.drew) game.debug(prefix+"drew=true;");
      if (this.resigned) game.debug(prefix+"resigned=true;");
      if (this.offeringDraw) game.debug(prefix+"offeringDraw=true;");
      if (this.decliningDraw) game.debug(prefix+"decliningDraw=true;");
      if (this.acceptingDraw) game.debug(prefix+"acceptingDraw=true;");
   },
   dispose:function()
   {
   }
};
GamesByEmail.TeamStatus.MY_TURN=0x0001;
GamesByEmail.TeamStatus.IN_PLAY=0x0002;
GamesByEmail.TeamStatus.NON_PLAYING=0x0004;
GamesByEmail.TeamStatus.WON=0x0008;
GamesByEmail.TeamStatus.DREW=0x0010;
GamesByEmail.TeamStatus.RESIGNED=0x0020;
GamesByEmail.TeamStatus.OFFERING_DRAW=0x0040;
GamesByEmail.TeamStatus.DECLINING_DRAW=0x0080;
GamesByEmail.TeamStatus.ACCEPTING_DRAW=0x0100
;
GamesByEmail.TeamStatus.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.TeamStatus.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.TeamStatus.$constructor();
GamesByEmail.TeamNotify=function()
{
   this.clear();
};
GamesByEmail.TeamNotify.$parentClass=null;
GamesByEmail.TeamNotify.$constructor=function(){};
GamesByEmail.TeamNotify.$interfaces=new Array();
GamesByEmail.TeamNotify.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.TeamNotify);
GamesByEmail.TeamNotify.$name="TeamNotify";
GamesByEmail.TeamNotify.$childClasses=new Array();
GamesByEmail.TeamNotify.$container=GamesByEmail;
GamesByEmail.TeamNotify.prototype={
   constructor:GamesByEmail.TeamNotify,
   clear:function()
   {
      this.set(0);
   },
   set:function(value)
   {
      this.turn=((value&1)>0);
      this.lost=((value&2)>0);
      this.won=((value&4)>0);
      this.drawOffered=((value&8)>0);
      this.drawDeclined=((value&16)>0);
      this.drawAccepted=((value&32)>0);
    //this.switch=((value&GamesByEmail.TeamNotify.SWITCH)>0);
      this.drew=((value&128)>0);
   },
   jsSerialize:function(stringBuilder)
   {
      var value=0;
      if (this.turn) value|=1;
      if (this.lost) value|=2;
      if (this.won) value|=4;
      if (this.drawOffered) value|=8;
      if (this.drawDeclined) value|=16;
      if (this.drawAccepted) value|=32;
    //if (this.switch) value|=GamesByEmail.TeamNotify.SWITCH;
      if (this.drew) value|=128;
      return stringBuilder.append(value);
   },
   dispose:function()
   {
   }
};
GamesByEmail.TeamNotify.TURN=0x01;
GamesByEmail.TeamNotify.LOST=0x02;
GamesByEmail.TeamNotify.WON=0x04;
GamesByEmail.TeamNotify.DRAW_OFFERED=0x08;
GamesByEmail.TeamNotify.DRAW_DECLINED=0x10;
GamesByEmail.TeamNotify.DRAW_ACCEPTED=0x20;
 //SWITCH       :0x40,
GamesByEmail.TeamNotify.DREW=0x80
;
GamesByEmail.TeamNotify.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.TeamNotify.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.TeamNotify.$constructor();
GamesByEmail.Players=function(){var $_=null;if(this.constructor==arguments.callee){$_=new Array;$_.constructor=arguments.callee;for(var i in arguments.callee.prototype)$_[i]=arguments.callee.prototype[i];}(function (game,team)
{
   this.game=game;
   this.team=team;
}).apply($_!=null?$_:this,arguments);if($_!=null)return $_;};
GamesByEmail.Players.$parentClass=Array;
if (!Array.$childClasses) Array.$childClasses=new Array();
Array.$childClasses.push(GamesByEmail.Players);
GamesByEmail.Players.$constructor=function(){};
GamesByEmail.Players.$interfaces=new Array();
GamesByEmail.Players.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Players);
GamesByEmail.Players.$name="Players";
GamesByEmail.Players.$childClasses=new Array();
GamesByEmail.Players.$container=GamesByEmail;
GamesByEmail.Players.prototype={
   constructor:GamesByEmail.Players,
   add:function()
   {
      var player=new GamesByEmail.Player(this.length,this.game,this.team);
      this[this.length]=player;
      return player;
   },
   importData:function(playersData)
   {
      if (typeof(playersData)=="undefined") return;
      while (this.length<playersData.length)
         this.add();
      if (this.length>playersData.length)
         this.length=playersData.length;
      for (var i=0;i<playersData.length;i++)
         this[playersData[i].index].importData(playersData[i]);
   },
   findPlayer:function(id)
   {
      for (var i=0;i<this.length;i++)
         if (this[i].id==id)
            return this[i];
      return null;
   },
   addPlayersByChatIds:function(list,chatIds)
   {
      for (var i=0;i<this.length;i++)
         for (var j=0;j<chatIds.length;j++)
            if (this[i].chatId==chatIds[j])
               list[list.length]=this[i];
      return list;
   },
   dispose:function()
   {
      if (Array.prototype.dispose) Array.prototype.dispose.call(this);
   },
   indexOf:Array.prototype.indexOf
};
GamesByEmail.Players.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Players.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Players.$constructor();
GamesByEmail.Player=function(index,game,team)
{
   this.id=0;
   this.isUs=false;
   this.index=index;
   this.game=game;
   this.team=team;
   this.title="";
   this.message="";
   this.chatId=0;
   this.info=new GamesByEmail.Info();
};
GamesByEmail.Player.$parentClass=null;
GamesByEmail.Player.$constructor=function(){};
GamesByEmail.Player.$interfaces=new Array();
GamesByEmail.Player.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Player);
GamesByEmail.Player.$name="Player";
GamesByEmail.Player.$childClasses=new Array();
GamesByEmail.Player.$container=GamesByEmail;
GamesByEmail.Player.prototype={
   constructor:GamesByEmail.Player,
   importData:function(playerData)
   {
      this.id=playerData.id;
      this.isUs=(this.id!=0);
      this.index=playerData.index;
      this.title=playerData.title;
      this.message=playerData.message;
      this.chatId=playerData.chatId;
      this.info.importData(playerData.info,true);
   },
   jsSerialize:function(stringBuilder)
   {
      var comma=false;
      stringBuilder.append("{");
      comma=Foundation.jsSerializeProperty(stringBuilder,"id",this.id,comma);
      comma=Foundation.jsSerializeProperty(stringBuilder,"index",this.index,comma);
      return stringBuilder.append("}");
   },
   nextOpponent:function()
   {
      return this.team.nextTeam().players[0];
   },
   isMyTurn:function()
   {
      return this.team.isMyTurn();
   },
   equals:function()
   {
      return (this.team.equals(player.team) && this.index==player.index);
   },
   indexString:function()
   {
      return this.team.indexString()+","+this.index;
   },
   logTitle:function()
   {
      var title=this.title;
      for (var team=this.team;team!=null;team=team.team)
         if (team.title.length>0)
            title=team.title+" - "+title;
      return title;
   },
   dispose:function()
   {
   }
};
GamesByEmail.Player.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Player.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Player.$constructor();
GamesByEmail.Info=function ()
{
};
GamesByEmail.Info.$parentClass=null;
GamesByEmail.Info.$constructor=function(){};
GamesByEmail.Info.$interfaces=new Array();
GamesByEmail.Info.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Info);
GamesByEmail.Info.$name="Info";
GamesByEmail.Info.$childClasses=new Array();
GamesByEmail.Info.$container=GamesByEmail;
GamesByEmail.Info.prototype={
   constructor:GamesByEmail.Info,
   getValue:function(key,defaultValue)
   {
      if (typeof(this[key])=="undefined" ||
          this[key]==null)
         if (typeof(defaultValue)!="undefined")
            return defaultValue;
         else
            if (key.length>1 && key.charAt(1)=='_')
               switch (key.charAt(0))
               {
               case 'i' : return 0;
               case 'f' : return 0.0;
               case 'b' : return false;
               default : return "";
               }
            else
               return "";
      else
         if (key.length>1 && key.charAt(1)=='_' && typeof(this[key])=="string")
            switch (key.charAt(0))
            {
            case 'i' : return parseInt(this[key]);
            case 'f' : return parseFloat(this[key]);
            case 'b' : return (this[key].toLowerCase()=="true");
            default : return this[key];
            }
         else
            return this[key];
   },
   setValue:function(key,value)
   {
      if (typeof(this[key])=="undefined" ||
          this[key]==null)
         this[key]=value;
      else
         if (key.length>1 && key.charAt(1)=='_')
            switch (key.charAt(0))
            {
               case 'i' : return this[key]=(value==0 ? null : value);
               case 'f' : return this[key]=(value==0 ? null : value);
               case 'b' : return  this[key]=(value ? true : null);
               default : return this[key]=(value=="" ? null : value);
            }
         else
            return this[key]=(value=="" ? null : value);
   },
   clear:function()
   {
      for (var i in this)
         if (i!="prototype" && i!="constructor" && typeof(this[i])!="function")
            this[i]=null;
   },
   importData:function(infoData,secureToo)
   {
      secureToo=true;
      this.clear();
      for (var i in infoData)
         if (i!="prototype" && i!="constructor" && typeof(infoData[i])!="function" &&
             (secureToo || i.length<7 || i.substr(0,7)!="secure_"))
            this[i]=infoData[i];
   },
   jsSerialize:function(stringBuilder)
   {
      var comma=false;
      stringBuilder.append("{");
      for (var i in this)
         if (typeof(this[i])!='undefined' &&
             this[i]!=null &&
             typeof(this[i])!='function')
            comma=Foundation.jsSerializeProperty(stringBuilder,i,this[i],comma);
      return stringBuilder.append("}");
   },
   blurt:function(prefix,game)
   {
      for (var i in this)
         if (typeof(this[i])!='undefined' &&
             this[i]!=null &&
             typeof(this[i])!='function')
            game.debug(prefix+i+"="+Foundation.jsSerialize(this[i])+";");
   },
   dispose:function()
   {
   }
};
GamesByEmail.Info.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Info.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Info.$constructor();
GamesByEmail.Move=function (game)
{
   this.game=game;
   this.number=-1;
   this.player=null;
   this.log="";
};
GamesByEmail.Move.$parentClass=null;
GamesByEmail.Move.$constructor=function(){};
GamesByEmail.Move.$interfaces=new Array();
GamesByEmail.Move.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Move);
GamesByEmail.Move.$name="Move";
GamesByEmail.Move.$childClasses=new Array();
GamesByEmail.Move.$container=GamesByEmail;
GamesByEmail.Move.prototype={
   constructor:GamesByEmail.Move,
   importData:function(moveData)
   {
      if (moveData==null)
      {
         this.number=-1;
         this.player=null;
      }
      else
      {
         this.number=moveData.number;
         this.player=this.game.findPlayerByIndices(moveData.player);
      }
      this.log="";
   },
   importLog:function(moveData)
   {
      this.number=moveData.number;
      this.player=this.game.findPlayerByIndices(moveData.player);
      this.log=moveData.log;
      this.rawLog=moveData.rawLog;
   },
   jsSerialize:function(stringBuilder)
   {
      var comma=false;
      stringBuilder.append("{");
      comma=Foundation.jsSerializeProperty(stringBuilder,"number",this.number,comma);
      if (typeof(this.player)!="undefined" && this.player!=null)
      {
         comma=Foundation.jsSerializeProperty(stringBuilder,"playerId",this.player.id,comma);
         comma=Foundation.jsSerializeProperty(stringBuilder,"player",this.player.indexString(),comma);
      }
      comma=Foundation.jsSerializeProperty(stringBuilder,"log",this.log,comma);
      return stringBuilder.append("}");
   },
   blurt:function(prefix,game)
   {
      game.debug(prefix+"number="+Foundation.jsSerialize(this.number)+";");
      game.debug(prefix+"player="+Foundation.jsSerialize(this.player==null ? null : this.player.indexString())+";");
   },
   dispose:function()
   {
   }
};
GamesByEmail.Move.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Move.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Move.$constructor();
GamesByEmail.Hex=function(){};
GamesByEmail.Hex.$parentClass=null;
GamesByEmail.Hex.$constructor=function(){};
GamesByEmail.Hex.$interfaces=new Array();
GamesByEmail.Hex.$interfaces.push(Foundation.Interface);
if (!Foundation.Interface.$childClasses) Foundation.Interface.$childClasses=new Array();
Foundation.Interface.$childClasses.push(GamesByEmail.Hex);
GamesByEmail.Hex.$name="Hex";
GamesByEmail.Hex.$childClasses=new Array();
GamesByEmail.Hex.$container=GamesByEmail;
GamesByEmail.Hex.prototype={
   constructor:GamesByEmail.Hex,
   precedence$updateBoardCaches:function()
   {
      this.hexBoardPoints=null;
      this.boardPointFromValueIndex(0);
      if (!this.hexBoardPoints)
      {
         var p;
         this.hexBoardPoints=new Array();
         for (var i=0;p=this.boardPointFromValueIndex(i);i+=this.board.pieceDataScale)
            this.hexBoardPoints.push(p);
      }
      this.hexBoardPointIndeces=new Object();
      for (var i=0;i<this.hexBoardPoints.length;i++)
         this.hexBoardPointIndeces[this.hexBoardPoints[i].x+"_"+this.hexBoardPoints[i].y]=i*this.board.pieceDataScale;
      this.hexScreenRectList=new Array();
      this.forEachBoardPoint("addHexScreenRect");
      this.hexScreenRectList.rotation=0;
      this.rotatedHexScreenRectList=null;
   },
   getRotatedHexScreenRects:function()
   {
      if (!this.rotatedHexScreenRectList || this.rotatedHexScreenRectList.rotation!=this.rotation)
         if (this.rotation==0)
            this.rotatedHexScreenRectList=this.hexScreenRectList;
         else
         {
            var center=this.board.image.size.clone();
            center.scale(0.5);
            center.floor();
            this.rotatedHexScreenRectList=new Array();
            for (var i=0;i<this.hexScreenRectList.length;i++)
            {
               var rc=this.hexScreenRectList[i].screenRect.getCenter();
               rc.subtract(center);
               rc.rotate(this.rotation);
               rc.add(center);
               for (var j=0;j<this.hexScreenRectList.length;j++)
                  if (this.hexScreenRectList[j].screenRect.containsPoint(rc))
                  {
                     this.rotatedHexScreenRectList.push({boardPoint:this.hexScreenRectList[i].boardPoint.clone(),screenRect:this.hexScreenRectList[j].screenRect.clone()});
                     break;
                  }
            }
            this.rotatedHexScreenRectList.rotation=this.rotation;
         }
      return this.rotatedHexScreenRectList;
   },
   precedence$screenRectFromBoardXY:function(boardX,boardY)
   {
      var rectList=this.getRotatedHexScreenRects();
      for (var i=0;i<rectList.length;i++)
         if (rectList[i].boardPoint.equals(boardX,boardY))
            return rectList[i].screenRect.clone();
      return null;
   },
   precedence$boardPointFromScreenXY:function(screenX,screenY)
   {
      var rectList=this.getRotatedHexScreenRects();
      for (var i=0;i<rectList.length;i++)
         if (rectList[i].screenRect.containsXY(screenX,screenY))
            return rectList[i].boardPoint.clone();
      return null;
   },
   precedence$valueIndexFromBoardXY:function(x,y)
   {
      var index=this.hexBoardPointIndeces[x+"_"+y];
      return (typeof(index)=="number" ? index : -1);
      for (var i=0;i<this.hexBoardPoints.length;i++)
         if (this.hexBoardPoints[i].equals(x,y))
            return i*this.board.pieceDataScale;
      return -1;
   },
   precedence$boardPointFromValueIndex:function(index)
   {
      index/=this.board.pieceDataScale;
      if (!this.hexBoardPoints)
      {
         this.hexBoardPoints=new Array();
         var side0=this.board.size.side0;
         var side1=this.board.size.side1;
         var side2=this.board.size.side2;
         var side5=this.board.size.side5;
         var xLow=0;
         var xHigh=side0;
         var yHigh=side1+side2;
         for (var point=new Foundation.Point(0,0);point.y<=yHigh;point.y++)
         {
            for (point.x=xLow;point.x<=xHigh;point.x++)
               this.hexBoardPoints.push(point.clone());
            if (point.y>=side1)
               xLow++;
            if (point.y<side5)
               xHigh++;
         }
      }
      if (index<0 || index>=this.hexBoardPoints.length)
         return null;
      return this.hexBoardPoints[index];
   },
   precedence$forEachBoardPoint:function(methodName)
   {
      var method=this[methodName];
      var value;
      for (var i=0;i<this.hexBoardPoints.length;i++)
      {
         arguments[0]=this.hexBoardPoints[i];
         if (value=method.apply(this,arguments))
            return value;
      }
      return null;
   },
   precedence$numInPath:function(toPoint,fromPoint,board)
   {
      var num=0;
      var x1,y1,x2,y2;
      x1=fromPoint.x;
      y1=fromPoint.y;
      x2=toPoint.x;
      y2=toPoint.y;
      var dx=x2-x1;
      var dy=y2-y1;
      if (Math.abs(dx)==2*Math.abs(dy))
      {
         if (dx<0) dx=-2;
         if (dx>0) dx=2;
         if (dy<0) dy=-1;
         if (dy>0) dy=1;
      }
      else
         if (2*Math.abs(dx)==Math.abs(dy))
         {
            if (dx<0) dx=-1;
            if (dx>0) dx=1;
            if (dy<0) dy=-2;
            if (dy>0) dy=2;
         }
         else
         {
            if (dx<0) dx=-1;
            if (dx>0) dx=1;
            if (dy<0) dy=-1;
            if (dy>0) dy=1;
         }
      var p=new Foundation.Point();
      for (p.x=x1+dx,p.y=y1+dy;p.x!=x2 || p.y!=y2;p.x+=dx,p.y+=dy)
         if (this.valueFromPointBoard(p,board)!=this.board.clearPointValue)
            num++;
      return num;
   },
   addHexScreenRect:function(boardPoint)
   {
      this.hexScreenRectList.push({boardPoint:boardPoint.clone(),screenRect:this.board.size.getHexScreenRect(boardPoint,this.board.squareSize,this.board.border)});
   },
   dispose:function()
   {
   }
};
GamesByEmail.Hex.$setSides=function(hex,args)
   {
      hex.side0=args[0]-1;
      if (args.length==1)
         hex.side3=hex.side2=hex.side1=hex.side0;
      else
      {
         hex.side1=args[1]-1;
         if (args.length==2)
         {
            hex.side2=hex.side0;
            hex.side3=hex.side1;
         }
         else
         {
            hex.side2=args[2]-1;
            if (args.length==3)
               hex.side3=hex.side0;
            else
            {
               hex.side3=args[3]-1;
               if (hex.side3<hex.side0-hex.side2+1)
                  hex.side3=hex.side0-hex.side2+1;
               else if (hex.side3>hex.side0+hex.side1)
                  hex.side3=hex.side0+hex.side1;
            }
         }
      }
      hex.side4=hex.side1+hex.side0-hex.side3;
      hex.side5=hex.side2+hex.side3-hex.side0;
   };
GamesByEmail.Hex.getTypePath=Foundation.Interface.getTypePath;
GamesByEmail.Hex.$constructor();
GamesByEmail.HexV=function(side0,side1,side2,side3)
{
   GamesByEmail.Hex.$setSides(this,arguments);
};
GamesByEmail.HexV.$parentClass=null;
GamesByEmail.HexV.$constructor=function(){};
GamesByEmail.HexV.$interfaces=new Array();
GamesByEmail.HexV.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.HexV);
GamesByEmail.HexV.$name="HexV";
GamesByEmail.HexV.$childClasses=new Array();
GamesByEmail.HexV.$container=GamesByEmail;
GamesByEmail.HexV.prototype={
   constructor:GamesByEmail.HexV,
   getHexScreenRect:function(boardPoint,squareSize,border)
   {
      var screenRect=new Foundation.Rectangle(0,0,squareSize.x+1,squareSize.y+1);
      screenRect.add(squareSize.x*boardPoint.x,squareSize.y*((this.side1+(this.side2+boardPoint.x)/2)-boardPoint.y));
      screenRect.add(border);
      return screenRect;
   },
   dispose:function()
   {
   }
};
GamesByEmail.HexV.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.HexV.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.HexV.$constructor();
GamesByEmail.HexH=function(side0,side1,side2,side3)
{
   GamesByEmail.Hex.$setSides(this,arguments);
};
GamesByEmail.HexH.$parentClass=null;
GamesByEmail.HexH.$constructor=function(){};
GamesByEmail.HexH.$interfaces=new Array();
GamesByEmail.HexH.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.HexH);
GamesByEmail.HexH.$name="HexH";
GamesByEmail.HexH.$childClasses=new Array();
GamesByEmail.HexH.$container=GamesByEmail;
GamesByEmail.HexH.prototype={
   constructor:GamesByEmail.HexH,
   getHexScreenRect:function(boardPoint,squareSize,border)
   {
      var yHigh=this.side1+this.side2;
      var screenRect=new Foundation.Rectangle(0,0,squareSize.x+1,squareSize.y+1);
      screenRect.add(squareSize.x*(boardPoint.x-(this.side2-(yHigh-boardPoint.y))/2),squareSize.y*(yHigh-boardPoint.y));
      screenRect.add(border);
      return screenRect;
   },
   dispose:function()
   {
   }
};
GamesByEmail.HexH.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.HexH.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.HexH.$constructor();
GamesByEmail.Territories=function(){var $_=null;if(this.constructor==arguments.callee){$_=new Array;$_.constructor=arguments.callee;for(var i in arguments.callee.prototype)$_[i]=arguments.callee.prototype[i];}(function(game,territoryClass,territories)
{
   this.game=game;
   var indexStringLength=territories.length-1;
   indexStringLength=indexStringLength.toString().length;
   var indexString;
   for (var i=0;i<territories.length;i++)
   {
      indexString=i.toString();
      while (indexString.length<indexStringLength)
         indexString="0"+indexString;
      this[i]=new territoryClass(this,i,indexString,this.game,territories[i]);
   }
   for (var i=0;i<this.length;i++)
      this[i].setAdjacent();
   this.clearMouseEvents();
}).apply($_!=null?$_:this,arguments);if($_!=null)return $_;};
GamesByEmail.Territories.$parentClass=Array;
if (!Array.$childClasses) Array.$childClasses=new Array();
Array.$childClasses.push(GamesByEmail.Territories);
GamesByEmail.Territories.$constructor=function(){};
GamesByEmail.Territories.$interfaces=new Array();
GamesByEmail.Territories.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Territories);
GamesByEmail.Territories.$name="Territories";
GamesByEmail.Territories.$childClasses=new Array();
GamesByEmail.Territories.$container=GamesByEmail;
GamesByEmail.Territories.prototype={
   constructor:GamesByEmail.Territories,
   findAtPoint:function(point,checkThisIndexFirst)
   {
      if (arguments.length<2)
         checkThisIndexFirst=-1;
      if (checkThisIndexFirst>=0 &&
          this[checkThisIndexFirst].containsPoint(point))
         return this[checkThisIndexFirst];
      for (var i=0;i<this.length;i++)
         if (i!=checkThisIndexFirst && this[i].containsPoint(point))
            return this[i];
      return null;
   },
   hideHilites:function()
   {
      for (var i=0;i<this.length;i++)
         this[i].hideHilite();
   },
   mouseEvent:function(eventType,altEventType,point,event)
   {
      var t=null;
      var f=this[eventType];
      var a=this[altEventType];
      if ((eventType=="onMouseDown" || eventType=="onMouseUp") &&
           (f!=null || a!=null) &&
           (t=this.findAtPoint(point,this._lastMouseIndex)))
      {
         if (f)
            t[f](point,event);
         if (a)
            t[a](point,event)
         return;
      }
      if (eventType=="onMouseOut" && this._lastMouseIndex>=0)
      {
         t=this[this._lastMouseIndex];
         this._lastMouseIndex=-1;
         if (f)
            return t[f](point.event);
      }
      if (eventType=="onMouseOver" && f && (t=this.findAtPoint(point,this._lastMouseIndex)) && t.index!=this._lastMouseIndex)
      {
         this._lastMouseIndex=t.index;
         return t[f](point.event);
      }
      if (eventType=="onMouseMove" && (this.onMouseOver || this.onMouseMove || this.onMouseOut))
      {
         if (t==null)
            t=this.findAtPoint(point,this._lastMouseIndex);
         if (this.onMouseOut && this._lastMouseIndex>=0 && (!t || t.index!=this._lastMouseIndex))
             this[this._lastMouseIndex][this.onMouseOut](point.event);
         if (this.onMouseOver && t && t.index!=this._lastMouseIndex)
             t[this.onMouseOver](point.event);
         this._lastMouseIndex=(t ? t.index : -1);
         if (t && f)
            return t[f](point.event);
      }
   },
   clearMouseEvents:function()
   {
      this.onMouseDown=null;
      this.onMouseUp=null;
      this.onLeftMouseDown=null;
      this.onLeftMouseUp=null;
      this.onRightMouseDown=null;
      this.onRightMouseUp=null;
      this.onMiddleMouseDown=null;
      this.onMiddleMouseUp=null;
      this.onMouseOver=null;
      this.onMouseMove=null;
      this.onMouseOut=null;
      this._lastMouseIndex=-1;
   },
   appendOverlayHtml:function(htmlBuilder)
   {
      return htmlBuilder;
   },
   appendHtml:function(htmlBuilder,imageSize)
   {
      htmlBuilder.append("<div id=\""+this.game.elementId("territories")+"\" style=\"position:absolute;width:"+imageSize.x+"; height:"+imageSize.y+";overflow:hidden\">");
      for (var i=0;i<this.length;i++)
         this[i].appendHtml(htmlBuilder);
      this.appendOverlayHtml(htmlBuilder);
      htmlBuilder.append("</div>");
      return htmlBuilder;
   },
   updateBoardImageSize:function(imageSize)
   {
      var e;
      if (e=this.game.getElement("territories"))
      {
         e.style.width=imageSize.x;
         e.style.height=imageSize.y;
      }
   },
   setBlink:function(tIndex,show)
   {
      var t=this[tIndex];
      if (show)
      {
         if (!this.blinkHandle)
         {
            this.blinkOn=true;
            this.blinkList=new Array();
            this.blinkHandle=window.setInterval(this.game.event("territories.blinkEvent()"),500);
         }
         for (var i=0;i<this.blinkList.length;i++)
            if (this.blinkList[i]==tIndex)
               return;
         this.blinkList[this.blinkList.length]=tIndex;
         if (this.blinkValue%2==0)
            t.setHilite(t.blinkOn=true);
      }
      else
      {
         if (t.blinkOn && !t.hiliteOn)
            t.setHilite(false);
         t.blinkOn=false;
         if (this.blinkList)
         {
            for (var i=0;i<this.blinkList.length;i++)
               if (this.blinkList[i]==tIndex)
               {
                  for (i++;i<this.blinkList.length;i++)
                     this.blinkList[i-1]=this.blinkList[i];
                  this.blinkList.length--;
                  break;
               }
            if (this.blinkList.length==0 && this.blinkHandle)
            {
               window.clearInterval(this.blinkHandle);
               this.blinkHandle=null;
            }
         }
      }
   },
   blinkEvent:function()
   {
      for (var i=0;i<this.blinkList.length;i++)
      {
         var t=this[this.blinkList[i]];
         if (this.blinkOn)
            t.setHilite(t.blinkOn=true);
         else
         {
            if (!t.hiliteOn)
               t.setHilite(false);
            t.blinkOn=false;
         }
      }
      this.blinkOn=!this.blinkOn;
   },
   clearBlink:function()
   {
      this.blinkOn=false;
      if (this.blinkHandle)
      {
         window.clearInterval(this.blinkHandle);
         this.blinkHandle=null;
      }
      if (this.blinkList)
      {
         for (var i=0;i<this.blinkList.length;i++)
         {
            var t=this[this.blinkList[i]];
            if (!t.hiliteOn)
               t.setHilite(false);
            t.blinkOn=false;
         }
         this.blinkList=null;
      }
   },
   dispose:function()
   {
      if (Array.prototype.dispose) Array.prototype.dispose.call(this);
   },
   indexOf:Array.prototype.indexOf
};
GamesByEmail.Territories.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Territories.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Territories.$constructor();
GamesByEmail.Territory=function(territories,index,indexString,game,territory)
{
   this.territories=territories;
   this.index=index;
   this.indexString=indexString;
   this.game=game;
   this.adjacent=new Array();
   this.color=-1;
   this.hiliteOn=false;
   this.blinkOn=false;
   for (var i in territory)
      this[i]=territory[i];
};
GamesByEmail.Territory.$parentClass=null;
GamesByEmail.Territory.$constructor=function(){};
GamesByEmail.Territory.$interfaces=new Array();
GamesByEmail.Territory.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(GamesByEmail.Territory);
GamesByEmail.Territory.$name="Territory";
GamesByEmail.Territory.$childClasses=new Array();
GamesByEmail.Territory.$container=GamesByEmail;
GamesByEmail.Territory.prototype={
   constructor:GamesByEmail.Territory,
   setAdjacent:function()
   {
      for (var i=0;i<this.adjacentIndices.length;i++)
         this.adjacent[i]=this.territories[Math.floor(this.adjacentIndices[i])];
   },
   containsPoint:function(point)
   {
      return this.polygon.containsPoint(point);
   },
   getHiliteImage:function()
   {
      return this.game.getElement("territoryHilite_"+this.index);
   },
   setHilite:function(show)
   {
      var e=this.getHiliteImage();
      if (e)
         e.style.visibility=(show ? "visible" : "hidden");
      return true;
   },
   setBlink:function(show)
   {
      this.territories.setBlink(this.index,show);
   },
   hideHilite:function()
   {
      this.hiliteOn=false;
      if (!this.blinkOn)
         return this.setHilite(false);
   },
   showHilite:function()
   {
      this.hiliteOn=true;
      return this.setHilite(true);
   },
   showHiliteIfOurs:function()
   {
      if (this.isOurs())
         return this.showHilite();
      return false;
   },
   appendOverlayHtml:function(htmlBuilder)
   {
      return htmlBuilder;
   },
   getHiliteImageSrc:function()
   {
      return this.game.getImageSrc(this.game.resource("territoryHiliteImage",'i',this.indexString));
   },
   isColor:function(color)
   {
      return this.color==color;
   },
   isOurs:function()
   {
      return this.isColor(this.game.player.team.color);
   },
   appendHtml:function(htmlBuilder)
   {
      var hiliteOffset=(this.hiliteOffset ? this.hiliteOffset : new Foundation.Point(0,0));
      htmlBuilder.append("<img id=\""+this.game.elementId("territoryHilite_"+this.index)+"\" border=0 src=\""+this.getHiliteImageSrc()+"\" style=\"position:absolute; left:"+hiliteOffset.x+"; top:"+hiliteOffset.y+"; display:block; visibility:hidden;z-index:200\" galleryimg=false>");
      this.appendOverlayHtml(htmlBuilder);
      return htmlBuilder;
   },
   event:function(code,delayed)
   {
      return this.game.event("territories["+this.index+"]"+(code ? "."+code : ""),delayed);
   },
   dispose:function()
   {
   }
};
GamesByEmail.Territory.getTypePath=Foundation.Class.getTypePath;
GamesByEmail.Territory.isInstanceOf=Foundation.Class.isInstanceOf;
GamesByEmail.Territory.$constructor();

