(function () {
  const socket = io();
  const app = document.querySelector(".app");
  const joinBtn = app.querySelector(".join-screen #join-user");
  const joinScreen = app.querySelector(".join-screen");
  const chatScreen = app.querySelector(".chat-screen");
  const sendBtn = app.querySelector(".chat-screen #send-message");
  const exitBtn = app.querySelector(".chat-screen #exit-chat");

  let uname;

  joinBtn.addEventListener("click", () => {
    let username = app.querySelector(".join-screen #username").value;
    // console.log(username);
    if (username.length === 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username;
    joinScreen.classList.remove("active");
    chatScreen.classList.add("active");
  });

  sendBtn.addEventListener("click", () => {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length === 0) {
      return;
    }

    renderMsg("my", {
      username: uname,
      text: message,
    });

    socket.emit("chat", {
      username: uname,
      text: message,
    });

    app.querySelector(".chat-screen #message-input").value = "";
  });

  exitBtn.addEventListener("click", () => {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  socket.on("update", (update) => {
    renderMsg("update", update);
  });

  socket.on("chat", (message) => {
    renderMsg("other", message);
  });

  function renderMsg(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type === "my") {
      let myMsg = document.createElement("div");
      myMsg.setAttribute("class", "message my-message");
      myMsg.innerHTML = `
      <div class="my-message-div">
        <div class="name">You</div>
        <div class="text">${message.text}</div>
      </div>`;
      messageContainer.appendChild(myMsg);
    } else if (type === "other") {
      let otherMsg = document.createElement("div");
      otherMsg.setAttribute("class", "message other-message");
      otherMsg.innerHTML = `
      <div class="other-message-div">
        <div class="name">${message.username}</div>
        <div class="text">${message.text}</div>
      </div>`;
      messageContainer.appendChild(otherMsg);
    } else if (type === "update") {
      let stateMsg = document.createElement("div");
      stateMsg.setAttribute("class", "update");
      stateMsg.innerText = message;
      messageContainer.appendChild(stateMsg);
    }
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
