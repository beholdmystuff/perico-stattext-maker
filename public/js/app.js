/* CAYO PERICO HEIST SETUP DATA */
/* RESOURCES TO GENERATE STAT.TXT FROM */
let cayo =
{
    primary:
    [
        { name: "Minimadrazzo Files", price: 1100000, value: 4, className: "lootFiles" },
        { name: "Sinsimito Tequilla", price: 900000, value: 0, className: "lootTequilla" },
        { name: "Ruby Necklace", price: 1000000, value: 1, className: "lootNecklace" },
        { name: "Bearer Bonds", price: 1100000, value: 2, className: "lootBonds" },
        { name: "Pink Diamond", price: 1300000, value: 3, className: "lootDiamond" },
        { name: "Panther Statue", price: 1900000, value: 5, className: "lootPanther" }
    ],
    secondary:
    [
        { name: "Cash", size: 0.25, variable: "CASH" },
        { name: "Painting",  size: 0.5, variable: "PAINT"},
        { name: "Weed",  size: 0.3333333, variable: "WEED" },
        { name: "Coke",  size: 0.5, variable: "COKE" },
        { name: "Gold",  size: 0.6666666, variable: "GOLD" }
    ],
    npcCutPercentage: 12,
    hardModeMultiplier: 1.1,
    defaultCutLimit: 2550000,
    normalModeTakeLimit: 6662960,
    hardModeTakeLimit: 10818212,
    officeSafeMax: 120000
}

/* USER SET SETTINGS */
/* CREATE CURRENT STAT.TXT FROM THIS */
let settings =
{
    primary: 1, //cayo.primary.loot array id
    difficulty: "normal", //cayo.difficulty
    vehicleValue: 0,
    takeOfficeSafe: true,
    missionsBinary: 1+1024+2048+512, // gather intel + mandatory cutter + cloner + torch
    pois: 16384+65536, //power station + control tower
    compoundCash: 0,
    compoundCoke: 0,
    compoundGold: 0,
    compoundWeed: 0,
    compoundPainting: 0,
    islandCash: 0,
    islandCoke: 0,
    islandGold: 0,
    islandWeed: 0,
    defaultLootPrice: false
};

/* FUNCTIONALITY */

/* TOGGLES HARD MODE ON DIV CLICK */
function toggleHardMode(event)
{
    let button = event.target;

    /* recognize button state to decide what difficulty to write
       and which price to use */
    let primaryValue = document.querySelector("#primaryValue");
    if (button.className == "hardOff")
    {
        button.className = "hardOn";
        settings.difficulty = "hard";
        takeLimit.value = cayo.hardModeTakeLimit;
        formatTakeLimit(takeLimit);

        if (Number.isInteger(settings.primary.price))
            primaryValue.value = (settings.primary.price * cayo.hardModeMultiplier).toLocaleString()
    }
    else
    {
        button.className = "hardOff";
        settings.difficulty = "normal";
        takeLimit.value = cayo.normalModeTakeLimit;
        formatTakeLimit(takeLimit);

        if (Number.isInteger(settings.primary.price))
            primaryValue.value = (settings.primary.price).toLocaleString()
    }

    calculateTake();
}
document.querySelector("#hardModeButton").addEventListener("click", toggleHardMode); //hard mode button click event

function toggleDefaultMoney(event)
{
    let target = event.target;
    if (target.classList.contains("usingOriginalPrices"))
    {
        target.classList.remove("usingOriginalPrices");
        target.classList.add("usingCustomPrices");
        settings.defaultLootPrice = false;
        target.textContent = "Use Default Prices";

        // show custom price elements
        document.querySelector("#playerCutContainer").classList.remove("hidden");
        document.querySelector("#moneyLimits").classList.remove("hidden");
        document.querySelector("#takeCategory").classList.remove("hidden");

    }
    else
    {
        target.classList.remove("usingCustomPrices");
        target.classList.add("usingOriginalPrices");
        settings.defaultLootPrice = true;
        target.textContent = "Use Custom Prices";

        // remove custom price elements
        document.querySelector("#playerCutContainer").classList.add("hidden");
        document.querySelector("#moneyLimits").classList.add("hidden");
        document.querySelector("#takeCategory").classList.add("hidden");
    }
}
document.querySelector("#defaultLootPlacement").addEventListener("click", toggleDefaultMoney);

/* display loot selector */
function showLootSelector()
{
    document.querySelector("#lootSelector").classList.toggle("hidden");
}
document.querySelector("#lootFrame").addEventListener("click", showLootSelector); //loot selector button click event

/* select primary loot from selector */

function selectPrimaryLoot(lootName)
{
    let lootPic = document.querySelector("#lootPic");
    let lootNameElement = document.querySelector("#lootName");
    let primaryName = document.querySelector("#primaryName");
    let primaryValue = document.querySelector("#primaryValue");

    if (lootName == "Game's Pick")
    {
        settings.primary = "default";

        lootPic.className = "lootDefault";
        lootNameElement.textContent = "Game's Pick";
        primaryName.textContent = "Game's Pick";
        primaryValue.value = "Unknown";
    }
    else
    {
        /* find by name because lazy */
        cayo.primary.forEach(function(loot)
        {
            if (loot.name == lootName)
                settings.primary = loot;
        });

        /* set loot display */
        lootPic.className = settings.primary.className;
        lootNameElement.textContent = settings.primary.name;
        primaryName.textContent = settings.primary.name;
        primaryValue.value = (settings.difficulty == "normal") ? settings.primary.price.toLocaleString() : (settings.primary.price * cayo.hardModeMultiplier).toLocaleString();
    }

    calculateTake();
}
function selectPrimary(event)
{
    selectPrimaryLoot(event.target.title);
}
document.querySelectorAll(".lootObject").forEach(function(lootElement) //for each loot card add select function
{
    lootElement.addEventListener("click", selectPrimary);
});

// select tequilla by default
selectPrimaryLoot("Sinsimito Tequilla");

/* open category on click */
function expandSettingsContainer(event)
{
    document.querySelector("#setupCategories").className = "hidden";
    document.querySelector("#" + event.target.id.replace("Category", "Container")).classList.remove("hidden");
}
document.querySelectorAll("#setupCategories .setupCategory").forEach(function(setupCategory)
{
    setupCategory.addEventListener("click", expandSettingsContainer);
});

