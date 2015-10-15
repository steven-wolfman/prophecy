/*
Foundation.Controls.Clipper
Copyright © 2005-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Controls.Clipper.htm
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
Foundation.establishNamespace("Foundation.Controls");
Foundation.Controls.Clipper=function()
   {
   Foundation.Controls.Control.apply(this,arguments);
      this.backgroundColor="#ff8040";
      this.imageWidth=1;
      this.imageHeight=1;
      this.imageBorder=this.resource("imageBorder");
      this.rulerSize=this.resource("rulerSize");
      this.top=this.resource("top");
      this.left=this.resource("left");
      this.width=this.resource("width");
      this.height=this.resource("height");
      this.zoom=this.resource("zoom");
      this.moving=null;
      this.onChange=null;
      this.onResize=null;
   };
Foundation.Controls.Clipper.$parentClass=Foundation.Controls.Control;
if (!Foundation.Controls.Control.$childClasses) Foundation.Controls.Control.$childClasses=new Array();
Foundation.Controls.Control.$childClasses.push(Foundation.Controls.Clipper);
Foundation.Controls.Clipper.$constructor=Foundation.Controls.Control.$constructor ? Foundation.Controls.Control.$constructor : function(){};
Foundation.Controls.Clipper.$interfaces=new Array();
Foundation.Controls.Clipper.$name="Clipper";
Foundation.Controls.Clipper.$childClasses=new Array();
Foundation.Controls.Clipper.$container=Foundation.Controls;
Foundation.Controls.Clipper.prototype={
   constructor:Foundation.Controls.Clipper,
   bindToElement:function(element,event)
   {
      this.attachEvent(this.getElement("image"),"ondraggesture","onDragGesture(event)");
      return Foundation.Controls.Control.prototype.bindToElement.call(this,element,event);
   },
   onDragGesture:function(event)
   {
      if (event.stopPropigation)
         event.stopPropigation();
      if (event.preventDefault)
         event.preventDefault();
      return false;
   },
   getMasterContainer:function()
   {
      return this.getElement("masterContainer");
   },
   setValue:function(value)
   {
      Foundation.Controls.Control.prototype.setValue.call(this,value,true);
      this.top=0;
      this.left=0;
      this.width=0;
      this.height=0;
      this.imageWidth=1;
      this.imageHeight=1;
      var e;
      if (e=this.getElement("image"))
      {
         e.src=this.value;
         e.style.border=this.imageBorder;
         e.style.backgroundColor=this.backgroundColor;
      }
   },
   imageOnload:function(e)
   {
      var width=e.offsetWidth-2*this.imageBorder;
      var height=e.offsetHeight-2*this.imageBorder;
      if (this.width==this.imageWidth)
         this.width=width;
      this.imageWidth=width;
      if (this.height==this.imageHeight)
         this.height=height;
      this.imageHeight=height;
      if (this.zoom>1)
         e.width=this.imageWidth*this.zoom;
      this.updateRules(true);
      if (this.onResize)
         this.onResize(this);
   },
   changeZoomBy:function(delta)
   {
      this.setZoom(this.zoom+delta);
   },
   setZoom:function(zoom)
   {
      this.zoom=zoom;
      if (this.zoom<1)
         this.zoom=1;
      if (e=this.getElement("image"))
         e.width=this.imageWidth*this.zoom;
      this.updateRules(true);
      if (this.onResize)
         this.onResize(this);
   },
   setRectangle:function(left,top,width,height)
   {
      if (left<0)
         left=0;
      if (top<0)
         top=0;
      if (width<0 || width>=this.imageWidth)
         width=this.imageWidth;
      if (height<0 || height>=this.imageHeight)
         height=this.imageHeight;
      this.top=top;
      this.left=left;
      this.width=width;
      this.height=height;
      this.updateRules();
   },
   setFullRectangle:function()
   {
      this.setRectangle(0,0,-1,-1);
   },
   updateRules:function(updateGrid)
   {
      var e;
      var ffSucks=(document.all ? 0 : -1);
      if (e=this.getElement("topRuler"))
      {
         e.style.top=ffSucks+(this.top*this.zoom)+this.imageBorder-this.rulerSize;
         e.style.left=ffSucks-this.rulerSize;
         e.style.width=((this.imageWidth+1)*this.zoom)+this.rulerSize*2;
         e.style.height=this.rulerSize;
      }
      if (e=this.getElement("leftRuler"))
      {
         e.style.top=ffSucks-this.rulerSize;
         e.style.left=ffSucks+(this.left*this.zoom)+this.imageBorder-this.rulerSize;
         e.style.width=this.rulerSize;
         e.style.height=((this.imageHeight+1)*this.zoom)+this.rulerSize*2;
      }
      if (e=this.getElement("rightRuler"))
      {
         e.style.top=-this.rulerSize;
         e.style.left=((this.left+this.width)*this.zoom)+this.imageBorder;
         e.style.width=this.rulerSize;
         e.style.height=((this.imageHeight+1)*this.zoom)+this.rulerSize*2;
      }
      if (e=this.getElement("bottomRuler"))
      {
         e.style.top=((this.top+this.height)*this.zoom)+this.imageBorder;
         e.style.left=-this.rulerSize;
         e.style.width=((this.imageWidth+1)*this.zoom)+this.rulerSize*2;
         e.style.height=this.rulerSize;
      }
      if (updateGrid && (e=this.getElement("grid")))
         if (true || this.zoom<4)
         {
            e.style.visibility="hidden";
            e.innerHTML="";
         }
         else
         {
            var cell="<td style=\"border-left:1px solid #888888;border-top:1px solid #888888;width:"+(this.zoom-1)+";height:"+(this.zoom-1)+";z-index:1000\">&nbsp;</td>";

            var table=new Foundation.StringBuilder();
            table.append("<tr>");
            for (var i=0;i<this.imageWidth;i++)
               table.append(cell);
            table.append("</tr>");

            var row=table.toString();
            table.clear();
            table.append("<table cellspacing=0 cellpadding=0 border=0 style=\"font:1px arial;width:"+(this.imageWidth*this.zoom)+";height:"+(this.imageHeight*this.zoom)+"\">");
            for (var i=0;i<this.imageHeight;i++)
               table.append(row);
            table.append("</table>");
            e.innerHTML=table.toString();
            e.style.visibility="visible";
         }
      if (e=this.getElement("origin"))
         e.innerHTML=this.left+","+this.top;
      if (e=this.getElement("size"))
         e.innerHTML=this.width+","+this.height;
      if (e=this.getElement("corner"))
         e.innerHTML=(this.left+this.width)+","+(this.top+this.height);
      if (this.onChange)
         this.onChange(this);
   },
   onDoubleClick:function(event)
   {
//      debug();
      var x=typeof(event.offsetX)=="number" ? event.offsetX : event.layerX;
      var y=typeof(event.offsetY)=="number" ? event.offsetY : event.layerY;
      var e=event.srcElement||event.target;
      if (!document.all)
      {
         x-=e.clientLeft;
         y-=e.clientTop;
      }
//      debug("raw: e:"+e.id+" - "+x+","+y);
//      debug("raw: "+e.id+":"+e.offsetLeft+","+e.offsetTop+":"+e.clientLeft+","+e.clientTop);
      var eo=Foundation.getElementOffset(e);
//      debug("eo: "+eo.x+","+eo.y);
      var io=Foundation.getElementOffset(this.getElement("image"));
//      debug("io: "+io.x+","+io.y);
      x+=eo.x-io.x;
      y+=eo.y-io.y;
//      debug("cooked: "+x+","+y);
      x/=this.zoom;
      y/=this.zoom;
      this.left=Math.min(this.imageWidth-this.width,Math.max(0,Math.floor(x-this.width/2)));
      this.top=Math.min(this.imageHeight-this.height,Math.max(0,Math.floor(y-this.height/2)));
      this.right=this.left+this.width-1;      
      this.bottom=this.top+this.height-1;
      this.updateRules();
   },
   onMouseDown:function(event)
   {
      var e=event.srcElement ? event.srcElement : event.target;
      this.movingId=null;
      if (e.id)
      {
         var id=this.parseElementId(e.id);
         if (id=="topRuler" ||
             id=="leftRuler" ||
             id=="rightRuler" ||
             id=="bottomRuler" ||
             id=="image")
         {
            this.moving={id:id,x:event.screenX,y:event.screenY,top:this.top,left:this.left,width:this.width,height:this.height};
            e=this.getElement('clipper');
            if (e.setCapture)
               e.setCapture();
         }
      }
      e=this.getElement("clipper");
   },
   onMouseMove:function(event)
   {
      if (this.moving)
      {
         var moved=false;
         if (this.moving.id=="topRuler")
         {
            var o=this.top;
            var offset=Math.floor((event.screenY-this.moving.y)/this.zoom);
            if (offset>this.moving.height)
               offset=this.moving.height;
            if (this.moving.top+offset<0)
               offset=-this.moving.top;
            this.top=this.moving.top+offset;
            this.height=this.moving.height-offset;
            moved=this.top!=o;
         }
         else if (this.moving.id=="leftRuler")
         {
            var o=this.left;
            var offset=Math.floor((event.screenX-this.moving.x)/this.zoom);
            if (offset>this.moving.width)
               offset=this.moving.width;
            if (this.moving.left+offset<0)
               offset=-this.moving.left;
            this.left=this.moving.left+offset;
            this.width=this.moving.width-offset;
            moved=this.left!=o;
         }
         else if (this.moving.id=="rightRuler")
         {
            var o=this.width;
            var offset=Math.floor((event.screenX-this.moving.x)/this.zoom);
            if (offset<-this.moving.width)
               offset=-this.moving.width;
            if (this.moving.left+this.moving.width+offset>this.imageWidth)
               offset=this.imageWidth-this.moving.left-this.moving.width;
            this.width=this.moving.width+offset;
            moved=this.width!=o;
         }
         else if (this.moving.id=="bottomRuler")
         {
            var o=this.height;
            var offset=Math.floor((event.screenY-this.moving.y)/this.zoom);
            if (offset<-this.moving.height)
               offset=-this.moving.height;
            if (this.moving.top+this.moving.height+offset>this.imageHeight)
               offset=this.imageHeight-this.moving.top-this.moving.height;
            this.height=this.moving.height+offset;
            moved=this.height!=o;
         }
         else if (this.moving.id=="image")
         {
            var o=this.top;
            var offset=Math.floor((event.screenY-this.moving.y)/this.zoom);
            if (this.moving.top+offset<0)
               offset=-this.moving.top;
            if (this.moving.top+this.moving.height+offset>this.imageHeight)
               offset=this.imageHeight-this.moving.top-this.moving.height;
            this.top=this.moving.top+offset;
            moved=this.top!=o;
            o=this.left;
            offset=Math.floor((event.screenX-this.moving.x)/this.zoom);
            if (this.moving.left+offset<0)
               offset=-this.moving.left;
            if (this.moving.left+this.moving.width+offset>this.imageWidth)
               offset=this.imageWidth-this.moving.left-this.moving.width;
            this.left=this.moving.left+offset;
            moved=(moved || this.left!=o);
         }
         if (moved)
            this.updateRules();
      }
   },
   onMouseUp:function(event)
   {
      if (this.moving)
      {
         var e=this.getElement('clipper');
         if (e.releaseCapture)
            e.releaseCapture();
         this.moving=null;
      }
   },
   dispose:function()
   {
      if (Foundation.Controls.Control.prototype.dispose) Foundation.Controls.Control.prototype.dispose.call(this);
   },
   resource:Foundation.Controls.Control.prototype.resource,
   resourceUrl:Foundation.Controls.Control.prototype.resourceUrl,
   event:Foundation.Controls.Control.prototype.event,
   elementId:Foundation.Controls.Control.prototype.elementId,
   getElement:Foundation.Controls.Control.prototype.getElement,
   getElements:Foundation.Controls.Control.prototype.getElements,
   getElementValue:Foundation.Controls.Control.prototype.getElementValue,
   parseElementId:Foundation.Controls.Control.prototype.parseElementId,
   attachEvent:Foundation.Controls.Control.prototype.attachEvent,
   detachEvent:Foundation.Controls.Control.prototype.detachEvent,
   processHtml:Foundation.Controls.Control.prototype.processHtml,
   bind:Foundation.Controls.Control.prototype.bind,
   bindInnerHtml:Foundation.Controls.Control.prototype.bindInnerHtml,
   getBoundElement:Foundation.Controls.Control.prototype.getBoundElement,
   getBoundElements:Foundation.Controls.Control.prototype.getBoundElements,
   bindEvents:Foundation.Controls.Control.prototype.bindEvents,
   unbindFromElement:Foundation.Controls.Control.prototype.unbindFromElement,
   unbindEvents:Foundation.Controls.Control.prototype.unbindEvents,
   compareValues:Foundation.Controls.Control.prototype.compareValues,
   onValueChanged:Foundation.Controls.Control.prototype.onValueChanged,
   getValue:Foundation.Controls.Control.prototype.getValue,
   parseValue:Foundation.Controls.Control.prototype.parseValue,
   getDisabled:Foundation.Controls.Control.prototype.getDisabled,
   setDisabled:Foundation.Controls.Control.prototype.setDisabled,
   onDisabledChanged:Foundation.Controls.Control.prototype.onDisabledChanged,
   getRawInnerHtml:Foundation.Controls.Control.prototype.getRawInnerHtml,
   getInnerHtml:Foundation.Controls.Control.prototype.getInnerHtml,
   getRawHtml:Foundation.Controls.Control.prototype.getRawHtml,
   getBindTag:Foundation.Controls.Control.prototype.getBindTag,
   getBindId:Foundation.Controls.Control.prototype.getBindId,
   getBindClass:Foundation.Controls.Control.prototype.getBindClass,
   getBindStyle:Foundation.Controls.Control.prototype.getBindStyle,
   getHtml:Foundation.Controls.Control.prototype.getHtml,
   getCssName:Foundation.Controls.Control.prototype.getCssName
};
Foundation.Controls.Clipper.resourcePack={
      innerHtml:"\x3Ctable id=\"`masterContainer`\"\x3E\x3Ctr\x3E\x3Ctd nowrap\x3E\n\x3Cinput type=button value=\"-\" onclick=\"`changeZoomBy(-1)`\"\x3E\n\x3Cinput type=button value=\"+\" onclick=\"`changeZoomBy(1)`\"\x3E\n&nbsp;&nbsp;&nbsp;Origin:\x3Cspan id=\"`origin`\"\x3E\x3C/span\x3E\n&nbsp;&nbsp;&nbsp;Size:\x3Cspan id=\"`size`\"\x3E\x3C/span\x3E\n&nbsp;&nbsp;&nbsp;Corner:\x3Cspan id=\"`corner`\"\x3E\x3C/span\x3E\n\x3C/td\x3E\x3C/tr\x3E\x3Ctr\x3E\n\x3Ctd id=\"`clipper`\" style=\"position:relative;-moz-user-select:none;padding:`=rulerSize`px;border:1px solid black;background-color:#eeeeee\" onselectstart=\"return false;\" onmousedown=\"`onMouseDown(event)`\" onmousemove=\"`onMouseMove(event)`\" onmouseup=\"`onMouseUp(event)`\" ondblclick=\"`onDoubleClick(event)`\" ondragstart=\"return false;\" onselectstart=\"return false;\"\x3E\n\x3Cdiv id=\"`rulers`\" style=\"position:absolute;z-index:2\"\x3E\n\x3Cdiv id=\"`leftRuler`\" style=\"font:1px arial;position:absolute;top:0;left:0;width:1;height:1;background-color:#888888;border-right:1px solid #000000\"\x3E&nbsp;\x3C/div\x3E\n\x3Cdiv id=\"`rightRuler`\" style=\"font:1px arial;position:absolute;top:0;left:0;width:1;height:1;background-color:#888888;border-left:1px solid #000000\"\x3E&nbsp;\x3C/div\x3E\n\x3Cdiv id=\"`topRuler`\" style=\"font:1px arial;position:absolute;top:0;left:0;width:1;height:1;background-color:#888888;border-bottom:1px solid #000000\"\x3E&nbsp;\x3C/div\x3E\n\x3Cdiv id=\"`bottomRuler`\" style=\"font:1px arial;position:absolute;top:0;left:0;width:1;height:1;background-color:#888888;border-top:1px solid #000000\"\x3E&nbsp;\x3C/div\x3E\n\x3Cdiv id=\"`grid`\" style=\"position:absolute;top:0;left:0;visibility:hidden\"\x3E\x3C/div\x3E\n\x3C/div\x3E\n\x3Cimg id=\"`image`\" src=\"`=value`\" style=\"position:relative;image-rendering:-moz-crisp-edges;-ms-interpolation-mode:nearest-neighbor;border:`=imageBorder`px solid #ff0000;background-color:`=backgroundColor`;z-index:1\" onload=\"`imageOnload(this)`\" galleryimg=false\x3E\n\x3C/td\x3E\n\x3C/tr\x3E\x3C/table\x3E\n",
      value:"",
      imageBorder:1,
      rulerSize:10,
      top:0,
      left:0,
      width:0,
      height:0,
      zoom:1,
      bindElementTagName:"DIV"
   }
;
Foundation.Controls.Clipper.getTypePath=Foundation.Controls.Control.getTypePath;
Foundation.Controls.Clipper.resource=Foundation.Controls.Control.resource;
Foundation.Controls.Clipper.resourceUrl=Foundation.Controls.Control.resourceUrl;
Foundation.Controls.Clipper.getById=Foundation.Controls.Control.getById;
Foundation.Controls.Clipper.getFirst=Foundation.Controls.Control.getFirst;
Foundation.Controls.Clipper.getNext=Foundation.Controls.Control.getNext;
Foundation.Controls.Clipper.processHtml=Foundation.Controls.Control.processHtml;
Foundation.Controls.Clipper.isInstanceOf=Foundation.Controls.Control.isInstanceOf;
Foundation.Controls.Clipper.getAssociatedScript=Foundation.Controls.Control.getAssociatedScript;
Foundation.Controls.Clipper.resourcePackFromElement=Foundation.Controls.Control.resourcePackFromElement;
Foundation.Controls.Clipper.bindToElement=Foundation.Controls.Control.bindToElement;
Foundation.Controls.Clipper.getCssName=Foundation.Controls.Control.getCssName;
Foundation.Controls.Clipper.bindToElements=Foundation.Controls.Control.bindToElements;
Foundation.Controls.Clipper.getRawCssRules=Foundation.Controls.Control.getRawCssRules;
Foundation.Controls.Clipper.getCssRules=Foundation.Controls.Control.getCssRules;
Foundation.Controls.Clipper.writeToPage=Foundation.Controls.Control.writeToPage;
Foundation.Controls.Clipper.writeRulesToPage=Foundation.Controls.Control.writeRulesToPage;
Foundation.Controls.Clipper.$constructor();


