const sidebar = document.querySelector('.sidebar');
const shopSections = sidebar.querySelector('.shop-sections');
const shop = sidebar.querySelector('.shop');

let checkedItems = [];

let shopItems = {
    trees: {
        whiteOak: {
            name: "White Oak",
            description: "A sturdy autumn tree that provides decent wood.",
            baseCost: {
                whiteOak: 3,
            },
            cost: {
                whiteOak: 3,
            },
            image: "images/trees/whiteOak/tree.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 0
            },
            multiplier: 1,
            show: true,
            showCondition: null,
            max: null
        },
        sugarMaple: {
            name: "Sugar Maple",
            description: "A sweet maple that gives a little more wood.",
            baseCost: {
                whiteOak: 10,
            },
            cost: {
                whiteOak: 10,
            },
            image: "images/trees/sugarMaple/tree.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 5
            },
            multiplier: 1.25,
            show: false,
            showCondition: () => { return wood.whiteOak > 0; },
            max: null
        },
        cherryBirch: {
            name: "Cherry Birch",
            description: "A beautiful birch tree with stronger wood.",
            baseCost: {
                whiteOak: 30,
                sugarMaple: 20,
            },
            cost: {
                whiteOak: 30,
                sugarMaple: 20,
            },
            image: "images/trees/cherryBirch/tree.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 20,
                sugarMaple: 10
            },
            multiplier: 1.5,
            show: false,
            showCondition: () => { return wood.sugarMaple > 0; },
            max: null
        },
        blackWalnut: {
            name: "Black Walnut",
            description: "A rare walnut tree with the finest wood in the land.",
            baseCost: {
                whiteOak: 50,
                sugarMaple: 30,
                cherryBirch: 20,
            },
            cost: {
                whiteOak: 50,
                sugarMaple: 30,
                cherryBirch: 20,
            },
            image: "images/trees/blackWalnut/tree.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 30,
                sugarMaple: 20,
                cherryBirch: 10
            },
            multiplier: 2,
            show: false,
            showCondition: () => { return wood.cherryBirch > 0; },
            max: null
        },
    },
    upgrades: {
        maxClicks: {
            name: "Wood Per Tree",
            description: "Increases the amount of wood gained per tree.",
            baseCost: {
                whiteOak: 10,
            },
            cost: {
                whiteOak: 10,
            },
            image: "images/shop/upgrades/maxClicks.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 5
            },
            show: false,
            showCondition: () => { return wood.whiteOak > 0; },
            current: () => { return treeUpgrades.maxClicks + " Wood"; },
            max: null
        },
        regrowSpeed: {
            name: "Tree Grow Speed",
            description: "Decreases the time it takes for trees to grow.",
            baseCost: {
                whiteOak: 10,
            },
            cost: {
                whiteOak: 10,
            },
            image: "images/shop/upgrades/regrowSpeed.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 25
            },
            show: false,
            showCondition: () => { return wood.whiteOak > 0; },
            current: () => { return treeUpgrades.regrowSpeed/1000 + " Seconds"; },
            max: 10
        },
        fallSpeed: {
            name: "Tree Fall Speed",
            description: "Decreases the time it takes for trees to fall when chopped.",
            baseCost: {
                whiteOak: 10,
            },
            cost: {
                whiteOak: 10,
            },
            image: "images/shop/upgrades/fallSpeed.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 25
            },
            show: false,
            showCondition: () => { return wood.whiteOak > 0; },
            current: () => { return treeUpgrades.fallSpeed/1000 + " Seconds"; },
            max: 10
        },
        autoClick: {
            name: "Auto Chopper",
            description: "Automatically chops trees for you.",
            baseCost: {
                sugarMaple: 25,
            },
            cost: {
                sugarMaple: 25,
            },
            image: "images/shop/upgrades/autoClick.png",
            timesBought: 0,
            costIncreaseRate: {
                sugarMaple: 0
            },
            show: false,
            showCondition: () => { return wood.sugarMaple > 0; },
            max: 1
        },
        shakeDelay: {
            name: "Auto Chopper Speed",
            description: "Decreases the delay between automatic chops.",
            baseCost: {
                sugarMaple: 10,
            },
            cost: {
                sugarMaple: 10,
            },
            image: "images/shop/upgrades/shakeDelay.png",
            timesBought: 0,
            costIncreaseRate: {
                sugarMaple: 30
            },
            show: false,
            showCondition: () => { return shopItems.upgrades.autoClick.timesBought > 0; },
            current: () => { return treeUpgrades.shakeDelay/1000 + " Seconds"; },
            max: 10
        },
        regrows: {
            name: "Tree Regrows",
            description: "Allows trees to regrow after being chopped down.",
            baseCost: {
                sugarMaple: 50,
                cherryBirch: 0,
            },
            cost: {
                sugarMaple: 50,
                cherryBirch: 0,
            },
            image: "images/shop/upgrades/regrows.png",
            timesBought: 0,
            costIncreaseRate: {
                sugarMaple: 30,
                cherryBirch: 10
            },
            show: false,
            showCondition: () => { return wood.sugarMaple > 0 },
            current: () => { return treeUpgrades.regrows + " Regrow" + shopItems.upgrades.regrows.timesBought > 1 ? "s" : ""; },
            max: 10
        },
        woodPerClick: {
            name: "Wood Per Chop",
            description: "Increases the number of wood per chop of a tree.",
            baseCost: {
                whiteOak: 30,
                sugarMaple: 20,
                cherryBirch: 10,
            },
            cost: {
                whiteOak: 30,
                sugarMaple: 20,
                cherryBirch: 10,
            },
            image: "images/shop/upgrades/woodPerClick.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 15,
                sugarMaple: 10,
                cherryBirch: 5,
            },
            show: false,
            showCondition: () => { return wood.cherryBirch > 0 },
            current: () => { return treeUpgrades.woodPerClick + " Wood"; },
            max: null
        },
        /*autoBuy: {
            name: "Auto Buyer",
            description: "Allows automatic purchasing of shop items.",
            baseCost: {
                whiteOak: 750,
                sugarMaple: 500,
                cherryBirch: 250,
                blackWalnut: 100,
            },
            cost: {
                whiteOak: 750,
                sugarMaple: 500,
                cherryBirch: 250,
                blackWalnut: 100,
            },
            image: "images/shop/upgrades/autoBuy.png",
            timesBought: 0,
            costIncreaseRate: {
                whiteOak: 0,
                sugarMaple: 0,
                cherryBirch: 0,
                blackWalnut: 0,
            },
            show: false,
            showCondition: () => { return wood.blackWalnut > 0 },
            max: 1
        },*/
    }
}

