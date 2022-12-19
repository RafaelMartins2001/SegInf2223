var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
async function getTasksFromUser(query){
  let adding = ''
  if(query != undefined) adding = query
  return fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists${adding}`)
      .then(res => res.text())
      .then()
      .then(text => console.log(text));
}

var url = `https://www.googleapis.com/tasks/v1/users/@me/lists`;

var xhr = new XMLHttpRequest();
xhr.open("GET", url);

xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Authorization", "Bearer ya29.a0AX9GBdV27PmsjHU23kBFU8yEw-6Tr2LcdhpERSCKMyCJf_RI285tyEEW9grAJGIj0IdYfRndbUR7-FNct-CyhWtv4nDYDJPoQHdOK1u5Tobt3W9CgzxKeCCMqLdXox9_vBY82PqhrTqMeGC3y9JianSjyRn2aCgYKASoSARESFQHUCsbCdMM9ZwnCaU94i3x4zKOFkQ0163");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }};

xhr.send();