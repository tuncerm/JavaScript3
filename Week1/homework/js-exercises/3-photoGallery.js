const myReq = new XMLHttpRequest();
myReq.open('GET', 'https://picsum.photos/400');
myReq.onerror = function(e) {
  console.error('The request failed due to an connection error.', e);
};
myReq.onload = function() {
  if (this.status >= 200 && this.status <= 299) {
    document.getElementById('xhr').setAttribute('src', this.responseURL);
  } else {
    console.error('Request failed: ', this.status);
  }
};
myReq.send();

axios
  .get('https://picsum.photos/400')
  .then(r =>
    document.getElementById('axios').setAttribute('src', r.request.responseURL),
  )
  .catch(e => console.log(e));
