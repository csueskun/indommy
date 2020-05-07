const apiUrl = 'http://sgv.h-software.co/';
const imgUrl = 'http://sgv.h-software.co/img/';
const api_token = 'b2Q1enFKNWxFM3NtUWViWTl4T1hMOTVFMDBNRXU1ZlJtcWFCTE9hbA==';

class ApiInterface {
  constructor($http) {
    this.$http = $http;
  }
  get(url, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    if(config.hasOwnProperty('params')){
      config.params.api_token = api_token;
    }
    else{
      config.params = { api_token: api_token };
    }
    this.$http.get(apiUrl+url, config).then(thenCallback, errorCallback);
  }
  post(url, data={}, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: api_token };
    url = apiUrl+url+paramObjectToString(config.params);
    this.$http.post(url, data, config).then(thenCallback, errorCallback);
  }
  put(url, data={}, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: api_token };
    url = apiUrl+url+paramObjectToString(config.params);
    this.$http.put(url, data, config).then(thenCallback, errorCallback);
  }
  delete(url, config={}, thenCallback=()=>{}, errorCallback=()=>{}, finallyCallback=()=>{}) {
    config.params = { api_token: api_token };
    url = apiUrl+url+paramObjectToString(config.params);
    this.$http.delete(url, config).then(thenCallback, errorCallback);
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