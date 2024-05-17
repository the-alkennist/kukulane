document.addEventListener("DOMContentLoaded", function() {
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

      $.ajax({
          type: "POST",
          url: "https://ksdfj-kb97.onrender.com/api/user/register/",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify(formData),
          beforeSend: function() {
              $("#spinner").show();
              $("#registerbtn").hide();
          },
          success: function(response) {
              console.log("Registration successful");
              console.log("Response:", response); // Log the response for debugging
              $("#spinner").hide();
              $("#registerbtn").show();
              window.location.href = "../index.html";
              // toastr.success('Registration successful');
          },
          error: function(xhr, status, error) {
              console.error("Registration failed");
              console.log("Error response:", xhr.responseText); // Log the error response for debugging
              toastr.error('Registration failed: ' + xhr.responseText);
              $("#spinner").hide();
              $("#registerbtn").show();
          }
      });
  });
});
