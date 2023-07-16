import { API_KEY, API_URL, PAGE_NUMBER_DEFAULT, PAGE_SIZE } from "./config";
import { getJSON, sendJSON } from "./helper";

export let states = {
    recipe: {},
    searchResult: {
        keyword: '',
        data: [],
        totalPage: 0,
        currentPage: PAGE_NUMBER_DEFAULT,
        pageSize: PAGE_SIZE
    },
    bookmarks: []
};

const isRecipeMarked = (recipeId) => {
    return states.bookmarks.some(recipeBookmarked => {
        return recipeBookmarked.id === recipeId;
    });
}


export const getRecipe = async (recipeId) => {
    try {
        const recipeData = await getJSON(`${API_URL}/${recipeId}?key=${API_KEY}`);
        states.recipe = recipeData.data.recipe;

        isRecipeMarked(recipeId) 
        ? states.recipe.bookmarked = true 
        : states.recipe.bookmarked = false;

    } catch (error) {
        throw error;
    }
}

export const searchRecipe = async (keyword) => {
    try {
        const searchResult = await getJSON(`${API_URL}?search=${keyword}&key=${API_KEY}`);
        if(searchResult.results === 0){
            states.searchResult = {};
            throw new Error(`No result for ${keyword}`);
        }

        states.searchResult.keyword = keyword;
        states.searchResult.data = searchResult.data.recipes;
        states.searchResult.pageSize = PAGE_SIZE;
        states.searchResult.totalPage = Math.ceil(states.searchResult.data.length / states.searchResult.pageSize);
        states.searchResult.currentPage = PAGE_NUMBER_DEFAULT;
    } catch (error) {
        throw error;
    }
}

export const pagingSearchResult = (pageNumber = states.searchResult.currentPage) => {
    states.searchResult.currentPage = pageNumber;

    const start = (pageNumber - 1) * states.searchResult.pageSize;
    const end = pageNumber * states.searchResult.pageSize;
    return states.searchResult.data.slice(start, end);
}

export const updateServing = (newServings) => {
    states.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / states.recipe.servings;
    });

    states.recipe.servings = newServings;
}

const saveBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(states.bookmarks));
}

export const addBookmark = (recipe) => {
    states.bookmarks.push(recipe);
    states.recipe.bookmarked = true;
    saveBookmarks();
}

export const removeBookmark = (recipeId) => {
    const index = states.bookmarks.findIndex(b => b.id === recipeId);
    states.bookmarks.splice(index, 1);
    states.recipe.bookmarked = false;
    saveBookmarks();
}

export const clearBookmarks = () => {
    localStorage.clear('bookmarks');
}

export const loadBookmarks = () => {
    const bookmarks = localStorage.getItem('bookmarks');
    if(!!bookmarks){
        states.bookmarks = JSON.parse(bookmarks);
    }
}

export const uploadRecipe = async (newRecipe) => {
    try {
        console.log(states.recipe);
        console.log(newRecipe);

        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(entry => {
                
                const ingredientArray = entry[1].replaceAll(' ', '').split(',');
                //console.log(entry, ingredientArray);
                if(ingredientArray.length !== 3){
                    throw new Error('Wrong ingredient formmat');
                }
                const [quantity, unit, description] = ingredientArray;

                return {
                    quantity: !!quantity ? quantity : null, 
                    unit: unit ? unit : '',
                    description: description
                }
            });
        
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients
        };

        const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
        states.recipe = data.data.recipe;
        addBookmark(states.recipe);
        console.log('succes', states.recipe);
    } catch (error) {
        throw error;
    }
}