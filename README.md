# prophecy
Tinkering with GamesByEmail with the idea of producing a Prophecy clone for e-mail play.

Critical notes (2015/10/27):
  OK; I get the basic idea of how this framework works. Now, I need some pieces to make
  my design sustainable and sensible:

  1) A testing framework usable at least on the non-interface pieces. (The framework
     seems to have some testing capability I haven't quite sussed yet on the interface
     pieces.) Jasmine seems lightweight enough and suitable? For the moment, place
     tests at end of each file, grouped by containing type (including none)?
     
     USING JASMINE. At present, at least, this produces somewhat
     readable output on the same page as the (testing) game.
     
  2) A consistent documentation style. Ideally one that autoproduces docs, which this
     framework seems to support, but I don't have the convention. So, I'll use:
     
     /*
      * General comments precede each class/function/field.
      *
      * INVARIANTS/PRECONDS/POSTCONDS: ...
      */
     fnName:/* ReturnType */ function(/* ParamType */ p1, /* (Optional) ParamType */ p2, ...)
     {
       ...
     }

  3) A better grasp of how to use the resourcePack functionality this framework
     provides.

  4) Some careful ideas on how to disentangle functionality from the framework (to
     later adapt to totally different frameworks if desired).




Here's a link to the Prophecy BGG page: https://boardgamegeek.com/boardgame/8095/prophecy

Here's a link to the Dev section of GamesByEmail: http://gamesbyemail.com/Developers

I'll try to keep the live current version of the game at http://steven-wolfman.github.io/prophecy.
