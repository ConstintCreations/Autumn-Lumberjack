const sidebar = document.querySelector('.sidebar');
const shopSections = sidebar.querySelector('.shop-sections');
const shop = sidebar.querySelector('.shop');

let shopItems = {
    trees: {
        temporary: {
            name: "Temporary Tree",
            description: "A tree that will disappear after a while.",
            baseCost: {
                temporary: 3,
            },
            cost: {
                temporary: 3,
            },
            image: "images/trees/temporary/tree.png",
            timesBought: 0,
            costIncreaseRate: {
                temporary: 0
            },
            multiplier: 1,
            show: true,
            showCondition: null
        },
        
    },
    upgrades: {
        maxClicks: {
            name: "Wood Per Tree",
            description: "Increases the amount of wood gained per tree.",
            baseCost: {
                temporary: 10,
            },
            cost: {
                temporary: 10,
            },
            image: "images/shop/upgrades/maxClicks.png",
            timesBought: 0,
            costIncreaseRate: {
                temporary: 5
            },
            multiBuy: true,
            show: true,
            showCondition: null
        },
        autoClick: {
            name: "Auto Clicker",
            description: "Automatically click trees for you.",
            baseCost: {
                temporary: 100,
            },
            cost: {
                temporary: 100,
            },
            image: "images/shop/upgrades/autoClick.png",
            timesBought: 0,
            costIncreaseRate: {
                temporary: 0
            },
            multiBuy: false,
            show: false,
            showCondition: () => { return false; }
        },
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
                    ${item.cost.temporary ? `<div class="wood-cost temporary">${item.cost.temporary} <img class="shop-item-wood-icon" src="images/trees/temporary/wood.png"></div>` : ""}
                </div>
            </div>
        `;

        itemElement.addEventListener('click', () => {
            buyShopItem(key);
        });
        treeSection.appendChild(itemElement);
    }

    for (const [key, item] of Object.entries(shopItems.upgrades)) {
        if (item.show == false) continue;
        const itemElement = document.createElement('button');
        itemElement.classList.add('shop-item');
        itemElement.dataset.item = key;
        itemElement.innerHTML = `
            <img class="shop-item-image" src="${item.image}">
            <div class="shop-item-info">
                <div class="shop-item-name">
                    ${item.name}
                </div>
                <div class="shop-item-description">
                    ${item.description}
                </div>
                <div class="shop-item-stats">
                    ${item.multiBuy ? `<div>Times Bought: ${item.timesBought}</div>` : (item.timesBought>0 ? `<div>Purchased</div>` : `<div>Not Purchased</div>`)}
                    ${item.multiBuy && treeUpgrades[key] ? `<div>Current: ${treeUpgrades[key]}</div>` : ""}
                </div>
                <div class="shop-item-cost">
                    ${item.cost.temporary ? `<div class="wood-cost temporary">${item.cost.temporary} <img class="shop-item-wood-icon" src="images/trees/temporary/wood.png"></div>` : ""}
                </div>
            </div>
        `;

        if (item.multiBuy === false && item.timesBought > 0) {
            itemElement.classList.add('bought');
        }
        itemElement.addEventListener('click', () => {
            buyShopItem(key);
        });
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

function buyShopItem(itemKey) {
    const item = shopItems.trees[itemKey] || shopItems.upgrades[itemKey];
    console.log("Buying item:", itemKey, item);
    if (!item) return;
    let canAfford = true;
    if (item.multiBuy === false && item.timesBought > 0) return;

    if (item.cost.temporary) {
        if (wood.temporary < item.cost.temporary) canAfford = false;
    }

    if (!canAfford) return;

    item.timesBought++;

    if (item.cost.temporary) {
        wood.temporary -= item.cost.temporary;
        updateWoodDisplay('temporary');
        item.cost.temporary = Math.floor(item.baseCost.temporary + (item.timesBought  * item.costIncreaseRate.temporary));
    }

    if (shopItems.trees[itemKey]) {
        createTree(itemKey);
    }

    if (shopItems.upgrades[itemKey]) {
        if (itemKey === "maxClicks") {
            treeUpgrades.maxClicks += 1;
        }
    }

    populateShop();
    saveGame(true);
}

function testShowConditions() {
    for (const item in shopItems.trees) {
        if (item.show) {
            continue;
        } else {
            if (shopItems.trees[item].showCondition && shopItems.trees[item].showCondition()) {
                shopItems.trees[item].show = true;
                populateShop();
            }
        }
    }

    for (const item in shopItems.upgrades) {
        if (item.show) {
            continue;
        } else {
            if (shopItems.upgrades[item].showCondition && shopItems.upgrades[item].showCondition()) {
                shopItems.upgrades[item].show = true;
                populateShop();
            }
        }
    }
}