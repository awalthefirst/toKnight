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
        logOut(); // log user out
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
      console.log(response);

      $.ajax('/api/user?data=' + JSON.stringify(response))

      .done(function () {

      })

      .fail(function () {

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
      $.ajax('/api/place?location=' + input).done(done).fail(fail);

    }, 2000);

    function done(data) {
      $(".results").html(data)
      $("input").removeClass("field");
    }

    function fail(err) {
      console.log(err);
      $(".results").html('Something Went Bad');
      $("input").removeClass("field");
    }

  }

})
