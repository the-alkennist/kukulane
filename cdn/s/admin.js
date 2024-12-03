$(document).ready(function() {
    // Function to fetch all orders from the backend API
    function fetchAllOrders() {
        var accessToken = localStorage.getItem("access_token");

        // Check if access token is available
        if (!accessToken) {
            console.error("Access token not found.");
            toastr.info("Please login as admin");
            // Handle the case where access token is not available, e.g., redirect to login page
            return;
        }

        $.ajax({
            url: 'https://ksdfj-1.onrender.com/api/user/orders/all_orders/',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            cache: false, // Prevents caching in jQuery
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Cache-Control', 'no-cache');
            },
            success: function(response) {
                console.log(response);
                handleOrdersResponse(response);
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
                    refreshAccessToken(fetchAllOrders);
                
                } else {
                    console.error('Error fetching orders:', error);
                    // Handle other error cases, e.g., display error message using Toastr
                    toastr.error('Error fetching orders. Please try again later.');
                }
            }
        });
    }

    // Function to handle the orders response and fill them in a table
    // Function to handle the orders response and fill them in a table
    function handleOrdersResponse(response) {
        var ordersTable = '<table>';
        ordersTable += '<tr><th>User</th><th>Shipping Address</th><th>Contact</th><th>Product Name</th><th>Quantity</th><th>Order ID</th><th>Order Amount</th><th>Status</th></tr>';

        // Loop through each order in the response and create table rows
        $.each(response, function(index, order) {
            var user = order.buyer;
            var shippingAddress = order.shipping_address || 'N/A';
            var billingAddress = order.billing_address || 'N/A';

            var orderId = order.id;
            var orderAmount = order.total_cost;
            var status = order.status;

            // Loop through each order item within the order
            $.each(order.order_items, function(idx, item) {
                var productName = item.product_name;
                var quantity = item.quantity;

                ordersTable += '<tr>';
                ordersTable += '<td>' + user + '</td>';
                ordersTable += '<td>' + shippingAddress + '</td>';
                ordersTable += '<td>' + billingAddress + '</td>';

                ordersTable += '<td>' + productName + '</td>';
                ordersTable += '<td>' + quantity + '</td>';
                ordersTable += '<td>' + orderId + '</td>';
                ordersTable += '<td>' + orderAmount + '</td>';
                ordersTable += '<td>' +
                    '<select class="status-dropdown" data-order-id="' + orderId + '">' +
                    '<option value="P"' + (status === 'P' ? ' selected' : '') + '>Pending</option>' +
                    '<option value="PR"' + (status === 'PR' ? ' selected' : '') + '>Processing</option>' +
                    '<option value="S"' + (status === 'S' ? ' selected' : '') + '>Shipped</option>' +
                    '<option value="D"' + (status === 'D' ? ' selected' : '') + '>Delivered</option>' +
                    '<option value="C"' + (status === 'C' ? ' selected' : '') + '>Completed</option>' +
                    '</select>' +
                    '</td>';
                ordersTable += '</tr>';
            });
        });

        ordersTable += '</table>';

        // Append the orders table to the control div
        $('#control').html(ordersTable);

        // Add event listener for status dropdown change
        $('.status-dropdown').change(function() {
            var orderId = $(this).data('order-id');
            var newStatus = $(this).val();
            updateOrderStatus(orderId, newStatus);
        });
    }

    // Function to update order status
    function updateOrderStatus(orderId, newStatus) {
        const accessToken = localStorage.getItem('access_token');

        $.ajax({
            url: 'https://ksdfj-1.onrender.com/api/user/orders/all_orders/' + orderId + '/', // Replace with your actual backend API URL for updating order
            type: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ status: newStatus }),
            success: function(response) {
                toastr.success('Order status updated successfully.');
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
                    refreshAccessToken(function () {
                        updateOrderStatus(orderId, newStatus);
                    });
                
                } else {
                console.error('Error updating order status:', error);
                toastr.error('Error updating order status.');
            }
        }
        });
    }

    // Function to refresh access token
    // Function to refresh access token
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

    // Call the fetchAllOrders function when the page is ready to load the orders
    fetchAllOrders();
});
