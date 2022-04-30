const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const util = require('../util');
const consts = require('../consts');
const pgQueries = require('../postgres/map-queries');

function returnResult(res, result){
    if(result.err){
        return res.json(result.err);
    }
    res.json(result.res);
}

router.get("/", (req, res) => {
    res.render("select-map");
});

router.get('/insertSubRegionCode', (req, res) => {
    let districts =  [
        "KW1",
        "KW2",
        "KW3",
        "KW5",
        "KW6",
        "KW7",
        "KW8",
        "KW9",
        "KW10",
        "KW11",
        "KW12",
        "KW13",
        "KW14",
        "KW15",
        "KW16",
        "KW17"
    ];

    let numDistricts = districts.length;
    let count = -1;

    checkComplete();

    function checkComplete(){
        
    }
});

router.get('/insertSubRegion', (req, res) => {
    let regions = [
        {
            name: "Dartford",
            code: "DA",
            imageUrl: "http://77.68.102.60:9000/greater-london/DA%20-%20Dartford%20Postcode%20Map.svg"
        },
        {
            name: "Enfield",
            code: "EN",
            imageUrl: "http://77.68.102.60:9000/greater-london/EN%20-%20Enfield%20Postcode%20Map.svg"
        },
        {
            name: "Harrow",
            code: "HA",
            imageUrl: "http://77.68.102.60:9000/greater-london/HA%20-%20Harrow%20Postcode%20Map.svg"
        },
        {
            name: "Ilford",
            code: "IG",
            imageUrl: "http://77.68.102.60:9000/greater-london/IG%20-%20Ilford%20Postcode%20Map.svg"
        },
        {
            name: "Romford",
            code: "RM",
            imageUrl: "http://77.68.102.60:9000/greater-london/RM%20-%20Romford%20Postcode%20Map.svg"
        },
        {
            name: "Watford",
            code: "WD",
            imageUrl: "http://77.68.102.60:9000/greater-london/WD%20-%20Watford%20Postcode%20Map.svg"
        },
        {
            name: "Bromley",
            code: "BR",
            imageUrl: "http://77.68.102.60:9000/greater-london/BR%20Bromsgrove%20Postcode%20Map.svg"
        },
        {
            name: "North London",
            code: "N",
            imageUrl: "http://77.68.102.60:9000/greater-london/N%20-%20North%20London%20Postcode%20Map.svg"
        },
        {
            name: "North West London",
            code: "NW",
            imageUrl: "http://77.68.102.60:9000/greater-london/NW%20North%20West%20London%20Postcode%20Map.svg"
        },
        {
            name: "South East London",
            code: "SE",
            imageUrl: "http://77.68.102.60:9000/greater-london/SE%20South%20East%20London%20Postcode%20Map.svg"
        },
        {
            name: "South West London",
            code: "SW",
            imageUrl: "http://77.68.102.60:9000/greater-london/SW%20-%20South%20West%20London%20Postcode%20Map.svg"
        },
        {
            name: "Twickenham",
            code: "TW",
            imageUrl: "http://77.68.102.60:9000/greater-london/TW%20-%20Twickenham%20Postcode%20Map.svg"
        },
        {
            name: "Southall",
            code: "UB",
            imageUrl: "http://77.68.102.60:9000/greater-london/UB%20-%20Southall%20Postcode%20Map.svg"
        },
        {
            name: "West London",
            code: "W",
            imageUrl: "http://77.68.102.60:9000/greater-london/W%20-%20West%20London%20Postcode%20Map.svg"
        }
    ];

    let numRegions = regions.length;

    function checkComplete(index){
        if(index+1 == numRegions){
            res.json({ status: "success"});
        }
    }

    for(let i = 0; i < numRegions; i++){
        let region = regions[i];
        let endpoint = "http://77.68.102.60:1000/map/createServiceBoundarySubRegion";
        let options =  {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                region_id: 10,
                name: region.name,
                image_url: region.imageUrl,
                code: region.code
            })
        }
        util.sendRequest(endpoint, options)
        .then(json => {
            checkComplete(i);
        }).catch(err => {
            console.error(err);
        });
    }
});

