const loader = isSpinning => {
    const loader = document.getElementById('loader');
    isSpinning ? loader.classList.remove('hidden') : loader.classList.add('hidden');
}

const setAllCategories = async () => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
        const data = await res.json();
        const categories = data.data.news_category;
        displayAllCategories(categories);
    }
    catch (error) {
        console.log(error);
    }
}

const displayAllCategories = categories => {
    const menuBar = document.getElementById('categories');
    categories.forEach(category => {
        let li = document.createElement('li');
        li.innerHTML = `
        <h3 class="text-lg sm:text-xl capitalize text-white cursor-pointer p-2 rounded mb-2 hover:bg-sky-100 hover:text-blue-400" onclick="setCnnNewsId(${category.category_id})">${category.category_name}</h3>
        `;
        menuBar.appendChild(li);
    })
}

setAllCategories();


const setCnnNewsId = async (id) => {
    loader(true);
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/0${id}`);
    const data = await res.json();
    allNewsInformation(data.data);
}

const allNewsInformation = news => {
    news.sort(function (x, y) { return y.total_view - x.total_view });
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    
    
    const allNewsItems = document.getElementById('all-news');
    allNewsItems.innerText = news.length + ' News Items Found';
    const noNews = document.getElementById('not-found');
    
    if (news.length >= 1) {
        news.forEach(cnnNewsItems => {
            noNews.classList.add('hidden');
            let singleNews = document.createElement('div');
            singleNews.classList.add('lg:flex', 'bg-gray-800', 'rounded-md', 'p-3', 'mb-5', 'items-center');
            singleNews.innerHTML = `
                <div class="lg:w-6/12 w-full">
                    <img src="${cnnNewsItems.image_url ? cnnNewsItems.image_url : 'images/not-found.png'}" alt="">
                </div>

                <div class="lg:m-5 sm:mt-5 lg:w-8/12 w-full">
                    <h2 class="text-sm sm:text-lg text-blue-500 font-bold">${cnnNewsItems.title ? cnnNewsItems.title : 'No Title Found'}</h2>
                    <p class="text-sm text-white my-3">${cnnNewsItems.details ? cnnNewsItems.details.slice(0, 250) : 'No Data Found'}...</p>
 
                    <div class="md:flex justify-between items-center flex-wrap">
                        <div class="flex items-center sm:mb-0 mb-2">
                            <div class="mr-2 h-10 w-10 rounded-full overflow-hidden"><img src="${cnnNewsItems.author.img ? cnnNewsItems.author.img : 'images/Learn-With-Palash.jpg'}" alt=""></div>
                            <div>
                                <h5 class="capitalize leading-3 text-green-400"><strong>${cnnNewsItems.author.name ? cnnNewsItems.author.name : 'Author Not Found'}</strong></h5>
                                <p class="text-green-400">${cnnNewsItems.author.published_date ? cnnNewsItems.author.published_date.slice(0, 10) : 'Published Date Not Found'}</p>
                            </div>
                        </div>
  
                        <div class="flex items-center sm:mb-0 mb-2">
                            <i class="text-green-400 mr-2 fa-regular fa-eye"></i>
                            <p class="text-green-400"><strong>${cnnNewsItems.total_view ? cnnNewsItems.total_view : 'Not Available'}</strong></p>
                        </div>

                        <div class="flex items-center sm:mb-0 mb-2">
                        <p class="mr-2 text-green-400"><strong>${cnnNewsItems.rating.number ? cnnNewsItems.rating.number : 'Not Available'}</strong></p>
                            <i class="text-yellow-300 mr-1 fa-solid fa-star"></i>
                            <i class="text-yellow-300 mr-1 fa-solid fa-star"></i>
                            <i class="text-yellow-300 mr-1 fa-solid fa-star"></i>
                            <i class="text-yellow-300 mr-1 fa-solid fa-star"></i>
                            <i class="text-yellow-300 mr-1 fa-solid fa-star-half-stroke"></i>
                        </div>

                        <button class="show-modal" onclick="singleCnnNewsId('${cnnNewsItems._id}')"><i class="text-blue-500 fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
    `
            newsContainer.appendChild(singleNews);
        })

    } else {
        noNews.classList.remove('hidden');
    }

    const displayModal = document.querySelectorAll('.show-modal');
    setModalItems(displayModal);
    loader(false);
}


const singleCnnNewsId = async newsId => {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/${newsId}`);
    const data = await res.json();
    showModalData(data.data);
}

function setModalItems(items) {
    const modal = document.getElementById('modal');
    items.forEach(item => {
        item.addEventListener('click', function () {
            modal.classList.remove('hidden');
            const closeModal = document.querySelectorAll('.close-modal');
            closeModal.forEach(close => {
                close.addEventListener('click', function () {
                    modal.classList.add('hidden');
                })
            })
        });
    });
}


const showModalData = data => {
    const modaalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    data.forEach(item => {
        modaalTitle.innerText = `${item.title ? item.title : 'Title Not Found'}`
        modalBody.innerHTML = `
        <img src="${item?.image_url ? item.image_url : 'images/not-found.png'}">
        <div class="flex items-center justify-between">
        <div class="text-green-400"> 
        <p><strong>Author: ${item?.author?.name ? item.author.name : 'Not Available'}</strong></p>
        <p><strong>Date: ${item?.author?.published_date ? item?.author?.published_date : 'Not Available'}</strong></p>
        </div>
        <div>
        <p><i class="text-green-400 fa-regular fa-eye mr-1"></i><strong>${item.total_view}</strong></p>
        <p><i class="text-yellow-300 fa-solid fa-star mr-1"></i><strong>${item.rating.number}</strong></p>
        </div>
        </div>
        <p>${item?.details ? item?.details : 'Not Available'}</p>
        `
    })
}