/* make escape key close, hide, cancel or go back */
function escapeKey(event)
{
    /* hide beautiful and helpful overlay */
    let overlay = document.querySelector("#overlay");
    if (!overlay.classList.contains("hidden"))
        closeOverlay(overlay); //passing element to closeElement function, I know, yuck

    /* hide stattext display */
    let textViewer = document.querySelector(".statTextViewer");
    if (!textViewer.classList.contains("hidden"))
        hideTextViewer(textViewer);

    /* hide loot selector */
    let lootSelector = document.querySelector("#lootSelector");
    if (lootSelector.className != "hidden")
        lootSelector.className = "hidden";

    /* go back with heist settings*/
    let setupCategories = document.querySelector("#setupCategories");
    if (setupCategories.className == "hidden")
    {
        //find setupcategory which is not hidden
        document.querySelectorAll(".setupCategoryContainer").forEach(function(category)
        {
            if (!category.classList.contains("hidden"))
            {
                //hide that shit and restore categories visibilty
                category.classList.add("hidden");
                setupCategories.classList.remove("hidden");
            }
        });
    }
}

/* TOGGLE COMPOUND MAP */
let togglingCompoundMap = false;
function spaceKey(event)
{
    if (togglingCompoundMap)
        return;

    var container = document.querySelector("#compoundSettings");

    if(document.querySelector("#overlay").classList.contains("hidden"))
    {
        togglingCompoundMap = true;
        if (container.classList.contains("compoundExpanded"))
        {
            container.classList.remove("compoundExpanded");
            container.classList.add("compoundHidden");
            setTimeout(function()
            {
                let container = document.querySelector("#compoundSettings")
                container.classList.remove("compoundHidden");
                container.classList.add("compoundContracted");
                setTimeout(function(){togglingCompoundMap = false;}, 500);
            }, 500);
        }
        else
        {
            container.classList.add("compoundExpanded");
            container.classList.remove("compoundContracted");
            setTimeout(function(){togglingCompoundMap = false;}, 1000);
        };
    }
}
document.querySelector("#mapButton").addEventListener("click", spaceKey);

function keyPressed(event)
{
    /* quit execution if non escape key is pressed */
    switch (event.keyCode)
    {
        case 27:
        escapeKey(event);
        break;

        case 32:
        spaceKey(event);
        break;

        case 189:
        keyZoom(-1);
        break;

        case 187:
        keyZoom(1);
        break;

        case 109:
        keyZoom(-1);
        break;

        case 107:
        keyZoom(1);
        break;
    }
}
document.addEventListener("keydown", keyPressed); //set da event

//wheel zoom
let scale = 1;
function zoom(factor)
{
    console.log(event);
    document.body.style.transform = "scale(" + factor + ")";
}

function wheelZoom(event)
{
    if (!event.shiftKey)
        return;

    scale += (event.deltaY * -0.001);
    zoom(scale);
}

function keyZoom(delta)
{
    scale += (delta * 0.01);
    zoom(scale);
}
document.addEventListener("wheel", wheelZoom); //set da event


/* back button function on click */
function goBack()
{
    document.querySelectorAll(".setupCategoryContainer").forEach(function(category)
    {
        if (!category.classList.contains("hidden"))
            category.classList.add("hidden");
    });

    document.querySelector("#setupCategories").classList.remove("hidden");
}
document.querySelectorAll(".backButton").forEach(function(button)
{
    button.addEventListener("click", goBack);
});

/* unlock vehicles */
function toggleVehicle(event)
{
    let bit = parseInt(event.target.getAttribute("bit"));

    var checkbox = event.target.querySelector(".checkbox");
    if (checkbox.classList.contains("checked"))
    {
        checkbox.classList.remove("checked");
        settings.missionsBinary -= 1 << bit; //remove the vehicle bit first

        // i did it single line but holy shit it was bad to read
        if (bit == 2 || bit == 4) //if alkonost or stealth annihilator are clicked on
        {
            if ((settings.missionsBinary & 1 << 2) == 0 // if alkonost
            && (settings.missionsBinary & 1 << 4) == 0) // and annihilator bits are no longer set
            {
                if ((settings.missionsBinary & 1 << 7) != 0) // but pilot bit is set
                    settings.missionsBinary -= 1 << 7;
            }
        }
    }
    else
    {
        checkbox.classList.add("checked");

        if (bit == 2 || bit == 4) // if alkonost or annihilator are clicked on
        {
            if ((settings.missionsBinary & 1 << 2) == 0 // if alkonost
            && (settings.missionsBinary & 1 << 4) == 0) // and annihilator
            {
                if ((settings.missionsBinary & 1 << 7) == 0) // and pilot are not set
                    settings.missionsBinary += 1 << 7; //set pilot bit and force kill all ifs
            }
        }

        settings.missionsBinary += 1 << bit; //then set vehicle bit
    }
}
document.querySelectorAll("#approachVehiclesContainer .setupCategory").forEach(function(vehicleElement)
{
    vehicleElement.addEventListener("click", toggleVehicle);
});

/* unlock equipment */
/* select weapon */
function selectWeapon(event)
{
    settings.weaponID = parseInt(event.target.getAttribute("int"));

    let checkbox = event.target.querySelector(".checkbox");
    if (checkbox.classList.contains("checked"))
    {
        event.target.querySelector(".checkbox").classList.remove("checked");
        settings.missionsBinary -= 1 << 12;
    }
    else
    {
        document.querySelectorAll("#weaponContainer .setupCategory:not(#weaponSuppressors)").forEach(function(weapon)
        {
            if (weapon.querySelector(".checkbox").classList.contains("checked"))
            {
                weapon.querySelector(".checkbox").classList.remove("checked");
                settings.missionsBinary -= 1 << 12; //either substract the bit or use additional if below. I chose math.
            }
        });

        event.target.querySelector(".checkbox").classList.add("checked");
        settings.missionsBinary += 1 << 12;
    }
}
document.querySelectorAll("#weaponContainer .setupCategory:not(#weaponSuppressors)").forEach(function(weapon)
{
    weapon.addEventListener("click", selectWeapon);
});

