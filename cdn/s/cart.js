$(document).ready(function () {
    // Event listener for clicking #letscartit
    
    $("#letscartit").on("click", function() {
        $("#CartContainer").html("<p>Loading...</p>"); // Show loading message
        fetchOrders(); // Fetch orders
    });
    $("#invisiblemiracle").on("click", function() {
        
        fetchOrders(); // Fetch orders
    });

     // Function to update the cart count
     function updateCartCount(count) {
        $("#CartCount .count").text(count);
        $("#CartCount").data("cart_item_count", count);
    }

    // Function to fetch user's orders from API
    function fetchOrders() {
        var accessToken = localStorage.getItem("access_token");

        // Check if access token is available
        if (!accessToken) {
            console.error("Access token not found.");
            refreshAccessToken(fetchOrders);
            
        }

        $.ajax({
            url: "https://ksdfj-kb97.onrender.com/api/user/orders/orders/",
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
        $("#CartContainer").empty();
        $("#CartTotal").empty();
    
        if (response.length === 0) {
            $("#CartContainer").html("<p>Your cart is empty. Go to shop</p>");
            updateCartCount(0);
            return;
        }
    
        var totalCost = 0;
        var counter = 1;
        var hasPendingOrders = false;
        var pendingOrderCount = 0;
    
        $.each(response, function (index, order) {
            if (order.status === 'P') {
                hasPendingOrders = true;

                pendingOrderCount++;

                var orderItemsHtml = '';
                var orderTotalCost = 0;
    
                $.each(order.order_items, function (idx, item) {
                    var cost = parseInt(item.cost, 10);
                    orderTotalCost += cost;
                    
    
                    orderItemsHtml += '<div class="cart-item">' +
                        "<h5>" + counter++ + ". " + item.product_name + "</h5>" +
                        "<p>Cost per kg: " + item.price + "</p>" +
                        "<p>Quantity: " + item.quantity + "</p>" +
                        "<p>Cost: " + cost + "</p>" +
                        '<button class="delete-order-btn" data-order-id="' + order.id + '">Delete</button>' +
                        "</div>";
                });
    
                orderItemsHtml += "<p>Total Cost: KES " + orderTotalCost + "</p>";
                totalCost += orderTotalCost;
                $("#CartContainer").append(orderItemsHtml);
            }
        });
        
        updateCartCount(pendingOrderCount);
        if (!hasPendingOrders) {
            $("#CartContainer").html("<p>No pending orders found.</p>");
        } else {
            $("#CartTotal").html("<p>Total Cost: KES " + totalCost + "</p>");
    
            // Event listener for delete order button
            $(".delete-order-btn").on("click", function () {
                var orderId = $(this).data("order-id");
                deleteOrder(orderId);
            });
    
            // Add "Go to Checkout" button
            $("#CartContainer").append('<a href="checkout.html" style="border: 2px solid #3f51b5; background-color: #3f51b5; color: white; padding: 10px 20px; display: inline-block; text-decoration: none; border-radius: 5px; margin-top: 10px;" class="btn btn-primary">Go to Checkout</a>');
        }
    }

    // Function to handle error response for fetching orders
    function handleOrdersError(xhr, status, error) {
        if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
            refreshAccessToken(fetchOrders);
        } else {
            console.error("Failed to fetch orders:", error);
            $("#CartContainer").html("<p>Failed to fetch orders. Please try again later.</p>");
        }
    }

    // Function to refresh access token
    function refreshAccessToken(callback) {
        var refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            console.error("Refresh token not found.");
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

    // Function to delete an order
    function deleteOrder(orderId) {
        var accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            console.error("Access token not found.");
            return;
        }

        $.ajax({
            url: "https://ksdfj-kb97.onrender.com/api/user/orders/orders/" + orderId + "/",
            type: "DELETE",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
            cache: false, // Prevents caching in jQuery
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Cache-Control', 'no-cache');
            },
            success: function () {
                fetchOrders();
            },
            error: function (xhr, status, error) {
                if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
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
