/*
Foundation
Copyright © 2005-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
var Foundation;
if (!Foundation)
{
if (typeof(String.prototype.trim)!="function")String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"");};
if (typeof(String.prototype.setAt)!="function")String.prototype.setAt=function(index,value){value=value.toString();return this.substr(0,index)+value+this.substr(index+value.length);};
if (typeof(String.prototype.startsWith)!="function")String.prototype.startsWith=function(v){return(this.length>=v.length&&this.substr(0,v.length)==v);};
if (typeof(String.prototype.endsWith)!="function")String.prototype.endsWith=function(v){return(this.length>=v.length&&this.substr(this.length-v.length)==v);};
if (typeof(String.prototype.htmlEncode)!="function")String.prototype.htmlEncode=function(all){return all?this.replace(/[\s\S]/g,function(m){return "&#"+m.charCodeAt(0).toString(10)+";"}):this.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");};
if (typeof(String.prototype.htmlDecode)!="function")String.prototype.htmlDecode=function(){var parts=this.split("&#");var value=parts[0];for(var i=1;i<parts.length;i++){var s=parts[i].indexOf(";");var c=parseInt(parts[i].substr(0,s));if(c==38)value+="&amp;";else value+=String.fromCharCode(c);value+=parts[i].substr(s+1);}var seqs=new Array(/&nbsp;/gi,String.fromCharCode(160),/&iexcl;/gi,String.fromCharCode(161),/&cent;/gi,String.fromCharCode(162),/&pound;/gi,String.fromCharCode(163),/&curren;/gi,String.fromCharCode(164),/&yen;/gi,String.fromCharCode(165),/&brvbar;/gi,String.fromCharCode(166),/&sect;/gi,String.fromCharCode(167),/&uml;/gi,String.fromCharCode(168),/&copy;/gi,String.fromCharCode(169),/&ordf;/gi,String.fromCharCode(170),/&laquo;/gi,String.fromCharCode(171),/&not;/gi,String.fromCharCode(172),/&shy;/gi,String.fromCharCode(173),/&reg;/gi,String.fromCharCode(174),/&macr;/gi,String.fromCharCode(175),/&deg;/gi,String.fromCharCode(176),/&plusmn;/gi,String.fromCharCode(177),/&sup2;/gi,String.fromCharCode(178),/&sup3;/gi,String.fromCharCode(179),/&acute;/gi,String.fromCharCode(180),/&micro;/gi,String.fromCharCode(181),/&para;/gi,String.fromCharCode(182),/&middot;/gi,String.fromCharCode(183),/&cedil;/gi,String.fromCharCode(184),/&sup1;/gi,String.fromCharCode(185),/&ordm;/gi,String.fromCharCode(186),/&raquo;/gi,String.fromCharCode(187),/&frac14;/gi,String.fromCharCode(188),/&frac12;/gi,String.fromCharCode(189),/&frac34;/gi,String.fromCharCode(190),/&iquest;/gi,String.fromCharCode(191),/&agrave;/gi,String.fromCharCode(192),/&aacute;/gi,String.fromCharCode(193),/&acirc;/gi,String.fromCharCode(194),/&atilde;/gi,String.fromCharCode(195),/&Auml;/gi,String.fromCharCode(196),/&aring;/gi,String.fromCharCode(197),/&aelig;/gi,String.fromCharCode(198),/&ccedil;/gi,String.fromCharCode(199),/&egrave;/gi,String.fromCharCode(200),/&eacute;/gi,String.fromCharCode(201),/&ecirc;/gi,String.fromCharCode(202),/&euml;/gi,String.fromCharCode(203),/&igrave;/gi,String.fromCharCode(204),/&iacute;/gi,String.fromCharCode(205),/&icirc;/gi,String.fromCharCode(206),/&iuml;/gi,String.fromCharCode(207),/&eth;/gi,String.fromCharCode(208),/&ntilde;/gi,String.fromCharCode(209),/&ograve;/gi,String.fromCharCode(210),/&oacute;/gi,String.fromCharCode(211),/&ocirc;/gi,String.fromCharCode(212),/&otilde;/gi,String.fromCharCode(213),/&Ouml;/gi,String.fromCharCode(214),/&times;/gi,String.fromCharCode(215),/&oslash;/gi,String.fromCharCode(216),/&ugrave;/gi,String.fromCharCode(217),/&uacute;/gi,String.fromCharCode(218),/&ucirc;/gi,String.fromCharCode(219),/&Uuml;/gi,String.fromCharCode(220),/&yacute;/gi,String.fromCharCode(221),/&thorn;/gi,String.fromCharCode(222),/&szlig;/gi,String.fromCharCode(223),/&agrave;/gi,String.fromCharCode(224),/&aacute;/gi,String.fromCharCode(225),/&acirc;/gi,String.fromCharCode(226),/&atilde;/gi,String.fromCharCode(227),/&auml;/gi,String.fromCharCode(228),/&aring;/gi,String.fromCharCode(229),/&aelig;/gi,String.fromCharCode(230),/&ccedil;/gi,String.fromCharCode(231),/&egrave;/gi,String.fromCharCode(232),/&eacute;/gi,String.fromCharCode(233),/&ecirc;/gi,String.fromCharCode(234),/&euml;/gi,String.fromCharCode(235),/&igrave;/gi,String.fromCharCode(236),/&iacute;/gi,String.fromCharCode(237),/&icirc;/gi,String.fromCharCode(238),/&iuml;/gi,String.fromCharCode(239),/&eth;/gi,String.fromCharCode(240),/&ntilde;/gi,String.fromCharCode(241),/&ograve;/gi,String.fromCharCode(242),/&oacute;/gi,String.fromCharCode(243),/&ocirc;/gi,String.fromCharCode(244),/&otilde;/gi,String.fromCharCode(245),/&ouml;/gi,String.fromCharCode(246),/&divide;/gi,String.fromCharCode(247),/&Oslash;/gi,String.fromCharCode(248),/&ugrave;/gi,String.fromCharCode(249),/&uacute;/gi,String.fromCharCode(250),/&ucirc;/gi,String.fromCharCode(251),/&uuml;/gi,String.fromCharCode(252),/&yacute;/gi,String.fromCharCode(253),/&thorn;/gi,String.fromCharCode(254),/&yuml;/gi,String.fromCharCode(255),/&oelig;/gi,String.fromCharCode(338),/&oelig;/gi,String.fromCharCode(339),/&scaron;/gi,String.fromCharCode(352),/&scaron;/gi,String.fromCharCode(353),/&yuml;/gi,String.fromCharCode(376),/&circ;/gi,String.fromCharCode(710),/&tilde;/gi,String.fromCharCode(732),/&ensp;/gi,String.fromCharCode(8194),/&emsp;/gi,String.fromCharCode(8195),/&thinsp;/gi,String.fromCharCode(8201),/&zwnj;/gi,String.fromCharCode(8204),/&zwj;/gi,String.fromCharCode(8205),/&lrm;/gi,String.fromCharCode(8206),/&rlm;/gi,String.fromCharCode(8207),/&ndash;/gi,String.fromCharCode(8211),/&mdash;/gi,String.fromCharCode(8212),/&lsquo;/gi,String.fromCharCode(8216),/&rsquo;/gi,String.fromCharCode(8217),/&sbquo;/gi,String.fromCharCode(8218),/&ldquo;/gi,String.fromCharCode(8220),/&rdquo;/gi,String.fromCharCode(8221),/&bdquo;/gi,String.fromCharCode(8222),/&dagger;/gi,String.fromCharCode(8224),/&dagger;/gi,String.fromCharCode(8225),/&permil;/gi,String.fromCharCode(8240),/&lsaquo;/gi,String.fromCharCode(8249),/&rsaquo;/gi,String.fromCharCode(8250),/&euro;/gi,String.fromCharCode(8364),/&fnof;/gi,String.fromCharCode(402),/&alpha;/gi,String.fromCharCode(913),/&beta;/gi,String.fromCharCode(914),/&gamma;/gi,String.fromCharCode(915),/&delta;/gi,String.fromCharCode(916),/&epsilon;/gi,String.fromCharCode(917),/&zeta;/gi,String.fromCharCode(918),/&eta;/gi,String.fromCharCode(919),/&theta;/gi,String.fromCharCode(920),/&iota;/gi,String.fromCharCode(921),/&kappa;/gi,String.fromCharCode(922),/&lambda;/gi,String.fromCharCode(923),/&mu;/gi,String.fromCharCode(924),/&nu;/gi,String.fromCharCode(925),/&xi;/gi,String.fromCharCode(926),/&omicron;/gi,String.fromCharCode(927),/&pi;/gi,String.fromCharCode(928),/&rho;/gi,String.fromCharCode(929),/&sigma;/gi,String.fromCharCode(931),/&tau;/gi,String.fromCharCode(932),/&upsilon;/gi,String.fromCharCode(933),/&phi;/gi,String.fromCharCode(934),/&chi;/gi,String.fromCharCode(935),/&psi;/gi,String.fromCharCode(936),/&omega;/gi,String.fromCharCode(937),/&alpha;/gi,String.fromCharCode(945),/&beta;/gi,String.fromCharCode(946),/&gamma;/gi,String.fromCharCode(947),/&delta;/gi,String.fromCharCode(948),/&epsilon;/gi,String.fromCharCode(949),/&zeta;/gi,String.fromCharCode(950),/&eta;/gi,String.fromCharCode(951),/&theta;/gi,String.fromCharCode(952),/&iota;/gi,String.fromCharCode(953),/&kappa;/gi,String.fromCharCode(954),/&lambda;/gi,String.fromCharCode(955),/&mu;/gi,String.fromCharCode(956),/&nu;/gi,String.fromCharCode(957),/&xi;/gi,String.fromCharCode(958),/&omicron;/gi,String.fromCharCode(959),/&pi;/gi,String.fromCharCode(960),/&rho;/gi,String.fromCharCode(961),/&sigmaf;/gi,String.fromCharCode(962),/&sigma;/gi,String.fromCharCode(963),/&tau;/gi,String.fromCharCode(964),/&upsilon;/gi,String.fromCharCode(965),/&phi;/gi,String.fromCharCode(966),/&chi;/gi,String.fromCharCode(967),/&psi;/gi,String.fromCharCode(968),/&omega;/gi,String.fromCharCode(969),/&thetasym;/gi,String.fromCharCode(977),/&upsih;/gi,String.fromCharCode(978),/&piv;/gi,String.fromCharCode(982),/&bull;/gi,String.fromCharCode(8226),/&hellip;/gi,String.fromCharCode(8230),/&prime;/gi,String.fromCharCode(8242),/&prime;/gi,String.fromCharCode(8243),/&oline;/gi,String.fromCharCode(8254),/&frasl;/gi,String.fromCharCode(8260),/&weierp;/gi,String.fromCharCode(8472),/&image;/gi,String.fromCharCode(8465),/&real;/gi,String.fromCharCode(8476),/&trade;/gi,String.fromCharCode(8482),/&alefsym;/gi,String.fromCharCode(8501),/&larr;/gi,String.fromCharCode(8592),/&uarr;/gi,String.fromCharCode(8593),/&rarr;/gi,String.fromCharCode(8594),/&darr;/gi,String.fromCharCode(8595),/&harr;/gi,String.fromCharCode(8596),/&crarr;/gi,String.fromCharCode(8629),/&larr;/gi,String.fromCharCode(8656),/&uarr;/gi,String.fromCharCode(8657),/&rarr;/gi,String.fromCharCode(8658),/&darr;/gi,String.fromCharCode(8659),/&harr;/gi,String.fromCharCode(8660),/&forall;/gi,String.fromCharCode(8704),/&part;/gi,String.fromCharCode(8706),/&exist;/gi,String.fromCharCode(8707),/&empty;/gi,String.fromCharCode(8709),/&nabla;/gi,String.fromCharCode(8711),/&isin;/gi,String.fromCharCode(8712),/&notin;/gi,String.fromCharCode(8713),/&ni;/gi,String.fromCharCode(8715),/&prod;/gi,String.fromCharCode(8719),/&sum;/gi,String.fromCharCode(8721),/&minus;/gi,String.fromCharCode(8722),/&lowast;/gi,String.fromCharCode(8727),/&radic;/gi,String.fromCharCode(8730),/&prop;/gi,String.fromCharCode(8733),/&infin;/gi,String.fromCharCode(8734),/&ang;/gi,String.fromCharCode(8736),/&and;/gi,String.fromCharCode(8743),/&or;/gi,String.fromCharCode(8744),/&cap;/gi,String.fromCharCode(8745),/&cup;/gi,String.fromCharCode(8746),/&int;/gi,String.fromCharCode(8747),/&there4;/gi,String.fromCharCode(8756),/&sim;/gi,String.fromCharCode(8764),/&cong;/gi,String.fromCharCode(8773),/&asymp;/gi,String.fromCharCode(8776),/&ne;/gi,String.fromCharCode(8800),/&equiv;/gi,String.fromCharCode(8801),/&le;/gi,String.fromCharCode(8804),/&ge;/gi,String.fromCharCode(8805),/&sub;/gi,String.fromCharCode(8834),/&sup;/gi,String.fromCharCode(8835),/&nsub;/gi,String.fromCharCode(8836),/&sube;/gi,String.fromCharCode(8838),/&supe;/gi,String.fromCharCode(8839),/&oplus;/gi,String.fromCharCode(8853),/&otimes;/gi,String.fromCharCode(8855),/&perp;/gi,String.fromCharCode(8869),/&sdot;/gi,String.fromCharCode(8901),/&lceil;/gi,String.fromCharCode(8968),/&rceil;/gi,String.fromCharCode(8969),/&lfloor;/gi,String.fromCharCode(8970),/&rfloor;/gi,String.fromCharCode(8971),/&lang;/gi,String.fromCharCode(9001),/&rang;/gi,String.fromCharCode(9002),/&loz;/gi,String.fromCharCode(9674),/&spades;/gi,String.fromCharCode(9824),/&clubs;/gi,String.fromCharCode(9827),/&hearts;/gi,String.fromCharCode(9829),/&diams;/gi,String.fromCharCode(9830),/&quot;/gi,String.fromCharCode(34),/&lt;/gi,String.fromCharCode(60),/&gt;/gi,String.fromCharCode(62),/&amp;/gi,String.fromCharCode(38));for(var i=1;i<seqs.length;i+=2)value=value.replace(seqs[i-1],seqs[i]);return value;};
if (typeof(String.prototype.xmlEncode)!="function")String.prototype.xmlEncode=function(all){return all?this.replace(/[\s\S]/g,function(m){return "&#"+m.charCodeAt(0).toString(10)+";"}):this.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&apos;");};
if (typeof(String.prototype.xmlDecode)!="function")String.prototype.xmlDecode=function(){return this.htmlDecode();};
if (typeof(String.prototype.urlEncode)!="function")String.prototype.urlEncode=function(all){return all?this.replace(/[\s\S]/g,function(m){m=m.charCodeAt(0).toString(16);if(m.length<2)m="0"+m;return "%"+m}):escape(this).replace(/\+/g,"%2B").replace(/\//g,"%2F").replace(/@/g,"%40").replace(/%20/g,"+").replace(/%21/g,"!").replace(/%27/g,"'").replace(/%28/g,"(").replace(/%29/g,")");};
if (typeof(String.prototype.urlDecode)!="function")String.prototype.urlDecode=function(){return unescape(this.replace(/\+/g," "));};
if (typeof(String.prototype.cEncode)!="function")String.prototype.cEncode=function(all){return all?this.replace(/[\s\S]/g,function(m){m=m.charCodeAt(0).toString(16);if(m.length<2)m="0"+m;return "\\x"+m+""}):this.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,"\\\"").replace(/\r/g,"\\r").replace(/\n/g,"\\n");};
if (typeof(String.prototype.cDecode)!="function")String.prototype.cDecode=function(){return this.replace(/\\(a|b|f|n|r|t|v|\\|\?|'|"|[0-7]{1,3}|x[0-9a-fA-F]{1,2})/g,function(m,v){var r="a\ab\bf\fn\nr\rt\tv\v\\\\??''\"\"";var i=r.indexOf(v.charAt(0));if(i>=0)return r.charAt(i+1);return String.fromCharCode(v.charAt(0)=='x'?parseInt(v.substr(1),16):parseInt(v,8));});};
if (typeof(String.prototype.base64Encode)!="function")String.prototype.base64Encode=function(width,e){var v="";var m="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";if(typeof(e)=="string")m=m.setAt(m.length-e.length,e);function x(c){c=c.toString(2);return "00000000".substr(c.length)+c;}function y(c,i){return m.charAt(parseInt(c.substr(6*i,6),2));}for (var i=2;i<this.length;i+=3){var z=x(this.charCodeAt(i-2))+x(this.charCodeAt(i-1))+x(this.charCodeAt(i));v+=y(z,0)+y(z,1)+y(z,2)+y(z,3);}if(this.length%3==1){var z=x(this.charCodeAt(this.length-1))+"000000";v+=y(z,0)+y(z,1)+m.charAt(64)+m.charAt(64);}else if(this.length%3==2){var z=x(this.charCodeAt(this.length-2))+x(this.charCodeAt(this.length-1))+"00";v+=y(z,0)+y(z,1)+y(z,2)+m.charAt(64);}if(typeof(width)=="number"&&width>=1){var r=v;v="";while(r.length>0){if(v.length>0)v+="\n";var l=Math.min(width,r.length);v+=r.substr(0,l);r=r.substr(l);}}return v;};
if (typeof(String.prototype.base64Decode)!="function")String.prototype.base64Decode=function(e){var m="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";if(typeof(e)=="string")m=m.setAt(m.length-e.length,e);var r=this.replace(new RegExp("\\s|"+m.charAt(64).regExpEncode(),"g"),"");var v="";function x(c){c=m.indexOf(c).toString(2);return "000000".substr(c.length)+c;}function y(c,i){return String.fromCharCode(parseInt(c.substr(8*i,8),2));}for(var i=3;i<r.length;i+=4){var z=x(r.charAt(i-3))+x(r.charAt(i-2))+x(r.charAt(i-1))+x(r.charAt(i));v+=y(z,0)+y(z,1)+y(z,2);}if(r.length%4==3){var z=x(r.charAt(r.length-3))+x(r.charAt(r.length-2))+x(r.charAt(r.length-1));v+=y(z,0)+y(z,1);}if(r.length%4==2){var z=x(r.charAt(r.length-2))+x(r.charAt(r.length-1));v+=y(z,0);}return v;};
/*@cc_on @*/
/*@if (@_jscript_version >= 5.5)
if (typeof(String.prototype.regExpEncode)!="function")String.prototype.regExpEncode=function(){return this.replace(/\\|\^|\$|\*|\+|\?|\.|\||\-|\{|\}|\(|\)|\[|\]/g,"\\$&");};
if (typeof(String.prototype.replaceEncode)!="function")String.prototype.replaceEncode=function(){return this.replace(/\$/g,"$$$$");};
  @else @*/
