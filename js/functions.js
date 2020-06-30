$(function(){
  formatDateFromIso('2022-03-03 01:02:04')
  $('a.prevent-default').on('click', function(e){e.preventDefault();});
  $('.datetimepicker').datetimepicker({
    linkField: $(this).attr('mirror'),
    linkFormat: "dd/mm/yyyy HH:iip",
    format: "yyyy-mm-dd hh:ii:ss",
    showMeridian: true,
    autoclose: true,
    fontAwesome: true
  }).on('changeDate', function(ev){
    $("#fechaini").trigger('input');
});
  // $('.glyphicon.icon-arrow-left').addClass('fa fa-chevron-left');
  // $('.glyphicon.icon-arrow-right').addClass('fa fa-chevron-right');
  // $('.icon-remove').addClass('fa fa-times');
  // $('.icon-th').addClass('fa fa-list');
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
function formatDateFromIso(iso, format='DD/MM/YYYY hh:mma'){
  const date = moment(iso);
  return date.format(format);
}