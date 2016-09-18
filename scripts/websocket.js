const address = '104.198.12.154';

let usernameCheck = setInterval(function() {
  if (getUsername() && getGroupID()) {
    clearInterval(usernameCheck);
    init();
  }
}, 500);

function init() {
  let username = getUsername();
  let group = getGroupID();
  window.socket = new WebSocket('ws://' + address + '/' + group + '/' + username);

  $.get('ip/events/' + group, function (data){
    for (let i = 0; i < data.length; i++) {
      let sumName = data[i].name;
      let sumMessage = data[i].message;

      appendSummary(sumMessage, sumName)
    }
  });

  $.get('ip/messages/' + group, function (data){
    for (let i = 0; i < data.length; i++) {
      let messagesName = data[i].name;
      let messagesMessage = data[i].message;

      appendMessage(messagesMessage, true, messagesName);
    }
  });

  function appendSummary(message, user) {
    const summaryItem = document.createElement('div');
    const nameParagraph = document.createElement('p');
    nameParagraph.innerText = name;
    summaryItem.appendChild(nameParagraph);
    const li = document.createElement('li');
    li.innerText = message;
    summaryItem.appendChild(li);
    summaryItem.className = 'server';
    $('.chat__summary__list').append(messageItem);
    $('.chat__summary').scrollTop($('.chat__summary')[0].scrollHeight);
  }

  const message = {
      name: 'sumchat',
      msg: 'connected'
  };

  socket.onopen = function(event) {
    console.log('connected');
  }

  let currentUser;
  socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    let user = data.user;
    // if current user doesn't exist then one is created
      if (typeof currentUser === 'undefined') {
        // currentUser is the user that websockets is sending
          currentUser = user;
        console.log('current user:', currentUser);
        if (username !== currentUser) {
          appendMessage(data.msg, true, currentUser);
        }
      } else if (currentUser === user) {
        console.log('same person is talking, dont change name');
        if (username !== currentUser) {
          appendMessage(data.msg, false);
        }
      } else {
        currentUser = user;
        console.log('diff person is talking, change the name');
        if (username !== currentUser) {
          appendMessage(data.msg, true, currentUser)
        }
      }
  }

}
function appendMessage(message, nameBool, name) {
  const messageItem = document.createElement('div');
  if (nameBool) {
    const nameParagraph = document.createElement('p');
    nameParagraph.innerText = name;
    messageItem.appendChild(nameParagraph);
  }

  const li = document.createElement('li');
  li.innerText = message;
  console.log(message);
  messageItem.appendChild(li);
  messageItem.className = 'server';
  $('.chat__messages__list').append(messageItem);
  $('.chat__messages').scrollTop($('.chat__messages')[0].scrollHeight);
}