function selectSuppressors(event)
{
    let bit = parseInt(event.target.getAttribute("bit"));
    let checkbox = event.target.querySelector(".checkbox");
    if (checkbox.classList.contains("checked"))
    {
        checkbox.classList.remove("checked");
        settings.pois -= 1 << parseInt(event.target.getAttribute("bit"));
    }
    else
    {
        checkbox.classList.add("checked");
        settings.pois += 1 << parseInt(event.target.getAttribute("bit"));
    }
}
document.querySelector("#weaponSuppressors").addEventListener("click", selectSuppressors);

/* mark disruptions */
function markDisruption(event)
{
    let bit = event.target.getAttribute("bit");
    if (event.target.querySelector(".checkbox").classList.contains("checked"))
    {
        delete settings[event.target.id.replace("disruption", "").toLowerCase() + "Disruption"];
        event.target.querySelector(".checkbox").classList.remove("checked");

        if (event.target.id != "disruptionPoison") // disruptionPoison has different variable bit
            settings.missionsBinary -= 1 << parseInt(bit);
        else //diarrhea powder is in points of interest variable, yes
            settings.pois -= 1 << parseInt(bit);

    }
    else
    {
        settings[event.target.id.replace("disruption", "").toLowerCase() + "Disruption"] = 3;
        event.target.querySelector(".checkbox").classList.add("checked");

        if (event.target.id != "disruptionPoison")
            settings.missionsBinary += 1 << parseInt(bit);
        else
            settings.pois += 1 << parseInt(bit);
    }
    // console.log(event.target.id);
}
document.querySelectorAll("#disruptionContainer .setupCategory").forEach(function(disruption)
{
    disruption.addEventListener("click", markDisruption);
});

/* select equipment */
function markEquipment(event)
{
    let bit = event.target.getAttribute("bit");

    if (event.target.querySelector(".checkbox").classList.contains("checked"))
    {
        delete settings[event.target.id.replace("equipment", "").toLowerCase() + "Equipment"];
        event.target.querySelector(".checkbox").classList.remove("checked");

        if (bit)
            settings.missionsBinary -= 1 << parseInt(bit);
    }
    else
    {
        settings[event.target.id.replace("equipment", "").toLowerCase() + "Equipment"] = true;
        event.target.querySelector(".checkbox").classList.add("checked");

        if (bit)
            settings.missionsBinary += 1 << parseInt(bit);
    }
}
document.querySelectorAll("#equipmentContainer .setupCategory").forEach(function(equip)
{
    equip.addEventListener("click", markEquipment);
});

/* mark island loot */
function markIslandLoot(event)
{
    if (event.target.querySelector(".checkbox").classList.contains("checked"))
    {
        event.target.querySelector(".checkbox").classList.remove("checked");
        delete settings.islandLoot;
    }
    else
    {
        settings.islandLoot = event.target.id.replace("islandLoot", "").toLowerCase();
        document.querySelectorAll("#islandLootContainer .setupCategory").forEach(function(islandLoot)
        {
            islandLoot.querySelector(".checkbox").classList.remove("checked");
        });
        event.target.querySelector(".checkbox").classList.add("checked");
    }
}
document.querySelectorAll("#islandLootContainer .setupCategory").forEach(function(islandLoot)
{
    islandLoot.addEventListener("click", markIslandLoot);
});

/* mark compound loot */
function markCompoundLoot(event)
{
    if (event.target.querySelector(".checkbox").classList.contains("checked"))
    {
        event.target.querySelector(".checkbox").classList.remove("checked");

        if (event.target.id == "compoundLootPainting") //painting is a special case
            delete settings.painting;
        else
            delete settings.compoundLoot;
    }
    else
    {
        if (event.target.id != "compoundLootPainting") //painting is a special case
        {
            settings.compoundLoot = event.target.id.replace("compoundLoot", "").toLowerCase();
            document.querySelectorAll("#compoundLootContainer .setupCategory:not(#compoundLootPainting)").forEach(function(compoundLoot)
            {
                compoundLoot.querySelector(".checkbox").classList.remove("checked");
            });
        }
        else
        {
            settings.painting = true;
        }
        event.target.querySelector(".checkbox").classList.add("checked");
    }
}
document.querySelectorAll("#compoundLootContainer .setupCategory").forEach(function(compoundLoot)
{
    compoundLoot.addEventListener("click", markCompoundLoot);
});


/* GENERAL SECONDARY LOOT FUNCTIONS */
//convert pixel to vx
//to display secondary setter next to mouse cursor
function convertPXToVW(px)
{
    return px * (100 / document.documentElement.clientWidth);
}
function convertPXToVH(px)
{
    return px * (100 / document.documentElement.clientHeight);
}

/* WARNING: THERE WILL BE UGLY COPY/PASTE JOB */

/* ISLAND MAP SECONDARY LOOT */
//close secondary selector at various occasions
function closeIslandSecondarySelector()
{
    document.querySelector("#islandSelectorOverlay").classList.add("hidden");
    let selector = document.querySelector("#islandSecondaryLootSelector");
    selector.removeAttribute("bit");
    selector.classList.add("hidden");
}

/* clear secondary spot */
function clearIslandSecondary(location, bit)
{
    if (location.classList.contains("contentCash"))
        settings.islandCash -= 1 << bit;
    else if (location.classList.contains("contentCoke"))
        settings.islandCoke -= 1 << bit;
    else if (location.classList.contains("contentGold"))
        settings.islandGold -= 1 << bit;
    else if (location.classList.contains("contentWeed"))
        settings.islandWeed -= 1 << bit;

    location.className = "lootSpot";
}

