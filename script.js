const catalog = document.getElementById("catalog");
const search = document.getElementById("search");

let brands = [];

fetch("dealers.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Не удалось загрузить dealers.json");
        }
        return response.json();
    })
    .then(data => {

        brands = data.sort((a, b) =>
            a.brand.localeCompare(b.brand, "ru")
        );

        render(brands);

    })
    .catch(error => {

        catalog.innerHTML = `
            <div class="empty">
                Ошибка загрузки данных.<br><br>
                ${error.message}
            </div>
        `;

        console.error(error);

    });

function render(list) {

    catalog.innerHTML = "";

    if (list.length === 0) {

        catalog.innerHTML = `
            <div class="empty">
                Ничего не найдено
            </div>
        `;

        return;
    }

    list.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";

        const dealers = item.dealers
            .map(dealer => `<li>${dealer}</li>`)
            .join("");

        card.innerHTML = `
            <div class="header">
                <div>
                    <div class="brand">${item.brand}</div>
                    <div class="count">
                        Дилеров: ${item.dealers.length}
                    </div>
                </div>

                <div class="arrow">
                    ▼
                </div>
            </div>

            <div class="content">
                <ul>
                    ${dealers}
                </ul>
            </div>
        `;

        const header = card.querySelector(".header");

        header.addEventListener("click", () => {
            card.classList.toggle("active");
        });

        catalog.appendChild(card);

    });

}

search.addEventListener("input", function () {

    const text = this.value.trim().toLowerCase();

    const filtered = brands.filter(item =>
        item.brand.toLowerCase().includes(text)
    );

    render(filtered);

});