function chatController($rootScope, $http, $interval) {
  this.$http = $http;
  this.$interval = $interval;

  this.opened;
  
  //$http.put('https://api.myjson.com/bins/1cmidp', JSON.stringify({"messages": [], userCount: 1}));
  
  let loginForm = document.getElementById('login-form'),
      loginContainer = document.getElementById('login-container'),
      chatContainer = document.getElementById('chat-container'),
      messageInput = document.getElementById('message-input'),
      users;

  this.login = () => {
    let usernameValid,
        passwordValid,
        valid;

    this.users.map((user) => {
      usernameValid = usernameValid || this.username === user.name;
      passwordValid = (passwordValid || this.password === user.password) && usernameValid;
    });

    valid = usernameValid && passwordValid;

    validInput([username, password]);
    if(valid) {
      this.start();
    } else {
      if(!usernameValid)
        invalidInput(username);
      if(!passwordValid)
        invalidInput(password);
    }
  }

  this.developerLogin = () => {
    window.setTimeout(() => {
      this.username = 'Austin';
      this.start();
    }, 100);
  }

  this.start = () => {
    this.opened = true;
    this.sendMessage('joined chat');
    this.changeUserCount(1);
    this.$interval(this.getMessages, 1000);
  };
  
  this.changeUserCount = (userCount) => {
    this.userCount += userCount;
    this.userCount = this.userCount < 0 ? 0 : this.userCount;
    
    this.data.userCount = this.userCount;
    
    $http.put('https://api.myjson.com/bins/1cmidp', JSON.stringify(this.data));
  };
  
  function invalidInput(target) {
    if(Array.isArray(target)) {
      target.map((item) => {
        item.style.border = '1px solid red';
      });
      return;
    }
    target.style.border = '1px solid red';
  }

  function validInput(target) {
    if(Array.isArray(target)) {
      target.map((item) => {
        item.style.border = '1px solid rgba(0,0,0,.15)';
      });
      return;
    }
    target.style.border = '1px solid rgba(0,0,0,.15)';
  }

  this.getMessages = () => {
    $http.get('https://api.myjson.com/bins/1cmidp').then(response => {
      this.data = response.data;
      this.messages = this.data.messages || [];
      this.userCount = this.data.userCount || 0;
    });
  };

  this.getUsers = () => {
    $http.get('https://api.myjson.com/bins/12vk4d').then(response => this.users = response.data)
  };

  this.sendMessage = (text) => {
    text = text || this.message;
    if(text) {
      if(text === '/clear') {
        this.clear();
        this.message = '';
        return;
      }
      let message = {
        "username": this.username,
        "text": text
      };
      this.messages.push(message);
      this.data.messages = this.messages;
      
      $http.put('https://api.myjson.com/bins/1cmidp', JSON.stringify(this.data));
      this.message = '';
    }
  };

  this.clear = () => {
    $http.put('https://api.myjson.com/bins/1cmidp', JSON.stringify({"messages": [], "userCount": 0}));
  };

  this.getUsers();
  //this.developerLogin();
  $http.put('https://api.myjson.com/bins/12vk4d', '[{"name": "Austin", "password": "pie"}, {"name": "Pavel", "password": "password"}, {"name": "Kevin", "password": "1234"}]').then(() => {
    console.log('hi')
  });

  window.addEventListener('beforeunload', () => {
    this.sendMessage('left chat');
    this.clear();
    $rootScope.$digest();
  });
  this.getMessages();
}

angular
  .module('app', [])
  .controller('chatController', chatController)