requestAnimationFrame(gameLoop);

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    for (const treeID in trees) {
        updateTrees(trees[treeID], deltaTime);
    }
    requestAnimationFrame(gameLoop);
}