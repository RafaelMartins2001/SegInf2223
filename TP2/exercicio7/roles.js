const { newEnforcer } = require('casbin');


async function getRoles(name){
const enforcer = await newEnforcer('basic_model.conf', 'basic_policy.csv');
const roles = await enforcer.getRolesForUser(name);
console.log(roles)
}
getRoles('alice')