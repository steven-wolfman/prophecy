/*
Foundation.Tools.SimpleProfiler
Copyright © 2010-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Tools.SimpleProfiler.htm
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
/*
Foundation.Profiler
Copyright © 2010-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Profiler.htm
*/
if (!Foundation.exists("Foundation.Profiler"))
{
Foundation.Profiler=function()
{
   this.useMaxAge=true;
   this.maxAge=5000;
   this.useInterest=true;
   this.interest=new Array();
   this.$interest=null;
   this.boundClasses=new Array();
   this.boundMethods=new Array();
   this.classes=new Array();
   this.stack=new Array();
   this.depth=0;
   this.timerHandle=null;
   this.enabled=true;
   this.liveUpdates=true;
   this.paused=false;
   this.renderedStack=false;
};
Foundation.Profiler.$parentClass=null;
Foundation.Profiler.$constructor=function(){};
Foundation.Profiler.$interfaces=new Array();
Foundation.Profiler.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.Profiler);
Foundation.Profiler.$name="Profiler";
Foundation.Profiler.$childClasses=new Array();
Foundation.Profiler.$container=Foundation;
Foundation.Profiler.prototype={
   constructor:Foundation.Profiler,
   addClasses:function()
   {
      var num=0;
      for (var i=0;i<arguments.length;i++)
      {
         var list;
         if (typeof(arguments[i])=="string")
         {
            this.classes.push(arguments[i]);
            list=Foundation.Profiler.$getClassPathsByWildCardSearch(arguments[i]);
         }
         else
            if (typeof(arguments[i])=="function" &&
                typeof(arguments[i].getTypePath)=="function")
            {
               var tp=arguments[i].getTypePath();
               this.classes.push(tp);
               list=[tp];
            }
            else
            {
               if (arguments[i]!=null &&
                   typeof(arguments[i])=="object" &&
                   typeof(arguments[i].length)=="number")
                  num+=this.addClasses.apply(this,arguments[i]);
               continue;
            }
         for (var j=0;j<list.length;j++)
            if (this.bindToClass(list[j]))
               num++;
        }
      return num;
   },
   areMonitoringClass:function(theClass)
   {
      if (typeof(theClass)!="string")
         if (typeof(theClass.getTypePath)=="function")
            theClass=theClass.getTypePath();
         else
            return false;
      for (var i=0;i<this.boundClasses.length;i++)
         if (theClass==this.boundClasses[i])
            return true;
      return false;
   },
   isBindableStatic:function(theClass,methodName)
   {
      return ((methodName.charAt(0)<'A' || methodName.charAt(0)>'Z') &&
              methodName!="$parentClass" &&
              methodName!="$container" &&
              methodName!="$constructor" &&
              typeof(theClass[methodName])=="function" &&
              theClass[methodName].toString().search(/\{\s*\[native code\]\s*\}/)<0
             );
   },
   isBindableVirtual:function(theClass,methodName)
   {
      return ((methodName.charAt(0)<'A' || methodName.charAt(0)>'Z') && typeof(theClass.prototype[methodName])=="function");
   },
   getWindowFunctionNames:function()
   {
      var names=new Array();
      if (document.all)
      {
         var scripts=document.getElementsByTagName("SCRIPT");
         for (var i=0;i<scripts.length;i++)
         {
            var text=scripts[i].innerHTML;
            if (text.length==0 && scripts[i].src.length>0)
            {
               try
               {
                  text=Foundation.$readTextFile(scripts[i].src);
               }
               catch(e)
               {
                  text="";
               }
            }
            var f;
            var exp=new RegExp("\\Wfunction\\s+([\\$#\\w]+)\\s?\\(");
            while ((f=text.search(exp))>=0)
            {
               var name=RegExp.$1;
               if (typeof(window[name])==="function")
                  names.push(name);
               text=text.substr(f+12);
            }
         }
      }
      else
         for (var i in window)
            if (typeof(window[name])==="function")
               names.push(name);
      return names;
   },
   bindToClass:function(classPath)
   {
      if (typeof(classPath)!="string" ||
          this.areMonitoringClass(classPath))
         return false;
      var c=Foundation.getGlobalObject(classPath);
      if (c==null)
         return false;
      this.boundClasses.push(classPath);
      if (c.$parentClass && c.$parentClass.getTypePath)
         this.bindToClass(c.$parentClass.getTypePath());
      if (c.$interfaces)
         for (var i=0;i<c.$interfaces.length;i++)
            this.bindToClass(c.$interfaces[i].getTypePath());
      if (c==window)
      {
         var names=this.getWindowFunctionNames();
         for (var i=0;i<names.length;i++)
            this.bindToMethod(c,classPath,names[i]);
      }
      else
      {
         for (var i in c)
            if (this.isBindableStatic(c,i) &&
                !this.transferBoundInherited(c,i,false))
               this.bindToMethod(c,classPath,i);
         if (typeof(c)=="function" && c.prototype)
            for (var i in c.prototype)
               if (this.isBindableVirtual(c,i) &&
                   !this.transferBoundInherited(c,i,true))
                  this.bindToMethod(c.prototype,classPath+".prototype",i);
      }
      return true;
   },
   transferBoundInherited:function(childClass,methodName,isVirtual)
   {
      if (childClass.$parentClass &&
          this.transferBoundInheritedByClass(childClass,methodName,isVirtual,childClass.$parentClass))
         return true;
      if (childClass.$interfaces)
         for (var i=0;i<childClass.$interfaces.length;i++)
            if (this.transferBoundInheritedByClass(childClass,methodName,isVirtual,childClass.$interfaces[i]))
               return true;
      return false;
   },
   transferBoundInheritedByClass:function(childClass,methodName,isVirtual,parentClass)
   {
      var parentMethodName=methodName;
      if (typeof(isVirtual ? parentClass.prototype[parentMethodName] : parentClass[parentMethodName])!="function")
         parentMethodName="precedence$"+parentMethodName;
      if (!this.insertBoundInherited(isVirtual ? childClass.prototype[methodName] : childClass[methodName],isVirtual ? parentClass.prototype[parentMethodName] : parentClass[parentMethodName]))
         return false;
      if (isVirtual)
         childClass.prototype[methodName]=parentClass.prototype[parentMethodName];
      else
         childClass[methodName]=parentClass[parentMethodName];
      return true;
   },
   insertBoundInherited:function(child,parent)
   {
      if (typeof(parent)!="function" ||
          typeof(parent.$method)!="function" ||
          typeof(parent.$profilers)!="object" ||
          (child!=parent && child!=parent.$method))
         return false;
      if (!this.isBoundToMethod(parent))
         parent.$profilers.push(this);
      return true;
   },
   isBoundToMethod:function(method)
   {
      if (method.$profilers)
         for (var i=0;i<method.$profilers.length;i++)
            if (method.$profilers[i]==this)
               return true;
      return false;
   },
   bindToMethod:function(o,oPath,methodName)
   {
      this.boundMethods.push(oPath+"."+methodName);
      var m=o[methodName];
      var r=new Function("var v,i,s=[],p,m="+oPath+"."+methodName+";p=m.$profilers;for(i=0;i<p.length;i++)if(p[i])s.push(p[i].push(\""+(oPath+"."+methodName).cEncode()+"\"));try{v=m.$method.apply(this,arguments);}catch(e){for(i=0;i<p.length;i++)if(p[i])p[i].pop(s.shift(),e);throw(e);}for(i=0;i<p.length;i++)if(p[i])p[i].pop(s.shift(),null);return v;");
      r.$profilers=new Array(this);
      r.$method=m;
      o[methodName]=r;
   },
   clearAll:function()
   {
      this.stack.length=0;
   },
   clearCall:function(index)
   {
      this.clearRange(index,this.getExitIndex(index)+1);
   },
   clearRange:function(index,num)
   {
      if (num<0 || index+num>=this.stack.length)
         this.stack.length=index;
      else
      {
         for (index+=num;index<this.stack.length;index++)
            this.stack[index-num]=this.stack[index];
         this.stack.length-=num;
      }
   },
   clearOld:function()
   {
      var maxAge=(new Date()).valueOf()-this.maxAge;
      var index=0;
      while (index<this.stack.length)
      {
         var e=this.getExitIndex(index);
         if (this.stack[e].stamp<=maxAge)
         {
            for (var n=e+1;n<this.stack.length && this.stack[n=this.getExitIndex(n)].stamp<=maxAge;n++)
               e=n;
            this.clearRange(index,e-index+1);
         }
         else
            index=e+1;
      }
   },
   clearUninteresting:function()
   {
      if (this.$interest)
      {
         var index=0;
         while (index<this.stack.length)
            if (this.indexOfInteresting(index)<0)
            {
               var e=index;
               do
                  e=this.getExitIndex(e)+1;
               while (e<this.stack.length && this.indexOfInteresting(e)<0);
               this.clearRange(index,e-index);
            }
            else
               index=this.getExitIndex(index)+1;
      }
   },
   indexOfInteresting:function(index)
   {
      var depth;
      if (typeof(index)=="number" && index>=0)
      {
         if (index>=this.stack.length)
            return -1;
         if (this.isInterestingAtIndex(index))
            return index;
         depth=this.stack[index++].depth;
      }
      else
      {
         index=0;
         depth=-1;
      }
      for (;index<this.stack.length;index++)
         if (this.stack[index].depth<=depth)
            break;
         else
            if (this.isInterestingAtIndex(index))
               return index;
      return -1;
   },
   isInterestingAtIndex:function(index)
   {
      return (this.stack[index].isEnter && this.isInterestingPath(this.stack[index].path));
   },
   isInterestingPath:function(path)
   {
      return (path && path.search(this.$interest)>=0);
   },
   getSubCallFromIndexAndIndex:function(index,subIndex)
   {
      for (index++;subIndex>0;index=this.getExitIndex(index)+1)
         subIndex--;
      return index;
   },
   indexCaughtLowerExceptionAtIndex:function(index,subIndex)
   {
      return (this.stack[this.getSubCallFromIndexAndIndex(index,subIndex)].threwEx);
   },
   countSubcallExceptionsAtIndex:function(index)
   {
      var num=0;
      for (index++;this.stack[index].isEnter;index=this.getExitIndex(index)+1)
         if (this.stack[index].threwEx)
            num++;
      return num;
   },
   countRoots:function()
   {
      var num=0;
      for (var i=0;i<this.stack.length;i=this.getExitIndex(i)+1)
         num++;
      return num;
   },
   push:function(path)
   {
      if (this.depth==0)
      {
         if (this.paused || !this.enabled)
            return -1;
         if (this.timerHandle)
            window.clearTimeout(this.timerHandle);
         if (this.renderedStack)
         {
            this.clearAll();
            this.renderedStack=false;
         }
         else
            if (this.useMaxAge && this.maxAge>0)
               this.clearOld();
      }
      var index=this.stack.length;
      this.stack.push({isEnter:true,path:path,threwEx:false,depth:this.depth,size:0,stamp:(new Date()).valueOf()});
      this.depth++;
      return index;
   },
   pop:function(index,ex)
   {
      if (index<0)
         return;
      this.depth--;
      var size=this.stack.length-index;
      this.stack[index].size=size;
      if (ex)
         this.stack[index].threwEx=true;
      this.stack.push({isEnter:false,depth:this.depth,size:-size,stamp:(new Date()).valueOf()});
      if (this.depth==0)
         this.timerHandle=window.setTimeout(this.event("processStack()"),100);
   },
   processStack:function()
   {
      this.timerHandle=null;
      //if (this.useMaxAge && this.maxAge>0)
      //   this.clearOld();
      this.maybeUpdate(this.paused);
   },
   getInterestIndex:function(interest)
   {
      for (var i=0;i<this.interest.length;i++)
         if (this.interest[i]==interest)
            return i;
      return -1;
   },
   setInterest:function(interest)
   {
      this.interest.length=0;
      this.addInterest(interest);
   },
   addInterest:function(interest)
   {
      for (var i=0;i<arguments.length;i++)
      {
         interest=arguments[i];
         if (typeof(interest)=="string")
         {
            interest=interest.trim();
            if (interest.length>0 &&
                this.getInterestIndex(interest)<0)
               this.interest.push(interest);
         }
         else
            if (interest!=null && typeof(interest.length)=="number")
               for (var j=0;j<interest.length;j++)
                  this.addInterest(interest[j]);
      }
      this.$interest=this.getInterestExpression();
   },
   removeInterest:function(interest)
   {
      interest=interest.trim();
      var i;
      while ((i=this.getInterestIndex(interest))>=0)
         for (i++;i<this.interest.length;i++)
         {
            this.interest[i-1]=this.interest[i];
            this.interest.length--;
         }
   },
   getInterestExpression:function()
   {
      if (!this.useInterest || this.interest.length==0)
         return null;
      var exp="";
      for (var i=0;i<this.interest.length;i++)
      {
         if (exp.length>0)
            exp+="|";
         exp+=this.interest[i].regExpEncode();
      }
      return new RegExp("("+exp+")");
   },
   maybeUpdate:function(force)
   {
      if (force || this.liveUpdates)
      {
         this.clearUninteresting();
         this.calculateTimes();
         this.update();
         this.renderedStack=true;
      }
   },
   update:function()
   {
   },
   getExitIndex:function(index)
   {
      return index+this.stack[index].size;
   },
   getTotals:function()
   {
      var totals=new Array();
      var c;
      for (var i=0;i<this.stack.length;i++)
         if ((c=this.stack[i]).isEnter)
         {
            for (var j=0;j<totals.length;j++)
               if (totals[j].path==c.path)
                  break;
            var t;
            if (j==totals.length)
               totals.push(t={path:c.path,interesting:this.isInterestingPath(c.path),numCalls:0,timeTotal:0,timeInHere:0,threwExceptions:0,caughtExceptions:0});
            else
               t=totals[j];
            t.numCalls++;
            t.timeTotal+=c.times[0];
            t.timeInHere+=c.times[1];
            if (c.threwEx)
               t.threwExceptions++;
            else
               t.caughtExceptions+=this.countSubcallExceptionsAtIndex(i);
         }
      totals.sort(function(a,b){return (a.timeInHere!=b.timeInHere ? b.timeInHere-a.timeInHere : (a.timeTotal!=b.timeTotal ? b.timeTotal-a.timeTotal : (a.numCalls!=b.numCalls ? b.numCalls-a.numCalls : a.path.localeCompare(b.path))));});
      return totals;
   },
   calculateTimes:function()
   {
      var indeces=new Array();
      var c;
      for (var i=0;i<this.stack.length;i++)
         if ((c=this.stack[i]).times)
            i=this.getExitIndex(i);
         else
            if (c.isEnter)
            {
               c.times=new Array();
               c.times.push(0,0);
               if (indeces.length>0)
                  this.stack[indeces[indeces.length-1]].times.push(c.stamp-this.stack[i-1].stamp); //A
               indeces.push(i);
            }
            else
            {
               var x="il:"+indeces.length;
               var f=indeces.pop();
               x+=" f:"+f;
               var s=this.stack[f];
               var e=s.times[0]=c.stamp-s.stamp; //B
               s.times.push(c.stamp-this.stack[i-1].stamp); //C
               if (indeces.length>0)
                  this.stack[indeces[indeces.length-1]].times.push(e); //D
               for (var j=2;j<s.times.length;j+=2)
                  s.times[1]+=s.times[j]; //E
            }
   },
   dispose:function()
   {
   }
};
Foundation.Profiler.$getClassPathsByWildCardSearch=function(classes)
   {
      var list=(arguments.length<2 ? new Array() : arguments[1]);
      var o=(arguments.length<3 ? Foundation.getGlobalObject() : arguments[2]);
      var path=(arguments.length<4 ? "" : arguments[3]);
      if (classes.length>0)
      {
         classes=classes.split('.');
         var c=classes.shift();
         classes=classes.join('.');
         if (c.indexOf("*")>=0 || c.indexOf("?")>=0)
         {
            var r=new RegExp("^"+c.regExpEncode().replace(/\\\*/g,'.*').replace(/\\\?/g,'.')+"$");
            for (var i in o)
               if (i.search(r)==0)
                  this.$getClassPathsByWildCardSearch(classes,list,o[i],path+"."+i);
         }
         else
            this.$getClassPathsByWildCardSearch(classes,list,o[c],path+"."+c);
      }
      else
         if (path.length>1)
            list.push(path.substr(1));
      return list;
   };
