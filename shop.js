const sidebar = document.querySelector('.sidebar');
const shopSections = sidebar.querySelector('.shop-sections');
const shop = sidebar.querySelector('.shop');

updateShopSection('shop-trees');

shopSections.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        shopSections.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        updateShopSection(button.dataset.section);
    });
});

function updateShopSection(section) {
    shop.querySelectorAll('div').forEach(div => div.style.display = 'none');
    shop.querySelector(`.${section}`).style.display = 'flex';
}