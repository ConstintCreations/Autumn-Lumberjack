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
            }
        },
    },
    upgrades: {

    }
}

function populateShop() {
    const treeSection = shop.querySelector('.shop-trees .shop-items');
    const upgradesSection = shop.querySelector('.shop-upgrades .shop-items');

    for (const [key, item] of Object.entries(shopItems.trees)) {
        // Remove an Item: if (key === "temporary" && shopItems.trees[key].timesBought >= 0) continue;

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
                <div class="shop-item-cost">
                    ${item.cost.temporary ? `<div class="wood-cost temporary">${item.cost.temporary} <img class="shop-item-wood-icon" src="images/trees/temporary/wood.png"></div>` : ""}
                </div>
            </div>
        `;
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
    let canAfford = true;
    if (!item) return;

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

    updatePrices();
    saveGame(true);
}

function updatePrices() {
    const treeSection = shop.querySelector('.shop-trees .shop-items');
    const upgradesSection = shop.querySelector('.shop-upgrades .shop-items');

    treeSection.querySelectorAll('.shop-item').forEach(itemElement => {
        const itemKey = itemElement.dataset.item;
        /* Remove an Item if (itemKey === "temporary" && shopItems.trees[itemKey].timesBought >= 0) {
            itemElement.remove();
            return;
        }*/
        const item = shopItems.trees[itemKey];
        itemElement.querySelector('.shop-item-cost').innerHTML = `
            ${item.cost.temporary ? `<div class="wood-cost temporary">${item.cost.temporary} <img class="shop-item-wood-icon" src="images/trees/temporary/wood.png"></div>` : ""}
        `;
    });

    upgradesSection.querySelectorAll('.shop-item').forEach(itemElement => {
        const itemKey = itemElement.dataset.item;
        const item = shopItems.upgrades[itemKey];
        itemElement.querySelector('.shop-item-cost').innerHTML = `
            ${item.cost.temporary ? `<div class="wood-cost temporary">${item.cost.temporary} <img class="shop-item-wood-icon" src="images/trees/temporary/wood.png"></div>` : ""}
        `;
    });
}