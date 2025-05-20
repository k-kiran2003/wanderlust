const filters = document.querySelectorAll(".filter");
filters.forEach(filter => {
    filter.addEventListener("click", () => {
        const category = filter.getAttribute("data-category");
        window.location.href = `/listing/search?category=${encodeURIComponent(category)}`;

    });
});
