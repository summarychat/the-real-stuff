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

  $.get('http://104.198.100.183' + '/events/' + group, function (data){
    let parsedData = JSON.parse(data);
    for (let i = 0; i < parsedData.length; i++) {
      let sumName = parsedData[i].name;
      let sumMessage = parsedData[i].message;
      console.log(sumMessage);

      appendSummary(sumMessage, sumName)
    }
  });

  $.get('http://104.198.100.183' + '/messages/' + group, function (data){
    let parsedData = JSON.parse(data);
    for (let i = 0; i < parsedData.length; i++) {
      let messagesName = parsedData[i].name;
      let messagesMessage = parsedData[i].message;

      appendMessage(messagesMessage, true, messagesName);
    }
  });

  function appendSummary(message, name) {
    const summaryItem = document.createElement('div');
    const nameParagraph = document.createElement('p');
    nameParagraph.innerText = name;
    summaryItem.appendChild(nameParagraph);
    const li = document.createElement('li');
    li.innerText = message;
    summaryItem.appendChild(li);
    summaryItem.className = 'chat__summary__list__item';
    $('.chat__summary__list').append(summaryItem);
    $('.chat__summary__list-container').scrollTop($('.chat__summary__list-container')[0].scrollHeight);
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