if (typeof(String.prototype.regExpEncode)!="function")String.prototype.regExpEncode=function(){return this.replace(/\\/g,"\\\\").replace(/\^/g,"\\^").replace(/\$/g,"\\$").replace(/\*/g,"\\*").replace(/\+/g,"\\+").replace(/\?/g,"\\?").replace(/\./g,"\\.").replace(/\|/g,"\\|").replace(/\-/g,"\\-").replace(/\{/g,"\\{").replace(/\}/g,"\\}").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\[/g,"\\[").replace(/\]/g,"\\]");};
if (typeof(String.prototype.replaceEncode)!="function")String.prototype.replaceEncode=function(){return this;};
/*@end @*/
if (typeof(Array.prototype.indexOf)!="function")Array.prototype.indexOf=new Function("v","for(var i=0;i<this.length;i++)if(this[i]==v)return i;return -1;");
if (typeof(Array.prototype.push)!="function")Array.prototype.push=new Function("var l=this.length;var i;for(i=0;i<arguments.length;i++)this[l+i]=arguments[i];return l+i;");
if (typeof(Array.prototype.pop)!="function")Array.prototype.pop=new Function("if (this.length>0){var v=this[this.length-1];this.length--;return v;}");
if (typeof(Array.prototype.unshift)!="function")Array.prototype.unshift=new Function("var n=arguments.length;if(n>0){for(var i=this.length+n;i>n;i--)this[i]=this[i-n];for(var i=0;i<n;i++)this[i]=arguments[i];}}");
if (typeof(Array.prototype.shift)!="function")Array.prototype.shift=new Function("var v=this[0];for(var i=1;i<this.length;i++)this[i-1]=this[i];this.length--;return v;");
if (typeof(Function.prototype.apply)!="function")Function.prototype.apply=new Function("o","a","o.$=this;var c='o.$(';var i;for(i=0;i<a.length;i++){if(i>0)c+=',';c+='a['+i+']';}c+=')';var v=eval(c);o.$=(function(){})();return v;");
if (typeof(Function.prototype.call)!="function")Function.prototype.call=new Function("o","o.$=this;var c='o.$(';var i;for(i=1;i<arguments.length;i++){if(i>1)c+=',';c+='arguments['+i+']';}c+=')';var v=eval(c);o.$=(function(){})();return v;");

Foundation=function(name,container)
{
   if (arguments.length==3)
      arguments[2][name]=this;
   else
      (container ? container : Foundation.getGlobalObject())[name]=this;
   this.$name=name;
   this.$container=container ? container : null;
};
Foundation.prototype.constructor=Foundation;
Foundation.prototype.getTypePath=function()
{
   return (this.$container ? this.$container.getTypePath()+"." : "")+this.$name;
};
Foundation=new Foundation("Foundation",null,this);
Foundation.Namespace=Foundation.constructor;
Foundation.exists=function(path)
{
   var c=Foundation.getGlobalObject();
   var path=path.split(".");
   for (var i=0;i<path.length;i++)
      if (c==null || typeof(c[path[i]])=="undefined")
         return false;
      else
         c=c[path[i]];
   return c!=null;
};
Foundation.establishNamespace=function(namespace)
{
   var path=namespace.split(".");
   var name=path.pop();
   var container=path.length>0 ? Foundation["namespace"](path.join(".")) : null;
   var c=container ? container : Foundation.getGlobalObject();
   if (c[name])
      namespace=c[name];
   else
      namespace=new Foundation.Namespace(name,container);
   return namespace;
};
Foundation.namespace=function(namespace,propertyList)
{
   namespace=Foundation.establishNamespace(namespace);
   if (propertyList)
      Foundation["appendToNamespace"](namespace,propertyList);
   return namespace;
};
Foundation.appendToNamespace=function(namespace,propertyList)
{
   for (var i in propertyList)
      if (i!="prototype" && i!="constructor")
         namespace[i]=propertyList[i];
   return namespace;
};
Foundation.getGlobalObject=function(path) 
{ 
   if (arguments.length==0 || typeof(arguments[0])=="string")
   {
      var getGlobalObject=arguments.callee;
      return getGlobalObject(true,arguments.length>0 ? arguments[0] : null);
   }
   var o=this;
   if (arguments.length>1 && typeof(arguments[1])=="string" && arguments[1].length>0)
   {
      path=arguments[1].split('.');
      for (var i=0;i<path.length;i++)
         if (!(o=o[path[i]]))
            return null;
   }
   return o; 

};
Foundation.Class=function()
{
};
Foundation.Class.prototype.constructor=Foundation.Class;
Foundation.Class.prototype.dispose=function(){};
Foundation.Class.$parentClass=null;
Foundation.Class.$interfaces=new Array();
Foundation.Class.$childClasses=new Array();
Foundation.Class.$name="Class";
Foundation.Class.$container=Foundation;
Foundation.Class.getTypePath=Foundation.getTypePath;
Foundation.Class.isInstanceOf=function(theClass)
{
   for (var c=this;c;c=c.$parentClass)
      if (c==theClass)
         return true;
      else
         if (c.$interfaces)
            for (var i=0;i<c.$interfaces.length;i++)
               if (c.$interfaces[i]==theClass)
                  return true;
   return false;
};
Foundation.Interface=function()
{
};
Foundation.Interface.prototype.constructor=Foundation.Interface;
Foundation.Interface.prototype.dispose=function(){};
Foundation.Interface.$parentClass=null;
Foundation.Interface.$interfaces=new Array();
Foundation.Interface.$childClasses=new Array();
Foundation.Interface.$name="Interface";
Foundation.Interface.$container=Foundation;
Foundation.Interface.getTypePath=Foundation.getTypePath;
Foundation.establishNamespace("Foundation");
Foundation.$registry=new Array(null);
Foundation.createClass=function()
   {
      var container=null;
      var name="";
      var parentClassIndex=0;
      var parentClass=null;
      var interfaces=new Array();
      var virtualConstructor=null;
      var virtualProperties=null;
      var staticConstructor=null;
      var staticProperties=null;
      var isInterface=false;
      var argStartIndex=0;
      if (arguments.length>0 && typeof(arguments[0])=="string")
      {
         var path=arguments[0].split('.');
         name=path.pop();
         if (path.length>0)
            container=Foundation["namespace"](path.join("."));
         argStartIndex=1;
         parentClassIndex=1;
      }
      for (var constructorIndex=arguments.length-1;constructorIndex>=argStartIndex;constructorIndex--)
         if (typeof(arguments[constructorIndex])=="function")
         {
            virtualConstructor=arguments[constructorIndex];
            if (constructorIndex>parentClassIndex)
               parentClass=arguments[parentClassIndex];
            for (var i=parentClassIndex+1;i<constructorIndex;i++)
               interfaces.push(arguments[i]);
            break;
         }
      if (arguments.length>constructorIndex+1 && typeof(arguments[constructorIndex+1])=="object")
          virtualProperties=arguments[constructorIndex+1];
      if (arguments.length>constructorIndex+2 && typeof(arguments[constructorIndex+2])=="object")
          staticProperties=arguments[constructorIndex+2];
      if (arguments.length>0 && typeof(arguments[arguments.length-1])=="boolean" && arguments[arguments.length-1])
         isInterface=true;
      if (virtualProperties && virtualProperties.constructor && virtualProperties.constructor!=Object)
      {
         if (constructorIndex==argStartIndex)
            parentClass=virtualConstructor;
         else
            if (constructorIndex>argStartIndex)
               interfaces.push(virtualConstructor);
         virtualConstructor=virtualProperties.constructor;
      }
      if (staticProperties && staticProperties.constructor && staticProperties.constructor!=Object)
         staticConstructor=staticProperties.constructor;

      var newClass=Foundation.$createClass(container,name,parentClass,interfaces,virtualConstructor,virtualProperties,staticConstructor,staticProperties,isInterface);
      if (newClass.$name.length>0 &&
          newClass.$container==null)
      {
         var globalObject=Foundation.getGlobalObject();
         globalObject[newClass.$name]=newClass;
      }
      newClass.$constructor();
      return newClass;
   };
