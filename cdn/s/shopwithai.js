$(document).ready(function () {
    
$(".button-container").on("click", function() {
 
  window.location.href = "all.html";
  
    
});
})

function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    var sendButton = document.getElementById("sendaibutton");
    var spinner = document.getElementById("spinner");
    if (userInput.trim() !== "") {
      // Show spinner
      spinner.style.display = "inline-block";
      // Disable send button
      sendButton.disabled = true;
  
      var chatBox = document.getElementById("chat-box");
      var message = document.createElement("p");
      message.textContent = userInput;
      chatBox.appendChild(message);
      document.getElementById("user-input").value = "";
      sendQuestionToEndpoint(userInput);
      localStorage.setItem("lastUserQuestion", userInput);
    }
  }
  
  
  function displayAnswer(answer) {
    var sendButton = document.getElementById("sendaibutton");
    var spinner = document.getElementById("spinner");
    spinner.style.display = "none";
      // Disable send button
    sendButton.disabled = false;
    var lastUserQuestion = localStorage.getItem("lastUserQuestion");
    var chatBox = document.getElementById("chat-box");
    var answerText = answer.candidates[0].content.parts[0].text;
    var lines = answerText.split(/\n/); // Split text into lines
  
    // Clear chat box
  chatBox.innerHTML = '';

    var message = document.createElement("div");
    message.classList.add("chatbot-message");
  
    lines.forEach(function(line) {
      var trimmedLine = line.trim();
      if (trimmedLine.startsWith("**")) {
        // Heading
        var headingLevel = trimmedLine.match(/\*\*/g).length;
        var headingTag = "h" + headingLevel;
        var headingText = trimmedLine.replace(/\*\*/g, "");
        var headingElement = document.createElement(headingTag);
        headingElement.textContent = headingText;
        message.appendChild(headingElement);
        
            // Create the image container and assign an ID
          var imageContainer = document.createElement("img");
          imageContainer.id = "img-container";
          imageContainer.classList.add("img-container");

        

          // Append the image container after the heading
          message.appendChild(imageContainer);
        

          
      } else if (trimmedLine.startsWith("*")) {
        // List item
        var listItemText = trimmedLine.replace(/^\*/, "");
        var listItemElement = document.createElement("li");
        listItemElement.textContent = listItemText;
        var lastChild = message.lastElementChild;
        if (lastChild.tagName === "UL" || lastChild.tagName === "OL") {
          // If the last child is a list, append to it
          lastChild.appendChild(listItemElement);
        } else {
          // If not, create a new list
          var listElement = document.createElement("ul");
          listElement.appendChild(listItemElement);
          message.appendChild(listElement);
        }
      } else {
        // Regular text
        var paragraphElement = document.createElement("p");
        paragraphElement.textContent = trimmedLine;
        
        message.appendChild(paragraphElement);
      }
    });
    if (lastUserQuestion) {
        var lastUserQuestionElement = document.createElement("div");
        lastUserQuestionElement.classList.add("user-question");
        lastUserQuestionElement.textContent = lastUserQuestion;
        chatBox.appendChild(lastUserQuestionElement);
      }
    chatBox.appendChild(message);
    chatBox.scrollTop = 0;
    displayImages(lastUserQuestion);
  }


  
  function sendQuestionToEndpoint(question) {
    var apiKey = "AIzaSyAWspr9zquy7ZRkItXzxXEFw4gPjAGPGF0"; // Replace "YOUR_API_KEY" with your actual API key
    var endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;
    
    var requestData = {
      contents: [
        {
          parts: [
            {
              text: question
            }
          ]
        }
      ]
    };
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to send question to endpoint");
      }
    })
    .then(data => {
      // Handle response data as needed
      console.log(data);
      displayAnswer(data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  
  function handleKeyPress(event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed
      sendMessage();
    }
  }


  
function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    var sendButton = document.getElementById("sendaibutton");
    var spinner = document.getElementById("spinner");
    if (userInput.trim() !== "") {
        spinner.style.display = "inline-block";
        sendButton.disabled = true;

        var chatBox = document.getElementById("chat-box");
        var message = document.createElement("p");
        message.textContent = userInput;
        chatBox.appendChild(message);
        document.getElementById("user-input").value = "";
        sendQuestionToEndpoint(userInput);
        localStorage.setItem("lastUserQuestion", userInput);
    }
}



function displayImages(searchTerm) {
  const imageMapping = {
    "cdn/shop/products/product11_600xd3c0.jpg?v=1613729632": "Chicken Lollipops",
    "cdn/shop/products/product12_600xd3c0.jpg?v=1613729632": "Chicken Lollipops",
    "cdn/shop/products/product24_600xe6e1.jpg?v=1543231004": "Chicken Feet",
    "cdn/shop/products/product19_600x0a55.jpg?v=1543231005": "Chicken Feet",
    "cdn/shop/products/product4_55fc2d24-da44-451b-8582-b99a8a6caaab_600xd702.jpg?v=1543224460": "Boneless Chicken Thighs",
    "cdn/shop/products/product4_55fc2d24-da44-451b-8582-b99a8a6caaab_600xd702.jpg?v=1543224475": "Boneless Chicken Thighs",
    "cdn/shop/products/product35_600xd599.jpg?v=1543299679": "Chicken Gizzards",
    "cdn/shop/products/product17_d37a7d74-989a-44fc-b33d-c7bcc29c37ac_600x57d5.jpg?v=1543299686": "Chicken Gizzards",
    "cdn/shop/products/product6_600xd1d3.jpg?v=1543225578": " Chicken Liver",
    "cdn/shop/products/product7_600xd1d3.jpg?v=1543225578": " Chicken Liver",
    "cdn/shop/products/product15_1b5420af-b5dd-49bb-b573-be4df98cc406_600x3621.jpg?v=1543300209": " Chicken Hearts",
    "cdn/shop/products/product8_03a04094-305a-4e9a-acf5-ad2a655956ac_600x72af.jpg?v=1543300210": " Chicken Hearts",
    "cdn/shop/products/product11_600xd3c01.jpg?v=1613729632": "Chicken Lollipops",
    "cdn/shop/products/product12_600xd3c01.jpg?v=1613729632": "Chicken Lollipops",
    "cdn/shop/products/product24_600xe6e11.jpg?v=1543231004": "Chicken Feet",
    "cdn/shop/products/product19_600x0a551.jpg?v=1543231005": "Chicken Feet",
    "cdn/shop/products/product4_55fc2d24-da44-451b-8582-b99a8a6caaab_600xd7021.jpg?v=154322": "Boneless Chicken Thighs",
    "cdn/shop/products/product4_55fc2d24-da44-451b-8582-b99a8a6caaab_600xd7021.jpg?v=1543224475": "Boneless Chicken Thighs",
    "cdn/shop/products/product35_600xd5991.jpg?v=1543299679": "Chicken Gizzards",
    "cdn/shop/products/product35_600xd5991.jpg?v=1543299686": "Chicken Gizzards",
    "cdn/shop/products/product6_600xd1d31.jpg?v=1543225578": " Chicken Liver",
    "cdn/shop/products/product15_1b5420af2.jpg?v=1543300209": " Chicken Hearts",
    "cdn/shop/products/product15_1b5420af2.jpg?v=1543300210": " Chicken Hearts",
    "cdn/shop/products/product11_600xd3c02.jpg?v=1613729632": "Chicken Lollipops",
    "cdn/shop/products/product24_600xe6e12.jpg?v=1543231004": "Chicken Feet",
    "cdn/shop/products/product24_600xe6e12.jpg?v=1543231005": "Chicken Feet",
    "cdn/shop/products/product4_55fc2d243.jpg?v=1543224460": "Boneless Chicken Thighs",
    "cdn/shop/products/product4_55fc2d243.jpg?v=1543224475": "Boneless Chicken Thighs",
    "cdn/shop/products/product35_600xd5992.jpg?v=1543299679": "Chicken Gizzards",
    "cdn/shop/products/product35_600xd5992.jpg?v=1543299686": "Chicken Gizzards",
    "cdn/shop/products/product3_f68af520-2a7a-49d5-b0c1-0acc3d987c5f_600x1fb5.jpg?v=1543224475": "Boneless Chicken Thighs"



};

var imageContainer = document.getElementById("img-container");

var searchWords = searchTerm.toLowerCase().split(' ').filter(word => word !== 'chicken');

var matchingImages = Object.keys(imageMapping).filter(image => 
  searchWords.some(word => imageMapping[image].toLowerCase().includes(word))
);

if (matchingImages.length === 0) {
  var noMatchMessage = document.createElement("p");
  noMatchMessage.textContent = "No related images found.";
  // imageContainer.appendChild(noMatchMessage);
  return;
}
var counter = 0;
  for (var i = 0; i < matchingImages.length; i++) {
    var imageSrc = matchingImages[i];
    counter += 1;

    // Create a new img element for each image
    var imgElement = document.createElement("img");
    imgElement.setAttribute("src", imageSrc);
    imgElement.classList.add("img-container", "curved-edges", "img-shadow");
    imgElement.style.width = "60%";
    imgElement.style.height = "60%";
        // Create a button element
    

    
    imageContainer.parentNode.replaceChild(imgElement, imageContainer);
    

    if (counter === 1) {
      var buttonContainer = document.getElementById("button-container");
      buttonContainer.innerHTML = `Shop for ${searchTerm}`;
      buttonContainer.style.display = "block";
  
      
      break;
    }
  }
}
