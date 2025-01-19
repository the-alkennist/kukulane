$(document).ready(function() {

    document.getElementById('billing_address').addEventListener('input', function(event) {
        const input = event.target;
        const value = input.value;
    
        // Ensure +254 is present and cannot be deleted
        if (!value.startsWith('+254')) {
          input.value = '+254';
        }
    
        // Ensure only digits follow +254
        const digitsOnly = value.slice(4).replace(/\D/g, '');
        input.value = '+254' + digitsOnly.slice(0, 9);
      });



      function contactadmin() {
        const templateParams = {
            to_name: "kukulane",
            reply_to: "check message",
            message: `${$('#shipping_address').val()}, ${$('#billing_address').val()}`,
            from_name: "check message",
            phone_no: $('#billing_address').val(),
            to_email: "lanekuku@gmail.com",
        };
    
        emailjs.send("service_v3hztj7", "template_2cwcs6b", templateParams)
            .then(() => {
                console.log('SUCCESS!');
                toastr.success('Hold on tight. One more step!', 'Success');
            }, (error) => {
                console.error('FAILED...', error);
                toastr.error('Failed to send email. Please try again.', 'Error');
            });
    }
    

    function pesapalhook() {
        var accessToken = localStorage.getItem("access_token");
    
        $.ajax({
            url: `https://ksdfj-1.onrender.com/api/user/payments/create-checkout-session/`,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + accessToken,
            },
            dataType: 'json',
            success: function(response) {
                $('#payment-iframe').attr('src', response.url);
                $('#spinner').show();
            },
            error: function(xhr, textStatus, errorThrown) {
                toastr.error('Please try again. Error pesa');
            }
        });
    
        $('#payment-iframe').on('load', function() {
            $('#spinner').hide();
            $('#pay-now').show();
        });
    }

    function updateshippingandbilling(callback, clicker) {
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

        var order_pk = localStorage.getItem('order_pk');
        console.log(order_pk);
        var accessToken = localStorage.getItem("access_token");

        $.ajax({
            url: 'https://ksdfj-1.onrender.com/api/user/payments/checkout/' + order_pk + '/',
            type: 'PATCH',
            headers: {
                Authorization: "Bearer " + accessToken,
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(checkoutData),
            success: function(data) {
                console.log(data);
                toastr.success('Shipping updated');
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
                    checkoutrefresher(clicker);
                } else {
                    console.error('There was a problem with the AJAX request:', textStatus, errorThrown);
                    clicker.show();
                    $('#spinner').hide();
                    toastr.error('Payment failed. Please try again later.');
                }
            },
        });
    }

    function checkoutrefresher(clicker) {
        var refreshToken = localStorage.getItem("refresh_token");

        $.ajax({
            url: 'https://ksdfj-1.onrender.com/api/token/refresh/',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                refresh: refreshToken
            }),
            success: function(response) {
                localStorage.setItem("access_token", response.access);
                clicker.click();
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Failed to refresh access token:', textStatus, errorThrown);
                toastr.error('Please login again.');
                clicker.show();
                $('#spinner').hide();
            }
        });
    }

    $('#pay-now').click(function(event) {
        const phoneInput = document.getElementById('billing_address').value;
        if (phoneInput.length !== 13) {
            toastr.error('Please enter a valid phone number with exactly 9 digits following +254.');
            event.preventDefault();
        }

        else {
            $('#pay-now').hide();
            $('#spinner').show();
            var paynow = $('#pay-now');
            contactadmin();

            fetchOrders(function() {
                updateshippingandbilling(pesapalhook, paynow);
            });
        }
    });

    $('#pay-later').click(function(event) {
        const phoneInput = document.getElementById('billing_address').value;
        if (phoneInput.length !== 13) {
            toastr.error('Please enter a valid phone number with exactly 9 digits following +254.');
            event.preventDefault();
        }
        else{
            $('#pay-later').hide();
            $('#spinner').show();
            var paylater = $('#pay-later');
            contactadmin();

            fetchOrders(function() {
                updateshippingandbilling(paylaterhook, paylater);
            });
        }
    });

    function paylaterhook() {
        var accessToken = localStorage.getItem("access_token");
        $.ajax({
            url: `https://ksdfj-1.onrender.com/api/user/payments/pay_later/`,
            type: 'POST',
            headers: {
                Authorization: "Bearer " + accessToken,
            },      
            success: function(response) {
                toastr.success('Order updated to pay later.');
                $('#pay-later').show();
                $('#spinner').hide();
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('There was a problem with the AJAX request:', textStatus, errorThrown);
                $('#pay-later').show();
                $('#spinner').hide();
                toastr.error('An error occurred. Try again');
            }
        });
    }

    function fetchOrders(callback) {
        var accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            console.error("Access token not found.");
            refreshAccessToken(function() { fetchOrders(callback); });
            return;
        }

        $.ajax({
            url: "https://ksdfj-1.onrender.com/api/user/orders/orders/",
            type: "GET",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
            cache: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Cache-Control', 'no-cache');
            },
            success: function (response) {
                handleOrdersResponse(response);
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (xhr, status, error) {
                handleOrdersError(xhr, status, error, callback);
            },
        });
    }

    function handleOrdersResponse(response) {
        $.each(response, function (index, order) {
            if (order.status === 'P') {
                localStorage.setItem('order_pk', order.id);
            }
        });
    }

    function handleOrdersError(xhr, status, error, callback) {
        if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
            refreshAccessToken(function() { fetchOrders(callback); });
        } else {
            console.error("Failed to fetch orders:", error);
            $("#CartContainer").html("<p>Failed to fetch orders. Please try again later.</p>");
        }
    }
    function refreshAccessToken(callback) {
        var refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            console.error("Refresh token not found.");
            $("#CartContainer").html("<p>Please login first.</p>");
            return;
        }

        $.ajax({
            url: "https://ksdfj-1.onrender.com/api/token/refresh/",
            type: "POST",
            data: {
                refresh: refreshToken,
            },
            success: function (response) {
                localStorage.setItem("access_token", response.access);
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (xhr, status, error) {
                console.error("Failed to refresh token:", error);
                $("#CartContainer").html("<p>Please login first.</p>");
            },
        });
    }

});
