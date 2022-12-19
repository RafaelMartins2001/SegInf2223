const fetch = require('node-fetch');

//const token = 'MTE5NTMzNTAyNzU5ODE5MTk2MDg6MDow'

async function getTasksFromUser(maxResults){
    fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists`)
        .then(res => res.text())
        .then()
        .then(text => console.log(text));
}

module.exports = {
    getTasksFromUser
}
