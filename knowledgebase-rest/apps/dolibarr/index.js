const express = require("express");
const router = express.Router();
const pgQueries = require('../../postgres/dolibarr-queries');

router.post("/createGig", (req, res) => {
    let user_id = req.body.user_id ?? null;
    let title = req.body.title ?? null;
    let category_id = req.body.category_id ?? null;
    let subcategory_id = req.body.subcategory_id ?? null;
    let description = req.body.description ?? null;
    let metadata = req.body.metadata ?? null;
    let gig_location_tags = req.body.gig_location_tags ?? [];
    let gig_images = req.body.gig_images ?? [];
    let gig_packages = req.body.gig_packages ?? [];
    let gig_requirements = req.body.gig_requirements ?? [];

    if(user_id == null) return res.json({ status: "error", message: "Please enter the user_id"});
    if(title == null) return res.json({ status: "error", message: "Please enter the title"});
    if(category_id == null) return res.json({ status: "error", message: "Please enter the category_id"});
    if(subcategory_id == null) return res.json({ status: "error", message: "Please enter the subcategory_id"});
    if(metadata == null) return res.json({ status: "error", message: "Please enter the metadata"});
    if(gig_location_tags.length == 0) return res.json({ status: "error", message: "Please enter the gig_location_tags"}); 
    if(gig_images.length == 0) return res.json({ status: "error", message: "Please enter the gig_images"}); 
    if(gig_packages.length == 0) return res.json({ status: "error", message: "Please enter the gig_packages"}); 

    let values = [
        user_id,
        title,
        "pending_approval",
        category_id,
        subcategory_id,
        description,
        metadata
    ];

    pgQueries.createGig(values, result => {
        if(result.err){
            result.err.errorIndex = 3821;
            return res.status(500).json(result.err);
        }

        let gig_id = result.res.id;

        // create the gig location tags
        let numTags = gig_location_tags.length;
        let count = -1;

        gig_location_tags.forEach(tag => {
            values = [
                gig_id,
                tag
            ];

            pgQueries.createGigLocationTag(values, result => {
                if(result.err){
                    result.err.errorIndex = 1;
                    return res.status(500).json(result.err);
                }

                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numTags){
                // create the gig images
                let numImages = gig_images.length;
                count = -1;

                gig_images.forEach(image => {
                    values = [
                        gig_id,
                        image.url,
                        image.order
                    ];
        
                    pgQueries.createGigImage(values, result => {
                        if(result.err){
                            result.err.errorIndex = 2;
                            return res.status(500).json(result.err);
                        }
        
                        checkComplete1();
                    });
                });

                checkComplete1();

                function checkComplete1(){
                    count++;
                    if(count == numImages){
                        //create the gig packages
                        let numPackages = gig_packages.length;
                        count = -1;

                        gig_packages.forEach(package => {
                            values = [
                                gig_id,
                                package.type,
                                package.name,
                                package.description,
                                package.delivery_time,
                                package.metadata,
                                package.price
                            ];
                
                            pgQueries.createGigPackage(values, result => {
                                if(result.err){
                                    result.err.errorIndex = 4;
                                    return res.status(500).json(result.err);
                                }
                
                                checkComplete2();
                            });
                        });

                        checkComplete2();

                        function checkComplete2(){
                            count++;
                            if(count == numPackages){
                                let numRequirements = gig_requirements.length;
                                count = -1;

                                gig_requirements.forEach(requirement => {
                                    values = [
                                        gig_id,
                                        requirement.question,
                                        requirement.response_type,
                                        requirement.metadata,
                                        requirement.is_required,
                                        requirement.order_in_sequence
                                    ];
                        
                                    pgQueries.createGigRequirement(values, result => {
                                        if(result.err){
                                            result.err.errorIndex = 5;
                                            return res.status(500).json(result.err);
                                        }
                        
                                        checkComplete3();
                                    });
                                });

                                checkComplete3();

                                function checkComplete3(){
                                    count++;
                                    if(count == numRequirements){
                                        res.json({ status: "success", message: "Gig created"});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
});

router.put("/updateGig/:id", (req, res) => {
    let gig_id = req.params.id;
    let title = req.body.title ?? null;
    let category_id = req.body.category_id ?? null;
    let subcategory_id = req.body.subcategory_id ?? null;
    let description = req.body.description ?? null;
    let metadata = req.body.metadata ?? null;

    if(title == null) return res.json({ status: "error", message: "Please enter the title"});
    if(category_id == null) return res.json({ status: "error", message: "Please enter the category_id"});
    if(subcategory_id == null) return res.json({ status: "error", message: "Please enter the subcategory_id"});
    if(metadata == null) return res.json({ status: "error", message: "Please enter the metadata"});

    let values = [
        gig_id,
        title,
        category_id,
        subcategory_id,
        description,
        metadata,
        new Date().toUTCString()
    ];

    pgQueries.updateGig(values, result => {
        if(result.err){
            result.err.errorIndex = 43821;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Gig updated successfully" });
    });
});

router.put("/updateGigImages/:id", (req, res) => {
    let gig_id = req.params.id;
    let gig_images = req.body.gig_images ?? [];
    if(gig_images.length == 0) return res.json({ status: "error", message: "Please enter the gig_images"}); 

    let values = [
        gig_id
    ];

    pgQueries.deleteAllGigImages(values, result => {
        if(result.err){
            result.err.errorIndex = 43821;
            return res.status(500).json(result.err);
        }

        let numImages = gig_images.length;
        let count = -1;

        gig_images.forEach(image => {
            values = [
                gig_id,
                image.url,
                image.order
            ];

            pgQueries.createGigImage(values, result => {
                if(result.err){
                    result.err.errorIndex = 11;
                    return res.status(500).json(result.err);
                }

                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numImages){
                res.json({ status: "success", message: "Images updated successfully" });
            }
        }
    });
});

router.put("/updateGigPackage/:id", (req, res) => {
    let gig_id = req.params.id;
    let gig_packages = req.body.gig_packages ?? [];
    if(gig_packages.length == 0) return res.json({ status: "error", message: "Please enter the gig_packages"}); 

    let numPackages = gig_packages.length;
    let count = -1;

    gig_packages.forEach(package => {
        values = [
            package.id,
            gig_id,
            package.name,
            package.description,
            package.delivery_time,
            package.metadata,
            package.price
        ];

        pgQueries.updateGigPackage(values, result => {
            if(result.err){
                result.err.errorIndex = 11;
                return res.status(500).json(result.err);
            }

            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numPackages){
            res.json({ status: "success", message: "Packages updated successfully" });
        }
    }
});

router.put("/updateGigRequirements/:id", (req, res) => {
    let gig_id = req.params.id;
    let gig_requirements = req.body.gig_requirements ?? [];

    let numRequirements = gig_requirements.length;
    let count = -1;

    gig_requirements.forEach(requirement => {
        values = [
            requirement.id,
            gig_id,
            requirement.question,
            requirement.response_type,
            requirement.metadata,
            requirement.is_required,
            requirement.order_in_sequence
        ];

        pgQueries.updateGigRequirement(values, result => {
            if(result.err){
                result.err.errorIndex = 17;
                return res.status(500).json(result.err);
            }

            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRequirements){
            res.json({ status: "success", message: "Gig requirements updated successfully" });
        }
    }
});


router.delete("/deleteGig/:id", (req, res) => {
    let gig_id = req.params.id;

    let values = [
        gig_id
    ];

    pgQueries.deleteAllGigImages(values, result => {
        if(result.err){
            result.err.errorIndex = 111;
            return res.status(500).json(result.err);
        }

        pgQueries.deleteAllGigLocationTags(values, result => {
            if(result.err){
                result.err.errorIndex = 101;
                return res.status(500).json(result.err);
            }
    
            pgQueries.deleteAllGigPackages(values, result => {
                if(result.err){
                    result.err.errorIndex = 111;
                    return res.status(500).json(result.err);
                }

                pgQueries.deleteAllGigRequirements(values, result => {
                    if(result.err){
                        result.err.errorIndex = 1111;
                        return res.status(500).json(result.err);
                    }

                    pgQueries.deleteGig(values, result => {
                        if(result.err){
                            result.err.errorIndex = 111;
                            return res.status(500).json(result.err);
                        }
                
                        res.json({ status: "success", message: "Gig deleted successfully" });
                    });
                });
            });
        });
    });
});




router.post("/createProposal", (req, res) => {
    let gig_id = req.body.gig_id ?? null;
    let seller_id = req.body.seller_id ?? null;
    let buyer_id = req.body.buyer_id ?? null;
    let description = req.body.description ?? null;
    let delivery_time = req.body.delivery_time_milli ?? null;
    let price = req.body.price_dollars ?? null;
    let metadata = req.body.metadata ?? null;

    if(gig_id == null) return res.json({ status: "error", message: "Please enter the gig_id"});
    if(seller_id == null) return res.json({ status: "error", message: "Please enter the seller_id"});
    if(buyer_id == null) return res.json({ status: "error", message: "Please enter the buyer_id"});
    if(description == null) return res.json({ status: "error", message: "Please enter the description"});
    if(delivery_time == null) return res.json({ status: "error", message: "Please enter the delivery_time"});
    if(price == null) return res.json({ status: "error", message: "Please enter the price"});

    let values = [
        gig_id,
        seller_id,
        buyer_id,
        description,
        "pending",
        delivery_time,
        metadata,
        price
    ];

    pgQueries.createProposal(values, result => {
        if(result.err){
            result.err.errorIndex = 14;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Proposal created successfully" });
    });
});

router.post("/createOrder", (req, res) => {
    let gig_id = req.body.gig_id ?? null;
    let seller_id = req.body.seller_id ?? null;
    let buyer_id = req.body.buyer_id ?? null;
    let order_status = req.body.order_status ?? null;
    let delivery_time = req.body.delivery_time_milli ?? null;
    let price = req.body.price_dollars ?? null;
    let metadata = req.body.metadata ?? null;

    if(gig_id == null) return res.json({ status: "error", message: "Please enter the gig_id"});
    if(seller_id == null) return res.json({ status: "error", message: "Please enter the seller_id"});
    if(buyer_id == null) return res.json({ status: "error", message: "Please enter the buyer_id"});
    if(order_status == null) return res.json({ status: "error", message: "Please enter the order_status"});
    if(delivery_time == null) return res.json({ status: "error", message: "Please enter the delivery_time"});
    if(price == null) return res.json({ status: "error", message: "Please enter the price"});

    let values = [
        gig_id,
        seller_id,
        buyer_id,
        order_status,
        delivery_time,
        metadata,
        price
    ];

    pgQueries.createOrder(values, result => {
        if(result.err){
            result.err.errorIndex = 14;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Order created successfully" });
    });
});

router.post("/createDelivery", (req, res) => {
    let order_id = req.body.order_id ?? null;
    let gig_id = req.body.gig_id ?? null;
    let seller_id = req.body.seller_id ?? null;
    let buyer_id = req.body.buyer_id ?? null;
    let message = req.body.message ?? null;
    let metadata = req.body.metadata ?? null;

    if(order_id == null) return res.json({ status: "error", message: "Please enter the order_id"});
    if(gig_id == null) return res.json({ status: "error", message: "Please enter the gig_id"});
    if(seller_id == null) return res.json({ status: "error", message: "Please enter the seller_id"});
    if(buyer_id == null) return res.json({ status: "error", message: "Please enter the buyer_id"});

    let values = [
        order_id,
        gig_id,
        seller_id,
        buyer_id,
        message,
        metadata,
        "pending"
    ];

    pgQueries.createDelivery(values, result => {
        if(result.err){
            result.err.errorIndex = 19;
            return res.status(500).json(result.err);
        }

        res.json({ status: "success", message: "Delivery created successfully" });
    });
});


module.exports = router;