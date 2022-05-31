const roles = require('./roles');
const sys = {
    puts: val => {
        console.log(val);
    }
};

// first we are going to set some default role data

roles.load({
    "groups": {
        "Guests": {
            "keys": ["Guest"],
            "roles": ["can view resources"],
            "inherits": []
        },
        "Moderators": {
            "keys": ["Charlie", "Alexis", "Isaacs"],
            "roles": ["can edit resources", "can add resources"],
            "inherits": ["Guests"]
        },
        "Administrators": {
            "keys": ["Marak"],
            "roles": ["can delete resources"],
            "inherits": []
        }
    }
});

//roles.addUserToGroup("Marak", "Administrators");


// basic permission checks
if ("Charlie".can('can view resources')) {
    sys.puts('Charlie can delete resources');
} else {
    sys.puts('Charlie cannot delete resources');
}

// if (!"Noob".can('delete resources')) {
//     sys.puts('Noob cannot delete resources.');
// }

// if (!"Marak".cannot('delete resources')) {
//     sys.puts('Marak can delete resources.');
// }

// if ("Noob".cannot('delete resources')) {
//     sys.puts('Noob cannot delete resources.');
// }

// basic group checks
if ("Marak".isIn('Administrators')) {
    sys.puts('Marak is in Administrators');
}

// if (!"Marak".isntIn('Administrators')) {
//     sys.puts('Marak is in Administrators');
// }

if ("Isaacs".isntIn('Administrators')) {
    sys.puts('Isaacs is not in Administrators');
}

if ("Charlie".isIn('Guests')) {
    sys.puts('Charlie is in Guests');
}



// // add a user
// roles.addUser('Bob');

// // add a role
// roles.addRole('is allowed to go fly fishing');

// // add group
// roles.addGroup('Fly Fishers');

// // add user to group
// roles.addUserToGroup('Bob', 'Fly Fishers');

// // add user to group
// roles.addRoleToGroup('is allowed to go fly fishing', 'Fly Fishers');

// // inherit roles from group, in this case we give "Fly Fishers" all the same roles as "Guests"
// //roles.inheritRolesFromGroup('Fly Fishers', 'Guests');


// // now that we have loaded some roles and created some new ones, lets try some test cases

// // first, lets see all the current groups and their roles
// var theGroups = roles.getGroups();
// //sys.puts(JSON.stringify(theGroups, true, 1));
// // okay that was interesting, but kinda hard to read. lets try a basic permissions check



// var someuser = "Bob";
// if (!someuser.inGroup("Administrators")) {
//     sys.puts(someuser + ' is not in the "Administrators" group.')
// }

// if (someuser.can('edit a resource')) {
//     // i don't think so Bob!
// } else {
//     sys.puts('"Bob" cannot "edit a resource" because he is not part of any group that has this role.')
// }

// if ("Alexis".can("add a resource")) {
//     sys.puts('"Alexis" can "add a resource" since he is the "Moderators" group');
// }