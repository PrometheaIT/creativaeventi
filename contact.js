// Precompila il form per chi viene dal team
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const intent = urlParams.get('intent');
  
  if(intent === 'team') {
      const messageField = document.getElementById('message');
      if(messageField) {
          messageField.value = "Salve, vorrei far parte del vostro team!\n\nSono...";
          messageField.focus();
      }
  }
});