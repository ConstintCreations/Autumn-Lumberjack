const tempTree = document.querySelector('.tree');
let animation = {
    growing: "treeGrowAnimation 1.5s forwards",
    falling: "treeFallAnimation 3s ease-in forwards"
}

const treeObject = {
    element: tempTree,
    type: "temporary",
    clickable: true,
    state: "idle", /* idle, shaking, shakingDelay, falling, growing */
    timer: 0,
    clickedThisShake: false,
    clicks: 0,

    maxClicks: 10,
    regrows: 1,
    
    regrowSpeed: 5000,
    fallSpeed: 3000,
    shakeDelay: 1000,

    clickedTime: 400, /* shakeDelay/2.5 */
}

treeObject.element.addEventListener('click', (e) => {
    if (!treeObject.clickable) return;

    treeObject.state = "shaking";
    treeObject.clickable = false;
    treeObject.timer = treeObject.clickedTime;
});



requestAnimationFrame(gameLoop);

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    updateTrees(deltaTime);
    requestAnimationFrame(gameLoop);
}

function updateTrees(deltaTime) {
    switch (treeObject.state) {
        case "idle":
            break;
        case "shakingDelay":
                treeObject.timer -= deltaTime;
                if (treeObject.timer <= 0) {
                    treeObject.timer = treeObject.clickedTime;
                    treeObject.state = "shaking";
                }
            break;
        case "shaking":
                treeObject.timer -= deltaTime;

                let progress = 1 - (treeObject.timer / treeObject.clickedTime);
                let scale = 1 + 0.05 * Math.sin(progress * Math.PI);
                treeObject.element.style.transform = `scale(${scale})`;
                
                if (treeObject.timer <= treeObject.clickedTime/2 && !treeObject.clickedThisShake) {
                    treeObject.clicks += 1;
                    treeObject.clickedThisShake = true;
                    console.log("clicked!");
                }

                if (treeObject.timer <= 0) {
                    treeObject.clickedThisShake = false;
                    treeObject.element.style.transform = `scale(1)`;

                    if (treeObject.clicks >= treeObject.maxClicks) {
                        treeObject.clicks = 0;
                        treeObject.state = "falling";
                        treeObject.timer = treeObject.fallSpeed;
                        treeObject.element.style.animation = `treeFallAnimation ${treeObject.fallSpeed/1000}s ease-in forwards`;
                    } else {
                        treeObject.state = "shakingDelay";
                        treeObject.timer = treeObject.shakeDelay;
                    }
                }
            break;
        case "falling":
            treeObject.timer -= deltaTime;
            if (treeObject.timer <= 0) {
                if (treeObject.regrows > 0) {
                    treeObject.state = "growing";
                    treeObject.timer = treeObject.regrowSpeed;
                    treeObject.regrows -= 1;
                    treeObject.element.style.animation = `treeGrowAnimation ${treeObject.regrowSpeed/1000}s forwards`;
                } else {
                    treeObject.state = "idle";
                    treeObject.clickable = false;
                }
            }
            break;
        case "growing":
                treeObject.timer -= deltaTime;
                if (treeObject.timer <= 0) {
                    treeObject.element.style.animation = "";
                    treeObject.state = "idle";
                    treeObject.clickable = true;
                }
            break;
    }


}