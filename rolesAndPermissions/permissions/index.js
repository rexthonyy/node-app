const roles = require('./roles');
roles.load({
    "groups": {
        "Permissions": {
            "keys": [
                "PERMISSION_MANAGE_STAFF",
                "PERMISSION_IMPERSONATE_USER",
                "PERMISSION_MANAGE_APPS",
                "PERMISSION_MANAGE_CHANNELS",
                "PERMISSION_MANAGE_DISCOUNTS",
                "PERMISSION_MANAGE_PLUGINS",
                "PERMISSION_MANAGE_GIFT_CARD",
                "PERMISSION_MANAGE_MENUS",
                "PERMISSION_MANAGE_ORDERS",
                "PERMISSION_MANAGE_PAGES",
                "PERMISSION_MANAGE_PAGE_TYPES_AND_ATTRIBUTES",
                "PERMISSION_HANDLE_PAYMENTS",
                "PERMISSION_MANAGE_PRODUCTS",
                "PERMISSION_MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
                "PERMISSION_MANAGE_SHIPPING",
                "PERMISSION_MANAGE_SETTINGS",
                "PERMISSION_MANAGE_TRANSLATIONS",
                "PERMISSION_MANAGE_CHECKOUTS",
                "PERMISSION_HANDLE_CHECKOUT"
            ],
            "roles": [],
            "inherits": []
        },
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

module.exports = roles;
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