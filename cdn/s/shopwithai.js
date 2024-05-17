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