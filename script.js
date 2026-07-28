// ======================================
// Dealer Catalog v2.0
// ======================================

const catalog = document.getElementById("catalog");
const search = document.getElementById("search");

const brandCount = document.getElementById("brandCount");
const dealerCount = document.getElementById("dealerCount");

const themeButton = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

let brands = [];

// ======================================
// Theme
// ======================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeIcon.textContent = "☀️";

}

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    themeIcon.textContent = dark ? "☀️" : "🌙";

    localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
    );

});

// ======================================
// Logo
// ======================================

function logoPath(name){

    return "images/brands/" +
        name
            .toLowerCase()
            .replace(/\s+/g,"-")
            .replace(/\./g,"")
            + ".svg";

}

// ======================================
// Statistics
// ======================================

function updateStats(data){

    brandCount.textContent = data.length;

    let dealers = 0;

    data.forEach(item=>{

        dealers += item.dealers.length;

    });

    dealerCount.textContent = dealers;

}

// ======================================
// Card
// ======================================

function createCard(item){

    const card = document.createElement("div");

    card.className = "brand-card";

    const dealersHTML = item.dealers.map(dealer => {

        // Старый формат
        if (typeof dealer === "string") {

            return `
            <div class="dealer">
                <div class="dealer-name">${dealer}</div>
            </div>
            `;

        }

        // Новый формат
        return `
        <div class="dealer">

            <div class="dealer-name">
                ${dealer.name || ""}
            </div>

            ${
                dealer.address
                ? `<div class="dealer-address">${dealer.address}</div>`
                : ""
            }

            <div class="dealer-links">

                ${
                    dealer.website
                    ? `
                    <a
                        href="${dealer.website}"
                        target="_blank"
                        rel="noopener"
                        class="dealer-link">
                        🌐 Сайт
                    </a>
                    `
                    : ""
                }

                ${
                    dealer.map
                    ? `
                    <a
                        href="${dealer.map}"
                        target="_blank"
                        rel="noopener"
                        class="dealer-link">
                        🗺 Карта
                    </a>
                    `
                    : ""
                }

            </div>

        </div>
        `;

    }).join("");

    card.innerHTML = `

<div class="brand-header">

    <div class="brand-name">

        <div class="brand-logo">

            <img
                src="${logoPath(item.brand)}"
                alt="${item.brand}"
                onerror="this.src='images/brands/default.svg'">

        </div>

        <div class="brand-title">

            <h3>${item.brand}</h3>

            <div class="brand-count">

                ${item.dealers.length} дилеров

            </div>

        </div>

    </div>

    <div class="brand-arrow">

        ▼

    </div>

</div>

<div class="dealers">

    ${dealersHTML}

</div>

`;

    card
        .querySelector(".brand-header")
        .addEventListener("click", () => {

            card.classList.toggle("active");

        });

    return card;

}
}

// ======================================
// Render
// ======================================

function render(data){

    catalog.innerHTML = "";

    updateStats(data);

    if(data.length===0){

        catalog.innerHTML=`

<div class="dealer">

Ничего не найдено

</div>

`;

        return;

    }

    data.forEach(item=>{

        catalog.appendChild(

            createCard(item)

        );

    });

}// ======================================
// Load JSON
// ======================================

async function loadData() {

    try {

        const response = await fetch("dealers.json");

        if (!response.ok) {
            throw new Error("Не удалось загрузить dealers.json");
        }

        const data = await response.json();

        brands = data.sort((a, b) =>
            a.brand.localeCompare(b.brand)
        );

        render(brands);

    } catch (error) {

        console.error(error);

        catalog.innerHTML = `

<div class="dealer">

❌ Ошибка загрузки данных

</div>

`;

    }

}

// ======================================
// Search
// ======================================

// ======================================
// Search
// ======================================

search.addEventListener("input", function () {

    const value = this.value
        .trim()
        .toLowerCase();

    if (!value) {

        render(brands);

        return;

    }

    const filtered = brands.filter(item => {

        // поиск по бренду
        if (item.brand.toLowerCase().includes(value)) {

            return true;

        }

        // поиск по дилерам
        return item.dealers.some(dealer => {

            // Старый формат
            if (typeof dealer === "string") {

                return dealer
                    .toLowerCase()
                    .includes(value);

            }

            // Новый формат
            return [

                dealer.name || "",
                dealer.address || "",
                dealer.website || "",
                dealer.map || ""

            ]
            .join(" ")
            .toLowerCase()
            .includes(value);

        });

    });

    render(filtered);

});

// ======================================
// Keyboard Shortcut
// Ctrl + K
// ======================================

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key.toLowerCase() === "k") {

        e.preventDefault();

        search.focus();

    }

});

// ======================================
// ESC clears search
// ======================================

search.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        search.value = "";

        render(brands);

    }

});

// ======================================
// Auto focus
// ======================================

window.addEventListener("load", () => {

    setTimeout(() => {

        search.focus();

    }, 300);

});

// ======================================
// Start
// ======================================

loadData();
