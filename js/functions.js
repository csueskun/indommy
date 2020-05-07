$(function(){
  $('a.prevent-default').on('click', function(e){e.preventDefault();});
});

function paramObjectToString(params){
  let string = '?';
  for(var key in params) {
    if (params.hasOwnProperty(key)) {
      string += key + '=' + params[key] + '&';
    }
  }
  return string; 
}
function showToast(selector, position = 0){
  if (position !== 0) {
    $(selector).css('top', position);
  }
  $(selector).toast('show');
}
function hideToast(selector){
  $(selector).toast('dispose');
}