Foundation.Profiler.getTypePath=Foundation.Class.getTypePath;
Foundation.Profiler.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.Profiler.$constructor();

}
/*
Foundation.Tools.ScriptFormatter
Copyright © 2010-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Tools.ScriptFormatter.htm
*/
if (!Foundation.exists("Foundation.Tools.ScriptFormatter"))
{
Foundation.establishNamespace("Foundation.Tools");
Foundation.Tools.ScriptFormatter=function()
{
   this.asHtml=true;
   this.coloring={"string":"#C00000"
   ,"regExp":"#C08000"
   ,"call":"#0000ff"
   ,"lineComment":"#008000"
   ,"blockComment":"#008000"
   ,"keyword":null
   ,"backgroundStart":247
   ,"indentationStep":-6
   };
   this.indentationStep=3;
   this.highlight={text:null
                  ,name:null
                  ,color:null
                  ,count:0
                  };
};
Foundation.Tools.ScriptFormatter.$parentClass=null;
Foundation.Tools.ScriptFormatter.$constructor=function(){};
Foundation.Tools.ScriptFormatter.$interfaces=new Array();
Foundation.Tools.ScriptFormatter.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.Tools.ScriptFormatter);
Foundation.Tools.ScriptFormatter.$name="ScriptFormatter";
Foundation.Tools.ScriptFormatter.$childClasses=new Array();
Foundation.Tools.ScriptFormatter.$container=Foundation.Tools;
Foundation.Tools.ScriptFormatter.prototype={
   constructor:Foundation.Tools.ScriptFormatter,
   setScript:function(script)
   {
      if (typeof(script)=="string")
      {
         this.unformatted=script;
         this.unformattedLength=this.unformatted.length;
         this.formatted=new Array("");
         this.position=0;
         this.positionStack=new Array();
         this.markPosition=0;
         this.indentationStack=new Array();
      }
      else
      {
         this.formatted=null;
         this.unformatted=null;
         this.positionStack=null;
         this.indentationStack=null;
         this.colorizer=null;
      }
   },
   colorize:function(script)
   {
      if (script.indexOf('\n')>0)
      {
         script=script.replace(/\r\n/g,"\n").replace(/[ \t]+\n/g,"\n").replace(/\n[ \t]+/g,"\n");
         this.setScript(script);
         this.multilineIndent=this.getMultilineIndent();
         var parts=script.split('\n');
         script="";
         for (var i=0;i<parts.length;i++)
         {
            if (i>0)
               script+="\n";
            if (this.multilineIndent[i].length>0)
               script+=this.multilineIndent[i];
            script+=parts[i];
         }
      }
      this.setScript(script);
      this.colorizeScript();
      script=this.addHighlights(this.formatted.join(""),script).replace(/\x10/g,"&nbsp;");
      this.setScript();
      return script;
   },
   process:function(script)
   {
      this.setScript(script);
      this.configurePerSettings();
      this.processScript();
      script=this.formatted.join("");
      this.setScript();
      return script;
   },
   createColorizer:function()
   {
      var c=new this.constructor();
      c.parent=this;
      c.coloring=this.coloring;
      c.highlight=this.highlight;
      return c;
   },
   configurePerSettings:function()
   {
      this.highlight.count=0;
      this.indentationString=Foundation.Tools.ScriptFormatter.getSpaceString(this.indentationStep);
      this.leader=(this.unformatted.search(/^(\s*)\S/)>=0 ? RegExp.$1 : "");
      this.getIndentation=this.getPlainIndentation;
      if (this.asHtml)
      {
         this.indentationString=this.indentationString.replace(/ /g,"&nbsp;");
         this.leader=this.getColoredIndentation(0)+this.leader.htmlEncode().replace(/ /g,"&nbsp;").replace(/\t/g,this.indentationString);
         if (this.coloring && this.coloring.indentationStep!=0)
         {
            this.getIndentation=this.getColoredIndentation;
            this.getNewLine=this.getColoredNewLine;
         }
         else
            this.getNewLine=this.getHtmlNewLine;
         if (this.coloring &&
             (this.coloring["string"] ||
              this.coloring["regExp"] ||
              this.coloring["call"] ||
              this.coloring["lineComment"] ||
              this.coloring["blockComment"] ||
              this.coloring["keyword"]))
         {
            this.colorizer=this.createColorizer();
            this.processCode=this.processCodeForColoredHtml;
         }
         else
            this.processCode=this.processCodeForUncoloredHtml;
      }
      else
      {
         this.getNewLine=this.getPlainNewLine;
         this.processCode=this.processCodeForPlain;
      }
   },
   push:function()
   {
      this.positionStack.push(this.position);
      return this.position;
   },
   pop:function()
   {
      var old=this.position;
      this.position=this.positionStack.pop();
      return old;
   },
   processScript:function()
   {
      while (this.processStatement());
   },
   processStatement:function()
   {
      var moreToCome=true;
      var s;
      this.passWhiteSpace();
      if ((s=this.isAtBlockComment())!=null)
         this.processAtBlockComment(s);
      else
         if ((s=this.isAtLineComment())!=null)
            this.processAtLineComment(s);
         else
            if ((s=this.isAtBlockStatement())!=null)
               this.processAtBlockStatement(s);
            else
            {
               var t=this.moveTo(';','{','}');
               switch (t)
               {
                  case ';'  : this.processAtSemicolon(); break;
                  case '{'  : this.processAtOpenBracket(); break;
                  case '}'  : this.processAtCloseBracket(); break;
                  default   : this.processEnd(); moreToCome=false; break;
               }
            }
      return moreToCome;
   },
   append:function(value)
   {
      if (typeof(value)!="string")
         value="UNDEFINED"+value;
      this.formatted.push(value);
   },
   getLeader:function()
   {
      var leader=this.leader;
      return leader;
   },
   getPlainIndentation:function(depth)
   {
      return this.indentationString;
   },
   getColoredIndentation:function(depth)
   {
      var c=this.coloring.backgroundStart;
      if (depth>0)
         c+=depth*this.coloring.indentationStep;
      c=c.toString(16);
      if (c.length<2)
         c="0"+c;
      return "<span style=\"background-color:#"+c+c+c+"\">"+(depth>0 ? this.indentationString : "");
   },
   appendIndentation:function(backOne,appendee)
   {
      if (!appendee)
         appendee=this;
      appendee.append(this.getLeader());
      var num=0;
      for (var i=0;i<this.indentationStack.length;i++)
         if (this.indentationStack[i]=='{' ||
             this.indentationStack[i]=='+')
            num++;
      if (backOne)
         num--;
      this.lastIndentationDepth=num;
      for (var i=0;i<num;i++)
         appendee.append(this.getIndentation(i+1));
   },
   getPlainNewLine:function()
   {
      return "\r\n";
   },
   getHtmlNewLine:function()
   {
      return "</span><br/>";
   },
   getColoredNewLine:function()
   {
      var nl="";
      for (var i=0;i<this.lastIndentationDepth;i++)
         nl+="</span>";
      nl+="</span><br/>";
      return nl;
   },
   appendNewLine:function(appendee)
   {
      if (!appendee)
         appendee=this;
      if (this.formatted.length>0 &&
          !this.formatted[this.formatted.length-1].endsWith("\n") &&
          !this.formatted[this.formatted.length-1].endsWith("<br/>"))
         appendee.append(this.getNewLine());
   },
   setIndentation:function(statement,nextIsNotBrace)
   {
      if (typeof(statement)!="string")
         while (this.indentationStack.length>0 &&
                this.indentationStack[this.indentationStack.length-1]!='{')
            this.indentationStack.pop();
      else
         if (statement=="else")
            if (typeof(nextIsNotBrace)=="undefined")
            {
               while (this.indentationStack.length>0 &&
                      this.indentationStack[this.indentationStack.length-1]!='{' &&
                      this.indentationStack[this.indentationStack.length-1]!='if')
                  this.indentationStack.pop();
               if (this.indentationStack.length>0 &&
                   this.indentationStack[this.indentationStack.length-1]=='if')
                  this.indentationStack[this.indentationStack.length-1]=statement;
            }
            else
            {
               if (nextIsNotBrace)
                  this.indentationStack.push("+");
            }
         else
            if (statement=="}")
            {
               while (this.indentationStack.length>0 &&
                      this.indentationStack[this.indentationStack.length-1]!='{')
                  this.indentationStack.pop();
               if (this.indentationStack.length>0 &&
                   this.indentationStack[this.indentationStack.length-1]=='{')
                  this.indentationStack.pop();
            }
            else
            {
               this.indentationStack.push(statement);
               if (nextIsNotBrace)
                  this.indentationStack.push("+");
            }
   },
   processCodeForColoredHtml:function(code)
   {
      return this.colorizer.colorize(code);
   },
   processCodeForUncoloredHtml:function(code)
   {      
      return code.htmlEncode();
   },
   processCodeForPlain:function(code)
   {
      return code;
   },
   appendMultilineSeparation:function(appendee)
   {
      this.appendNewLine(appendee);
      this.appendIndentation(false,appendee);
   },
   processToPosition:function(backOne)
   {
      var s=this.getFromMark().trim();
      if (s.length>0)
      {
         this.appendIndentation(backOne);
         this.append(this.processCode(s));
      }
      this.mark();
   },
   processAtBlockComment:function()
   {
      this.passBlockComment();
      this.processToPosition();
      this.mark();
      this.passWhiteSpace();
      if (this.getFromMark().indexOf("\n")>=0)
      {
         this.appendNewLine();
         this.mark();
      }
   },
   processAtLineComment:function()
   {
      this.passLineComment();
      this.processToPosition();
      this.mark();
      this.appendNewLine();
   },
   processAtSemicolon:function()
   {
      this.processToPosition();
      this.append(this.getChar().htmlEncode());
      this.position++;
      this.mark();
      this.appendNewLine();
      this.setIndentation(this.isNext("else"));
   },
   processAtOpenBracket:function()
   {
      this.processToPosition();
      this.appendNewLine();
      this.appendIndentation();
      this.append(this.getChar().htmlEncode());
      this.setIndentation("{");
      this.position++;
      this.mark();
      this.appendNewLine();
   },
   processAtCloseBracket:function()
   {
      this.processToPosition();
      this.appendNewLine();
      this.setIndentation("}");
      this.appendIndentation();
      this.append(this.getChar().htmlEncode());
      this.position++;
      this.setIndentation(this.isNext("else"));
      this.mark();
      if (!this.isNext(';'))
         this.appendNewLine();
   },
   processAtBlockStatement:function(statement)
   {
      var isLabeled=(statement=="case" || statement=="default");
      this.movePast(statement);
      if (statement=="if" ||
          statement=="while" ||
          statement=="for" ||
          statement=="switch" ||
          statement=="with")
      {
         this.moveTo("(");
         this.passMatchingDelimeter();
      }
      else
         if (statement=="catch")
         {
            this.push();
            this.passWhiteSpace();
            if (this.getChar()=="(")
            {
               this.position=this.pop();
               this.passMatchingDelimeter();
            }
            else
               this.pop();
         }
         else
            if (isLabeled)
               this.movePast(":");
      this.processToPosition(isLabeled);
      this.mark();
      if (!this.isNext(';'))
         this.appendNewLine();
      if (!isLabeled)
         this.setIndentation(statement,this.isNext("{")!="{");
   },
   processEnd:function()
   {
      this.processToPosition();
      this.mark();
      this.appendNewLine();
   },
   mark:function()
   {
      this.markPosition=this.position;
   },
   isAtEndOfScript:function()
   {
      return this.position>=this.unformattedLength;
   },
   startsWith:function()
   {
      for (var i=0;i<arguments.length;i++)
      {
         var v=arguments[i];
         if (this.position+v.length<=this.unformattedLength &&
             this.unformatted.substr(this.position,v.length)==v)
            return v;
      }
      return null;
   },
   moveTo:function()
   {
      var target;
      while (!this.isAtEndOfScript())
         if ((target=this.startsWith.apply(this,arguments))!=null)
            return target;
         else
            this.passNormal();
      return null;
   },
   passNormal:function()
   {
      if (this.isAtString())
         this.passString();
      else if (this.isAtRegExp())
         this.passRegExp();
      else if (this.isAtBlockComment())
         this.passBlockComment();
      else if (this.isAtLineComment())
         this.passLineComment();
      else
         this.position++;
   },
   movePast:function(target)
   {
      var best=this.moveTo.apply(this,arguments);
      if (best!=null)
         this.position+=best.length;
      return best;
   },
   getChar:function()
   {
      return (this.isAtEndOfScript() ? null : this.unformatted.charAt(this.position));
   },
   getFromMark:function()
   {
      if (this.position<0 ||
          this.position>this.unformattedLength ||
          this.markPosition<0 ||
          this.markPosition>this.unformattedLength)
         return null;
      if (this.position<this.markPosition)
         return this.unformatted.substr(this.position,this.markPosition-this.position);
      return this.unformatted.substr(this.markPosition,this.position-this.markPosition);
   },
   isAtString:function()
   {
      return this.startsWith("'","\"");
   },
   passString:function()
   {
      this.passWithSlashEscape();
   },
   isAtWhiteSpace:function()
   {
      return this.startsWith(" ","\t","\r","\n");
   },
   isAtPunctuator:function()
   {
      return this.startsWith('{','}','(',')','[',']','.',';',',','<','>','=','*','/','+','-','\\','&','|','?',':','!');
   },
   passWhiteSpace:function()
   {
      while (this.isAtWhiteSpace())
         this.position++;
   },
   passWhiteSpaceBackwards:function()
   {
      this.position--;
      while (this.position>=0 && this.isAtWhiteSpace())
         this.position--;
      this.position++;
   },
   passWithSlashEscape:function()
   {
      var e=this.unformatted.charAt(this.position++);
      while (true)
      {
         var c=this.unformatted.charAt(this.position++);
         if (c=="\\")
            this.position++;
         else
            if (c==e)
               break;
      }
   },
   isAtRegExp:function()
   {
      return this.startsWith("/") &&
             !this.isAtBlockComment() &&
             !this.isAtLineComment() &&
             !this.isPrecedingExpression();
   },
   isPrecedingExpression:function()
   {
      for (var i=this.position-1;i>=0;i--)
      {
         var c=this.unformatted.charAt(i);
         if (" \t\r\n".indexOf(c)<0)
            return ";(,=:?".indexOf(c)<0;
      }
      return false;
   },
   passRegExp:function()
   {
      this.passWithSlashEscape();
      while (this.startsWith("g","i","m"))
         this.position++;
   },
   isNext:function()
   {
      this.push();
      this.passWhiteSpace();
      var value=this.startsWith.apply(this,arguments);
      this.pop();
      return value;
   },
   isAtBlockComment:function()
   {
      return this.startsWith("/*");
   },
   passBlockComment:function()
   {
      var c=this.unformatted.indexOf("*/",this.position+2);
      if (c<0)
         this.position=this.unformattedLength;
      else
         this.position=c+2;
   },
   isAtLineComment:function()
   {
      return this.startsWith("//");
   },
   passLineComment:function()
   {
      var r=this.unformatted.indexOf("\r",this.position+2);
      var n=this.unformatted.indexOf("\n",this.position+2);
      if (r<0 && n<0)
         this.position=this.unformattedLength;
      else if (r>=0 && n>=0)
         this.position=Math.min(r,n);
      else
         this.position=Math.max(r,n);
   },
   isAtWord:function()
   {
      this.push();
      var word=this.startsWith.apply(this,arguments);
      if (word!=null)
      {
         this.position+=word.length;
         if (!this.isAtPunctuator() && !this.isAtWhiteSpace())
            word=null;
      }
      this.pop();
      return word;
   },
   isAtBlockStatement:function()
   {
      return this.isAtWord("if","else","for","while","do","switch","with","try","catch","finally","case","default");
   },
   isAtNonFunctionCall:function()
   {
      return this.isAtWord("if","for","while","switch","with","catch","function");
   },
   passExpressionBackwards:function()
   {
      this.position--;
      while (this.position>=0 && !this.isAtPunctuator() && !this.isAtWhiteSpace())
         this.position--;
      this.position++;
   },
   isAtFunctionCall:function()
   {
      var atCall=-1;
      if (this.startsWith("("))
      {
         this.push();
         this.passWhiteSpaceBackwards();
         var e=this.position;
         this.passExpressionBackwards();
         if (this.position!=e &&
             !this.isAtNonFunctionCall())
            atCall=this.position;
         this.pop();
      }
      return atCall;
   },
   passMatchingDelimeter:function()
   {
      var o=this.getChar();
      var c;
      switch (o)
      {
      case '(' : c=')'; break;
      case '[' : c=']'; break;
      case '{' : c='}'; break;
      case '/' :
         c=this.unformatted.indexOf("*/",this.position+2);
         if (c<0)
            this.position=this.unformattedLength;
         else
            this.position=c+2;
         return;
      default :
         this.position=this.unformattedLength;
         return;
      }
      this.position++;
      var depth=1;
      while (depth>0)
      {
         var d=this.moveTo(o,c);
         if (d==null)
            return;
         if (d==o)
            depth++;
         else if (d==c)
            depth--;
         this.position++;
      }
   },
   getLineNumber:function(index)
   {
      var num=0;
      while ((index=this.unformatted.lastIndexOf('\n',index)-1)>=0)
         num++;
      return num;
   },
   measureToPrecedingNewLine:function(index)
   {
      return index-this.unformatted.lastIndexOf('\n',index)-1;
   },
   getMultilineIndentAtIndex:function(index,previousIndents)
   {
      var indent="";
      this.push();
      this.multilineIndent=new Array();
      this.multilineIndent[0]="";
      var delim;
      var p=this.position;
      while (delim=this.moveTo('(','[','{','/*',"return ","Foundation\x2EcreateClass","Foundation\x2EappendClass","Foundation\x2EcreateInterface","Foundation\x2EappendInterface","Foundation\x2Enamespace"))
      {
         if (this.position>=index)
            break;
         this.push();
         this.passMatchingDelimeter();
         if (this.position<index)
            this.position=this.pop();
         else
            if (delim.length==1 && this.position-1==index)
            {
               this.pop();
               indent=previousIndents[this.getLineNumber(this.position)]+Foundation.Tools.ScriptFormatter.getSpaceString(this.measureToPrecedingNewLine(this.position));
               break;
            }
            else
               if (delim=="/*")
                  this.position=this.pop();
               else
                  if (delim=="return ")
                  {
                     this.pop();
                     this.position+=6;
                     this.passWhiteSpace();
                     indent=previousIndents[this.getLineNumber(this.position)]+Foundation.Tools.ScriptFormatter.getSpaceString(this.measureToPrecedingNewLine(this.position));
                  }
                  else
                     if (delim.startsWith("Foundation\x2E"))
                     {
                        this.pop();
                        indent=previousIndents[this.getLineNumber(this.position)]+Foundation.Tools.ScriptFormatter.getSpaceString(this.measureToPrecedingNewLine(this.position));
                        break;
                     }
                     else
                     {
                        this.pop();
                        this.position++;
                        indent=previousIndents[this.getLineNumber(this.position)]+Foundation.Tools.ScriptFormatter.getSpaceString(this.measureToPrecedingNewLine(this.position));
                     }
      }
      this.pop();
      return indent;
   },
   getMultilineIndent:function()
   {
      var indents=new Array();
      indents[0]="";
      var parts=this.unformatted.split('\n');
      var currentLength=parts[0].length+1;
      for (var i=1;i<parts.length;i++)
      {
         indents[i]=this.getMultilineIndentAtIndex(currentLength,indents);
         currentLength+=parts[i].length+1;
      }
      for (var i=0;i<indents.length;i++)
         indents[i]=indents[i].replace(/ /g,"\x10")
      return indents;
   },
   colorizeScript:function()
   {
      this.multilineOffset=0;
      while (!this.isAtEndOfScript())
      {
         var c;
         if (this.isAtString())
            this.colorizeString();
         else if (this.isAtRegExp())
            this.colorizeRegExp();
         else if (this.isAtBlockComment())
            this.colorizeBlockComment();
         else if (this.isAtLineComment())
            this.colorizeLineComment();
         else if ((c=this.isAtFunctionCall())>=0)
            this.colorizeFunctionCall(c);
         else
            this.position++;
      }
      this.colorizeAppendFromMark();
   },
   colorizeOrPass:function(type)
   {
      if (this.coloring[type])
         this.colorizeAppendFromMark();
      this["pass"+type.charAt(0).toUpperCase()+type.substr(1)]();
      if (this.coloring[type])
         this.colorizeAppendFromMark(this.coloring[type]);
   },
   colorizeString:function()
   {
      this.colorizeOrPass("string");
   },
   colorizeRegExp:function()
   {
      this.colorizeOrPass("regExp");
   },
   colorizeBlockComment:function()
   {
      this.colorizeOrPass("blockComment");
   },
   colorizeLineComment:function()
   {
      this.colorizeOrPass("lineComment");
   },
   colorizeFunctionCall:function(start)
   {
      if (this.coloring["call"])
      {
         this.push();
         var end=this.position;
         this.position=start;
         this.colorizeAppendFromMark();
         this.position=end;
         this.colorizeAppendFromMark(this.coloring["call"]);
         this.pop();
      }
      this.position++;
   },
   colorizeAppendFromMark:function(color)
   {
      var lines=this.getFromMark().htmlEncode().replace(/ /g,"&nbsp;").replace(/\t/g,this.parent.indentationString).split('\n');
      for (var i=0;i<lines.length;i++)
      {
         if (i>0)
            this.parent.appendMultilineSeparation(this);
         if (color)
            this.append("<span style=\"color:"+color+"\">");
         this.append(lines[i]);
         if (color)
            this.append("</span>");
      }
      this.mark();
   },
   addHighlights:function(colored,original)
   {
      if (this.highlight.text)
      {
         var index=original.indexOf(this.highlight.text);
         while (index>=0)
         {
            colored=this.insertHighlight(colored,index);
            index=original.indexOf(this.highlight.text,index+this.highlight.text.length);
         }
      }
      return colored;
   },
   getInsertIndex:function(colored,index)
   {
      var start=0;
      while (index>0 && start<colored.length)
      {
         var c=colored.charAt(start);
         if (c=="<")
         {
            if (colored.substr(start).startsWith("<br/>"))
               index+=2;
            start=colored.indexOf(">",start)+1;
         }
         else
            if (c=="\x10")
            {
               index--;
               start++;
            }
            else
            {
               if (c=="&")
                  start=colored.indexOf(";",start)+1;
               else
                  start++;
               index--;
            }
      }
      index=(index==0 ? start : -1);
      return index;
   },
   insertHighlight:function(colored,index)
   {
      var hStart=this.getInsertIndex(colored,index);
      if (hStart>=0 && hStart<colored.length)
      {
         var hEnd=this.getInsertIndex(colored,index+this.highlight.text.length);
         if (hEnd>=hStart && hEnd<=colored.length)
         {
            colored=colored.substr(0,hStart)+this.insertHighlightSpans(colored.substr(hStart,hEnd-hStart))+colored.substr(hEnd);
            this.highlight.count++;
         }
      }
      return colored;
   },
   insertHighlightSpans:function(colored)
   {
      var parts=colored.split("<");
      colored="";
      var count=0;
      for (var i=0;i<parts.length;i++)
      {
         var part=parts[i];
         if (i>0)
         {
            colored+="<";
            var c=part.indexOf(">")+1;
            colored+=part.substr(0,c);
            part=part.substr(c);
         }
         if (part.length>0)
            colored+="<span id=\""+(this.highlight.name ? this.highlight.name.htmlEncode()+"_"+this.highlight.count+"_"+(count++) : "")+"\" "+(this.highlight.color ? "style=\"background-color:"+this.highlight.color.htmlEncode()+"\"" : "")+">"+part+"</span>";
      }
      return colored;
   },
   setHighlightColorAtIndex:function(index,color,scrollIntoView,doc,ele)
   {
      if (!doc)
         doc=document;
      var rect=null;
      var e;
      for (var i=0;e=doc.getElementById(this.highlight.name+"_"+index+"_"+i);i++)
      {
         e.style.backgroundColor=color;
         if (scrollIntoView)
         {
            var r=Foundation.getElementRectangle(e);
            if (!rect)
               rect=r;
            else
            {
               if (r.x<rect.x)
               {
                  rect.width+=rect.x-r.x;
                  rect.x=r.x;
               }
               if (r.y<rect.y)
               {
                  rect.height+=rect.y-r.y;
                  rect.y=r.y;
               }
               if (r.x+r.width>rect.x+rect.width)
                  rect.width=r.x+r.width-rect.x;
               if (r.y+r.height>rect.y+rect.height)
                  rect.height=r.y+r.height-rect.y;
            }
         }
      }
      if (scrollIntoView && rect)
      {
         var scrollSize=20;
         var pad=20;
         if (!ele)
            ele=doc.body;
         if (rect.x+rect.width+pad>ele.scrollLeft+(ele.offsetWidth-scrollSize))
            ele.scrollLeft=rect.x+rect.width+pad-(ele.offsetWidth-scrollSize);
         if (rect.x-pad<ele.scrollLeft)
            ele.scrollLeft=rect.x-pad;
         if (rect.y+rect.height>ele.scrollTop+pad+(ele.offsetHeight-scrollSize))
            ele.scrollTop=rect.y+rect.height+pad-(ele.offsetHeight-scrollSize);
         if (rect.y-pad<ele.scrollTop)
            ele.scrollTop=rect.y-pad;
      }
   },
   setHighlightColorForAll:function(color,doc)
   {
      for (var i=0;i<this.highlight.count;i++)
         this.setHighlightColorAtIndex(i,color,false,doc);
   },
   dispose:function()
   {
   }
};
Foundation.Tools.ScriptFormatter.getSpaceString=function(size)
   {
      var s="";
      for (var i=0;i<size;i++)
         s+=" ";
      return s;
   };
