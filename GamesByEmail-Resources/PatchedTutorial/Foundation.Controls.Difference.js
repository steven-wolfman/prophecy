/*
Foundation.Controls.Difference
Copyright © 2010-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Controls.Difference.htm
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
Foundation.establishNamespace("Foundation.Controls");
Foundation.Controls.Difference=function(resourcePack)
{
   Foundation.Controls.Control.apply(this,arguments);
   this.resourcePack=resourcePack ? resourcePack : {};
};
Foundation.Controls.Difference.$parentClass=Foundation.Controls.Control;
if (!Foundation.Controls.Control.$childClasses) Foundation.Controls.Control.$childClasses=new Array();
Foundation.Controls.Control.$childClasses.push(Foundation.Controls.Difference);
Foundation.Controls.Difference.$constructor=Foundation.Controls.Control.$constructor ? Foundation.Controls.Control.$constructor : function(){};
Foundation.Controls.Difference.$interfaces=new Array();
Foundation.Controls.Difference.$name="Difference";
Foundation.Controls.Difference.$childClasses=new Array();
Foundation.Controls.Difference.$container=Foundation.Controls;
Foundation.Controls.Difference.prototype={
   constructor:Foundation.Controls.Difference,
   copyToClipboard:function(prop)
   {
      var t=document.createElement("TEXTAREA");
      t.value=this[prop];
      t.createTextRange().execCommand("Copy");
   },
   compareOnScroll:function(right)
   {
      var leftSide=this.getElement("leftCompareScroll");
      var rightSide=this.getElement("rightCompareScroll");
      if (right)
      {
         leftSide.scrollTop=rightSide.scrollTop;
         leftSide.scrollLeft=rightSide.scrollLeft;
      }
      else
      {
         rightSide.scrollTop=leftSide.scrollTop;
         rightSide.scrollLeft=leftSide.scrollLeft;
      }
   },
   clear:function()
   {
      this.activeDiff=-1;
      this.numDiffs=0;
      this.getElement("leftCompareTitle").innerHTML="";
      this.getElement("rightCompareTitle").innerHTML="";
      this.getElement("leftCompareContents").innerHTML="";
      this.getElement("rightCompareContents").innerHTML="";
      this.getElement("prevDiffButton").disabled=true;
      this.getElement("nextDiffButton").disabled=true;
      this.getElement("copyText1").disabled=true;
      this.getElement("copyText2").disabled=true;
   },
   compare:function(title1,text1,title2,text2)
   {
      var dec=this.resource("differenceEngine");
      if (dec==null)
         dec=Foundation.DifferenceEngine;
      var de=new dec();
      if (title1==null)title1="";
      if (text1==null)text1="";
      if (title2==null)title2="";
      if (text2==null)text2="";
      this.text1=text1;
      this.text2=text2;
      
      this.getElement("leftCompareTitle").innerHTML=title1.htmlEncode();
      this.getElement("rightCompareTitle").innerHTML=title2.htmlEncode();

      var lf1=dec.DiffList_LineData.fromString(text1);
      var lf2=dec.DiffList_LineData.fromString(text2);
      
      var time=de.processDiff(lf1,lf2,dec.LEVEL.FAST_IMPERFECT);
      var rep=de.diffReport();

      var compareAddedStyle=this.resource("compareAddedStyle");
      var compareReplacedStyle=this.resource("compareReplacedStyle");
      var compareDeletedStyle=this.resource("compareDeletedStyle");
      var compareFillerStyle=this.resource("compareFillerStyle");
      var compareNoChangeStyle=this.resource("compareNoChangeStyle");

      var contents1=new Foundation.StringBuilder();
      var contents2=new Foundation.StringBuilder();
      var cnt=1;
      var i;
      this.numDiffs=0;
      var noDiffName=this.elementId("noDiff");
      var delSourceName=this.elementId("delSource");
      var addDestName=this.elementId("addDest");
      var replaceName=this.elementId("replace");
      
      contents1.append("<pre>");
      contents2.append("<pre>");
      for (var j=0;j<rep.length;j++)
      {
         var drs=rep[j];
         var status=drs.getStatus();
         if (status==dec.DIFF_RESULT_SPAN_STATUS.NO_CHANGE)
         {
            contents1.append("<div class=\""+noDiffName+"\" style=\""+compareNoChangeStyle+"\">");
            contents2.append("<div style=\""+compareNoChangeStyle+"\">");
            var drsLength=drs.getLength();
            for (i = 0; i < drsLength; i++)
            {
               contents1.append(lf1.getByIndex(drs.getSourceIndex() + i).line.htmlEncode()+"\n");
               contents2.append(lf2.getByIndex(drs.getDestIndex() + i).line.htmlEncode()+"\n");
               cnt++;
            }
            contents1.append("</div>");
            contents2.append("</div>");
         }
         else if (status==dec.DIFF_RESULT_SPAN_STATUS.DELETE_SOURCE)
         {
            contents1.append("<div class=\""+delSourceName+"\" style=\""+compareAddedStyle+"\">");
            contents2.append("<div style=\""+compareFillerStyle+"\">");
            var drsLength=drs.getLength();
            for (i = 0; i < drsLength; i++)
            {
               contents1.append(lf1.getByIndex(drs.getSourceIndex() + i).line.htmlEncode()+"\n");
               contents2.append("\n");
               cnt++;
            }
            contents1.append("</div>");
            contents2.append("</div>");
            this.numDiffs++;
         }
         else if (status==dec.DIFF_RESULT_SPAN_STATUS.ADD_DESTINATION)
         {
            contents1.append("<div class=\""+addDestName+"\" style=\""+compareFillerStyle+"\">");
            contents2.append("<div style=\""+compareDeletedStyle+"\">");
            var drsLength=drs.getLength();
            for (i = 0; i < drsLength; i++)
            {
               contents1.append("\n");
               contents2.append(lf2.getByIndex(drs.getDestIndex() + i).line.htmlEncode()+"\n");
               cnt++;
            }
            contents1.append("</div>");
            contents2.append("</div>");
            this.numDiffs++;
         }
         else if (status==dec.DIFF_RESULT_SPAN_STATUS.REPLACE)
         {
            contents1.append("<div class=\""+replaceName+"\" style=\""+compareReplacedStyle+"\">");
            contents2.append("<div style=\""+compareReplacedStyle+"\">");
            var drsLength=drs.getLength();
            for (i = 0; i < drsLength; i++)
            {
               contents1.append(lf1.getByIndex(drs.getSourceIndex() + i).line.htmlEncode()+"\n");
               contents2.append(lf2.getByIndex(drs.getDestIndex() + i).line.htmlEncode()+"\n");
               cnt++;
            }
            contents1.append("</div>");
            contents2.append("</div>");
            this.numDiffs++;
         }
      }
      contents1.append("</pre>");
      contents2.append("</pre>");
      var e=this.getElement("leftCompareContents");
      e.innerHTML=contents1.toString();
      e.scrollTop=0;
      var e=this.getElement("rightCompareContents");
      e.innerHTML=contents2.toString();
      e.scrollTop=0;
      this.getElement("copyText1").disabled=false;
      this.getElement("copyText2").disabled=false;

      this.activeDiff=-1;
      e=this.getElement("prevDiffButton").disabled=true;
      e=this.getElement("nextDiffButton").disabled=(this.numDiffs==0);

      if (this.numDiffs>0)
         this.nextDiff();
      return this.numDiffs>0;
   },
   prevDiff:function()
   {
      if (this.activeDiff>0)
         this.setActiveDiff(this.activeDiff-1);
   },
   nextDiff:function()
   {
      if (this.activeDiff<this.numDiffs-1)
         this.setActiveDiff(this.activeDiff+1);
   },
   setActiveDiff:function(diff)
   {
      this.activeDiff=diff;
      var e=this.getElement("prevDiffButton");
      e.disabled=(this.activeDiff<=0);
      e=this.getElement("nextDiffButton");
      e.disabled=(this.activeDiff>=this.numDiffs-1);
      this.scrollToActiveDiff();
   },
   scrollToActiveDiff:function()
   {
      var nodes=this.getElement("leftCompareContents").childNodes[0].childNodes;
      var n=-1;
      var noDiffName=this.elementId("noDiff");
      for (var i=0;i<nodes.length;i++)
         if (nodes[i].tagName=="DIV" &&
             nodes[i].className!=noDiffName)
         {
            n++;
            if (n==this.activeDiff)
            {
               this.getElement("leftCompareScroll").scrollTop=nodes[i].offsetTop;
               break;
            }
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
   bindToElement:Foundation.Controls.Control.prototype.bindToElement,
   getBoundElement:Foundation.Controls.Control.prototype.getBoundElement,
   getBoundElements:Foundation.Controls.Control.prototype.getBoundElements,
   bindEvents:Foundation.Controls.Control.prototype.bindEvents,
   unbindFromElement:Foundation.Controls.Control.prototype.unbindFromElement,
   unbindEvents:Foundation.Controls.Control.prototype.unbindEvents,
   setValue:Foundation.Controls.Control.prototype.setValue,
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
Foundation.Controls.Difference.resourcePack={
      bindElementTagName:"DIV",
      innerHtml:"\x3Ctable width=\"100%\" height=\"100%\" border=1 cellspacing=0 cellpadding=0\x3E\n\x3Ctr\x3E\n\x3Cth width=\"50%\"\x3E\n\x3Ctable cellspacing=0 cellpadding=0 border=0\x3E\x3Ctr\x3E\x3Ctd nowrap\x3E\n\x3Cinput type=button id=\"`prevDiffButton`\" disabled value=\"&#9650;\" onclick=\"`prevDiff()`\" style=\"width:25px\"\x3E\n\x3Cinput type=button id=\"`nextDiffButton`\" disabled value=\"&#9660;\" onclick=\"`nextDiff()`\" style=\"width:25px\"\x3E\n\x3C/td\x3E\x3Cth id=\"`leftCompareTitle`\" width=\"100%\"\x3E&nbsp;\x3C/th\x3E\n\x3Ctd\x3E\x3Cinput type=button id=\"`copyText1`\" disabled value=\"&#9688;\" onclick=\"`copyToClipboard(\'text1\')`\" style=\"width:25px\"\x3E\x3C/td\x3E\n\x3C/tr\x3E\x3C/table\x3E\n\x3C/th\x3E\n\x3Cth width=\"50%\"\x3E\n\x3Ctable cellspacing=0 cellpadding=0 border=0\x3E\x3Ctr\x3E\n\x3Cth id=\"`rightCompareTitle`\" width=\"100%\"\x3E&nbsp;\x3C/th\x3E\n\x3Ctd\x3E\x3Cinput type=button id=\"`copyText2`\" disabled value=\"&#9688;\" onclick=\"`copyToClipboard(\'text2\')`\" style=\"width:25px\"\x3E\x3C/td\x3E\n\x3C/tr\x3E\x3C/table\x3E\n\x3C/th\x3E\n\x3C/tr\x3E\n\x3Ctr height=\"100%\"\x3E\n\x3Ctd style=\"background-color:#eeeeee\"\x3E\n\x3Cdiv id=\"`leftCompareScroll`\" onscroll=\"`compareOnScroll(false);`\" style=\"position:relative;width:100%;height:100%;overflow:auto\"\x3E\n\x3Cdiv id=\"`leftCompareContents`\" style=\"position:absolute\"\x3E\n\x3C/div\x3E\n\x3C/div\x3E\n\x3C/td\x3E\n\x3Ctd style=\"background-color:#eeeeee\"\x3E\n\x3Cdiv id=\"`rightCompareScroll`\" onscroll=\"`compareOnScroll(true);`\" style=\"position:relative;width:100%;height:100%;overflow:auto\"\x3E\n\x3Cdiv id=\"`rightCompareContents`\" style=\"position:absolute\"\x3E\n\x3C/div\x3E\n\x3C/div\x3E\n\x3C/td\x3E\n\x3C/tr\x3E\n\x3C/table\x3E\n",
      compareAddedStyle:"background-color:#cceecc",
      compareReplacedStyle:"background-color:#ccccee",
      compareDeletedStyle:"background-color:#eecccc",
      compareFillerStyle:"background-color:#cccccc",
      compareNoChangeStyle:""
   }
;
Foundation.Controls.Difference.getTypePath=Foundation.Controls.Control.getTypePath;
Foundation.Controls.Difference.resource=Foundation.Controls.Control.resource;
Foundation.Controls.Difference.resourceUrl=Foundation.Controls.Control.resourceUrl;
Foundation.Controls.Difference.getById=Foundation.Controls.Control.getById;
Foundation.Controls.Difference.getFirst=Foundation.Controls.Control.getFirst;
Foundation.Controls.Difference.getNext=Foundation.Controls.Control.getNext;
Foundation.Controls.Difference.processHtml=Foundation.Controls.Control.processHtml;
Foundation.Controls.Difference.isInstanceOf=Foundation.Controls.Control.isInstanceOf;
Foundation.Controls.Difference.getAssociatedScript=Foundation.Controls.Control.getAssociatedScript;
Foundation.Controls.Difference.resourcePackFromElement=Foundation.Controls.Control.resourcePackFromElement;
Foundation.Controls.Difference.bindToElement=Foundation.Controls.Control.bindToElement;
Foundation.Controls.Difference.getCssName=Foundation.Controls.Control.getCssName;
Foundation.Controls.Difference.bindToElements=Foundation.Controls.Control.bindToElements;
Foundation.Controls.Difference.getRawCssRules=Foundation.Controls.Control.getRawCssRules;
Foundation.Controls.Difference.getCssRules=Foundation.Controls.Control.getCssRules;
Foundation.Controls.Difference.writeToPage=Foundation.Controls.Control.writeToPage;
Foundation.Controls.Difference.writeRulesToPage=Foundation.Controls.Control.writeRulesToPage;
Foundation.Controls.Difference.$constructor();

