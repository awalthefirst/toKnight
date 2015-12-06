$(document).ready(function(){
    

  $(".glyphicon-search").on('click',getSearch);
  $("form").on('submit',getSearch);
  
  
    
  function getSearch(){
    var input = $('.searchfield').val();
    $.ajax('/api/place?location='+input).done(done).fail(fail);
    

    function done(data){
      console.log("in")
      $(".results").html(data)
    }
    
     function fail(err){
      console.log(err);
    }
  }
  
})
