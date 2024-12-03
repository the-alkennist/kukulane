$(document).ready(function () {
    // Function to fetch user's orders from API
    function fetchOrders() {
        var accessToken = localStorage.getItem("access_token");

        // Check if access token is available
        if (!accessToken) {
            console.error("Access token not found.");
            // Handle the case where access token is not available
            // toastr.info("Please login to access your cart");
            return;
        }

        $.ajax({
            url: "https://ksdfj-1.onrender.com//api/user/orders/orders/orders/",
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
        $("#CartContainer").empty();
        $("#CartTotal").empty();

        // Check if orders are empty
        if (response.length === 0) {
            $("#CartContainer").html("<p>Your cart is empty.</p>");
            return;
        }

        var totalCost = 0;
        var counter = 1;

        // Iterate through orders and append to cart container
        $.each(response, function (index, order) {
            var orderItemsHtml = '';

            $.each(order.order_items, function (idx, item) {
                orderItemsHtml += '<div class="cart-item">' +
                    "<h5>" +
                    counter++ + ". " +
                    item.product_name +
                    "</h5>" +
                    "<p>cost_per_kg: " +
                    item.price +
                    "</p>" +
                    '<button class="delete-order-btn" data-order-id="' +
                    order.id +
                    '">Delete</button>' +
                    "</div>";
                totalCost += item.price;
            });

            orderItemsHtml += "<p>Total Cost: KES " + totalCost.toFixed(2) + "</p>";
            $("#CartContainer").append(orderItemsHtml);
        });

        // Event listener for delete order button
        $(".delete-order-btn").on("click", function () {
            var orderId = $(this).data("order-id");
            deleteOrder(orderId);
        });
    }

    // Function to handle error response for fetching orders
    function handleOrdersError(xhr, status, error) {
        if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
            // Token not valid, attempt to refresh token
            refreshAccessToken();
        } else {
            console.error("Failed to fetch orders:", error);
            // Display error message
            $("#CartContainer").html(
                "<p>Failed to fetch orders. Please try again later.</p>"
            );
        }
    }

    // Function to refresh access token
    function refreshAccessToken() {
        var refreshToken = localStorage.getItem("refresh_token");

        // Check if refresh token is available
        if (!refreshToken) {
            console.error("Refresh token not found.");
            // Handle the case where refresh token is not available
            // toastr.info("Please login to refresh your token");
            return;
        }

        $.ajax({
            url: "https://ksdfj-1.onrender.com//api/token/refresh/",
            type: "POST",
            data: {
                refresh: refreshToken,
            },
            success: function (response) {
                // Refresh token successful, update access token
                localStorage.setItem("access_token", response.access);
                // Retry failed request
                fetchOrders();
            },
            error: function (xhr, status, error) {
                console.error("Failed to refresh token:", error);
                // Handle error refreshing token
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
            url: "https://ksdfj-1.onrender.com//api/user/orders/orders/orders/" + orderId + "/",
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
                // Display error message
                // toastr.error("Failed to delete order. Please try again later.");
            },
        });
    }

    // Fetch user's orders when the page loads
    fetchOrders();
});
