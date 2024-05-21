$(document).ready(function () {
    // Function to fetch user's profile from API
    var accessToken = localStorage.getItem("access_token");

   
    $('.logout').on('click', function(event) {
        event.preventDefault();
    
        
    
        // Make a POST request to logout endpoint
        $.post({
            url: "https://ksdfj-production-1023.up.railway.app/logout/",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            // If you need to send any data, include it in the data object
            // data: { key: value },
            success: function(data) {
                // Handle successful logout, if needed
                // Remove access token from localStorage
                localStorage.removeItem("access_token");
                console.log('Successfully logged out');
            },
            error: function(xhr, textStatus, errorThrown) {
                // Handle errors, if any
                console.log('error', errorThrown);
            }
        });
    });
    
    // Make a GET request to fetch user's profile
    $.ajax({
        url: "https://ksdfj-production-1023.up.railway.app/api/user/profile/",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        success: function (response) {
            // Handle successful response
            // Assuming the response contains user profile data
            console.log("User profile:", response);
            // You can access specific properties like bio
            console.log("Bio:", response.username);
        
            // Update HTML element with class 'username' with the user's bio
            $('.username').text(response.username);
        },
        
        error: function (xhr, status, error) {
            // Handle error response
            console.error("Error fetching user profile:", error);
            // Depending on the error, you might want to handle it gracefully
            // For example, display a message to the user
        }
    });
});
