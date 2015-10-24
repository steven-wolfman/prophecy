// Append methods and properties to an existing class.
Foundation.appendToClass(GamesByEmail.TicTacToeGame,
{
   getHeaderHtml:function(resourceName)
   {
      return "hello world<br>"+Super.getHeaderHtml(resourceName);
   }
});
