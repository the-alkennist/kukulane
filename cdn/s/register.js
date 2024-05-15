document.getElementById("create_customer").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    document.getElementById("spinner").style.display = "block";
          document.getElementById("registerbtn").style.display = "none";

    var form = this;
    var formData = {
      first_name: form.elements["first_name"].value,
      last_name: form.elements["last_name"].value,
      phone_no: form.elements["phone_no"].value,
      email: form.elements["email"].value,
      password1: form.elements["password1"].value,
      password2: form.elements["password2"].value
    };

    // Log JSON data before sending
    console.log("JSON data before sending:", formData);

    // Send AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ksdfj-kb97.onrender.com/api/user/register/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Success callback
          console.log("Registration successful");
          // You can add further actions here, such as redirecting the user or showing a success message
          document.getElementById("spinner").style.display = "none";
          document.getElementById("registerbtn").style.display = "block";

          window.location.href = "../index.html";
    // toastr.success('Logged in successfully');

  

        } else if (xhr.status === 201) {
          // Success callback
          console.log("Registration successful");
          // You can add further actions here, such as redirecting the user or showing a success message
          document.getElementById("spinner").style.display = "none";
          document.getElementById("registerbtn").style.display = "block";

          window.location.href = "../index.html";
    // toastr.success('Logged in successfully');

  
         }
         else {
          // Error callback
          console.error("Registration failed");
         
          toastr.info('Registration failed');
          document.getElementById("spinner").style.display = "none";
          document.getElementById("registerbtn").style.display = "block";


  
          // Handle error scenario, such as showing an error message to the user
        }
      }
    };
    xhr.send(JSON.stringify(formData)); // Send JSON data
  });
