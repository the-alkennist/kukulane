$(document).ready(function() {
  // Function to fetch user's orders from API
  function fetchOrders() {
      var accessToken = localStorage.getItem("access_token");

      // Check if access token is available
      if (!accessToken) {
          console.error("Access token not found.");
          toastr.info("Please make sure you are logged in.");
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
          success: function(response) {
              handleOrdersResponse(response);
          },
          error: function(xhr, status, error) {
            if (xhr.status === 401 && xhr.responseJSON.code === "token_not_valid") {
              refreshAccessToken(fetchOrders);
          } else {
              console.error("Failed to fetch orders:", error);
              $("#CartContainer").html("<p>Failed to fetch orders. Please try again later.</p>");
          }    
          },
      });
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

  // Function to handle successful orders response
  function handleOrdersResponse(response) {
      var ordersContainer = $("#orders");

      // Clear previous orders content
      ordersContainer.empty();

      // Check if orders are empty
      if (response.length === 0) {
          ordersContainer.html("<p>No orders found.</p>");
          return;
      }

      // Iterate through orders and append to orders container
      $.each(response, function(index, order) {
        var statusLong;
        switch (order.status) {
            case "P":
                statusLong = 'Pending';
                break;
            case "PR":
                statusLong = 'Processing';
                break;
            case "S":
                statusLong = 'Shipped';
                break;
            case "D":
                statusLong = 'Delivered';
                break;
            case "C":
                statusLong = 'Completed';
                break;
            default:
                statusLong = 'Unknown';
        }
          var orderHtml = '<div class="order" data-order-id="' + order.id + '">' +
              "<p>Order ID: " + order.id + "</p>" +
              "<p>Status: " + statusLong + "</p>" +
              "<p>Total Cost: " + order.total_cost + "</p>" +
              "<p> --------------------------</p>"+
              "</div>";

          // Append order HTML to orders container
          ordersContainer.append(orderHtml);
      });

      // Event listener for clicking on an order
      $(".order").on("click", function() {
          var orderId = $(this).data("order-id");
          // Redirect to order details page or handle order status display
          toastr.info("Clicked on order with ID: " + orderId);
      });
  }

  // Fetch orders when the page loads
  fetchOrders();
});
