const fetch = require('node-fetch')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


async function getTasksFromUser(query, token){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.googleapis.com/tasks/v1/users/@me/lists");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer ya29.a0AX9GBdXvaxhLd29vVnvMQ5hm6LPQPf4OWZWqMzlCQ0oEv3cGnpw6sI39IKXqy6njWUPY89mPlsU2hE7FrbqwGMGkHPdx3ktd640OmIedfIc5aja796MpnTQuyBYVUp3bUuc1q9U0XlVZ_QdsWCM1XNLKdJUMaCgYKAQISARESFQHUCsbCTC4QWRUIi1ArHYmH-cvasg0163");
    // xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.responseText;
        console.log(data);
        xhr.send(JSON.parse(data));
        return data
    }
    };
    return await xhr.responseText
}

module.exports = {
    getTasksFromUser
}
