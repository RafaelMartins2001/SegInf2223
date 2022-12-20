const fetch = require('node-fetch')


async function getTasksFromUser(token){
    return fetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists`,{
        headers: 
            {
            'Authorization': 'Bearer ' + token
            }
    })
    .then(response => { 
        console.log(response.status)
        return response.json()
    })
}

async function createTaskForUser(tasklist,title, token){
    return fetch(`https://tasks.googleapis.com/tasks/v1/lists/${tasklist}/tasks`,
    {
        method: 'POST',
        headers: 
            {
                'Authorization': 'Bearer ' + token
            },
        body: JSON.stringify({
            'title': title,
            })
            
    })
    .then(response => { 
        console.log(response.status)
        return response.json()
    })
}

async function createListForUser(id, title, token){
    return fetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists`,
    {
        method: 'POST',
        headers: 
            {
                'Authorization': 'Bearer ' + token
            },
        body: JSON.stringify({
            'id': id,
            'title': title,
            })
            
    })
    .then(response => { 
        console.log(response.status)
        return response.json()
    })
}

module.exports = {
    getTasksFromUser,
    createListForUser,
    createTaskForUser
}
