const roles = require('./roles');
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
// if ("Charlie".can('can view resources')) {
//     sys.puts('Charlie can delete resources');
// } else {
//     sys.puts('Charlie cannot delete resources');
// }

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
// if ("Marak".isIn('Administrators')) {
//     sys.puts('Marak is in Administrators');
// }

// if (!"Marak".isntIn('Administrators')) {
//     sys.puts('Marak is in Administrators');
// }

// if ("Isaacs".isntIn('Administrators')) {
//     sys.puts('Isaacs is not in Administrators');
// }

// if ("Charlie".isntIn('Guests')) {
//     sys.puts('Charlie is not in Guests');
// }