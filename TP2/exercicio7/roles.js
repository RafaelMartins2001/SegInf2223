

module.exports = function(newEnforcer){
    return roles
    async function roles(newEnforcer){

        const enforcer = await newEnforcer('basic_model.conf', 'basic_policy.csv');
    
        async function getRoles(name){
            return await enforcer.getRolesForUser(name);
        }
    
        return {
            getRoles
        }
    }
}




