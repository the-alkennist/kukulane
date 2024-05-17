$(document).ready(function() {
    function pesapalhook() {
        var accessToken = localStorage.getItem("access_token");
    
        $.ajax({
            url: `https://ksdfj-kb97.onrender.com/api/user/payments/create-checkout-session/`,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + accessToken, // Authorization header with bearer token
            },
            dataType: 'json',
            success: function(response) {
                // Set iframe source
                $('#payment-iframe').attr('src', response.url);
                
                // Show spinner until iframe loads
                $('#spinner').show();
            },
            error: function(xhr, textStatus, errorThrown) {
                toastr.error('Please try again. Error pesa');
            }
        });
    
        // Wait for the iframe to load
        $('#payment-iframe').on('load', function() {
            // Hide the spinner once the iframe has loaded
            $('#spinner').hide();
    
            // Show the Pay Now button again
            $('#pay-now').show();
        });
    }
    

  function updateshippingandbilling (callback, clicker) {
    // Compile checkoutData object
    var checkoutData = {
              "payment": {
                  "payment_option": $('#payment-method').val()
              },
              "shipping_address": {
                  "default": true,
                  "country": $('#country').val(),
                  "city": $('#city').val(),
                  "street_address": $('#shipping_address').val(),
                  "apartment_address": $('#apartment-address').val(),
                  "postal_code": $('#postal-code').val()
              },
              "billing_address": {
                  "default": true,
                  "country": $('#country').val(),
                  "city": $('#city').val(),
                  "street_address": $('#billing_address').val(),
                  "apartment_address": $('#apartment-address').val(),
                  "postal_code": $('#postal-code').val()
              }
          };

          console.log(checkoutData);

          // Fetch user details and order details before submitting the form
          var order_pk = localStorage.getItem('order_id');
          console.log(order_pk);
          var accessToken = localStorage.getItem("access_token");

          // Make a request to the local API endpoint with pk
          $.ajax({
              url: 'https://ksdfj-kb97.onrender.com/api/user/payments/checkout/' + order_pk + '/',
              type: 'PATCH',
              headers: {
                  Authorization: "Bearer " + accessToken,
              },
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(checkoutData),
              success: function(data) {
                  // Handle successful response
                  console.log(data);
                  toastr.success('Shipping updated');
                  if (typeof callback === 'function') {
                    callback();
                }
                  
                  
                 
              },
              error: function(xhr, textStatus, errorThrown) {
                  // Handle errors here
                  if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
                      // Token not valid, attempt to refresh token
                      checkoutrefresher(clicker);
                  } else {
                      console.error('There was a problem with the AJAX request:', textStatus, errorThrown);
                      clicker.show();
                      $('#spinner').hide();
                      // Display error message using toastr
                      toastr.error('Payment failed. Please try again later.');
                  }
              },
             

             
          });
      
  }
  
  function checkoutrefresher(clicker) {
      var refreshToken = localStorage.getItem("refresh_token");

      // Make a request to refresh the access token
      $.ajax({
          url: 'https://ksdfj-kb97.onrender.com/api/token/refresh/',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
              refresh: refreshToken
          }),
          success: function(response) {
              // Update access token in local storage
              localStorage.setItem("access_token", response.access);
              // Retry the payment request with the new access token
              clicker.click();
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error('Failed to refresh access token:', textStatus, errorThrown);
              // Handle error here (e.g., redirect to login page)
              toastr.error('Please login again.');
              // Redirect user to login page or handle as appropriate
              clicker.show();
                $('#spinner').hide();
          }
      });
  }

  
      $('#pay-now').click(function() {
          // Hide the Pay Now button and display animation
          $('#pay-now').hide();
          $('#spinner').show(); // Show the spinner

          
        
            var paynow = $('#pay-now');
          // Fetch user details and order details before submitting the form
          var order_pk = localStorage.getItem('order_id');
          console.log(order_pk);
          var accessToken = localStorage.getItem("access_token");
          console.log(accessToken);
          updateshippingandbilling(pesapalhook, paynow);
          
});
$('#pay-later').click(function() {
    // Hide the Pay Now button and display animation
    $('#pay-later').hide();
    $('#spinner').show(); // Show the spinner

    
    var paylater = $('#pay-later');
  

    // Fetch user details and order details before submitting the form
    var order_pk = localStorage.getItem('order_id');
    console.log(order_pk);
    var accessToken = localStorage.getItem("access_token");
    console.log(accessToken);
    updateshippingandbilling(paylaterhook, paylater);

  })

  function paylaterhook() {
    var accessToken = localStorage.getItem("access_token");
    $.ajax({
        url: `https://ksdfj-kb97.onrender.com/api/user/payments/pay_later/`,
        type: 'POST',
        headers: {
            Authorization: "Bearer " + accessToken, // Authorization header with bearer token
        },      
        
        success: function(response) {
            toastr.success('Order updated to pay later.');
            $('#pay-later').show();
                $('#spinner').hide();
            // Update the UI as needed, e.g., display the updated status
        },
        error: function(xhr, textStatus, errorThrown)  {
            console.error('There was a problem with the AJAX request:', textStatus, errorThrown);
            $('#pay-later').show();
                $('#spinner').hide();
            toastr.error('An error occurred. Try again');
        }
    });
  }


      });
     