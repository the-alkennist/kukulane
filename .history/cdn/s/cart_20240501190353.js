$(document).ready(function () {
  // Function to fetch user's orders from API
  function fetchOrders() {
    $.ajax({
      url: "/api/user/orders/orders/", // Update with your API endpoint
      type: "GET",
      success: function (response) {
        // Clear previous cart content
        $("#CartContainer").empty();

        // Check if orders are empty
        if (response.length === 0) {
          $("#CartContainer").html("<p>Your cart is empty.</p>");
          return;
        }

        // Iterate through orders and append to cart container
        $.each(response, function (index, order) {
          // Create HTML for order item
          var orderItemHtml =
            '<div class="cart-item">' +
            "<h5>" +
            order.product.name +
            "</h5>" +
            "<p>Quantity: " +
            order.quantity +
            "</p>" +
            "</div>";

          // Append order item HTML to cart container
          $("#CartContainer").append(orderItemHtml);
        });
      },
      error: function (xhr, status, error) {
        console.error("Failed to fetch orders:", error);
        // Display error message
        $("#CartContainer").html(
          "<p>Failed to fetch orders. Please try again later.</p>"
        );
      },
    });
  }

  // Fetch user's orders when the page loads
  fetchOrders();

  // Optionally, you can trigger the fetchOrders function when the cart drawer is opened or a user interacts with it.
  // For example, if there's a button to open the cart drawer, you can attach a click event listener to it.

  // Event listener for opening cart drawer
  $(".open-cart-btn").on("click", function () {
    // Fetch user's orders when the cart drawer is opened
    fetchOrders();
  });
});
