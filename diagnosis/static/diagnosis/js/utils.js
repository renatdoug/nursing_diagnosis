function getCSRFToken() {
  var csrfToken = null;
  const csrfElement = document.getElementsByName('csrfmiddlewaretoken')[0];
  
  if (csrfElement) {
      csrfToken = csrfElement.value;
  }
  
  return csrfToken;
}