router.get('/getTags', (req, res) => {

    let code = req.query.postcode;

    if(code == undefined){
        return res.json({ status: "error", message: "Missing query parameter 'postcode'"});
    }

    let matchedCode = "";

    let tags = [];

    // all scotland regions
    let otherScotlandRegions = [
        {
            name: "Wick",
            code: "KW",
            imageUrl: "http://77.68.102.60:9000/scotland/KW%20-%20Wick%20Postcode%20Map.svg"
        },
        {
            name: "Iverness",
            code: "IV",
            imageUrl: "http://77.68.102.60:9000//scotland/IV%20-%20Inverness%20Postcode%20Map.svg"
        },
        {
            name: "Aberdeen",
            code: "AB",
            imageUrl: "http://77.68.102.60:9000/scotland/AB%20-%20Aberdeen%20Postcode%20Map.svg"
        },
        {
            name: "Perth",
            code: "PH",
            imageUrl: "http://77.68.102.60:9000/scotland/PH%20-%20Perth%20Postcode%20Map.svg"
        },
        {
            name: "Dundee",
            code: "DD",
            imageUrl: "http://77.68.102.60:9000/scotland/DD%20-%20Dundee%20Postcode%20Map.svg"
        },
        {
            name: "Paisley",
            code: "PA",
            imageUrl: "http://77.68.102.60:9000/scotland/PA%20-%20Paisley%20Postcode%20Map.svg"
        },
        {
            name: "Falkirk",
            code: "FK",
            imageUrl: "http://77.68.102.60:9000/scotland/FK%20-%20Falkirk%20Postcode%20Map.svg"
        },
        {
            name: "Kirkaldy",
            code: "KY",
            imageUrl: "http://77.68.102.60:9000/scotland/KY%20-%20Kircaldy%20Postcode%20Map.svg"
        },
        {
            name: "Glasgow",
            code: "G",
            imageUrl: "http://77.68.102.60:9000/scotland/G%20-%20Glasgow%20Postcode%20Map.svg"
        },
        {
            name: "Kilmarnock",
            code: "KA",
            imageUrl: "http://77.68.102.60:9000/scotland/KA%20-%20Kilmarnock%20Postcode%20Map.svg"
        },
        {
            name: "Motherwell",
            code: "ML",
            imageUrl: "http://77.68.102.60:9000/scotland/ML%20-%20Motherwell%20Postcode%20District%20Map.svg"
        },
        {
            name: "Edinburgh",
            code: "EH",
            imageUrl: "http://77.68.102.60:9000/scotland/EH%20-%20Edinburgh%204-Digit%20Postcode%20Area%20and%20District%20Map.svg"
        },
        {
            name: "Galashiels",
            code: "TD",
            imageUrl: "http://77.68.102.60:9000/scotland/TD%20-%20Galashields%20Postcode%20Map.svg"
        },
        {
            name: "Dumfries",
            code: "DG",
            imageUrl: "http://77.68.102.60:9000/scotland/DG%20-%20Dumfries%20Postcode%20Map.svg"
        },
        {
            name: "Harris",
            code: "HS",
            imageUrl: "http://77.68.102.60:9000/scotland/HS%20-%20Isle%20of%20Harris%20Postcode%20Map.svg"
        },
        {
            name: "Shetland",
            code: "ZE",
            imageUrl: "http://77.68.102.60:9000/scotland/ZE%20-%20Shetland%20Postcode%20Map.svg"
        }
    ];

    // all northern ireland regions
    let otherNorthernIrelandRegions = [
        {
            name: "Belfast",
            code: "BT",
            imageUrl: "http://77.68.102.60:9000/northern-ireland/belfast.svg"
        }
    ];

    // all north east regions
    let otherNorthEastRegions = [
        {
            name: "Newcastle",
            code: "NE",
            imageUrl: "http://77.68.102.60:9000/north-east/NE%20-%20Newcastle%20Postcode%20Map.svg"
        },
        {
            name: "Durham",
            code: "DH",
            imageUrl: "http://77.68.102.60:9000/north-east/DH%20-%20Durham%20Postcode%20Map.svg"
        },
        {
            name: "Sunderland",
            code: "SR",
            imageUrl: "http://77.68.102.60:9000/north-east/SR%20-%20Sunderland%20Postcode%20Map.svg"
        },
        {
            name: "Darlington",
            code: "DL",
            imageUrl: "http://77.68.102.60:9000/north-east/DL%20-%20Darlington%20Postcode%20Map.svg"
        },
        {
            name: "Middlesbrough",
            code: "TS",
            imageUrl: "http://77.68.102.60:9000/north-east/TS%20-%20Middlesborough%20Postcode%20Map.svg"
        },
        {
            name: "Harrogate",
            code: "HG",
            imageUrl: "http://77.68.102.60:9000/north-east/HG%20-%20Harrogate%20Postcode%20Map.svg"
        },
        {
            name: "Yorkshire",
            code: "YO",
            imageUrl: "http://77.68.102.60:9000/north-east/YO%20-%20York%20Postcode%20Map.svg"
        },
        {
            name: "Leeds",
            code: "LS",
            imageUrl: "http://77.68.102.60:9000/north-east/LS%20-%20Leeds%20Postcode%20Map.svg"
        },
        {
            name: "Hull",
            code: "HU",
            imageUrl: "http://77.68.102.60:9000/north-east/HU%20-%20Hull%20Postcode%20Map.svg"
        },
        {
            name: "Wakefield",
            code: "WF",
            imageUrl: "http://77.68.102.60:9000/north-east/WF%20-%20Wakefield%20Postcode%20Map.svg"
        }
    ];

    // all north west regions
    let otherNorthWestRegions = [
        {
            name: "Carlisle",
            code: "CA",
            imageUrl: "http://77.68.102.60:9000/north-west/CA%20-%20Carlisle%20Postcode%20Map.svg"
        },
        {
            name: "Lancaster",
            code: "LA",
            imageUrl: "http://77.68.102.60:9000/north-west/LA%20-%20Lancaster%20Postcode%20Map.svg"
        },
        {
            name: "Bradford",
            code: "BD",
            imageUrl: "http://77.68.102.60:9000/north-west/BD%20-%20Bradford%20Postcode%20Map.svg"
        },
        {
            name: "Blackburn",
            code: "BB",
            imageUrl: "http://77.68.102.60:9000/north-west/BB%20-%20Blackburn%20Postcode%20Map.svg"
        },
        {
            name: "Preston",
            code: "PR",
            imageUrl: "http://77.68.102.60:9000/north-west/PR%20-%20Preston%20Postcode%20Map.svg"
        },
        {
            name: "Blackpool",
            code: "FY",
            imageUrl: "http://77.68.102.60:9000/north-west/FY%20-%20Blackpool%20Postcode%20Map.svg"
        },
        {
            name: "Liverpool",
            code: "L",
            imageUrl: "http://77.68.102.60:9000/north-west/L%20-%20Liverpool%20Postcode%20Map.svg"
        },
        {
            name: "Wigan",
            code: "WN",
            imageUrl: "http://77.68.102.60:9000/north-west/WN%20-%20Wigan%20Postcode%20Map.svg"
        },
        {
            name: "Bolton",
            code: "BL",
            imageUrl: "http://77.68.102.60:9000/north-west/BL%20-%20Bolton%20Postcode%20Map.svg"
        },
        {
            name: "Oldham",
            code: "OL",
            imageUrl: "http://77.68.102.60:9000/north-west/OL%20-%20Oldham%20Postcode%20Map.svg"
        },
        {
            name: "Halifax",
            code: "HX",
            imageUrl: "http://77.68.102.60:9000/north-west/HX%20-%20Halifax%20Postcode%20Map.svg"
        },
        {
            name: "Hudersfield",
            code: "HD",
            imageUrl: "http://77.68.102.60:9000/north-west/HD%20-%20Huddersfield%20Postcode%20Map.svg"
        },
        {
            name: "Stockport",
            code: "SK",
            imageUrl: "http://77.68.102.60:9000/north-west/SK%20-%20Stockport%20Postcode%20Map.svg"
        },
        {
            name: "Machester",
            code: "M",
            imageUrl: "http://77.68.102.60:9000/north-west/M%20-%20Manchester%20Postcode%20Map.svg"
        },
        {
            name: "Chester",
            code: "CH",
            imageUrl: "http://77.68.102.60:9000/north-west/CH%20-%20Chester%20Postcode%20Map.svg"
        },
        {
            name: "Crewe",
            code: "CW",
            imageUrl: "http://77.68.102.60:9000/north-west/CW%20-%20Crewe%20Postcode%20Map.svg"
        },
        {
            name: "Warrington",
            code: "WA",
            imageUrl: "http://77.68.102.60:9000/north-west/WA%20-%20Warrington%20Postcode%20Map.svg"
        }
    ];

    // all east midland regions
    let otherEastMidlandRegions = [
        {
            name: "Doncaster",
            code: "DN",
            imageUrl: "http://77.68.102.60:9000/east-midlands/DN%20-%20Doncaster%20Postcode%20Map.svg"
        },
        {
            name: "Sheffield",
            code: "S",
            imageUrl: "http://77.68.102.60:9000/east-midlands/S%20-%20Sheffield%20Postcode%20Map.svg"
        },
        {
            name: "Derby",
            code: "DE",
            imageUrl: "http://77.68.102.60:9000/east-midlands/DE%20-%20Derby%20Postcode%20Map.svg"
        },
        {
            name: "Nottingham",
            code: "NG",
            imageUrl: "http://77.68.102.60:9000/east-midlands/NG%20-%20Nottingham%20Postcode%20Map.svg"
        },
        {
            name: "Lincoln",
            code: "LN",
            imageUrl: "http://77.68.102.60:9000/east-midlands/LN%20-%20Lincoln%20Postcode%20Map.svg"
        },
        {
            name: "Leicester",
            code: "LE",
            imageUrl: "http://77.68.102.60:9000/east-midlands/LE%20-%20Leicester%20Postcode%20Map.svg"
        },
        {
            name: "Peterborough",
            code: "PE",
            imageUrl: "http://77.68.102.60:9000/east-midlands/PE%20-%20Peterborough%20Postcode%20Map.svg"
        },
        {
            name: "Cambridge",
            code: "CB",
            imageUrl: "http://77.68.102.60:9000/east-midlands/CB%20-%20Cambridge%20Postcode%20Map.svg"
        },
        {
            name: "Ipswich",
            code: "IP",
            imageUrl: "http://77.68.102.60:9000/east-midlands/IP%20-%20Ipswich%20Postcode%20Map.svg"
        },
        {
            name: "Norwich",
            code: "NR",
            imageUrl: "http://77.68.102.60:9000/east-midlands/NR%20-%20Norwich%20Postcode%20Map.svg"
        },
        {
            name: "Colchester",
            code: "CO",
            imageUrl: "http://77.68.102.60:9000/east-midlands/CO%20-%20Colchester%20Postcode%20Map.svg"
        }
    ];

    // all west midland regions
    let otherWestMidlandRegions = [
        {
            name: "Stoke",
            code: "ST",
            imageUrl: "http://77.68.102.60:9000/west-midlands/ST%20-%20Stoke%20on%20Trent%20Postcode%20Map.svg"
        },
        {
            name: "Telford",
            code: "TF",
            imageUrl: "http://77.68.102.60:9000/west-midlands/TF%20-%20Telford%20Postcode%20Map.svg"
        },
        {
            name: "Walsall",
            code: "WS",
            imageUrl: "http://77.68.102.60:9000/west-midlands/WS%20-%20Walsall%20Postcode%20Map.svg"
        },
        {
            name: "Wolverhampton",
            code: "WV",
            imageUrl: "http://77.68.102.60:9000/west-midlands/WV%20-%20Wolverhampton%20Postcode%20Map.svg"
        },
        {
            name: "Dudley",
            code: "DY",
            imageUrl: "http://77.68.102.60:9000/west-midlands/DY%20-%20Dudley%20Postcode%20Map.svg"
        },
        {
            name: "Birmingham",
            code: "B",
            imageUrl: "http://77.68.102.60:9000/west-midlands/B%20-%20Birmingham%20Postcode%20Map.svg"
        },
        {
            name: "Northampton",
            code: "NN",
            imageUrl: "http://77.68.102.60:9000/west-midlands/NN%20-%20Northampton%20Postcode%20Map.svg"
        },
        {
            name: "Worcester",
            code: "WR",
            imageUrl: "http://77.68.102.60:9000/west-midlands/WR%20Worcester%20Postcode%20Map.svg"
        },
        {
            name: "Hereford",
            code: "HR",
            imageUrl: "http://77.68.102.60:9000/west-midlands/HR%20-%20Hereford%20Postcode%20Map.svg"
        },
        {
            name: "Coventry",
            code: "CV",
            imageUrl: "http://77.68.102.60:9000/west-midlands/CV%20-%20Coventry%20Postcode%20Map.svg"
        }
    ];

    // all wales regions
    let otherWalesRegions = [
        {
            name: "Cardiff",
            code: "CF",
            imageUrl: "http://77.68.102.60:9000/wales/CF%20-%20Cardiff%20Postcode%20Map.svg"
        },
        {
            name: "Landrindod",
            code: "LD",
            imageUrl: "http://77.68.102.60:9000/wales/LD%20-%20Llandrindod%20Postcode%20Map.svg"
        },
        {
            name: "Wrexham",
            code: "LL",
            imageUrl: "http://77.68.102.60:9000/wales/LL%20-%20Wrexham%20Postcode%20Map.svg"
        },
        {
            name: "Newport",
            code: "NP",
            imageUrl: "http://77.68.102.60:9000/wales/NP%20-%20Newport%20Postcode%20Map.svg"
        },
        {
            name: "Swansea",
            code: "SA",
            imageUrl: "http://77.68.102.60:9000/wales/SA%20-%20Swansea%20Postcode%20Map.svg"
        },
        {
            name: "Shrewsbury",
            code: "SY",
            imageUrl: "http://77.68.102.60:9000/wales/SY%20-%20Shrewsbury%20Postcode%20Map.svg"
        }
    ];

    // all south west regions
    let otherSouthWestRegions = [
        {
            name: "Bath",
            code: "BA",
            imageUrl: "http://77.68.102.60:9000/south-west/BA%20-%20Bath%20Postcode%20Map.svg"
        },
        {
            name: "Bournemouth",
            code: "BH",
            imageUrl: "http://77.68.102.60:9000/south-west/BH%20-%20Bournemouth%20Postcode%20Map.svg"
        },
        {
            name: "Bristol",
            code: "BS",
            imageUrl: "http://77.68.102.60:9000/south-west/BS%20-%20Bristol%20Postcode%20Map.svg"
        },
        {
            name: "Exeter",
            code: "EX",
            imageUrl: "http://77.68.102.60:9000/south-west/EX%20-%20Exeter%20Postcode%20Map.svg"
        },
        {
            name: "Plymouth",
            code: "PL",
            imageUrl: "http://77.68.102.60:9000/south-west/PL%20-%20Plymouth%20Postcode%20Map.svg"
        },
        {
            name: "Salisbury",
            code: "SP",
            imageUrl: "http://77.68.102.60:9000/south-west/SP%20-%20Salisbury%20Postcode%20Map.svg"
        },
        {
            name: "Taunton",
            code: "TA",
            imageUrl: "http://77.68.102.60:9000/south-west/TA%20-%20Taunton%20Postcode%20Map.svg"
        },
        {
            name: "Torquay",
            code: "TQ",
            imageUrl: "http://77.68.102.60:9000/south-west/TQ%20-%20Torquay%20Postcode%20Map.svg"
        },
        {
            name: "Truro",
            code: "TR",
            imageUrl: "http://77.68.102.60:9000/south-west/TR%20-%20Truro%20Postcode%20Map%20.svg"
        },
        {
            name: "Gloucester",
            code: "GL",
            imageUrl: "http://77.68.102.60:9000/south-west/Gloucester%20GL%20south%20west.svg"
        }
    ];

    // all south east regions
    let otherSouthEastRegions = [
        {
            name: "St Albans",
            code: "AL",
            imageUrl: "http://77.68.102.60:9000/south-east/AL%20-%20St%20Albans%20Postcode%20Map.svg"
        },
        {
            name: "Brighton",
            code: "BN",
            imageUrl: "http://77.68.102.60:9000/south-east/BN%20-%20Brighton%20Postcode%20Map.svg"
        },
        {
            name: "Chelmsford",
            code: "CM",
            imageUrl: "http://77.68.102.60:9000/south-east/CM%20-%20Chelmsford%20Postcode%20Map.svg"
        },
        {
            name: "Canterbury",
            code: "CT",
            imageUrl: "http://77.68.102.60:9000/south-east/CT%20-%20Canterbury%20Postcode%20Map.svg"
        },
        {
            name: "Guilford",
            code: "GU",
            imageUrl: "http://77.68.102.60:9000/south-east/GU%20-%20Guilford%20Postcode%20Map.svg"
        },
        {
            name: "Hemel",
            code: "HP",
            imageUrl: "http://77.68.102.60:9000/south-east/HP%20-%20Hemel%20Hempstead%20%20Postcode%20Map.svg"
        },
        {
            name: "Luton",
            code: "LU",
            imageUrl: "http://77.68.102.60:9000/south-east/LU%20-%20Luton%20Postcode%20Map.svg"
        },
        {
            name: "Maidstone",
            code: "ME",
            imageUrl: "http://77.68.102.60:9000/south-east/ME%20-%20Maidstone%20Postcode%20Map.svg"
        },
        {
            name: "Milton Keynes",
            code: "MK",
            imageUrl: "http://77.68.102.60:9000/south-east/MK%20-%20Milton%20Keynes%20Postcode%20Map.svg"
        },            
        {
            name: "Oxford",
            code: "OX",
            imageUrl: "http://77.68.102.60:9000/south-east/OX%20-%20Oxford%20Postcode%20Map.svg"
        },
        {
            name: "Portsmouth",
            code: "PO",
            imageUrl: "http://77.68.102.60:9000/south-east/PO%20-%20Portsmouth%20Postcode%20Map.svg"
        },
        {
            name: "Reading",
            code: "RG",
            imageUrl: "http://77.68.102.60:9000/south-east/RG%20-%20Reading%20Postcode%20Map.svg"
        },
        {
            name: "Redhill",
            code: "RH",
            imageUrl: "http://77.68.102.60:9000/south-east/RH%20-%20Redhill%20Postcode%20Map.svg"
        },
        {
            name: "Stevenage",
            code: "SG",
            imageUrl: "http://77.68.102.60:9000/south-east/SG%20-%20Stevenage%20Postcode%20Map.svg"
        },
        {
            name: "Slough",
            code: "SL",
            imageUrl: "http://77.68.102.60:9000/south-east/SL%20-%20Slough%20Postcode%20Map.svg"
        },
        {
            name: "Southampton",
            code: "SO",
            imageUrl: "http://77.68.102.60:9000/south-east/SO%20-%20Southampton%20Postcode%20Map.svg"
        },
        {
            name: "Southend",
            code: "SS",
            imageUrl: "http://77.68.102.60:9000/south-east/SS%20-%20Southend%20on%20Sea%20Postcode%20Map.svg"
        },
        {
            name: "Tonbridge",
            code: "TN",
            imageUrl: "http://77.68.102.60:9000/south-east/TN%20-%20Tonbridge%20Postcode%20Map.svg"
        }
    ];

    // all greater london regions
    let otherGreaterLondonRegions = [
        {
            name: "Dartford",
            code: "DA",
            imageUrl: "http://77.68.102.60:9000/greater-london/DA%20-%20Dartford%20Postcode%20Map.svg"
        },
        {
            name: "Enfield",
            code: "EN",
            imageUrl: "http://77.68.102.60:9000/greater-london/EN%20-%20Enfield%20Postcode%20Map.svg"
        },
        {
            name: "Harrow",
            code: "HA",
            imageUrl: "http://77.68.102.60:9000/greater-london/HA%20-%20Harrow%20Postcode%20Map.svg"
        },
        {
            name: "Ilford",
            code: "IG",
            imageUrl: "http://77.68.102.60:9000/greater-london/IG%20-%20Ilford%20Postcode%20Map.svg"
        },
        {
            name: "Romford",
            code: "RM",
            imageUrl: "http://77.68.102.60:9000/greater-london/RM%20-%20Romford%20Postcode%20Map.svg"
        },
        {
            name: "Watford",
            code: "WD",
            imageUrl: "http://77.68.102.60:9000/greater-london/WD%20-%20Watford%20Postcode%20Map.svg"
        },
        {
            name: "Bromley",
            code: "BR",
            imageUrl: "http://77.68.102.60:9000/greater-london/BR%20Bromsgrove%20Postcode%20Map.svg"
        },
        {
            name: "North London",
            code: "N",
            imageUrl: "http://77.68.102.60:9000/greater-london/N%20-%20North%20London%20Postcode%20Map.svg"
        },
        {
            name: "North West London",
            code: "NW",
            imageUrl: "http://77.68.102.60:9000/greater-london/NW%20North%20West%20London%20Postcode%20Map.svg"
        },
        {
            name: "South East London",
            code: "SE",
            imageUrl: "http://77.68.102.60:9000/greater-london/SE%20South%20East%20London%20Postcode%20Map.svg"
        },
        {
            name: "South West London",
            code: "SW",
            imageUrl: "http://77.68.102.60:9000/greater-london/SW%20-%20South%20West%20London%20Postcode%20Map.svg"
        },
        {
            name: "Twickenham",
            code: "TW",
            imageUrl: "http://77.68.102.60:9000/greater-london/TW%20-%20Twickenham%20Postcode%20Map.svg"
        },
        {
            name: "Southall",
            code: "UB",
            imageUrl: "http://77.68.102.60:9000/greater-london/UB%20-%20Southall%20Postcode%20Map.svg"
        },
        {
            name: "West London",
            code: "W",
            imageUrl: "http://77.68.102.60:9000/greater-london/W%20-%20West%20London%20Postcode%20Map.svg"
        }
    ];

    // all regions
    const allRegions = [
        {
            regionName: "Scotland",
            regionCode: "SC",
            subRegions: otherScotlandRegions
        },
        {
            regionName: "Northern Ireland",
            regionCode: "NI",
            subRegions: otherNorthernIrelandRegions
        },
        {
            regionName: "North East",
            regionCode: "NE",
            subRegions: otherNorthEastRegions
        },
        {
            regionName: "North West",
            regionCode: "NW",
            subRegions: otherNorthWestRegions
        },
        {
            regionName: "East Midlands",
            regionCode: "EM",
            subRegions: otherEastMidlandRegions
        },
        {
            regionName: "West Midlands",
            regionCode: "WM",
            subRegions: otherWestMidlandRegions
        },
        {
            regionName: "Wales",
            regionCode: "W",
            subRegions: otherWalesRegions
        },
        {
            regionName: "South West",
            regionCode: "SW",
            subRegions: otherSouthWestRegions
        },
        {
            regionName: "South East",
            regionCode: "SE",
            subRegions: otherSouthEastRegions
        },
        {
            regionName: "Greater London",
            regionCode: "GL",
            subRegions: otherGreaterLondonRegions
        }
    ];

    if(['NA'].find(cod => {
        return cod == code
    })){
        return res.json(allRegions);
    }
    // scotland regions
    if(['KW', 'IV', 'AB', 'PH', 'DD', 'PA', 'FK', 'KY', 'G', 'KA', 'ML', 'EH', 'TD', 'DG', 'HS', 'ZE']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "KW":
                subRegion =  {
                    name: "Wick",
                    imageUrl: "http://77.68.102.60:9000/scotland/KW%20-%20Wick%20Postcode%20Map.svg",
                    code: "KW",
                    districts: [
                        "KW1",
                        "KW2",
                        "KW3",
                        "KW5",
                        "KW6",
                        "KW7",
                        "KW8",
                        "KW9",
                        "KW10",
                        "KW11",
                        "KW12",
                        "KW13",
                        "KW14",
                        "KW15",
                        "KW16",
                        "KW17"
                    ]
                };
            break;

            case "IV":
                subRegion = {
                    name: "Inverness",
                    imageUrl: "http://77.68.102.60:9000//scotland/IV%20-%20Inverness%20Postcode%20Map.svg",
                    code: "IV",
                    districts: [
                        "IV1",
                        "IV2",
                        "IV3",
                        "IV4",
                        "IV5",
                        "IV5",
                        "IV6",
                        "IV7",
                        "IV8",
                        "IV9",
                        "IV10",
                        "IV11",
                        "IV12",
                        "IV13",
                        "IV14",
                        "IV15",
                        "IV16",
                        "IV17",
                        "IV18",
                        "IV19",
                        "IV20",
                        "IV21",
                        "IV22",
                        "IV23",
                        "IV24",
                        "IV25",
                        "IV26",
                        "IV27",
                        "IV28",
                        "IV30",
                        "IV31",
                        "IV32",
                        "IV36",
                        "IV40",
                        "IV41",
                        "IV42",
                        "IV43",
                        "IV44",
                        "IV45",
                        "IV46",
                        "IV47",
                        "IV48",
                        "IV49",
                        "IV51",
                        "IV52",
                        "IV53",
                        "IV54",
                        "IV55",
                        "IV56",
                        "IV63"
                    ]
                };
            break;

            case "AB":
                subRegion = {
                        name: "Aberdeen",
                        imageUrl: "http://77.68.102.60:9000/scotland/AB%20-%20Aberdeen%20Postcode%20Map.svg",
                        code: "AB",
                        districts: [
                            "AB10",
                            "AB11",
                            "AB12",
                            "AB13",
                            "AB14",
                            "AB15",
                            "AB16",
                            "AB21",
                            "AB22",
                            "AB23",
                            "AB24",
                            "AB25",
                            "AB31",
                            "AB32",
                            "AB33",
                            "AB34",
                            "AB35",
                            "AB36",
                            "AB37",
                            "AB38",
                            "AB39",
                            "AB41",
                            "AB42",
                            "AB43",
                            "AB44",
                            "AB45",
                            "AB51",
                            "AB52",
                            "AB53",
                            "AB54",
                            "AB55",
                            "AB56",
                            "AB99"
                        ]
                    };
            break;

            case "PH":
                subRegion = {
                    name: "Perth",
                    imageUrl: "http://77.68.102.60:9000/scotland/PH%20-%20Perth%20Postcode%20Map.svg",
                    code: "PH",
                    districts: [
                        "PH1",
                        "PH2",
                        "PH3",
                        "PH4",
                        "PH5",
                        "PH6",
                        "PH7",
                        "PH8",
                        "PH9",
                        "PH10",
                        "PH11",
                        "PH12",
                        "PH13",
                        "PH14",
                        "PH15",
                        "PH16",
                        "PH17",
                        "PH18",
                        "PH19",
                        "PH20",
                        "PH21",
                        "PH22",
                        "PH23",
                        "PH24",
                        "PH25",
                        "PH26",
                        "PH30",
                        "PH31",
                        "PH32",
                        "PH33",
                        "PH34",
                        "PH35",
                        "PH36",
                        "PH37",
                        "PH38",
                        "PH39",
                        "PH40",
                        "PH41",
                        "PH42",
                        "PH43",
                        "PH44",
                        "PH49",
                        "PH50"
                    ]
                };
            break;

            case "DD":
                subRegion =  {
                    name: "Dundee",
                    imageUrl: "http://77.68.102.60:9000/scotland/DD%20-%20Dundee%20Postcode%20Map.svg",
                    code: "DD",
                    districts: [
                        "DD1",
                        "DD2",
                        "DD3",
                        "DD4",
                        "DD5",
                        "DD6",
                        "DD7",
                        "DD8",
                        "DD9",
                        "DD10",
                        "DD11"
                    ]
                };
            break;

            case "PA":
                subRegion = {
                    name: "Paisley",
                    imageUrl: "http://77.68.102.60:9000/scotland/PA%20-%20Paisley%20Postcode%20Map.svg",
                    code: "PA",
                    districts: [
                        "PA1",
                        "PA2",
                        "PA3",
                        "PA4",
                        "PA5",
                        "PA6",
                        "PA7",
                        "PA8",
                        "PA9",
                        "PA10",
                        "PA12",
                        "PA13",
                        "PA14",
                        "PA15",
                        "PA16",
                        "PA17",
                        "PA18",
                        "PA19",
                        "PA20",
                        "PA21",
                        "PA22",
                        "PA23",
                        "PA24",
                        "PA25",
                        "PA26",
                        "PA27",
                        "PA28",
                        "PA29",
                        "PA30",
                        "PA31",
                        "PA32",
                        "PA33",
                        "PA34",
                        "PA35",
                        "PA36",
                        "PA37",
                        "PA38",
                        "PA41",
                        "PA42",
                        "PA43",
                        "PA44",
                        "PA45",
                        "PA46",
                        "PA47",
                        "PA48",
                        "PA49",
                        "PA60",
                        "PA61",
                        "PA62",
                        "PA63",
                        "PA64",
                        "PA65",
                        "PA66",
                        "PA67",
                        "PA68",
                        "PA69",
                        "PA70",
                        "PA71",
                        "PA72",
                        "PA73",
                        "PA74",
                        "PA75",
                        "PA76",
                        "PA77",
                        "PA78",
                        "PA80"
                    ]
                };
            break;

            case "FK":
                subRegion = {
                    name: "Falkirk",
                    imageUrl: "http://77.68.102.60:9000/scotland/FK%20-%20Falkirk%20Postcode%20Map.svg",
                    code: "FK",
                    districts: [
                        "FK1",
                        "FK2",
                        "FK3",
                        "FK4",
                        "FK5",
                        "FK6",
                        "FK7",
                        "FK8",
                        "FK9",
                        "FK10",
                        "FK11",
                        "FK12",
                        "FK13",
                        "FK14",
                        "FK15",
                        "FK16",
                        "FK17",
                        "FK18",
                        "FK19",
                        "FK20",
                        "FK21"
                    ]
                };
            break;

            case "KY":
                subRegion = {
                    name: "Kirkcaldy",
                    imageUrl: "http://77.68.102.60:9000/scotland/KY%20-%20Kircaldy%20Postcode%20Map.svg",
                    code: "KY",
                    districts: [
                        "KY1",
                        "KY2",
                        "KY3",
                        "KY4",
                        "KY5",
                        "KY6",
                        "KY7",
                        "KY8",
                        "KY9",
                        "KY10",
                        "KY11",
                        "KY12",
                        "KY13",
                        "KY14",
                        "KY15",
                        "KY16",
                        "KY99"
                    ]
                };
            break;

            case "G":
                subRegion =  {
                    name: "Glasgow",
                    imageUrl: "http://77.68.102.60:9000/scotland/G%20-%20Glasgow%20Postcode%20Map.svg",
                    code: "G",
                    districts: [
                        "G1",
                        "G2",
                        "G3",
                        "G4",
                        "G5",
                        "G9",
                        "G11",
                        "G12",
                        "G13",
                        "G14",
                        "G15",
                        "G20",
                        "G21",
                        "G22",
                        "G23",
                        "G31",
                        "G32",
                        "G33",
                        "G34",
                        "G40",
                        "G41",
                        "G42",
                        "G43",
                        "G44",
                        "G45",
                        "G46",
                        "G51",
                        "G52",
                        "G53",
                        "G58",
                        "G60",
                        "G61",
                        "G62",
                        "G63",
                        "G64",
                        "G65",
                        "G66",
                        "G67",
                        "G68",
                        "G69",
                        "G70",
                        "G71",
                        "G72",
                        "G73",
                        "G74",
                        "G75",
                        "G76",
                        "G77",
                        "G78",
                        "G79",
                        "G81",
                        "G82",
                        "G83",
                        "G84",
                        "G90"
                    ]
                };
            break;

            case "KA":
                subRegion =  {
                    name: "Kilmarnock",
                    imageUrl: "http://77.68.102.60:9000/scotland/KA%20-%20Kilmarnock%20Postcode%20Map.svg",
                    code: "KA",
                    districts: [
                        "KA1 1",
                        "KA1 2",
                        "KA1 3",
                        "KA1 4",
                        "KA1 5",
                        "KA2 0",
                        "KA3 1",
                        "KA3 2",
                        "KA3 3",
                        "KA3 4",
                        "KA3 5",
                        "KA3 6",
                        "KA3 7",
                        "KA4 8",
                        "KA16 9",
                        "KA17 0"
                    ]
                };
            break;

            case "ML":
                subRegion =  {
                    name: "Motherwell",
                    imageUrl: "http://77.68.102.60:9000/scotland/ML%20-%20Motherwell%20Postcode%20District%20Map.svg",
                    code: "ML",
                    districts: [
                        "ML1",
                        "ML2",
                        "ML3",
                        "ML4",
                        "ML5",
                        "ML6",
                        "ML7",
                        "ML8",
                        "ML9",
                        "ML10",
                        "ML11",
                        "ML12"
                    ]
                };
            break;

            case "EH":
                subRegion =  {
                    name: "Edinburgh",
                    imageUrl: "http://77.68.102.60:9000/scotland/EH%20-%20Edinburgh%204-Digit%20Postcode%20Area%20and%20District%20Map.svg",
                    code: "EH",
                    districts: [
                        "EH1",
                        "EH2",
                        "EH3",
                        "EH4",
                        "EH5",
                        "EH6",
                        "EH7",
                        "EH8",
                        "EH9",
                        "EH10",
                        "EH11",
                        "EH12",
                        "EH13",
                        "EH14",
                        "EH15",
                        "EH16",
                        "EH17",
                        "EH95",
                        "EH99",
                        "EH18",
                        "EH19",
                        "EH20",
                        "EH21",
                        "EH22",
                        "EH23",
                        "EH24",
                        "EH25",
                        "EH26",
                        "EH27",
                        "EH28",
                        "EH29",
                        "EH30",
                        "EH31",
                        "EH32",
                        "EH33",
                        "EH34",
                        "EH54",
                        "EH55",
                        "EH35",
                        "EH36",
                        "EH37",
                        "EH38",
                        "EH39",
                        "EH40",
                        "EH41",
                        "EH42",
                        "EH43",
                        "EH44",
                        "EH45",
                        "EH46",
                        "EH47",
                        "EH48",
                        "EH49",
                        "EH51",
                        "EH52",
                        "EH53"
                    ]
                };
            break;

            case "TD":
                subRegion = {
                    name: "Galashiels",
                    imageUrl: "http://77.68.102.60:9000/scotland/TD%20-%20Galashields%20Postcode%20Map.svg",
                    code: "TD",
                    districts: [
                        "TD1",
                        "TD2",
                        "TD3",
                        "TD4",
                        "TD5",
                        "TD6",
                        "TD7",
                        "TD8",
                        "TD9",
                        "TD10",
                        "TD11",
                        "TD12",
                        "TD13",
                        "TD14",
                        "TD15"
                    ]
                };
            break;

            case "DG":
                subRegion = {
                    name: "Dumfries",
                    imageUrl: "http://77.68.102.60:9000/scotland/DG%20-%20Dumfries%20Postcode%20Map.svg",
                    code: "DG",
                    districts: [
                        "DG1",
                        "DG2",
                        "DG3",
                        "DG4",
                        "DG5",
                        "DG6",
                        "DG7",
                        "DG8",
                        "DG9",
                        "DG10",
                        "DG11",
                        "DG12",
                        "DG13",
                        "DG14",
                        "DG16"
                    ]
                };
            break;

            case "HS":
                subRegion =  {
                    name: "Isle of Harris",
                    imageUrl: "http://77.68.102.60:9000/scotland/HS%20-%20Isle%20of%20Harris%20Postcode%20Map.svg",
                    code: "HS",
                    districts: [
                        "HS1",
                        "HS2",
                        "HS3",
                        "HS4",
                        "HS5",
                        "HS6",
                        "HS7",
                        "HS8",
                        "HS9"
                    ]
                };
            break;

            case "ZE":
                subRegion =  {
                    name: "Shetland",
                    imageUrl: "http://77.68.102.60:9000/scotland/ZE%20-%20Shetland%20Postcode%20Map.svg",
                    code: "ZE",
                    districts: [
                        "ZE1",
                        "ZE2",
                        "ZE3"
                    ]
                };
            break;
        }

        let scotland = {
            regionName: "Scotland",
            regionCode: "SC",
            subregion: subRegion,
            otherSubregions: otherScotlandRegions
        }

        tags.push(scotland);

        return res.json(tags);
    }
    
    // northern ireland regions
    if(['BT']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        if(matchedCode == "BT"){
            subRegion = {
                name: "Belfast",
                imageUrl: "http://77.68.102.60:9000/northern-ireland/belfast.svg",
                code: "BT",
                districts: [
                    "BT1",
                    "BT2",
                    "BT3",
                    "BT4",
                    "BT5",
                    "BT6",
                    "BT7",
                    "BT8",
                    "BT9",
                    "BT10",
                    "BT11",
                    "BT12",
                    "BT13",
                    "BT14",
                    "BT15",
                    "BT16",
                    "BT17",
                    "BT18",
                    "BT19",
                    "BT20",
                    "BT21",
                    "BT22",
                    "BT23",
                    "BT24",
                    "BT25",
                    "BT26",
                    "BT27",
                    "BT28",
                    "BT29",
                    "BT30",
                    "BT31",
                    "BT32",
                    "BT33",
                    "BT34",
                    "BT35",
                    "BT36",
                    "BT37",
                    "BT38",
                    "BT39",
                    "BT40",
                    "BT41",
                    "BT42",
                    "BT43",
                    "BT44",
                    "BT45",
                    "BT46",
                    "BT47",
                    "BT48",
                    "BT49",
                    "BT51",
                    "BT52",
                    "BT53",
                    "BT54",
                    "BT55",
                    "BT56",
                    "BT57",
                    "BT58",
                    "BT60",
                    "BT61",
                    "BT62",
                    "BT63",
                    "BT64",
                    "BT65",
                    "BT66",
                    "BT67",
                    "BT68",
                    "BT69",
                    "BT70",
                    "BT71",
                    "BT74",
                    "BT75",
                    "BT76",
                    "BT77",
                    "BT78",
                    "BT79",
                    "BT80",
                    "BT81",
                    "BT82",
                    "BT91",
                    "BT93",
                    "BT94"
                ]
            };
        }

        let northernIreland = {
            regionName: "Northern Ireland",
            regionCode: "NI",
            subregion: subRegion,
            otherSubregions: otherNorthernIrelandRegions
        }

        tags.push(northernIreland);

        return res.json(tags);
    }


    // north east
    if(['NE', 'DH', 'SR', 'DL', 'TS', 'HG', 'YO', 'LS', 'HU', 'WF']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "NE":
                subRegion = {
                    name: "Newcastle",
                    imageUrl: "http://77.68.102.60:9000/north-east/NE%20-%20Newcastle%20Postcode%20Map.svg",
                    code: "NE",
                    districts: [
                        "NE1",
                        "NE2",
                        "NE3",
                        "NE4",
                        "NE5",
                        "NE6",
                        "NE7",
                        "NE65",
                        "NE8",
                        "NE9",
                        "NE66",
                        "NE10",
                        "NE67",
                        "NE11",
                        "NE68",
                        "NE12",
                        "NE69",
                        "NE13",
                        "NE70",
                        "NE15",
                        "NE71",
                        "NE16",
                        "NE82",
                        "NE17",
                        "NE83",
                        "NE18",
                        "NE85",
                        "NE19",
                        "NE88",
                        "NE20",
                        "NE92",
                        "NE21",
                        "NE98",
                        "NE22",
                        "NE45",
                        "NE99",
                        "NE23",
                        "NE46",
                        "NE24",
                        "NE47",
                        "NE25",
                        "NE26",
                        "NE27",
                        "NE28",
                        "NE29",
                        "NE63",
                        "NE30",
                        "NE64",
                        "NE31",
                        "NE32",
                        "NE33",
                        "NE34",
                        "NE35",
                        "NE36",
                        "NE37",
                        "NE38",
                        "NE71",
                        "NE39",
                        "NE82",
                        "NE40",
                        "NE41",
                        "NE42",
                        "NE43",
                        "NE44"
                    ]
                };
            break;

            case "DH":
                subRegion =  {
                    name: "Durham",
                    imageUrl: "http://77.68.102.60:9000/north-east/DH%20-%20Durham%20Postcode%20Map.svg",
                    code: "DH",
                    districts: [
                        "DH1",
                        "DH2",
                        "DH3",
                        "DH4",
                        "DH5",
                        "DH6",
                        "DH7",
                        "DH8",
                        "DH9",
                        "DH97",
                        "DH98",
                        "DH99"
                    ]
                };
            break;

            case "SR":
                subRegion = {
                    name: "Sunderland",
                    imageUrl: "http://77.68.102.60:9000/north-east/SR%20-%20Sunderland%20Postcode%20Map.svg",
                    code: "SR",
                    districts: [
                        "SR1",
                        "SR2",
                        "SR3",
                        "SR4",
                        "SR5",
                        "SR6",
                        "SR7",
                        "SR8",
                        "SR9"
                    ]
                };
            break;

            case "DL":
                subRegion =  {
                    name: "Darlington",
                    imageUrl: "http://77.68.102.60:9000/north-east/DL%20-%20Darlington%20Postcode%20Map.svg",
                    code: "DL",
                    districts: [
                        "DL1",
                        "DL2",
                        "DL3",
                        "DL4",
                        "DL5",
                        "DL6",
                        "DL7",
                        "DL8",
                        "DL9",
                        "DL10"
                    ]
                };
            break;

            case "TS":
                subRegion =  {
                    name: "Middlesbrough",
                    imageUrl: "http://77.68.102.60:9000/north-east/TS%20-%20Middlesborough%20Postcode%20Map.svg",
                    code: "TS",
                    districts: [
                        "TS1",
                        "TS2",
                        "TS3",
                        "TS4",
                        "TS5",
                        "TS6",
                        "TS7",
                        "TS8",
                        "TS9",
                        "TS10",
                        "TS11",
                        "TS12",
                        "TS13",
                        "TS14",
                        "TS15",
                        "TS16",
                        "TS17",
                        "TS18",
                        "TS19",
                        "TS20",
                        "TS21",
                        "TS22",
                        "TS23",
                        "TS24",
                        "TS25",
                        "TS26",
                        "TS27",
                        "TS28",
                        "TS29"
                    ]
                };
            break;

            case "HG":
                subRegion =  {
                    name: "Harrogate",
                    imageUrl: "http://77.68.102.60:9000/north-east/HG%20-%20Harrogate%20Postcode%20Map.svg",
                    code: "HG",
                    districts: [
                        "HG1",
                        "HG2",
                        "HG3",
                        "HG4",
                        "HG5"
                    ]
                };
            break;

            case "YO":
                subRegion = {
                    name: "York",
                    imageUrl: "http://77.68.102.60:9000/north-east/YO%20-%20York%20Postcode%20Map.svg",
                    code: "YO",
                    districts: [
                        "YO1",
                        "YO7",
                        "YO8",
                        "YO10",
                        "YO11",
                        "YO12",
                        "YO13",
                        "YO14",
                        "YO15",
                        "YO16",
                        "YO17",
                        "YO18",
                        "YO19",
                        "YO21",
                        "YO22",
                        "YO23",
                        "YO24",
                        "YO25",
                        "YO26",
                        "YO30",
                        "YO31",
                        "YO32",
                        "YO41",
                        "YO42",
                        "YO43",
                        "YO51",
                        "YO60",
                        "YO61",
                        "YO62",
                        "YO90",
                        "YO91"
                    ]
                };
            break;

            case "LS":
                subRegion = {
                    name: "Leeds",
                    imageUrl: "http://77.68.102.60:9000/north-east/LS%20-%20Leeds%20Postcode%20Map.svg",
                    code: "LS",
                    districts: [
                        "LS1",
                        "LS2",
                        "LS3",
                        "LS4",
                        "LS5",
                        "LS6",
                        "LS7",
                        "LS8",
                        "LS9",
                        "LS10",
                        "LS11",
                        "LS12",
                        "LS13",
                        "LS14",
                        "LS15",
                        "LS16",
                        "LS17",
                        "LS18",
                        "LS19",
                        "LS20",
                        "LS21",
                        "LS22",
                        "LS23",
                        "LS24",
                        "LS25",
                        "LS26",
                        "LS27",
                        "LS28",
                        "LS29",
                        "LS98"
                    ]
                };
            break;

            case "HU":
                subRegion =  {
                    name: "Hull",
                    imageUrl: "http://77.68.102.60:9000/north-east/HU%20-%20Hull%20Postcode%20Map.svg",
                    code: "HU",
                    districts: [
                        "HU1",
                        "HU2",
                        "HU3",
                        "HU4",
                        "HU5",
                        "HU6",
                        "HU7",
                        "HU8",
                        "HU9",
                        "HU10",
                        "HU11",
                        "HU12",
                        "HU13",
                        "HU14",
                        "HU15",
                        "HU16",
                        "HU17",
                        "HU18",
                        "HU19",
                        "HU20"
                    ]
                };
            break;

            case "WF":
                subRegion = {
                    name: "Wakefield",
                    imageUrl: "http://77.68.102.60:9000/north-east/WF%20-%20Wakefield%20Postcode%20Map.svg",
                    code: "WF",
                    districts: [
                        "WF1",
                        "WF2",
                        "WF3",
                        "WF4",
                        "WF5",
                        "WF6",
                        "WF7",
                        "WF8",
                        "WF9",
                        "WF10",
                        "WF11",
                        "WF12",
                        "WF13",
                        "WF14",
                        "WF15",
                        "WF16",
                        "WF17",
                        "WF90"
                    ]
                };
            break;
        }

        let northEast = {
            regionName: "North East",
            regionCode: "NE",
            subregion: subRegion,
            otherSubregions: otherNorthEastRegions
        }

        tags.push(northEast);

        return res.json(tags);
    }
    

    // north west
    if(['CA', 'LA', 'BD', 'BB', 'PR', 'FY', 'L', 'WN', 'BL', 'OL', 'HX', 'HD', 'SK', 'M', 'CH', 'CW', 'WA']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "CA":
                subRegion = {
                    name: "Carlisle",
                    imageUrl: "http://77.68.102.60:9000/north-west/CA%20-%20Carlisle%20Postcode%20Map.svg",
                    code: "CA",
                    districts: [
                        "CA1",
                        "CA2",
                        "CA3",
                        "CA4",
                        "CA5",
                        "CA6",
                        "CA7",
                        "CA8",
                        "CA9",
                        "CA10",
                        "CA11",
                        "CA12",
                        "CA13",
                        "CA14",
                        "CA15",
                        "CA16",
                        "CA17",
                        "CA18",
                        "CA19",
                        "CA20",
                        "CA21",
                        "CA22",
                        "CA23",
                        "CA24",
                        "CA25",
                        "CA26",
                        "CA27",
                        "CA28",
                        "CA95"
                    ]
                };
            break;

            case "LA":
                subRegion = {
                    name: "Lancaster",
                    imageUrl: "http://77.68.102.60:9000/north-west/LA%20-%20Lancaster%20Postcode%20Map.svg",
                    code: "LA",
                    districts: [
                        "LA1",
                        "LA2",
                        "LA3",
                        "LA4",
                        "LA5",
                        "LA6",
                        "LA7",
                        "LA8",
                        "LA9",
                        "LA10",
                        "LA11",
                        "LA12",
                        "LA13",
                        "LA14",
                        "LA14",
                        "LA15",
                        "LA16",
                        "LA17",
                        "LA18",
                        "LA19",
                        "LA20",
                        "LA21",
                        "LA22",
                        "LA23"
                    ]
                };
            break;

            case "BD":
                subRegion =  {
                    name: "Bradford",
                    imageUrl: "http://77.68.102.60:9000/north-west/BD%20-%20Bradford%20Postcode%20Map.svg",
                    code: "BD",
                    districts: [
                        "BD1",
                        "BD2",
                        "BD3",
                        "BD4",
                        "BD5",
                        "BD6",
                        "BD7",
                        "BD8",
                        "BD9",
                        "BD10",
                        "BD11",
                        "BD12",
                        "BD13",
                        "BD14",
                        "BD15",
                        "BD16",
                        "BD17",
                        "BD18",
                        "BD19",
                        "BD20",
                        "BD21",
                        "BD22",
                        "BD23",
                        "BD24",
                        "BD97",
                        "BD98",
                        "BD99"
                    ]
                };
            break;

            case "BB":
                subRegion =  {
                    name: "Blackburn",
                    imageUrl: "http://77.68.102.60:9000/north-west/BB%20-%20Blackburn%20Postcode%20Map.svg",
                    code: "BB",
                    districts: [
                        "BB0",
                        "BB1",
                        "BB2",
                        "BB3",
                        "BB4",
                        "BB5",
                        "BB6",
                        "BB7",
                        "BB8",
                        "BB9",
                        "BB10",
                        "BB11",
                        "BB12",
                        "BB18",
                        "BB18"
                    ]
                };
            break;

            case "PR":
                subRegion =   {
                    name: "Preston",
                    imageUrl: "http://77.68.102.60:9000/north-west/PR%20-%20Preston%20Postcode%20Map.svg",
                    code: "PR",
                    districts: [
                        "PR0",
                        "PR1",
                        "PR2",
                        "PR3",
                        "PR4",
                        "PR5",
                        "PR6",
                        "PR7",
                        "PR8",
                        "PR9",
                        "PR11",
                        "PR25",
                        "PR26"
                    ]
                };
            break;

            case "FY":
                subRegion =  {
                    name: "Blackpool",
                    imageUrl: "http://77.68.102.60:9000/north-west/FY%20-%20Blackpool%20Postcode%20Map.svg",
                    code: "FY",
                    districts: [
                        "FY0",
                        "FY1",
                        "FY2",
                        "FY3",
                        "FY4",
                        "FY5",
                        "FY6",
                        "FY7",
                        "FY8"
                    ]
                };
            break;

            case "L":
                subRegion = {
                    name: "Liverpool",
                    imageUrl: "http://77.68.102.60:9000/north-west/L%20-%20Liverpool%20Postcode%20Map.svg",
                    code: "L",
                    districts: [
                        "L1",
                        "L2",
                        "L3",
                        "L4",
                        "L5",
                        "L6",
                        "L7",
                        "L8",
                        "L9",
                        "L10",
                        "L11",
                        "L12",
                        "L13",
                        "L14",
                        "L15",
                        "L16",
                        "L17",
                        "L18",
                        "L19",
                        "L20",
                        "L21",
                        "L22",
                        "L23",
                        "L24",
                        "L25",
                        "L26",
                        "L27",
                        "L28",
                        "L29",
                        "L30",
                        "L31",
                        "L32",
                        "L33",
                        "L34",
                        "L35",
                        "L36",
                        "L37",
                        "L38",
                        "L39",
                        "L40",
                        "L67",
                        "L68",
                        "L69",
                        "L70",
                        "L71",
                        "L72",
                        "L73",
                        "L74",
                        "L75",
                        "L80"
                    ]
                };
            break;

            case "WN":
                subRegion =  {
                    name: "Wigan",
                    imageUrl: "http://77.68.102.60:9000/north-west/WN%20-%20Wigan%20Postcode%20Map.svg",
                    code: "WN",
                    districts: [
                        "WN1",
                        "WN2",
                        "WN3",
                        "WN4",
                        "WN5",
                        "WN6",
                        "WN7",
                        "WN8"
                    ]
                };
            break;

            case "BL":
                subRegion =  {
                    name: "Bolton",
                    imageUrl: "http://77.68.102.60:9000/north-west/BL%20-%20Bolton%20Postcode%20Map.svg",
                    code: "BL",
                    districts: [
                        "BL0",
                        "BL1",
                        "BL2",
                        "BL3",
                        "BL4",
                        "BL5",
                        "BL6",
                        "BL7",
                        "BL8",
                        "BL9"
                    ]
                };
            break;

            case "OL":
                subRegion = {
                    name: "Oldham",
                    imageUrl: "http://77.68.102.60:9000/north-west/OL%20-%20Oldham%20Postcode%20Map.svg",
                    code: "OL",
                    districts: [
                        "OL1",
                        "OL2",
                        "OL3",
                        "OL4",
                        "OL5",
                        "OL6",
                        "OL7",
                        "OL8",
                        "OL9",
                        "OL10",
                        "OL11",
                        "OL12",
                        "OL13",
                        "OL14",
                        "OL15",
                        "OL16",
                        "OL95"
                    ]
                };
            break;

            case "HX":
                subRegion =  {
                    name: "Halifax",
                    imageUrl: "http://77.68.102.60:9000/north-west/HX%20-%20Halifax%20Postcode%20Map.svg",
                    code: "HX",
                    districts: [
                        "HX1",
                        "HX2",
                        "HX3",
                        "HX4",
                        "HX5",
                        "HX6",
                        "HX7"
                    ]
                };
            break;

            case "HD":
                subRegion =  {
                    name: "Huddersfield",
                    imageUrl: "http://77.68.102.60:9000/north-west/HD%20-%20Huddersfield%20Postcode%20Map.svg",
                    code: "HD",
                    districts: [
                        "HD1",
                        "HD2",
                        "HD3",
                        "HD4",
                        "HD5",
                        "HD6",
                        "HD7",
                        "HD8",
                        "HD9"
                    ]
                };
            break;

            case "SK":
                subRegion = {
                    name: "Stockport",
                    imageUrl: "http://77.68.102.60:9000/north-west/SK%20-%20Stockport%20Postcode%20Map.svg",
                    code: "SK",
                    districts: [
                        "SK1",
                        "SK2",
                        "SK3",
                        "SK4",
                        "SK5",
                        "SK6",
                        "SK7",
                        "SK8",
                        "SK9",
                        "SK10",
                        "SK10",
                        "SK11",
                        "SK12",
                        "SK13",
                        "SK14",
                        "SK15",
                        "SK16",
                        "SK17",
                        "SK22",
                        "SK23"
                    ]
                };
            break;

            case "M":
                subRegion =  {
                    name: "Manchester",
                    imageUrl: "http://77.68.102.60:9000/north-west/M%20-%20Manchester%20Postcode%20Map.svg",
                    code: "M",
                    districts: [
                        "M1",
                        "M2",
                        "M3",
                        "M4",
                        "M5",
                        "M6",
                        "M7",
                        "M8",
                        "M9",
                        "M11",
                        "M12",
                        "M13",
                        "M14",
                        "M15",
                        "M16",
                        "M17",
                        "M18",
                        "M19",
                        "M20",
                        "M21",
                        "M22",
                        "M23",
                        "M24",
                        "M25",
                        "M26",
                        "M27",
                        "M28",
                        "M29",
                        "M30",
                        "M31",
                        "M32",
                        "M33",
                        "M34",
                        "M35",
                        "M38",
                        "M40",
                        "M41",
                        "M43",
                        "M44",
                        "M45",
                        "M46",
                        "M50",
                        "M60",
                        "M90",
                        "M99"
                    ]
                };
            break;

            case "CH":
                subRegion =   {
                    name: "Chester",
                    imageUrl: "http://77.68.102.60:9000/north-west/CH%20-%20Chester%20Postcode%20Map.svg",
                    code: "CH",
                    districts: [
                        "CH1",
                        "CH2",
                        "CH3",
                        "CH4",
                        "CH5",
                        "CH63",
                        "CH6",
                        "CH64",
                        "CH7",
                        "CH65",
                        "CH8",
                        "CH25",
                        "CH70",
                        "CH26",
                        "CH88",
                        "CH27",
                        "CH99",
                        "CH28",
                        "CH29",
                        "CH30",
                        "CH31",
                        "CH32",
                        "CH33",
                        "CH34",
                        "CH41",
                        "CH42",
                        "CH43",
                        "CH44",
                        "CH45",
                        "CH46",
                        "CH47",
                        "CH48",
                        "CH49",
                        "CH60",
                        "CH61",
                        "CH62",
                        "CH66"
                    ]
                };
            break;

            case "CW":
                subRegion =  {
                    name: "Crewe",
                    imageUrl: "http://77.68.102.60:9000/north-west/CW%20-%20Crewe%20Postcode%20Map.svg",
                    code: "CW",
                    districts: [
                        "CW1",
                        "CW2",
                        "CW3",
                        "CW4",
                        "CW5",
                        "CW6",
                        "CW7",
                        "CW8",
                        "CW9",
                        "CW10",
                        "CW11",
                        "CW12",
                        "CW98"
                    ]
                };
            break;

            case "WA":
                subRegion =  {
                    name: "Warrington",
                    imageUrl: "http://77.68.102.60:9000/north-west/WA%20-%20Warrington%20Postcode%20Map.svg",
                    code: "WA",
                    districts: [
                        "WA1",
                        "WA2",
                        "WA3",
                        "WA4",
                        "WA5",
                        "WA6",
                        "WA7",
                        "WA8",
                        "WA9",
                        "WA10",
                        "WA11",
                        "WA12",
                        "WA13",
                        "WA14",
                        "WA15",
                        "WA16",
                        "WA55",
                        "WA88"
                    ]
                };
            break;
        }

        let northWest = {
            regionName: "North West",
            regionCode: "NW",
            subregion: subRegion,
            otherSubregions: otherNorthWestRegions
        }

        tags.push(northWest);

        return res.json(tags);
    }

    // east midlands
    if(['DN', 'S', 'DE', 'NG', 'LN', 'LE', 'PE', 'CB', 'IP', 'NR', 'CO']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
       let subRegion = null;

        switch(matchedCode){
            case "DN":
                subRegion =  {
                    name: "Doncaster",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/DN%20-%20Doncaster%20Postcode%20Map.svg",
                    code: "DN",
                    districts: [
                        "DN1",
                        "DN2",
                        "DN3",
                        "DN4",
                        "DN5",
                        "DN6",
                        "DN7",
                        "DN8",
                        "DN9",
                        "DN10",
                        "DN11",
                        "DN12",
                        "DN14",
                        "DN15",
                        "DN16",
                        "DN17",
                        "DN18",
                        "DN19",
                        "DN20",
                        "DN21",
                        "DN22",
                        "DN31",
                        "DN32",
                        "DN33",
                        "DN34",
                        "DN35",
                        "DN36",
                        "DN37",
                        "DN38",
                        "DN39",
                        "DN40",
                        "DN41",
                        "DN55"
                    ]
                };
            break;

            case "S":
                subRegion =  {
                    name: "Sheffield",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/S%20-%20Sheffield%20Postcode%20Map.svg",
                    code: "S",
                    districts: [
                        "S1",
                        "S2",
                        "S3",
                        "S4",
                        "S5",
                        "S6",
                        "S7",
                        "S8",
                        "S9",
                        "S10",
                        "S11",
                        "S12",
                        "S13",
                        "S14",
                        "S17",
                        "S18",
                        "S20",
                        "S21",
                        "S25",
                        "S26",
                        "S32",
                        "S33",
                        "S35",
                        "S36",
                        "S40",
                        "S41",
                        "S42",
                        "S43",
                        "S44",
                        "S45",
                        "S49",
                        "S60",
                        "S61",
                        "S62",
                        "S63",
                        "S64",
                        "S65",
                        "S66",
                        "S70",
                        "S71",
                        "S72",
                        "S73",
                        "S74",
                        "S75",
                        "S80",
                        "S81",
                        "S96",
                        "S97",
                        "S98"
                    ]
                };
            break;

            case "DE":
                subRegion =  {
                    name: "Derby",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/DE%20-%20Derby%20Postcode%20Map.svg",
                    code: "DE",
                    districts: [
                        "DE1",
                        "DE3",
                        "DE4",
                        "DE5",
                        "DE6",
                        "DE7",
                        "DE11",
                        "DE12",
                        "DE13",
                        "DE14",
                        "DE15",
                        "DE21",
                        "DE22",
                        "DE23",
                        "DE24",
                        "DE45",
                        "DE55",
                        "DE56",
                        "DE65",
                        "DE72",
                        "DE73",
                        "DE74",
                        "DE75",
                        "DE99"
                    ]
                };
            break;

            case "NG":
                subRegion =  {
                    name: "Nottingham",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/NG%20-%20Nottingham%20Postcode%20Map.svg",
                    code: "NG",
                    districts: [
                        "NG1",
                        "NG2",
                        "NG3",
                        "NG4",
                        "NG5",
                        "NG6",
                        "NG7",
                        "NG8",
                        "NG9",
                        "NG10",
                        "NG11",
                        "NG12",
                        "NG13",
                        "NG14",
                        "NG15",
                        "NG16",
                        "NG17",
                        "NG18",
                        "NG19",
                        "NG20",
                        "NG21",
                        "NG22",
                        "NG23",
                        "NG24",
                        "NG25",
                        "NG31",
                        "NG32",
                        "NG33",
                        "NG34",
                        "NG70",
                        "NG80",
                        "NG90"
                    ]
                };
            break;

            case "LN":
                subRegion =  {
                    name: "Lincoln",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/LN%20-%20Lincoln%20Postcode%20Map.svg",
                    code: "LN",
                    districts: [
                        "LN1",
                        "LN2",
                        "LN3",
                        "LN4",
                        "LN5",
                        "LN6",
                        "LN7",
                        "LN8",
                        "LN9",
                        "LN10",
                        "LN11",
                        "LN12",
                        "LN13"
                    ]
                };
            break;

            case "LE":
                subRegion =  {
                    name: "Leicester",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/LE%20-%20Leicester%20Postcode%20Map.svg",
                    code: "LE",
                    districts: [
                        "LE1",
                        "LE2",
                        "LE3",
                        "LE4",
                        "LE5",
                        "LE6",
                        "LE7",
                        "LE8",
                        "LE9",
                        "LE10",
                        "LE11",
                        "LE12",
                        "LE13",
                        "LE14",
                        "LE15",
                        "LE16",
                        "LE17",
                        "LE18",
                        "LE19",
                        "LE21",
                        "LE41",
                        "LE55",
                        "LE65",
                        "LE67",
                        "LE87",
                        "LE94",
                        "LE95"
                    ]
                };
            break;

            case "PE":
                subRegion =  {
                    name: "Peterborough",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/PE%20-%20Peterborough%20Postcode%20Map.svg",
                    code: "PE",
                    districts: [
                        "PE1",
                        "PE2",
                        "PE3",
                        "PE4",
                        "PE5",
                        "PE6",
                        "PE7",
                        "PE8",
                        "PE9",
                        "PE10",
                        "PE11",
                        "PE12",
                        "PE13",
                        "PE14",
                        "PE15",
                        "PE16",
                        "PE19",
                        "PE20",
                        "PE21",
                        "PE22",
                        "PE23",
                        "PE24",
                        "PE25",
                        "PE26",
                        "PE27",
                        "PE28",
                        "PE29",
                        "PE30",
                        "PE31",
                        "PE32",
                        "PE33",
                        "PE34",
                        "PE35",
                        "PE36",
                        "PE37",
                        "PE38",
                        "PE99"
                    ]
                };
            break;

            case "CB":
                subRegion =  {
                    name: "Cambridge",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/CB%20-%20Cambridge%20Postcode%20Map.svg",
                    code: "CB",
                    districts: [
                        "CB1",
                        "CB2",
                        "CB3",
                        "CB4",
                        "CB5",
                        "CB6",
                        "CB7",
                        "CB8",
                        "CB9",
                        "CB10",
                        "CB11",
                        "CB21",
                        "CB22",
                        "CB23",
                        "CB24",
                        "CB25"
                    ]
                };
            break;

            case "IP":
                subRegion = {
                    name: "Ipswich",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/IP%20-%20Ipswich%20Postcode%20Map.svg",
                    code: "IP",
                    districts: [
                        "IP1",
                        "IP2",
                        "IP3",
                        "IP4",
                        "IP5",
                        "IP6",
                        "IP7",
                        "IP8",
                        "IP9",
                        "IP10",
                        "IP11",
                        "IP12",
                        "IP13",
                        "IP14",
                        "IP15",
                        "IP16",
                        "IP17",
                        "IP18",
                        "IP19",
                        "IP20",
                        "IP21",
                        "IP22",
                        "IP23",
                        "IP24",
                        "IP25",
                        "IP26",
                        "IP27",
                        "IP28",
                        "IP29",
                        "IP30",
                        "IP31",
                        "IP32",
                        "IP33",
                        "IP98"
                    ]
                };
            break;

            case "NR":
                subRegion = {
                    name: "Norwich",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/NR%20-%20Norwich%20Postcode%20Map.svg",
                    code: "NR",
                    districts: [
                        "NR1",
                        "NR2",
                        "NR3",
                        "NR4",
                        "NR5",
                        "NR6",
                        "NR7",
                        "NR8",
                        "NR9",
                        "NR10",
                        "NR11",
                        "NR12",
                        "NR13",
                        "NR14",
                        "NR15",
                        "NR16",
                        "NR17",
                        "NR18",
                        "NR19",
                        "NR20",
                        "NR21",
                        "NR22",
                        "NR23",
                        "NR24",
                        "NR25",
                        "NR26",
                        "NR27",
                        "NR28",
                        "NR29",
                        "NR30",
                        "NR31",
                        "NR32",
                        "NR33",
                        "NR34",
                        "NR35"
                    ]
                };
            break;

            case "CO":
                subRegion = {
                    name: "Colchester",
                    imageUrl: "http://77.68.102.60:9000/east-midlands/CO%20-%20Colchester%20Postcode%20Map.svg",
                    code: "CO",
                    districts: [
                        "CO1",
                        "CO2",
                        "CO3",
                        "CO4",
                        "CO5",
                        "CO6",
                        "CO7",
                        "CO8",
                        "CO9",
                        "CO10",
                        "CO11",
                        "CO12",
                        "CO13",
                        "CO14",
                        "CO15",
                        "CO16"
                    ]
                };
            break;
        }

        let eastMidlands = {
            regionName: "East Midlands",
            regionCode: "EM",
            subregion: subRegion,
            otherSubregions: otherEastMidlandRegions
        }

        tags.push(eastMidlands);

        return res.json(tags);
    }

    // west midlands
    if(['ST', 'TF', 'WS', 'WV', 'DY', 'B', 'NN', 'WR', 'HR', 'CV']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "ST":
                subRegion = {
                    name: "Stoke",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/ST%20-%20Stoke%20on%20Trent%20Postcode%20Map.svg",
                    code: "ST",
                    districts: [
                        "ST1",
                        "ST2",
                        "ST3",
                        "ST4",
                        "ST5",
                        "ST6",
                        "ST7",
                        "ST8",
                        "ST9",
                        "ST10",
                        "ST11",
                        "ST12",
                        "ST13",
                        "ST14",
                        "ST15",
                        "ST16",
                        "ST17",
                        "ST18",
                        "ST19",
                        "ST20",
                        "ST21"
                    ]
                };
            break;

            case "TF":
                subRegion =  {
                    name: "Telford",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/TF%20-%20Telford%20Postcode%20Map.svg",
                    code: "TF",
                    districts: [
                        "TF1",
                        "TF2",
                        "TF3",
                        "TF4",
                        "TF5",
                        "TF6",
                        "TF7",
                        "TF8",
                        "TF9",
                        "TF10",
                        "TF11",
                        "TF12",
                        "TF13"
                    ]
                };
            break;

            case "WS":
                subRegion = {
                    name: "Walsall",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/WS%20-%20Walsall%20Postcode%20Map.svg",
                    code: "WS",
                    districts: [
                        "WS1",
                        "WS2",
                        "WS3",
                        "WS4",
                        "WS5",
                        "WS6",
                        "WS7",
                        "WS8",
                        "WS9",
                        "WS10",
                        "WS11",
                        "WS12",
                        "WS13",
                        "WS14",
                        "WS15"
                    ]
                };
            break;

            case "WV":
                subRegion = {
                    name: "Wolverhampton",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/WV%20-%20Wolverhampton%20Postcode%20Map.svg",
                    code: "WV",
                    districts: [
                        "WV1",
                        "WV2",
                        "WV3",
                        "WV4",
                        "WV5",
                        "WV6",
                        "WV7",
                        "WV8",
                        "WV9",
                        "WV10",
                        "WV11",
                        "WV12",
                        "WV13",
                        "WV14",
                        "WV15",
                        "WV16"
                    ]
                };
            break;

            case "DY":
                subRegion =  {
                    name: "Dudley",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/DY%20-%20Dudley%20Postcode%20Map.svg",
                    code: "DY",
                    districts: [
                        "DY1",
                        "DY2",
                        "DY3",
                        "DY4",
                        "DY5",
                        "DY6",
                        "DY7",
                        "DY8",
                        "DY9",
                        "DY10",
                        "DY11",
                        "DY12",
                        "DY13",
                        "DY14"
                    ]
                };
            break;

            case "B":
                subRegion =  {
                    name: "Birmingham",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/B%20-%20Birmingham%20Postcode%20Map.svg",
                    code: "B",
                    districts: [
                        "B1",
                        "B2",
                        "B3",
                        "B4",
                        "B5",
                        "B6",
                        "B7",
                        "B8",
                        "B9",
                        "B10",
                        "B11",
                        "B12",
                        "B13",
                        "B14",
                        "B15",
                        "B16",
                        "B17",
                        "B18",
                        "B19",
                        "B20",
                        "B21",
                        "B23",
                        "B24",
                        "B25",
                        "B26",
                        "B27",
                        "B28",
                        "B29",
                        "B30",
                        "B31",
                        "B32",
                        "B33",
                        "B34",
                        "B35",
                        "B36",
                        "B37",
                        "B38",
                        "B40",
                        "B42",
                        "B43",
                        "B44",
                        "B45",
                        "B46",
                        "B47",
                        "B48",
                        "B49",
                        "B50",
                        "B60",
                        "B61",
                        "B62",
                        "B63",
                        "B64",
                        "B65",
                        "B66",
                        "B67",
                        "B68",
                        "B69",
                        "B70",
                        "B71",
                        "B72",
                        "B73",
                        "B74",
                        "B75",
                        "B76",
                        "B77",
                        "B78",
                        "B79",
                        "B80",
                        "B90",
                        "B91",
                        "B92",
                        "B93",
                        "B94",
                        "B95",
                        "B96",
                        "B97",
                        "B98",
                        "B99"
                    ]
                };
            break;

            case "NN":
                subRegion = {
                    name: "Northampton",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/NN%20-%20Northampton%20Postcode%20Map.svg",
                    code: "NN",
                    districts: [
                        "NN1",
                        "NN2",
                        "NN3",
                        "NN4",
                        "NN5",
                        "NN6",
                        "NN7",
                        "NN8",
                        "NN9",
                        "NN10",
                        "NN11",
                        "NN12",
                        "NN13",
                        "NN14",
                        "NN15",
                        "NN16",
                        "NN17",
                        "NN18",
                        "NN29",
                        "NN99"
                    ]
                };
            break;

            case "WR":
                subRegion = {
                    name: "Worcester",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/WR%20Worcester%20Postcode%20Map.svg",
                    code: "WR",
                    districts: [
                        "WR1",
                        "WR2",
                        "WR3",
                        "WR4",
                        "WR5",
                        "WR6",
                        "WR7",
                        "WR8",
                        "WR9",
                        "WR10",
                        "WR11",
                        "WR12",
                        "WR13",
                        "WR14",
                        "WR15",
                        "WR78",
                        "WR99"
                    ]
                };
            break;

            case "HR":
                subRegion = {
                    name: "Hereford",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/HR%20-%20Hereford%20Postcode%20Map.svg",
                    code: "HR",
                    districts: [
                        "HR1",
                        "HR2",
                        "HR3",
                        "HR4",
                        "HR5",
                        "HR6",
                        "HR7",
                        "HR8",
                        "HR9"
                    ]
                };
            break;

            case "CV":
                subRegion = {
                    name: "Coventry",
                    imageUrl: "http://77.68.102.60:9000/west-midlands/CV%20-%20Coventry%20Postcode%20Map.svg",
                    code: "CV",
                    districts: [
                        "CV1",
                        "CV2",
                        "CV3",
                        "CV4",
                        "CV5",
                        "CV6",
                        "CV7",
                        "CV8",
                        "CV9",
                        "CV10",
                        "CV11",
                        "CV12",
                        "CV13",
                        "CV21",
                        "CV22",
                        "CV23",
                        "CV31",
                        "CV32",
                        "CV33",
                        "CV34",
                        "CV35",
                        "CV36",
                        "CV37",
                        "CV47"
                    ]
                };
            break;
        }

        let westMidlands = {
            regionName: "West Midlands",
            regionCode: "WM",
            subregion: subRegion,
            otherSubregions: otherWestMidlandRegions
        }

        tags.push(westMidlands);

        return res.json(tags);
    }

    // wales
    if(['CF', 'LD', 'LL', 'NP', 'SA', 'SY']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "CF":
                subRegion =  {
                    name: "Cardiff",
                    imageUrl: "http://77.68.102.60:9000/wales/CF%20-%20Cardiff%20Postcode%20Map.svg",
                    code: "CF",
                    districts: [
                        "CF3",
                        "CF5",
                        "CF10",
                        "CF11",
                        "CF14",
                        "CF15",
                        "CF23",
                        "CF24",
                        "CF30",
                        "CF31",
                        "CF32",
                        "CF33",
                        "CF34",
                        "CF35",
                        "CF36",
                        "CF37",
                        "CF38",
                        "CF39",
                        "CF40",
                        "CF41",
                        "CF42",
                        "CF43",
                        "CF44",
                        "CF45",
                        "CF46",
                        "CF47",
                        "CF48",
                        "CF61",
                        "CF62",
                        "CF99",
                        "CF63",
                        "CF64",
                        "CF71",
                        "CF72",
                        "CF81",
                        "CF82",
                        "CF83",
                        "CF91",
                        "CF95"
                    ]
                };
            break;

            case "LD":
                subRegion = {
                    name: "Llandrindod",
                    imageUrl: "http://77.68.102.60:9000/wales/LD%20-%20Llandrindod%20Postcode%20Map.svg",
                    code: "LD",
                    districts: [
                        "LD1",
                        "LD2",
                        "LD3",
                        "LD4",
                        "LD5",
                        "LD6",
                        "LD7",
                        "LD8"
                    ]
                };
            break;

            case "LL":
                subRegion = {
                    name: "Wrexham",
                    imageUrl: "http://77.68.102.60:9000/wales/LL%20-%20Wrexham%20Postcode%20Map.svg",
                    code: "LL",
                    districts: [
                        "LL11",
                        "LL12",
                        "LL13",
                        "LL14",
                        "LL15",
                        "LL16",
                        "LL17",
                        "LL18",
                        "LL19",
                        "LL20",
                        "LL21",
                        "LL22",
                        "LL23",
                        "LL24",
                        "LL25",
                        "LL26",
                        "LL27",
                        "LL28",
                        "LL29",
                        "LL30",
                        "LL31",
                        "LL32",
                        "LL33",
                        "LL34",
                        "LL35",
                        "LL36",
                        "LL37",
                        "LL38",
                        "LL39",
                        "LL40",
                        "LL41",
                        "LL42",
                        "LL43",
                        "LL44",
                        "LL45",
                        "LL46",
                        "LL47",
                        "LL48",
                        "LL49",
                        "LL51",
                        "LL52",
                        "LL53",
                        "LL54",
                        "LL55",
                        "LL56",
                        "LL57",
                        "LL58",
                        "LL59",
                        "LL60",
                        "LL61",
                        "LL62",
                        "LL63",
                        "LL64",
                        "LL65",
                        "LL66",
                        "LL67",
                        "LL68",
                        "LL69",
                        "LL70",
                        "LL71",
                        "LL72",
                        "LL73",
                        "LL74",
                        "LL75",
                        "LL76",
                        "LL77",
                        "LL78"
                    ]
                };
            break;

            case "NP":
                subRegion = {
                    name: "Newport",
                    imageUrl: "http://77.68.102.60:9000/wales/NP%20-%20Newport%20Postcode%20Map.svg",
                    code: "NP",
                    districts: [
                        "NP4",
                        "NP7",
                        "NP8",
                        "NP10",
                        "NP11",
                        "NP12",
                        "NP13",
                        "NP15",
                        "NP16",
                        "NP18",
                        "NP19",
                        "NP20",
                        "NP22",
                        "NP23",
                        "NP24",
                        "NP25",
                        "NP26",
                        "NP44"
                    ]
                };
            break;

            case "SA":
                subRegion =  {
                    name: "Swansea",
                    imageUrl: "http://77.68.102.60:9000/wales/SA%20-%20Swansea%20Postcode%20Map.svg",
                    code: "SA",
                    districts: [
                        "SA1",
                        "SA2",
                        "SA3",
                        "SA4",
                        "SA5",
                        "SA6",
                        "SA7",
                        "SA8",
                        "SA9",
                        "SA10",
                        "SA11",
                        "SA12",
                        "SA13",
                        "SA14",
                        "SA15",
                        "SA16",
                        "SA17",
                        "SA18",
                        "SA19",
                        "SA20",
                        "SA31",
                        "SA32",
                        "SA33",
                        "SA34",
                        "SA35",
                        "SA36",
                        "SA37",
                        "SA38",
                        "SA39",
                        "SA40",
                        "SA41",
                        "SA42",
                        "SA43",
                        "SA44",
                        "SA45",
                        "SA46",
                        "SA47",
                        "SA48",
                        "SA61",
                        "SA62",
                        "SA63",
                        "SA64",
                        "SA65",
                        "SA66",
                        "SA67",
                        "SA68",
                        "SA69",
                        "SA70",
                        "SA71",
                        "SA72",
                        "SA73",
                        "SA80",
                        "SA99"
                    ]
                };
            break;

            case "SY":
                subRegion =  {
                    name: "Shrewsbury",
                    imageUrl: "http://77.68.102.60:9000/wales/SY%20-%20Shrewsbury%20Postcode%20Map.svg",
                    code: "SY",
                    districts: [
                        "SY1",
                        "SY2",
                        "SY3",
                        "SY4",
                        "SY5",
                        "SY6",
                        "SY7",
                        "SY8",
                        "SY9",
                        "SY10",
                        "SY11",
                        "SY12",
                        "SY13",
                        "SY14",
                        "SY15",
                        "SY16",
                        "SY17",
                        "SY18",
                        "SY19",
                        "SY20",
                        "SY21",
                        "SY22",
                        "SY23",
                        "SY24",
                        "SY25"
                    ]
                };
            break;
        }

        let wales = {
            regionName: "Wales",
            regionCode: "W",
            subregion: subRegion,
            otherSubregions: otherWalesRegions
        }

        tags.push(wales);

        return res.json(tags);
    }
    
    // south west
    if(['BA', 'BH', 'BS', 'EX', 'PL', 'SP', 'TA', 'TQ', 'DT', 'SN', 'TR', 'GL']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "BA":
                subRegion =   {
                    name: "Bath",
                    imageUrl: "http://77.68.102.60:9000/south-west/BA%20-%20Bath%20Postcode%20Map.svg",
                    code: "BA",
                    districts: [
                        "BA1",
                        "BA2",
                        "BA3",
                        "BA4",
                        "BA5",
                        "BA6",
                        "BA7",
                        "BA8",
                        "BA9",
                        "BA10",
                        "BA11",
                        "BA12",
                        "BA13",
                        "BA14",
                        "BA15",
                        "BA16",
                        "BA20",
                        "BA21",
                        "BA22"
                    ]
                };
            break;

            case "BH":
                subRegion = {
                    name: "Bournemouth",
                    imageUrl: "http://77.68.102.60:9000/south-west/BH%20-%20Bournemouth%20Postcode%20Map.svg",
                    code: "BH",
                    districts: [
                        "BH1",
                        "BH2",
                        "BH3",
                        "BH4",
                        "BH5",
                        "BH6",
                        "BH7",
                        "BH8",
                        "BH9",
                        "BH10",
                        "BH11",
                        "BH12",
                        "BH13",
                        "BH14",
                        "BH15",
                        "BH16",
                        "BH17",
                        "BH18",
                        "BH19",
                        "BH20",
                        "BH21",
                        "BH22",
                        "BH23",
                        "BH24",
                        "BH25",
                        "BH31"
                    ]
                };
            break;

            case "BS":
                subRegion =  {
                    name: "Bristol",
                    imageUrl: "http://77.68.102.60:9000/south-west/BS%20-%20Bristol%20Postcode%20Map.svg",
                    code: "BS",
                    districts: [
                        "BS0",
                        "BS1",
                        "BS2",
                        "BS3",
                        "BS4",
                        "BS5",
                        "BS6",
                        "BS7",
                        "BS8",
                        "BS9",
                        "BS10",
                        "BS11",
                        "BS12",
                        "BS13",
                        "BS14",
                        "BS15",
                        "BS16",
                        "BS20",
                        "BS21",
                        "BS22",
                        "BS23",
                        "BS24",
                        "BS25",
                        "BS26",
                        "BS27",
                        "BS28",
                        "BS29",
                        "BS30",
                        "BS31",
                        "BS32",
                        "BS34",
                        "BS35",
                        "BS36",
                        "BS37",
                        "BS39",
                        "BS40",
                        "BS41",
                        "BS48",
                        "BS98",
                        "BS99"
                    ]
                };
            break;

            case "EX":
                subRegion = {
                    name: "Exeter",
                    imageUrl: "http://77.68.102.60:9000/south-west/EX%20-%20Exeter%20Postcode%20Map.svg",
                    code: "EX",
                    districts: [
                        "EX1",
                        "EX2",
                        "EX3",
                        "EX4",
                        "EX5",
                        "EX6",
                        "EX7",
                        "EX8",
                        "EX9",
                        "EX10",
                        "EX11",
                        "EX12",
                        "EX13",
                        "EX14",
                        "EX15",
                        "EX16",
                        "EX17",
                        "EX18",
                        "EX19",
                        "EX20",
                        "EX21",
                        "EX22",
                        "EX23",
                        "EX24",
                        "EX31",
                        "EX32",
                        "EX33",
                        "EX34",
                        "EX35",
                        "EX36",
                        "EX37",
                        "EX38",
                        "EX39"
                    ]
                };
            break;

            case "PL":
                subRegion =  {
                    name: "Plymouth",
                    imageUrl: "http://77.68.102.60:9000/south-west/PL%20-%20Plymouth%20Postcode%20Map.svg",
                    code: "PL",
                    districts: [
                        "PL1",
                        "PL2",
                        "PL3",
                        "PL4",
                        "PL5",
                        "PL6",
                        "PL7",
                        "PL8",
                        "PL9",
                        "PL10",
                        "PL11",
                        "PL12",
                        "PL13",
                        "PL14",
                        "PL15",
                        "PL16",
                        "PL17",
                        "PL18",
                        "PL19",
                        "PL20",
                        "PL21",
                        "PL22",
                        "PL23",
                        "PL24",
                        "PL25",
                        "PL26",
                        "PL27",
                        "PL28",
                        "PL29",
                        "PL30",
                        "PL31",
                        "PL32",
                        "PL33",
                        "PL34",
                        "PL35",
                        "PL95"
                    ]
                };
            break;

            case "SP":
                subRegion = {
                    name: "Salisbury",
                    imageUrl: "http://77.68.102.60:9000/south-west/SP%20-%20Salisbury%20Postcode%20Map.svg",
                    code: "SP",
                    districts: [
                        "SP1",
                        "SP2",
                        "SP3",
                        "SP4",
                        "SP5",
                        "SP6",
                        "SP7",
                        "SP8",
                        "SP9",
                        "SP10",
                        "SP11"
                    ]
                };
            break;

            case "TA":
                subRegion = {
                    name: "Taunton",
                    imageUrl: "http://77.68.102.60:9000/south-west/TA%20-%20Taunton%20Postcode%20Map.svg",
                    code: "TA",
                    districts: [
                        "TA1",
                        "TA2",
                        "TA3",
                        "TA4",
                        "TA5",
                        "TA6",
                        "TA7",
                        "TA8",
                        "TA9",
                        "TA10",
                        "TA11",
                        "TA12"
                    ]
                };
            break;

            case "TQ":
                subRegion = {
                    name: "Torquay",
                    imageUrl: "http://77.68.102.60:9000/south-west/TQ%20-%20Torquay%20Postcode%20Map.svg",
                    code: "TQ",
                    districts: [
                        "TQ1",
                        "TQ2",
                        "TQ3",
                        "TQ4",
                        "TQ5",
                        "TQ6",
                        "TQ7",
                        "TQ8",
                        "TQ9",
                        "TQ10",
                        "TQ11",
                        "TQ12",
                        "TQ13",
                        "TQ14"
                    ]
                }; 
            break;

            case "DT":
                subRegion = {
                    name: "Dorchester",
                    imageUrl: "",
                    code: "DT",
                    districts: [
                        "DT1",
                        "DT2",
                        "DT3",
                        "DT4",
                        "DT5",
                        "DT6",
                        "DT7",
                        "DT8",
                        "DT9",
                        "DT10",
                        "DT11"
                    ]
                };
            break;

            case "SN":
                subRegion = {
                    name: "Swindon",
                    imageUrl: "",
                    code: "SN",
                    districts: [
                        "SN1",
                        "SN2",
                        "SN3",
                        "SN4",
                        "SN5",
                        "SN6",
                        "SN7",
                        "SN8",
                        "SN9",
                        "SN10",
                        "SN11",
                        "SN12",
                        "SN13",
                        "SN14",
                        "SN15",
                        "SN16",
                        "SN25",
                        "SN26",
                        "SN38",
                        "SN99"
                    ]
                };
            break;

            case "TR":
                subRegion =  {
                    name: "Truro",
                    imageUrl: "http://77.68.102.60:9001/api/v1/buckets/south-west/objects/download?preview=true&prefix=VFIgLSBUcnVybyBQb3N0Y29kZSBNYXAgLnN2Zw==",
                    code: "TR",
                    districts: [
                        "TR1",
                        "TR2",
                        "TR3",
                        "TR4",
                        "TR5",
                        "TR6",
                        "TR7",
                        "TR8",
                        "TR9",
                        "TR10",
                        "TR11",
                        "TR12",
                        "TR13",
                        "TR14",
                        "TR15",
                        "TR16",
                        "TR17",
                        "TR18",
                        "TR19",
                        "TR20",
                        "TR21",
                        "TR22",
                        "TR23",
                        "TR24",
                        "TR25",
                        "TR26",
                        "TR27"
                    ]
                };
            break;

            case "GL":
                subRegion =  {
                    name: "Gloucester",
                    imageUrl: "http://77.68.102.60:9000/south-west/Gloucester%20GL%20south%20west.svg",
                    code: "GL",
                    districts: [
                        "TA1",
                        "TA2",
                        "TA3",
                        "TA4",
                        "TA5",
                        "TA6",
                        "TA7",
                        "TA8",
                        "TA9",
                        "TA10",
                        "TA11",
                        "TA12",
                        "TA13",
                        "TA14",
                        "TA15",
                        "TA16",
                        "TA17",
                        "TA18",
                        "TA19",
                        "TA20",
                        "TA21",
                        "TA22",
                        "TA23",
                        "TA24"
                    ]
                };
            break;
        }

        let southWest = {
            regionName: "South West",
            regionCode: "SW",
            subregion: subRegion,
            otherSubregions: otherSouthWestRegions
        }

        tags.push(southWest);

        return res.json(tags);
    }

    //south east
    if(['AL', 'BN', 'CM', 'CT', 'GU', 'HP', 'LU', 'ME', 'MK', 'OX', 'PO', 'RG', 'RH', 'SG', 'SL', 'SO', 'SS', 'TN']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "AL":
                subRegion =   {
                    name: "St Albans",
                    imageUrl: "http://77.68.102.60:9000/south-east/AL%20-%20St%20Albans%20Postcode%20Map.svg",
                    code: "AL",
                    districts: [
                        "AL1",
                        "AL2",
                        "AL3",
                        "AL4",
                        "AL5",
                        "AL6",
                        "AL7",
                        "AL8",
                        "AL9",
                        "AL10"
                    ]
                };
            break;

            case "BN":
                subRegion = {
                    name: "Brighton",
                    imageUrl: "http://77.68.102.60:9000/south-east/BN%20-%20Brighton%20Postcode%20Map.svg",
                    code: "BN",
                    districts: [
                        "BN1",
                        "BN2",
                        "BN3",
                        "BN5",
                        "BN6",
                        "BN7",
                        "BN8",
                        "BN9",
                        "BN10",
                        "BN11",
                        "BN12",
                        "BN13",
                        "BN14",
                        "BN15",
                        "BN16",
                        "BN17",
                        "BN18",
                        "BN20",
                        "BN21",
                        "BN22",
                        "BN23",
                        "BN24",
                        "BN25",
                        "BN26",
                        "BN27",
                        "BN41",
                        "BN42",
                        "BN43",
                        "BN44",
                        "BN45",
                        "BN50",
                        "BN51",
                        "BN88",
                        "BN91",
                        "BN99"
                    ]
                }
            break;
            
            case "CM":
                subRegion = {
                    name: "Chelmsford",
                    imageUrl: "http://77.68.102.60:9000/south-east/CM%20-%20Chelmsford%20Postcode%20Map.svg",
                    code: "CM",
                    districts: [
                        "CM0",
                        "CM1",
                        "CM2",
                        "CM3",
                        "CM4",
                        "CM5",
                        "CM6",
                        "CM7",
                        "CM8",
                        "CM9",
                        "CM11",
                        "CM12",
                        "CM13",
                        "CM14",
                        "CM15",
                        "CM16",
                        "CM17",
                        "CM18",
                        "CM19",
                        "CM20",
                        "CM21",
                        "CM22",
                        "CM23",
                        "CM24",
                        "CM77",
                        "CM92",
                        "CM98",
                        "CM99"
                    ]
                };
            break;

            case "CT":
                subRegion = {
                    name: "Canterbury",
                    imageUrl: "http://77.68.102.60:9000/south-east/CT%20-%20Canterbury%20Postcode%20Map.svg",
                    code: "CT",
                    districts: [
                        "CT1",
                        "CT2",
                        "CT3",
                        "CT4",
                        "CT5",
                        "CT6",
                        "CT7",
                        "CT8",
                        "CT9",
                        "CT10",
                        "CT11",
                        "CT12",
                        "CT13",
                        "CT14",
                        "CT15",
                        "CT16",
                        "CT17",
                        "CT18",
                        "CT19",
                        "CT20",
                        "CT21",
                        "CT50"
                    ]
                };
            break;

            case "GU":
                subRegion = {
                    name: "Guilford",
                    imageUrl: "http://77.68.102.60:9000/south-east/GU%20-%20Guilford%20Postcode%20Map.svg",
                    code: "GU",
                    districts: [
                        "GU1",
                        "GU2",
                        "GU3",
                        "GU4",
                        "GU5",
                        "GU6",
                        "GU7",
                        "GU8",
                        "GU9",
                        "GU10",
                        "GU11",
                        "GU12",
                        "GU14",
                        "GU15",
                        "GU16",
                        "GU17",
                        "GU18",
                        "GU19",
                        "GU20",
                        "GU21",
                        "GU22",
                        "GU23",
                        "GU24",
                        "GU25",
                        "GU26",
                        "GU27",
                        "GU28",
                        "GU29",
                        "GU30",
                        "GU31",
                        "GU32",
                        "GU33",
                        "GU34",
                        "GU35",
                        "GU46",
                        "GU47",
                        "GU51",
                        "GU52",
                        "GU95"
                    ]
                };
            break;

            case "HP":
                subRegion =  {
                    name: "Hemel",
                    imageUrl: "http://77.68.102.60:9000/south-east/HP%20-%20Hemel%20Hempstead%20%20Postcode%20Map.svg",
                    code: "HP",
                    districts: [
                        "HP1",
                        "HP2",
                        "HP3",
                        "HP4",
                        "HP5",
                        "HP6",
                        "HP7",
                        "HP8",
                        "HP9",
                        "HP10",
                        "HP11",
                        "HP12",
                        "HP13",
                        "HP14",
                        "HP15",
                        "HP16",
                        "HP17",
                        "HP18",
                        "HP19",
                        "HP20",
                        "HP21",
                        "HP22",
                        "HP23",
                        "HP27"
                    ]
                };
            break;

            case "LU":
                subRegion =  {
                    name: "Luton",
                    imageUrl: "http://77.68.102.60:9000/south-east/LU%20-%20Luton%20Postcode%20Map.svg",
                    code: "LU",
                    districts: [
                        "LU1",
                        "LU2",
                        "LU3",
                        "LU4",
                        "LU5",
                        "LU6",
                        "LU7"
                    ]
                };
            break;

            case "ME":
                subRegion = {
                    name: "Maidstone",
                    imageUrl: "http://77.68.102.60:9000/south-east/ME%20-%20Maidstone%20Postcode%20Map.svg",
                    code: "ME",
                    districts: [
                        "ME1",
                        "ME2",
                        "ME3",
                        "ME4",
                        "ME5",
                        "ME6",
                        "ME7",
                        "ME8",
                        "ME9",
                        "ME10",
                        "ME11",
                        "ME12",
                        "ME13",
                        "ME14",
                        "ME15",
                        "ME16",
                        "ME17",
                        "ME18",
                        "ME19",
                        "ME20"
                    ]
                };
            break;

            case "MK":
                subRegion = {
                    name: "Milton Keynes",
                    imageUrl: "http://77.68.102.60:9000/south-east/MK%20-%20Milton%20Keynes%20Postcode%20Map.svg",
                    code: "MK",
                    districts: [
                        "MK1",
                        "MK2",
                        "MK3",
                        "MK4",
                        "MK5",
                        "MK6",
                        "MK7",
                        "MK8",
                        "MK9",
                        "MK10",
                        "MK11",
                        "MK12",
                        "MK13",
                        "MK14",
                        "MK15",
                        "MK16",
                        "MK17",
                        "MK18",
                        "MK19",
                        "MK40",
                        "MK41",
                        "MK42",
                        "MK43",
                        "MK44",
                        "MK45",
                        "MK46",
                        "MK77"
                    ]
                };
            break;

            case "OX":
                subRegion =  {
                    name: "Oxford",
                    imageUrl: "http://77.68.102.60:9000/south-east/OX%20-%20Oxford%20Postcode%20Map.svg",
                    code: "OX",
                    districts: [
                        "OX1",
                        "OX2",
                        "OX3",
                        "OX4",
                        "OX5",
                        "OX7",
                        "OX9",
                        "OX10",
                        "OX11",
                        "OX12",
                        "OX13",
                        "OX14",
                        "OX15",
                        "OX16",
                        "OX17",
                        "OX18",
                        "OX20",
                        "OX25",
                        "OX26",
                        "OX27",
                        "OX28",
                        "OX29",
                        "OX33",
                        "OX39",
                        "OX44",
                        "OX49"
                    ]
                };
            break;

            case "PO":
                subRegion = {
                    name: "Portsmouth",
                    imageUrl: "http://77.68.102.60:9000/south-east/PO%20-%20Portsmouth%20Postcode%20Map.svg",
                    code: "PO",
                    districts: [
                        "PO1",
                        "PO2",
                        "PO3",
                        "PO4",
                        "PO5",
                        "PO6",
                        "PO7",
                        "PO8",
                        "PO9",
                        "PO10",
                        "PO11",
                        "PO12",
                        "PO13",
                        "PO14",
                        "PO15",
                        "PO16",
                        "PO17",
                        "PO18",
                        "PO19",
                        "PO20",
                        "PO21",
                        "PO22",
                        "PO30",
                        "PO31",
                        "PO32",
                        "PO33",
                        "PO34",
                        "PO35",
                        "PO36",
                        "PO37",
                        "PO38",
                        "PO39",
                        "PO40",
                        "PO41"
                    ]
                };
            break;

            case "RG":
                subRegion =  {
                    name: "Reading",
                    imageUrl: "http://77.68.102.60:9000/south-east/RG%20-%20Reading%20Postcode%20Map.svg",
                    code: "RG",
                    districts: [
                        "RG1",
                        "RG2",
                        "RG4",
                        "RG5",
                        "RG6",
                        "RG7",
                        "RG8",
                        "RG9",
                        "RG10",
                        "RG12",
                        "RG14",
                        "RG17",
                        "RG18",
                        "RG19",
                        "RG20",
                        "RG21",
                        "RG22",
                        "RG23",
                        "RG24",
                        "RG25",
                        "RG26",
                        "RG27",
                        "RG28",
                        "RG29",
                        "RG30",
                        "RG31",
                        "RG40",
                        "RG41",
                        "RG42",
                        "RG45"
                    ]
                };
            break;

            case "RH":
                subRegion =  {
                    name: "Redhill",
                    imageUrl: "http://77.68.102.60:9000/south-east/RH%20-%20Redhill%20Postcode%20Map.svg",
                    code: "RH",
                    districts: [
                        "RH1",
                        "RH2",
                        "RH3",
                        "RH4",
                        "RH5",
                        "RH6",
                        "RH7",
                        "RH8",
                        "RH9",
                        "RH10",
                        "RH11",
                        "RH12",
                        "RH13",
                        "RH14",
                        "RH15",
                        "RH16",
                        "RH17",
                        "RH18",
                        "RH19",
                        "RH20"
                    ]
                };
            break;

            case "SG":
                subRegion = {
                    name: "Stevenage",
                    imageUrl: "http://77.68.102.60:9000/south-east/SG%20-%20Stevenage%20Postcode%20Map.svg",
                    code: "SG",
                    districts: [
                        "SG1",
                        "SG2",
                        "SG3",
                        "SG4",
                        "SG5",
                        "SG6",
                        "SG7",
                        "SG8",
                        "SG9",
                        "SG10",
                        "SG11",
                        "SG12",
                        "SG13",
                        "SG14",
                        "SG15",
                        "SG16",
                        "SG17",
                        "SG18",
                        "SG19"
                    ]
                };
            break;
            
            case "SL":
                subRegion =  {
                    name: "Slough",
                    imageUrl: "http://77.68.102.60:9000/south-east/SL%20-%20Slough%20Postcode%20Map.svg",
                    code: "SL",
                    districts: [
                        "SL0",
                        "SL1",
                        "SL2",
                        "SL3",
                        "SL4",
                        "SL5",
                        "SL6",
                        "SL7",
                        "SL8",
                        "SL9",
                        "SL95"
                    ]
                };
            break;
            
            case "SO":
                subRegion =  {
                    name: "Southampton",
                    imageUrl: "http://77.68.102.60:9000/south-east/SO%20-%20Southampton%20Postcode%20Map.svg",
                    code: "SO",
                    districts: [
                        "SO14",
                        "SO15",
                        "SO16",
                        "SO17",
                        "SO18",
                        "SO19",
                        "SO20",
                        "SO21",
                        "SO22",
                        "SO23",
                        "SO24",
                        "SO30",
                        "SO31",
                        "SO32",
                        "SO32",
                        "SO40",
                        "SO41",
                        "SO42",
                        "SO43",
                        "SO45",
                        "SO50",
                        "SO51",
                        "SO52",
                        "SO53"
                    ]
                };
            break;
            
            case "SS":
                subRegion =  {
                    name: "Southend-on-Sea",
                    imageUrl: "http://77.68.102.60:9000/south-east/SS%20-%20Southend%20on%20Sea%20Postcode%20Map.svg",
                    code: "SS",
                    districts: [
                        "SS0",
                        "SS1",
                        "SS2",
                        "SS4",
                        "SS5",
                        "SS6",
                        "SS7",
                        "SS8",
                        "SS9",
                        "SS11",
                        "SS12",
                        "SS13",
                        "SS14",
                        "SS15",
                        "SS16",
                        "SS17",
                        "SS22",
                        "SS99"
                    ]
                };
            break;
            
            case "TN":
                subRegion =  {
                    name: "Tonbridge",
                    imageUrl: "http://77.68.102.60:9000/south-east/TN%20-%20Tonbridge%20Postcode%20Map.svg",
                    code: "TN",
                    districts: [
                        "TN1",
                        "TN2",
                        "TN3",
                        "TN4",
                        "TN5",
                        "TN6",
                        "TN7",
                        "TN8",
                        "TN9",
                        "TN10",
                        "TN11",
                        "TN12",
                        "TN13",
                        "TN14",
                        "TN15",
                        "TN16",
                        "TN17",
                        "TN18",
                        "TN19",
                        "TN20",
                        "TN21",
                        "TN22",
                        "TN23",
                        "TN24",
                        "TN25",
                        "TN26",
                        "TN27",
                        "TN28",
                        "TN29",
                        "TN30",
                        "TN31",
                        "TN32",
                        "TN33",
                        "TN34",
                        "TN35",
                        "TN36",
                        "TN37",
                        "TN38",
                        "TN39",
                        "TN40"
                    ]
                };
            break;
        }

        let southEast = {
            regionName: "South East",
            regionCode: "SE",
            subregion: subRegion,
            otherSubregions: otherSouthEastRegions
        }

        tags.push(southEast);

        return res.json(tags);
    }

    // greater london
    if(['DA', 'EN', 'HA', 'IG', 'RM', 'WD', 'BR', 'N', 'NW', 'SE', 'SW', 'TW', 'UB', 'W']
    .find(cod => {
        matchedCode = cod;
        return code.includes(cod);
    })){
        let subRegion = null;

        switch(matchedCode){
            case "DA":
                subRegion =  {
                    name: "Dartford",
                    imageUrl: "http://77.68.102.60:9000/greater-london/DA%20-%20Dartford%20Postcode%20Map.svg",
                    Code: "DA",
                    districts: [
                        "DA1",
                        "DA2",
                        "DA3",
                        "DA4",
                        "DA5",
                        "DA6",
                        "DA7",
                        "DA8",
                        "DA9",
                        "DA10",
                        "DA11",
                        "DA12",
                        "DA13",
                        "DA14",
                        "DA15",
                        "DA16",
                        "DA17",
                        "DA18"
                    ]
                };
            break;

            case "EN":
                subRegion = {
                    name: "Enfield",
                    imageUrl: "http://77.68.102.60:9000/greater-london/EN%20-%20Enfield%20Postcode%20Map.svg",
                    Code: "EN",
                    districts: [
                        "EN1",
                        "EN2",
                        "EN3",
                        "EN4",
                        "EN5",
                        "EN6",
                        "EN7",
                        "EN8",
                        "EN9",
                        "EN10",
                        "EN11"
                    ]
                };
            break;
            
            case "HA":
                subRegion =  {
                    name: "Harrow",
                    imageUrl: "http://77.68.102.60:9000/greater-london/HA%20-%20Harrow%20Postcode%20Map.svg",
                    Code: "HA",
                    districts: [
                        "HA0",
                        "HA1",
                        "HA2",
                        "HA3",
                        "HA4",
                        "HA5",
                        "HA6",
                        "HA7",
                        "HA8",
                        "HA9"
                    ]
                };
            break;

            case "IG":
                subRegion =  {
                    name: "Ilford",
                    imageUrl: "http://77.68.102.60:9000/greater-london/IG%20-%20Ilford%20Postcode%20Map.svg",
                    Code: "IG",
                    districts: [
                        "IG1",
                        "IG2",
                        "IG3",
                        "IG4",
                        "IG5",
                        "IG6",
                        "IG7",
                        "IG8",
                        "IG9",
                        "IG10",
                        "IG11"
                    ]
                };
            break;

            case "RM":
                subRegion =  {
                    name: "Romford",
                    imageUrl: "http://77.68.102.60:9000/greater-london/RM%20-%20Romford%20Postcode%20Map.svg",
                    Code: "RM",
                    districts: [
                        "RM1",
                        "RM2",
                        "RM3",
                        "RM4",
                        "RM5",
                        "RM6",
                        "RM7",
                        "RM8",
                        "RM9",
                        "RM10",
                        "RM11",
                        "RM12",
                        "RM13",
                        "RM14",
                        "RM15",
                        "RM16",
                        "RM17",
                        "RM18",
                        "RM19",
                        "RM20"
                    ]
                };
            break;

            case "WD":
                subRegion =  {
                    name: "Watford",
                    imageUrl: "http://77.68.102.60:9000/greater-london/WD%20-%20Watford%20Postcode%20Map.svg",
                    Code: "WD",
                    districts: [
                        "WD3",
                        "WD4",
                        "WD5",
                        "WD6",
                        "WD7",
                        "WD17",
                        "WD18",
                        "WD19",
                        "WD23",
                        "WD24",
                        "WD25"
                    ]
                };
            break;

            case "BR":
                subRegion = {
                    name: "Bromley",
                    imageUrl: "http://77.68.102.60:9000/greater-london/BR%20Bromsgrove%20Postcode%20Map.svg",
                    Code: "BR",
                    districts: [
                        "BR1",
                        "BR2",
                        "BR3",
                        "BR4",
                        "BR5",
                        "BR6",
                        "BR7",
                        "BR8"
                    ]
                };
            break;

            case "N":
                subRegion = {
                    name: "North London",
                    imageUrl: "http://77.68.102.60:9000/greater-london/N%20-%20North%20London%20Postcode%20Map.svg",
                    Code: "N",
                    districts: [
                        "N1",
                        "N1C",
                        "N1P",
                        "N2",
                        "N3",
                        "N4",
                        "N5",
                        "N6",
                        "N7",
                        "N8",
                        "N9",
                        "N10",
                        "N11",
                        "N12",
                        "N13",
                        "N14",
                        "N15",
                        "N16",
                        "N17",
                        "N18",
                        "N19",
                        "N20",
                        "N21",
                        "N22",
                        "N81"
                    ]
                };
            break;

            case "NW":
                subRegion =  {
                    name: "North West London",
                    imageUrl: "http://77.68.102.60:9000/greater-london/NW%20North%20West%20London%20Postcode%20Map.svg",
                    Code: "NW",
                    districts: [
                        "NW1",
                        "NW1W",
                        "NW2",
                        "NW3",
                        "NW4",
                        "NW5",
                        "NW6",
                        "NW7",
                        "NW8",
                        "NW9",
                        "NW10",
                        "NW11",
                        "NW26"
                    ]
                };
            break;

            case "SE":
                subRegion = {
                    name: "South East London",
                    imageUrl: "http://77.68.102.60:9000/greater-london/SE%20South%20East%20London%20Postcode%20Map.svg",
                    Code: "SE",
                    districts: [
                        "SE1",
                        "SE2",
                        "SE3",
                        "SE4",
                        "SE5",
                        "SE6",
                        "SE7",
                        "SE8",
                        "SE9",
                        "SE10",
                        "SE11",
                        "SE12",
                        "SE13",
                        "SE14",
                        "SE15",
                        "SE16",
                        "SE17",
                        "SE18",
                        "SE19",
                        "SE21",
                        "SE22",
                        "SE23",
                        "SE24",
                        "SE25",
                        "SE26",
                        "SE27",
                        "SE28"
                    ]
                };
            break;

            case "SW":
                subRegion =  {
                    name: "South West London",
                    imageUrl: "http://77.68.102.60:9000/greater-london/SW%20-%20South%20West%20London%20Postcode%20Map.svg",
                    Code: "SW",
                    districts: [
                        "SW1A",
                        "SW1E",
                        "SW1H",
                        "SW1P",
                        "SW1V",
                        "SW1W",
                        "SW1X",
                        "SW1Y",
                        "SW2",
                        "SW3",
                        "SW4",
                        "SW5",
                        "SW6",
                        "SW7",
                        "SW8",
                        "SW9",
                        "SW10",
                        "SW11",
                        "SW12",
                        "SW13",
                        "SW14",
                        "SW15",
                        "SW16",
                        "SW17",
                        "SW18",
                        "SW19",
                        "SW20",
                        "SW95"
                    ]
                };
            break;

            case "TW":
                subRegion = {
                    name: "Twickenham",
                    imageUrl: "http://77.68.102.60:9000/greater-london/TW%20-%20Twickenham%20Postcode%20Map.svg",
                    Code: "TW",
                    districts: [
                        "TW1",
                        "TW2",
                        "TW3",
                        "TW4",
                        "TW5",
                        "TW6",
                        "TW7",
                        "TW8",
                        "TW9",
                        "TW10",
                        "TW11",
                        "TW12",
                        "TW13",
                        "TW14",
                        "TW15",
                        "TW16",
                        "TW17",
                        "TW18",
                        "TW19",
                        "TW20"
                    ]
                };
            break;

            case "UB":
                subRegion =  {
                    name: "Southall London",
                    imageUrl: "http://77.68.102.60:9000/greater-london/UB%20-%20Southall%20Postcode%20Map.svg",
                    Code: "UB",
                    districts: [
                        "UB1",
                        "UB2",
                        "UB3",
                        "UB4",
                        "UB5",
                        "UB6",
                        "UB7",
                        "UB8",
                        "UB9",
                        "UB10",
                        "UB11",
                        "UB18"
                    ]
                };
            break;

            case "W":
                subRegion = {
                    name: "West London",
                    imageUrl: "http://77.68.102.60:9000/greater-london/W%20-%20West%20London%20Postcode%20Map.svg",
                    Code: "W",
                    districts: [
                        "W1A",
                        "W1B",
                        "W1C",
                        "W1D",
                        "W1F",
                        "W1G",
                        "W1H",
                        "W1J",
                        "W1K",
                        "W1S",
                        "W1T",
                        "W1U",
                        "W1W",
                        "W2",
                        "W3",
                        "W4",
                        "W5",
                        "W6",
                        "W7",
                        "W8",
                        "W9",
                        "W10",
                        "W11",
                        "W12",
                        "W13",
                        "W14"
                    ]
                };
            break;
        }

        let greaterLondon = {
            regionName: "Greater London",
            regionCode: "GL",
            subregion: subRegion,
            otherSubregions: otherGreaterLondonRegions
        }

        tags.push(greaterLondon);

        return res.json(tags);
    }

    res.json(tags);
});


