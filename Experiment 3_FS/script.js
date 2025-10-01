const productsElement = document.querySelector("#products");
const categorySelect = document.querySelector("#category");

const products = [
    { id: 1, name: "jeans", category: "clothing" },
    { id: 2, name: "harry potter", category: "books" },
    { id: 3, name: "laptop", category: "electronics" },
    { id: 4, name: "shoes", category: "clothing" },
    { id: 5, name: "novel", category: "books" },
];

function filter(category) {
    if (category === "all") {
        return products;
    } else {
        return products.filter((value) => {
            return value.category === category;
        });
    }
}

categorySelect.addEventListener("change", () => {
    const filteredProducts = filter(categorySelect.value);

    const data = filteredProducts.map((value) => {
        return `<div class="product ${value.category}">${value.name}</div>`;
    });

    productsElement.innerHTML = data.join("");
});

const filteredProducts = filter("all");

const data = filteredProducts.map((value) => {
    return `<div class="product ${value.category}">${value.name}</div>`;
});

productsElement.innerHTML = data.join("");