/*
GamesByEmail.TutorialGame
Copyright © 2007-2011 Scott Nesin, all rights reserved.
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
/*
Foundation.Tools.ScriptFormatter
Copyright © 2010-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Tools.ScriptFormatter.htm
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
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
if (!Foundation.exists("GamesByEmail.TutorialGame")){
GamesByEmail.TutorialGame=function()
{
   GamesByEmail.Game.apply(this,arguments);
   this.pieceClipper=null;
   this.diffControl=null;
   this.newPieceRects=new Array();
   this.activePieceRectIndex=-1;
   this.noteColor="#B22222";
};
GamesByEmail.TutorialGame.$parentClass=GamesByEmail.Game;
if (!GamesByEmail.Game.$childClasses) GamesByEmail.Game.$childClasses=new Array();
GamesByEmail.Game.$childClasses.push(GamesByEmail.TutorialGame);
GamesByEmail.TutorialGame.$constructor=GamesByEmail.Game.$constructor ? GamesByEmail.Game.$constructor : function(){};
GamesByEmail.TutorialGame.$interfaces=new Array();
GamesByEmail.TutorialGame.$name="TutorialGame";
GamesByEmail.TutorialGame.$childClasses=new Array();
GamesByEmail.TutorialGame.$container=GamesByEmail;
GamesByEmail.TutorialGame.prototype={
   constructor:GamesByEmail.TutorialGame,
   appendTutorialHeaderHtml:function(htmlBuilder)
   {
      //return htmlBuilder;
      var showBranding=true;
      //showBranding=false;
      htmlBuilder.append(this.resource("header"
                                      ,'showBranding',showBranding ? "" : "none"
                                      ,'previousStep',this.getButtonHtml("<","previousStep",this.event("moveStep(-1);"),null,"disabled=true style=\"font:15px bold verdana;width:30px\"")
                                      ,'nextStep',this.getButtonHtml(">","nextStep",this.event("moveStep(1);"),null,"disabled=true style=\"font:15px bold verdana;width:30px\"")
                                      ,'tutorialStepNum',this.elementId("tutorialStepNum")
                                      ,'currentStep',this.getCurrentTutorialStep(true)
                                      ));

      return htmlBuilder;
   },
   moveStep:function(direction)
   {
      this.tutorialStepOffset-=direction;
      this.update();
   },
   updateTutorialHeader:function()
   {
      var e;
      if (e=this.getElement("previousStep"))
         e.disabled=(this.tutorialStepOffset>=this.maxTutorialStep);
      if (e=this.getElement("nextStep"))
         e.disabled=(this.tutorialStepOffset<=0);
      if (e=this.getElement("tutorialStepNum"))
         e.innerHTML=this.getCurrentTutorialStep(true);
   },
   setTutotialStepTitle:function(title)
   {
      this.setInnerHtml("gameTitle","<span style=\"font-size:50%\">"+title.htmlEncode()+"</span>");
   },
   appendStepDownloadHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Welcome to GamesByEmail.com's Game Programmer's Tutorial");
      htmlBuilder.append("<p>To begin the tutorial, first copy the necessary files to your computer. The files are not executables, they are simply HTML, JavaScript and image files. This way you will be able to continue the tutorial offline.</p> ");
      htmlBuilder.append("<p>Please note, the foundation, tutorial and game code are for the sole purpose of learning to program for GamesByEmail. The files may not be hosted anywhere else or used for any other purpose.</p> ");
      htmlBuilder.append("<p><ol>");
      htmlBuilder.append("<li>Open <a href=\"Tutorial/GamesByEmail.zip?"+(new Date()).valueOf()+"\">GamesByEmail.zip</a> and extract the files somewhere on your computer.</li>");
      htmlBuilder.append("<li>Hopefully (depending on your extractor) a folder called "+"GamesByEmail".fileSystemNameHtml()+" was created. Go to that folder.</li>");
      htmlBuilder.append("<li>You should see a few "+"Foundation.js".fileSystemNameHtml()+" files, and a folder called "+"Games".fileSystemNameHtml()+". Go to the "+"Games".fileSystemNameHtml()+" folder.</li>");
      htmlBuilder.append("<li>You should see a few "+"GamesByEmail.js".fileSystemNameHtml()+" files, some "+".htm".fileSystemNameHtml()+" files, and a folder called "+"Tutorial".fileSystemNameHtml()+". Go to the "+"Tutorial".fileSystemNameHtml()+" folder.</li>");
      htmlBuilder.append("<li>In the "+"Tutorial".fileSystemNameHtml()+" folder, you should see a file called "+"Default.htm".fileSystemNameHtml()+". Open this file in a browser (you can close this window), and continue this tutorial from there.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      return htmlBuilder;
   },
   updateClassName:function(name)
   {
      name=name.trim();
      var words=name.replace(/\W+/g," ").toLowerCase().split(" ");
      var folder="";
      for (var i=0;i<words.length;i++)
         folder+=words[i].substr(0,1).toUpperCase()+words[i].substr(1);
      this.getElement("folderName1").value=folder;
      this.getElement("folderName2").innerHTML=folder.htmlEncode();
      this.getElement("folderName3").innerHTML=folder.htmlEncode();
      this.getElement("folderName4").innerHTML=(folder+"/Default.htm").htmlEncode();
      this.getElement("linkToNewGame").href=folder.htmlEncode()+"/Default.htm";
      this.getElement("game.js").value=this.resource('initialCode',
                                                     'f',folder,
                                                     't',(folder=="TicTacToe" ? "24" : "-1 /"+"* Temporary Id *"+"/"),
                                                     'n',name);
   },
   appendCreateGameFolderAndFilesHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Name your game");
      htmlBuilder.append("<p>The next step will be to decide the name of your game, and to create a new folder for it in the "+"Games".fileSystemNameHtml()+" folder and seed that with some files.");
      htmlBuilder.append("<p><font color=\""+this.noteColor+"\">If this is the first time through the tutorial, take the default values for all fields and build the Tic-Tac-Toe game.</font> You can start the tutorial again later to build your own game.");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Choose the name of your game and enter it here:"+this.getTextHtml("Tic-Tac-Toe",null,"onkeyup=\""+this.event("updateClassName(this.value)")+"\"")+".</li>");
      htmlBuilder.append("<li>In the "+"Games".fileSystemNameHtml()+" folder, create a new folder called "+"TicTacToe".copyAndPaste(false,this.elementId("folderName1"))+". <font color=\""+this.noteColor+"\">Note that the folder name has no spaces and is in UpperCamelCase.</font> Go to that folder.</li>");
      htmlBuilder.append("<li>In the new "+"TicTacToe".fileSystemNameHtml(this.elementId("folderName2"))+" folder, create a new text file called "+"Default.htm".copyAndPaste()+".</li>");
      htmlBuilder.append("<li>Edit the new "+"Default.htm".fileSystemNameHtml()+" file with your favorite code editor (Notepad?). Copy the following code and paste it into the file, then save and close the file:"+this.resource("default_htm").newCodeHtml(this.elementId("default.htm"))+"</li>");
      htmlBuilder.append("<li>In the new "+"TicTacToe".fileSystemNameHtml(this.elementId("folderName3"))+" folder, create a new text file called "+"Game.js".copyAndPaste()+".</li>");
      htmlBuilder.append("<li>Edit the new "+"Game.js".fileSystemNameHtml()+" file with your favorite code editor. Copy the following code and paste it into the file, then save the file (but keep it open):"+this.resource('initialCode','f',"TicTacToe",'t',"24",'n',"Tic-Tac-Toe").newCodeHtml(this.elementId("game.js"))+"</li>");
      htmlBuilder.append("<li>Open the new <a id=\""+this.elementId("linkToNewGame")+"\" href=\"TicTacToe/Default.htm\">"+"TicTacToe/Default.htm".fileSystemNameHtml(this.elementId("folderName4"))+"</a> in your browser and continue this tutorial from there.<br><font color=\""+this.noteColor+"\">If the game does not render, most likely it is because you are hiding file extensions for known types.</font><br>To fix, choose &quot;<b>Tools-&gt;Folder Options</b>&quot; from the Windows Explorer menu, click the &quot;<b>View</b>&quot; tab, uncheck &quot;<b>Hide extensions for known file types</b>&quot;, click <b>OK</b>, then rename the files, removing the .txt extension.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      return htmlBuilder;
   },
   appendCreateBoardImageHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Create a board image");
      htmlBuilder.append("<p>Now you need a board image for your game. Here are a few soft targets to use when designing a board:");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>Draw your own images. Do not abuse anyone else's copyrights.</li>");
      htmlBuilder.append("<li>Microsoft Paint works great. Play with the backgound color and the <nobr>&quot;Image-&gt;Draw&nbsp;Opaque&quot;</nobr> toggle on the menu bar when selecting a region and moving it, or pasting.</li>");
      htmlBuilder.append("<li>Keep them very simple at first.</li>");
      htmlBuilder.append("<li>The "+"GIF".fileSystemNameHtml()+" format works very well.</li>");
      htmlBuilder.append("<li>A 256x256 pixel board is a good size but that is as small as you want to go.\n"+
"                           A board that is 400 wide is perfectly fine. The main"+
"                           focus is to not make them larger than they have to be. Try"+
"                           to strike a balance between asthetics/playability and stealth: You do not want a"+
"                           board so fancy that it takes up a whole screen and gets somebody"+
"                           busted at work. Sometimes it is unavoidable, and you have a game like"+
"                           <a target=\"_blank\" href=\"http://GamesByEmail.com/Games/WW2#Preview\">W.W.II</a> "+
"                           that is 946x554. So if you have some cool images that make up a"+
"                           350x350 board, that is OK, but make necessity the driving force.</li>");
      htmlBuilder.append("<li>When you have a board with squares or hexagons, make your squares an odd number of pixels across and high. It just makes things easier.</li>");
      htmlBuilder.append("<li>There are lots of color blind people out there, so high contrast is good.</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("<p>First, you need a place to put the images. It is best to keep them separate from the code. "+
"                           You may have more than one board image, perhaps depending on language or preference."+
"                           GamesByEmail's standard is to create a "+"Boards/Default/".fileSystemNameHtml()+" folder structure under the game folder."+
"                           With that in mind:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>In the "+this.resource("gameFolder").fileSystemNameHtml()+" folder, create folder called "+"Boards".copyAndPaste()+".</li>");
      htmlBuilder.append("<li>In the "+"Boards".fileSystemNameHtml()+" folder,create folder called "+"Default".copyAndPaste()+".</li>");
      htmlBuilder.append("</ol></p>");
      htmlBuilder.append("<p>Now, create your board image, call it "+"Board.gif".copyAndPaste()+",and save it to the "+"Boards/Default".fileSystemNameHtml()+" folder you just created.");
      if (this.type==24)
      {
         htmlBuilder.append("<br>For Tic-Tac-Toe, here is a board image you can use. Note that each square, including the square's thick black and thin white border, is an odd 85x85 pixels in size.");
         htmlBuilder.append("<br><img src=\"Tutorial/Boards/Default/Board.gif\" width=255 height=255 galleryimg=false><br>");
         htmlBuilder.append("To use this image, right click on the image above, choose \"Save Picture As\", and save it to the "+"Boards/Default".fileSystemNameHtml()+" folder you just created, naming it "+"Board.gif".fileSystemNameHtml()+".");
      }
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>"+this.getButtonHtml("Click here","testImageButton",this.event("testForImage('Board',0);",true))+" after you have saved your board image.");
      htmlBuilder.append("</p>");
   },
   checkForImage:function(iType)
   {
      return (this.getElement("testImage"+iType).offsetWidth>=100);
   },
   testForImage:function(iType,tryNum)
   {
      if (this.checkForImage(iType))
      {
         if (this.tutorialStepOffset==0)
            this.maxTutorialStep++;
         else
            this.tutorialStepOffset--;
         this.update();
         document.body.scrollTop=0;
      }
      else
         if (tryNum>5)
         {
            alert("The image did not load. Double check that you saved the file as\n\n"+this.resource("gameFolder")+"\\Boards\\Default\\"+iType+".gif");
            this.getElement("testImageButton").value="Click here";
            this.getElement("testImageButton").disabled=false;
         }
         else
         {
            if (tryNum==0)
            {
               this.getElement("testImageButton").value="Checking...";
               this.getElement("testImage"+iType).src=this.getImageSrc(iType+".gif?"+(new Date()).valueOf());
            }
            window.setTimeout(this.event("testForImage('"+iType+"',"+(tryNum+1)+");"),500);
         }
   },
   appendCreateBoardResourceHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Save the board image information");
      var b=this.getElement("testImageBoard");
      var width=b.offsetWidth;
      var height=b.offsetHeight;
      htmlBuilder.append("<p>The file name, image size, and other information must be saved to the game code. That is done by adding a new 'resource' to the "+"resourcePack".codeNameHtml()+". ");
      htmlBuilder.append("The resource will be called "+"board".codeNameHtml()+" and have the following properties: ");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>"+"image".codeNameHtml()+": Has two sub-properties:");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>"+"src".codeNameHtml()+": The path and name of the file, relative from the "+"Default".fileSystemNameHtml()+" folder. We specify "+"Board.gif".codeNameHtml()+"</li>");
      htmlBuilder.append("<li>"+"size".codeNameHtml()+": The size of the board image in pixels. The image is "+width+" pixels wide by "+height+" pixels tall, so we specify "+(width+","+height).codeNameHtml()+".</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("<li>"+"border".codeNameHtml()+": Any extra border along the image's left and top edges. There are no borders around the entire board in the Tic-Tac-Toe board image so we specify "+"0,0".codeNameHtml()+".</li>");
      htmlBuilder.append("<li>"+"squareSize".codeNameHtml()+": The number of pixels each square is on the board. In the Tic-Tac-Toe board image, the squares are 85 pixels wide and 85 pixels tall, so we specify "+"85,85".codeNameHtml()+".</li>");
      htmlBuilder.append("<li>"+"size".codeNameHtml()+": The number of squares that make up the board. In Tic-Tac-Toe, the board is 3 squares wide by 3 squares tall, so we specify "+"3,3".codeNameHtml()+".</li>");
      htmlBuilder.append("<li>"+"pieceImage".codeNameHtml()+": The path and name of our piece image, to be filled in later.</li>");
      htmlBuilder.append("<li>"+"pieceRects".codeNameHtml()+": The clipping rectangles for our pieces, to be filled in later.</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("The game class will use this information when creating its HTML. To add the information to the "+"resourcePack".codeNameHtml()+":");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append(("      theVeryLastResource:\"\" // Insert new resources above here.").existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeAbove")+" it:");
      htmlBuilder.append(("      board:{  // Various information about our game board.\n"+
"             image:{  // Information about the board image.\n"+
"                    src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n"+
"                    size:new Foundation.Point(255,255)  // The width and height of the board image, in pixels.\n"+
"                   },\n"+
"             border:new Foundation.Point(0,0),  // The size of any left and top border going around the board, in pixels.\n"+
"             squareSize:new Foundation.Point(85,85),  // The width and height of each square in the board image, in pixels.\n"+
"             size:new Foundation.Point(3,3),  // The number of squares that make up the board, horizontally and vertically.\n"+
"             pieceImage:null, // To be filled in later.\n"+
"             pieceRects:null // To be filled in later.\n"+
"            },").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendCodeTestHtml:function(htmlBuilder)
   {
      htmlBuilder.append("<p>"+this.getButtonHtml("Test your code","testYourCode",this.event("testYourCode()",true))+" to see if it compiles.</p>");
      htmlBuilder.append("<span id=\""+this.elementId("goodCode")+"\" style=\"display:none\">");
      htmlBuilder.append("<p>The code appeared to compile, but nothing is certain. You are about to refresh the browser. Note that if you inserted the line incorrectly "+
"                           or made some other mistake and the code does not compile, this tutorial will not show. "+
"                           Use the debugging tools to figure out what happened and try to fix it. Or undo your change, save the file, and test the code again.</li>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>"+this.getButtonHtml("Refresh your browser","",this.event("refreshBrowser()"))+" when you are ready.");
      htmlBuilder.append("</p>");
      htmlBuilder.append("</span>");
      htmlBuilder.append("<span id=\""+this.elementId("badCode")+"\" style=\"display:none\">");
      htmlBuilder.append("<p>It looks like there were errors! Do not refresh or close this browser, as this tutorial will not show with the errors. "+
"                           Use the debugging tools to figure out what happened and try to fix it. Or undo your change, save the file, and test the code again.</li>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("</span>");
      htmlBuilder.append("<span id=\""+this.elementId("compareCode")+"\" style=\"display:none;height:200\">");
      htmlBuilder.append("<p>Below are the differences between your code and the expected code:");
      htmlBuilder.append("<div style=\"height:400\">");
      if (!this.diffControl)
         this.diffControl=new Foundation.Controls.Difference();
      htmlBuilder.append(this.diffControl.getHtml());
      htmlBuilder.append("</div>");
      htmlBuilder.append("</li>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>"+this.getButtonHtml("Refresh your browser","",this.event("refreshBrowser()"))+" when you are ready.");
      htmlBuilder.append("</p>");
      htmlBuilder.append("</span>");
      htmlBuilder.append("<p>Make sure your browser's JavaScript debugging tools are on/open.");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>If you are using Internet Explorer, use the menu to open <nobr>&quot;Tools->Internet Options->Advanced&quot;</nobr>, scroll down a bit and make sure the <nobr>&quot;Display notification about every script error&quot;</nobr> box is checked.</li>");
      htmlBuilder.append("<li>If you are using Firefox, use the menu to open the <nobr>&quot;Tools->JavaScript Console&quot;</nobr> box.</li>");
      htmlBuilder.append("</ul></p>");
   },
   testYourCode:function()
   {
      try
      {
         var code=Foundation.$readTextFile(this.getCodeFolder(true)+"Game.js");
         var loaded=false;
         try
         {
            new Function(code);
            loaded=true;
         }
         catch(e)
         {
         }
         var anyDiffs=this.diffControl.compare("Your code",code,"Expected code",this.resource("game"+this.getCurrentTutorialStep(true)+"_js"));
         if (loaded)
            this.codeLoaded(anyDiffs);
         else
            this.codeErroredOut();
         if (anyDiffs)
            this.diffControl.scrollToActiveDiff();
      }
      catch(e)
      {
         this.codeErroredOut(true);
      }
   },
   codeLoaded:function(anyDiffs)
   {
      var e;
      if (e=this.getElement("testYourCode"))
      {
         e.value="Test your code";
         e.disabled=false;
      }
      if (e=this.getElement("badCode"))
         e.style.display="none";
      if (e=this.getElement("goodCode"))
         e.style.display="";
      if (anyDiffs && (e=this.getElement("compareCode")))
         e.style.display="";
   },
   codeErroredOut:function(readError)
   {
      var e;
      if (e=this.getElement("testYourCode"))
      {
         e.value="Test your code";
         e.disabled=false;
      }
      if (e=this.getElement("goodCode"))
         e.style.display="none";
      if (e=this.getElement("badCode"))
         e.style.display="";
      if (e=this.getElement("compareCode"))
         e.style.display="";
   },
   refreshBrowser:function()
   {
      window.document.body.scrollTop=0;
      window.document.body.scrollLeft=0;
      if (this.tutorialStepOffset>0)
      {
         this.tutorialStepOffset--;
         this.update();
      }
      else
         window.location.reload(false);
   },
   appendCreatePieceImageHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Create a Piece image");
      htmlBuilder.append("<p>Now you need a piece image for your game. When designing the pieces:");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>The "+"GIF".fileSystemNameHtml()+" format is works well because you can have transparent pixels.");
      htmlBuilder.append("<li><p>The images for all the pieces, as well as highlight images, etc., should be in the same image file. This is to cut down on the number of requests the browser will have to make to get the data for each piece. The browser needs to download a particular file only once and can use the same data for any other images on the same page that use the same file without additional requests.</p>");
      htmlBuilder.append("<p>By putting the images for all the pieces in the same file, the amount of data transfered is the same, but the browser only needs to request 1 image file for all the pieces instead of 1 for each piece. This cuts down on the amount of time it takes to download a game, and more importantly, reduces the load on the server.</p>");
      htmlBuilder.append("<p>Each piece will create its own HTML image element using the same source file. However, each piece will &quot;clip&quot; its image element so that it only shows the area that represents the piece. We will define these areas in the next step.</p>");
      htmlBuilder.append("</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("<p>Now, create your piece image, call it "+"Pieces.gif".copyAndPaste()+",and save it to the "+"Boards/Default".fileSystemNameHtml()+" folder you created earlier.");
      if (this.type==24)
      {
         htmlBuilder.append("<br>For Tic-Tac-Toe, here is a piece image you can use.");
         htmlBuilder.append("<br><img src=\"Tutorial/Boards/Default/Pieces.gif\" width=255 height=85 galleryimg=false border=\"1px solid black\"><br>");
         htmlBuilder.append("To use this image, right click on the image above, choose \"Save Picture As\", and save it to the "+"Boards/Default".fileSystemNameHtml()+" folder you created earlier, naming it "+"Pieces.gif".fileSystemNameHtml()+".");
      }
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>"+this.getButtonHtml("Click here","testImageButton",this.event("testForImage('Pieces',0);",true),"Checking...")+" after you have saved your piece image.");
      htmlBuilder.append("</p>");
   },
   appendSavePieceNameHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Save the name of the piece image");
      htmlBuilder.append("<p>The file name must be saved to the game code. That is done by filling in the "+"pieceImage".codeNameHtml()+" property of the "+"board".codeNameHtml()+" resource in the "+"resourcePack".codeNameHtml()+". ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("             pieceImage:null, // To be filled in later.".existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append(("             pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendCreatePieceRectsHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Create piece clipping rectangles");
      htmlBuilder.append("<p>The clipping rectangles for each piece in the image must be defined. That is done by filling in the "+"pieceRects".codeNameHtml()+" property of the "+"board".codeNameHtml()+" resource in the "+"resourcePack".codeNameHtml()+". ");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>Each rectangle is identified by a key. This key can be a property name, or a number or string.</li> ");
      htmlBuilder.append("<li>It will be easier if the key matches how you would store the state of the board. For example, in Tac-Tac-Toe, the state stored for a square will be either an 'X', an 'O', or a space (blank).  So it will help if those same characters are used to identify the piece rectagles.</li> ");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>Use the following tool to create clipping rectangles. ");

      var imageSrc=this.getImageSrc(this.resource("board").pieceImage);
      if (!this.pieceClipper)
         this.pieceClipper=new Foundation.Controls.Clipper();
      this.pieceClipper.onChange=new Function("clipper",this.event("clipperOnChange(clipper)"));
      this.pieceClipper.setValue(imageSrc);
      htmlBuilder.append(this.pieceClipper.getHtml());
      
      if (this.newPieceRects.length==0)
         if (this.board.pieceRects==null)
            if (this.type==24)
            {
               this.newPieceRects[0]={key:"X",top:0,left:0,width:85,height:85};
               this.newPieceRects[1]={key:"O",top:0,left:85,width:85,height:85};
               this.newPieceRects[2]={key:"hilite",top:0,left:170,width:85,height:85};
            }
            else
               this.newPieceRects[0]={key:"key",top:0,left:0,width:11,height:11};
         else
            for (var i in this.board.pieceRects)
            {
               var r=this.board.pieceRects[i];
               this.newPieceRects[this.newPieceRects.length]={key:i,top:r.y,left:r.x,width:r.width,height:r.height};
            }
      if (this.activePieceRectIndex<0 || this.activePieceRectIndex>=this.newPieceRects.length)
         this.activePieceRectIndex=0;
      var r=this.newPieceRects[this.activePieceRectIndex];
      this.pieceClipper.top=r.top;
      this.pieceClipper.left=r.left;
      this.pieceClipper.width=r.width;
      this.pieceClipper.height=r.height;
      htmlBuilder.append("<table id=\""+this.elementId("clipTable")+"\" cellspacing=0 cellpadding=0 width=\"1\">");
      for (var i=0;i<this.newPieceRects.length;i++)
      {
         r=this.newPieceRects[i];
         htmlBuilder.append("<tr><td>Key:");
         htmlBuilder.append(this.getTextHtml(r.key,"","size=5 onfocus=\""+this.event("rectOnFocus(this)")+"\" onkeyup=\""+this.event("updateClipRectKey(this)")+"\""));
         htmlBuilder.append("</td><td>");
         htmlBuilder.append(GamesByEmail.clippedImageHtml(imageSrc,new Foundation.Rectangle(r.left,r.top,r.width,r.height)));
         htmlBuilder.append("</td><td>");
         htmlBuilder.append(this.getButtonHtml("Delete","",this.event("deleteClipRect(this)")));
         htmlBuilder.append("</td></tr>");
      }
      htmlBuilder.append("<tr><td>");
      htmlBuilder.append(this.getButtonHtml("Add New Rectangle","",this.event("addClipRect()")));
      htmlBuilder.append("</td></tr>");
      htmlBuilder.append("</table>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("</p>The game class will use this these rectangled when drawing pieces. ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("             pieceRects:null // To be filled in later.".existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append(this.getClipRectCode().newCodeHtml(this.elementId("clipRectCode")));
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   rectOnFocus:function(e)
   {
      this.setRect(e.parentNode.parentNode.rowIndex);
   },
   setRect:function(index)
   {
      if (index>=this.newPieceRects.length)
         index=this.newPieceRects.length-1;
      this.activePieceRectIndex=index;
      if (this.activePieceRectIndex<0)
         this.pieceClipper.setFullRectangle();
      else
      {
         var r=this.newPieceRects[this.activePieceRectIndex];
         this.pieceClipper.setRectangle(r.left,r.top,r.width,r.height);
      }
   },
   clipperOnChange:function(index)
   {
      var table=this.getElement("clipTable");
      if (table && this.activePieceRectIndex>=0)
      {
         var r=this.newPieceRects[this.activePieceRectIndex];
         r.top=this.pieceClipper.top;
         r.left=this.pieceClipper.left;
         r.width=this.pieceClipper.width;
         r.height=this.pieceClipper.height;
         var cell=table.rows[this.activePieceRectIndex].cells[1];
         var imageSrc=this.getImageSrc(this.resource("board").pieceImage);
         cell.innerHTML=GamesByEmail.clippedImageHtml(imageSrc,new Foundation.Rectangle(r.left,r.top,r.width,r.height));
         this.updateClipRectCode();
      }
   },
   deleteClipRect:function(e,index)
   {
      if (arguments.length<2)
         window.setTimeout(this.event("deleteClipRect(null,"+e.parentNode.parentNode.rowIndex+")"),1);
      else
      {
         var table=this.getElement("clipTable");
         table.deleteRow(index);
         for (var i=index+1;i<this.newPieceRects.length;i++)
            this.newPieceRects[i-1]=this.newPieceRects[i];
         this.newPieceRects.length--;
         this.setRect(this.activePieceRectIndex);
      }
   },
   addClipRect:function()
   {
      var table=this.getElement("clipTable");
      var r=table.insertRow(table.rows.length-1);
      var c=r.insertCell(-1);
      c.innerHTML="Key:"+this.getTextHtml(r.key,"","size=5 onfocus=\""+this.event("rectOnFocus(this)")+"\" onkeyup=\""+this.event("updateClipRectKey(this)")+"\"");
      c=r.insertCell(-1);
      c=r.insertCell(-1);
      c.innerHTML=this.getButtonHtml("Delete","",this.event("deleteClipRect(this)"));
      this.newPieceRects[this.newPieceRects.length]={key:"",top:0,left:0,width:-1,height:-1};
      this.setRect(this.newPieceRects.length-1);
   },
   getClipRectCode:function()
   {
      var code="";
      code+="             pieceRects:{ // Clipping rectangles for the pieces.";
      for (var i=0;i<this.newPieceRects.length;i++)
      {
         if (i>0)
            code+=",";
         var r=this.newPieceRects[i];
         var key=r.key.toString();
         code+="\n                         ";
         if (key.length==0 || key.search(/\W/)>=0)
            code+="\""+key.cEncode()+"\"";
         else
            code+=key;
         code+=":new Foundation.Rectangle("+r.left+","+r.top+","+r.width+","+r.height+")";
      }
      code+="\n                        }\n";
      return code;
   },
   updateClipRectKey:function(e)
   {
      var index=e.parentNode.parentNode.rowIndex;
      this.newPieceRects[index].key=e.value;
      this.updateClipRectCode();
   },
   updateClipRectCode:function()
   {
      var e=this.getElement("clipRectCode");
      if (e)
         e.value=this.getClipRectCode();
   },
   appendCreateInitialzeHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Create initialization method");
      htmlBuilder.append("<p>When a game first begins, it needs to create its starting state. That is done through a method called "+"initialize".codeNameHtml()+". ");
      htmlBuilder.append("In the "+"initialize".codeNameHtml()+" method, key-value pairs can be added to the "+"info".codeNameHtml()+" collection of the game object, of the team objects, and of the player objects. ");
      htmlBuilder.append("Keep the following in mind when deciding where to store information:");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>"+"game.info".codeNameHtml()+" should hold most of the information about the game.");
      htmlBuilder.append("<ul><li>"+"game.info.board".codeNameHtml()+" is mostly where everything goes.</li></ul></li>");
      htmlBuilder.append("<li>"+"team.info".codeNameHtml()+" should hold information specific to that team.");
      htmlBuilder.append("<li>"+"player.info".codeNameHtml()+" should hold only player preferences.");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>As an example, the initialization method for Tic-Tac-Toe would need to do the following:");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li> Create a team for each of the players.");
      htmlBuilder.append("<li> Save the initial board state in the game's "+"info".codeNameHtml()+" collection. It would be a string of 9 spaces to represent an empty board. ");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>To add a custom "+"initialization".codeNameHtml()+" method to your class do the following:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      var s="Super";
      htmlBuilder.append((
"   initialize:function(numPlayers,turnTeamIndex)\n"+
"   {\n"+
"      "+s+".initialize(numPlayers,turnTeamIndex); // Call the parent class' initialize method to create the teams and players.\n"+
"      // Instead of starting with an empty board, for testing \n"+
"      // purposes we will start with an O in the middle space.\n"+
"      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n"+
"   }\n").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendCreateSynchHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Create synch method");
      htmlBuilder.append("<p>After a game downloads its data from the server, it needs to sychronize its state with the data. This is done through a method called "+"synch".codeNameHtml()+". ");
      htmlBuilder.append("In the "+"synch".codeNameHtml()+" method, the key-value pairs you created in the "+"initialize".codeNameHtml()+" method are used to set various properties of the board. ");
      htmlBuilder.append("For most simple games, like Tic-Tac-Toe, all that needs to be done is to set the value of the "+"pieces".codeNameHtml()+" collection with the value in "+"info.board".codeNameHtml()+". ");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>Do not be afraid to create new properties for your game or any component of it, as JavaScript is loosely typed, and new properties can be assigned at any time.");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>As an example, the synch method for Tic-Tac-Toe would need to do the following:");
      htmlBuilder.append("<ul>");
      htmlBuilder.append("<li>Set the value of the "+"pieces".codeNameHtml()+" collection to that of "+"info.board".codeNameHtml()+".</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>To add a custom "+"synch".codeNameHtml()+" method to your class do the following:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      var s="Super";
      htmlBuilder.append((
"   synch:function()\n"+
"   {\n"+
"      "+s+".synch(); // Call the parent class' synch method to do whatever it does.\n"+
"      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n"+
"   },\n").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li><b>Note that the new method was followed with a comma.</b> This is very important, your code will not compile unless the methods are separated with commas.</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendMouseMoveHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Hook into the onMouseMove event");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note the 'O' on the board. It was created in the "+"initialize".codeNameHtml()+" method and shown in the "+"synch".codeNameHtml()+" method.</p> ");
      htmlBuilder.append("<p>To place a new piece on the board, first start by having a new piece track the mouse while over the board. They best place to set this up is in the "+"itsYourTurnHtml".codeNameHtml()+" method. ");
      htmlBuilder.append("There, set the  "+"onMouseMove".codeNameHtml()+" property to the name of a method you create called "+"mouseMove".codeNameHtml()+". Then the "+"mouseMove".codeNameHtml()+" method will get called whenever the mouse moves over any part of the board. ");
      htmlBuilder.append("A parameter called "+"screenPoint".codeNameHtml()+" is passed to the method, which is the position of the mouse relative to the upper left of the board. ");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>To hook into the "+"onMouseMove".codeNameHtml()+" event in your class do the following:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following methods immediately "+this.resource("insertCodeBelow")+" it:");
      var s="Super";
      htmlBuilder.append((
"   mouseMove:function(screenPoint)\n"+
"   {\n"+
"      // First get the new piece we are adding.\n"+
"      var piece=this.pieces.getNewPiece();\n"+
"      // Set it as an X or O, depending on the 'color' of the team we are playing.\n"+
"      piece.setValue(this.player.team.color==0 ? 'X' : 'O');\n"+
"      // Center the piece on the cursor.\n"+
"      piece.center(screenPoint);\n"+
"   },\n"+
"   itsYourTurnHtml:function(resourceName)\n"+
"   {\n"+
"      // Make sure to only hook movement if we have not placed a piece yet.\n"+
"      if (!this.madeMove)\n"+
"      {\n"+
"         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n"+
"      }\n"+
"      return "+s+".itsYourTurnHtml(resourceName); // Call the parent class' itsYourTurnHtml method.\n"+
"   },\n").newCodeHtml());
   htmlBuilder.append("</li>");
   if (this.type!=24)
      htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
   htmlBuilder.append("<li>Save the file.</li>");
   htmlBuilder.append("</ol>");
   htmlBuilder.append("</p>");
   this.appendCodeTestHtml(htmlBuilder);
   },
   appendMouseOutHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Hook into the onMouseOut event");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Move the cursor over the board. Note the new X that follows it over the board, but that the X 'sticks' when the cursor leaves.</p> ");
      htmlBuilder.append("<p>As you move the mouse over the board, you see the new piece follow the cursor. Now we will get the piece to disappear again when we move the mouse off the board. ");
      htmlBuilder.append("We will set the "+"onMouseOut".codeNameHtml()+" property to the name of a new method called "+"mouseOut".codeNameHtml()+". Then the "+"mouseOut".codeNameHtml()+" method will get called whenever the mouse leaves the board. ");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>To hook into the "+"onMouseOut".codeNameHtml()+" event in your class do the following:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append((
"   mouseOut:function(screenPoint)\n"+
"   {\n"+
"      // First get the new piece.\n"+
"      var piece=this.pieces.getNewPiece();\n"+
"      // Reset the piece.\n"+
"      piece.reset();\n"+
"   },\n").newCodeHtml());
      htmlBuilder.append("<li>In the "+"itsYourTurnHtml".codeNameHtml()+" method, find the line ");
      htmlBuilder.append(("         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.").existingCodeHtml());
      htmlBuilder.append("and insert the following code immediately "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append(("         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendIsMoveLegalHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Test if a move is legal");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Now the 'X' should dissappear when the cursor leaves the board.</p> ");
      htmlBuilder.append("<p>We are now going to create a method to call to see if a move is legal. For Tic-Tac-Toe, the test is pretty simple, just make sure the space is unoccupied. ");
      htmlBuilder.append("We will create a method called "+"checkMove".codeNameHtml()+" which will in turn call another new method called "+"isMoveLegal".codeNameHtml()+". The methods can return true/false, or perhaps a new board state string or null. ");
      htmlBuilder.append("Then we use those methods to test if a move is legal, and 'snap' the new piece to the square if it is. ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append((
"   isMoveLegal:function(toPoint,boardValue)\n"+
"   {\n"+
(this.type==24 ? 
"      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n"+
"      // First, get the value index for the board point (square) we are testing.\n"+
"      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n"+
"      // Then return true if the value at that index is a space (and the move legal), or false if not.\n"+
"      return (boardValue.charAt(valueIndex)==' ');\n"
: 
"      // Modify as necessary for your game.\n"+
"      return true;\n"+
"")+
"   },\n"+
"   checkMove:function(toPoint)\n"+
"   {\n"+
"      // Get the board state value and pass it to isMoveLegal.\n"+
"      return this.isMoveLegal(toPoint,this.pieces.getValue());\n"+
"   },\n").newCodeHtml());
      htmlBuilder.append("<li>In the "+"mouseMove".codeNameHtml()+" method, find the lines ");
      htmlBuilder.append(("         // Center the piece on the cursor.\n         piece.center(screenPoint);").existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" them with the following:");
      htmlBuilder.append((
"      // First, get the board point from the screen point.\n"+
"      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n"+
"      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n"+
"      if (this.checkMove(boardPoint))\n"+
"         piece.snap(boardPoint);\n"+
"      else\n"+
"         piece.center(screenPoint);\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendMouseUpHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Hook into the onLeftMouseUp event");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Now the new X should 'snap' to empty spaces, indicating a legal move. Note that over the occupied space it does not snap.</p> ");
      htmlBuilder.append("<p>The last mouse event needed is to know when a button has been clicked to place the piece. ");
      htmlBuilder.append("We will set the "+"onLeftMouseUp".codeNameHtml()+" property to the name of a new method called "+"mouseUp".codeNameHtml()+". ");
      htmlBuilder.append("A parameter called "+"screenPoint".codeNameHtml()+" is passed to the method, which we will use to place the piece in an empty square. ");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p>To hook into the "+"onLeftMouseUp".codeNameHtml()+" event in your class do the following:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append((
"   mouseUp:function(screenPoint)\n"+
"   {\n"+
"      // First, undo a move if we have already made one.\n"+
"      if (this.madeMove)\n"+
"         this.undo();\n"+
"      // Then get the new piece.\n"+
"      var piece=this.pieces.getNewPiece();\n"+
"      // Next, get the board point from the screen point.\n"+
"      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n"+
"      // Now test to see if the move is legal. Move to the board point if it is.\n"+
"      if (this.checkMove(boardPoint))\n"+
"      {\n"+
"         piece.setValue(this.player.team.color==0 ? 'X' : 'O');\n"+
"         piece.move(boardPoint,false);\n"+
"         // Set the madeMove flag to true...\n"+
"         this.madeMove=true;\n"+
"         // ...and that the move is ready to send...\n"+
"         this.readyToSend=true;\n"+
"         // ...then update the game controls.\n"+
"         this.update();\n"+
"      }\n"+
"   },\n").newCodeHtml());
      htmlBuilder.append("<li>In the "+"itsYourTurnHtml".codeNameHtml()+" method, find the line ");
      var s_u_p_e_r="S"+"uper";
      htmlBuilder.append(("      return "+s_u_p_e_r+".itsYourTurnHtml(resourceName); // Call the parent class' itsYourTurnHtml method.").existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeAbove")+" it (outside the if clause):");
      htmlBuilder.append(("      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendSendMoveHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Send the move");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Now the new X should stay when you click on an empty space. If you click on another empty space it will move there. If you click on the occupied center square, it will start following the mouse around again.</p> ");
      htmlBuilder.append("<p>Now that the pieces move where you click, it is time to send the move. ");
      htmlBuilder.append("The "+"sendMove".codeNameHtml()+" method is the opposite of the "+"synch".codeNameHtml()+" method you created earlier. This is where you get the game state and store it in the "+"info".codeNameHtml()+" collection of the "+"game".codeNameHtml()+" and "+"team".codeNameHtml()+" objects. ");
      htmlBuilder.append("Also, we will need to let the game know that the turn has moved on to the next player. ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      var s="Super";
      htmlBuilder.append((
"   sendMove:function()\n"+
"   {\n"+
"      this.clearMouseEvents();\n"+
"      var board=this.pieces.getValue();\n"+
"      this.info.board=board;\n"+
"      var opponent=this.player.team.nextTeam();\n"+
"      opponent.setExclusiveTurn();\n"+
"      return "+s+".sendMove();\n"+
"   },\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendCreateTeamTitleResourcesHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Create some team titles");
      if (this.type==24)
      {
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Now after you place an X, a 'Send this move' button will appear. This button imitates a send to the server, and when you press it, you will then be able to place a 'O', and play back and forth.</p> ");
         //htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Also note that the board rotates 180 degrees when the move is sent. For most games like chess or checkers, it is necessary to rotate the board 180 degrees for the second player. Though not really necessary for Tic-Tac-Toe, it is the default behaviour, and could be changed by overriding the setPerspective method and setting the rotation property (in radians).</p> ");
      }
      htmlBuilder.append("<p>Now you need to create some titles for your teams. For each of the possible teams in the game, give them a title: ");
      htmlBuilder.append("<ul>");
      var max=0;
      var anp=this.resource("allowedNumPlayers");
      for (var i=0;i<anp.length;i++)
         if (anp[i]>max)
            max=anp[i];
      var titles=new Array(max);
      for (var i=0;i<max;i++)
         titles[i]=this.type==24 && i<2 ? i==0 ? "X" : "O" : "Team "+(i+1);
      for (var i=0;i<max;i++)
         htmlBuilder.append("<li>Player "+(i+1)+":"+this.getTextHtml(titles[i],i+"_TeamTitle","onkeyup=\""+this.event("teamTitleChanged()")+"\"")+"</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("<li>Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append(("      allowedNumPlayers:["+this.resource("allowedNumPlayers")+"], // A list of the number of players allowed in a game.").existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append(this.teamTitleResourceCode(titles).newCodeHtml(this.elementId("teamTitleResources")));
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   teamTitleResourceCode:function(titles)
   {
      var code="";
      code+="      teamTitles:[";
      for (var i=0;i<titles.length;i++)
      {
         if (i>0)
            code+=",";
         code+="\""+titles[i].cEncode()+"\"";
      }
      code+="],\n";
      return code;
   },
   getTeamTitleList:function()
   {
      var titles=new Array();
      var e;
      for (var i=0;e=this.getElement(i+"_TeamTitle");i++)
         titles[i]=e.value;
      return titles;
   },
   teamTitleChanged:function()
   {
      this.getElement("teamTitleResources").value=this.teamTitleResourceCode(this.getTeamTitleList());
   },
   appendColorTeamTitlesHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Color the team titles");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that the team titles switch sides when sending a move. The player who is 'viewing' the game (and in testing mode whose turn it is) is always at the bottom.</p> ");
      htmlBuilder.append("<p>For clarity, we can color the team titles by adding a few more resources. For each of the possible teams in the game, give them a color: ");
      htmlBuilder.append("<ul>");
      var max=0;
      var anp=this.resource("allowedNumPlayers");
      for (var i=0;i<anp.length;i++)
         if (anp[i]>max)
            max=anp[i];
      var colors=new Array(max);
      for (var i=0;i<max;i++)
         colors[i]=this.type==24 && i<2 ? i==0 ? "#770802" : "#008806" : "#000000";
      for (var i=0;i<max;i++)
         htmlBuilder.append("<li><span id=\""+this.elementId("teamTitles_"+i)+"\" style=\"color:"+colors[i]+"\">"+this.getTeamTitleHtml(this.teams[i])+"</span>:"+this.getTextHtml(colors[i],i+"_TeamColor","onkeyup=\""+this.event("teamColorChanged()")+"\"")+"</li>");
      htmlBuilder.append("</ul>");
      htmlBuilder.append("<li>Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append(("      teamTitles:"+Foundation.jsSerialize(this.resource("teamTitles"))+",").existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append(this.teamColorResourceCode(colors).newCodeHtml(this.elementId("teamColorResources")));
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   teamColorResourceCode:function(colors)
   {
      var code="";
      code+="      teamFontColors:[";
      if (colors.length>0)
      {
         code+="\""+colors[0].cEncode()+"\"";
         for (var i=1;i<colors.length;i++)
         {
            if (i>0)
               code+=",";
            code+="\""+colors[i].cEncode()+"\"";
         }
      }
      code+="],\n";
      return code;
   },
   getTeamColorList:function()
   {
      var colors=new Array();
      var e;
      for (var i=0;e=this.getElement(i+"_TeamColor");i++)
      {
         colors[i]=e.value;
         try
         {
            this.getElement("teamTitles_"+i).style.color=colors[i];
         }
         catch(e)
         {
         }
      }
      return colors;
   },
   teamColorChanged:function()
   {
      this.getElement("teamColorResources").value=this.teamColorResourceCode(this.getTeamColorList());
   },
   appendTestForWinnerHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Check for a winner");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that the team titles are now colored.</p> ");
      htmlBuilder.append("<p>Now that the moves are sending, it is time to check for a winner after each move. ");
      htmlBuilder.append("Create a method called "+"checkForWin".codeNameHtml()+" that tests a board state to see if a player has won. ");
      htmlBuilder.append("In Tic-Tac-Toe, each horizontal, vertical and diagonal row is tested to see if all three spaces hold the same character. ");
      htmlBuilder.append("Then in the "+"sendMove".codeNameHtml()+" method you created a few steps ago, the check is made and the game ended if the player just won. ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      if (this.type==24)
         htmlBuilder.append((
"   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n"+
"   {\n"+
"      return (this.valueFromXYBoard(x1,y1,board)==value &&\n"+
"              this.valueFromXYBoard(x2,y2,board)==value &&\n"+
"              this.valueFromXYBoard(x3,y3,board)==value);\n"+
"   },\n"+
"   checkForWin:function(board,color)\n"+
"   {\n"+
"      var value=(color==0 ? 'X' : 'O');\n"+
"      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n"+
"              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n"+
"              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n"+
"              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n"+
"              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n"+
"              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n"+
"              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n"+
"              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n"+
"   },\n"+
"").newCodeHtml());
      else
         htmlBuilder.append((
"   checkForWin:function(board,color)\n"+
"   {\n"+
"      // Modify as necessary for your game.\n"+
"      return false;\n"+
"   },\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>In the "+"sendMove".codeNameHtml()+" method, find the line ");
      htmlBuilder.append((
"      opponent.setExclusiveTurn();\n"+
"").existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append((
"      if (this.checkForWin(board,this.player.team.color))\n"+
"         this.setEnded(this.player.team);\n"+
"      else\n"+
"         opponent.setExclusiveTurn();\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendTestForDrawHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Check for a draw");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that when a player gets three in a row, they win the game.</p> ");
      htmlBuilder.append("<p>The last check needed is to test if the game has ended in a draw. In Tic-Tac-Toe, it would check to see if there were no empty spaces left. ");
      htmlBuilder.append("Create a method called "+"checkForDraw".codeNameHtml()+" that tests a board state to see if the game has ended in a draw. ");
      htmlBuilder.append("Then in the "+"sendMove".codeNameHtml()+" method you created a few steps ago, the check is made and the game ended if it is a draw. ");
      if (this.type==24)
      {
         htmlBuilder.append("<p>Note that instead of checking for a space character directly in the "+"checkForDraw".codeNameHtml()+" method, it will instead utilize the "+"isMoveLegal".codeNameHtml()+" method created a few steps ago. This leaves only one place in the code that defines what an 'empty' space is. ");
         htmlBuilder.append("<p>The "+"forEachBoardPoint".codeNameHtml()+" method will call the specified method once for each board point, stopping if the method returns any value that evaluates to "+"true".codeNameHtml()+". It passes the point as the first parameter, and passes along any additional parameters as well. It returns "+"null".codeNameHtml()+" or the first expression that evaluated to "+"true".codeNameHtml()+". ");
      }
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("   // This will hold our methods and properties.".existingCodeHtml());
      htmlBuilder.append("and insert the following method immediately "+this.resource("insertCodeBelow")+" it:");
      if (this.type==24)
         htmlBuilder.append((
"   checkForDraw:function(board)\n"+
"   {\n"+
"      // Use the forEachBoardPoint method which will call the named method \n"+
"      //   once for each point on the board, passed as the first parameter, \n"+
"      //   other parameters passed too. If the named method returns a value \n"+
"      //   that evaluates to true, processing is stopped and that value is \n"+
"      //   returned by forEachBoardPoint, else null is returned. \n"+
"      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n"+
"   },\n"+
"").newCodeHtml());
      else
         htmlBuilder.append((
"   checkForDraw:function(board,color)\n"+
"   {\n"+
"      // Modify as necessary for your game.\n"+
"      return false;\n"+
"   },\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      if (this.type!=24)
         htmlBuilder.append("<li>Modify the method as necessary to suit your game.</li>");
      htmlBuilder.append("<li>In the "+"sendMove".codeNameHtml()+" method, find the line ");
      htmlBuilder.append((
"         opponent.setExclusiveTurn();\n"+
"").existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append((
"         if (this.checkForDraw(board))\n"+
"         {\n"+
"            // Our board must be full, the game ended in a draw.\n"+
"            this.setEnded();\n"+
"            this.status.draw=true;\n"+
"            this.status.stalemate=true;\n"+
"            // Teams tie.\n"+
"            this.player.team.status.drew=true;\n"+
"            opponent.status.drew=true;\n"+
"            // Notify opponent game ended with draw.\n"+
"            opponent.notify.lost=true;\n"+
"            opponent.notify.won=true;\n"+
"         }\n"+
"         else\n"+
"            opponent.setExclusiveTurn();\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendAddHiliteHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Highlight the last piece placed");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that when the board fills up without a winner, the game ends in a draw.</p> ");
      htmlBuilder.append("<p>For clarification, we can highlight the last piece placed. This is done by overlaying an image over the piece. It should be part of the image file you created earlier. ");
      htmlBuilder.append("<p>To mark which space was the last one moved in, we need to store that information somewhere in the "+"info".codeNameHtml()+" collection. As a rule, you should try to create as few key/value pairs in the "+"info".codeNameHtml()+" collections you can. If multiple values can be easily stuffed and extracted using one key, that means less work for the server.");
      if (this.type==24)
         htmlBuilder.append("<p>For Tic-Tac-Toe, the information can be appended to the "+"info.board".codeNameHtml()+" value. The tenth character will be the index of space (0-8) last moved to. It will be appended to the value in the "+"sendMove".codeNameHtml()+" method, and extracted for display during the "+"synch".codeNameHtml()+" method call.");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>First, when a move is made, append a character to the "+"info.board".codeNameHtml()+" property. In the "+"sendMove".codeNameHtml()+" method, find the line ");
      htmlBuilder.append("      this.info.board=board;".existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append((
"      var piece=this.pieces.getNewPiece();\n"+
"      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n"+
"      this.info.board=board+hiliteIndex.toString();\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Next, check for that extra character and show a highlight if it exists. In the "+"synch".codeNameHtml()+" method, find the line ");
      htmlBuilder.append("      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.".existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeAbove")+" it:");
      htmlBuilder.append((
"      if (this.info.board.length>9)\n"+
"      {\n"+
"         var hiliteIndex=parseInt(this.info.board.charAt(9));\n"+
"         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n"+
"         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n"+
"         this.setOverlayHtml(hiliteHtml);\n"+
"      }\n"+
"      else\n"+
"         this.setOverlayHtml(\"\");\n"+
"").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Last, hide the highlight after the player makes a move. In the "+"mouseUp".codeNameHtml()+" method, find the line ");
      htmlBuilder.append("         piece.setValue(this.player.team.color==0 ? 'X' : 'O');".existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeAbove")+" it:");
      htmlBuilder.append(("         this.clearHilites();\n").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendCreateRulesHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Write the rules");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note the blue highlight over the piece an opponent just placed.</p> ");
      htmlBuilder.append("<p>By default, the "+this.openRulesAnchorHtml()+"rules of the game</a> will be pretty vauge. These can be expanded by creating a new file called "+"Rules.htm".fileSystemNameHtml()+". ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>In the "+"TicTacToe".fileSystemNameHtml(this.elementId("folderName1"))+" folder, create a new text file called "+"Rules.htm".copyAndPaste()+".</li>");
      htmlBuilder.append("<li>Edit the new "+"Rules.htm".fileSystemNameHtml()+" file. Copy the following HTML and paste it into the file, then save and close the file:"+this.resource("rules_htm").newCodeHtml(this.elementId("rules.htm"))+"</li>");
      htmlBuilder.append("<li>Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append(("      theVeryLastResource:\"\" // Insert new resources above here.").existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeAbove")+" it:");
      htmlBuilder.append(("      rules:Foundation.readTextFile(\"Rules.htm\"),\n").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Also, go ahead and eliminate the initial <font style=\"color:#008806;font-weight:bold\">O</font>. In the "+"initialize".codeNameHtml()+" method, find the line ");
      htmlBuilder.append(("      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.").existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append(("      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendDebugExampleHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Some debugging tools");
      if (this.type==24)
         htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that the "+this.openRulesAnchorHtml()+"rules of the game</a> now have information.</p> ");
      htmlBuilder.append("<p>Many times during programming you will want to display debug messages. ");
      htmlBuilder.append("There is a method called "+"debug()".codeNameHtml()+" that you can use to display messages in the message area. ");
      htmlBuilder.append("debug()".codeNameHtml()+" called with no parameters clears the message area. ");
      htmlBuilder.append("debug()".codeNameHtml()+" called with parameters displays each parameter on a new line. ");
      htmlBuilder.append("For example, you can use it to display the "+"screenPoint".codeNameHtml()+" in the "+"mouseMove".codeNameHtml()+" method:");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>In the "+"mouseMove".codeNameHtml()+" method, find the line ");
      htmlBuilder.append("      var boardPoint=this.boardPointFromScreenPoint(screenPoint);".existingCodeHtml());
      htmlBuilder.append("and insert the following lines "+this.resource("insertCodeBelow")+" it:");
      htmlBuilder.append(("      this.debug(); // Clear the debug window\n"+
                          "      this.debug(screenPoint);\n"+
                          "       // You can also call the global debug method when testing.\n"+
                          "      debug(boardPoint);\n"+
                          "").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      
      this.appendCodeTestHtml(htmlBuilder);
   },
   appendBlurtExampleHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Blurting");
      htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that the screen and board coordinates display below when you mouse over the board.</p> ");
      htmlBuilder.append("<p>As you have seen, every time you refresh the game, the state re-initializes. When building a game, playing would take too long ");
      htmlBuilder.append("to continually return to a part that needs testing. To quickly return to a state, you can modify the ");
      htmlBuilder.append("initialize".codeNameHtml()+" method to add test data.");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>At the very top of the "+"initialize".codeNameHtml()+" method, find the line ");
      htmlBuilder.append(("      Super"+".initialize(numPlayers,turnTeamIndex); // Call the parent class' initialize method to create the teams and players.").existingCodeHtml());
      htmlBuilder.append("and insert the following lines "+this.resource("insertCodeAbove")+" it:");
      htmlBuilder.append(("      var test=false;\n"+
                          "      test=true;\n"+
                          "      if (test && !GamesByEmail.inProduction())\n"+
                          "      {\n"+
                          "         // Insert test code here.\n"+
                          "      }\n"+
                          "").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Now, play a turn or two, putting some Xs and Os on the board.</li>");
      htmlBuilder.append("<li>Press this "+this.getButtonHtml(this.resource("testingBlurt"),"testingBlurt",this.event("blurt()"))+" button.</li>");
      htmlBuilder.append("<li>Note the code that appeared in the debug window. In the "+"initialize".codeNameHtml()+" method, find the line you just inserted ");
      htmlBuilder.append("         // Insert test code here.".existingCodeHtml());
      htmlBuilder.append("and then copy and paste the code from the debug window "+this.resource("insertCodeBelow")+" it.</li>");
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");

      this.appendCodeTestHtml(htmlBuilder);
   },
   appendExternalCodeExampleHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Multiple code files");
      htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that when you refreshed, the game returned to the start of the last turn.</p> ");
      htmlBuilder.append("<p>With big game, and sometimes small ones too, the code can be easier to manage and organize if it is seperated into several files. ");
      htmlBuilder.append("Different classes, say a custom "+"Piece".codeNameHtml()+" class, can go into its own file. ");
      htmlBuilder.append("A game might have serveral methods relavant to one particular action, and separating them out makes them easier to find. ");
      htmlBuilder.append("<p>Tic-Tac-Toe is so short there is not a lot to break out. But we will override a header method to show you how it is done.");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>In the "+"TicTacToe".fileSystemNameHtml(this.elementId("folderName1"))+" folder, create a new text file called "+"moreMethods.js".copyAndPaste()+".</li>");
      htmlBuilder.append("<li>Edit the new "+"moreMethods.js".fileSystemNameHtml()+" file. Copy the following code and paste it into the file, then save and close the file:"+this.resource("moreMethods_js").newCodeHtml(this.elementId("moreMethods.js"))+"</li>");
      htmlBuilder.append("<li>At the very bottom of the "+"Game.js".fileSystemNameHtml()+", add the the following line:");
      htmlBuilder.append("Foundation.includeScripts(\"moreMethods.js\");\n".newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Note that when using Internet Explorer, you can put the files into subfolders. With Firefox everything must remain in the same folder as your "+"Game.js".fileSystemNameHtml()+" file,</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");

      this.appendCodeTestHtml(htmlBuilder);
   },
   appendProfilerExampleHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("Profiler");
      htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that when you refreshed, the game header has the hello world message.</p> ");
      htmlBuilder.append("<p>As you are developing a game, it is often usefull to trace your methods to see what path and how long they take. ");
      htmlBuilder.append("That is called 'profiling'. You can do this with the games as well. The button below attaches a ");
      htmlBuilder.append("<a target=\"_blank\" href=\"http://FoundationDotJS.org/SimpleProfiler/Default.htm\">Foundation.Tools.SimpleProfiler</a> ");
      htmlBuilder.append("to the game class and displays useful information in a popup window.");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>Press this "+this.getButtonHtml(this.resource("testingProfiler"),"testingProfiler",this.event("addProfiler()"))+" button.</li>");
      htmlBuilder.append("<li>Note the window that appeared (you may need to press the Retry button if the popup was blocked).</li>");
      htmlBuilder.append("<li>By default, the profiler will only record the last 5 seconds of calls while you are holding the F2 key down (these can be changed). ");
      htmlBuilder.append("To see the trace of your "+"mouseUp".codeNameHtml()+" method, press and hold the F2 key, move the mouse over the game, click, and then release the F2 key.</li>");
      htmlBuilder.append("<li>Note the information showing in the profiler window. You can see a sumary of the methods that were called, ordered by time and occurence.</li>");
      htmlBuilder.append("<li>Click the <b>Trace</b> tab. Each event begins at a <b>depth</b> of zero, and you can trace each event in order.</li>");
      htmlBuilder.append("<li>Hit Ctrl-F and search  for "+"mouseUp".codeNameHtml()+". The long grey bar is the total time to complete that method. ");
      htmlBuilder.append("But almost all of the time was actually in other methods called by the "+"mouseUp".codeNameHtml()+" method. The time actually in the method ");
      htmlBuilder.append("is shown in green. You can scroll down through the event and trace the green as it progresses from left to right over the span of the event. ");
      htmlBuilder.append("A method that throws an exception will have a red marker to the left.</li>");
      htmlBuilder.append("<li>Sorting through all those events to find those with the "+"mouseUp".codeNameHtml()+" method could be time consuming if you had to repeat it often. ");
      htmlBuilder.append("The profiler has a setting called "+"interest".codeNameHtml()+" that can be used to filter out uninteresting events. ");

      htmlBuilder.append("Near the bottom of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append(("      theVeryLastResource:\"\" // Insert new resources above here.").existingCodeHtml());
      htmlBuilder.append("and insert the following immediately "+this.resource("insertCodeAbove")+" it:");
      htmlBuilder.append(("      profilerSettings:{interest:[\"mouseUp\"\n"+
                          "                                 ]\n"+
                          "                       },\n").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");

      this.appendCodeTestHtml(htmlBuilder);
   },
   appendTutorialCompleteHtml:function(htmlBuilder)
   {
      this.setTutotialStepTitle("All done!");
      htmlBuilder.append("<p style=\"color:"+this.noteColor+"\">Note that when you refreshed the window, the profiler automatically reloaded too.</p> ");
      htmlBuilder.append("<p>With the "+"interest".codeNameHtml()+" filter in place, it will be much easier to profile the "+"mouseUp".codeNameHtml()+" method. ");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>With the "+this.getButtonHtml(this.resource("testingProfiler"),"testingProfiler",this.event("addProfiler()"))+" open, ");
      htmlBuilder.append("repeat the same test: press and hold the F2 key, move the mouse over the game, click, and then release the F2 key.</li>");
      htmlBuilder.append("<li>The summary looks about the same, showing few calls and shorter total times. The method of interest is shown in <span style=\"color:red;font-weight:bolder\">red</span>.</li>");
      htmlBuilder.append("<li>Click the <b>Trace</b> tab, and the trace of the event with the "+"mouseUp".codeNameHtml()+" method call is right there on top. No other events had any calls to methods of interest. You can add other methods to the "+"interest".codeNameHtml()+" list.</li>");
      htmlBuilder.append("</ol>");


      
      htmlBuilder.append("<p>That is about it for now. There should be more steps on logging moves properly for display in the game log, but that can wait. ");
      if (this.type==24)
      {
         htmlBuilder.append("<p>This game is ready for prime time. <a href=\"mail"+"to:sn"+"esin"+"@"+"gmai"+"l.com\">Please let me know</a> what you thought of the tutorial.");
         htmlBuilder.append("<p>As you can see, the foundation lets you create games from the <a target=\"_blank\" href=\"http://GamesByEmail.com/Games/TicTacToe#Preview\">simple</a> to the <a target=\"_blank\" href=\"http://GamesByEmail.com/Games/WW2#Preview\">complex</a>. This tutorial is simply an extension of the game class that detects the progress of classes that extend it and prompts accordingly. Please give writing your own game a shot. If you need ideas for games, <a href=\"mail"+"to:sn"+"esin"+"@"+"gmai"+"l.com\">let me know</a>, I have a ton on my list. <b>Start with a simple game!</b>");
      }
      else
         htmlBuilder.append("<p>Modify this game until it is ready, then let GamesByEmail.com know and we will load it up and take a look. ");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<ol>");
      htmlBuilder.append("<li>To sever this game from the tutorial, simply change its class declaration. Instead of extending the "+"GamesByEmail.TutorialGame".codeNameHtml()+" class, extend the "+"GamesByEmail.Game".codeNameHtml()+" class directly. Near the top of the "+"Game.js".fileSystemNameHtml()+" file, find the line ");
      htmlBuilder.append("GamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).".existingCodeHtml());
      htmlBuilder.append("and "+this.resource("replaceCodeAt")+" it with the following:");
      htmlBuilder.append(("GamesByEmail.Game, // This is the base class that we are extending.\n").newCodeHtml());
      htmlBuilder.append("</li>");
      htmlBuilder.append("<li>Save the file.</li>");
      htmlBuilder.append("</ol>");
      htmlBuilder.append("</p>");
      htmlBuilder.append("<p><b>This is it!</b> After you refresh the browser, the tutorial headers, prompts, and buttons will no longer show. In order to see them in this game again you will have to extend the "+"GamesByEmail.TutorialGame".codeNameHtml()+" class.");
      htmlBuilder.append("<p>You will be able to continue testing and modifying the game. To create another game, simply open the <a href=\"Tutorial/Default.htm\" target=\"_blank\">Tutorial/Default.htm</a> file again and start over.");
      this.appendCodeTestHtml(htmlBuilder);
   },
   determineMaxTutorialStep:function()
   {
      var steps=this.getTutorialSteps();
      for (var i=0;i<steps.length;i++)
         if (steps[i].needToDoTest.call(this))
            return i;
   },
   getTutorialSteps:function()
   {
      return [{method:"appendStepDownloadHtml",            needToDoTest:new Function("return (window.location.protocol!=\"file:\");")}
             ,{method:"appendCreateGameFolderAndFilesHtml",needToDoTest:new Function("return (this.constructor==GamesByEmail.TutorialGame);")}
             ,{method:"appendCreateBoardImageHtml",        needToDoTest:new Function("return (!this.checkForImage(\"Board\"));")}
             ,{method:"appendCreateBoardResourceHtml",     needToDoTest:new Function("return (this.resource(\"board\")==null);")}
             ,{method:"appendCreatePieceImageHtml",        needToDoTest:new Function("return (!this.checkForImage(\"Pieces\"));")}
             ,{method:"appendSavePieceNameHtml",           needToDoTest:new Function("return (this.resource(\"board\").pieceImage==null);")}
             ,{method:"appendCreatePieceRectsHtml",        needToDoTest:new Function("return (this.resource(\"board\").pieceRects==null);")}
             ,{method:"appendCreateInitialzeHtml",         needToDoTest:new Function("return (this.initialize.toString().indexOf(\"board\")<0);")}
             ,{method:"appendCreateSynchHtml",             needToDoTest:new Function("return (this.synch.toString().indexOf(\"board\")<0);")}
             ,{method:"appendMouseMoveHtml",               needToDoTest:new Function("return (this.itsYourTurnHtml.toString().indexOf(\"onMouseMove\")<0);")}
             ,{method:"appendMouseOutHtml",                needToDoTest:new Function("return (this.itsYourTurnHtml.toString().indexOf(\"onMouseOut\")<0);")}
             ,{method:"appendIsMoveLegalHtml",             needToDoTest:new Function("return (this.mouseMove.toString().indexOf(\"checkMove\")<0);")}
             ,{method:"appendMouseUpHtml",                 needToDoTest:new Function("return (this.itsYourTurnHtml.toString().indexOf(\"onLeftMouseUp\")<0);")}
             ,{method:"appendSendMoveHtml",                needToDoTest:new Function("return (this.sendMove.toString().indexOf(\"board\")<0);")}
             ,{method:"appendCreateTeamTitleResourcesHtml",needToDoTest:new Function("return (this.resource(\"teamTitles\")==null);")}
             ,{method:"appendColorTeamTitlesHtml",         needToDoTest:new Function("return (this.resource(\"teamFontColors\")==null);")}
             ,{method:"appendTestForWinnerHtml",           needToDoTest:new Function("return (this.sendMove.toString().indexOf(\"checkForWin\")<0);")}
             ,{method:"appendTestForDrawHtml",             needToDoTest:new Function("return (this.sendMove.toString().indexOf(\"checkForDraw\")<0);")}
             ,{method:"appendAddHiliteHtml",               needToDoTest:new Function("return (this.synch.toString().indexOf(\"setOverlayHtml\")<0);")}
             ,{method:"appendCreateRulesHtml",             needToDoTest:new Function("return (this.resource(\"rules\")==GamesByEmail.Game.resourcePack.rules);")}
             ,{method:"appendDebugExampleHtml",            needToDoTest:new Function("return (this.mouseMove.toString().indexOf(\"debug\")<0);")}
             ,{method:"appendBlurtExampleHtml",            needToDoTest:new Function("return (this.initialize.toString().indexOf(\"this.move.number\")<0);")}
             ,{method:"appendExternalCodeExampleHtml",     needToDoTest:new Function("return (this.getHeaderHtml.toString().indexOf(\"hello world\")<0);")}
             ,{method:"appendProfilerExampleHtml",         needToDoTest:new Function("return (this.resource(\"profilerSettings\")==null);")}
             ,{method:"appendTutorialCompleteHtml",        needToDoTest:new Function("return true;")}
             ];                                   
   },
   getCurrentTutorialStep:function(forDisplay)   
   {                                             
      return this.maxTutorialStep-this.tutorialStepOffset+(forDisplay ? 1 : 0);
   },
   getTutorialStep:function()
   {
      return (this.getTutorialSteps())[this.getCurrentTutorialStep()];
   },
   areWePastTutorialStep:function(step)
   {
      var index=this.getCurrentTutorialStep();
      var steps=this.getTutorialSteps();
      for (var i=0;i<steps.length;i++)
         if (steps[i].method==step)
            return (index>i);
      return false;
   },
   getTeamTitlesHtml:function(top)
   {
      var html="";
      if (this.areWePastTutorialStep("appendCreateTeamTitleResourcesHtml"))
         html+=GamesByEmail.Game.prototype.getTeamTitlesHtml.call(this,top);
      if (!top && this.readyToSend && this.areWePastTutorialStep("appendSendMoveHtml"))
         html+="<br>"+this.sendMoveButtonHtml();
      return html;
   },
   updateCodeInputWidths:function(elements)
   {
      if (arguments.length==0)
      {
         this.updateCodeInputWidths(document.getElementsByTagName("INPUT"));
         this.updateCodeInputWidths(document.getElementsByTagName("TEXTAREA"));
      }
      else
         if (elements)
            for (var i=0;i<elements.length;i++)
            {
               var e=elements[i];
               if (e.className=="sourcecode")
               {
                  if (e.scrollWidth>e.clientWidth)
                     e.style.width=(e.offsetWidth+e.scrollWidth-e.clientWidth);
                  var n=e.parentNode;
                  n.style.height=e.offsetHeight;
                  n.style.marginTop=e.style.marginTop;
                  n.style.marginLeft=e.style.marginLeft;
                  n.style.marginBottom=e.style.marginBottom;
                  n.style.marginRight=e.style.marginRight;
               }
            }
   },
   update:function()
   {
      this.clearMouseEvents();
      var currentStepHtmlFunction=this.getTutorialStep().method;
      this.updateTutorialHeader();
      if (this.areWePastTutorialStep("appendCreateBoardResourceHtml"))
      {
         this.getElement("boardSpace").style.display="";
         this.setInnerHtml("topTeamTitles",this.getTeamTitlesHtml(true));
         this.setInnerHtml("bottomTeamTitles",this.getTeamTitlesHtml(false));
      }
      else
         this.getElement("boardSpace").style.display="none";
      
      var html=new Foundation.StringBuilder();
      this[currentStepHtmlFunction](html);
      html.append("<hr><p><b>I am anxious to help.</b> If at any time the tutorial is unclear, or if you have any questions about it at all, <a href=\"mail"+"to:sn"+"esin"+"@"+"gmai"+"l.com\">please let me know</a>.");
      html.append("<br>Also, be sure to check out the <a href=\"http://Developer.GamesByEmail.com/Documentation/GameApi/\" target=\"_blank\">game class documentation</a>");
      html.append(", or if you are feeling brave the <a href=\"http://Developer.GamesByEmail.com/Documentation/Api/\" target=\"_blank\">complete docs</a>.");
      this.setInnerHtml("controlSpace",html.toString());
      this.updateCodeInputWidths();

      if (this.areWePastTutorialStep("appendMouseMoveHtml"))
         this.itsYourTurnHtml();
      
      if (!this.status.uninitialized)
      {
         if (!this.status.playing)
            this.clearMouseEvents();
         this.setInnerHtml("gameState",this.getHeaderHtml());
      }


 //     htmlBuilder.append("<div id=\""+this.elementId("tutorialDiv")+"\" style=\"text-align:left\">");
      //if (this.areWePastTutorialStep("???"))
       //  Su per.appendControlsHtml(htmlBuilder);
//      htmlBuilder.append("</div>");

//      this.setInnerHtml("tutorialDiv",html.toString());

   },
   updateMaxTutorialStep:function()
   {
      this.maxTutorialStep=this.determineMaxTutorialStep();
   },
   receiveData:function(rawGame,numPlayers)
   {
      if (window.parent!=window)
         return;
      if (this.maxTutorialStep<1)
         this.updateMaxTutorialStep();
      if (this.areWePastTutorialStep("appendCreateBoardResourceHtml"))
      {
         var e=this.getElement("boardSpace");
         if (e.innerHTML.length<10)
         {
            var htmlBuilder=GamesByEmail.Game.prototype.appendBoardSpaceHtml.call(this,new Foundation.StringBuilder());
            if (this.areWePastTutorialStep("appendDebugExampleHtml"))
               htmlBuilder.append("<textarea id=\""+this.elementId("gameMessageRead")+"\" readonly wrap=off style=\"background-color:#eeeeee;width:100%\" rows=10 onfocus=\"this.select()\"></textarea>");
            this.setInnerHtml(e,htmlBuilder.toString());
         }
         GamesByEmail.Game.prototype.receiveData.call(this,rawGame,numPlayers);
      }
      else
         this.update();
   },
   appendControlsHtml:function(htmlBuilder)
   {
      return htmlBuilder;
   },
   appendBoardSpaceHtml:function(htmlBuilder)
   {
      if (this.areWePastTutorialStep("appendCreateBoardResourceHtml"))
         GamesByEmail.Game.prototype.appendBoardSpaceHtml.call(this,htmlBuilder);
      return htmlBuilder;
   },
   appendHtml:function(htmlBuilder)
   {
      if (window.parent!=window)
         return htmlBuilder;
      document.body.style.margin=0;
      htmlBuilder.append("<img id=\""+this.elementId("testImageBoard")+"\" src=\""+this.getImageSrc("Board.gif")+"\" style=\"position:absolute;visibility:hidden\">");
      htmlBuilder.append("<img id=\""+this.elementId("testImagePieces")+"\" src=\""+this.getImageSrc("Pieces.gif")+"\" style=\"position:absolute;visibility:hidden\">");
      this.maxTutorialStep=-1;
      this.tutorialStepOffset=0;
      this.appendTutorialHeaderHtml(htmlBuilder);
      htmlBuilder.append("<table cellpadding=10><tr><td>");
      GamesByEmail.Game.prototype.appendHtml.call(this,htmlBuilder);
      htmlBuilder.append("</td></tr></table>");
      return htmlBuilder;
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
   initialize:GamesByEmail.Game.prototype.initialize,
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
   gameOverHtml:GamesByEmail.Game.prototype.gameOverHtml,
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
   resign:GamesByEmail.Game.prototype.resign,
   maybeResign:GamesByEmail.Game.prototype.maybeResign,
   resignButtonHtml:GamesByEmail.Game.prototype.resignButtonHtml,
   acceptDraw:GamesByEmail.Game.prototype.acceptDraw,
   acceptDrawButtonHtml:GamesByEmail.Game.prototype.acceptDrawButtonHtml,
   sendMove:GamesByEmail.Game.prototype.sendMove,
   send:GamesByEmail.Game.prototype.send,
   processSecureMove:GamesByEmail.Game.prototype.processSecureMove,
   showTransactionPrompt:GamesByEmail.Game.prototype.showTransactionPrompt,
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
   getNewGamePlayerOrder:GamesByEmail.Game.prototype.getNewGamePlayerOrder,
   getNextGamesTitle:GamesByEmail.Game.prototype.getNextGamesTitle,
   gameFormOnCreateEvent:GamesByEmail.Game.prototype.gameFormOnCreateEvent,
   gameFormOnCancelEvent:GamesByEmail.Game.prototype.gameFormOnCancelEvent,
   initializeNewGameForm:GamesByEmail.Game.prototype.initializeNewGameForm,
   displayStartGameForm:GamesByEmail.Game.prototype.displayStartGameForm,
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
   updateTeamTitles:GamesByEmail.Game.prototype.updateTeamTitles,
   logUpdate:GamesByEmail.Game.prototype.logUpdate,
   titleFromTeamColor:GamesByEmail.Game.prototype.titleFromTeamColor,
   hiliteImageHtml:GamesByEmail.Game.prototype.hiliteImageHtml,
   teamColorFromTeam:GamesByEmail.Game.prototype.teamColorFromTeam,
   synchTeam:GamesByEmail.Game.prototype.synchTeam,
   setPerspective:GamesByEmail.Game.prototype.setPerspective,
   synch:GamesByEmail.Game.prototype.synch,
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
   importRawGame:GamesByEmail.Game.prototype.importRawGame,
   importData:GamesByEmail.Game.prototype.importData,
   importLog:GamesByEmail.Game.prototype.importLog,
   findPlayerByIndices:GamesByEmail.Game.prototype.findPlayerByIndices,
   washHtml:GamesByEmail.Game.prototype.washHtml,
   getHtml:GamesByEmail.Game.prototype.getHtml,
   setInnerHtml:GamesByEmail.Game.prototype.setInnerHtml,
   appendBoardHtml:GamesByEmail.Game.prototype.appendBoardHtml,
   appendBoardLayoutHtml:GamesByEmail.Game.prototype.appendBoardLayoutHtml,
   printerFriendlyLogHtml:GamesByEmail.Game.prototype.printerFriendlyLogHtml,
   printerFriendlyLog:GamesByEmail.Game.prototype.printerFriendlyLog,
   appendLogHtml:GamesByEmail.Game.prototype.appendLogHtml,
   appendGameStateRowHtml:GamesByEmail.Game.prototype.appendGameStateRowHtml,
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
   sendTeamMessage:GamesByEmail.Game.prototype.sendTeamMessage,
   clearTeamMessage:GamesByEmail.Game.prototype.clearTeamMessage,
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
   processLogMove:GamesByEmail.Game.prototype.processLogMove,
   processLogMoveEvent:GamesByEmail.Game.prototype.processLogMoveEvent,
   getLogProcessingInformation:GamesByEmail.Game.prototype.getLogProcessingInformation,
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
GamesByEmail.TutorialGame.resourcePack={
      gameFolder:"Tutorial",
      defaultFont:"14px Verdana",
      gameTypes:[-1],
      gameTypeTitles:["Tutorial"],
      allowedNumPlayers:[0],
      insertCodeAbove:"<span style=\"font-style:italic;background-color:#ffffcc;position:relative;top:-3\">above</span>",
      insertCodeBelow:"<span style=\"font-style:italic;background-color:#ffffcc;position:relative;top:3\">below</span>",
      replaceCodeAt:"<span style=\"font-style:italic;background-color:#ffffcc;text-decoration:line-through\">replace</span>",
      header:"\x3Ctable cellspacing=2 cellpadding=0 width=\"100%\" style=\"background-color:#000000;color:#ffffff\"\x3E\n\x3Ctr\x3E\n\x3Ctd nowrap align=center style=\"padding-left:5px;font-size:200%;display:%showBranding\"\x3E\x3Cb\x3EGamesByEmail.com\x3C/b\x3E\x3C/td\x3E\n\x3Ctd rowspan=2 align=center valign=middle style=\"padding-left:10px;padding-right:10px;display:%showBranding\"\x3E\x3Cimg src=\"Tutorial/Boards/Default/WhiteLogo.gif\" width=29 height=41\x3E\x3C/td\x3E\n\x3Ctd rowspan=2 nowrap width=\"100%\" align=center valign=middle style=\"font:15px bold verdana\"\x3E%previousStep Step \x3Cspan id=\"%tutorialStepNum\"\x3E%currentStep\x3C/span\x3E of 25 %nextStep\x3C/td\x3E\n\x3C/tr\x3E\n\x3Ctr\x3E\x3Ctd nowrap align=center style=\"display:%showBranding;padding-left:5px;color:#cccccc;font-size:125%\"\x3E\x3Cb\x3EGame Programmer\'s Tutorial\x3C/b\x3E\x3C/td\x3E\x3C/tr\x3E\n\x3C/table\x3E",
      initialCode:"Foundation\x2EcreateClass(\"GamesByEmail.%fGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"%f\", // The folder we are in.\n      gameTypes:[%t], // The types of games supported by this class.\n      gameTypeTitles:[\"%n\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      default_htm:"\x3Cscript\x3Evar GamesByEmail_Testing_gameFiles=[\"../Foundation\x2EControls.Clipper.js\",\"../Foundation\x2EDifferenceEngine.js\",\"../Foundation\x2EControls.Difference.js\",\"Tutorial/Game.js\",\"\x3Cfolder\x3E/Game.js\"];\x3C/script\x3E\n\x3Cscript src=\"../GamesByEmail.Testing.js\"\x3E\x3C/script\x3E\n",
      rules_htm:"\x3Ch5\x3E\x3Ca name=\"Object\"/\x3EObject\x3C/h5\x3E\n\x3Cp\x3EPlayers take turns placing pieces on the board. The first player to get three of \ntheir pieces adjacent in a straight line verticaly, horizontaly or diagonaly wins.\x3C/p\x3E \n\x3Ch5\x3E\x3Ca name=\"Moves\"/\x3EMoves\x3C/h5\x3E \n\x3Cp\x3EThe first player places \x3Cfont style=\"color:#770802;font-weight:bold\"\x3EX\x3C/font\x3Es, \nthe second player places \x3Cfont style=\"color:#008806;font-weight:bold\"\x3EO\x3C/font\x3Es. \nA piece can be placed on any empty square. When the board is full, the game is over. \nIf there is no winner, the game is a draw.\n",
      game2_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game4_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:null, // To be filled in later.\n         pieceRects:null // To be filled in later.\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game6_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:null // To be filled in later.\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game7_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game8_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game9_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game10_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // Center the piece on the cursor.\n      piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n      }\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game11_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // Center the piece on the cursor.\n      piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game12_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game13_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game14_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      this.info.board=board;\n      var opponent=this.player.team.nextTeam();\n      opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game15_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      this.info.board=board;\n      var opponent=this.player.team.nextTeam();\n      opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game16_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      this.info.board=board;\n      var opponent=this.player.team.nextTeam();\n      opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game17_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      this.info.board=board;\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game18_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      this.info.board=board;\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game19_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"    O    \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game20_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      rules:Foundation\x2EreadTextFile(\"Rules.htm\"),\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game21_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      this.debug(); // Clear the debug window\n      this.debug(screenPoint);\n       // You can also call the global debug method when testing.\n      debug(boardPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      rules:Foundation\x2EreadTextFile(\"Rules.htm\"),\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game22_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      this.debug(); // Clear the debug window\n      this.debug(screenPoint);\n       // You can also call the global debug method when testing.\n      debug(boardPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      var test=false;\n      test=true;\n      if (test && !GamesByEmail.inProduction())\n      {\n         // Insert test code here.\n         Super.initialize(2,turnTeamIndex);\n         this.type=24;\n         this.info.board=\"    X    4\";\n         this.teams[0].status.myTurn=false;\n         this.teams[1].status.myTurn=true;\n         this.move.number=1;\n         this.move.player=\"0,0\";\n         return;\n      }\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      rules:Foundation\x2EreadTextFile(\"Rules.htm\"),\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\n",
      game23_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      this.debug(); // Clear the debug window\n      this.debug(screenPoint);\n       // You can also call the global debug method when testing.\n      debug(boardPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      var test=false;\n      test=true;\n      if (test && !GamesByEmail.inProduction())\n      {\n         // Insert test code here.\n         Super.initialize(2,turnTeamIndex);\n         this.type=24;\n         this.info.board=\"    X    4\";\n         this.teams[0].status.myTurn=false;\n         this.teams[1].status.myTurn=true;\n         this.move.number=1;\n         this.move.player=\"0,0\";\n         return;\n      }\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      rules:Foundation\x2EreadTextFile(\"Rules.htm\"),\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\nFoundation\x2EincludeScripts(\"moreMethods.js\");\n",
      game24_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.TutorialGame, // This is the base class that we are extending (the tutorial for now).\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      this.debug(); // Clear the debug window\n      this.debug(screenPoint);\n       // You can also call the global debug method when testing.\n      debug(boardPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      var test=false;\n      test=true;\n      if (test && !GamesByEmail.inProduction())\n      {\n         // Insert test code here.\n         Super.initialize(2,turnTeamIndex);\n         this.type=24;\n         this.info.board=\"    X    4\";\n         this.teams[0].status.myTurn=false;\n         this.teams[1].status.myTurn=true;\n         this.move.number=1;\n         this.move.player=\"0,0\";\n         return;\n      }\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      rules:Foundation\x2EreadTextFile(\"Rules.htm\"),\n      profilerSettings:{interest:[\"mouseUp\"\n                                 ]\n                       },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\nFoundation\x2EincludeScripts(\"moreMethods.js\");\n",
      game25_js:"Foundation\x2EcreateClass(\"GamesByEmail.TicTacToeGame\",\nGamesByEmail.Game, // This is the base class that we are extending.\nfunction()\n{\n   // This is our class contructor.\n},\n{\n   // This will hold our methods and properties.\n   checkForDraw:function(board)\n   {\n      // Use the forEachBoardPoint method which will call the named method \n      //   once for each point on the board, passed as the first parameter, \n      //   other parameters passed too. If the named method returns a value \n      //   that evaluates to true, processing is stopped and that value is \n      //   returned by forEachBoardPoint, else null is returned. \n      return !this.forEachBoardPoint(\"isMoveLegal\",board);\n   },\n   checkThreeSpaces:function(board,value,x1,y1,x2,y2,x3,y3)\n   {\n      return (this.valueFromXYBoard(x1,y1,board)==value &&\n              this.valueFromXYBoard(x2,y2,board)==value &&\n              this.valueFromXYBoard(x3,y3,board)==value);\n   },\n   checkForWin:function(board,color)\n   {\n      var value=(color==0 ? \'X\' : \'O\');\n      return (this.checkThreeSpaces(board,value,0,0,1,0,2,0) || // Check horizontals...\n              this.checkThreeSpaces(board,value,0,1,1,1,2,1) ||\n              this.checkThreeSpaces(board,value,0,2,1,2,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,0,1,0,2) || // Check verticals...\n              this.checkThreeSpaces(board,value,1,0,1,1,1,2) ||\n              this.checkThreeSpaces(board,value,2,0,2,1,2,2) ||\n              this.checkThreeSpaces(board,value,0,0,1,1,2,2) || // Check diagonals...\n              this.checkThreeSpaces(board,value,0,2,1,1,2,0));\n   },\n   sendMove:function()\n   {\n      this.clearMouseEvents();\n      var board=this.pieces.getValue();\n      var piece=this.pieces.getNewPiece();\n      var hiliteIndex=this.valueIndexFromBoardPoint(piece.boardPoint);\n      this.info.board=board+hiliteIndex.toString();\n      var opponent=this.player.team.nextTeam();\n      if (this.checkForWin(board,this.player.team.color))\n         this.setEnded(this.player.team);\n      else\n         if (this.checkForDraw(board))\n         {\n            // Our board must be full, the game ended in a draw.\n            this.setEnded();\n            this.status.draw=true;\n            this.status.stalemate=true;\n            // Teams tie.\n            this.player.team.status.drew=true;\n            opponent.status.drew=true;\n            // Notify opponent game ended with draw.\n            opponent.notify.lost=true;\n            opponent.notify.won=true;\n         }\n         else\n            opponent.setExclusiveTurn();\n      return Super.sendMove();\n   },\n   mouseUp:function(screenPoint)\n   {\n      // First, undo a move if we have already made one.\n      if (this.madeMove)\n         this.undo();\n      // Then get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Next, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      // Now test to see if the move is legal. Move to the board point if it is.\n      if (this.checkMove(boardPoint))\n      {\n         this.clearHilites();\n         piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n         piece.move(boardPoint,false);\n         // Set the madeMove flag to true...\n         this.madeMove=true;\n         // ...and that the move is ready to send...\n         this.readyToSend=true;\n         // ...then update the game controls.\n         this.update();\n      }\n   },\n   isMoveLegal:function(toPoint,boardValue)\n   {\n      // A legal move for Tic-Tac-Toe is any square where there is no piece.\n      // First, get the value index for the board point (square) we are testing.\n      var valueIndex=this.valueIndexFromBoardPoint(toPoint);\n      // Then return true if the value at that index is a space (and the move legal), or false if not.\n      return (boardValue.charAt(valueIndex)==\' \');\n   },\n   checkMove:function(toPoint)\n   {\n      // Get the board state value and pass it to isMoveLegal.\n      return this.isMoveLegal(toPoint,this.pieces.getValue());\n   },\n   mouseOut:function(screenPoint)\n   {\n      // First get the new piece.\n      var piece=this.pieces.getNewPiece();\n      // Reset the piece.\n      piece.reset();\n   },\n   mouseMove:function(screenPoint)\n   {\n      // First get the new piece we are adding.\n      var piece=this.pieces.getNewPiece();\n      // Set it as an X or O, depending on the \'color\' of the team we are playing.\n      piece.setValue(this.player.team.color==0 ? \'X\' : \'O\');\n      // First, get the board point from the screen point.\n      var boardPoint=this.boardPointFromScreenPoint(screenPoint);\n      this.debug(); // Clear the debug window\n      this.debug(screenPoint);\n       // You can also call the global debug method when testing.\n      debug(boardPoint);\n      // Now test to see if the move is legal. Snap to the board point if it is, else center on the cursor.\n      if (this.checkMove(boardPoint))\n         piece.snap(boardPoint);\n      else\n         piece.center(screenPoint);\n   },\n   itsYourTurnHtml:function(resourceName)\n   {\n      // Make sure to only hook movement if we have not placed a piece yet.\n      if (!this.madeMove)\n      {\n         this.onMouseMove=\"mouseMove\"; // Have our mouseMove method called when the mouse is over the board.\n         this.onMouseOut=\"mouseOut\"; // Have our mouseOut method called when the mouse leaves the board.\n      }\n      this.onLeftMouseUp=\"mouseUp\"; // Have our mouseUp method called when a mouse button is released over the board.\n      return Super.itsYourTurnHtml(resourceName); // Call the parent class\' itsYourTurnHtml method.\n   },\n   synch:function()\n   {\n      Super.synch(); // Call the parent class\' synch method to do whatever it does.\n      if (this.info.board.length\x3E9)\n      {\n         var hiliteIndex=parseInt(this.info.board.charAt(9));\n         var hilitePoint=this.boardPointFromValueIndex(hiliteIndex);\n         var hiliteHtml=this.hiliteImageHtml(hilitePoint,this.board.pieceRects.hilite);\n         this.setOverlayHtml(hiliteHtml);\n      }\n      else\n         this.setOverlayHtml(\"\");\n      this.pieces.setValue(this.info.board); // Set value of the pieces collection to that of info.board.\n   },\n   initialize:function(numPlayers,turnTeamIndex)\n   {\n      var test=false;\n      test=true;\n      if (test && !GamesByEmail.inProduction())\n      {\n         // Insert test code here.\n         Super.initialize(2,turnTeamIndex);\n         this.type=24;\n         this.info.board=\"    X    4\";\n         this.teams[0].status.myTurn=false;\n         this.teams[1].status.myTurn=true;\n         this.move.number=1;\n         this.move.player=\"0,0\";\n         return;\n      }\n      Super.initialize(numPlayers,turnTeamIndex); // Call the parent class\' initialize method to create the teams and players.\n      // Instead of starting with an empty board, for testing \n      // purposes we will start with an O in the middle space.\n      this.info.board=\"         \"; // Set info.board to a string of 9 spaces to represent an empty board.\n   }\n},\n{\n   // This will hold our static methods and properties.\n\n   // the resourcePack is a collection of information\n   // used throughout the class.\n   resourcePack:{\n      gameFolder:\"TicTacToe\", // The folder we are in.\n      gameTypes:[24], // The types of games supported by this class.\n      gameTypeTitles:[\"Tic-Tac-Toe\"], // The titles of games supported by this class.\n      allowedNumPlayers:[2], // A list of the number of players allowed in a game.\n      teamTitles:[\"X\",\"O\"],\n      teamFontColors:[\"#770802\",\"#008806\"],\n      itIsYourTurnToMove:\"\x3Cp\x3EIt is your turn to move. Place a piece to make any %rlegal move\x3C/a\x3E. After you move you will have the option of sending or undoing the move.\", // Change the default prompt.\n      board:{  // Various information about our game board.\n         image:{  // Information about the board image.\n            src:\"Board.gif\",  // The path and name of the image file, relative to the Default folder.\n            size:new Foundation\x2EPoint(255,255)  // The width and height of the board image, in pixels.\n         },\n         border:new Foundation\x2EPoint(0,0),  // The size of any left and top border going around the board, in pixels.\n         squareSize:new Foundation\x2EPoint(85,85),  // The width and height of each square in the board image, in pixels.\n         size:new Foundation\x2EPoint(3,3),  // The number of squares that make up the board, horizontally and vertically.\n         pieceImage:\"Pieces.gif\", // The path and name of the image file, relative to the Default folder.\n         pieceRects:{ // Clipping rectangles for the pieces.\n            X:new Foundation\x2ERectangle(0,0,85,85),\n            O:new Foundation\x2ERectangle(85,0,85,85),\n            hilite:new Foundation\x2ERectangle(170,0,85,85)\n         }\n      },\n      rules:Foundation\x2EreadTextFile(\"Rules.htm\"),\n      profilerSettings:{interest:[\"mouseUp\"\n                                 ]\n                       },\n      theVeryLastResource:\"\" // Insert new resources above here. \n   }\n});\nFoundation\x2EincludeScripts(\"moreMethods.js\");\n",
      moreMethods_js:"// Append methods and properties to an existing class.\nFoundation\x2EappendToClass(GamesByEmail.TicTacToeGame,\n{\n   getHeaderHtml:function(resourceName)\n   {\n      return \"hello world\x3Cbr\x3E\"+Super.getHeaderHtml(resourceName);\n   }\n});\n"
   }
;
GamesByEmail.TutorialGame.getTypePath=GamesByEmail.Game.getTypePath;
GamesByEmail.TutorialGame.resource=GamesByEmail.Game.resource;
GamesByEmail.TutorialGame.resourceUrl=GamesByEmail.Game.resourceUrl;
GamesByEmail.TutorialGame.getById=GamesByEmail.Game.getById;
GamesByEmail.TutorialGame.getFirst=GamesByEmail.Game.getFirst;
GamesByEmail.TutorialGame.getNext=GamesByEmail.Game.getNext;
GamesByEmail.TutorialGame.processHtml=GamesByEmail.Game.processHtml;
GamesByEmail.TutorialGame.isInstanceOf=GamesByEmail.Game.isInstanceOf;
GamesByEmail.TutorialGame.addToPage=GamesByEmail.Game.addToPage;
GamesByEmail.TutorialGame.folder=GamesByEmail.Game.folder;
GamesByEmail.TutorialGame.$constructor();



String.prototype.getDimensions=function()
{
   var text=this.split("\n");
   var size=new Foundation.Point(text[0].length,text.length);
   for (var i=1;i<text.length;i++)
      if (text[i].length>size.x)
         size.x=text[i].length;
   size.x++;
//   if (text[text.length-1].length==0)
  //    size.y--;
   return size;
};
String.prototype.copyAndPaste=function(newLine,id)
{
   var html="";
   if (newLine)
      html+="<br>";
   var size=this.getDimensions();
   if (size.y==1)
      html+="<input type=text id=\""+(id ? id : "")+"\" readonly size=\""+size.x+"\" style=\"font-family:fixedsys;overflow:visible;background-color:#eeeeee\" onfocus=\"this.select()\" value=\""+this.htmlEncode()+"\">";
   else
      html+="<textarea id=\""+(id ? id : "")+"\" readonly wrap=off rows=\""+size.y+"\" style=\"width:100%;font-family:fixedsys;overflow:visible;background-color:#eeeeee\" onfocus=\"this.select()\">"+this.htmlEncode()+"</textarea>";
   return html;
};
String.prototype.fileSystemNameHtml=function(id)
{
   return "<span id=\""+(id ? id : "")+"\" style=\"font-family:fixedsys;background-color:#eeeeee\">"+this.htmlEncode()+"</span>";
};
String.prototype.codeNameHtml=function(id)
{
   return "<span id=\""+(id ? id : "")+"\" style=\"font-family:fixedsys;background-color:#eeeeee\">"+this.htmlEncode()+"</span>";
};
String.prototype.existingCodeHtml=function(id)
{
   var html="";
   var size=this.getDimensions();
   html+="<div style=\"position:relative\">";
   if (size.y==1)
      html+="<input type=text id=\""+(id ? id : "")+"\" class=\"sourcecode\" readonly style=\"position:absolute;left:-3;top:-3;font-family:fixedsys;width:100%;overflow:visible;border:1px solid black;margin:3px;padding:2px\" value=\""+this.htmlEncode()+"\">";
   else
      html+="<textarea id=\""+(id ? id : "")+"\" class=\"sourcecode\" readonly wrap=off rows=\""+size.y+"\" style=\"position:absolute;left:-3;top:-3;font-family:fixedsys;width:100%;overflow:visible;border:1px solid black;margin:3px;padding:2px\">"+this.htmlEncode()+"</textarea>";
   html+="&nbsp;</div>";
   return html;
};
String.prototype.newCodeHtml=function(id)
{
   var html="";
   var size=this.getDimensions();
   html+="<div style=\"position:relative\">";
   if (size.y==1)
      html+="<input type=text id=\""+(id ? id : "")+"\" class=\"sourcecode\" readonly style=\"position:absolute;left:-3;top:-3;font-family:fixedsys;width:100%;overflow:visible;border:1px solid black;margin:3px;padding:2px;background-color:#eeeeee;\" onfocus=\"this.select()\" value=\""+this.htmlEncode()+"\">";
   else
      html+="<textarea id=\""+(id ? id : "")+"\" class=\"sourcecode\" readonly wrap=off rows=\""+size.y+"\" style=\"position:absolute;left:-3;top:-3;font-family:fixedsys;width:100%;overflow:visible;border:1px solid black;margin:3px;padding:2px;background-color:#eeeeee\" onfocus=\"this.select()\">"+this.htmlEncode()+"</textarea>";
   html+="&nbsp;</div>";
   return html;
};

}
