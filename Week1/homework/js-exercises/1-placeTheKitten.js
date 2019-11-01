const myReq = new XMLHttpRequest();
myReq.open('GET', 'https://wwww.placekitten.com/api');
myReq.onerror = function(e) {
  console.error('The request failed due to an connection error.', e);
};
myReq.onload = function() {
  if (this.status.toString().startsWith('2')) {
    console.log(JSON.stringify(this.responseText));
  } else {
    console.error('Request failed: ', this.status);
  }
};
myReq.send();

axios
  .get('https://wwww.placekitten.com/api')
  .then(r => console.log(r.data))
  .catch(e => console.error(e));
