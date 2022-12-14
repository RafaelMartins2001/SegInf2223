const fetch = require('node-fetch');

//const token = 'MTE5NTMzNTAyNzU5ODE5MTk2MDg6MDow'

async function getTasksFromUser(maxResults, token){
    fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists/${token}`)
        .then(res => res.text())
        .then(text => console.log(text));
}

module.exports = {
    getTasksFromUser
}