Foundation.createInterface=function()
   {
      arguments[arguments.length++]=true;
      return Foundation.createClass.apply(this,arguments);
   };
Foundation.appendToClass=function(theClass,virtualMethods,staticMethods)
   {
      if (typeof(theClass)=="string")
         theClass=Foundation.getGlobalObject(theClass);
      var interfaceDisposeList=new Array();
      for (var i=0;i<theClass.$interfaces.length;i++)
         if (theClass.$interfaces[i].prototype.dispose)
            interfaceDisposeList.push("("+theClass.$interfaces[i].prototype.dispose.toString().replace(/^function\s+anonymous\s*\(/,"function(")+")");
      if (virtualMethods)
         Foundation.addVirtualProperties(theClass,virtualMethods,interfaceDisposeList,true);
      if (staticMethods)
         Foundation.addStaticProperties(theClass,staticMethods,true);
      return theClass;
   };
Foundation.appendToInterface=function()
   {
      return Foundation.appendToClass.apply(this,arguments);
   };
Foundation.$createClass=function(container,name,parentClass,interfaces,virtualConstructor,virtualProperties,staticConstructor,staticProperties,isInterface)
   {
      if (!virtualConstructor)
         virtualConstructor=new Function();
      if (!staticConstructor)
         staticConstructor=new Function();
      var interfaceDisposeList=new Array();
      for (var i=0;i<interfaces.length;i++)
         if (interfaces[i].prototype.dispose)
            interfaceDisposeList.push("("+interfaces[i].prototype.dispose.toString().replace(/^function\s+anonymous\s*\(/,"function(")+")");
      if (isInterface || !parentClass || !parentClass.isInstanceOf)
         interfaces.unshift(isInterface ? Foundation.Interface : Foundation.Class);
      virtualConstructor=Foundation.transformVirtualConstructor(virtualConstructor,parentClass,interfaces,interfaceDisposeList);
      if (parentClass)
      {
         virtualConstructor.$parentClass=parentClass;
         if (!virtualConstructor.$parentClass.$childClasses)
            virtualConstructor.$parentClass.$childClasses=new Array();
         virtualConstructor.$parentClass.$childClasses.push(virtualConstructor);
         staticConstructor=Foundation.transformStaticConstructor(staticConstructor,parentClass);
      }
      else
         virtualConstructor.$parentClass=null;
      virtualConstructor.$constructor=staticConstructor;
      virtualConstructor.$interfaces=new Array();
      virtualConstructor.$childClasses=new Array();
      virtualConstructor.$container=container;
      virtualConstructor.$name=name;
      virtualConstructor.getTypePath=Foundation.getTypePath;
      for (var i=0;i<interfaces.length;i++)
      {
         virtualConstructor.$interfaces.push(interfaces[i]);
         if (!interfaces[i].$childClasses)
            interfaces[i].$childClasses=new Array();
         interfaces[i].$childClasses.push(virtualConstructor);
      }
      interfaces=virtualConstructor.$interfaces;
      for (var i=interfaces.length-1;i>=0;i--)
         Foundation.inheritInterface(virtualConstructor,interfaces[i]);
      if (parentClass)
         Foundation.inheritInterface(virtualConstructor,parentClass);
      for (var i=0;i<interfaces.length;i++)
         Foundation.inheritInterface(virtualConstructor,interfaces[i],true);
      if (virtualProperties)
         Foundation.addVirtualProperties(virtualConstructor,virtualProperties,interfaceDisposeList);
      if (staticProperties)
         Foundation.addStaticProperties(virtualConstructor,staticProperties);
      virtualConstructor.prototype.constructor=virtualConstructor;
      virtualConstructor.$constructor=staticConstructor;
      if (!virtualConstructor.prototype.dispose)
         virtualConstructor.prototype.dispose=this.createDefaultDisposeMethod(virtualConstructor);
      if (virtualConstructor.$container && virtualConstructor.$name && !virtualConstructor.$container[virtualConstructor.$name])
         virtualConstructor.$container[virtualConstructor.$name]=virtualConstructor;
      return virtualConstructor;
   };
Foundation.addVirtualProperties=function(theClass,properties,interfaceDisposeList,appending)
   {
      var n=null;
      var noTransform=(!theClass.$parentClass && theClass.$interfaces.length==0);
      while (n=Foundation.getNextCustomPropertyName(properties,n))
      {
         var p=properties[n];
         if (typeof(p)=="function")
            theClass.prototype[n]=(noTransform ? p : Foundation.transformMethodSupers(p,theClass.$parentClass ? theClass.$parentClass.prototype : null,interfaceDisposeList));
         else
            if (appending && typeof(p)=="object" && typeof(theClass.prototype[n])=="object")
               for (var i in p)
                  theClass.prototype[n][i]=p[i];
            else
               theClass.prototype[n]=p;
      }
   };
Foundation.addStaticProperties=function(theClass,properties,appending)
   {
      var n=null;
      var noTransform=!theClass.$parentClass;
      while (n=Foundation.getNextCustomPropertyName(properties,n))
      {
         var p=properties[n];
         if (typeof(p)=="function")
            theClass[n]=(noTransform  ? p : Foundation.transformMethodSupers(p,theClass.$parentClass,null));
         else
            if (appending && typeof(p)=="object" && typeof(theClass[n])=="object")
               for (var i in p)
                  theClass[n][i]=p[i];
            else
               theClass[n]=p;
      }
   };
Foundation.inheritInterface=function(theClass,theInterface,precedenceOnly)
   {
      Foundation.copyProperties(theClass.prototype,theInterface.prototype,precedenceOnly);
      Foundation.copyProperties(theClass,theInterface,precedenceOnly);
   };
Foundation.copyProperties=function(object,properties,precedenceOnly)
   {
      var n=null;
      while (n=Foundation.getNextCustomPropertyName(properties,n,true,true))
         if (n!="dispose")
            if (n.startsWith("precedence$"))
               object[n.substr(11)]=properties[n];
            else
               if (!precedenceOnly)
                  object[n]=properties[n];
   };
Foundation.getFunctionParts=function(theFunction)
   {
      if (theFunction.toString().search(/function[^\(]*\(([^)]*)\)[^\{]*\{([\w\W]*)\}[^\}]*$/)<0)
         return null;
      return {parameters:RegExp.$1,body:RegExp.$2};
   };
Foundation.getNativeClassName=function(theClass)
   {
      if (theClass==Array) return "Array";
      if (theClass==String) return "String";
      if (theClass==Number) return "Number";
      if (theClass==Object) return "Object";
      if (theClass==Date) return "Date";
      if (theClass==Boolean) return "Boolean";
      if (theClass==Function) return "Function";
      return null;
   };
Foundation.transformStaticConstructor=function(staticConstructor,parentClass)
   {
      if (parentClass.$constructor)
      {
         var constructorParts=Foundation.getFunctionParts(staticConstructor);
         var parentParts=Foundation.getFunctionParts(parentClass.$constructor);
         var constructorCode="function("+constructorParts.parameters+"){";
         constructorCode+="(function("+parentParts.parameters+"){"+parentParts.body+"}).apply(this,arguments);";
         constructorCode+=constructorParts.body;
         constructorCode+="}";
         eval("staticConstructor="+constructorCode);
      }
      return staticConstructor;
   };
Foundation.transformVirtualConstructor=function(virtualConstructor,parentClass,interfaces,interfaceDisposeList)
   {
      var needIt=false;
      if (parentClass)
         needIt=true;
      else
         for (var i=0;i<interfaces.length;i++)
            if (interfaces[i])
            {
               needIt=true;
               break;
            }
      if (!needIt)
         return virtualConstructor;
      var constructorParts=Foundation.getFunctionParts(virtualConstructor);
      var nativeParentName=parentClass ? Foundation.getNativeClassName(parentClass) : null;
      var parentParts=parentClass ? Foundation.getFunctionParts(parentClass) : null;
      var constructorCode="function("+constructorParts.parameters+"){";
      if (parentClass && constructorParts.body.search(/^([\w\W]*[^\$\w])Super\s*\(([^\)]*)\)([\w\W]*)$/)==0)
      {
         var p1=RegExp.$1;
         var p2=RegExp.$2;
         var p3=RegExp.$3;
         constructorCode+=p1;
         if (nativeParentName)
            constructorCode+=nativeParentName+".call(this";
         else
            constructorCode+="(function("+parentParts.parameters+"){"+parentParts.body+"}).call(this";
         if (p2.trim().length>0)
            constructorCode+=","+p2;
         constructorCode+=")";
         for (var i=0;i<interfaces.length;i++)
            if (interfaces[i] &&
                interfaces[i]!=Foundation.Class &&
                interfaces[i]!=Foundation.Interface)
            {
               constructorCode+=";\n(";
               constructorCode+=interfaces[i];
               constructorCode+=").call(this)";
            }
         constructorCode+=p3;
      }
      else
      {
         if (parentClass && !nativeParentName)
            constructorCode+="(function("+parentParts.parameters+"){"+parentParts.body+"}).apply(this,arguments);";
         for (var i=0;i<interfaces.length;i++)
            if (interfaces[i] &&
                interfaces[i]!=Foundation.Class &&
                interfaces[i]!=Foundation.Interface)
            {
               constructorCode+="\n(";
               constructorCode+=interfaces[i];
               constructorCode+=").call(this);";
            }
         constructorCode+=constructorParts.body;
      }
      constructorCode+="}";
      if (parentClass)
      {
         var rootParent=parentClass;
         while (rootParent.$parentClass)
            rootParent=rootParent.$parentClass;
         var nativeRootParentName=Foundation.getNativeClassName(rootParent);
         if (nativeRootParentName)
            constructorCode=Foundation.wrapConstructorForNatives(constructorCode,nativeRootParentName);
      }
      try
      {
         eval("virtualConstructor="+constructorCode);
      }
      catch (e)
      {
         alert("error transforming constructor\n\n"+constructorCode);
         throw(e);
      }
      if (parentClass)
         virtualConstructor=Foundation.transformMethodSupers(virtualConstructor,parentClass.prototype,interfaceDisposeList);
      return virtualConstructor;
   };
Foundation.wrapConstructorForNatives=function(constructorCode,nativeName)
   {
      var newCode="";
      newCode+="function(){var $_=null;if(this.constructor==arguments.callee){";
      if (nativeName=="Function")
         newCode+="$_=Function.apply(null,arguments.length<1||typeof(arguments[0])==\"string\"?arguments:arguments[0]);";
      else if (nativeName=="Array")
         newCode+="$_=new Array;";
      else
         newCode+="$_="+nativeName+".call(null,arguments[0]);";
      newCode+="$_.constructor=arguments.callee;for(var i in arguments.callee.prototype)$_[i]=arguments.callee.prototype[i];}";
      if (constructorCode)
      {
         newCode+="(";
         newCode+=constructorCode;
         newCode+=").apply($_!=null?$_:this,arguments);";
      }
      newCode+="if($_!=null)return $_;}";
      return newCode;
   };
Foundation.transformMethodSupers=function(theFunction,parentObject,interfaceDisposeList)
   {
      var parts=Foundation.getFunctionParts(theFunction);
      var transformedCode=Foundation.transformSuperCode(parts.body,parentObject,interfaceDisposeList);
      if (transformedCode!=parts.body)
      {
         var functionCode="function("+parts.parameters+"){"+transformedCode+"}";
         try
         {
            eval("theFunction="+functionCode);
         }
         catch (e)
         {
            alert("Error transforming method:\n\n"+functionCode);
            throw(e);
         }
      }
      return theFunction;
   };
Foundation.transformSuperCode=function(code,parentObject,interfaceDisposeList)
   {
      var outCode="";
      var s;
      while ((s=code.search(/(^|[^\$\w]+)Super\s*\.\s*([\$\w]+)\s*\(([\w\W]*)$/))>=0)
      {
         outCode+=code.substr(0,s+RegExp.$1.length);
         var name=RegExp.$2;
         code=RegExp.$3;
         if (name=="dispose" && interfaceDisposeList)
            for (var i=interfaceDisposeList.length-1;i>=0;i--)
            {
               outCode+=interfaceDisposeList[i]+".call(this";
               if (i>0 || parentObject)
                  outCode+=");\n      ";
            }
         if (parentObject)
            if (typeof(parentObject)=="string")
               if (name=="dispose")
                  outCode+="if ("+parentObject+"."+name+") "+parentObject+"."+name+".call(this";
               else
                  outCode+=parentObject+"."+name+".call(this";
            else
            {
               var parentParts=Foundation.getFunctionParts(parentObject[name]);
               if (parentParts==null)
                  throw("Method "+name+" not implemented in parent class");
               outCode+="(function("+parentParts.parameters+"){"+parentParts.body+"}).call(this";
            }
         else
            if (name=="dispose")
            {
               if (!interfaceDisposeList || interfaceDisposeList.length==0)
                  outCode+="(function(){}).call(this";   
            }
            else
               throw("Not inheriting!");
         if (code.search(/^\s*\)/)<0)
            outCode+=",";
      }
      outCode+=code;
      return outCode;
   };
Foundation.createDefaultDisposeMethod=function(theClass)
   {
      var code="";
      code+="/* "+theClass.getTypePath()+" */\n";
      for (var i=theClass.$interfaces.length-1;i>=0;i--)
         if (theClass.$interfaces[i] &&
             theClass.$interfaces[i].prototype.dispose)
            code+="("+theClass.$interfaces[i].prototype.dispose.toString().replace(/^function\s+anonymous\s*\(/,"function(")+").apply(this,arguments);\n";
      if (theClass.$parentClass &&
          theClass.$parentClass.prototype.dispose)
         code+="("+theClass.$parentClass.prototype.dispose.toString().replace(/^function\s+anonymous\s*\(/,"function(")+").apply(this,arguments);\n";
      return new Function(code);
   };
Foundation.isNativeFunction=function(theFunction)
   {
      theFunction=theFunction.toString();
      var b=theFunction.indexOf("{");
      if (b>0)
         theFunction=theFunction.substr(b+1);
      b=theFunction.lastIndexOf("}");
      if (b>0)
         theFunction=theFunction.substr(0,b);
      theFunction=theFunction.trim().toLowerCase();
      return (theFunction=="[native code]" || theFunction=="(internal function)");

   };
Foundation.getNextCustomPropertyName=function(object,property,functionsOnly,noHidden)
   {
      if (!property) property=null;
      for (var i in object)
         if (i!="prototype" && i!="constructor" && i!="toString" && i!="valueOf" && (!functionsOnly || typeof(object[i])=="function") && (!noHidden || i.charAt(0)!='$'))
            if (property==null)
               return i;
            else
               if (i==property)
                  property=null;
      if (!Foundation.isNativeFunction(object.toString))
         if (property==null)
            return "toString";
         else
            if ("toString"==property)
               property=null;
      if (!Foundation.isNativeFunction(object.valueOf))
         if (property==null)
            return "valueOf";
         else
            if ("valueOf"==property)
               property=null;
      return null;
   };
Foundation.getXmlHttpRequest=function()
   {
      if (typeof(XMLHttpRequest)!="undefined")
         return new XMLHttpRequest();
      if (typeof(ActiveXObject)!="undefined")
         return new ActiveXObject("Microsoft.XMLHTTP");
      return null;
   };
Foundation.urlDomain=function(url)
   {
      if (url.search(/\:\/\/([^\/\:]+)\//)>0)
                     return RegExp.$1;
      return document.domain;
   };
Foundation.conformUrlToDocumentDomain=function(url)
   {
      if (!document.domain)
         return url;
      var urlDomain=Foundation.urlDomain(url);
      var docDomain=document.domain;
      if (urlDomain.toLowerCase()!=docDomain.toLowerCase() &&
          ("www."+urlDomain.toLowerCase()==docDomain.toLowerCase() ||
           urlDomain.toLowerCase()=="www."+docDomain.toLowerCase()))
         url=url.replace(urlDomain,docDomain);
      return url;
   };
Foundation.loadScriptDomainsMustMatch=(function()
   {
      if (typeof(document)!="undefined" && document.domain &&
          window.navigator.appVersion.search(/Safari\/(\d+)/i)>=0)
         return (parseFloat(RegExp.$1)<412.5);
      return false;
   })();
Foundation.loadScriptDomainMismatch=function(url)
   {
      if (Foundation.loadScriptDomainsMustMatch)
      {
         var domain=Foundation.urlDomain(url);
         var dir=domain.split('.')[0];
         return url.replace(domain,document.domain+'/'+dir);
      }
      throw("domain mismatch");
   };
Foundation.scriptsToExec=new Array();
Foundation.handleXmlHttpRequestOnreadystatechange=function(request,url,postData,catchFunction)
   {
      if (request && request.readyState==4)
         if (typeof(request.responseText)=="string" && request.responseText.length>0)
         {
            postData=(postData ? "'"+postData.cEncode()+"'" : "null");
            if(window.execScript)
               if (catchFunction)
               {
                  var i=Foundation.scriptsToExec.length;
                  Foundation.scriptsToExec[i]=request.responseText;
                  window.setTimeout("try{eval(Foundation.scriptsToExec["+i+"]);}catch(e){"+catchFunction+"('"+url.cEncode()+"',"+postData+",Foundation.scriptsToExec["+i+"],e);}Foundation.scriptsToExec["+i+"]=null;",1);
               }
               else
                  window.execScript(request.responseText);
            else
            {
               var i=Foundation.scriptsToExec.length;
               Foundation.scriptsToExec[i]=request.responseText;
               if (catchFunction)
               {
                  window.setTimeout("try{eval(Foundation.scriptsToExec["+i+"]);}catch(e){"+catchFunction+"('"+url.cEncode()+"',"+postData+",Foundation.scriptsToExec["+i+"],e);}Foundation.scriptsToExec["+i+"]=null;",1);
               }
               else
                  window.setTimeout("eval(Foundation.scriptsToExec["+i+"]);Foundation.scriptsToExec["+i+"]=null;",1);
            }
            return 1;
         }
         else
            return -1;
      return 0;
   };
Foundation.loadScript=function(url,postData,debug,catchFunction)
   {
      if (typeof(catchFunction)=="string")
         catchFunction="'"+catchFunction.cEncode()+"'";
      else
         catchFunction="null";
      if (arguments.length>4 && arguments[4])
      {
         url=Foundation.conformUrlToDocumentDomain(url);
         if (debug)
            window.open(url,"_blank");
         else
         {
            try
            {
               if (document.domain &&
                   Foundation.urlDomain(url).toLowerCase()!=document.domain.toLowerCase())
                  url=Foundation.loadScriptDomainMismatch(url);
               var callback=new Function("var r=Foundation.handleXmlHttpRequestOnreadystatechange(arguments.callee.request,arguments.callee.url,arguments.callee.postData,"+catchFunction+");if(r!=0)arguments.callee.request=null;if(r<0)throw('xmlhttprequestfailed');");
               callback.url=url;
               callback.request=Foundation.getXmlHttpRequest();
               callback.request.onreadystatechange=callback;
               if (typeof(postData)=="string")
               {
                  callback.postData=postData;
                  callback.request.open("POST",url,true);
                  callback.request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                  callback.request.send(postData);
               }
               else
               {
                  callback.postData=null;
                  callback.request.open("GET",url,true);
                  callback.request.send("");
               }
            }
            catch (e)
            {
               if (typeof(postData)=="string")
                  return false;
               var script=document.createElement("SCRIPT");
               script.src=url;
               document.body.appendChild(script);
            }
         }
         if (Foundation.onScriptStartLoad)
            Foundation.onScriptStartLoad();
      }
      else
         window.setTimeout("Foundation.loadScript(\""+url.cEncode()+"\","+(typeof(postData)=="string" ? "\""+postData.toString().cEncode()+"\"" : "null")+","+(debug ? "true" : "false")+","+catchFunction+",true);",1);
      return true;
   };
Foundation.stripFileNameFromPath=function(path)
   {
      path=path.replace(/\\/g,"/");
      var s=path.lastIndexOf("/");
      return s<0 ? "" : path.substr(0,s+1);
   };
Foundation.getClassScript=function(theClass,reverse)
   {
      var keys=new Array();
      var path;
      while (theClass && theClass.getTypePath)
      {
         keys.push(path=theClass.getTypePath());
         keys.push(new RegExp("^([\\s\\S]*[\\\\\\/])?"+(path=path.regExpEncode())+"\\.js(\\?[\\s\\S]*)?$","i"));
         keys.push(new RegExp("^([\\s\\S]*[\\\\\\/])?"+path+"(\\.\\w+)?\\.js(\\?[\\s\\S]*)?$","i"));
         if (theClass.$parentClass && theClass.$parentClass.getTypePath)
            theClass=theClass.$parentClass;
         else
            theClass=theClass.$container;
      }
      var scripts=document.scripts ? document.scripts : document.getElementsByTagName("script");
      if (keys)
         for (var i=0;i<keys.length;i++)
         {
            var key=keys[i];
            if (typeof(key)=="string")
            {
               var e=document.getElementById(key);
               if (e && e.tagName=="SCRIPT")
                  return e;
            }
            else
            {
               if (reverse)
               {
                  for (var j=scripts.length-1;j>=0;j--)
                     if (scripts[j].src && scripts[j].src.search(key)>=0)
                        return scripts[j];
               }
               else
                  for (var j=0;j<scripts.length;j++)
                     if (scripts[j].src && scripts[j].src.search(key)>=0)
                        return scripts[j];
               if (Foundation.$includedScripts)
                  for (var j=0;j<Foundation.$includedScripts.length;j++)
                     if (Foundation.$includedScripts[j].search(key)>=0)
                        return {src:Foundation.$includedScripts[j]};
            }
         }
      return null;
   };
Foundation.getClassScriptFolder=function(theClass)
   {
      if (typeof(theClass.$scriptFolder)=="string")
         return theClass.$scriptFolder;
      var script=Foundation.getClassScript(theClass);
      return theClass.$scriptFolder=((script && script.src) ? Foundation.stripFileNameFromPath(script.src) : "");
   };
Foundation.validateEmailFormat=function(emailAddress,allowMultiple,allowEmpty)
   {
      if (allowEmpty && emailAddress.search(/[^\s;,]/)<0)
         return true;
      if (allowMultiple)
         return (emailAddress.search(/((^|[\s;,])[\s;,]*[\w-'\+]+(\.[\w-'\+]+)*@((([a-zA-Z0-9]+(-+[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,})|((((25[0-5])|(2[0-4]\d)|(([01]?\d)?\d))\.){3}((25[0-5])|(2[0-4]\d)|(([01]?\d)?\d)))))+[\s;,]*$/)==0);
      return (emailAddress.search(/^\s*[\w-'\+]+(\.[\w-'\+]+)*@((([a-zA-Z0-9]+(-+[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,})|((((25[0-5])|(2[0-4]\d)|(([01]?\d)?\d))\.){3}((25[0-5])|(2[0-4]\d)|(([01]?\d)?\d))))\s*$/)==0);
   };
Foundation.caseInsensitiveSorter=function(a,b)
   {
      if (a==null)
         if (b==null)
            return 0;
         else
            return 1;
      else
         if (b==null)
            return -1;
      var la=a.toLowerCase();
      var lb=b.toLowerCase();
      if (la<lb) return -1;
      if (la>lb) return 1;
      return 0;
   };
Foundation.$uniqueIdIndex=0;
Foundation.generateUniqueId=function()
   {
      return "Foundation.generateUniqueId."+(Foundation.$uniqueIdIndex++);
   };
Foundation.KEY_CODE={ENTER:13,RETURN:13,ESC:27,ESCAPE:27,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,
             BACKSPACE:8,TAB:9,CAPS_LOCK:20,SHIFT:16,CTRL:17,ALT:18,INSERT:45,DELETE:46,HOME:36,END:35,PAGE_UP:33,PAGE_DOWN:34,
             NUM_LOCK:144,SCROLL_LOCK:145,BREAK:19,SPACE:32,
             A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,
             a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,
             "0":49,"1":50,"2":51,"3":52,"4":53,"5":54,"6":55,"7":56,"8":57,"9":58,
             ")":49,"!":50,"@":51,"#":52,"$":53,"%":54,"^":55,"&":56,"*":57,"(":58,
             "`":192,"-":189,"=":187,"[":219,"]":221,"\\":220,";":186,"'":222,",":188,".":190,"/":191,
             "~":192,"_":189,"+":187,"{":219,"}":221,"|":220,":":186,"\"":222,"<":188,">":190,"?":191,
             NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,
             "NUMPAD_/":111,"NUMPAD_*":106,"NUMPAD_-":109,"NUMPAD_+":107,"NUMPAD_.":46,"NUMPAD_DEL":110,
             F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123};
Foundation.HALIGN={FAR_LEFT:"FAR_LEFT",LEFT:"LEFT",CENTER:"CENTER",RIGHT:"RIGHT",FAR_RIGHT:"FAR_RIGHT"};
Foundation.VALIGN={FAR_TOP:"FAR_TOP",TOP:"LEFT",MIDDLE:"MIDDLE",BOTTOM:"BOTTOM",FAR_BOTTOM:"FAR_BOTTOM"};
Foundation.CURSOR={DEFAULT:"default",
      CROSSHAIR:"crosshair",
      HAND:(typeof(document)=="object" && typeof(navigator)=="object" && document.all && navigator.userAgent.indexOf("Opera")<0) ? "hand" : "pointer"
   };
Foundation.getElementOffset=function(element)
   {
      var offset={x:0,y:0};
      for (var e=element;e;e=e.offsetParent)
      {
         offset.x+=e.offsetLeft+e.clientLeft;
         offset.y+=e.offsetTop+e.clientTop;
      }
      for (var e=element;e;e=e.parentNode)
      {
         if (e.tagName=="BODY")
            break;
         offset.x-=e.scrollLeft;
         offset.y-=e.scrollTop;
      }
      return offset;
   };
Foundation.getElementRectangle=function(element)
   {
      var origin=this.getElementOffset(element);
      return {x:origin.x,y:origin.y,width:element.offsetWidth,height:element.offsetHeight};
   };
Foundation.isElementInView=function(element)
   {
      var rect=this.getElementRectangle(element);
      return (rect.x>=document.body.scrollLeft &&
              rect.y>=document.body.scrollTop &&
              rect.x+rect.width<=document.body.scrollLeft+document.body.offsetWidth &&
              rect.y+rect.height<=document.body.scrollTop+document.body.offsetHeight);
   };
Foundation.createElement=function(sTag)
   {
      var e;
      var html=sTag.trim();
      if (html.length>0 &&
          html.charAt(0)=="<" &&
          (html.search(/^<(\w+)([^>]*)>([\s\S]*)<\/\w+>$/)==0 ||
           html.search(/^<(\w+)([^>]*?)\/?>$/)==0))
      {
         var tag=RegExp.$1;
         var attrs=RegExp.$2;
         var innerHtml=RegExp.$3;
         if (document.all)
            e=document.createElement("<"+tag+attrs+"></"+tag+">");
         else
         {
            e=document.createElement(tag);
            attrs=attrs.trim();
            while (attrs.length>0)
            {
               var aName,aValue;
               if (attrs.search(/^(\w+)="([^"]*)"\s*([\s\S]*)/)==0 ||
                     attrs.search(/^(\w+)='([^']*)'\s*([\s\S]*)/)==0 ||
                     attrs.search(/^(\w+)=(\S+)\s*([\s\S]*)/)==0)
               {
                  aName=RegExp.$1;
                  aValue=RegExp.$2;
                  attrs=RegExp.$3;
               }
               else
                  if (attrs.search(/^(\w+)\s*([\s\S]*)/)==0)
                  {
                     aName=RegExp.$1;
                     aValue="TRUE";
                     attrs=RegExp.$2;
                  }
                  else
                     break;
               e.setAttribute(aName.htmlDecode(),aValue.htmlDecode());
            }
         }
         if (innerHtml.length>0)
            e.innerHTML=innerHtml;
      }
      else
         e=document.createElement(sTag);
      return e;
   };
Foundation.setInnerHtml=function(element,html)
   {
      try{element.innerHTML=html;return;}catch(e){}
      var c=document.createElement("DIV");
      c.innerHTML="<"+element.tagName+">"+html+"</"+element.tagName+">";
      var e=c.children[0];
      while (element.children.length>0)
         element.removeChild(element.children[0]);
      while (e.children.length>0)
         element.appendChild(e.children[0]);
      c.removeChild(e);
      c=e=null;
   };
Foundation.getComputedStyle=function(element,property)
   {
      if (element.currentStyle)
         return element.currentStyle[property];
      if (window.getComputedStyle)
         return window.getComputedStyle(element,null)[property];
      if (document.defaultView &&
          document.defaultView.getComputedStyle)
      {
         var style=document.defaultView.getComputedStyle(element,null);
         if (style)
            return style.getPropertyValue(property);
         else if (property=="display")
            return "none";
      }
      return element.style[property];
   };
Foundation.preprocessed=false;
Foundation.$readTextFile=function(path,bustCache,pushPath)
   {
      if (Foundation.includeBase.length>0)
         path=Foundation.includeBase[Foundation.includeBase.length-1]+path;
      path=path.replace(/(^|\/)\.\//g,"");
      var text;
      var p;
      while ((p=path.search(/((^|\/)[^\/]\/\.\.\/)/))>=0)
         path=path.substr(0,p)+path.substr(p+RegExp.$1.length);
      if (pushPath)
         pushPath.push(path);
      if (bustCache)
         path+=(path.indexOf("?")>0 ? "&" : "?")+(new Date()).valueOf();
      try
      {
         var request=Foundation.getXmlHttpRequest();
         request.open("GET",path,false);
         if (request.overrideMimeType)
            request.overrideMimeType("text/plain");
         request.send("");
         text=request.responseText;
         request=null;
      }
      catch(e)
      {
         var reader=document.createElement("DIV");
         reader.style.behavior="url(#default#download)";
         var callback=new Function("text","arguments.callee.$text=text;");
         reader.startDownload(path,callback);
         text=callback.$text;
         callback=reader=null;
      }
      return text;
   };
Foundation.includeBase=new Array();
Foundation.getMostActiveScript=function()
   {
      var e=document.getElementsByTagName("SCRIPT");
      for (var i=e.length-1;i>=0;i--)
         if (e[i].readyState=="interactive")
            return e[i];
      return e.length==0 ? null : e[e.length-1];
   };
Foundation.pushIncludeBase=function(path)
   {
      if (Foundation.includeBase.length==0)
      {
         var src="";
         var script=Foundation.getMostActiveScript();
         if (script)
         {
            src=this.stripFileNameFromPath(script.src);
            if (src.indexOf(":")>0)
            {
               var base=document.getElementsByTagName('BASE');
               base=(base && base.length) ? base[0].href : this.stripFileNameFromPath(document.location.href);
               base=base.split("/");
               src=src.split("/");
               while (base.length>0 && src.length>0 && src[0]==base[0])
               {
                  base.shift();
                  src.shift();
               }
               while (base.length>1)
               {
                  base.pop();
                  src.unshift("..");
               }
               src=src.join("/");
            }
         }
         Foundation.includeBase.push(src);
      }
      var file=null;
      var folder="";
      if (path)
      {
         folder=this.stripFileNameFromPath(path);
         file=path.substr(folder.length);
      }
      Foundation.includeBase.push(Foundation.includeBase[Foundation.includeBase.length-1]+folder);
      return file;
   };
Foundation.popIncludeBase=function()
   {
      Foundation.includeBase.pop();
      if (Foundation.includeBase.length==1)
         Foundation.includeBase.pop();
   };
Foundation.includeScripts=function(url,developmentOnly)
   {
      if (!Foundation.$includedScripts)
         Foundation.$includedScripts=new Array();
      var g=Foundation.getGlobalObject();
      for (var i=0;i<arguments.length;i++)
         if (typeof(arguments[i])=="string")
         {
            var file=this.pushIncludeBase(arguments[i]);
            eval.call(g,Foundation.$readTextFile(file,true,Foundation.$includedScripts));
            this.popIncludeBase();
         }
   };
Foundation.readTextFile=function(url,developmentOnly)
   {
      this.pushIncludeBase();
      var value=Foundation.$readTextFile(url,true).replace(/\r\n/g,"\n");
      this.popIncludeBase();
      return value;
   };
Foundation.StringBuilder=function(initialSize)
   {
      if(!initialSize)initialSize=1000;this.strings=new Array(initialSize+1);this.strings[0]="";
   };
Foundation.StringBuilder.$parentClass=null;
Foundation.StringBuilder.$constructor=function(){};
Foundation.StringBuilder.$interfaces=new Array();
Foundation.StringBuilder.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.StringBuilder);
Foundation.StringBuilder.$name="StringBuilder";
Foundation.StringBuilder.$childClasses=new Array();
Foundation.StringBuilder.$container=Foundation;
Foundation.StringBuilder.prototype={
   constructor:Foundation.StringBuilder,
   append:function(value){this.strings.push(value);return this;},
   clear:function(){this.strings.length=1;return this;},
   toString:function(){this.strings[1]=this.strings.join("");this.strings.length=2;return this.strings[1];},
   dispose:function()
   {
   }
};
Foundation.StringBuilder.getTypePath=Foundation.Class.getTypePath;
Foundation.StringBuilder.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.StringBuilder.$constructor();
   Foundation.Elemental=function()
   {
      Foundation.$registry[this.$Foundation_$registry_index=Foundation.$registry.length]=this;
   };
Foundation.Elemental.$parentClass=null;
Foundation.Elemental.$constructor=function(){};
Foundation.Elemental.$interfaces=new Array();
Foundation.Elemental.$interfaces.push(Foundation.Interface);
if (!Foundation.Interface.$childClasses) Foundation.Interface.$childClasses=new Array();
Foundation.Interface.$childClasses.push(Foundation.Elemental);
Foundation.Elemental.$name="Elemental";
Foundation.Elemental.$childClasses=new Array();
Foundation.Elemental.$container=Foundation;
Foundation.Elemental.prototype={
   constructor:Foundation.Elemental,
   dispose:function()
      {
         if (this.$Foundation_$registry_index)
         {
            Foundation.$registry[this.$Foundation_$registry_index]=null;
            this.$Foundation_$registry_index=null;
         }
      },
   event:function(code,delayed,disable)
      {
         code="Foundation.$registry["+this.$Foundation_$registry_index+"]"+(code ? "."+code : "");
         if (delayed)
         {
            if (arguments.length<3)
               disable=true;
            code=(disable ? "this.disabled=true;" : "")+"window.setTimeout('"+code.cEncode()+"',1);";
         }
         return code;
      },
   elementId:function(id,index)
      {
         return "Foundation_Elemental_"+this.$Foundation_$registry_index+"_"+id+(typeof(index)=="number" ? "_"+index : "");
      },
   getElement:function(id,index)
      {
         return document.getElementById(this.elementId(id,index));
      },
   getElements:function(name,index)
      {
         return document.getElementsByName(this.elementId(id,index));
      },
   getElementValue:function(id,defaultValue)
      {
         var element=this.getElement(id);
         if (element)
            return element.value;
         return defaultValue;
      },
   parseElementId:function(id)
      {
         var subId=this.elementId("");
         if (!id || id.length<subId.length || id.substr(0,subId.length)!=subId)
            return null;
         return id.substr(subId.length);
      },
   attachEvent:function(element,eventName,code,delayed,disable)
      {
         var f;
         if (typeof(element)=="string")
            element=document.getElementById(element);
         if (document.attachEvent)
            element.attachEvent(eventName,f=new Function("event","return "+this.event(code,delayed,disable)));
         else
            if (eventName=="onkeypress" && Foundation.loadScriptDomainsMustMatch && !element.onkeypress)
               element.onkeypress=f=new Function("event","return "+this.event(code,delayed,disable));
            else
               element.addEventListener(eventName.substr(2),f=new Function("event","return "+this.event(code,delayed,disable)),false);
         return f;
      },
   detachEvent:function(element,eventName,f)
      {
         if (typeof(element)=="string")
            element=document.getElementById(element);
         if (!element)
            return;
         if (document.detachEvent)
            element.detachEvent(eventName,f);
         else
            if (eventName=="onkeypress" && Foundation.loadScriptDomainsMustMatch && element.onkeypress)
               element.onkeypress=null;
            else
               element.removeEventListener(eventName.substr(2),f,false);
      },
   processHtml:function(html)
      {
         return this.constructor.processHtml.apply(this,arguments);
      }
};
Foundation.Elemental.getById=function(id,decendantsToo)
      {
         var o;
         for (var i=Foundation.$registry.length-1;i>0;i--)
            if ((o=Foundation.$registry[i]) &&
                o.id==id &&
                (decendantsToo ? o.constructor.isInstanceOf(this) : o.constructor==this))
               return o;
         return null;
      };
Foundation.Elemental.getFirst=function(decendantsToo)
      {
         var o;
         for (var i=1;i<Foundation.$registry.length;i++)
            if ((o=Foundation.$registry[i]) &&
                (decendantsToo ? o.constructor.isInstanceOf(this) : o.constructor==this))
               return o;
         return null;
      };
Foundation.Elemental.getNext=function(o,decendantsToo)
      {
         for (var i=o.$Foundation_$registry_index+1;i<Foundation.$registry.length;i++)
            if ((o=Foundation.$registry[i]) &&
                (decendantsToo ? o.constructor.isInstanceOf(this) : o.constructor==this))
               return o;
         return null;
      };
Foundation.Elemental.processHtml=function(html)
      {
         if (html==null)
            return "";
         html=html.toString();
         if (html.indexOf('`')<0)
            return html;
         var parts=html.split("`");
         var html=new Foundation.StringBuilder();
         function execCode(o,code)
         {
            while (code.length>0)
            {
               var p=code.indexOf('.');
               var m=code.indexOf('(');
               if (m<0 && p<0)
               {
                  o=o[code];
                  code="";
               }
               else if (p>=0 && (m<0 || p<m))
               {
                  o=o[code.substr(0,p)];
                  code=code.substr(p+1);
               }
               else
               {
                  p=code.indexOf(')',m);
                  o=o[code.substr(0,m)](code.substr(m+1,p-m-1));
                  code=code.substr(p+1);
               }
            }
            return o;
         }
         function evalBool(value,isNeg,boolType,leader)
         {
            value=value?true:false;
            if (isNeg)
               value=!value;
            if (boolType=='c')
               return value ? "checked" : "";
            if (boolType=='s')
               return value ? "selected" : "";
            if (boolType=='d')
               return value ? "" : "none";
            if (boolType=='v')
               return value ? "visible" : "hidden";
            if (boolType=='t')
               return value ? "true" : "false";
            if (leader.endsWith("visibility:"))
               return value ? "visible" : "hidden";
            else if (leader.endsWith("display:"))
               return value ? "" : "none";
            return value ? "true" : "false";
         }
         for (var i=0;i<parts.length;i++)
            if (i%2==0)
               html.append(leader=parts[i]);
            else
            {
               var o=leader.lastIndexOf("<");
               var c=leader.lastIndexOf(">");
               var q=leader.lastIndexOf("\"");
               var eq=leader.lastIndexOf("=\"",q);
               var part=parts[i];
               var encode=false;
               var isBool=false,isNeg=false,boolType="";
               var f=part.length>0 ? part.charAt(0) : "";
               if (f=='?')
               {
                  isBool=true;
                  part=part.substr(1);
                  f=part.charAt(0);
               }
               else if (f=='!')
               {
                  isBool=isNeg=true;
                  part=part.substr(1);
                  f=part.charAt(0);
               }
               if (isBool && f=='[')
               {
                  boolType=part.charAt(1);
                  part=part.substr(3);
                  f=part.charAt(0);
               }
               var name=null;
               if (o<=q && c<=q && q<=eq+1 &&
                   (s=leader.lastIndexOf(' ',eq)+1)>0)
               {
                  name=leader.substr(s,eq-s).toLowerCase();
                  encode=true;
               }
               if (f=='=')
                  part=execCode(this,part.substr(1));
               else if (f=='#')
                  part=this.getCssName(part.substr(1));
               else if (f=='~')
                  part=this.elementId(part.substr(1));
               else if (f=='-')
                  part=this.event(part.substr(1));
               else if (f=='+')
                  part=this.event(part.substr(1),true);
               else if (f=='@')
                  part=this.resource(part.substr(1));
               else if (f=='$')
                  part=this.resourceUrl(part.substr(1));
               else if (name=="id" || name=="name" || name=="for")
                  part=this.elementId(part);
               else if (name!=null && name.startsWith("on"))
                  part=this.event(part);
               else if (name=="class")
                  part=this.getCssName(part);
               else if (name=="src" || name=="href")
                  part=this.resourceUrl(part);
               else
                  part=this.resource(part);
               if (isBool)
                  part=evalBool(part,isNeg,boolType,leader);
               if (part!=null)
               {
                  if (encode)
                     part=part.toString().htmlEncode();
                  html.append(this.processHtml(part));
               }
            }
         return html.toString();
      };
Foundation.Elemental.getTypePath=Foundation.Interface.getTypePath;
Foundation.Elemental.$constructor();
Foundation.Resourceful=function()
   {
   };
Foundation.Resourceful.$parentClass=null;
Foundation.Resourceful.$constructor=function(){};
Foundation.Resourceful.$interfaces=new Array();
Foundation.Resourceful.$interfaces.push(Foundation.Interface);
if (!Foundation.Interface.$childClasses) Foundation.Interface.$childClasses=new Array();
Foundation.Interface.$childClasses.push(Foundation.Resourceful);
Foundation.Resourceful.$name="Resourceful";
Foundation.Resourceful.$childClasses=new Array();
Foundation.Resourceful.$container=Foundation;
Foundation.Resourceful.prototype={
   constructor:Foundation.Resourceful,
   resource:function(index)
      {
         if (this.resourcePack && typeof(this.resourcePack[index])!="undefined")
            return Foundation.Resourceful.$transformResource(this.resourcePack[index],arguments);
         for (var c=this.constructor;c;c=c.$parentClass)
            if (c.resourcePack && typeof(c.resourcePack[index])!="undefined")
               return Foundation.Resourceful.$transformResource(c.resourcePack[index],arguments);
         return null;
      },
   resourceUrl:function(index)
      {
         if (typeof(index)=="undefined" || index==null)
            Foundation.getClassScriptFolder(this.constructor);
         if (this.resourcePack && typeof(this.resourcePack[index])!="undefined")
            return Foundation.getClassScriptFolder(this.constructor)+Foundation.Resourceful.$transformResource(this.resourcePack[index],arguments);
         for (var c=this.constructor;c;c=c.$parentClass)
            if (c.resourcePack && typeof(c.resourcePack[index])!="undefined")
               return Foundation.getClassScriptFolder(c)+Foundation.Resourceful.$transformResource(c.resourcePack[index],arguments);
         return null;
      },
   dispose:function()
   {
   }
};
Foundation.Resourceful.resource=function(index)
      {
         for (var c=this;c;c=c.$parentClass)
            if (c.resourcePack && typeof(c.resourcePack[index])!="undefined")
               return Foundation.Resourceful.$transformResource(c.resourcePack[index],arguments);
         return null;
      };
Foundation.Resourceful.resourceUrl=function(index)
      {
         if (typeof(index)=="undefined" || index==null)
            Foundation.getClassScriptFolder(this);
         for (var c=this;c;c=c.$parentClass)
            if (c.resourcePack && typeof(c.resourcePack[index])!="undefined")
               return Foundation.getClassScriptFolder(c)+Foundation.Resourceful.$transformResource(c.resourcePack[index],arguments);
         return null;
      };
Foundation.Resourceful.$transformResource=function(resource,args)
      {
         if (typeof(resource)=="string" && args.length>1)
         {
            resource=resource.split('%');
            var cookedResource=new Array(resource.length);
            var ia=2;
            var oddTest=0;
            while (true)
            {
               while (ia<args.length)
               {
                  var a=args[ia-1].toString();
                  for (var ir=1;ir<resource.length;ir++)
                  {
                     var r=resource[ir];
                     if (r!=null &&
                         r.startsWith(a))
                     {
                        cookedResource[ir]=args[ia]+r.substr(a.length);
                        resource[ir]=null;
                     }
                  }
                  ia+=2;
               }
               if (args.length%2==oddTest)
               {
                  args=args[args.length-1];
                  if (typeof(args.length)!="number")
                     break;
                  oddTest=ia=1;
               }
               else
                  break
            }
            for (var ir=0;ir<resource.length;ir++)
               if (resource[ir]!=null)
                  cookedResource[ir]=(ir>0 ? '%' : '')+resource[ir];
            resource=cookedResource.join("");
         }
         return resource;
      };
Foundation.Resourceful.getTypePath=Foundation.Interface.getTypePath;
Foundation.Resourceful.$constructor();
   Foundation.establishNamespace("Foundation.Controls");
Foundation.Controls.Control=function(resourcePack)
      {
      Foundation.Elemental.call(this);
      Foundation.Resourceful.call(this);
         this.resourcePack=resourcePack||{};
         this.id=this.resource("id");
         this.boundElementIdList=new Array();
         this.setDisabled(this.resource("disabled") ? true : false);
         this.setValue(this.resource("value"));
         this.resourceFolder=null;
      };
Foundation.Controls.Control.$parentClass=null;
Foundation.Controls.Control.$constructor=function()
         {
            if (document.readyState!="complete")
               this.writeRulesToPage();
            if (Foundation.Controls.Control && !Foundation.Controls.Control.$binding && this.resource("bindElementTagName"))
            {
               if (window.attachEvent)
                  window.attachEvent("onload",new Function("event","Foundation.Controls.Control.$bindClassesToElements(Foundation.Controls.Control,event)"));
               else
                  window.addEventListener("load",new Function("event","Foundation.Controls.Control.$bindClassesToElements(Foundation.Controls.Control,event)"),false);
               Foundation.Controls.Control.$binding=true;
            }
         };
Foundation.Controls.Control.$interfaces=new Array();
Foundation.Controls.Control.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.Controls.Control);
Foundation.Controls.Control.$interfaces.push(Foundation.Elemental);
if (!Foundation.Elemental.$childClasses) Foundation.Elemental.$childClasses=new Array();
Foundation.Elemental.$childClasses.push(Foundation.Controls.Control);
Foundation.Controls.Control.$interfaces.push(Foundation.Resourceful);
if (!Foundation.Resourceful.$childClasses) Foundation.Resourceful.$childClasses=new Array();
Foundation.Resourceful.$childClasses.push(Foundation.Controls.Control);
Foundation.Controls.Control.$name="Control";
Foundation.Controls.Control.$childClasses=new Array();
Foundation.Controls.Control.$container=Foundation.Controls;
Foundation.Controls.Control.prototype={
   constructor:Foundation.Controls.Control,
   dispose:function()
         {
            this.unbindEvents();
            Foundation.Resourceful.prototype.dispose.call(this);
      Foundation.Elemental.prototype.dispose.call(this);
         },
   bind:function()
         {
            var e=document.getElementById(this.getBindId());
            if (e)
               this.bindToElement(e,null);
         },
   bindInnerHtml:function(element,event)
         {
            var tag=this.resource("bindElementTagName");
            if (tag!="INPUT")
               Foundation.setInnerHtml(element,this.getInnerHtml());
         },
   bindToElement:function(element,event)
         {
            if (typeof(element)=="string")
               element=document.getElementById(element);
            var cssName=this.constructor.getCssName();
            element.setAttribute(cssName+"_id",this.id==null ? "" : this.id.toString(),1);
            if (element.className.indexOf(cssName)<0)
               element.className+=" "+cssName;
            this.boundElementIdList.push(element.id);
            return this;
         },
   getBoundElement:function(index)
         {
            return document.getElementById(this.boundElementIdList[typeof(index)=="number" ? index : 0]);
         },
   getBoundElements:function()
         {
            var elements=new Array(),e;
            for (var i=0;i<this.boundElementIdList.length;i++)
               if (e=document.getElementById(this.boundElementIdList[i]))
                  elements.push(e);
            return elements;
         },
   bindEvents:function(element)
         {
            var elementId;
            if (typeof(element)=="string")
               element=document.getElementById(elementId=element);
            else
               elementId=element.id;
            if (!this.eventBindings)
               this.eventBindings=new Object();
            if (!this.eventBindings[elementId])
               this.eventBindings[elementId]=new Object();
            var args=arguments;
            var index=1;
            while (index<args.length)
               if (index==args.length-1)
               {
                  args=args[index];
                  index=1;
               }
               else
               {
                  var name=args[index];
                  var code=args[index+1];
                  if (this.eventBindings[elementId][name])
                     this.detachEvent(element,name,this.eventBindings[elementId][name]);
                  this.eventBindings[elementId][name]=this.attachEvent(element,name,code);
                  index+=2;
               }
         },
   unbindFromElement:function(element)
         {
            if (typeof(element)=="string")
               element=document.getElementById(element);
            this.unbindEvents(element);
            for (var i=0;i<this.boundElementIdList.length;i++)
               if (element.id==this.boundElementIdList[i])
               {
                  for (i++;i<this.boundElementIdList.length;i++)
                     this.boundElementIdList[i-1]=this.boundElementIdList[i];
                  this.boundElementIdList.length--;
                  break;
               }
            return this;
         },
   unbindEvents:function(element,eventName)
         {
            var elementId=null;
            if (element)
               if (typeof(element)=="string")
                  element=document.getElementById(elementId=element);
               else
                  elementId=element.id;
            if (this.eventBindings)
               for (var i in this.eventBindings)
                  if (!elementId || i==elementId)
                  {
                     var eb=this.eventBindings[i];
                     if (eb)
                        for (var j in eb)
                           if ((!eventName || j==eventName) &&
                               eb[j])
                           {
                              this.detachEvent(i,j,eb[j]);
                              eb[j]=null;
                           }
                  }
         },
   setValue:function(value,force)
         {
            if (force || this.compareValues(this.value,value)!=0)
            {
               var oldValue=this.value;
               this.value=value;
               if (typeof(oldValue)!="undefined")
                  this.onValueChanged(this.value,oldValue);
            }
         },
   compareValues:function(value1,value2)
         {
            if (typeof(value1)=="undefined" ||
                typeof(value2)=="undefined")
               return 1;
            if (value1==null)
               if (value2==null)
                  return 0;
               else
                  return 1;
            else
               if (value2==null)
                  return -1;
            value1=value1.toString();
            value2=value2.toString();
            if (value1<value2)
               return -1;
            if (value1>value2)
               return 1;
            return 0;
         },
   onValueChanged:function(newValue,oldValue)
         {
         },
   getValue:function()
         {
            return this.value;
         },
   parseValue:function(value)
         {
            return value;
         },
   getDisabled:function()
         {
            return this.disabled;
         },
   setDisabled:function(disabled)
         {
            if (disabled!=this.disabled)
            {
               var oldValue=this.disabled;
               this.disabled=disabled;
               if (typeof(oldValue)!="undefined")
                  this.onDisabledChanged(this.disabled,oldValue);
            }
         },
   onDisabledChanged:function(newValue,oldValue)
         {
         },
   getRawInnerHtml:function()
         {
            return this.resource("innerHtml"
                                 ,arguments
                                );
         },
   getInnerHtml:function()
         {
            return this.processHtml(this.getRawInnerHtml());
         },
   getRawHtml:function()
         {
            if (!this.id)
               this.id=Foundation.generateUniqueId();
            return this.resource("html"
                                 ,'tagName',this.getBindTag()
                                 ,'className',this.getBindClass().htmlEncode()
                                 ,'id',this.getBindId().htmlEncode()
                                 ,'style',this.getBindStyle().htmlEncode()
                                 ,'innerHtml',this.getInnerHtml(true)
                                 ,arguments
                                );
         },
   getBindTag:function(key)
         {
            return this.resource(key ? key : "bindElementTagName");
         },
   getBindId:function()
         {
            return this.id==null ? "" : this.id.toString();
         },
   getBindClass:function(name)
         {
            return this.getCssName(name);
         },
   getBindStyle:function()
         {
            return this.resource("bindElementStyle");
         },
   getHtml:function()
         {
            return this.processHtml(this.getRawHtml());
         },
   getCssName:function(id)
         {
            return this.constructor.getCssName.apply(this.constructor,arguments);
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
   processHtml:Foundation.Elemental.prototype.processHtml
};
Foundation.Controls.Control.resourcePack={
            html:"<%tagName id=\"%id\" class=\"%className\" %className_id=\"%id\" style=\"%style\">%innerHtml</%tagName>",
            innerHtml:"",
            bindElementStyle:""
         };
Foundation.Controls.Control.getAssociatedScript=function(last)
         {
            return Foundation.getAssociatedScript(this,last);
         };
Foundation.Controls.Control.$forcedResourcePack=function(resourcePack,elementId)
         {
            if (!resourcePack)
               resourcePack={id:elementId ? elementId : Foundation.generateUniqueId()};
            else
               if (!resourcePack.id)
                  resourcePack.id=elementId ? elementId : Foundation.generateUniqueId();
            return resourcePack; 
         };
Foundation.Controls.Control.resourcePackFromElement=function(element)
         {
            var resourcePack=element.getAttribute(this.getCssName()+"_resourcePack");
            if (!resourcePack)
               resourcePack=element.getAttribute("resourcePack");
            if (resourcePack)
            {
               try
               {
                  if (resourcePack.charAt(0)!="{")
                     resourcePack="{"+resourcePack+"}";
                  eval("resourcePack="+resourcePack);
               }
               catch(e)
               {
                  resourcePack=null;
               }
            }
            return Foundation.Controls.Control.$forcedResourcePack(resourcePack,element.id);
         };
Foundation.Controls.Control.$compileInternalBindIds=function(list,args)
         {
            if (typeof(args.length)=="number")
               for (var i=0;i<args.length;i++)
                  if (typeof(args[i])=="string")
                     list.push(args[i]);
                  else
                     this.$compileInternalBindIds(list,args[i]);
         };
Foundation.Controls.Control.bindToElement=function(element,resourcePack,event)
         {
            if (typeof(element)=="string")
               element=document.getElementById(element);
            if (!element.id)
               element.id=Foundation.generateUniqueId();
            var o=null;
            var id=element.getAttribute(this.getCssName()+"_id",1);
            var bindInner=true;
            if (id)
            {
               o=this.getById(id);
               bindInner=false;
            }
            if (!o)
            {
               if (!resourcePack)
                  resourcePack=this.resourcePackFromElement(element);
               o=this.getById(resourcePack.id);
               if (!o)
                  o=new this(resourcePack);
            }
            if (bindInner)
               o.bindInnerHtml(element);
            o.bindToElement(element,event);
            return o;
         };
Foundation.Controls.Control.getCssName=function(id)
         {
            var name=this.getTypePath().replace(/\./g,"_");
            if (typeof(id)=="string" && id.length>0)
               name+="__"+id;
            return name;
         };
Foundation.Controls.Control.bindToElements=function(event)
         {
            var num=0;
            var tagName=this.resource("bindElementTagName");
            if (tagName)
            {
               var cssName=this.getCssName();
               var classPathExp=new RegExp("(^|\\s)"+cssName.regExpEncode()+"(\\s|$)","i");
               var inputs=document.getElementsByTagName(tagName);
               for (var i=0;i<inputs.length;i++)
                  if (typeof(inputs[i].className)=="string" &&
                      inputs[i].className.search(classPathExp)>=0)
                  {
                     this.bindToElement(inputs[i],null,event);
                     num++;
                  }
            }
            return num;
         };
Foundation.Controls.Control.getRawCssRules=function()
         {
            return this.resource("cssRules",arguments);
         };
Foundation.Controls.Control.getCssRules=function()
         {
            return this.processHtml(this.getRawCssRules());
         };
Foundation.Controls.Control.$bindClassesToElements=function(controlClass,event)
         {
            controlClass.bindToElements(event);
            for (var i=0;i<controlClass.$childClasses.length;i++)
               Foundation.Controls.Control.$bindClassesToElements(controlClass.$childClasses[i],event);
         };
Foundation.Controls.Control.writeToPage=function(resourcePack)
         {
            var control=new this(Foundation.Controls.Control.$forcedResourcePack(resourcePack));
            document.write(control.getHtml());
            return control;
         };
Foundation.Controls.Control.writeRulesToPage=function()
         {
            var rules=this.getCssRules();
            if (rules)
               document.write("<STYLE>"+rules+"</STYLE>");
         };
Foundation.Controls.Control.getTypePath=Foundation.Class.getTypePath;
Foundation.Controls.Control.resource=Foundation.Resourceful.resource;
Foundation.Controls.Control.resourceUrl=Foundation.Resourceful.resourceUrl;
Foundation.Controls.Control.getById=Foundation.Elemental.getById;
Foundation.Controls.Control.getFirst=Foundation.Elemental.getFirst;
Foundation.Controls.Control.getNext=Foundation.Elemental.getNext;
Foundation.Controls.Control.processHtml=Foundation.Elemental.processHtml;
Foundation.Controls.Control.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.Controls.Control.$constructor();
   Foundation.Controls.FloatControl=function(resourcePack)
   {
   Foundation.Controls.Control.apply(this,arguments);
      this.floatCount=0;
      this.floatWaitingActivation=false;
      this.defaultValue=null;
      this.activeBoundElementId=null;
      this.lastFloatChildId=null;
      this.$firefoxIsAPieceOfCrap=new Array(false,false,false);
      this.ignoreUps=false;
   };
Foundation.Controls.FloatControl.$parentClass=Foundation.Controls.Control;
if (!Foundation.Controls.Control.$childClasses) Foundation.Controls.Control.$childClasses=new Array();
Foundation.Controls.Control.$childClasses.push(Foundation.Controls.FloatControl);
Foundation.Controls.FloatControl.$constructor=Foundation.Controls.Control.$constructor ? Foundation.Controls.Control.$constructor : function(){};
Foundation.Controls.FloatControl.$interfaces=new Array();
Foundation.Controls.FloatControl.$name="FloatControl";
Foundation.Controls.FloatControl.$childClasses=new Array();
Foundation.Controls.FloatControl.$container=Foundation.Controls;
Foundation.Controls.FloatControl.prototype={
   constructor:Foundation.Controls.FloatControl,
   bindToElement:function(element,event)
      {
         this.bindFloatEvents(element);
         return Foundation.Controls.Control.prototype.bindToElement.call(this,element,event);
      },
   getActiveFloatBoundElement:function()
      {
         return this.activeBoundElementId ? document.getElementById(this.activeBoundElementId) : null;
      },
   bindFloatEvents:function(element)
      {
         this.bindEvents(element
                        ,"onfocus","floatBoundOnFocus(event)"
                        ,"onblur","floatBoundOnBlur(event)"
                        ,"onkeydown","floatBoundOnKeyDown(event)"
                        ,arguments
                        );
      },
   onDisabledChanged:function(newValue,oldValue)
      {
         if (!newValue)
            this.hideFloat();
         else
            if (this.floatCount>0)
               this.showFloat();
         Foundation.Controls.Control.prototype.onDisabledChanged.call(this,newValue,oldValue);
      },
   floatBoundOnFocus:function(event)
      {
         var element=(event.srcElement || event.target);
         var floatShowing=false;
         if (this.isFloatShown())
            if (this.activeBoundElementId==element.id)
               floatShowing=true;
            else
               this.hideFloat(element);
         this.resetFloatCount();
         if (floatShowing)
            this.maybeShowFloatActivation();
         else
            this.showFloat(element);
         this.incrementFloatCount();
         this.ignoreUps=true;
         return true;
      },
   floatBoundOnBlur:function(event)
      {
         this.decrementFloatCount();
         return true;
      },
   floatBoundOnKeyDown:function(event)
      {
         if (this.isFloatShown())
            if (this.floatWaitingActivation)
            {
               if (event.keyCode==40)
                  this.setFloatActivationSelected(true);
               else if (event.keyCode==38)
                  this.setFloatActivationSelected(false);
               else if (event.keyCode==13 &&
                        this.getFloatActivationSelected())
               {
                  event.cancelBubble=true;
                  event.returnValue=false;
                  if (event.stopPropagation)
                     event.stopPropagation();
                  if (event.preventDefault)
                     event.preventDefault();
                  this.activateFloat(event.srcElement || event.target);
                  return false;
               }
            }
            else
               if (event.keyCode==27)
               {
                  event.cancelBubble=true;
                  event.returnValue=false;
                  if (event.stopPropagation)
                     event.stopPropagation();
                  if (event.preventDefault)
                     event.preventDefault();
                  this.abortFloat(event.srcElement || event.target);
                  return false;
               }
         return true;
      },
   getFloatActivationSelected:function()
      {
         return this.floatActivationSelected;
      },
   setFloatActivationSelected:function(value)
      {
         if (value!=this.floatActivationSelected)
         {
            var oldValue=this.floatActivationSelected;
            this.floatActivationSelectedOnChange(this.floatActivationSelected=value,oldValue);
         }
      },
   floatActivationSelectedOnChange:function(newValue,oldValue)
      {
         var floatElement;
         this.floatActivationActivity();
         if (this.floatWaitingActivation &&
             (floatElement=this.getFloatElement()))
            floatElement.style.cssText=this.combineFloatStyle(floatElement,this.resource(newValue ? "activateFloatSelectedStyle" : "activateFloatUnselectedStyle"));
      },
   activateFloat:function(element)
      {
         if (this.floatActivationHandle)
            this.floatActivationHandle=window.clearTimeout(this.floatActivationHandle);
         if (this.floatWaitingActivation)
         {
            this.floatWaitingActivation=false;
            this.positionFloat(element);
            this.setFloatHtml(this.getFloatHtml(),this.resource("floatStyle"));
            this.focusToFloat(element);
         }
      },
   focusToFloat:function(boundElement)
      {
      },
   getFloatHtml:function()
      {
         return this.resource("floatHtml",arguments);
      },
   getActivateFloatHtml:function()
      {
         return this.resource("activateFloatHtml",arguments);
      },
   getFloatElement:function()
      {
         return this.getElement("float");
      },
   combineFloatStyle:function(floatElement,style)
      {
         return "position:absolute;top:"+floatElement.style.top+";left:"+floatElement.style.left+";display:"+floatElement.style.display+";"+style;
      },
   setFloatFocusEvents:function(childNodes,attach)
      {
         for (var i=0;i<childNodes.length;i++)
         {
            var e=childNodes[i];
            if (e.id)
               if (attach)
                  this.bindEvents(e
                                  ,"onfocus","floatChildOnFocus(event)"
                                  ,"onblur","floatChildOnBlur(event)"
                                 );
               else
                  this.unbindEvents(e);
            this.setFloatFocusEvents(e.childNodes,attach);
         }
      },
   floatChildOnFocus:function(event)
      {
         this.lastFloatChildId=(event.srcElement || event.target).id;
         this.incrementFloatCount(event);
      },
   floatChildOnBlur:function(event)
      {
         this.decrementFloatCount(event);
      },
   saveFloatData:function()
      {
      },
   setFloatHtml:function(html,style,floatElement)
      {
         this.saveFloatData();
         if (!floatElement)
            floatElement=this.getFloatElement();
         if (!floatElement)
            return;
         if (style)
            floatElement.style.cssText=this.combineFloatStyle(floatElement,style);
         this.lastFloatChildId=null;
         this.setFloatFocusEvents(floatElement.childNodes,false);
         html=this.processHtml(html);
         Foundation.setInnerHtml(floatElement,html);
         this.setFloatFocusEvents(floatElement.childNodes,true);
      },
   startFloatActivation:function()
      {
         floatActivationPeriod         
      },
   floatActivationPeriodExpired:function()
      {
         this.floatActivationHandle=null;
         this.hideFloat();
      },
   floatActivationActivity:function()
      {
         if (this.floatActivationHandle)
         {
            window.clearTimeout(this.floatActivationHandle);
            this.floatActivationHandle=window.setTimeout(this.event("floatActivationPeriodExpired()"),this.resource("floatActivationPeriod"));
         }
      },
   maybeShowFloatActivation:function(floatElement)
      {
         var html=this.getActivateFloatHtml();
         if (html)
         {
            this.floatWaitingActivation=true;
            this.floatActivationSelected=false;
            this.setFloatHtml(html,this.resource("activateFloatUnselectedStyle"),floatElement);
            var period=this.resource("floatActivationPeriod");
            if (period>0)
               this.floatActivationHandle=window.setTimeout(this.event("floatActivationPeriodExpired()"),period);
            return true;
         }
         else
            this.floatWaitingActivation=false;
         return false;
      },
   maybePopulateFloat:function(floatElement)
      {
         if (!this.maybeShowFloatActivation(floatElement) &&
             floatElement)
            this.setFloatHtml(this.getFloatHtml(),this.resource("floatStyle"),floatElement);
      },
   createFloat:function(element)
      {
         var floatElement=document.createElement("DIV");
         floatElement.id=this.elementId("float");
         floatElement.style.position="absolute";
         floatElement.style.left=0;
         floatElement.style.top=0;
         floatElement.style.display="none";
         this.bindEvents(floatElement
                         ,"onfocus","floatOnFocus(event)"
                         ,"onblur","floatOnBlur(event)"
                         ,"onmousedown","floatOnMouseDown(event)"
                         ,"onmouseup","floatOnMouseUp(event)"
                         ,"ondblclick","floatOnDoubleClick(event)"
                         ,"onmouseover","floatOnMouseOver()"
                         ,"onmousemove","floatOnMouseMove()"
                         ,"onmouseout","floatOnMouseOut()"
                        );
         this.maybePopulateFloat(floatElement);
         document.body.appendChild(floatElement);
         if (!document.all)
            floatElement.style.MozUserSelect="none";
         return floatElement;
      },
   getActivationFloatSize:function(element)
      {
         return {width:100,height:18};
      },
   getFloatSize:function(element)
      {
         return {width:100,height:100};
      },
   getFloatPosition:function(element)
      {
         var rect=element ? Foundation.getElementRectangle(element) : {x:0,y:0,width:0,height:0};
         var hAlign=this.resource("hAlign");
         var vAlign=this.resource("vAlign");
         var size;
         if (this.floatWaitingActivation)
            size=this.getActivationFloatSize(element);
         else
            size=this.getFloatSize(element);

         var left,top;
         if (hAlign=="FAR_LEFT")
            left=rect.x-size.width;
         else if (hAlign=="CENTER")
            left=Math.floor(rect.x+rect.width/2-size.width/2);
         else if (hAlign=="RIGHT")
            left=rect.x+rect.width-size.width;
         else if (hAlign=="FAR_RIGHT")
            left=rect.x+rect.width;
         else
            left=rect.x;

         if (vAlign=="FAR_TOP")
            top=rect.y+rect.height;
         else if (vAlign=="MIDDLE")
            top=Math.floor(rect.y+rect.height/2-size.height/2);
         else if (vAlign=="BOTTOM")
            top=rect.y+rect.height;
         else if (vAlign=="FAR_BOTTOM")
            top=rect.y+rect.height;
         else
            top=rect.y+rect.height;

         if (left<document.body.scrollLeft)
            left=document.body.scrollLeft;
         if (left+size.width>document.body.scrollLeft+document.body.clientWidth)
            left=document.body.scrollLeft+document.body.clientWidth-size.width;

         if (top<document.body.scrollTop)
            top=document.body.scrollTop;
         if (top+size.height>document.body.scrollTop+document.body.clientHeight)
            top=document.body.scrollTop+document.body.clientHeight-size.height;
         return {left:left,top:top};
      },
   positionFloat:function(element)
      {
         var floatElement=this.getFloatElement();
         var position=this.getFloatPosition(element);
         floatElement.style.left=position.left;
         floatElement.style.top=position.top;
      },
   isFloatShown:function()
      {
         var floatElement=this.getFloatElement();
         return floatElement && floatElement.style.display!="none";
      },
   canShowFloat:function(element)
      {
         return !this.getDisabled();
      },
   updateFloat:function(element)
      {
         this.synchFloat(element);
         this.setFloatHtml(this.getFloatHtml(),this.resource("floatStyle"));
         this.showFloat();
      },
   showFloat:function(element)
      {
         if (element)
            this.activeBoundElementId=element.id;
         else
            element=this.getActiveFloatBoundElement();
         this.defaultValue=element.value;
         this.synchFloat(element);
         if (!this.canShowFloat(element))
         {
            this.hideFloat(element);
            return false;
         }
         var floatElement=this.getFloatElement();
         if (!floatElement)
            floatElement=this.createFloat(element);
         else
            this.maybePopulateFloat(floatElement);
         if (floatElement.style.display!="block")
         {
            this.positionFloat(element);
            floatElement.style.display="block";
         }
         this.focusToFloat(element);
         if (typeof(this.onShow)=="function")
            this.onShow(element);
         return true;
      },
   synchFloat:function(element)
      {
         this.setValue(this.parseValue(element.value));
      },
   setFloatBoundElementValue:function(element,value)
      {
         if (element && element.value!=value)
         {
            element.value=value;
            this.floatBoundElementOnChange(element);
         }
         return element;
      },
   floatBoundElementOnChange:function(element)
      {
         if (element.fireEvent)
            element.fireEvent("onchange");
         else if (element.dispatchEvent)
         {
            var e=document.createEvent("HTMLEvents");
            e.initEvent("change",false,false);
            element.dispatchEvent(e);
         }
      },
   abortFloat:function(element)
      {
         this.hideFloat(element,true);
         if (element)
         {
            if (this.defaultValue!=null)
               this.setFloatBoundElementValue(element,this.defaultValue);
            element.blur();
         }
         this.resetFloatCount();
      },
   hideFloat:function(element,aborted)
      {
         if (this.floatHandle)
            this.floatHandle=window.clearTimeout(this.floatHandle);
         if (this.floatActivationHandle)
            this.floatActivationHandle=window.clearTimeout(this.floatActivationHandle);
         this.floatWaitingActivation=false;
         var floatElement=this.getFloatElement();
         if (floatElement)
            floatElement.style.display="none";
         if (typeof(this.onHide)=="function")
            this.onHide(element,aborted ? true : false);
      },
   floatOnFocus:function(event)
      {
         this.incrementFloatCount(event);
      },
   floatOnBlur:function(event)
      {
         this.decrementFloatCount(event);
      },
   floatOnMouseDown:function(event)
      {
         this.ignoreUps=false;
         this.incrementFloatCount(event);
      },
   floatOnMouseUp:function(event)
      {
         if (this.ignoreUps)
            this.ignoreUps=false;
         else
            this.decrementFloatCount(event);
         if (this.floatWaitingActivation)
            this.activateFloat(this.getActiveFloatBoundElement());
         else
            this.focusToDefaultElement(event);
      },
   floatOnMouseOver:function(event)
      {
         this.setFloatActivationSelected(true);
      },
   floatOnMouseMove:function(event)
      {
         this.floatActivationActivity();
      },
   floatOnMouseOut:function(event)
      {
         this.setFloatActivationSelected(false);
      },
   focusToDefaultElement:function(event)
      {
         var element;
         if ((this.lastFloatChildId &&
              (element=document.getElementById(this.lastFloatChildId))) ||
             (element=this.getActiveFloatBoundElement()))
            element.focus();
      },
   synchActiveFloatBoundElement:function()
      {
         var value=this.getValue();
         if (value!=null)
            return this.setFloatBoundElementValue(this.getActiveFloatBoundElement(),value.toString());
      },
   floatOnDoubleClick:function(event)
      {
         this.incrementFloatCount(event);
      },
   incrementFloatCount:function(event)
      {
         if (event && event.which && event.type=="mousedown")
            if (this.$firefoxIsAPieceOfCrap[event.button])
               return;
            else
               this.$firefoxIsAPieceOfCrap[event.button]=true;
         if (event && event.type=="dblclick" && event.which)
            return;
         this.floatCount++;
         if (this.floatHandle)
            this.floatHandle=window.clearTimeout(this.floatHandle);
      },
   decrementFloatCount:function(event)
      {
         if (event && event.type=="mouseup" && event.which)
            if (this.$firefoxIsAPieceOfCrap[event.button])
               this.$firefoxIsAPieceOfCrap[event.button]=false;
            else
               return;
         if (this.floatCount>0)
            this.floatCount--;
         if (this.floatCount==0 && !this.floatHandle)
            this.floatHandle=window.setTimeout(this.event("hideFloat()"),this.resource("floatHideDelay"));
      },
   resetFloatCount:function()
      {
         this.floatCount=0;
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
   setValue:Foundation.Controls.Control.prototype.setValue,
   compareValues:Foundation.Controls.Control.prototype.compareValues,
   onValueChanged:Foundation.Controls.Control.prototype.onValueChanged,
   getValue:Foundation.Controls.Control.prototype.getValue,
   parseValue:Foundation.Controls.Control.prototype.parseValue,
   getDisabled:Foundation.Controls.Control.prototype.getDisabled,
   setDisabled:Foundation.Controls.Control.prototype.setDisabled,
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
Foundation.Controls.FloatControl.resourcePack={
         bindElementTagName:"INPUT",
         hAlign:"LEFT",
         vAlign:"FAR_BOTTOM",
         floatHideDelay:100,
         floatHtml:"",
         floatStyle:"border:1px solid #0000ff;background-color:#eeeeff;padding:5px",
         //activateFloatHtml:"Click here to activate whatever",
         activateFloatSelectedStyle:"border:1px solid #0000ff;background-color:#aaaaff",
         activateFloatUnselectedStyle:"border:1px solid #0000ff;background-color:#eeeeff",
         floatActivationPeriod:5000
      }
   ;
Foundation.Controls.FloatControl.getTypePath=Foundation.Controls.Control.getTypePath;
Foundation.Controls.FloatControl.resource=Foundation.Controls.Control.resource;
Foundation.Controls.FloatControl.resourceUrl=Foundation.Controls.Control.resourceUrl;
Foundation.Controls.FloatControl.getById=Foundation.Controls.Control.getById;
Foundation.Controls.FloatControl.getFirst=Foundation.Controls.Control.getFirst;
Foundation.Controls.FloatControl.getNext=Foundation.Controls.Control.getNext;
Foundation.Controls.FloatControl.processHtml=Foundation.Controls.Control.processHtml;
Foundation.Controls.FloatControl.isInstanceOf=Foundation.Controls.Control.isInstanceOf;
Foundation.Controls.FloatControl.getAssociatedScript=Foundation.Controls.Control.getAssociatedScript;
Foundation.Controls.FloatControl.resourcePackFromElement=Foundation.Controls.Control.resourcePackFromElement;
Foundation.Controls.FloatControl.bindToElement=Foundation.Controls.Control.bindToElement;
Foundation.Controls.FloatControl.getCssName=Foundation.Controls.Control.getCssName;
Foundation.Controls.FloatControl.bindToElements=Foundation.Controls.Control.bindToElements;
Foundation.Controls.FloatControl.getRawCssRules=Foundation.Controls.Control.getRawCssRules;
Foundation.Controls.FloatControl.getCssRules=Foundation.Controls.Control.getCssRules;
Foundation.Controls.FloatControl.writeToPage=Foundation.Controls.Control.writeToPage;
Foundation.Controls.FloatControl.writeRulesToPage=Foundation.Controls.Control.writeRulesToPage;
Foundation.Controls.FloatControl.$constructor();
Foundation.ClientLoader=function()
      {
      Foundation.Elemental.call(this);
      Foundation.Resourceful.call(this);
         this.debug=this.constructor.debug;
         this.parameterStore=new Object();
         this.scripts=null;
         this.timerHandle=0;
         this.testInterval=this.resource("testInterval");;
      };
Foundation.ClientLoader.$parentClass=null;
Foundation.ClientLoader.$constructor=function(){};
Foundation.ClientLoader.$interfaces=new Array();
Foundation.ClientLoader.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.ClientLoader);
Foundation.ClientLoader.$interfaces.push(Foundation.Elemental);
if (!Foundation.Elemental.$childClasses) Foundation.Elemental.$childClasses=new Array();
Foundation.Elemental.$childClasses.push(Foundation.ClientLoader);
Foundation.ClientLoader.$interfaces.push(Foundation.Resourceful);
if (!Foundation.Resourceful.$childClasses) Foundation.Resourceful.$childClasses=new Array();
Foundation.Resourceful.$childClasses.push(Foundation.ClientLoader);
Foundation.ClientLoader.$name="ClientLoader";
Foundation.ClientLoader.$childClasses=new Array();
Foundation.ClientLoader.$container=Foundation;
Foundation.ClientLoader.prototype={
   constructor:Foundation.ClientLoader,
   requestScriptList:function(resourceKey,parameters)
         {
            var url=this.resource(resourceKey);
            url+=(url.indexOf('?')<0 ? "?" : "&")+(parameters ? parameters+"&" : "")+"callback="+this.event("receiveScriptList").urlEncode()+"&debug="+(this.debug?"true":"false")+"&nocache="+Date.parse(new Date());
            Foundation.loadScript(url,null,this.debug);
         },
   receiveScriptList:function(scripts)
         {
            this.scripts=scripts;
            this.loadScriptList();
         },
   abort:function()
         {
            var inProgress=this.timerHandle!=0;
            this.clearTestInterval();
            return inProgress;
         },
   clearTestInterval:function()
         {
            if (this.timerHandle!=0)
            {
               window.clearInterval(this.timerHandle);
               this.timerHandle=0;
            }
         },
   loadScriptList:function()
         {
            for (var i=0;i<this.scripts.length;i++)
            {
               if (eval(this.scripts[i].test))
                  if (this.scripts[i].execute)
                  {
                     eval(this.scripts[i].execute);
                     this.scripts[i].test="false";
                  }
                  else
                  {
                     if (!this.scripts[i].requested)
                     {
                        if (this.timerHandle==0)
                           this.timerHandle=window.setInterval(this.event("loadScriptList();"),this.testInterval);
                        this.scripts[i].requested=true;
                        Foundation.loadScript(this.scripts[i].src);
                     }
                     return;
                  }
            }
            this.clearTestInterval();
            window.setTimeout(this.event("readyToProcess()"),1);
         },
   readyToProcess:function()
         {
         },
   dispose:function()
   {
      Foundation.Resourceful.prototype.dispose.call(this);
      Foundation.Elemental.prototype.dispose.call(this);
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
   processHtml:Foundation.Elemental.prototype.processHtml
};
Foundation.ClientLoader.resourcePack={
            testInterval:100
         }
      ;
Foundation.ClientLoader.getTypePath=Foundation.Class.getTypePath;
Foundation.ClientLoader.resource=Foundation.Resourceful.resource;
Foundation.ClientLoader.resourceUrl=Foundation.Resourceful.resourceUrl;
Foundation.ClientLoader.getById=Foundation.Elemental.getById;
Foundation.ClientLoader.getFirst=Foundation.Elemental.getFirst;
Foundation.ClientLoader.getNext=Foundation.Elemental.getNext;
Foundation.ClientLoader.processHtml=Foundation.Elemental.processHtml;
Foundation.ClientLoader.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.ClientLoader.$constructor();

}
