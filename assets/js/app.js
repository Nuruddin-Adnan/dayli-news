// loader 
const loader = isloading => {
    const loaderElement = document.getElementById('loader')
    if (isloading) {
        loaderElement.classList.remove('d-none')
    } else {
        loaderElement.classList.add('d-none')
    }
}


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
        btn.innerText = category.category_name;
        btn.value = category.category_id;
        categoriesDiv.appendChild(btn);
        categoriesDiv.children[0].classList.add('active');
    });

    const categoriesBtns = document.querySelectorAll('#categories .btn');
    [...categoriesBtns].forEach(categoriesBtn => {
        categoriesBtn.addEventListener('click', function (e) {
            [...categoriesBtns].forEach(categoriesBtn => { categoriesBtn.classList.remove('active') });
            loadNewsByCategory(e.target.value);
            e.target.classList.add('active')
        })

    });

}


// load news by category
const loadNewsByCategory = async (categoryId = '08') => {
    loader(true)
    const url = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const newsArray = data.data.sort((a, b) => {
            return (a.total_view > b.total_view ? -1 : 1)
        });
        showNewsByCategory(newsArray);
        newsUnderCategory(data.data.length);
    } catch (error) {
        console.log('no data found');
    }
}
loadNewsByCategory();



// show news by category
const showNewsByCategory = newsArray => {
    const newsElement = document.getElementById('news');
    newsElement.innerHTML = '';

    if (newsArray.length === 0) {
        newsElement.innerHTML = `
        <p class="text-center text-danger">No Data Found</p>
        `;
    }
    newsArray.forEach(news => {
        const article = document.createElement('article');
        article.classList.add('news-item', 'mb-4');

        article.innerHTML = `
        <div class="card border-0 shadow-sm">
            <div class="card-body d-lg-flex align-items-center">
                <div class="flex-shrink-0 me-lg-3 mb-lg-0 mb-3 news-thumbnail-box">
                    <img src="${news.thumbnail_url}" alt="" class="news-thumbnail w-100 rounded">
                </div>
                <div>
                    <h3 class="title">${news.title}</h3>
                    <p class="news-description my-3"> ${(news.details).slice(0, 350)}${(news.details).length > 350 ? '...' : ''}</p>
                    <div class="d-lg-flex align-items-center justify-content-between">
                        <div class="author-info d-flex align-items-center">
                            <div class="flex-shrink-0 me-2">
                                <img src="${news.author.img}" alt="author" class="rounded-circle" width="40" height="40">
                            </div>
                            <div>
                                <h6 class="author-name mb-0">${news.author.name ? news.author.name : 'No data found'}</h6>
                                <p class="news-date mb-0">${news.author.published_date ? news.author.published_date : 'No data found'}</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between news-action mt-lg-0 mt-3">
                            <p class="mb-0 news-view text-center"><i class="far fa-eye pe-2"></i>${news.total_view ? (news.total_view + 'M') : 'No data found'}</p>
                            <div class="rating text-center">
                                <i class="fas fa-star-half-alt"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                            <div class="text-end">
                                <button class="btn arrow-btn" onclick="showNewsDetails('https://openapi.programming-hero.com/api/news/${news._id}')" data-bs-toggle="modal" data-bs-target="#newsModal"><i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        newsElement.appendChild(article);
    });

    loader(false)
}

// news under a single category
const newsUnderCategory = count => {
    const newsCountElement = document.getElementById('category-item-count');
    newsCountElement.innerText = count
}


// show news details with modal
const showNewsDetails = async url => {
    loader(true);
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    try {
        const response = await fetch(url);
        const data = await response.json();
        const news = data.data[0];

        console.log(news);

        newsContainer.innerHTML = `
        <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <div class="flex-shrink-0 me-lg-3 mb-3 news-thumbnail-box">
                    <img src="${news.thumbnail_url}" alt="" class="news-thumbnail w-100 rounded">
                </div>
                <div>
                    <h3 class="title">${news.title}</h3>
                    <p class="news-description my-3"> ${news.details}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="author-info d-flex align-items-center">
                            <div class="flex-shrink-0 me-2">
                                <img src="${news.author.img}" alt="author" class="rounded-circle" width="40" height="40">
                            </div>
                            <div>
                                <h6 class="author-name mb-0">${news.author.name ? news.author.name : 'No data found'}</h6>
                                <p class="news-date mb-0">${news.author.published_date ? news.author.published_date : 'No data found'}</p>
                            </div>
                        </div>
                            <p class="mb-0 news-view text-center text-nowrap pe-3"><i class="far fa-eye pe-2"></i>${news.total_view ? news.total_view : 'No data found'}M</p>
                            <div class="rating text-center text-nowrap">
                                <i class="fas fa-star-half-alt"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
        `
    }
    catch (error) {
        console.log(error);
    }
    loader(false);
}





