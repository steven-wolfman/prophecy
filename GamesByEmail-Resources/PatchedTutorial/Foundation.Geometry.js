/*
Foundation.Geometry
Copyright © 2005-2011 Scott Nesin, all rights reserved.
Documentation: http://FoundationDotJS.org/Foundation.Geometry.htm
*/
/*
   ***** Preprocessed code, any modifications will be lost. *****
     Foundation.js, object oriented JavaScript framework:
     http://FoundationDotJS.org/
     Preprocessed for speed:
     http://FoundationDotJS.org/Foundation.Preprocessor.htm
*/
Foundation.Point=function()
{
   this.x=0;
   this.y=0;
   this.set.apply(this,arguments);
};
Foundation.Point.$parentClass=null;
Foundation.Point.$constructor=function(){};
Foundation.Point.$interfaces=new Array();
Foundation.Point.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.Point);
Foundation.Point.$name="Point";
Foundation.Point.$childClasses=new Array();
Foundation.Point.$container=Foundation;
Foundation.Point.prototype={
   constructor:Foundation.Point,
   toString:function()
   {
      return "("+this.x+","+this.y+")";
   },
   equals:function()
   {
      switch (arguments.length)
      {
      case 1 :
         return (arguments[0]!=null &&
                 this.x==arguments[0].x &&
                 this.y==arguments[0].y);
      case 2 :
         return (this.x==arguments[0] &&
                 this.y==arguments[1]);
      }
      return false;
   },
   add:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x+=arguments[0].x;
         this.y+=arguments[0].y;
         break;
      case 2 :
         this.x+=arguments[0];
         this.y+=arguments[1];
         break;
      }
      return this;
   },
   subtract:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x-=arguments[0].x;
         this.y-=arguments[0].y;
         break;
      case 2 :
         this.x-=arguments[0];
         this.y-=arguments[1];
         break;
      }
      return this;
   },
   set:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x=arguments[0].x;
         this.y=arguments[0].y;
         break;
      case 2 :
         this.x=arguments[0];
         this.y=arguments[1];
         break;
      }
      return this;
   },
   scale:function(scale)
   {
      this.x*=scale;
      this.y*=scale;
      return this;
   },
   sign:function()
   {
      if (this.x>0)
         this.x=1;
      else
         if (this.x<0)
            this.x=-1;
         else
            this.x=0;
      if (this.y>0)
         this.y=1;
      else
         if (this.y<0)
            this.y=-1;
         else
            this.y=0;
      return this;
   },
   distance:function(otherPoint)
   {
      return Math.sqrt((this.x-otherPoint.x)*(this.x-otherPoint.x)+(this.y-otherPoint.y)*(this.y-otherPoint.y));
   },
   magnitude:function()
   {
      return Math.sqrt(this.x*this.x+this.y*this.y);
   },
   angle:function(origin)
   {
      if (origin)
         return Math.atan2(this.y-origin.y,this.x-origin.x);
      return Math.atan2(this.y,this.x);
   },
   rotate:function(radians)
   {
      return this.set(this.x*Math.cos(radians)-this.y*Math.sin(radians),this.x*Math.sin(radians)+this.y*Math.cos(radians));
   },
   transform:function(tMatrix)
   {
      var x=this.x*tMatrix.a+this.y*tMatrix.c+tMatrix.tx;
      var y=this.x*tMatrix.b+this.y*tMatrix.d+tMatrix.ty;
      this.x=x;
      this.y=y;
      return this;
   },
   floor:function()
   {
      return this.set(Math.floor(this.x),Math.floor(this.y));
   },
   round:function()
   {
      return this.set(Math.round(this.x),Math.round(this.y));
   },
   ceil:function()
   {
      return this.set(Math.ceil(this.x),Math.ceil(this.y));
   },
   clone:function()
   {
      return new this.constructor(this);
   },
   dispose:function()
   {
   }
};
Foundation.Point.parse=function(value)
   {
      if (typeof(value)!="string" || value.length<2 || value.charAt(0)!='(' || value.charAt(value.length-1)!=')' || (value=value.substr(1,value.length-2).split(',')).length!=2 || isNaN(value[0]=parseFloat(value[0])) || isNaN(value[1]=parseFloat(value[1])))
         return null;
      return new this(value[0],value[1]);
   };
