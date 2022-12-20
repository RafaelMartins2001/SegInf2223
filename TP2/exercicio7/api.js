const { getEnforcer } = require("./roles")
function getData(form) {
    var formData = new FormData(form);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    console.log(Object.fromEntries(formData));
  }
let token = ''
let email = ''
module.exports = function(axios, client, roles, FormData, jwt, data){
    if(!axios || !client || !roles)throw "Invalid parameters!"
    return{
        getRedirect,
        getOAuth,
        postLogin,
        getLists,
        createList,
        createTask
    }
        function getRedirect(req, resp){
            resp.send('<a href=/Login>Login</a>')
        }

        function getOAuth(req, resp){
            resp.redirect(302,
                // authorization endpoint
                'https://accounts.google.com/o/oauth2/v2/auth?'
                
                // client id
                + 'client_id='+ client.CLIENT_ID +'&'
                
                // OpenID scope "openid email"
                + 'scope=openid%20email%20https://www.googleapis.com/auth/tasks.readonly%20https://www.googleapis.com/auth/tasks&'
                
                // parameter state is used to check if the user-agent requesting login is the same making the request to the client.CALLBACK URL
                // more info at https://www.rfc-editor.org/rfc/rfc6749#section-10.12
                + 'state=value-based-on-user-session&'
                
                // responde_type for "authorization code grant"
                + 'response_type=code&'
                
                // redirect uri used to register RP
                + 'redirect_uri=http://localhost:3001/'+client.CALLBACK)
        }

        function postLogin(req, resp){
        //
        // TODO: check if 'state' is correct for this session
        //

        console.log('making request to token endpoint')
        // content-type: application/x-www-form-urlencoded (URL-Encoded Forms)
        const form = new FormData();
        form.append('code', req.query.code);
        form.append('client_id', client.CLIENT_ID);
        form.append('client_secret', client.CLIENT_SECRET);
        form.append('redirect_uri', 'http://localhost:3001/'+client.CALLBACK);
        form.append('grant_type', 'authorization_code');
        console.log(form);

        axios.post(
            // token endpoint
            'https://www.googleapis.com/oauth2/v3/token', 
            // body parameters in form url encoded
            form,
            { headers: form.getHeaders() }
        )
        .then(function (response) {
            // AXIOS assumes by default that response type is JSON: https://github.com/axios/axios#request-config
            // Property response.data should have the JSON response according to schema described here: https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse

            console.log(response.data)
            // decode id_token from base64 encoding
            // note: method decode does not verify signature
            var jwt_payload = jwt.decode(response.data.id_token)
            //console.log(jwt_payload)
            roles.addUserToFree(jwt_payload.email, response.data.scope.split(' '))
            // a simple cookie example
            resp.cookie("DemoCookie", jwt_payload.email)

            // HTML response with the code and access token received from the authorization server
            const stringToSend =
            '<div> Hi <b>' + jwt_payload.email + '</b> </div><br>' +
            'Get lists <a href="/lists">Get Lists</a><br><br>'+
            'Create TaskList<br>'+
            '<form id="1" onsubmit= "printResult()"></form>'+
            '<label for="fname">First name:</label>'+
            '<input type="text" id="fname" name="fname"><br><br>'+
            '<label for="lname">Last name:</label>'+
            '<input type="text" id="lname" name="lname"><br><br>'+
            '<input type="submit" value="Create"><br><br>'+
            '</form><br><br><br>'+
            '<script>function myFunction() {console.log("The form was submitted");}</script>'+
            'Go back to <a href="/">Home screen</a>'
            

            resp.send(stringToSend);
                
            token = response.data.access_token
            email =jwt_payload.email
        })
        .catch(function (error) {
            console.log(error)
            resp.send()
        });
        }
        
        

        function getLists(req, resp) {
            console.log(req.params)
            data.getTasksFromUser(token)
            .then(result => resp.json(result))
        }


        async function createList(req, resp) {
            const e = await roles.getEnforcer()
            const role = await roles.getRoles(email, e)
            console.log(!role.includes('premium'))
            console.log(!role.includes('admin'))
            if(!role.includes('premium') && !role.includes('admin'))resp.send(JSON.stringify({
                'erro': "User doesn't have the permission to create a list!",
                }))
            else{
            console.log(req.params)
            data.createListForUser(req.params.listId, req.params.listTitle, token)
            .then(body => resp.send(body))
            }
        }

        async function createTask(req, resp) {
            const e = await roles.getEnforcer()
            const role = await roles.getRoles(email, e)
            if(!role.includes('premium') && !role.includes('admin'))resp.send(JSON.stringify({
                'erro': "User doesn't have the permission to add a task!",
                }))
            else{
            console.log(req.params)
            data.createTaskForUser(req.params.taskList, req.params.title, token)
            .then(body => resp.send(body))
            }
        }
}