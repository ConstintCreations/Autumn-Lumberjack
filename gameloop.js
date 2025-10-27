requestAnimationFrame(gameLoop);

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    for (const treeID in trees) {
        updateTrees(trees[treeID], deltaTime);
    }
    softLockPrevention(deltaTime);
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
            console.log(softLockPreventionTime);
            if (softLockPreventionTime >= 30000) {
                createTree("whiteOak");
                softLockPreventionTime = 0;
                softLockPreventionTimer.style.display = "none";
            }
        };
    }
}