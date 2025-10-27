setInterval(() => {
    saveGame();
}, 30000);

function saveGame(silent=false) {
    const savingIndicator = document.querySelector('.saving-indicator');
    if (!savingIndicator) return; 

    const treeData = {};
    for (const treeID in trees) {
        const { element, ...data } = trees[treeID];
        treeData[treeID] = data;
    }

    const gameData = {
        wood: wood,
        treeUpgrades: treeUpgrades,
        trees: treeData,
        shopItems: shopItems
    };


    localStorage.setItem('autumnLumberjackSave', JSON.stringify(gameData));

    if (silent) return;
    savingIndicator.style.animation = 'savingAnimation 1s ease-in-out forwards';

    setTimeout(() => {
        savingIndicator.style.animation = '';
    }, 1000);
}

function loadGame() {
    const savedData = localStorage.getItem('autumnLumberjackSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        wood = gameData.wood;
        treeUpgrades = gameData.treeUpgrades;
        shopItems = gameData.shopItems;

        for (const tree in gameData.trees) {
            if (gameData.trees[tree].state === "falling") {
                if (gameData.trees[tree].regrows > 0) {
                    gameData.trees[tree].regrows--;
                } else {
                    continue;
                }
            }
            createTree(gameData.trees[tree].type, gameData.trees[tree]);
        }

        for (const type in wood) {
            if (wood.hasOwnProperty(type)) {
                updateWoodDisplay(type);
            }
        }

    } else {
        createTree("starter");
    }

    populateShop();
}

window.addEventListener('beforeunload', () => {
    if (saveOnExit) saveGame();
});

loadGame();