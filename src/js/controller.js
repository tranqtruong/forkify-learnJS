// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

'use strict';

import { CLOSE_MODAL_SEC } from "./config";
import { addBookmark, clearBookmarks, getRecipe, loadBookmarks, pagingSearchResult, removeBookmark, searchRecipe, states, updateServing, uploadRecipe } from "./model";
import addRecipeView from "./views/addRecipeView";
import bookmarkView from "./views/bookmarkView";
import pageView from "./views/pageView";
import recipeView from "./views/recipeView";
import resultView from "./views/resultView";
import searchView from "./views/searchView";

const controlRepice = async () => {
  try {
    // 1. get id recipe from hash
    const recipeId = window.location.hash.slice(1);
    
    bookmarkView.render(states.bookmarks, recipeId);
    if(!recipeId) return;
    resultView.update(pagingSearchResult(), recipeId);
    recipeView.showSpinner();
    
    // 2. get recipeData
    await getRecipe(recipeId);

    recipeView.render(states.recipe);
  } catch (error) {
    console.log(error);
    recipeView.showError();
  }
}

const controlSearch = async () => {
  try {
    resultView.showSpinner();
    const keyword = searchView.getKeyWord();
    await searchRecipe(keyword);
    resultView.render(pagingSearchResult());
    console.log(pagingSearchResult());
  } catch (error) {
    console.log(error);
    resultView.showError(error.message);
  }finally{
    pageView.render(states.searchResult);
  }
}

const controlPaging = (pageNumber) => {
  resultView.render(pagingSearchResult(pageNumber));
  pageView.render(states.searchResult);
}

const controlServing = (newServings) => {
  updateServing(newServings);
  recipeView.update(states.recipe);
}

const controlAddBookmarks = () => {
  states.recipe.bookmarked ? removeBookmark(states.recipe.id) 
  : addBookmark(states.recipe);
  recipeView.update(states.recipe);
  const recipeId = window.location.hash.slice(1);
  if(!recipeId) return;
  bookmarkView.render(states.bookmarks, recipeId);
}

const controlAddRecipe = async (formData) => {
  try {
    addRecipeView.showSpinner();
    await uploadRecipe(formData);
    addRecipeView.showMessage();
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);
    recipeView.render(states.recipe);
    window.history.pushState(null, '', `#${states.recipe.id}`);
    bookmarkView.render(states.bookmarks, states.recipe.id);
  } catch (error) {
    console.log(error);
    addRecipeView.showError();
    clearBookmarks();
  }
}

function init(){
  loadBookmarks();
  searchView.addHandlerEvent(controlSearch);
  recipeView.addHandlerEvent(controlRepice);
  pageView.addHandlerEvent(controlPaging);
  recipeView.addHandleServing(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  //clearBookmarks();
}

init();