//select compound secondary loot from selector
function selectIslandSecondary(event)
{
    let target = event.target;

    let selector = document.querySelector("#islandSecondaryLootSelector");
    let bit = parseInt(selector.getAttribute("bit"));
    let locationID = selector.getAttribute("location");
    let location = document.querySelector("#" + locationID);

    clearIslandSecondary(location, bit);

    let loot = target.querySelector("span").textContent.toLowerCase();

    if (loot == "cash")
    {
        settings.islandCash += 1 << bit;
        location.classList.add("contentCash");
    }
    else if (loot == "coke")
    {
        settings.islandCoke += 1 << bit;
        location.classList.add("contentCoke");
    }
    else if (loot == "gold")
    {
        settings.islandGold += 1 << bit;
        location.classList.add("contentGold");
    }
    else if (loot == "weed")
    {
        settings.islandWeed += 1 << bit;
        location.classList.add("contentWeed");
    }

    closeIslandSecondarySelector();
}
document.querySelectorAll("#islandSecondaryLootSelector .lootOption").forEach(function(option)
{
    option.addEventListener("click", selectIslandSecondary);
});

//compound secondary loot selector
function openIslandSecondarySelector(event)
{
    let target = event.target;

    let selector = document.querySelector("#islandSecondaryLootSelector");
    let top = (convertPXToVH(event.clientY) + 1);
    selector.style.top = top + "vh";
    selector.style.left = (convertPXToVW(event.clientX) + 1) + "vw";

    selector.classList.remove("hidden");
    let height = convertPXToVH(selector.offsetHeight);

    if ((100 - top) < height)
        selector.style.top = 100 - height + "vh";

    document.querySelector("#islandSelectorOverlay").classList.remove("hidden");

    let bit = target.getAttribute("bit");
    selector.setAttribute("bit", bit);

    let location = target.id;
    selector.setAttribute("location", location);
}
document.querySelectorAll("#mainSettings .lootSpot").forEach(function(lootSpot)
{
    lootSpot.addEventListener("click", openIslandSecondarySelector);
});
document.querySelector("#islandSelectorOverlay").addEventListener("click", closeIslandSecondarySelector);

/* COMPOUND MAP SECONDARY LOOT */
//close secondary selector at various occasions
function closeCompoundSecondarySelector()
{
    document.querySelector("#compoundSelectorOverlay").classList.add("hidden");
    let selector = document.querySelector("#compoundSecondaryLootSelector");
    selector.removeAttribute("bit");
    selector.classList.add("hidden");
}

/* clear secondary spot */
function clearCompoundSecondary(location, bit)
{
    if (location.classList.contains("contentCash"))
        settings.compoundCash -= 1 << bit;
    else if (location.classList.contains("contentCoke"))
        settings.compoundCoke -= 1 << bit;
    else if (location.classList.contains("contentGold"))
        settings.compoundGold -= 1 << bit;
    else if (location.classList.contains("contentWeed"))
        settings.compoundWeed -= 1 << bit;

    location.className = "lootSpot";
}

//select compound secondary loot from selector
function selectCompoundSecondary(event)
{
    let target = event.target;

    let selector = document.querySelector("#compoundSecondaryLootSelector");
    let bit = parseInt(selector.getAttribute("bit"));
    let locationID = selector.getAttribute("location");
    let location = document.querySelector("#" + locationID);

    clearCompoundSecondary(location, bit);

    let loot = target.querySelector("span").textContent.toLowerCase();

    if (loot == "cash")
    {
        settings.compoundCash += 1 << bit;
        location.classList.add("contentCash");
    }
    else if (loot == "coke")
    {
        settings.compoundCoke += 1 << bit;
        location.classList.add("contentCoke");
    }
    else if (loot == "gold")
    {
        settings.compoundGold += 1 << bit;
        location.classList.add("contentGold");
    }
    else if (loot == "weed")
    {
        settings.compoundWeed += 1 << bit;
        location.classList.add("contentWeed");
    }

    closeCompoundSecondarySelector();
}
document.querySelectorAll("#compoundSecondaryLootSelector .lootOption").forEach(function(option)
{
    option.addEventListener("click", selectCompoundSecondary);
});

//compound secondary loot selector
function openCompoundSecondarySelector(event)
{
    let target = event.target;

    let selector = document.querySelector("#compoundSecondaryLootSelector");
    let top = (convertPXToVH(event.clientY) + 1);
    selector.style.top = top + "vh";
    selector.style.left = (convertPXToVW(event.clientX) + 1) + "vw";

    selector.classList.remove("hidden");
    let height = convertPXToVH(selector.offsetHeight);

    if ((100 - top) < height)
        selector.style.top = 100 - height + "vh";
    document.querySelector("#compoundSelectorOverlay").classList.remove("hidden");

    let bit = target.getAttribute("bit");
    selector.setAttribute("bit", bit);

    let location = target.id;
    selector.setAttribute("location", location);
}
document.querySelectorAll("#compoundSettings .lootSpot").forEach(function(lootSpot)
{
    lootSpot.addEventListener("click", openCompoundSecondarySelector);
});

document.querySelector("#compoundSelectorOverlay").addEventListener("click", closeCompoundSecondarySelector);


/* SELECT PAINTING SPOTS */
function togglePaintingLocation(event)
{
    let target = event.target;
    let bit = parseInt(target.getAttribute("bit"));
    if (target.classList.contains("paintingOn"))
    {
        target.classList.remove("paintingOn");
        settings.compoundPainting -= 1 << bit;
    }
    else
    {
        target.classList.add("paintingOn");
        settings.compoundPainting += 1 << bit;
    }
}
document.querySelectorAll(".paintingSpot").forEach(function(spot)
{
    spot.addEventListener("click", togglePaintingLocation);
});

/* CALCULATE LOOT VALUES */

/* reverses percentage from current value and known percentage */
function reversePercentage(value, percent)
{
    if (percent == 100)
        return value;

    return (value * 100) / (100 - percent);
}
function reversePercentage2(value, percent)
{
    return (value / percent) * 100;
}

function getLootSize(loot)
{
    let size;
    cayo.secondary.forEach(function(type)
    {
        if (type.name.toLowerCase() == loot)
            size = type.size;
    });

    return size;
}
// different loot value for both normal and hard
function calculateCashValue(bagLoad)
{
    settings.cashValue = Math.floor(bagLoad * getLootSize("cash"));
}
function calculateCokeValue(bagLoad)
{
    settings.cokeValue = Math.floor(bagLoad * getLootSize("coke"));
}
function calculateGoldValue(bagLoad)
{
    settings.goldValue = Math.floor(bagLoad * getLootSize("gold"));
}
function calculatePaintingValue(bagLoad)
{
    settings.paintingValue = Math.floor(bagLoad * getLootSize("painting"));
}
function calculateWeedValue(bagLoad)
{
    settings.weedValue = Math.floor(bagLoad * getLootSize("weed"));
}


