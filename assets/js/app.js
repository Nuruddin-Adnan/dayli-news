// load all categories from API
const loadCategory = async () => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
        const data = await res.json();
        const categories = data.data.news_category;
        categories.sort((a, b) => a.category_name.localeCompare(b.category_name)) //Catagory shorted alphabetically
        showCategory(categories);
    } catch (error) {
        console.log('no data found');
    }
}

loadCategory();

// show All category to UI
const showCategory = categories => {
    const categoriesDiv = document.getElementById('categories');
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.innerText = category.category_name
        categoriesDiv.appendChild(btn);
    });
    categoriesDiv.children[0].classList.add('active')
}

