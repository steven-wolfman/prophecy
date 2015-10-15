/*
Foundation.Server
Copyright © 2005-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Server.htm
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
if (!Foundation.exists("Foundation.server"))
{
   Foundation.jsSerialize=function(data,stringBuilder)
      {
         if (!stringBuilder)
            return Foundation.jsSerialize(data,new Foundation.StringBuilder()).toString();
         var dataType=typeof(data);
         if (dataType=="undefined")
            return stringBuilder;
         if (data==null)
            return stringBuilder.append("null");
         if (typeof(data.jsSerialize)=="function")
            return data.jsSerialize(stringBuilder);
         if (Foundation.isDate(data.constructor))
            return stringBuilder.append("new Date("+data.valueOf()+")");
         if (dataType=="object")
         {
            data=data.valueOf();
            dataType=typeof(data);
            if (dataType=="undefined")
               return stringBuilder;
            if (data==null)
               return stringBuilder.append("null");
         }
         if (dataType=="string")
            return stringBuilder.append("\""+data.cEncode()+"\"");
         if (dataType=="number")
            return stringBuilder.append(data.toString());
         if (dataType=="boolean")
            return stringBuilder.append(data.toString());
         if (dataType=="object")
         {
            if (Foundation.isArray(data.constructor))
            {
               stringBuilder.append("[");
               for (var i=0;i<data.length;i++)
               {
                  if (i>0)
                     stringBuilder.append(",");
                  Foundation.jsSerialize(data[i],stringBuilder);
               }
               return stringBuilder.append("]");
            }
            var comma=false;
            stringBuilder.append("{");
            for (var i in data)
               if (i!="constructor" && i!="prototype" && i.charAt(0)!='$' && typeof(data[i])!="function")
                  comma=Foundation.jsSerializeProperty(stringBuilder,i,data[i],comma);
            return stringBuilder.append("}");
         }
         stringBuilder.append("\""+data.toString().cEncode()+"\"");
         return stringBuilder;
      };
Foundation.isArray=function(constructor)
      {
         if (constructor==Array)
            return true;
         if (constructor.$parentClass)
            return Foundation.isArray(constructor.$parentClass);
         var a=constructor.toString().indexOf("function Array() {");
         if (a>=0 && a<=5)
            return true;
         return false;
      };
Foundation.isDate=function(constructor)
      {
         if (constructor==Date)
            return true;
         var a=constructor.toString().indexOf("function Date() {");
         if (a>=0 && a<=5)
            return true;
         return false;
      };
Foundation.jsSerializeProperty=function(stringBuilder,dataName,dataValue,comma)
      {
         if (comma)
            stringBuilder.append(",");
         stringBuilder.append(dataName);
         stringBuilder.append(":");
         Foundation.jsSerialize(dataValue,stringBuilder);
         return true;
      };

   (function()
   {
      var guid=null;
      var requestNum=0;
      var maxUrlLength=2000-(typeof(document)=="undefined" ? 0 : document.location.href.length);
      var postThresholdLength=200;
      function getGuid(url)
      {
         if (guid==null)
         {
            try
            {
               var request=Foundation.getXmlHttpRequest();
               request.open("GET",url+"?guidRequest=true&noCache="+Date.parse(new Date()),false);
               request.send("");
               if (request.status!=200)
                  throw("guid req failed");
               guid=eval(request.responseText);
               request=null;
            }
            catch(e)
            {
               guid=Date.parse(new Date())+"."+Math.floor(Math.random()*10000);
            }
         }
         return guid;
      }
      function getBreakLength(value,length)
      {
         if (length>=value.length)
            return value.length;
         for (var i=1;i<3;i++)
            if (value.charAt(length-i)=='%')
               return length-i;
         return length;
      }
      function getArgArray(url0,partUrl,url,noCache,args)
      {
         var argArray=new Array();
         var length=getBreakLength(args,maxUrlLength-url0.length-partUrl.length-4);
         argArray[0]=args.substr(0,length);
         args=args.substr(length);
         var workingLength=maxUrlLength-url.length-9-noCache.length-partUrl.length-4-17;
         while (args.length>0)
         {
            var length=getBreakLength(args,workingLength);
            argArray[argArray.length]=args.substr(0,length);
            args=args.substr(length);
         }
         return argArray;
      }
      function getExecuteUrls(debug,callback,url,serverFunction,serializedEncodedArgs,argCount)
      {
         var urls=new Array();
         var noCache=Date.parse(new Date())+"_"+requestNum;
         urls[0]=url+
                 "?noCache="+noCache+
                 (debug ? "&debug=true" : "")+
                 "&callback="+callback.urlEncode()+
                 "&function="+serverFunction.urlEncode()+
                 "&argCount="+argCount+
                 "&args=";
         if (urls[0].length+serializedEncodedArgs.length<=maxUrlLength)
            urls[0]+=serializedEncodedArgs;
         else
         {
            var partUrl="&guid="+getGuid(url)+
                        "&reqId="+requestNum+
                        "&numParts=####"+
                        "&partNum=";
            var argArray=getArgArray(urls[0],partUrl,url,noCache,serializedEncodedArgs);
            partUrl=partUrl.replace("####",argArray.length);
            urls[0]+=argArray[0]+partUrl+"0";
            for (var i=1;i<argArray.length;i++)
               urls[i]=url+"?noCache="+noCache+(debug ? "&debug=true" : "")+partUrl+i.toString()+"&args="+argArray[i];
         }
         return urls;
      }
      function doExecuteGet(debug,catchFunction,callback,url,serverFunction,args,argCount)
      {
         var execUrls=getExecuteUrls(debug,callback,url,serverFunction,args,argCount,false);
         for (var i=0;i<execUrls.length;i++)
            Foundation.loadScript(execUrls[i],null,debug,catchFunction);
      }
      function doExecutePost(catchFunction,callback,url,serverFunction,args,argCount)
      {
         var postData="callback="+callback.urlEncode()+
                      "&function="+serverFunction.urlEncode()+
                      "&argCount="+argCount+
                      "&args="+args;
         return Foundation.loadScript(url+"?noCache="+Date.parse(new Date())+"_"+requestNum,postData,false,catchFunction);
      }
      function doExecute(debug,catchFunction,callback,url,serverFunction,args,argCount)
      {
         args=args.toString().urlEncode();
         if (debug || args.length<postThresholdLength || !doExecutePost(catchFunction,callback,url,serverFunction,args,argCount))
            doExecuteGet(debug,catchFunction,callback,url,serverFunction,args,argCount);
         requestNum++;
         return true;
      }
      Foundation.server=function(callback,url,serverFunction)
         {
            if (arguments.length<3)
               return false;
            var args=new Array();
            for (var i=3;i<arguments.length;i++)
               args[args.length]=arguments[i];
            return doExecute(this.serverDebug,this.serverCatch,callback,url,serverFunction,Foundation.jsSerialize(args),arguments.length-3);
         };
Foundation.serverSerialized=function(callback,url,serverFunction)
         {
            if (arguments.length<3)
               return false;
            var args="[";
            for (var i=3;i<arguments.length;i++)
            {
               var a=arguments[i];
               if (i>3)
                  args+=",";
               if (typeof(a)=="string")
                  args+=a;
               else
               {
                  args+="[";
                  for (var j=0;j<a.length;j++)
                  {
                     if (j>0)
                        args+=",";
                     args+=a[j];
                  }
                  args+="]";
               }
            }
            args+="]";
            return doExecute(this.serverDebug,this.serverCatch,callback,url,serverFunction,args,arguments.length-3);
         };
Foundation.serverSynchronous=function(url,serverFunction)
         {
            if (arguments.length<2)
               return null;
            var args=new Array(arguments.length-2);
            for (var i=2;i<arguments.length;i++)
               args[i-2]=arguments[i];
            var execUrls=getExecuteUrls(false,"",Foundation.conformUrlToDocumentDomain(url),serverFunction,Foundation.jsSerialize(args),args.length);
            var request=Foundation.getXmlHttpRequest();
            for (var i=0;i<execUrls.length;i++)
            {
               request.open("GET",execUrls[i],false);
               request.send("");
               if (typeof(request.responseText)!="string" || request.responseText.length==0)
                  throw("synch call failed");
            }
            var returnValue=eval(request.responseText);
            request=null;
            return returnValue;
         };

   })();
   
   Foundation.Server=function(){};
Foundation.Server.$parentClass=null;
Foundation.Server.$constructor=function(){};
Foundation.Server.$interfaces=new Array();
Foundation.Server.$interfaces.push(Foundation.Interface);
if (!Foundation.Interface.$childClasses) Foundation.Interface.$childClasses=new Array();
Foundation.Interface.$childClasses.push(Foundation.Server);
Foundation.Server.$name="Server";
Foundation.Server.$childClasses=new Array();
Foundation.Server.$container=Foundation;
Foundation.Server.prototype={
   constructor:Foundation.Server,
   server:function(callbackEvent,domainResourceKey,urlResourceKey,serverFunction)
      {
         var args=new Array(arguments.length-1);
         args[0]=this.event(callbackEvent);
         args[1]=this.resource(domainResourceKey)+this.resource(urlResourceKey);
         for (var i=3;i<arguments.length;i++)
            args[i-1]=arguments[i];
         return Foundation.server.apply(this,args);

      },
   serverSerialized:function(callbackEvent,domainResourceKey,urlResourceKey,serverFunction)
      {
         var args=new Array(arguments.length-1);
         args[0]=this.event(callbackEvent);
         args[1]=this.resource(domainResourceKey)+this.resource(urlResourceKey);
         for (var i=3;i<arguments.length;i++)
            args[i-1]=arguments[i];
         return Foundation.serverSerialized.apply(this,args);
      },
   serverSynchronous:function(domainResourceKey,urlResourceKey,serverFunction)
      {
         var args=new Array(arguments.length-1);
         args[0]=this.resource(domainResourceKey)+this.resource(urlResourceKey);
         for (var i=2;i<arguments.length;i++)
            args[i-1]=arguments[i];
         return Foundation.serverSynchronous.apply(this,args);
      },
   dispose:function()
   {
   }
};
Foundation.Server.getTypePath=Foundation.Interface.getTypePath;
Foundation.Server.$constructor();

}