function calculateTopPlayerTake()
{
    //get top player take
    let topTakePlayerID = 0; //do i need this?
    let takeValue = 0;
    document.querySelectorAll("#takeContainer .setupCategory.playerTake:not(.hidden) input").forEach(function(input)
    {
        let percentageValue = parseInt(input.value);
        if (percentageValue > takeValue)
        {
            takeValue = percentageValue;
            topTakePlayerID = parseInt(input.getAttribute("playerid"));
        }
    });

    return takeValue;
}

function calculateTake()
{
    let topPlayerTake = calculateTopPlayerTake();

    //calculate full take based on highest percentage
    let fullTake = Math.floor(reversePercentage(settings.cutLimit, 100 - topPlayerTake));

    if (fullTake > settings.takeLimit)
        fullTake = settings.takeLimit;

    //add pavel cut for total money
    let score = Math.floor(reversePercentage(fullTake, cayo.npcCutPercentage));

    // calculate primary price if hard mode is on or minimadrazzo files are selected(no fencing fee)
    let primaryPrice = 0;
    if (settings.primary) //i did it with shorthand if at first but was very ugly and i didn't like to look at it
    {
        if (settings.difficulty == "hard")
            primaryPrice = Math.floor(settings.primary.price * cayo.hardModeMultiplier);
        else
            primaryPrice = settings.primary.price;

        if (settings.takeOfficeSafe)
            primaryPrice += cayo.officeSafeMax;

        // i assumed that minimadrazzo files == no fencing fee, but apparently it's not true
        // if (settings.primary.value == 4)
        //     score = Math.floor(reversePercentage(fullTake, 2));
    }

    // let primaryMinusPavel = Math.floor((primaryPrice * ((100 - cayo.npcCutPercentage) * 0.01)));
    let scoreMinusPrimary = Math.floor(score - primaryPrice);
    // let scoreMinusPrimary = Math.floor(reversePercentage(Math.floor(fullTake - primaryPrice), cayo.npcCutPercentage));

    let playerCount = parseInt(document.querySelector("#teamsize .teamSize").value);
    let singleBagLoad = scoreMinusPrimary / playerCount;

    //reduce by max office value
    // let safeMax = Math.ceil(reversePercentage((settings.takeOfficeSafe ? (cayo.officeSafeMax / playerCount) : 0), cayo.npcCutPercentage));
    // singleBagLoad -= safeMax;

    if (singleBagLoad) //might be undefined when no primary selected, we don't want 'undefined' in settings
    {
        if ((settings.compoundCash > 0 || settings.islandCash > 0) && !settings.defaultLootPrice)
            calculateCashValue(singleBagLoad);

        if ((settings.compoundCoke > 0 || settings.islandCoke > 0) && !settings.defaultLootPrice)
            calculateCokeValue(singleBagLoad);

        if ((settings.compoundGold > 0 || settings.islandGold > 0) && !settings.defaultLootPrice)
            calculateGoldValue(singleBagLoad);

        if (settings.compoundPainting > 0 && !settings.defaultLootPrice)
            calculatePaintingValue(singleBagLoad);

        if ((settings.compoundWeed > 0 || settings.islandWeed > 0) && !settings.defaultLootPrice)
            calculateWeedValue(singleBagLoad);
    }

    let playerMonies = document.querySelectorAll(".playerMoney");
    let takeContainers = document.querySelectorAll("#takeContainer .setupCategory.playerTake:not(.hidden)");
    let numContainers = takeContainers.length;

    for (var i = 0, l = 4; i < l; i++)
    {
        let playerMoni = playerMonies[i];
        let playerName = playerMoni.querySelector("span:first-child");
        let moniValue = playerMoni.querySelector("span:last-child");

        let takeContainer = takeContainers[i];

        if (i < numContainers)
        {
            let name = takeContainer.querySelector("span");
            let percentage = parseInt(takeContainer.querySelector("input").value);
            playerName.textContent = name.textContent;
            moniValue.textContent = formatNumber(Math.floor(fullTake * (percentage * 0.01)).toString()).string;
        }
        else
        {
            playerName.textContent = "";
            moniValue.textContent = "";
        }
    }

    document.querySelector("#totalCut").textContent = formatNumber(fullTake.toString()).string;

    // //don't want to need this anymore but i might
    // console.log("single bag load", singleBagLoad);
    // // console.log("rubios office safe max", safeMax);
    // console.log("max take", settings.cutLimit || cayo.defaultCutLimit);
    // console.log("top player take", topPlayerTake);
    // console.log("full take", fullTake);
    // console.log("score", score);
    // console.log("primary price", primaryPrice);
    // // console.log("primary minus pavel", primaryMinusPavel);
    // console.log("score minus primary", scoreMinusPrimary);
    // console.log("gold value", settings.goldValue);
    // console.log("painting value", settings.paintingValue);
}

/* set team size*/
function teamSizeChange(event)
{
    let playerTakeElements = document.querySelectorAll("#takeContainer .setupCategory.playerTake");
    let maxTeamSize = playerTakeElements.length;
    settings.teamSize = parseInt(event.target.value);

    for (var currentPlayer = 1; currentPlayer < maxTeamSize; currentPlayer++)
    {
        if (currentPlayer < settings.teamSize)
        {
            let currentPlayerElement = playerTakeElements[currentPlayer];
            currentPlayerElement.classList.remove("hidden");
            currentPlayerElement.querySelector(".playerCut").value = 15;
        }
        else
        {
            playerTakeElements[currentPlayer].classList.add("hidden");
        }
    }

    playerTakeElements[0].querySelector(".playerCut").value = 100 - ((settings.teamSize - 1) * 15);

    calculateTake();
}
document.querySelector("#teamsize input").addEventListener("input", teamSizeChange);

