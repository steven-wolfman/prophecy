/*
Foundation.DifferenceEngine
Copyright © 2008-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.DifferenceEngine.htm

This code was adapted from Michael Potter's DiffEngine for C# as found on CodeProject.com:
http://www.codeproject.com/KB/recipes/diffengine.aspx

*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
Foundation.DifferenceEngine=function()
{
   this._source=null;
   this._dest=null;
   this._matchList=null;
   this._stateList=null;
   this._level=0;
};
Foundation.DifferenceEngine.$parentClass=null;
Foundation.DifferenceEngine.$constructor=function(){};
Foundation.DifferenceEngine.$interfaces=new Array();
Foundation.DifferenceEngine.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine);
Foundation.DifferenceEngine.$name="DifferenceEngine";
Foundation.DifferenceEngine.$childClasses=new Array();
Foundation.DifferenceEngine.$container=Foundation;
Foundation.DifferenceEngine.prototype={
   constructor:Foundation.DifferenceEngine,
   getSourceMatchLength:function(destIndex,sourceIndex,maxLength)
   {
      for (var matchCount=0;matchCount<maxLength;matchCount++)
         if (this._dest.getByIndex(destIndex+matchCount).compareTo(this._source.getByIndex(sourceIndex+matchCount))!=0)
            break;
      return matchCount;
   },
   getLongestSourceMatch:function(curItem,destIndex,destEnd,sourceStart,sourceEnd)
   {
      var maxDestLength=(destEnd-destIndex)+1;
      var curLength=0;
      var curBestLength=0;
      var curBestIndex=-1;
      var maxLength=0;
      for (var sourceIndex=sourceStart;sourceIndex<=sourceEnd;sourceIndex++)
      {
         maxLength=Math.min(maxDestLength,(sourceEnd-sourceIndex)+1);
         if (maxLength<=curBestLength)
            break;
         curLength=this.getSourceMatchLength(destIndex,sourceIndex,maxLength);
         if (curLength>curBestLength)
         {
            curBestIndex=sourceIndex;
            curBestLength=curLength;
         }
         sourceIndex+=curBestLength; 
      }
      if (curBestIndex==-1)
         curItem.setNoMatch();
      else
         curItem.setMatch(curBestIndex,curBestLength);
   },
   processRange:function(destStart,destEnd,sourceStart,sourceEnd)
   {
      var curBestIndex=-1;
      var curBestLength=-1;
      var maxPossibleDestLength=0;
      var curItem=null;
      var bestItem=null;
      for (var destIndex=destStart;destIndex<=destEnd;destIndex++)
      {
         maxPossibleDestLength=(destEnd-destIndex)+1;
         if (maxPossibleDestLength<=curBestLength)
            break;
         curItem=this._stateList.getByIndex(destIndex);
         if (!curItem.hasValidLength(sourceStart,sourceEnd,maxPossibleDestLength))
            this.getLongestSourceMatch(curItem,destIndex,destEnd,sourceStart,sourceEnd);
         if (curItem.getStatus()==1)
            if (this._level==0)
            {
               if (curItem.getLength()>curBestLength)
               {
                  curBestIndex=destIndex;
                  curBestLength=curItem.getLength();
                  bestItem=curItem;
               }
               destIndex+=curItem.getLength()-1;
            }
            else if (this._level==1)
            {
               if (curItem.getLength()>curBestLength)
               {
                  curBestIndex=destIndex;
                  curBestLength=curItem.getLength();
                  bestItem=curItem;
                  destIndex+=curItem.getLength()-1; 
               }
            }
            else
               if (curItem.getLength()>curBestLength)
               {
                  curBestIndex=destIndex;
                  curBestLength=curItem.getLength();
                  bestItem=curItem;
               }
      }
      if (curBestIndex>=0)
      {
         var sourceIndex=bestItem.getStartIndex();
         this._matchList[this._matchList.length]=Foundation.DifferenceEngine.DiffResultSpan.createNoChange(curBestIndex,sourceIndex,curBestLength);
         if (destStart<curBestIndex &&
             sourceStart<sourceIndex)
            this.processRange(destStart,curBestIndex-1,sourceStart,sourceIndex-1);
         var upperDestStart=curBestIndex+curBestLength;
         var upperSourceStart=sourceIndex+curBestLength;
         if (destEnd>upperDestStart &&
             sourceEnd>upperSourceStart)
            this.processRange(upperDestStart,destEnd,upperSourceStart,sourceEnd);
      }
   },
   processDiff:function(source,destination,level)
   {
      if (arguments.length>2)
         this._level=level;
      var dt=new Date();
      this._source=source;
      this._dest=destination;
      this._matchList=new Array();
      var dcount=this._dest.count();
      var scount=this._source.count();
      if (dcount>0 && scount>0)
      {
         this._stateList=new Foundation.DifferenceEngine.DiffStateList(dcount);
         this.processRange(0,dcount-1,0,scount-1);
      }
      var ts=new Date();
      return (ts.valueOf()-dt.valueOf())/1000;
   },
   addChanges:function(report,curDest,nextDest,curSource,nextSource)
   {
      var retval=false;
      var diffDest=nextDest-curDest;
      var diffSource=nextSource-curSource;
      var minDiff=0;
      if (diffDest>0)
      {
         if (diffSource>0)
         {
            minDiff=Math.min(diffDest,diffSource);
            report[report.length]=Foundation.DifferenceEngine.DiffResultSpan.createReplace(curDest,curSource,minDiff);
            if (diffDest>diffSource)
            {
               curDest+=minDiff;
               report[report.length]=Foundation.DifferenceEngine.DiffResultSpan.createAddDestination(curDest,diffDest-diffSource);
            }
            else
               if (diffSource>diffDest)
               {
                  curSource+=minDiff;
                  report[report.length]=Foundation.DifferenceEngine.DiffResultSpan.createDeleteSource(curSource,diffSource-diffDest);
               }
         }
         else
            report[report.length]=Foundation.DifferenceEngine.DiffResultSpan.createAddDestination(curDest,diffDest);
         retval=true;
      }
      else
         if (diffSource>0)
         {
            report[report.length]=Foundation.DifferenceEngine.DiffResultSpan.createDeleteSource(curSource,diffSource);
            retval=true;
         }
      return retval;
   },
   diffReport:function()
   {
      var retval=new Array();
      var dcount=this._dest.count();
      var scount=this._source.count();
      if (dcount==0)
      {
         if (scount>0)
            retval[retval.length]=Foundation.DifferenceEngine.DiffResultSpan.createDeleteSource(0,scount);
         return retval;
      }
      else
         if (scount==0)
         {
            retval[retval.length]=Foundation.DifferenceEngine.DiffResultSpan.createAddDestination(0,dcount);
            return retval;
         }
      this._matchList.sort(function(a,b){return a.compareTo(b);});
      var curDest=0;
      var curSource=0;
      var last=null;
      for (var i=0;i<this._matchList.length;i++)
      {
         var drs=this._matchList[i];
         if (!this.addChanges(retval,curDest,drs.getDestIndex(),curSource,drs.getSourceIndex()) &&
             last!=null)
            last.addLength(drs.getLength());
         else
            retval[retval.length]=drs;
         curDest=drs.getDestIndex()+drs.getLength();
         curSource=drs.getSourceIndex()+drs.getLength();
         last=drs;
      }
      this.addChanges(retval,curDest,dcount,curSource,scount);
      return retval;
   },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.Assert=function(test,message)
   {
      if (!test)
      {
         alert(message);
         throw(message);
      }
   };
Foundation.DifferenceEngine.LEVEL={FAST_IMPERFECT:0,MEDIUM:1,SLOW_PERFECT:2};
Foundation.DifferenceEngine.DIFF_STATUS={MATCHED:1,NO_MATCH:-1,UNKNOWN:-2};
Foundation.DifferenceEngine.DIFF_RESULT_SPAN_STATUS={NO_CHANGE:0,REPLACE:1,DELETE_SOURCE:2,ADD_DESTINATION:3};
Foundation.DifferenceEngine.DiffState=function()
      {
         this.setToUnknown();
      };
Foundation.DifferenceEngine.DiffState.$parentClass=null;
Foundation.DifferenceEngine.DiffState.$constructor=function(){};
Foundation.DifferenceEngine.DiffState.$interfaces=new Array();
Foundation.DifferenceEngine.DiffState.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine.DiffState);
Foundation.DifferenceEngine.DiffState.$name="DiffState";
Foundation.DifferenceEngine.DiffState.$childClasses=new Array();
Foundation.DifferenceEngine.DiffState.$container=Foundation.DifferenceEngine;
Foundation.DifferenceEngine.DiffState.prototype={
   constructor:Foundation.DifferenceEngine.DiffState,
   getStartIndex:function()
         {
            return this._startIndex;
         },
   getEndIndex:function()
         {
            return this._startIndex+this._length-1;
         },
   getLength:function()
         {
            if (this._length>0)
               return this._length;
            if (this._length==0)
               return 1;
            return 0;
         },
   getStatus:function()
         {
            if (this._length>0)
               return 1;
            if (this._length==-1)
               return -1;
            Foundation.DifferenceEngine.Assert(this._length==-2,"Invalid status: _length < -2");
            return -2;
         },
   setToUnknown:function()
         {
            this._startIndex=-1;
            this._length=-2;
         },
   setMatch:function(start,length)
         {
            Foundation.DifferenceEngine.Assert(length>0,"Length must be greater than zero");
            Foundation.DifferenceEngine.Assert(start>=0,"Start must be greater than or equal to zero");
            this._startIndex=start;
            this._length=length;
         },
   setNoMatch:function()
         {
            this._startIndex=-1;
            this._length=-1;
         },
   hasValidLength:function(newStart,newEnd,maxPossibleDestLength)
         {
            if (this._length > 0 &&
                (maxPossibleDestLength<this._length ||
                 this._startIndex<newStart ||
                 this.getEndIndex()>newEnd))
               this.setToUnknown();
            return this._length!=-2;
         },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.DiffState.BAD_INDEX=-1
      ;
Foundation.DifferenceEngine.DiffState.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.DiffState.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.DiffState.$constructor();

Foundation.DifferenceEngine.DiffStateList=function(destCount)
      {
         this._array=new Array(destCount);
         for (var i=0;i<destCount;i++)
            this._array[i]=null;
      };
Foundation.DifferenceEngine.DiffStateList.$parentClass=null;
Foundation.DifferenceEngine.DiffStateList.$constructor=function(){};
Foundation.DifferenceEngine.DiffStateList.$interfaces=new Array();
Foundation.DifferenceEngine.DiffStateList.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine.DiffStateList);
Foundation.DifferenceEngine.DiffStateList.$name="DiffStateList";
Foundation.DifferenceEngine.DiffStateList.$childClasses=new Array();
Foundation.DifferenceEngine.DiffStateList.$container=Foundation.DifferenceEngine;
Foundation.DifferenceEngine.DiffStateList.prototype={
   constructor:Foundation.DifferenceEngine.DiffStateList,
   getByIndex:function(index)
         {
            var retval=this._array[index];
            if (retval==null)
            {
               retval=new Foundation.DifferenceEngine.DiffState();
               this._array[index]=retval;
            }
            return retval;
         },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.DiffStateList.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.DiffStateList.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.DiffStateList.$constructor();

Foundation.DifferenceEngine.DiffResultSpan=function(status,destIndex,sourceIndex,length)
      {
         this._status=status;
         this._destIndex=destIndex;
         this._sourceIndex=sourceIndex;
         this._length=length;
      };
Foundation.DifferenceEngine.DiffResultSpan.$parentClass=null;
Foundation.DifferenceEngine.DiffResultSpan.$constructor=function(){};
Foundation.DifferenceEngine.DiffResultSpan.$interfaces=new Array();
Foundation.DifferenceEngine.DiffResultSpan.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine.DiffResultSpan);
Foundation.DifferenceEngine.DiffResultSpan.$name="DiffResultSpan";
Foundation.DifferenceEngine.DiffResultSpan.$childClasses=new Array();
Foundation.DifferenceEngine.DiffResultSpan.$container=Foundation.DifferenceEngine;
Foundation.DifferenceEngine.DiffResultSpan.prototype={
   constructor:Foundation.DifferenceEngine.DiffResultSpan,
   getDestIndex:function()
         {
            return this._destIndex;
         },
   getSourceIndex:function()
         {
            return this._sourceIndex;
         },
   getLength:function()
         {
            return this._length;
         },
   getStatus:function()
         {
            return this._status;
         },
   addLength:function(i)
         {
            this._length+=i;
         },
   toString:function()
         {
            return this._status.toString()+" (Dest: "+this._destIndex.toString()+",Source: "+this._sourceIndex.toString()+") "+this._length.toString();
         },
   compareTo:function(obj)
         {
            return this._destIndex-obj._destIndex;
         },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.DiffResultSpan.BAD_INDEX=-1;
Foundation.DifferenceEngine.DiffResultSpan.createNoChange=function(destIndex,sourceIndex,length)
         {
            return new this(0,destIndex,sourceIndex,length); 
         };
Foundation.DifferenceEngine.DiffResultSpan.createReplace=function(destIndex,sourceIndex,length)
         {
            return new this(1,destIndex,sourceIndex,length); 
         };
Foundation.DifferenceEngine.DiffResultSpan.createDeleteSource=function(sourceIndex,length)
         {
            return new this(2,this.BAD_INDEX,sourceIndex,length);
         };
Foundation.DifferenceEngine.DiffResultSpan.createAddDestination=function(destIndex,length)
         {
            return new this(3,destIndex,this.BAD_INDEX,length); 
         };
Foundation.DifferenceEngine.DiffResultSpan.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.DiffResultSpan.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.DiffResultSpan.$constructor();

Foundation.DifferenceEngine.DiffList_CharData=function(charData)
      {
         if (!String.prototype.compareTo)
            String.prototype.compareTo=String.prototype.localeCompare;
         this._charList=charData;
      };
Foundation.DifferenceEngine.DiffList_CharData.$parentClass=null;
Foundation.DifferenceEngine.DiffList_CharData.$constructor=function(){};
Foundation.DifferenceEngine.DiffList_CharData.$interfaces=new Array();
Foundation.DifferenceEngine.DiffList_CharData.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine.DiffList_CharData);
Foundation.DifferenceEngine.DiffList_CharData.$name="DiffList_CharData";
Foundation.DifferenceEngine.DiffList_CharData.$childClasses=new Array();
Foundation.DifferenceEngine.DiffList_CharData.$container=Foundation.DifferenceEngine;
Foundation.DifferenceEngine.DiffList_CharData.prototype={
   constructor:Foundation.DifferenceEngine.DiffList_CharData,
   count:function()
         {
            return this._charList.length;
         },
   getByIndex:function(index)
         {
            return this._charList.charAt(index);
         },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.DiffList_CharData.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.DiffList_CharData.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.DiffList_CharData.$constructor();

Foundation.DifferenceEngine.TextLine=function(str)
      {
         this.line=str.replace(/\t/g,"    ");
      };
Foundation.DifferenceEngine.TextLine.$parentClass=null;
Foundation.DifferenceEngine.TextLine.$constructor=function(){};
Foundation.DifferenceEngine.TextLine.$interfaces=new Array();
Foundation.DifferenceEngine.TextLine.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine.TextLine);
Foundation.DifferenceEngine.TextLine.$name="TextLine";
Foundation.DifferenceEngine.TextLine.$childClasses=new Array();
Foundation.DifferenceEngine.TextLine.$container=Foundation.DifferenceEngine;
Foundation.DifferenceEngine.TextLine.prototype={
   constructor:Foundation.DifferenceEngine.TextLine,
   compareTo:function(obj)
         {
            return this.line.localeCompare(obj.line);
         },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.TextLine.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.TextLine.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.TextLine.$constructor();

Foundation.DifferenceEngine.DiffList_LineData=function(value)
      {
         this._lines=value.split('\n');
         for (var i=0;i<this._lines.length;i++)
            this._lines[i]=new Foundation.DifferenceEngine.TextLine(this._lines[i]);
      };
Foundation.DifferenceEngine.DiffList_LineData.$parentClass=null;
Foundation.DifferenceEngine.DiffList_LineData.$constructor=function(){};
Foundation.DifferenceEngine.DiffList_LineData.$interfaces=new Array();
Foundation.DifferenceEngine.DiffList_LineData.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.DifferenceEngine.DiffList_LineData);
Foundation.DifferenceEngine.DiffList_LineData.$name="DiffList_LineData";
Foundation.DifferenceEngine.DiffList_LineData.$childClasses=new Array();
Foundation.DifferenceEngine.DiffList_LineData.$container=Foundation.DifferenceEngine;
Foundation.DifferenceEngine.DiffList_LineData.prototype={
   constructor:Foundation.DifferenceEngine.DiffList_LineData,
   count:function()
         {
            return this._lines.length;
         },
   getByIndex:function(index)
         {
            return this._lines[index];
         },
   dispose:function()
   {
   }
};
Foundation.DifferenceEngine.DiffList_LineData.fromString=function(value)
         {
            return new this(value.replace(/\r/g,""));
         };
Foundation.DifferenceEngine.DiffList_LineData.fromFile=function(fileName,okIfMissing)
         {
            var value;
            var fso=new ActiveXObject("Scripting.FileSystemObject");
            if (fso.FileExists(fileName))
            {
               var stream=fso.OpenTextFile(fileName);
               var value=stream.ReadAll();
               stream.Close();
               stream=null;
               fso=null;
            }
            else
            {
               fso=null;
               Foundation.DifferenceEngine.Assert(okIfMissing,"File not found :"+fileName);
               value="";
            }
            return this.fromString(value);
         };
Foundation.DifferenceEngine.DiffList_LineData.fromUrl=function(url)
         {
            var request=Foundation.getXmlHttpRequest();
            request.open("GET",url,false);
            request.send("");
            Foundation.DifferenceEngine.Assert(typeof(request.responseText)=="string","Invalid response, not a string");
            var value=request.responseText;
            request=null;
            return this.fromString(value);
         };
Foundation.DifferenceEngine.DiffList_LineData.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.DiffList_LineData.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.DiffList_LineData.$constructor();

Foundation.DifferenceEngine.getTypePath=Foundation.Class.getTypePath;
Foundation.DifferenceEngine.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.DifferenceEngine.$constructor();

