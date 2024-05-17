document.addEventListener("DOMContentLoaded", function() {

    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }
    document.getElementById("customer_login").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the form from submitting normally
      document.getElementById("spinner").style.display = "block";
      document.getElementById("signinbtn").style.display = "none";
      
      var form = this;
      var formData = {
          
          username: form.elements["username"].value,
          password: form.elements["password"].value,
      };
  
      // Log JSON data before sending
      console.log("JSON data before sending:", formData);
  
      // Send AJAX request to obtain the token
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://ksdfj-kb97.onrender.com/api/token/", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  // Token obtained successfully
                  console.log("Token obtained successfully");
                  
                  // Parse the JSON response
                  var response = JSON.parse(xhr.responseText);
  
                  // Extract the access token
                  var accessToken = response.access;
                  var refreshToken = response.refresh;
  
                  // Store the access token in local storage
                  localStorage.setItem('access_token', accessToken);
                  localStorage.setItem('refresh_token', refreshToken);
                  document.getElementById("spinner").style.display = "none";
                  document.getElementById("signinbtn").style.display = "block";
  
                  // Now that we have the token, you can redirect the user to another page
                  window.location.href = "../index.html";
  
                  toastr.success('Logged in successfully');
              } else {
                  // Error obtaining token
                  console.error("Error obtaining token");
                  document.getElementById("spinner").style.display = "none";
                  document.getElementById("signinbtn").style.display = "block";
  
                  toastr.error('Please try again'+ xhr.responseText);
              }
          }
      };
      xhr.send(JSON.stringify(formData)); // Send JSON data to obtain the token
  });
  });