Foundation.Tools.ScriptFormatter.process=function(script)
   {
      var parser=new this();
      return parser.process(script);
   };
Foundation.Tools.ScriptFormatter.getTypePath=Foundation.Class.getTypePath;
Foundation.Tools.ScriptFormatter.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.Tools.ScriptFormatter.$constructor();

}
if (!Foundation.exists("Foundation.Tools.SimpleProfiler")){
Foundation.Tools.SimpleProfiler=function(resourcePack)
{
   Foundation.Profiler.apply(this,arguments);
      Foundation.Elemental.call(this);
      Foundation.Resourceful.call(this);
   this.resourcePack=resourcePack ? resourcePack : {};
   this.useMaxAge=this.resource("useMaxAge");
   this.maxAge=this.resource("maxAge");
   this.useInterest=this.resource("useInterest");
   this.addInterest(this.resource("interest"));
   this.addClasses(this.resource("classes"));
   this.activationKey=this.resource("activationKey");
   this.useActivationKey=this.resource("useActivationKey");
   this.liveUpdates=this.resource("liveUpdates");
   this.enabled=this.resource("enabled");
   this.popupLeft=this.resource("popupLeft");
   this.popupTop=this.resource("popupLeft");
   this.popupWidth=this.resource("popupWidth");
   this.popupHeight=this.resource("popupHeight");
   this.onAfterUpdate=this.resource("onAfterUpdate");
   if (!this.activationKey)
      this.useActivationKey=false;
   this.paused=this.useActivationKey;
   this.redrawTrace=false;
   this.reportWindow=null;
   this.filterMethodsValue="";
   this.activeFilterIndex=-1;
   this.filterIndeces=new Array();
   this.attachEvent(document,"onkeydown","onKeyDown(event)");
   this.attachEvent(document,"onkeyup","onKeyUp(event)");
};
Foundation.Tools.SimpleProfiler.$parentClass=Foundation.Profiler;
if (!Foundation.Profiler.$childClasses) Foundation.Profiler.$childClasses=new Array();
Foundation.Profiler.$childClasses.push(Foundation.Tools.SimpleProfiler);
Foundation.Tools.SimpleProfiler.$constructor=function()
   {
   if (Foundation.Profiler.$constructor)
      Foundation.Profiler.$constructor.apply(this,arguments);
      this.prototype.getBarWidth=document.all ? this.prototype.getBarWidth_IE : this.prototype.getBarWidth_FirefoxSux;
      this.mabyeLoadScriptFormatter();
   };
Foundation.Tools.SimpleProfiler.$interfaces=new Array();
Foundation.Tools.SimpleProfiler.$interfaces.push(Foundation.Elemental);
if (!Foundation.Elemental.$childClasses) Foundation.Elemental.$childClasses=new Array();
Foundation.Elemental.$childClasses.push(Foundation.Tools.SimpleProfiler);
Foundation.Tools.SimpleProfiler.$interfaces.push(Foundation.Resourceful);
if (!Foundation.Resourceful.$childClasses) Foundation.Resourceful.$childClasses=new Array();
Foundation.Resourceful.$childClasses.push(Foundation.Tools.SimpleProfiler);
Foundation.Tools.SimpleProfiler.$name="SimpleProfiler";
Foundation.Tools.SimpleProfiler.$childClasses=new Array();
Foundation.Tools.SimpleProfiler.$container=Foundation.Tools;
Foundation.Tools.SimpleProfiler.prototype={
   constructor:Foundation.Tools.SimpleProfiler,
   onKeyDown:function(event)
   {
      if (this.isActivationKey(event,true))
      {
         this.blurControls();
         this.paused=false;
      }
   },
   onKeyUp:function(event)
   {
      if (this.isActivationKey(event,false))
      {
         this.paused=true;
         if (!this.timerHandle && !this.liveUpdates)
            this.maybeUpdate(true);
      }
   },
   isActivationKey:function(event,mustMatchMasks)
   {
      return (this.useActivationKey &&
              this.activationKey &&
              event &&
              event.keyCode==this.activationKey.keyCode &&
              (!mustMatchMasks ||
               ((this.activationKey.ctrlKey ? event.ctrlKey : true) &&
                (this.activationKey.altKey ? event.altKey : true) &&
                (this.activationKey.shiftKey ? event.shiftKey : true))));
   },
   getHtml:function()
   {
      this.activeTab="Summary";
      return this.resource("profilerWindowHtml"
                          ,'unload',this.event("onDisplayWindowClose()")
                          ,'controls',this.getControlsHtml()
                          ,'hand',Foundation.CURSOR.HAND
                          ,'showBound',this.event("showBound()")
                          ,'showSummary',this.event("showSummary()")
                          ,'showTrace',this.event("showTrace()")
                          ,'copyMethod',this.event("copyMethod()")
                          ,'closeMethod',this.event("closeMethod()")
                          ,'findPrevInMethod',this.event("findPrevInMethod()")
                           ,'findNextInMethod',this.event("findNextInMethod()")
                          );
   },
   getControlsHtml:function()
   {
      var html="";
      html+="<div id=\"newClassesPrompts\" style=\"position:absolute;z-index:10000;display:none;width:300;background-color:#ffffff;border:3px solid #00000;padding:2px\">";
      html+="<table width=\"100%\" cellspacing=0 cellpadding=0 style=\"font:10px arial;\">";
      html+="<tr><td colspan=2 nowrap>Enter new classes to profile:<br><textarea id=\"newClassesList\" rows=5 wrap=off style=\"width:100%;font:10px arial\"></textarea></td></tr>";
      html+="<tr>";
      html+="<td align=center width=\"50%\"><input type=submit class=\"addClasses\" value=\"Add\" onclick=\"return window.opener."+this.event("newClassesAddClicked()")+"\"></td>";
      html+="<td align=center width=\"50%\"><input type=reset class=\"addClasses\" value=\"Cancel\" onclick=\"return window.opener."+this.event("newClassesCancelClicked()")+"\"></td>";
      html+="</tr>";
      html+="</table>";
      html+="</div>";
      html+="<table cellspacing=0 cellpadding=0 style=\"font:10px arial;\"><tr>";
      html+="<td nowrap><input type=checkbox id=\"enabled\" "+(this.enabled ? "checked" : "")+" onchange=\"window.opener."+this.event("settingsChanged()")+"\"><label for=\"enabled\">Classes:</label></td>";
      html+="<td nowrap><input type=text id=\"classList\" readonly value=\""+this.classes.join(", ").htmlEncode()+"\" style=\"font:10px arial\" size=30 onclick=\"window.opener."+this.event("promptForNewClasses()")+"\"></td>";
      html+="<td nowrap style=\"padding-left:10px\"><input type=checkbox id=\"useActivationKey\" "+(this.useActivationKey ? "checked" : "")+" onchange=\"window.opener."+this.event("settingsChanged()")+"\"><label for=\"useActivationKey\">Activation&nbsp;Key:</label></td>";
      html+="<td nowrap><input type=text id=\"activationKey\" value=\""+this.activationKeyString().htmlEncode()+"\" style=\"font:10px arial;width:40px\" onkeydown=\"return window.opener."+this.event("activationOnKeyDown(event)")+"\" onkeyup=\"return false;\" onkeypress=\"return false;\"></td>";
      html+="</tr><tr>";
      html+="<td nowrap><input type=checkbox id=\"useInterest\" "+(this.useInterest ? "checked" : "")+" onchange=\"window.opener."+this.event("settingsChanged()")+"\"><label for=\"useInterest\">Interest:</label></td>";
      html+="<td nowrap><input type=text id=\"interest\" value=\""+this.interest.join(", ").htmlEncode()+"\" style=\"font:10px arial\" size=30 onchange=\"window.opener."+this.event("settingsChanged()")+"\"></td>";
      html+="<td nowrap style=\"padding-left:10px\"><input type=checkbox id=\"useMaxAge\" "+(this.useMaxAge ? "checked" : "")+" onchange=\"window.opener."+this.event("settingsChanged()")+"\"><label for=\"useMaxAge\">Max.&nbsp;Age&nbsp;(ms):</label></td>";
      html+="<td nowrap><input type=text id=\"maxAge\" value=\""+this.maxAge.toString().htmlEncode()+"\" style=\"font:10px arial;width:40px\" onchange=\"window.opener."+this.event("settingsChanged()")+"\"></td>";
      html+="</tr></table>";
      //html+="<input type=checkbox id=\"liveUpdates\" "+(this.liveUpdates ? "checked" : "")+"><label for=\"liveUpdates\">Live&nbsp;Updates</label> ";
      return html;
   },
   activationKeyString:function()
   {
      if (!this.activationKey)
         return "";
      var mods="";
      if (this.activationKey.ctrlKey &&
          this.activationKey.keyCode!=Foundation.KEY_CODE.CRTL)
         mods+="Ctrl+";
      if (this.activationKey.altKey &&
          this.activationKey.keyCode!=18)
         mods+="Alt+";
      if (this.activationKey.shiftKey &&
          this.activationKey.keyCode!=16)
         mods+="Shift+";
      for (var i in Foundation.KEY_CODE)
         if (Foundation.KEY_CODE[i]==this.activationKey.keyCode)
            return mods+i;
      return mods+"#"+this.activationKey.keyCode;
   },
   activationOnKeyDown:function(event)
   {
      this.activationKey={keyCode:event.keyCode,ctrlKey:event.ctrlKey,altKey:event.altKey,shiftKey:event.shiftKey};
      var e=this.getReportWindowElement("activationKey");
      if (e)
         e.value=this.activationKeyString();
      return false;
   },
   promptForNewClasses:function()
   {
      var l=this.getReportWindowElement("newClassesList");
      if (l)
         l.value="";
      var e=this.getReportWindowElement("newClassesPrompts");
      if (e)
      {
         e.style.display="";
         if (l)
            l.focus();
      }
   },
   newClassesAddClicked:function()
   {
      var e=this.getReportWindowElement("newClassesPrompts");
      if (e)
         e.style.display="none";
      var l=this.getReportWindowElement("newClassesList");
      if (l)
      {
         this.maybeAddNewClasses(l.value);
         l.value="";
      }
      return false;
   },
   newClassesCancelClicked:function()
   {
      var e=this.getReportWindowElement("newClassesPrompts");
      if (e)
         e.style.display="none";
      return false;
   },
   maybeAddNewClasses:function(newClasses)
   {
      if (newClasses && newClasses.trim().length>0)
      {
         this.addClasses(newClasses.replace(/[\s,;\|]+/g," ").split(" "));
         var e=this.getReportWindowElement("classList");
         if (e)
            e.value=this.classes.join(", ");
         this.showBound();
      }
   },
   settingsChanged:function()
   {
      var e;
      this.enabled=this.getReportWindowElement("enabled").checked;
      this.useActivationKey=this.getReportWindowElement("useActivationKey").checked;
      this.useInterest=this.getReportWindowElement("useInterest").checked;
      this.setInterest(this.getReportWindowElement("interest").value.replace(/,/g," ").split(" "));
      this.getReportWindowElement("interest").value=this.interest.join(", ");
      this.useMaxAge=this.getReportWindowElement("useMaxAge").checked;
      var ma=parseInt(this.getReportWindowElement("maxAge").value);
      if (isNaN(ma) || ma<0)
         this.getReportWindowElement("maxAge").value=this.maxAge;
      else
         this.maxAge=ma;
   },
   blurControls:function()
   {
      if (this.reportWindow && !this.reportWindow.closed && this.reportWindow.document)
      {
         var e;
         if (e=this.getReportWindowElement("enabled")) e.blur();
         if (e=this.getReportWindowElement("useActivationKey")) e.blur();
         if (e=this.getReportWindowElement("useInterest")) e.blur();
         if (e=this.getReportWindowElement("interest")) e.blur();
         if (e=this.getReportWindowElement("useMaxAge")) e.blur();
         if (e=this.getReportWindowElement("maxAge")) e.blur();
      }
   },
   getWindowRectangle:function()
   {
      if (this.reportWindow && !this.reportWindow.closed)
         return {left:document.all ? this.reportWindow.screenLeft : this.reportWindow.screenX,top:document.all ? this.reportWindow.screenTop : this.reportWindow.screenY,width:this.reportWindow.document.body.offsetWidth,height:this.reportWindow.document.body.offsetHeight};
      return null;
   },
   getPopupRectangle:function()
   {
      return {left:this.popupLeft==null ? window.screenLeft-this.popupWidth-10 : this.popupLeft
             ,top:this.popupTop==null ? window.screenTop : this.popupTop
             ,width:this.popupWidth
             ,height:this.popupHeight
             };
   },
   show:function()
   {
      var r=this.getPopupRectangle();
      if (!this.reportWindow || this.reportWindow.closed)
         this.reportWindow=window.open("javascript:window.opener."+this.event("getHtml()"),"_blank",this.resource("popupFeatures",'l',r.left,'t',r.top,'w',r.width,'h',r.height));
      if (this.reportWindow)
      {
         window.focus();
         this.attachEvent(window,"onunload","onParentWindowClose();");
         this.attachEvent(this.reportWindow.document,"onkeydown","onKeyDown(event)");
         this.attachEvent(this.reportWindow.document,"onkeyup","onKeyUp(event)");
         this.hidePopupBlockedBox(true);
         try
         {
            if (document.all)
            {
               if (this.reportWindow.screenLeft!=r.left ||
                   this.reportWindow.screenTop!=r.top)
                  this.reportWindow.moveBy(r.left-this.reportWindow.screenLeft,r.top-this.reportWindow.screenTop);
            }
            else
            {
               if (this.reportWindow.screenX!=r.left ||
                   this.reportWindow.screenY!=r.top)
                  this.reportWindow.moveBy(r.left-this.reportWindow.screenX,r.top-this.reportWindow.screenY);
            }
            if (this.reportWindow.document.body.offsetWidth!=r.width ||
                this.reportWindow.document.body.offsetHeight!=r.height)
               this.reportWindow.resizeBy(r.width-this.reportWindow.document.body.offsetWidth,r.height-this.reportWindow.document.body.offsetHeight);
         }
         catch(e){}
         this.showBound();
         if (this.onAfterUpdate)
            this.onAfterUpdate(this,false);
      }
      else
         this.showPopupBlockedBox();
      return this.reportWindow;
   },
   getReportWindowDocument:function()
   {
      return (this.reportWindow && !this.reportWindow.closed && this.reportWindow.document ? this.reportWindow.document : null);
   },
   getReportWindowElement:function(id)
   {
      var doc=this.getReportWindowDocument();
      return (doc ? doc.getElementById(id) : null);
   },
   showTab:function(frontId)
   {
      this.clearMethod();
      var t=["Summary","Trace","Bound","Method"];
      if (frontId!="Method")
         this.activeTab=frontId;
      var e;
      for (var i=0;i<t.length;i++)
         if (t[i]!=frontId)
         {
            if (e=this.getReportWindowElement(t[i]+"Tab"))
               e.className="backTab";
            if (e=this.getReportWindowElement(t[i]+"Container"))
               e.className="backTab";
         }
      if (e=this.getReportWindowElement(frontId+"Tab"))
         e.className="frontTab";
      if (e=this.getReportWindowElement(frontId+"Container"))
      {
         e.className="frontTab";
         return true;
      }
      return false;
   },
   showBound:function()
   {
      if (this.showTab("Bound"))
         this.setBoundMethodsContents(this.getBoundMethodsReportHtml());
   },
   showSummary:function(showBoundList)
   {
      return this.showTab("Summary");
   },
   showTrace:function()
   {
      var v;
      if ((v=this.showTab("Trace")) &&
          this.redrawTrace)
      {
         this.setTraceContents(this.getTraceReportHtml());
         this.redrawTrace=false;
      }
      return v;
   },
   clearMethod:function(path)
   {
      var e;
      if (e=this.getReportWindowElement("methodName"))
         e.innerHTML="";
      if (e=this.getReportWindowElement("codeArea"))
      {
         e.style.width=10;e.style.width=10;
         e.value="";
      }
   },
   createTitleHighlights:function(code,original,summary)
   {
      if (this.titleHighlighter ||
          (this.titleHighlighter=this.getScriptFormatter()))
      {
         this.titleHighlighter.highlight.name=summary ? null : "highlightTitle";
         this.titleHighlighter.highlight.color=summary ? "#ffff00" : null;
         this.titleHighlighter.highlight.text=this.filterMethodsValue;
         code=this.titleHighlighter.addHighlights(code,original);
      }
      return code;
   },
   formatCode:function(code)
   {
      code.replace(/\r\n/g,'\n');
      if (this.bodyFormatter ||
          (this.bodyFormatter=this.getScriptFormatter()))
      {
         this.bodyFormatter.highlight.name="highlightBody";
         this.bodyFormatter.highlight.color=null;
         this.bodyFormatter.highlight.text=this.filterMethodsValue;
         code=this.bodyFormatter.process(code);
      }
      else
         code=code.htmlEncode().replace(/\n/g,"<br>").replace(/ /g,"&nbsp;").replace(/\t/g,"&nbsp;&nbsp;&nbsp;");
      return code;
   },
   showActiveHighlight:function()
   {
      var doc=this.getReportWindowDocument();
      if (doc)
      {
         if (this.titleHighlighter)
            this.titleHighlighter.setHighlightColorForAll("",doc);
         if (this.bodyFormatter)
            this.bodyFormatter.setHighlightColorForAll("",doc);
         if (this.activeFilterIndex>=0 &&
             this.activeFilterIndex<this.filterIndeces.length)
         {
            var index=this.filterIndeces[this.activeFilterIndex].h;
            if (index==-1)
               this.titleHighlighter.setHighlightColorAtIndex(this.titleHighlighter.highlight.count-1,"#ffff00",true,doc);
            else
               if (index>=0)
                  this.bodyFormatter.setHighlightColorAtIndex(index,"#ffff00",true,doc,this.getReportWindowElement("codeScroller"));
         }
      }
   },
   constrainActiveSelectionHighlightIndex:function(name)
   {
      if (this.activeFilterIndex<0 ||
          this.activeFilterIndex>=this.filterIndeces.length ||
          this.filterIndeces[this.activeFilterIndex].n!=name)
      {
         this.activeFilterIndex=-1;
         for (var i=0;i<this.filterIndeces.length;i++)
            if (this.filterIndeces[i].n==name)
            {
               this.activeFilterIndex=i;
               break;
            }
      }
      if (this.activeFilterIndex>=0 &&
          this.activeFilterIndex<this.filterIndeces.length)
         return this.filterIndeces[this.activeFilterIndex].h;
      return -2;
   },
   showHighlights:function(path)
   {
      if (hilite==-1)
         this.highlightAtIndex(this.getReportWindowElement("methodName"),0);
      else if (hilite>=0)
         this.highlightAtIndex(this.getReportWindowElement("codeArea"),hilite);
   },
   showMethod:function(path)
   {
      //this.oldScrollTop=this.reportWindow.document.body.scrollTop;
      if (this.showTab("Method"))
      {
         var codeAreaElement=this.getReportWindowElement("codeArea");
         var methodNameElement=this.getReportWindowElement("methodName");
         var codeScrollerElement=this.getReportWindowElement("codeScroller");

         codeAreaElement.innerHTML="";
         methodNameElement.innerHTML="";
         this.constrainActiveSelectionHighlightIndex(path);
         codeScrollerElement.scrollTop=codeScrollerElement.scrollLeft=0;
         methodNameElement.innerHTML=this.createTitleHighlights(this.getPathHtml(path,false,true).replace(/\r\n/g,"\n"),path);
         codeAreaElement.innerHTML=this.formatCode(Foundation.getGlobalObject(path).$method.toString());
         this.showActiveHighlight();
         this.updatePrevNextHighlightEnabled();
      }
   },
   copyMethod:function(revert)
   {
      var e=this.getReportWindowElement("copyMethod");
      if (revert)
         e.innerHTML="Copy";
      else
      {
         var c=this.getReportWindowElement("codeArea");
         var messageDelay;
         if (c.createTextRange)
         {
            c.createTextRange().execCommand("Copy");
            e.innerHTML="<b>Copied</b>";
            messageDelay=750;
         }
         else
         {
            c.select();
            e.innerHTML="<b>Firefox stinks. Hit CTRL-C.</b>";
            messageDelay=2000;
         }
         window.setTimeout(this.event("copyMethod(true)"),messageDelay);
      }
   },
   closeMethod:function()
   {
      this["show"+this.activeTab]();
      //this.reportWindow.document.body.scrollTop=this.oldScrollTop;
   },
   setTabContents:function(id,html)
   {
      var e=this.getReportWindowElement(id+"Container");
      if (e)
         e.innerHTML=html;
   },
   setBoundMethodsContents:function(html)
   {
      this.setTabContents("Bound",html);
   },
   setSummaryContents:function(html)
   {
      this.setTabContents("Summary",html);
   },
   setTraceContents:function(html)
   {
      this.setTabContents("Trace",html);
   },
   showPopupBlockedBox:function()
   {
      if (!this.getElement("popupBlockedBox"))
         if (document.body)
         {
            var html="";
            html+="<div id=\""+this.elementId("popupBlockedBox")+"\" style=\"position:absolute;top:"+(document.body.scrollTop+10)+";left:"+(document.body.scrollLeft+10)+";width:200;padding:5px;z-index:1000000;border:2px solid #000000;background-color:#ffffff;color:#000000;font:12px verdana;text-align:center\">";
            html+="The profiler popup window was blocked.<br>";
            html+="<input type=button value=\"Retry\" onclick=\""+this.event("show()")+"\">";
            html+="&nbsp;&nbsp;&nbsp;";
            html+="<input type=button value=\"Cancel\" onclick=\""+this.event("hidePopupBlockedBox(true)")+"\">";
            html+="</div>";
            document.body.appendChild(Foundation.createElement(html));
         }
         else
            window.setTimeout(this.event("showPopupBlockedBox()"),2000);
   },
   hidePopupBlockedBox:function(delay)
   {
      var e=this.getElement("popupBlockedBox");
      if (e)
         if (delay)
            window.setTimeout(this.event("hidePopupBlockedBox(false)"),1);
         else
            e.parentNode.removeChild(e);
   },
   onParentWindowClose:function()
   {
      if (this.reportWindow)
      {
         this.reportWindow.close();
         this.reportWindow=null;
      }
   },
   onDisplayWindowClose:function()
   {
      this.reportWindow=null;
      if (this.onAfterUpdate)
         this.onAfterUpdate(this,false);
   },
   getIndention:function(depth)
   {
      var indent="";
      while (indent.length<depth)
         indent+=" ";
      return indent;
   },
   getPathHtml:function(path,isInteresting,noLink)
   {
      var html="";
      if (arguments.length<2 || typeof(isInteresting)=="undefined" || isInteresting==null)
         isInteresting=this.isInterestingPath(path);
      if (!noLink)
         html+="<a class=\"methodContents\" href=\"#\" style=\"color:"+(isInteresting ? "#ff0000" : "#000000")+"\" onclick=\"window.opener."+this.event("showMethod('"+path.cEncode()+"')")+";return false;\">";
      path=path.split(".");
      var interesting=(path[path.length-2]=="prototype" ? path.length-3 : path.length-2);
      if (interesting>0)
      {
         html+="<span style=\"color:#888888\">";
         for (var i=0;i<interesting;i++)
            html+=path[i].htmlEncode()+".";
         html+="</span>";
      }
      if (interesting==0 && path[interesting]=="window")
         html+="<span style=\"color:#888888\">window.";
      else
      {
         html+="<b>";
         html+=path[interesting].htmlEncode();
         html+="</b><span style=\"color:#888888\">.";
      }
      if (interesting==path.length-3)
         html+="prototype.";
      html+="</span>";
      html+="<b>";
      html+=path[path.length-1].htmlEncode();
      html+="</b>";
      if (!noLink)
         html+="</a>";
      return html;
   },
   appendPathHtml:function(sb,path,isInteresting,noLink)
   {
      return sb.append(this.getPathHtml(path,isInteresting,noLink));
   },
   getBarWidth_IE:function(num,max,width)
   {
      return Math.round(100*num/max)+"%";
   },
   getBarWidth_FirefoxSux:function(num,max,width)
   {
      return Math.max(1,Math.round(width*num/max))+"";
   },
   getLastBarWidth:function(barId)
   {
      var e=this.getReportWindowElement(barId);
      if (e)
         return e.offsetWidth-4;
      return Math.round(this.reportWindow.document.body.offsetWidth*0.8);
   },
   getSpacerHtml:function(width,height)
   {
      return "<div style=\"width:"+width+";height:"+height+"\" style=\"font:1px arial\">&nbsp;</div>";
      return "<img width=\""+width+"\" height=\""+height+"\" style=\"visibility:hidden\"/>";
   },
   getSummaryExitStyle:function(num,color)
   {
      if (num==0)
         return "color:"+color;
      return "background-color:"+color+";color:#ffffff";
   },
   getSummaryReportHtml:function()
   {
      var sb=new Foundation.StringBuilder();
      var totals=this.getTotals();
      var largest=0;
      var most=0;
      var width=this.getLastBarWidth("summaryWidth");
      for (var i=0;i<totals.length;i++)
      {
         largest=Math.max(largest,totals[i].timeTotal);
         most=Math.max(most,totals[i].numCalls);
      }
      sb.append("<table cellspacing=0 cellpadding=0 border=1 style=\"font:10px verdana;background-color:#ffffff\">");
      sb.append("<tr><td class=\"legend\" colspan=7><b>Class</b>/<b>Method</b>&nbsp;(<span style=\"color:ff0000\">of&nbsp;interest</span>)&nbsp;| <span style=\"color:#00cc00\">Total&nbsp;time&nbsp;executing&nbsp;directly&nbsp;in&nbsp;method</span>&nbsp;| <span style=\"color:#888888\">Total&nbsp;time&nbsp;in&nbsp;method</span>&nbsp;| <span style=\"color:#0000cc\">Number&nbsp;of&nbsp;times&nbsp;invoked</span>&nbsp;| <span style=\"color:#cc0000\">Threw&nbsp;exception</span>&nbsp;| <span style=\"color:#aaaa00\">Caught&nbsp;lower&nbsp;exception</span></td></tr>");
      sb.append("<tr>");
      sb.append("<td id=\"summaryWidth\" style=\"background-color:#000000;font-size:4px\" width=\"100%\">&nbsp;</td>");
      sb.append("<td style=\"background-color:#00cc00;font-size:4px\">"+this.getSpacerHtml(30,5)+"</td>");
      sb.append("<td style=\"background-color:#888888;font-size:4px\">"+this.getSpacerHtml(30,5)+"</td>");
      sb.append("<td style=\"background-color:#0000cc;font-size:4px\">"+this.getSpacerHtml(30,5)+"</td>");
      sb.append("<td style=\"background-color:#cc0000;font-size:4px\">"+this.getSpacerHtml(20,5)+"</td>");
      sb.append("<td style=\"background-color:#aaaa00;font-size:4px\">"+this.getSpacerHtml(20,5)+"</td>");
      sb.append("</tr>");
      for (var i=0;i<totals.length;i++)
      {
         var t=totals[i];
         sb.append("<tr><td style=\"position:relative\">");
         //sb.append("<div style=\"position:absolute;z-index:1;font-size:1px;width:100%;\">");
         sb.append("<div style=\"border-right:2px solid #0000cc;position:absolute;z-index:9;height:12px;width:"+this.getBarWidth(t.numCalls,most,width)+"\">&nbsp;</div>");
         if (t.timeInHere>0)
            sb.append("<div style=\"background-color:#44ff44;position:absolute;z-index:8;height:12px;width:"+this.getBarWidth(t.timeInHere,largest,width)+"\">&nbsp;</div>");
         if (t.timeTotal>0)
            sb.append("<div style=\"background-color:#dddddd;position:absolute;z-index:7;height:12px;width:"+this.getBarWidth(t.timeTotal,largest,width)+"\">&nbsp;</div>");
         //sb.append("</div>");
         sb.append("<span style=\"position:relative;z-index:10;background-color:transparent\">");
         this.appendPathHtml(sb,t.path,t.interesting);
         sb.append("</span>");
         sb.append("</td><td align=right style=\"color:#00cc00\">");
         sb.append(t.timeInHere);
         sb.append("</td><td align=right style=\"color:#888888\">");
         sb.append(t.timeTotal);
         sb.append("</td><td align=right style=\"color:#0000cc\">");
         sb.append(t.numCalls);
         sb.append("</td><td align=right style=\""+this.getSummaryExitStyle(t.threwExceptions,"#cc0000")+"\">");
         sb.append(t.threwExceptions);
         sb.append("</td><td align=right style=\""+this.getSummaryExitStyle(t.caughtExceptions,"#aaaa00")+"\">");
         sb.append(t.caughtExceptions);
         sb.append("</td></tr>");
      }
      sb.append("</table>");
      return sb.toString();
   },
   getTraceExitStyle:function(exCaught,threwEx)
   {
      var style="";
      if (exCaught>0)
         style+="border-left:"+Math.min(exCaught*5,25)+"px solid #aaaa00;";
      if (threwEx)
         style+="background-color:#cc0000";
      else
         style+="background-color:#ffffff";
      return style;
   },
   getTraceExitBorder:function(threwEx)
   {
      if (threwEx)
         return "border-right:2px solid #cc0000";
      return "";
   },
   getTraceReportHtml:function()
   {
      var sb=new Foundation.StringBuilder();
      var width=this.getLastBarWidth("traceWidth");
      sb.append("<table cellspacing=0 cellpadding=0 border=1 style=\"font:10px verdana;background-color:#ffffff\">");
      sb.append("<tr><td class=\"legend\" colspan=5>Depth&nbsp;| <b>Class</b>/<b>Method</b>&nbsp;(<span style=\"color:ff0000\">of&nbsp;interest</span>)&nbsp;| <span style=\"color:#00cc00\">Time&nbsp;executing&nbsp;directly&nbsp;in&nbsp;method</span>&nbsp;| <span style=\"color:#888888\">Time&nbsp;in&nbsp;method</span>&nbsp;| <span style=\"color:#aaaa00\">Lower&nbsp;exception</span>&nbsp;| <span style=\"color:#cc0000\">Threw&nbsp;exception</span></td></tr>");
      sb.append("<tr>");
      sb.append("<td style=\"background-color:#ffffff;font-size:4px\">"+this.getSpacerHtml(20,5)+"</td>");
      sb.append("<td id=\"traceWidth\" style=\"background-color:#000000;font-size:4px\" width=\"100%\">&nbsp;</td>");
      sb.append("<td style=\"background-color:#00cc00;font-size:4px\">"+this.getSpacerHtml(30,5)+"</td>");
      sb.append("<td style=\"background-color:#888888;font-size:4px\">"+this.getSpacerHtml(30,5)+"</td>");
      sb.append("<td>");
      sb.append("<table cellspacing=0 cellpadding=0 border=0 style=\"position:absolute;font-size:4px\"><tr>");
      sb.append("<td style=\"background-color:#aaaa00;\">"+this.getSpacerHtml(15,5)+"</td>");
      sb.append("<td style=\"background-color:#cc0000;\">"+this.getSpacerHtml(15,5)+"</td>");
      sb.append("</tr></table>");
      sb.append(this.getSpacerHtml(30,5));
      sb.append("</td>");
      sb.append("</tr>");
      
      var c;
      var maxTimeSpan=1;
      for (var i=0;i<this.stack.length;i=c+1)
      {
         c=this.getExitIndex(i);
         maxTimeSpan=Math.max(maxTimeSpan,this.stack[c].stamp-this.stack[i].stamp+1);
      }
      var startTime;
      for (var i=0;i<this.stack.length;i++)
         if ((c=this.stack[i]).isEnter)
         {
            if (c.depth==0)
            {
               startTime=c.stamp;
               //maxTimeSpan=this.stack[i+c.size].stamp-startTime+1;
            }
            sb.append("<tr><td align=right "+(c.depth==0 ? "style=\"background-color:#000000;color:#ffffff\"" : "")+">");
            sb.append(c.depth);
            sb.append("</td><td style=\"position:relative\">");
            sb.append("<div style=\"position:absolute;z-index:1;font-size:1px;width:100%;\">");
            sb.append("<div style=\"background-color:#44ff44;position:absolute;z-index:1;height:12px;left:"+this.getBarWidth(c.stamp-startTime,maxTimeSpan,width)+";width:"+this.getBarWidth(c.times[0],maxTimeSpan,width)+";"+this.getTraceExitBorder(c.threwEx)+"\">&nbsp;</div>");
            var e=0;
            var exCaught=0;
            for (var j=3;j<c.times.length;j+=2)
            {
               e+=c.times[j-1];
               var cex=this.indexCaughtLowerExceptionAtIndex(i,(j-3)/2);
               if (cex)
                  exCaught++;
               if (c.times[j]>0 || cex)
                  sb.append("<div style=\"background-color:#dddddd;position:absolute;z-index:3;height:12px;left:"+this.getBarWidth(c.stamp+e-startTime,maxTimeSpan,width)+";width:"+this.getBarWidth(c.times[j],maxTimeSpan,width)+(cex ? ";border-right:2px solid #aaaa00" : "")+";\">&nbsp;</div>");
               e+=c.times[j];
            }
            sb.append("</div>");
            sb.append("<span style=\"position:relative;z-index:10;padding-left:"+(c.depth*10)+";background-color:transparent;\">");
            this.appendPathHtml(sb,c.path);
            sb.append("</span>");
            sb.append("</td><td align=right style=\"color:#00cc00\">");
            sb.append(c.times[1]);
            sb.append("</td><td align=right style=\"color:#888888\">");
            sb.append(c.times[0]);
            sb.append("</td><td align=right style=\""+this.getTraceExitStyle(exCaught,c.threwEx)+"\">");
            sb.append("&nbsp;");
            sb.append("</td></tr>");
         }
      sb.append("</table>");
      return sb.toString();
   },
   countFilterInMethodBody:function(path)
   {
      var count=0;
      var code=Foundation.getGlobalObject(path).$method.toString();
      var index=code.indexOf(this.filterMethodsValue);
      while (index>=0)
      {
         count++;
         index=code.indexOf(this.filterMethodsValue,index+this.filterMethodsValue.length);
      }
      return count;
   },
   getSortedBoundMethodsList:function()
   {
      var list=new Array();
      var uninteresting=/(\$|#|_)/g;
      var filtering=this.filterMethodsValue.length>0;
      for (var i=0;i<this.boundMethods.length;i++)
      {
         var filterTitleCount=0;
         var filterBodyCount=0;
         if (filtering)
         {
            filterTitleCount=(this.boundMethods[i].indexOf(this.filterMethodsValue)>0 ? 1 : 0);
            filterBodyCount=this.countFilterInMethodBody(this.boundMethods[i]);
            if (filterTitleCount==0 && filterBodyCount==0)
               continue;
         }
         list.push({name:this.boundMethods[i],sort:this.boundMethods[i].replace(/\.prototype\./," ").replace(uninteresting,"").toLowerCase(),filterTitleCount:filterTitleCount,filterBodyCount:filterBodyCount});
      }
      list.sort(function(a,b){return a.sort.localeCompare(b.sort);});
      return list;
   },
   getBoundMethodsReportHtml:function()
   {
      var sb=new Foundation.StringBuilder();
      sb.append(this.interest.join(","));
      sb.append("<table cellspacing=0 cellpadding=0 class=\"tabPanel\"><tr><td class=\"tabPanelFixed\">");
      sb.append("<table cellspacing=0 cellpadding=0 border=1 style=\"font:10px verdana;background-color:#ffffff\">");
      sb.append("<tr>");
      sb.append("<td class=\"legend\" width=\"100%\"><b>Class</b>/<b>Method</b>&nbsp;(<span style=\"color:ff0000\">of&nbsp;interest</span>)");
      var filtering=this.filterMethodsValue.length>0;
      if (filtering)
         sb.append("&nbsp;| <span style=\"color:aaaa00\">filter</span>");
      sb.append("</td>");
      sb.append("<td class=\"legend\" align=right><input type=text class=\"filter\" id=\"filterMethodsValue\" value=\""+this.filterMethodsValue.htmlEncode()+"\"><input type=submit class=\"filter\" value=\"Filter\" onclick=\"window.opener.setTimeout('"+this.event("filterMethods()")+"',0);return false;\"></td>");
      sb.append("</tr>");
      sb.append("<tr><td colspan=2 style=\"background-color:#000000;font-size:4px\">&nbsp;</td></tr>");
      sb.append("</table>");
      sb.append("</td></tr><tr><td class=\"tabPanelScroll\"><div class=\"tabPanelScroll\">");
      sb.append("<table cellspacing=0 cellpadding=0 border=1 style=\"font:10px verdana;width:100%\">");
      var boundMethods=this.getSortedBoundMethodsList();
      for (var i=0;i<boundMethods.length;i++)
      {
         sb.append("<tr style=\"background-color:"+(i%2==0 ? "#eeeeee" : "#ffffff")+"\"><td width=\"100%\">");
         var titleHtml=this.getPathHtml(boundMethods[i].name);
         if (filtering)
            titleHtml=this.createTitleHighlights(titleHtml,boundMethods[i].name,true);
         sb.append(titleHtml);
         sb.append("</td>");
         if (filtering)
            sb.append("<td align=right width=\"1%\" style=\"color:#aaaa00\">"+boundMethods[i].filterBodyCount+"</td>");
         sb.append("</tr>");
      }
      sb.append("</table>");
      sb.append("</div></td></tr></table>");
      this.filterIndeces.length=0;
      if (filtering)
         for (var i=0;i<boundMethods.length;i++)
         {
            if (boundMethods[i].filterTitleCount>0)
               this.filterIndeces.push({n:boundMethods[i].name,m:i,h:-1});
            for (var j=0;j<boundMethods[i].filterBodyCount;j++)
               this.filterIndeces.push({n:boundMethods[i].name,m:i,h:j});
         }
      else
         for (var i=0;i<boundMethods.length;i++)
            this.filterIndeces.push({n:boundMethods[i].name,m:i,h:-2});
      this.activeFilterIndex=-1;
      return sb.toString();
   },
   filterMethods:function()
   {
      this.filterMethodsValue=this.getReportWindowElement("filterMethodsValue").value;
      this.showBound();
   },
   updatePrevNextHighlightEnabled:function()
   {
      this.getReportWindowElement("findPrevInMethod").disabled=(this.activeFilterIndex<=0);
      this.getReportWindowElement("findNextInMethod").disabled=(this.activeFilterIndex>=this.filterIndeces.length-1);
   },
   findPrevInMethod:function()
   {
      if (this.activeFilterIndex>0)
      {
         var oldName=this.filterIndeces[this.activeFilterIndex].n;
         this.activeFilterIndex--;
         if (this.filterIndeces[this.activeFilterIndex].n!=oldName)
            this.showMethod(this.filterIndeces[this.activeFilterIndex].n);
         else
            this.showActiveHighlight();
         this.updatePrevNextHighlightEnabled();
      }
   },
   findNextInMethod:function()
   {
      if (this.activeFilterIndex<this.filterIndeces.length-1)
      {
         var oldName=this.filterIndeces[this.activeFilterIndex].n;
         this.activeFilterIndex++;
         if (this.filterIndeces[this.activeFilterIndex].n!=oldName)
            this.showMethod(this.filterIndeces[this.activeFilterIndex].n);
         else
            this.showActiveHighlight();
         this.updatePrevNextHighlightEnabled();
      }
   },
   update:function()
   {
      this.redrawTrace=true;
      this.setTraceContents("");
      if (this.showSummary())
         this.setSummaryContents(this.getSummaryReportHtml());
      if (this.onAfterUpdate)
         this.onAfterUpdate(this,true);
   },
   getScriptFormatter:function()
   {
      var formatterClass=Foundation.getGlobalObject(this.resource("scriptFormatterClass"));
      return formatterClass ? new formatterClass() : null;
   },
   dispose:function()
   {
      Foundation.Resourceful.prototype.dispose.call(this);
      Foundation.Elemental.prototype.dispose.call(this);
      if (Foundation.Profiler.prototype.dispose) Foundation.Profiler.prototype.dispose.call(this);
   },
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
   processHtml:Foundation.Elemental.prototype.processHtml,
   addClasses:Foundation.Profiler.prototype.addClasses,
   areMonitoringClass:Foundation.Profiler.prototype.areMonitoringClass,
   isBindableStatic:Foundation.Profiler.prototype.isBindableStatic,
   isBindableVirtual:Foundation.Profiler.prototype.isBindableVirtual,
   getWindowFunctionNames:Foundation.Profiler.prototype.getWindowFunctionNames,
   bindToClass:Foundation.Profiler.prototype.bindToClass,
   transferBoundInherited:Foundation.Profiler.prototype.transferBoundInherited,
   transferBoundInheritedByClass:Foundation.Profiler.prototype.transferBoundInheritedByClass,
   insertBoundInherited:Foundation.Profiler.prototype.insertBoundInherited,
   isBoundToMethod:Foundation.Profiler.prototype.isBoundToMethod,
   bindToMethod:Foundation.Profiler.prototype.bindToMethod,
   clearAll:Foundation.Profiler.prototype.clearAll,
   clearCall:Foundation.Profiler.prototype.clearCall,
   clearRange:Foundation.Profiler.prototype.clearRange,
   clearOld:Foundation.Profiler.prototype.clearOld,
   clearUninteresting:Foundation.Profiler.prototype.clearUninteresting,
   indexOfInteresting:Foundation.Profiler.prototype.indexOfInteresting,
   isInterestingAtIndex:Foundation.Profiler.prototype.isInterestingAtIndex,
   isInterestingPath:Foundation.Profiler.prototype.isInterestingPath,
   getSubCallFromIndexAndIndex:Foundation.Profiler.prototype.getSubCallFromIndexAndIndex,
   indexCaughtLowerExceptionAtIndex:Foundation.Profiler.prototype.indexCaughtLowerExceptionAtIndex,
   countSubcallExceptionsAtIndex:Foundation.Profiler.prototype.countSubcallExceptionsAtIndex,
   countRoots:Foundation.Profiler.prototype.countRoots,
   push:Foundation.Profiler.prototype.push,
   pop:Foundation.Profiler.prototype.pop,
   processStack:Foundation.Profiler.prototype.processStack,
   getInterestIndex:Foundation.Profiler.prototype.getInterestIndex,
   setInterest:Foundation.Profiler.prototype.setInterest,
   addInterest:Foundation.Profiler.prototype.addInterest,
   removeInterest:Foundation.Profiler.prototype.removeInterest,
   getInterestExpression:Foundation.Profiler.prototype.getInterestExpression,
   maybeUpdate:Foundation.Profiler.prototype.maybeUpdate,
   getExitIndex:Foundation.Profiler.prototype.getExitIndex,
   getTotals:Foundation.Profiler.prototype.getTotals,
   calculateTimes:Foundation.Profiler.prototype.calculateTimes
};
Foundation.Tools.SimpleProfiler.resourcePack={useMaxAge:true
                ,maxAge:5000
                ,useActivationKey:true
                ,activationKey:{keyCode:113
                               ,ctrlKey:false
                               ,altKey:false
                               ,shiftKey:false
                               }
                ,useInterest:true
                ,enabled:true
                ,popupWidth:600
                ,popupHeight:600
                ,popupFeatures:"left=%l,top=%t,width=%w,height=%h,channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no"
                ,profilerWindowHtml:"\x3Chtml\x3E\n\x3Chead\x3E\n\x3Ctitle\x3EFoundation\x2ESimpleProfiler\x3C/title\x3E\n\x3Cstyle\x3E\nbody {overflow:hidden;margin:0;background-color:#ccccff;font:12px verdana}\ntable {font:12px verdana}\nth.frontTab {width:80px;padding-left:10px;padding-right:10px;padding-top:5px;padding-bottom:3px;border-left:5px solid #ffffff;border-right:5px solid #ffffff;border-top:0;background-color:transparent;cursor:%hand;}\nth.backTab {width:80px;padding-left:10px;padding-right:10px;padding-top:5px;padding-bottom:3px;border-left:5px solid #ffffff;border-right:5px solid #ffffff;border-top:5px solid #ffffff;background-color:#ccccdd;cursor:%hand;}\ndiv.frontTab {width:100%;height:100%}\ndiv.backTab {width:100%;height:100%;display:none}\na.methodContents {text-decoration:none}\na.methodContents:hover {color:#0000CC;text-decoration:underline}\nspan.methodName {background-color:#eeeeff;padding:2px}\nlegend {text-align:right;background-color:#ffffff}\nlegend:first-line {text-align:right}\ndiv.scrollPanel {text-align:left;border:1px solid green;overflow:auto;width:100%;height:100%;margin-top:0px;margin-left:5px;margin-right:5px;margin-bottom:5px};\npre.codeArea {background-color:#ffffff;margin:0}\na.methodLink {color:#0000CC;text-decoration:none}\na.methodLink:hover {text-decoration:underline}\ninput.filter {font:10px arial;padding:0;margin:0;} \ninput.addClasses {font:10px arial;padding:0;margin:0;width:100}\ntable.tabPanel {width:100%;height:100%;margin:0;padding:0}\ntd.tabPanelFixed {}\ntd.tabPanelScroll {height:100%}\ndiv.tabPanelScroll {overflow:auto;width:100%;height:100%}\n\x3C/style\x3E\n\x3C/head\x3E\n\x3Cbody onunload=\"try{window.opener.%unload;}catch(e){}\"\x3E\n\x3Ctable cellspacing=0 cellpadding=0 border=0 width=\"100%\" style=\"height:100%;border-top:2px solid #ffffff\"\x3E\n\x3Ctr style=\"background-color:#ffffff;font:10px verdana\"\x3E\n\x3Ctd nowrap colspan=3 style=\"padding-left:5px;padding-bottom:2px\"\x3E\x3Ca href=\"http://FoundationDotJS.org/\" target=\"_blank\"\x3EFoundation\x2EProfiler\x3C/a\x3E version 1.1\x3Cbr\x3ECopyright &copy; 2010-2011 Scott Nesin\x3C/td\x3E\n\x3Ctd rowspan=2 nowrap\x3E%controls\x3C/td\x3E\n\x3C/tr\x3E\x3Ctr\x3E\n\x3Cth id=\"BoundTab\" class=\"frontTab\" valign=top onclick=\"window.opener.%showBound\"\x3ECode\x3C/th\x3E\n\x3Cth id=\"SummaryTab\" class=\"backTab\" valign=top onclick=\"window.opener.%showSummary\"\x3ESummary\x3C/th\x3E\n\x3Cth id=\"TraceTab\" class=\"backTab\" valign=top onclick=\"window.opener.%showTrace\"\x3ETrace\x3C/th\x3E\n\x3C/tr\x3E\n\x3Ctr\x3E\x3Ctd colspan=4 align=right valign=top style=\"height:100%;padding:5px\"\x3E\n\x3Cdiv id=\"BoundContainer\" class=\"frontTab\"\x3E&nbsp;\x3C/div\x3E\n\x3Cdiv id=\"MethodContainer\" class=\"backTab\"\x3E\n\x3Ctable class=\"tabPanel\" cellspacing=0 cellpadding=0 border=0\x3E\x3Ctr\x3E\x3Ctd class=\"tabPanelFixed\"\x3E\n\x3Ctable cellspacing=0 cellpadding=0 border=0 style=\"width:100%;margin-bottom:5px\"\x3E\x3Ctr\x3E\n\x3Ctd\x3E\x3Cspan id=\"methodName\" class=\"methodName\"\x3E\x3C/span\x3E\x3C/td\x3E\n\x3Ctd align=right\x3E\x3Ca id=\"copyMethod\" class=\"methodLink\" href=\"#\" onclick=\"window.opener.%copyMethod;return false;\"\x3ECopy\x3C/a\x3E&nbsp;|&nbsp;\x3Ca class=\"methodLink\" href=\"#\" onclick=\"window.opener.%closeMethod;return false;\"\x3EBack\x3C/a\x3E&nbsp;|&nbsp;\x3Ca id=\"findPrevInMethod\" class=\"methodLink\" href=\"#\" onclick=\"window.opener.%findPrevInMethod;return false;\"\x3EPrev\x3C/a\x3E&nbsp;|&nbsp;\x3Ca id=\"findNextInMethod\" class=\"methodLink\" href=\"#\" onclick=\"window.opener.%findNextInMethod;return false;\"\x3ENext\x3C/a\x3E\x3C/td\x3E\n\x3C/tr\x3E\x3C/table\x3E\n\x3C/td\x3E\x3C/tr\x3E\x3Ctr\x3E\x3Ctd class=\"tabPanelScroll\"\x3E\x3Cdiv id=\"codeScroller\" class=\"tabPanelScroll\" style=\"background-color:#eeeeff\"\x3E\n\x3Cpre id=\"codeArea\" class=\"codeArea\"\x3E\x3C/pre\x3E\n\x3C/div\x3E\x3C/td\x3E\x3C/tr\x3E\x3C/table\x3E\n\x3C/div\x3E\n\x3Cdiv id=\"SummaryContainer\" class=\"backTab\" style=\"overflow:auto\"\x3E&nbsp;\x3C/div\x3E\n\x3Cdiv id=\"TraceContainer\" class=\"backTab\" style=\"overflow:auto\"\x3E&nbsp;\x3C/div\x3E\n\x3C/td\x3E\x3C/tr\x3E\n\x3C/table\x3E\n\x3C/body\x3E\x3C/html\x3E\n"
                ,scriptFormatterClass:"Foundation.Tools.ScriptFormatter"
                };
Foundation.Tools.SimpleProfiler.profiler=null;
Foundation.Tools.SimpleProfiler.doInitialScriptCommands=true;
Foundation.Tools.SimpleProfiler.show=function(resourcePack,listOfClasses)
   {
      if (!this.profiler)
         this.profiler=new this(resourcePack);
      this.profiler.maybeAddNewClasses(listOfClasses);
      this.profiler.show();
      return this.profiler;
   };
Foundation.Tools.SimpleProfiler.checkForScriptCommands=function()
   {
      var script=Foundation.getClassScript(this,true);
      if (script)
      {
         var cn=script.className;
         script.className="";
         var rp=script.getAttribute("resourcePack");
         if (rp)
         {
            rp=rp.trim();
            if (rp.charAt(0)!="{")
               rp="{"+rp+"}";
            try
            {
               eval("rp="+rp);
            }
            catch(e)
            {
               rp=null;
            }
         }
         if (cn=="?")
            cn=null;
         this.show(rp,cn);
      }
   };
Foundation.Tools.SimpleProfiler.getScriptFormatterPath=function()
   {
      return "../ScriptFormatter/"+this.resource("scriptFormatterClass")+".js";
   };
Foundation.Tools.SimpleProfiler.mabyeLoadScriptFormatter=function()
   {
      if (!Foundation.exists(this.resource("scriptFormatterClass")))
         Foundation.loadScript(this.getScriptFormatterPath());
   };
Foundation.Tools.SimpleProfiler.getTypePath=Foundation.Profiler.getTypePath;
Foundation.Tools.SimpleProfiler.resource=Foundation.Resourceful.resource;
Foundation.Tools.SimpleProfiler.resourceUrl=Foundation.Resourceful.resourceUrl;
Foundation.Tools.SimpleProfiler.getById=Foundation.Elemental.getById;
Foundation.Tools.SimpleProfiler.getFirst=Foundation.Elemental.getFirst;
Foundation.Tools.SimpleProfiler.getNext=Foundation.Elemental.getNext;
Foundation.Tools.SimpleProfiler.processHtml=Foundation.Elemental.processHtml;
Foundation.Tools.SimpleProfiler.isInstanceOf=Foundation.Profiler.isInstanceOf;
Foundation.Tools.SimpleProfiler.profiler=Foundation.Profiler.profiler;
Foundation.Tools.SimpleProfiler.$constructor();

}
if (!Foundation.preprocessing)
   window.setTimeout("if(Foundation.Tools.SimpleProfiler.doInitialScriptCommands)Foundation.Tools.SimpleProfiler.checkForScriptCommands();",100);