function populateShop() {
    const treeSection = shop.querySelector('.shop-trees .shop-items');
    const upgradesSection = shop.querySelector('.shop-upgrades .shop-items');

    treeSection.innerHTML = '';
    upgradesSection.innerHTML = '';

    for (const [key, item] of Object.entries(shopItems.trees)) {
        if (item.show == false) continue;

        const itemElement = document.createElement('button');
        itemElement.classList.add('shop-item');
        itemElement.dataset.item = key;
        itemElement.innerHTML = `
            ${treeUpgrades.autoBuy ? (checkedItems && checkedItems.includes(key) ? `<input type="checkbox" checked class="shop-item-select" data-item="${key}">` : `<input type="checkbox" class="shop-item-select" data-item="${key}">`) : ''}
            <img class="shop-item-image" src="${item.image}">
            <div class="shop-item-info">
                <div class="shop-item-name">
                    ${item.name}
                </div>
                <div class="shop-item-description">
                    ${item.description}
                </div>
                <div class="shop-item-stats">
                    <div>Times Bought: ${item.timesBought}</div>
                    <div>Multiplier: x${item.multiplier}</div>
                </div>
                <div class="shop-item-cost">
                    ${Object.entries(item.cost).map(([resource, amount]) => {
                        if (amount <= 0) return '';
                        return `<div class="wood-cost ${resource}">${amount} <img class="shop-item-wood-icon" src="images/trees/${resource}/wood.png"></div>`;
                    }).join('')}
                </div>
            </div>
        `;

        itemElement.addEventListener('click', () => {
            buyShopItem(key);
        });

        const checkboxUp = itemElement.querySelector('.shop-item-select');
        if (checkboxUp) {
            checkboxUp.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            checkboxUp.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemKey = checkboxUp.dataset.item;
                if (checkboxUp.checked) {
                    if (!checkedItems.includes(itemKey)) checkedItems.push(itemKey);
                } else {
                    const idx = checkedItems.indexOf(itemKey);
                    if (idx !== -1) checkedItems.splice(idx, 1);
                }
            });
        }

        treeSection.appendChild(itemElement);
    }

    for (const [key, item] of Object.entries(shopItems.upgrades)) {
        if (item.show == false) continue;
        const itemElement = document.createElement('button');
        itemElement.classList.add('shop-item');
        itemElement.dataset.item = key;
        itemElement.innerHTML = `
            ${treeUpgrades.autoBuy ? (checkedItems && checkedItems.includes(key) ? `<input type="checkbox" checked class="shop-item-select" data-item="${key}">` : `<input type="checkbox" class="shop-item-select" data-item="${key}">`) : ''}
            <img class="shop-item-image" src="${item.image}">
            <div class="shop-item-info">
                <div class="shop-item-name">
                    ${item.name}
                </div>
                <div class="shop-item-description">
                    ${item.description}
                </div>
                <div class="shop-item-stats">
                    ${item.max && item.max == 1 ? (item.timesBought == item.max ? `<div>Purchased</div>` : `<div>Not Purchased</div>`) : `<div>Times Bought: ${item.timesBought} ${item.max && item.timesBought == item.max ? "(max)" : ""}</div>`}
                    ${item.current ? `<div>Current: ${item.current()}</div>` : ""}
                </div>
                <div class="shop-item-cost">
                    ${Object.entries(item.cost).map(([resource, amount]) => {
                        if (amount <= 0) return '';
                        return `<div class="wood-cost ${resource}">${amount} <img class="shop-item-wood-icon" src="images/trees/${resource}/wood.png"></div>`;
                    }).join('')}
                </div>
            </div>
        `;

        if (item.max && item.timesBought == item.max) {
            itemElement.classList.add('bought');
        } else {
            itemElement.addEventListener('click', () => {
                buyShopItem(key);
            });
        }

        const checkboxUp = itemElement.querySelector('.shop-item-select');
        if (checkboxUp) {
            checkboxUp.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            checkboxUp.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemKey = checkboxUp.dataset.item;
                if (checkboxUp.checked) {
                    if (!checkedItems.includes(itemKey)) checkedItems.push(itemKey);
                } else {
                    const idx = checkedItems.indexOf(itemKey);
                    if (idx !== -1) checkedItems.splice(idx, 1);
                }
            });
        }

        upgradesSection.appendChild(itemElement);
    }
}