router.get("/getServiceBoundary/:identityId", (req, res) => {
    let identityId = req.params.identityId;

    if(!identityId) return res.json({ status: "error", message: "Please enter the identityId of the user in the body"});

    // get the identity details
    let endpoint1 = `:4434/identities/${identityId}`;
    let options1 =  {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	}
    util.sendRequest(consts.ROOT + endpoint1, options1)
    .then(json => {
        res.json(json);
    }).catch(err => {
        console.error(err);
    });
});

router.delete("/deleteServiceBoundary/:userId", (req, res) => {
    res.json({ status: "success", message: "Service boundary successfully deleted"});
});

router.patch("/updateServiceBoundary", (req, res) => {
    let identityId = req.body.identityId;
    let serviceBoundaryToUpdate = req.body.serviceBoundary;

    if(!identityId) return res.json({ status: "error", message: "Please enter the identityId of the user in the body"});
    if(!serviceBoundaryToUpdate) return res.json({ status: "error", message: "Please enter the service boundary in the body. Eg - NA SC SC10, NA, NA W"});

    // get the identity details
    let endpoint1 = `:4434/identities/${identityId}`;
    let options1 =  {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	}
    util.sendRequest(consts.ROOT + endpoint1, options1)
    .then(json => {
        let schema_id = json.schema_id;
        let state = json.state;
        let email = json.traits.email;
        let firstName = json.traits.name.first;
        let lastName = json.traits.name.last;
        let serviceBoundary = serviceBoundaryToUpdate;

        let body = {
            schema_id: schema_id,
            state: state,
            traits: {
                email: email,
                name: {
                    first: firstName,
                    last: lastName
                },
                serviceBoundary: serviceBoundary
            }
        };

        let endpoint2 = `:4434/identities/${identityId}`;
        let options2 =  {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        util.sendRequest(consts.ROOT + endpoint2, options2)
        .then(json1 => {
            res.json(json1);
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
});

router.post("/addServiceBoundary", (req, res) => {
    let identityId = req.body.identityId;
    let userType = req.body.userType;
    let serviceBoundaryToAdd = req.body.serviceBoundary;

    if(!identityId) return res.json({ status: "error", message: "Please enter the identityId of the user in the body"});
    if(!userType) return res.json({ status: "error", message: "Please specify the user type"});
    if(!serviceBoundaryToAdd) return res.json({ status: "error", message: "Please enter the service boundary in the body. Eg - NA SC SC10, NA, NA W"});

    // get the identity details
    let endpoint1 = `:4434/identities/${identityId}`;
    let options1 =  {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	};
    util.sendRequest(consts.ROOT + endpoint1, options1)
    .then(json => {
        let schema_id = json.schema_id;
        let state = json.state;
        let email = json.traits.email;
        let firstName = json.traits.name.first;
        let lastName = json.traits.name.last;
        let serviceBoundary = json.traits.serviceBoundary + `,${serviceBoundaryToAdd}`;

        let body = {
            schema_id: schema_id,
            state: state,
            traits: {
                email: email,
                name: {
                    first: firstName,
                    last: lastName
                },
                serviceBoundary: serviceBoundary
            }
        };

        let endpoint2 = `:4434/identities/${identityId}`;
        let options2 =  {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        util.sendRequest(consts.ROOT + endpoint2, options2)
        .then(json1 => {
            let user = {
                identityId: identityId,
                userType: userType,
                serviceBoundary: serviceBoundary
            };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.cookie(consts.COOKIE_ID, accessToken, { maxAge: 1000 * 60 * 60 * 24 * 31, httpOnly: true });
            res.json({ status: "success" });
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
});



// integrate with postgres

// service_boundary_regions
router.get("/getServiceBoundaryRegions", (req, res) => {
    pgQueries.getServiceBoundaryRegions(res, returnResult);
});

router.post("/createServiceBoundaryRegion", (req, res) => {
    let name = req.body.name ? req.body.name : "";
    let code = req.body.code ? req.body.code : "";

    let data = {
        name: name,
        code: code
    };

    pgQueries.createServiceBoundaryRegion(res, data, returnResult);
});

router.patch("/updateServiceBoundaryRegion/:id", (req, res) => {
    let id = req.params.id;
    let name = req.body.name ? req.body.name : "";
    let code = req.body.code ? req.body.code : "";

    let data = {
        id: id,
        name: name,
        code: code
    };

    pgQueries.updateServiceBoundaryRegion(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Service boundary region updated" });
    });
});

router.delete("/deleteServiceBoundaryRegion/:id", (req, res) => {


    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteServiceBoundaryRegion(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Service boundary region deleted successfully" });
    });
});


// service_boundary_subregions
router.get("/getServiceBoundarySubRegions", (req, res) => {
    pgQueries.getServiceBoundarySubRegions(res_, returnResult);
});

router.post("/createServiceBoundarySubRegion", (req, res) => {
    let region_id = req.body.region_id ? req.body.region_id : null;
    let name = req.body.name ? req.body.name : "";
    let image_url = req.body.image_url ? req.body.image_url : "";
    let code = req.body.code ? req.body.code : "";

    if(region_id == null) return res.json({ status: "error", message: "Please specify the region_id" });

    let data = {
        region_id: region_id,
        name: name,
        image_url: image_url,
        code: code
    };

    pgQueries.createServiceBoundarySubRegion(res, data, returnResult);
});

router.patch("/updateServiceBoundarySubRegion/:id", (req, res) => {
    let id = req.params.id;
    let region_id = req.body.region_id ? req.body.region_id : null;
    let name = req.body.name ? req.body.name : "";
    let image_url = req.body.image_url ? req.body.image_url : "";
    let code = req.body.code ? req.body.code : "";

    if(region_id == null) return res.json({ status: "error", message: "Please specify the region_id" });

    let data = {
        id: id,
        region_id: region_id,
        name: name,
        image_url: image_url,
        code: code
    };

    pgQueries.updateServiceBoundarySubRegion(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Service boundary sub region updated" });
    });
});

router.delete("/deleteServiceBoundarySubRegion/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteServiceBoundarySubRegion(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Service boundary sub region deleted successfully" });
    });
});



// service_boundary_subregion_codes
router.get("/getServiceBoundarySubRegionCodes", (req, res) => {
    pgQueries.getServiceBoundarySubRegionCodes(res, returnResult);
});

router.post("/createServiceBoundarySubRegionCode", (req, res) => {
    let region_id = req.body.region_id ? req.body.region_id : null;
    let subregion_id = req.body.subregion_id ? req.body.subregion_id : null;
    let code = req.body.code ? req.body.code : "";

    if(region_id == null) return res.json({ status: "error", message: "Please specify the region_id" });

    let data = {
        region_id: region_id,
        subregion_id: subregion_id,
        code: code
    };

    pgQueries.createServiceBoundarySubRegionCode(res, data, returnResult);
});

router.patch("/updateServiceBoundarySubRegionCode/:id", (req, res) => {
    let id = req.params.id;
    let region_id = req.body.region_id ? req.body.region_id : null;
    let subregion_id = req.body.subregion_id ? req.body.subregion_id : null;
    let code = req.body.code ? req.body.code : "";

    if(region_id == null) return res.json({ status: "error", message: "Please specify the region_id" });

    let data = {
        id: id,
        region_id: region_id,
        subregion_id: subregion_id,
        code: code
    };

    pgQueries.updateServiceBoundarySubRegionCode(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Service boundary subregion code updated" });
    });
});

router.delete("/deleteServiceBoundarySubRegionCode/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteServiceBoundarySubRegionCode(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Service boundary sub region code deleted successfully" });
    });
});

module.exports = router;