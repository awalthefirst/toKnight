$(document).ready(function () {

  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function () {
    FB.init({
      appId: '113039905694601',
      cookie: true,
      xfbml: true,
      version: 'v2.5'
    });
  };

  $(".login").click(function () {
      if ($(".stats").text() === "login") {
        checkLogin(); // log user in
      }
      else {
         // log user out
         FB.logout();
         window.location.assign("/api/user/logout")
      }

    })
    
    // change login/logout button
  function buttonView(data) {
    if (data == "logIn") {
      $(".stats").text('logout')
    }
    else {
      $(".stats").text("login")
    }
  }

  // check if user is login 
  function checkLogin() {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        // we have user ! change button
        userInfo();
        buttonView('logIn')
      }
      else {
        // request user login
        logMe()
      }
    });
  }
  // request user login
  function logMe() {
    FB.login(function (response) {
      if (response.authResponse) {
        userInfo();
        buttonView('logIn')
      }
      else {
        //'User cancelled login 
        buttonView('logOut')
      }
    })
  };

  //invalidate access token ! logout
  function logOut() {
    FB.logout();
    buttonView('logOut')
  };

  // get users basic info
  function userInfo() {
    FB.api('/me', {
      fields: 'id,name,email'
    }, function (response) {

      $.ajax('/api/user/login?data=' + JSON.stringify(response))

      .done(function (data) {
         // console.log(data)
      })

      .fail(function () {
        window.location.reload();
      })
      
    });
  }



  $(".glyphicon-search").on('click', getSearch);
  $("form").on('submit', getSearch);

  //get yelp locations 
  function getSearch(e) {
    $("input").addClass("field");
    e.preventDefault();
    setTimeout(function () {
      var input = $('.searchfield').val();
      $.ajax('/api/place?location=' + input).done(getSearchDone).fail(getSearchFail);

    }, 1000);

    function getSearchDone(data) {
      $(".results").html(data)
      $("input").removeClass("field");
    }

    function getSearchFail() {
      $(".results").html('Something Went Bad');
      $("input").removeClass("field");
    }

  }

 $("body").on('click','.going',function() {
      var me = this;
      if($(".stats").text() === "logout"){
        addGoing(this.id,me);
      }else{
        checkLogin();
      }
  })


  function addGoing(id,me){
    
   $.get("/api/going/update",{
     id:id
   }).done(function(data){
      var iner = $(me).parent().children().first();
      
      if(data === "I'm Out"){
       iner.html(+iner.html()+ 1);
     }else{
       iner.html(+iner.html()- 1);
     }
      
     $(me).html(data);
   });
  }
  

  
})