updateShopSection('shop-trees');

shopSections.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        shopSections.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        updateShopSection(button.dataset.section);
    });
});

function updateShopSection(section) {
    shop.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    shop.querySelector(`.${section}`).style.display = 'flex';
}

function buyShopItem(itemKey, force=false) {
    const item = shopItems.trees[itemKey] || shopItems.upgrades[itemKey];
    if (!item) return;
    let canAfford = true;

    for (const resource in item.cost) {
        if (wood[resource] < item.cost[resource]) {
            canAfford = false;
        }
    }

    if (force) canAfford = true;

    if (!canAfford) return;

    item.timesBought++;

    for (const resource in item.cost) {
        if (!force) wood[resource] -= item.cost[resource];
        updateWoodDisplay(resource);
        item.cost[resource] = Math.floor(item.baseCost[resource] + (item.timesBought  * item.costIncreaseRate[resource]));
    }

    if (shopItems.trees[itemKey]) {
        createTree(itemKey);
    }

    if (shopItems.upgrades[itemKey]) {
        if (itemKey === "maxClicks") {
            treeUpgrades.maxClicks += 1;
        }
        if (itemKey === "regrowSpeed") {
            treeUpgrades.regrowSpeed -= 250;
        }
        if (itemKey === "fallSpeed") {
            treeUpgrades.fallSpeed -= 150;
        }
        if (itemKey === "autoClick") {
            treeUpgrades.autoClick = true;
        }
        if (itemKey === "shakeDelay") {
            treeUpgrades.shakeDelay -= 50;
        }
        if (itemKey === "regrows") {
            treeUpgrades.regrows += 1;
        }
        if (itemKey === "woodPerClick") {
            treeUpgrades.woodPerClick += 1;
        }
        /*if (itemKey === "autoBuy") {
            treeUpgrades.autoBuy = true;
        }*/
    }

    populateShop();
    saveGame(true);

    testShowConditions();
}

function testShowConditions() {
    for (const item in shopItems.trees) {
        if (item.show) {
            continue;
        } else {
            if (shopItems.trees[item].showCondition && shopItems.trees[item].showCondition()) {
                unlockItem(item);
            }
        }
    }

    for (const item in shopItems.upgrades) {
        if (item.show) {
            continue;
        } else {
            if (shopItems.upgrades[item].showCondition && shopItems.upgrades[item].showCondition()) {
                unlockItem(item);
            }
        }
    }
}

function unlockItem(itemKey) {
    const item = shopItems.trees[itemKey] || shopItems.upgrades[itemKey];
    if (!item) return;
    item.show = true;
    populateShop();
    saveGame(true);
}