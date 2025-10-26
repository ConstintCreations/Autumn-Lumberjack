const main = document.querySelector('.main');

const trees = [];

const wood = {
    temporary: 0,
}

const treeUpgrades = {
    woodPerClick: 1,
    maxClicks: 10,
    regrows: 1,
    regrowSpeed: 5000,
    fallSpeed: 3000,
    shakeDelay: 1000,
}

createTree("starter");
createTree("temporary");

function createTree(type) {
    let centered = false;
    const treeElement = document.createElement('img');
    switch(type) {
        case "temporary":
            treeElement.src = 'images/treeplaceholder.png';
            break;
        case "starter":
            treeElement.src = 'images/treeplaceholder.png';
            centered = true;
            break;
    }

    treeElement.classList.add('tree');

    if (centered) {
        treeElement.style.left = `calc(50% - 2.5vh)`;
        treeElement.style.top = `calc(50% - 5vh)`;
    } else {
        treeElement.style.left = `${Math.random() * ((window.innerWidth *0.7) - 0.05 * window.innerHeight)}px`;
        treeElement.style.top = `${Math.random() * (window.innerHeight - 0.1 * window.innerHeight)}px`;
    }

    main.appendChild(treeElement);

    const treeObj = {
        element: treeElement,
        type: (type == "starter" ? "temporary" : type),
        clickable: true,
        state: "idle", /* idle, shaking, shakingDelay, falling, growing */
        timer: 0,
        clickedThisShake: false,
        clicks: 0,
        maxClicks: treeUpgrades.maxClicks,
        regrows: treeUpgrades.regrows,
        regrowSpeed: treeUpgrades.regrowSpeed,
        fallSpeed: treeUpgrades.fallSpeed,
        shakeDelay: treeUpgrades.shakeDelay,
        clickedTime: (treeUpgrades.shakeDelay / 2.5),
    }

    treeObj.element.addEventListener('click', (e) => {
        if (!treeObj.clickable) return;

        treeObj.state = "shaking";
        treeObj.clickable = false;
        treeObj.timer = treeObj.clickedTime;
    });

    trees.push(treeObj);
}



requestAnimationFrame(gameLoop);

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    for (let tree of trees) {
        updateTrees(tree, deltaTime);
    }
    requestAnimationFrame(gameLoop);
}

function updateTrees(tree, deltaTime) {
    switch (tree.state) {
        case "idle":
            break;
        case "shakingDelay":
                tree.timer -= deltaTime;
                if (tree.timer <= 0) {
                    tree.timer = tree.clickedTime;
                    tree.state = "shaking";
                }
            break;
        case "shaking":
                tree.timer -= deltaTime;

                let progress = 1 - (tree.timer / tree.clickedTime);
                let scale = 1 + 0.05 * Math.sin(progress * Math.PI);
                tree.element.style.transform = `scale(${scale})`;
                
                if (tree.timer <= tree.clickedTime/2 && !tree.clickedThisShake) {
                    tree.clicks += 1;
                    tree.clickedThisShake = true;
                    wood[tree.type] += treeUpgrades.woodPerClick;
                    console.log(wood);
                }

                if (tree.timer <= 0) {
                    tree.clickedThisShake = false;
                    tree.element.style.transform = `scale(1)`;

                    if (tree.clicks >= tree.maxClicks) {
                        tree.clicks = 0;
                        tree.state = "falling";
                        tree.timer = tree.fallSpeed;
                        tree.element.style.animation = `treeFallAnimation ${tree.fallSpeed/1000}s ease-in forwards`;
                    } else {
                        tree.state = "shakingDelay";
                        tree.timer = tree.shakeDelay;
                    }
                }
            break;
        case "falling":
            tree.timer -= deltaTime;
            if (tree.timer <= 0) {
                if (tree.regrows > 0) {
                    tree.state = "growing";
                    tree.timer = tree.regrowSpeed;
                    tree.regrows -= 1;
                    tree.element.style.animation = `treeGrowAnimation ${tree.regrowSpeed/1000}s forwards`;
                } else {
                    tree.state = "idle";
                    tree.clickable = false;
                }
            }
            break;
        case "growing":
                tree.timer -= deltaTime;
                if (tree.timer <= 0) {
                    tree.element.style.animation = "";
                    tree.state = "idle";
                    tree.clickable = true;
                }
            break;
    }


}