const main = document.querySelector('.main');
const animationScaleAmount = 0.075;

let trees = {};

const woodDisplays = document.querySelector(".wood");

let wood = {
    whiteOak: 0,
    sugarMaple: 0,
    cherryBirch: 0,
    blackWalnut: 0,
}

let treeUpgrades = {
    woodPerClick: 1,
    maxClicks: 5,
    regrows: 0,
    regrowSpeed: 5000,
    fallSpeed: 3000,
    shakeDelay: 1000,
    autoClick: false,
    //autoBuy: false,
}

let saveOnExit = true;

let devMode = false;
let devConsole = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveGame();
    }
    if (e.key === 'x' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveOnExit = false;
        localStorage.clear();
        location.reload();
    }
    if (e.key === '`' && devMode) {
        e.preventDefault();
        const devConsoleElement = document.querySelector('.dev-console');
        devConsoleElement.style.display = devConsoleElement.style.display === 'flex' ? 'none' : 'flex';
        devConsole = !devConsole;
        if (devConsoleElement.style.display === 'flex') {
            document.querySelector('.dev-console-input').focus();
        }
    }

    if (e.key === 'Enter' && devMode && devConsole) {
        const consoleInput = document.querySelector('.dev-console-input');
        if (document.activeElement === consoleInput) {
            runCommand(consoleInput.value);
        }
    }
});

document.querySelector('.dev-console-submit').addEventListener('click', () => {
    if (devMode) {
        const consoleInput = document.querySelector('.dev-console-input');
        runCommand(consoleInput.value);
    }
});

function randomTreeID() {
    return "Tree-" + Date.now() + Math.random().toString(36).substring(2, 15);
}

function createTree(type, tree=null) {
    const id = randomTreeID();
    
    let centered = false;
    const treeElement = document.createElement('img');

    treeElement.src = `images/trees/${type == "starter" ? "whiteOak" : type}/tree.png`;

    let multiplier = 1;
    switch (type) {
        case "whiteOak":
            multiplier = 1;
            break;
        case "sugarMaple":
            multiplier = 1.25;
            break;
        case "cherryBirch":
            multiplier = 1.5;
            break;
        case "blackWalnut":
            multiplier = 2;
            break;
    }

    if (type == "starter") {
        centered = true;
    }

    treeElement.classList.add('tree');
    treeElement.dataset.id = id;

    if (centered) {
        treeElement.style.left = `calc(50% - 2.5vh)`;
        treeElement.style.top = `calc(50% - 5vh)`;
    } else {
        treeElement.style.left = `${Math.random() * ((window.innerWidth *0.7) - 0.05 * window.innerHeight)}px`;
        treeElement.style.top = `${Math.random() * (window.innerHeight - 0.1 * window.innerHeight)}px`;
    }

    main.appendChild(treeElement);

    const treeObj = {
        id: id,
        element: treeElement,
        type: (type == "starter" ? "whiteOak" : type),
        clickable: (type == "starter" ? true :  false),
        state: (type == "starter" ? "idle" : "growing"), /* idle, shaking, shakingDelay, falling, growing */
        timer: (type == "starter" ? 0 : treeUpgrades.regrowSpeed),
        clickedThisShake: (tree ? tree.clickedThisShake : false),
        clicks: (tree ? tree.clicks : 0),
        maxClicks: (tree ? tree.maxClicks : treeUpgrades.maxClicks),
        regrows: (tree ? tree.regrows : treeUpgrades.regrows),
        regrowSpeed: (tree ? tree.regrowSpeed : treeUpgrades.regrowSpeed),
        fallSpeed: (tree ? tree.fallSpeed : treeUpgrades.fallSpeed),
        shakeDelay: (tree ? tree.shakeDelay : treeUpgrades.shakeDelay),
        clickedTime: (tree ? (tree.shakeDelay / 2.5) : (treeUpgrades.shakeDelay / 2.5)),
        autoClick: (tree ? tree.autoClick : treeUpgrades.autoClick),
    }

    treeObj.maxClicks *= multiplier;
    treeObj.regrows *= multiplier;
    treeObj.regrowSpeed /= multiplier;
    treeObj.fallSpeed /= multiplier;
    treeObj.shakeDelay /= multiplier;

    if (treeObj.state === "growing") {
        const randomFactor = Math.random() * 0.2 * treeObj.regrowSpeed;
        treeObj.element.style.animation = `treeGrowAnimation ${(treeObj.regrowSpeed * 0.9 + randomFactor)/1000}s ease-in forwards`;
        treeObj.timer = treeObj.regrowSpeed * 0.9 + randomFactor;
    }

    treeObj.element.addEventListener('click', (e) => {
        if (!treeObj.clickable) return;

        treeObj.state = "shaking";
        treeObj.clickable = false;
        treeObj.timer = treeObj.clickedTime;
    });

    trees[id] = treeObj;
}

function updateTrees(tree, deltaTime) {
    switch (tree.state) {
        case "idle":
            break;
        case "shakingDelay":
                if (tree.autoClick) {
                    tree.timer -= deltaTime;
                    if (tree.timer <= 0) {
                        tree.timer = tree.clickedTime;
                        tree.state = "shaking";
                        tree.clickable = false;
                    }
                }
            break;
        case "shaking":
                tree.timer -= deltaTime;

                let progress = 1 - (tree.timer / tree.clickedTime);
                let scale = 1 + animationScaleAmount * Math.sin(progress * Math.PI);
                tree.element.style.transform = `scale(${scale})`;
                
                if (tree.timer <= tree.clickedTime/2 && !tree.clickedThisShake) {
                    tree.clicks += 1;
                    tree.clickedThisShake = true;
                    wood[tree.type] += treeUpgrades.woodPerClick;
                    updateWoodDisplay(tree.type);
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
                        tree.clickable = true;
                    }
                }
            break;
        case "falling":
            tree.timer -= deltaTime;
            if (tree.timer <= 0) {
                if (tree.regrows > 0) {
                    tree.regrows--;                    
                    createTree(tree.type, tree);

                    tree.element.remove();
                    delete trees[tree.id];
                } else {
                    tree.element.remove();
                    delete trees[tree.id];
                }
            }
            break;
        case "growing":
                tree.timer -= deltaTime;
                if (tree.timer <= 0) {
                    tree.element.style.animation = "";
                    tree.state = "idle";
                    tree.clickable = true;
                    if (tree.autoClick) {
                        tree.element.click();
                    }
                }
            break;
    }
}

function updateWoodDisplay(type="whiteOak") {
    const display = woodDisplays.querySelector(`.wood-display.${type}`);
    
    if (display) {
        display.querySelector(".wood-display-amount").textContent = wood[type];
        if (wood[type] <= 0) {
            display.style.display = "none";
        } else {
            display.style.display = "flex";
        }
    }

    testShowConditions();
}