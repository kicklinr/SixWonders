$(document).ready(function() {
  $('.feedback-modal').on('click', '.feedback-submit', function(){
    var modal = $('#'+$(this).attr('data-parent'));

    // AJAX submit data

    modal.modal('hide');
  });
});