Foundation.Point.getTypePath=Foundation.Class.getTypePath;
Foundation.Point.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.Point.$constructor();
Foundation.Rectangle=function()
{
   this.x=0;
   this.y=0;
   this.width=0;
   this.height=0;
   this.set.apply(this,arguments);
};
Foundation.Rectangle.$parentClass=null;
Foundation.Rectangle.$constructor=function(){};
Foundation.Rectangle.$interfaces=new Array();
Foundation.Rectangle.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.Rectangle);
Foundation.Rectangle.$name="Rectangle";
Foundation.Rectangle.$childClasses=new Array();
Foundation.Rectangle.$container=Foundation;
Foundation.Rectangle.prototype={
   constructor:Foundation.Rectangle,
   toString:function()
   {
      return "("+this.x+","+this.y+","+this.width+","+this.height+")";
   },
   equals:function()
   {
      switch (arguments.length)
      {
      case 1 :
         return (arguments[0]!=null &&
                 this.x==arguments[0].x &&
                 this.y==arguments[0].y &&
                 this.width==arguments[0].width &&
                 this.height==arguments[0].height);
      case 4 :
            return (this.x==arguments[0] &&
                    this.y==arguments[1] &&
                    this.width==arguments[2] &&
                    this.height==arguments[3]);
      }
      return false;
   },
   getSize:function()
   {
      return new Foundation.Point(this.width,this.height);
   },
   add:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x+=arguments[0].x;
         this.y+=arguments[0].y;
         break;
      case 2 :
         this.x+=arguments[0];
         this.y+=arguments[1];
         break;
      }
      return this;
   },
   subtract:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x-=arguments[0].x;
         this.y-=arguments[0].y;
         break;
      case 2 :
         this.x-=arguments[0];
         this.y-=arguments[1];
         break;
      }
      return this;
   },
   set:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x=arguments[0].x;
         this.y=arguments[0].y;
         this.width=arguments[0].width;
         this.height=arguments[0].height;
         break;
      case 4 :
         this.x=arguments[0];
         this.y=arguments[1];
         this.width=arguments[2];
         this.height=arguments[3];
         break;
      }
      return this;
   },
   scale:function(scale)
   {
      this.x*=scale;
      this.y*=scale;
      this.width*=scale;
      this.height*=scale;
      return this;
   },
   inset:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.x+=arguments[0].x;
         this.y+=arguments[0].y;
         this.width-=2*arguments[0].x;
         this.height-=2*arguments[0].y;
         break;
      case 2 :
         this.x+=arguments[0];
         this.y+=arguments[1];
         this.width-=2*arguments[0];
         this.height-=2*arguments[1];
         break;
      }
      return this;
   },
   resize:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.width=arguments[0].x;
         this.height=arguments[0].y;
         break;
      case 2 :
         this.width=arguments[0];
         this.height=arguments[1];
         break;
      }
      return this;
   },
   resizeBy:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.width+=arguments[0].x;
         this.height+=arguments[0].y;
         break;
      case 2 :
         this.width+=arguments[0];
         this.height+=arguments[1];
         break;
      }
      return this;
   },
   containsXY:function(x,y)
   {
      return (x>=this.x && y>=this.y && x<=this.x+this.width-1 && y<=this.y+this.height-1);
   },
   containsPoint:function(point)
   {
      return this.containsXY(point.x,point.y);
   },
   constrainPoint:function(point)
   {
      point=point.clone();
      if (point.x<this.x)
         point.x=this.x;
      if (point.y<this.y)
         point.y=this.y;
      if (point.x>this.x+this.width-1)
         point.x=this.x+this.width-1;
      if (point.y>this.y+this.height-1)
         point.y=this.y+this.height-1;
      return point;
   },
   constrainRectangle:function(rectangle)
   {
      rectangle=rectangle.clone();
      var offset=new Foundation.Point();
      if (rectangle.x<this.x)
         offset.x=this.x-rectangle.x;
      if (rectangle.y<this.y)
         offset.y=this.y-rectangle.y;
      if (rectangle.x+rectangle.width>this.x+this.width)
         offset.x=this.x+this.width-rectangle.x-rectangle.width;
      if (rectangle.y+rectangle.height>this.y+this.height)
         offset.y=this.y+this.height-rectangle.y-rectangle.height;
      return rectangle.add(offset);
   },
   containPoint:function(point)
   {
      if (point.x<this.x)
      {
         this.width+=this.x-point.x;
         this.x=point.x;
      }
      else
         if (point.x>=this.x+this.width)
            this.width=point.x-this.x+1;
      if (point.y<this.y)
      {
         this.height+=this.y-point.y;
         this.y=point.y;
      }
      else
         if (point.y>=this.y+this.height)
            this.height=point.y-this.y+1;
      return this;
   },
   containRectangle:function(rectangle)
   {
      if (rectangle.x<this.x)
      {
         this.width+=this.x-rectangle.x;
         this.x=rectangle.x;
      }
      else
         if (rectangle.x+rectangle.width>this.x+this.width)
            this.width=rectangle.x+rectangle.width-this.x;
      if (rectangle.y<this.y)
      {
         this.height+=this.y-rectangle.y;
         this.y=rectangle.y;
      }
      else
         if (rectangle.y+rectangle.height>this.y+this.height)
            this.height=rectangle.y+rectangle.height-this.y;
      return this;
   },
   containPolygon:function(polygon)
   {
      for (var i=0;i<polygon.length;i++)
         this.containPoint(polygon[i]);
      return this;
   },
   getCenter:function()
   {
      return new Foundation.Point(this.x+this.width*0.5,this.y+this.height*0.5);
   },
   center:function(point)
   {
      return this.subtract(this.getCenter().subtract(point));
   },
   transform:function(tMatrix)
   {
      var o=new Foundation.Point(this.x,this.y);
      var c=new Foundation.Point(this.x+this.width-1,this.y+this.height-1);
      o.transform(tMatrix);
      c.transform(tMatrix);
      this.x=Math.min(o.x,c.x);
      this.y=Math.min(o.y,c.y);
      this.width=Math.abs(c.x-o.x)+1;
      this.height=Math.abs(c.y-o.y)+1;
      return this;
   },
   rotate:function(radians)
   {
      var o=new Foundation.Point(this.x,this.y);
      var c=new Foundation.Point(this.x+this.width-1,this.y+this.height-1);
      o.rotate(radians);
      c.rotate(radians);
      this.x=Math.min(o.x,c.x);
      this.y=Math.min(o.y,c.y);
      this.width=Math.abs(c.x-o.x)+1;
      this.height=Math.abs(c.y-o.y)+1;
      return this;
   },
   floor:function()
   {
      this.x=Math.floor(this.x);
      this.y=Math.floor(this.y);
      this.width=Math.floor(this.width);
      this.height=Math.floor(this.height);
      return this;
   },
   round:function()
   {
      this.x=Math.round(this.x);
      this.y=Math.round(this.y);
      this.width=Math.round(this.width);
      this.height=Math.round(this.height);
      return this;
   },
   ceil:function()
   {
      this.x=Math.ceil(this.x);
      this.y=Math.ceil(this.y);
      this.width=Math.ceil(this.width);
      this.height=Math.ceil(this.height);
      return this;
   },
   distanceToPoint:function(point)
   {
      return point.distance(this.constrainPoint(point));
   },
   clone:function()
   {
      return new this.constructor(this);
   },
   dispose:function()
   {
   }
};
Foundation.Rectangle.parse=function(value)
   {
      if (typeof(value)!="string" || value.length<2 || value.charAt(0)!='(' || value.charAt(value.length-1)!=')' || (value=value.substr(1,value.length-2).split(',')).length!=4 || isNaN(value[0]=parseFloat(value[0])) || isNaN(value[1]=parseFloat(value[1])) || isNaN(value[2]=parseFloat(value[2])) || isNaN(value[3]=parseFloat(value[3])))
         return null;
      return new this(value[0],value[1],value[2],value[3]);
   };
