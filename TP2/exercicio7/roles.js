const { newEnforcer } = require('casbin');


    async function getEnforcer(){
        return await newEnforcer('basic_model.conf', 'basic_policy.csv')
    }

    
    async function addUserToRole(user, role, e){
        const res = await e.addRoleForUser(user, role)
        if (!res) {
            throw `User already has the role ${role}!`
        }
    }

    async function addUserToFree(user){
        const e = await getEnforcer()
        const allRoles = await getRoles(user, e)
        if(allRoles.length === 0){
            await addUserToRole(user, 'free', e)
            const newRole = await getRoles(user, e)
            console.log(newRole)
        }
        else {
            console.log(allRoles)
            throw 'User already has the other roles!'
        }
    }

    async function getRoles(user, e){
        return await e.getRolesForUser(user);
    }

    module.exports = {
        getRoles,
        addUserToRole,
        addUserToFree
    }