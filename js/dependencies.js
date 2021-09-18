const apiUrl = 'http://localhost:8000/';
const imgUrl = 'http://localhost:8000/img/';
// const apiUrl = 'http://api.uplacecol.com/';
// const imgUrl = 'http://api.uplacecol.com/img/';

class ApiInterface {
  constructor($http) {
    this.$http = $http;
    this.api_token = sessionStorage.getItem('api_token', '');
  }
  get(url, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    if(config.hasOwnProperty('params')){
      config.params.api_token = this.api_token;
    }
    else{
      config.params = { api_token: this.api_token };
    }
    this.$http.get(apiUrl+url, config).then(thenCallback, errorCallback);
  }
  post(url, data={}, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: this.api_token };
    url = apiUrl+url+paramObjectToString(config.params);
    this.$http.post(url, data, config).then(thenCallback, errorCallback);
  }
  post2(url, data={}, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: this.api_token };
    url = url+paramObjectToString(config.params);
    this.$http.post(url, data, config).then(thenCallback, errorCallback);
  }
  put(url, data={}, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: this.api_token };
    url = apiUrl+url+paramObjectToString(config.params);
    this.$http.put(url, data, config).then(thenCallback, errorCallback);
  }
  delete(url, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: this.api_token };
    url = apiUrl+url+paramObjectToString(config.params);
    this.$http.delete(url, config).then(thenCallback, errorCallback);
  }
  getImgUrl(){
    return imgUrl;
  }
  getApiUrl(){
    return apiUrl;
  }
  getApiToken(){
    return this.api_token;
  }

}
let defaultSnackBar = {
  text: '',
  backgroundColor: '#d4edda',
  textColor: '#155724',
  showAction: false,
  pos: 'top-right',
  customClass: 'mi-snackbar',
  duration: 5000
}
class SnackBar {
  constructor() {
  }
  green(text) {
    defaultSnackBar.text = text;
    Snackbar.show(defaultSnackBar);
  }
  yellow(text){
    defaultSnackBar.text = text;
    defaultSnackBar.backgroundColor = '#fff3cd';
    defaultSnackBar.textColor = '#856404';
    Snackbar.show(defaultSnackBar);
  }
  red(text){
    defaultSnackBar.text = text;
    defaultSnackBar.backgroundColor = '#f8d7da';
    defaultSnackBar.textColor = '#721c24';
    Snackbar.show(defaultSnackBar);
  }
}

class User {
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }
  login(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('api_token', user.api_token);
  }
  logout(){
    sessionStorage.setItem('user', '{}');
    sessionStorage.setItem('api_token', '');
  }
  getUser(){
    let user = sessionStorage.getItem('user');
    if(!user || user == '{}'){
      return {};
    }
    return JSON.parse(user);
  }
  auth(){
    let user = sessionStorage.getItem('user');
    if(!user || user == '{}'){
      return false;
    }
    return true;
  }
}