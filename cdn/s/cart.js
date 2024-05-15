$(document).ready(function () {
    // Function to fetch user's orders from API

   // Event listener for clicking #letscartit
   $("#letscartit").on("click", function() {
    $("#CartContainer").html("<p>Loading...</p>"); // Show loading message
    fetchOrders(); // Fetch orders
});
    function fetchOrders() {
        var accessToken = localStorage.getItem("access_token");
        console.log('function called');

        // Check if access token is available
        if (!accessToken) {
            refreshAccessToken();
            console.error("Access token not found.");
           
            // Handle the case where access token is not available
           // toastr.info("Please login to access your cart");
            
        }

        $.ajax({
            url: "https://ksdfj-kb97.onrender.com/api/user/orders/",
            type: "GET",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
            cache: false, // Prevents caching in jQuery
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Cache-Control', 'no-cache');
            },
            success: function (response) {
                handleOrdersResponse(response);
            },
            error: function (xhr, status, error) {
                handleOrdersError(xhr, status, error);
            },
        });
    }

    // Function to handle successful orders response
    function handleOrdersResponse(response) {
        // Clear previous cart content
        if (response.length > 0) {
            var orderID = response[0].id;
            // Do something with orderID
            localStorage.setItem('order_id', orderID);
        } else {
            // Handle case where response is empty
            console.error("Response is empty");
            $("#CartContainer").html(
                "<p>Your cart is empty. Go to shop</p>"
            );
        }
    
        $("#CartContainer").empty();
        $("#CartTotal").empty();
    
        // Check if orders are empty
        if (response.length === 0) {
            $("#CartContainer").html("<p>Your cart is empty.</p>");
            return;
        }
        console.log(response);
    
        // Initialize totalCost outside the loop
        var totalCost = 0;
        var counter = 1;
    
        // Iterate through orders and append to cart container
        $.each(response, function (index, order) {
            var orderItemsHtml = '';
            // Initialize orderTotalCost for each order
            var orderTotalCost = 0;
    
            $.each(order.order_items, function (idx, item) {
                console.log(item);
                // Convert item.cost to an integer before adding
                var cost = parseInt(item.cost);
                // Add cost to orderTotalCost
                orderTotalCost += cost;
    
                orderItemsHtml += '<div class="cart-item">' +
                    "<h5>" +
                    counter++ + ". " +
                    item.product_name +
                    "</h5>" +
                    "<p>cost_per_kg: " +
                    item.price +
    
                    "<p>quantity: " +
                    item.quantity +
                    "<p>cost: " +
                    cost + // Use the converted cost here
                    "</p>" +
                    '<button class="delete-order-btn" data-order-id="' +
                    order.id +
                    '">Delete</button>' +
                    "</div>";
            });
    
            orderItemsHtml += "<p>Total Cost: KES " + orderTotalCost + "</p>";
            // Add orderTotalCost to the totalCost
            totalCost += orderTotalCost;
            $("#CartContainer").append(orderItemsHtml);
        });
    
        // Display totalCost outside the loop
        $("#CartTotal").html("<p>Total Cost: KES " + totalCost + "</p>");
    
        // Event listener for delete order button
        $(".delete-order-btn").on("click", function () {
            var orderId = $(this).data("order-id");
            deleteOrder(orderId);
        });
    
        // Add "Go to Checkout" button
        // Add "Go to Checkout" button with inline CSS
        $("#CartContainer").append('<a href="checkout.html" style="border: 2px solid #3f51b5; background-color: #3f51b5; color: white; padding: 10px 20px; display: inline-block; text-decoration: none; border-radius: 5px; margin-top: 10px;" class="btn btn-primary">Go to Checkout</a>');
    }
    

    // Function to handle error response for fetching orders
    function handleOrdersError(xhr, status, error) {
        if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
            // Token not valid, attempt to refresh token
            refreshAccessToken(fetchOrders);
        } else {
            console.error("Failed to fetch orders:", error);
            // Display error message
            $("#CartContainer").html(
                "<p>Failed to fetch orders. Please try again later.</p>"
            );
        }
    }

    // Function to refresh access token
    function refreshAccessToken(callback) {
        var refreshToken = localStorage.getItem("refresh_token");

        // Check if refresh token is available
        if (!refreshToken) {
            console.error("Refresh token not found.");
            // Handle the case where refresh token is not available
            // toastr.info("Please login to refresh your token");
            $("#CartContainer").html("<p>Please login first.</p>");

            return;
        }

        $.ajax({
            url: "https://ksdfj-kb97.onrender.com/api/token/refresh/",
            type: "POST",
            data: {
                refresh: refreshToken,
            },
            success: function (response) {
                // Refresh token successful, update access token
                localStorage.setItem("access_token", response.access);
                // Retry failed request
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (xhr, status, error) {
                console.error("Failed to refresh token:", error);
                // Handle error refreshing token
            $("#CartContainer").html("<p>Please login first.</p>");

                // toastr.error("Failed to refresh token. Please login again.");
            },
        });
    }

    // Function to delete an order
    function deleteOrder(orderId) {
        var accessToken = localStorage.getItem("access_token");

        // Check if access token is available
        if (!accessToken) {
            console.error("Access token not found.");
            // Handle the case where access token is not available
            // toastr.info("Please login to access your cart");
            return;
        }

        $.ajax({
            url: "https://ksdfj-kb97.onrender.com/api/user/orders/" + orderId + "/",
            type: "DELETE",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
cache: false, // Prevents caching in jQuery
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Cache-Control', 'no-cache');
            },
            success: function () {
                // Order deleted successfully, fetch updated orders
                fetchOrders();
                // toastr.success("Manage your cart.");
            },
            error: function (xhr, status, error) {
                console.error("Failed to delete order:", error);
                if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
                    // Token not valid, attempt to refresh token
                    refreshAccessToken(function () {
                        deleteOrder(orderId);
                    });
                } else {
                    console.error("Failed to delete order:", error);
                }
            },
        });
    }

    
});
