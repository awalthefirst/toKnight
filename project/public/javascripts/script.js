$(document).ready(function(){
    

  $(".glyphicon-search").on('click',getSearch);
  $("form").on('submit',getSearch);
  
  
    
  function getSearch(){
    $("input").addClass("field");
    
    setTimeout(function() {
      var input = $('.searchfield').val();
    $.ajax('/api/place?location='+input).done(done).fail(fail);
      
    }, 2000);
    
    function done(data){
      $(".results").html(data)
      $("input").removeClass("field");
    }

     function fail(err){
       console.log(err);
     $(".results").html('Something Went Bad');
     $("input").removeClass("field");
    }
    
  }
  
})