/* player take % */
function updatePlayerTake(event)
{
    let sum = 0;
    let sumOthers = 0;
    document.querySelectorAll("#takeContainer .setupCategory.playerTake:not(.hidden) input").forEach(function(input)
    {
        let value = parseInt(input.value);
        if (event.target != input)
            sumOthers += value;
        sum += value;
    });

    if (sum >= 100)
    {
        event.target.value = 100 - sumOthers;
    }

    calculateTake();
}
document.querySelectorAll("#takeContainer .setupCategory.playerTake input").forEach(function(input)
{
    input.addEventListener("input", updatePlayerTake);
});

function formatNumber(input)
{
    let number = input.replace(/[\D\s\._\-]+/g, "");
    number = number ? parseInt(number, 10) : 0;
    return {"string" : number.toLocaleString(), "int" : number};
}

/* team mate cut limit */
function formatCutLimit(element)
{
    let number = formatNumber(element.value);
    element.value = number.string;
    settings.cutLimit = number.int;
}
function updateCutLimit(event)
{
    formatCutLimit(event.target);
    calculateTake();
}
let cutLimit = document.querySelector("#cutLimit");
cutLimit.addEventListener("input", updateCutLimit);
cutLimit.value = cayo.defaultCutLimit;
formatCutLimit(cutLimit);

/* total take hard limit */
function formatTakeLimit(element)
{
    let number = formatNumber(element.value);
    element.value = number.string;
    settings.takeLimit = number.int;
}
function updateTakeLimit(event)
{
    formatTakeLimit(event.target);
    calculateTake();
}
let takeLimit = document.querySelector("#takeLimit");
takeLimit.addEventListener("input", updateTakeLimit);
takeLimit.value = cayo.normalModeTakeLimit;
formatTakeLimit(takeLimit);

/* beware of copy-paste monster*/
/* select supply truck location */
function selectSupplyTruckLocation(event)
{
    let target = event.target;

    settings.supplyTruckLocation = parseInt(target.id.replace("truck", ""));

    if (target.classList.contains("truckOn")) //disable truck selection
    {
        settings.pois -= 1 << 15;
        delete settings.supplyTruckLocation;
        target.classList.remove("truckOn");
    }
    else
    {
        let isTruckSelected = false;
        document.querySelectorAll(".truckIcon").forEach(function(truckElement)
        {
            if (truckElement.classList.contains("truckOn"))
                isTruckSelected = true;
            truckElement.classList.remove("truckOn");
        });

        //do not add bit if truck is already selected
        //cause you're just switching places of already enabled truck
        if (!isTruckSelected)
            settings.pois += 1 << 15;

        target.classList.add("truckOn");
    }
}
document.querySelectorAll(".truckIcon").forEach(function(truckElement)
{
    truckElement.addEventListener("click", selectSupplyTruckLocation);
});

//generic mark function
function markMyPOIsBoys(event, type)
{
    let target = event.target;
    let bit = parseInt(event.target.getAttribute("bit"));

    if (target.classList.contains(type + "On")) //disable truck selection
    {
        settings.pois -= 1 << bit;
        target.classList.remove(type + "On");
    }
    else
    {
        settings.pois += 1 << bit;
        target.classList.add(type + "On");
    }
}
//select grappling hook locations
function selectGrapplingHookLocation(event)
{
    markMyPOIsBoys(event, "hook");
}
document.querySelectorAll(".hookIcon").forEach(function(hookElement)
{
    hookElement.addEventListener("click", selectGrapplingHookLocation);
});
//select guard clothes locations
function selectGuardClothesLocation(event)
{
    markMyPOIsBoys(event, "clothes");
}
document.querySelectorAll(".clothesIcon").forEach(function(clothesElement)
{
    clothesElement.addEventListener("click", selectGuardClothesLocation);
});
//select bolt cutters location
function selectBoltCuttersLocation(event)
{
    markMyPOIsBoys(event, "cutters");
}
document.querySelectorAll(".cuttersIcon").forEach(function(cuttersElement)
{
    cuttersElement.addEventListener("click", selectBoltCuttersLocation);
});

/* edit primary value */
function formatPrimaryPrice(element)
{
    let number = formatNumber(element.value);
    element.value = number.string;
    if (settings.difficulty == "hard")
        settings.primary.price = Math.floor(number.int / cayo.hardModeMultiplier);
    else
        settings.primary.price = number.int;
}
function updatePrimaryPrive(event)
{
    formatPrimaryPrice(event.target);
    calculateTake();
}
document.querySelector("#primaryValue").addEventListener("input", updatePrimaryPrive);

function toggleOfficeSafe(event)
{
    let target = event.target;
    if (target.textContent == "☑")
    {
        target.textContent = "☐";
        delete settings.takeOfficeSafe;
    }
    else
    {
        target.textContent = "☑";
        settings.takeOfficeSafe = true;
    }
    calculateTake();
}
document.querySelector("#elRubioSafe").addEventListener("click", toggleOfficeSafe);

