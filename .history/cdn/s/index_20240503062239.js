$(document).ready(function () {

    // Function to handle access token refresh
    function refreshTokenAndRetry(originalRequest) {
        // Retrieve refresh token from local storage
        var refreshToken = localStorage.getItem("refresh_token");

        // Make a POST request to the refresh token endpoint
        $.ajax({
            url: "https://ksdfj-production-1023.up.railway.app/api/token/refresh/",
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            success: function (response) {
                // Upon successful refresh, obtain the new access token
                var newAccessToken = response.access;

                // Store the new access token in local storage
                localStorage.setItem("access_token", newAccessToken);

                // Retry the original request with the new access token
                originalRequest.headers.Authorization = "Bearer " + newAccessToken;
                $.ajax(originalRequest);
            },
            error: function (xhr, status, error) {
                // Handle error response from token refresh endpoint
                console.error("Error refreshing token:", error);
                // Depending on the error, you might want to handle it gracefully
            }
        });
    }

    // Function to perform the original request with the access token
    function performRequestWithAccessToken() {
        var accessToken = localStorage.getItem("access_token");

        // Make a GET request to fetch user's profile
        $.ajax({
            url: "https://ksdfj-production-1023.up.railway.app/api/user/profile/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function (response) {
                // Handle successful response
                console.log("User profile:", response);
                console.log("Username:", response.username);
                $('.username').text(response.username);
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error("Error fetching user profile:", error);
                // Check if the error is due to invalid/expired token
                if (xhr.status === 401 && xhr.responseJSON && xhr.responseJSON.code === "token_not_valid") {
                    // If so, attempt to refresh the token and retry the request
                    refreshTokenAndRetry(this);
                } else {
                    // Handle other types of errors
                    // For example, display a message to the user
                }
            }
        });
    }

    // Function to perform logout
    function logoutUser() {
        var accessToken = localStorage.getItem("access_token");

        // Make a POST request to logout endpoint
        $.ajax({
            url: "https://ksdfj-production-1023.up.railway.app/logout/",
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            success: function (data) {
                // Handle successful logout
                // Remove access token and refresh token from local storage
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                console.log('Successfully logged out');
                $('.username').text('');
            },
            error: function (xhr, textStatus, errorThrown) {
                // Handle errors
                console.log('Error during logout:', errorThrown);
                // Check if the error is due to invalid/expired token
                if (xhr.status === 401 && xhr.responseJSON && xhr.responseJSON.code === "token_not_valid") {
                    // If so, attempt to refresh the token and retry the request
                    refreshTokenAndRetry(this);
                } else {
                    // Handle other types of errors
                    // For example, display a message to the user
                }
            }
        });
    }

    // Perform the original request with the access token
    performRequestWithAccessToken();

    // Event listener for logout button
    $('#logouthere').on('click', function (event) {
        event.preventDefault();
        // Call logout function
        logoutUser();
    });

});
