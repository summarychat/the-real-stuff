$(document).ready(function() {
  let username;
  let groupID;
  $('.landing__button').click(function() {
    event.preventDefault();
    // querying username and group id
      username = $('.landing__username').val();
      groupID = $('.landing__group-id').val();
      if (groupID === '') {
        groupID = 'Group Chat';
      }
    $('#landing').hide('easeInOutCubic');
    $('#chat').show();
    // setting body to overflow to remove double scrollbars
      $('body').css('overflow', 'hidden');
    // setting group name to specified group id
      $('.chat__header__group-name').text(groupID);
    // focusing input on section load
      $('.chat__input-field__input').focus();
  });

  $('.chat__input-field__input').keyup(function(event) {
    const message = $(this).val();
    // if browser supports event.keyCode, use so. if not, use event.which.
      const keyCode = (event.keyCode ? event.keyCode : event.which);
    // if the enter key was pressed, append message to chat, and clear input field.
      if (keyCode === 13) {
        messageSubmit(event, message);
      }
  });

  function messageSubmit(event, message) {
    if (message !== '') {
      appendMessage(message, 'client');

      const messageJSON = {
        user: username,
        msg: message
      }

      socket.send(JSON.stringify(messageJSON));
    }

    // clearing value of input
      $('.chat__input-field__input').val('');
  }

  function appendMessage(message, type) {
    const messageItem = document.createElement('div');
    const li = document.createElement('li');
    li.innerText = message;
    messageItem.appendChild(li);
    messageItem.className = type;
    $('.chat__messages__list').append(messageItem);
    // scroll down here
    $('.chat__messages').scrollTop($('.chat__messages')[0].scrollHeight);
  }

  $('.chat__summary-toggle').click(function() {
    if ($(window).width() < 900) {
      $('.chat__summary-toggle').toggle();
    }
    $('.chat__summary').toggle();
    $('.chat__summary-toggle').toggleClass('chat__summary-toggle--black');
    $('#chat').toggleClass('chat--expanded-view');
  });

  $('.chat__summary-toggle--mobile-view').click(function() {
    $('.chat__summary-toggle').toggle();
    $('.chat__summary').toggle();
    $('.chat__summary-toggle').toggleClass('chat__summary-toggle--black');
    $('#chat').toggleClass('chat--expanded-view');
  });

  window.getUsername = function() {
    return username;
  }

  window.getGroupID = function() {
    return groupID;
  }
});