/* generate stat.txt string */
function generateStattext()
{
    var s = ["INT32"];

    /* $MPx_H4CNF_BS_GEN
    grappling hooks
    (bits are left shift value)
    int 1, bit 0 https://i.imgur.com/i9PpBqb.jpeg
    int 2, bit 1 https://i.imgur.com/XnTJNZ0.jpeg
    int 4, bit 2 https://i.imgur.com/mD1CnIH.jpg
    int 8, bit 3 https://i.imgur.com/DIRqJeO.jpeg

    guard clothes
    int 16, bit 4 https://i.imgur.com/TOToYmD.jpg
    int 32, bit 5 https://i.imgur.com/F5QICaa.jpg
    int 64, bit 6 https://i.imgur.com/o7ybn3e.jpeg
    int 128, bit 7 https://i.imgur.com/TnmehzB.jpeg

    bolt cutters
    int 256, bit 8 https://i.imgur.com/vp2dZ8h.jpg
    int 512, bit 9 https://i.imgur.com/uDVoRVY.jpg
    int 1024, bit 10 https://i.imgur.com/nRQUIAb.jpg
    int 2048, bit 11 https://i.imgur.com/quloOFA.jpg

    suppressors
    int 4096, bit 12

    cutting powder
    int 8192, bit 13

    power station
    int 16384, bit 14 https://i.imgur.com/BwTegxb.jpg

    supply truck
    int 32768, bit 15 https://i.imgur.com/vScO6P8.jpg

    control tower
    int 65536, bit 16 https://i.imgur.com/XZ6WiHV.jpg
    */

    s.push("$MPx_H4CNF_BS_GEN");
    s.push(settings.pois);

    // s.push("$MPx_H4CNF_BS_ENTR"); //TODO binary values for each entry point
    // s.push("63");

    // s.push("$MPx_H4CNF_BS_ABIL"); //TODO binary values for each support option
    // s.push("63");

    if (settings.weaponID)
    {
        s.push("$MPx_H4CNF_WEAPONS");
        s.push(settings.weaponID.toString());
    }

    if (settings.weaponsDisruption) //weapon disruption, full power (int 3)
    {
        s.push("$MPx_H4CNF_WEP_DISRP");
        s.push(settings.weaponsDisruption.toString());
    }

    if (settings.armorDisruption) //armor disruption
    {
        s.push("$MPx_H4CNF_ARM_DISRP");
        s.push(settings.armorDisruption.toString());
    }

    if (settings.airsupportDisruption) //air support disruption
    {
        s.push("$MPx_H4CNF_HEL_DISRP");
        s.push(settings.airsupportDisruption.toString());
    }

    if (settings.primary && settings.primary != "default") //primary loot
    {
        s.push("$MPx_H4CNF_TARGET");
        s.push(settings.primary.value.toString());
    }

    if ((settings.pois & 9) != 0 || (settings.pois & 10) != 0 || (settings.pois & 11) != 0 || (settings.pois & 12) != 0) //mark bolt cutter locations
    {
        s.push("$MPx_H4CNF_BOLTCUT");
        s.push("4424");
    }

    if ((settings.pois & 5) != 0 || (settings.pois & 6) != 0 || (settings.pois & 7) != 0 || (settings.pois & 8) != 0) //mark uniform locations
    {
        s.push("$MPx_H4CNF_UNIFORM");
        s.push("5256");
    }

    if ((settings.pois & 1) != 0 || (settings.pois & 2) != 0 || (settings.pois & 3) != 0 || (settings.pois & 4) != 0) //mark hook locations
    {
        s.push("$MPx_H4CNF_GRAPPEL");
        s.push("5156");
    }

    if (settings.supplyTruckLocation) //select truck location
    {
        s.push("$MPx_H4CNF_TROJAN");
        s.push(settings.supplyTruckLocation.toString());
    }

    //unlock all approaches i think
    // s.push("$MPx_H4CNF_APPROACH");
    // s.push("-1");

    /* COMPOUND BITS
    blank map https://i.imgur.com/IVqpjU3.jpg

    secondary loot
    int 1, bin 0, north a https://i.imgur.com/zANJYuc.jpg
    int 2, bin 1, north b https://i.imgur.com/hnKHMbi.jpeg
    int 4, bin 2, central a https://i.imgur.com/Q01PQfz.jpg
    int 8, bin 3, central b https://i.imgur.com/4nYIRQ3.jpg
    int 16, bin 4, south a https://i.imgur.com/p081Qi6.jpeg
    int 32, bin 5, south b https://i.imgur.com/B6l1wwj.jpg
    int 64, bin 6, basement a https://i.imgur.com/RqN3oUG.jpg
    int 128, bin 7, basement b https://i.imgur.com/dfzSX6o.jpg

    painting
    int 1, bin 0, north https://i.imgur.com/IIHw0t9.jpeg
    int 2, bin 1, central https://i.imgur.com/kxM1IX2.jpg
    int 3, bin 2, south https://i.imgur.com/eGCAnx6.jpg
    int 4, bin 3, office a https://i.imgur.com/8iYo4y5.jpg
    int 5, bin 4, office b https://i.imgur.com/UPMedAW.jpeg
    int 6, bin 5, basement a https://i.imgur.com/Lg06n2R.jpg
    int 7, bin 6, basement b https://i.imgur.com/Qdbk18Y.jpg
    */


    /* ISLAND BITS
    ref https://i.imgur.com/ccAahxj.jpg
    hangar
    int 1, bin 0, https://i.imgur.com/jPs2gQs.jpg
    int 2, bin 1, https://i.imgur.com/nKRx1lp.jpeg
    int 4, bin 2, https://i.imgur.com/e2qPz3q.jpeg
    int 8, bin 3, https://i.imgur.com/mFkJmLm.jpeg

    airstrip
    int 16, bin 4 https://i.imgur.com/iFkXVzB.jpeg
    int 32, bin 5, https://i.imgur.com/huQWq9L.jpeg

    north dock
    int 64, bin 6, https://i.imgur.com/JTWhO37.jpeg
    int 128, bin 7, https://i.imgur.com/gSgPWzL.jpg

    int 256, bin 8, https://i.imgur.com/jqzNjhY.jpg
    int 512, bin 9, https://i.imgur.com/HMKaDGd.jpeg
    int 1024, bin 10 https://i.imgur.com/i5aVuuR.jpg

    int 2048, bin 11 https://i.imgur.com/Wwadzhm.jpeg
    int 4096, bin 12 https://i.imgur.com/UkHrpkP.jpeg

    weed farm
    int 8192, bin 13 https://i.imgur.com/zgfeofw.jpg
    int 16384, bin 14 https://i.imgur.com/c3wgI6J.jpeg

    central shed
    int 32768, bin 15, https://i.imgur.com/RDTQruY.jpeg
    int 65536, bin 16, https://i.imgur.com/fX08CoH.jpeg

    main dock east shed
    int 131072, bin 17, https://i.imgur.com/jys5OaO.jpg
    int 262144, bin 18, https://i.imgur.com/uiIYmOS.jpg

    main dock large shed
    524288, bin 19, https://i.imgur.com/L8NW8QC.jpg
    1048576, bin 20, https://i.imgur.com/AoCoRQ0.jpeg
    2097152, bin 21, https://i.imgur.com/qGcwBvn.jpg

    main dock west shed
    4194304, bin 22, https://i.imgur.com/ivsNPQH.jpg
    8388608, bin 23, https://i.imgur.com/9sqxEql.jpg
    */

    /* SECONDARY LOOT LOCATIONS AND SCOPES */

    //CASH
    s.push("$MPx_H4LOOT_CASH_I");
    s.push(settings.islandCash.toString());
    s.push("$MPx_H4LOOT_CASH_I_SCOPED");
    s.push(settings.islandCash.toString());
    s.push("$MPx_H4LOOT_CASH_C");
    s.push(settings.compoundCash.toString());
    s.push("$MPx_H4LOOT_CASH_C_SCOPED");
    s.push(settings.compoundCash.toString());

    //COKE
    s.push("$MPx_H4LOOT_COKE_I");
    s.push(settings.islandCoke.toString());
    s.push("$MPx_H4LOOT_COKE_I_SCOPED");
    s.push(settings.islandCoke.toString());
    s.push("$MPx_H4LOOT_COKE_C");
    s.push(settings.compoundCoke.toString());
    s.push("$MPx_H4LOOT_COKE_C_SCOPED");
    s.push(settings.compoundCoke.toString());

    //GOLD
    s.push("$MPx_H4LOOT_GOLD_I");
    s.push(settings.islandGold.toString());
    s.push("$MPx_H4LOOT_GOLD_I_SCOPED");
    s.push(settings.islandGold.toString());
    s.push("$MPx_H4LOOT_GOLD_C");
    s.push(settings.compoundGold.toString());
    s.push("$MPx_H4LOOT_GOLD_C_SCOPED");
    s.push(settings.compoundGold.toString());

    //WEED
    s.push("$MPx_H4LOOT_WEED_I");
    s.push(settings.islandWeed.toString());
    s.push("$MPx_H4LOOT_WEED_I_SCOPED");
    s.push(settings.islandWeed.toString());
    s.push("$MPx_H4LOOT_WEED_C");
    s.push(settings.compoundWeed.toString());
    s.push("$MPx_H4LOOT_WEED_C_SCOPED");
    s.push(settings.compoundWeed.toString());

    //PAINTING
    s.push("$MPx_H4LOOT_PAINT");
    s.push(settings.compoundPainting.toString());
    s.push("$MPx_H4LOOT_PAINT_SCOPED");
    s.push(settings.compoundPainting.toString());

    //set cash value
    if (settings.defaultLootPrice == false)
    {

        if (settings.cashValue)
        {
            s.push("$MPx_H4LOOT_CASH_V");
            s.push(settings.cashValue.toString());
        }

        //set coke value
        if (settings.cokeValue)
        {
            s.push("$MPx_H4LOOT_COKE_V");
            s.push(settings.cokeValue.toString());
        }

        //set gold value
        if (settings.goldValue)
        {
            s.push("$MPx_H4LOOT_GOLD_V");
            s.push(settings.goldValue.toString());
        }

        //set painting value
        if (settings.paintingValue)
        {
            s.push("$MPx_H4LOOT_PAINT_V");
            s.push(settings.paintingValue.toString());
        }

        //set painting value
        if (settings.weedValue)
        {
            s.push("$MPx_H4LOOT_WEED_V");
            s.push(settings.weedValue.toString());
        }
    }

    //set difficulty
    s.push("$MPx_H4_PROGRESS");
    if (settings.difficulty == "hard")
        s.push("131055");
    else
        s.push("124271");

    //no idea what this does, can guess by the name though
    s.push("$MPx_H4_MISSIONS");
    s.push(settings.missionsBinary.toString());

    if (settings.missionsBinary > 65535)
        console.error("Mission Binary ridiculously high:", settings.missionsBinary)

    // s.push("$MPx_H4_PLAYTHROUGH_STATUS");
    // s.push("40000");

    return s.join("\n");
}

