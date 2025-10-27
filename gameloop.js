requestAnimationFrame(gameLoop);

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    for (const treeID in trees) {
        updateTrees(trees[treeID], deltaTime);
    }
    softLockPrevention(deltaTime);
    autoBuy(deltaTime);
    requestAnimationFrame(gameLoop);
}

softLockPreventionTimer = document.querySelector(".soft-lock-prevention-timer");
let softLockPreventionTime = 0;
function softLockPrevention(deltaTime) {
    if (wood["whiteOak"] < 3) {
        let hasWhiteOak = false;
        for (const treeID in trees) {
            const tree = trees[treeID];
            if (tree.type === "whiteOak") {
                hasWhiteOak = true;
                return;
            }
        }
        if (!hasWhiteOak) {
            softLockPreventionTime += deltaTime;
            softLockPreventionTimer.style.display = "block";
            softLockPreventionTimer.textContent = `New White Oak in: ${Math.max(0, Math.ceil((30000 - softLockPreventionTime)/1000))}s`;
            if (softLockPreventionTime >= 30000) {
                createTree("whiteOak");
                softLockPreventionTime = 0;
                softLockPreventionTimer.style.display = "none";
            }
        };
    } else {
        softLockPreventionTime = 0;
        softLockPreventionTimer.style.display = "none";
    }
}

let autoBuyTimer = 0;
function autoBuy(deltaTime) {
    if (!treeUpgrades.autoBuy) return;
    autoBuyTimer += deltaTime;
    if (autoBuyTimer >= 500) {
        autoBuyTimer = 0;
        for (const itemKey of checkedItems) {
            buyShopItem(itemKey);
        }
    }
}

/* Commands
    give wood [type | all] [amount]
    unlock [itemKey | all]
    buy [itemKey]
    reset
*/

function runCommand(command) {
    const devConsoleInput = document.querySelector('.dev-console-input');
    devConsoleInput.value = '';
    if (devMode) {
        command.trim().toLowerCase(); 
        const parts = command.split(" ");
        if (parts[0] === "give" && parts[1] === "wood") {
            let amount = parseInt(parts[3]);
            if (isNaN(amount)) amount = 0;
            if (parts[2] === "all") {
                for (const type in wood) {
                    wood[type] += amount;
                    updateWoodDisplay(type);
                }
            } else if (wood.hasOwnProperty(parts[2])) {
                wood[parts[2]] += amount;
                updateWoodDisplay(parts[2]);
            }
        } else if (parts[0] === "unlock") {
            if (parts[1] === "all") {
                for (const itemKey in shopItems.trees) {
                    console.log("unlocking " + itemKey);
                    unlockItem(itemKey);
                }
                for (const itemKey in shopItems.upgrades) {
                    console.log("unlocking " + itemKey);
                    unlockItem(itemKey);
                }
            } else if (shopItems.trees.hasOwnProperty(parts[1])) {
                console.log("unlocking " + parts[1]);
                unlockItem(parts[1]);
            } else if (shopItems.upgrades.hasOwnProperty(parts[1])) {
                console.log("unlocking " + parts[1]);
                unlockItem(parts[1]);
            }
        } else if (parts[0] === "buy") {
            buyShopItem(parts[1], true);
        } else if (parts[0] === "reset") {
            saveOnExit = false;
            localStorage.clear();
            location.reload();
        }
    }
}