Foundation.Rectangle.getTypePath=Foundation.Class.getTypePath;
Foundation.Rectangle.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.Rectangle.$constructor();
Foundation.Polygon=function(p)
{
   this.length=0;
   if (arguments.length==1)
      for (var i=0;i<p.length;i++)
         this[this.length++]=new Foundation.Point(p[i]);
   else
      for (var i=1;i<arguments.length;i+=2)
         this[this.length++]=new Foundation.Point(arguments[i-1],arguments[i]);
   if (this.length>0)
   {
      if (!this[0].equals(this[this.length-1]))
         this[this.length++]=this[0].clone();
      this.rectangle=new Foundation.Rectangle(this[0].x,this[0].y,1,1);
      this.rectangle.containPolygon(this);
   }
   else
      this.rectangle=null;
};
Foundation.Polygon.$parentClass=null;
Foundation.Polygon.$constructor=function(){};
Foundation.Polygon.$interfaces=new Array();
Foundation.Polygon.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.Polygon);
Foundation.Polygon.$name="Polygon";
Foundation.Polygon.$childClasses=new Array();
Foundation.Polygon.$container=Foundation;
Foundation.Polygon.prototype={
   constructor:Foundation.Polygon,
   containsPoint:function(point)
   {
      function normal(v,d)
      {
         if (v>0) return 1;
         if (v<0) return -1;
         return d;
      }
      var count=0,lastDir=0,thisDir;
      if (this.rectangle!=null && !this.rectangle.containsPoint(point))
         return false;
      for (var i=this.length-1;i>0 && lastDir==0;i--)
         lastDir=normal(this[i].x-this[i-1].x,lastDir);
      for (var i=1;i<this.length;i++)
      {
         thisDir=normal(this[i].x-this[i-1].x,lastDir);
         if ((this[i-1].x<=point.x && this[i].x>point.x) ||
             (this[i-1].x>=point.x && this[i].x<point.x))
         {
            if (this[i-1].x==point.x)
            {
               if (this[i-1].y>point.y && thisDir==lastDir)
                  count++;
            }
            else
               if ((this[i-1].y+((point.x-this[i-1].x)*(this[i].y-this[i-1].y))/(this[i].x-this[i-1].x))>point.y)
                  count++;
         }
         else
            if (this[i-1].x==point.x && this[i].x==point.x &&
                this[i-1].y<=point.y && this[i].y>=point.y)
               return true;
         lastDir=thisDir;
      }
      return (count%2==1);
   },
   clone:function()
   {
      return new this.constructor(this);
   },
   dispose:function()
   {
   }
};
Foundation.Polygon.getTypePath=Foundation.Class.getTypePath;
Foundation.Polygon.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.Polygon.$constructor();
Foundation.TMatrix=function(a,b,c,d,tx,ty,u,v,w)
{
   this.a=a;
   this.b=b;
   this.c=c;
   this.d=d;
   this.tx=tx;
   this.ty=ty;
   this.u=typeof(u)=="number" ? u : 0;
   this.v=typeof(v)=="number" ? v : 0;
   this.w=typeof(w)=="number" ? w : 0;
};
Foundation.TMatrix.$parentClass=null;
Foundation.TMatrix.$constructor=function(){};
Foundation.TMatrix.$interfaces=new Array();
Foundation.TMatrix.$interfaces.push(Foundation.Class);
if (!Foundation.Class.$childClasses) Foundation.Class.$childClasses=new Array();
Foundation.Class.$childClasses.push(Foundation.TMatrix);
Foundation.TMatrix.$name="TMatrix";
Foundation.TMatrix.$childClasses=new Array();
Foundation.TMatrix.$container=Foundation;
Foundation.TMatrix.prototype={
   constructor:Foundation.TMatrix,
   toString:function()
   {
      return "|\t"+this.a+"\t"+this.b+"\t"+this.u+"|\n|\t"+this.c+"\t"+this.d+"\t"+this.v+"|\n|\t"+this.tx+"\t"+this.ty+"\t"+this.w+"|";
   },
   clone:function()
   {
      return new Foundation.TMatrix(this.a,this.b,this.c,this.d,this.tx,this.ty,this.u,this.v,this.w);
   },
   translate:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.tx+=arguments[0].x;
         this.ty+=arguments[0].y;
         break;
      case 2 :
         this.tx+=arguments[0];
         this.ty+=arguments[1];
         break;
      }
      return this;
   },
   scale:function()
   {
      switch (arguments.length)
      {
      case 1 :
         this.a*=arguments[0].x;
         this.d*=arguments[0].y;
         this.tx*=arguments[0].x;
         this.ty*=arguments[0].y;
         break;
      case 2 :
         this.a*=arguments[0];
         this.d*=arguments[1];
         this.tx*=arguments[0];
         this.ty*=arguments[1];
         break;
      }
      return this;
   },
   rotate:function(radians)
   {
      var sin=Math.sin(radians);
      var cos=Math.cos(radians);
      var a=this.a;
      var b=this.b;
      var c=this.c;
      var d=this.d;
      var tx=this.tx;
      var ty=this.ty;
      this.a=a*cos-b*sin;
      this.b=a*sin+b*cos;
      this.c=c*cos-d*sin;
      this.d=c*sin+d*cos;
      this.tx=tx*cos-ty*sin;
      this.ty=tx*sin+ty*cos;
      return this;
   },
   dispose:function()
   {
   }
};
Foundation.TMatrix.getIdentity=function()
   {
      return new Foundation.TMatrix(1,0,0,1,0,0,0,0,1);
   };
Foundation.TMatrix.getTypePath=Foundation.Class.getTypePath;
Foundation.TMatrix.isInstanceOf=Foundation.Class.isInstanceOf;
Foundation.TMatrix.$constructor();