function downloadTxt()
{
    calculateTake();

    //create data blob
    var blob = new Blob([generateStattext()], {type: 'text/csv'});

    //download data blob
    if (window.navigator.msSaveOrOpenBlob) //with api
    {
        window.navigator.msSaveBlob(blob, "stat.txt");
    }
    else //without api
    {
        var element = window.document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = "stat.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

function copyToClipboard()
{
    calculateTake();

    //create invisible textarea to copy
    var textArea = document.createElement("textarea");
    textArea.className = "invisibleTextarea";
    textArea.value = generateStattext();
    document.body.appendChild(textArea);

    //copy
    textArea.focus();
    textArea.select();
    document.execCommand('copy')

    //remove witness
    document.body.removeChild(textArea);
}
/* do something with stat.txt buttons */
function fadeDatShiet(element)
{
    element.classList.add("appear");
    element.classList.remove("fadeOut");
    setTimeout(function(element){element.classList.add("appear");}, 0, element);
    setTimeout(function(element)
    {
        element.classList.add("fadeOut");
        element.classList.remove("appear");
    }, 0, element);
}

function copyButton(event)
{
    copyToClipboard();
    let button = document.querySelector("#copyButton");
    fadeDatShiet(button);
}
document.querySelector("#copyButton").addEventListener("click", copyButton);

function downloadButton(event)
{
    downloadTxt();
    let button = document.querySelector("#downloadButton");
    fadeDatShiet(button);
}
document.querySelector("#downloadButton").addEventListener("click", downloadButton);

function hideTextViewer()
{
    document.querySelector(".statTextViewer").classList.add("hidden");
    document.querySelector(".textViewOverlay").classList.add("hidden");
}
document.querySelector(".textViewOverlay").addEventListener("click", hideTextViewer);

// handle display button
function displayButton(event)
{
    calculateTake();

    let viewerOverlay = document.querySelector(".textViewOverlay");
    let viewer = document.querySelector(".statTextViewer");
    viewer.textContent = generateStattext();

    viewerOverlay.classList.remove("hidden");
    viewer.classList.remove("hidden");
}
document.querySelector("#displayButton").addEventListener("click", displayButton);

/* close overlay on click */
function closeOverlay(element)
{
    element.style.opacity = "0";
    document.querySelector("#overlayClickZone").removeEventListener("click", closeOverlay);
    try
    {
        setTimeout(function() { element.classList.add("hidden") }, 500);
    } catch {}
}
function clickOverlay(event)
{
    closeOverlay(event.target.parentNode);
}
document.querySelector("#overlayClickZone").addEventListener("click", clickOverlay);