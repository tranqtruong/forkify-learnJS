import { View } from "./View";
import icons from 'url:../../img/icons.svg';
//import {Fraction} from 'fractional';
import fracty from "fracty";

class RecipeView extends View{
    #parentElement = document.querySelector('.recipe');
    #errorMessage = 'Not found the recipe! Please try another one.';

    get parentElement(){
        return this.#parentElement;
    }

    get errorMessage(){
        return this.#errorMessage;
    }

    #genarateIngredient(ingredient){
        return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ingredient.quantity ? fracty(ingredient.quantity).toString() : ''}</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ingredient.unit}</span>
                    ${ingredient.description}
                </div>
            </li>
        `;
    }

    genarateHtml(recipe = this.getData()){
        const userIcon = `
            <div class="recipe__user-generated">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
        `;

        return `
            <figure class="recipe__fig">
                <img src="${recipe.image_url}" alt="Imgage" class="recipe__img" />
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.cooking_time}</span>
                    <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text">servings</span>

                    <div class="recipe__info-buttons">
                        <button data-new-servings=${recipe.servings - 1} class="btn--tiny btn--increase-servings">
                            <svg>
                                <use href="${icons}#icon-minus-circle"></use>
                            </svg>
                        </button>
                        <button data-new-servings=${recipe.servings + 1} class="btn--tiny btn--increase-servings">
                            <svg>
                                <use href="${icons}#icon-plus-circle"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                ${!!recipe?.key ? userIcon : ''}
                <button class="btn--round btn--bookmark">
                    <svg class="">
                        <use href="${icons}#icon-bookmark${recipe.bookmarked ? '-fill' : ''}"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(this.#genarateIngredient).join('')}
                </ul>
            </div>

            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
                directions at their website.
                </p>
                <a
                class="btn--small recipe__btn"
                href="${recipe.source_url}"
                target="_blank"
                >
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                </a>
            </div>
        `;
    }

    addHandlerEvent(handler){
        ['load', 'hashchange'].forEach(e =>{
            window.addEventListener(e, handler);
        });
    }

    addHandleServing(handler){
        this.#parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--tiny');
            if(!btn) return;

            const newServingsValue = +btn.dataset.newServings;

            if(newServingsValue > 0){
                handler(newServingsValue);
            }
        });
    }

    addHandlerBookmark(handler){
        this.parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--bookmark');
            if(!btn) return;

            handler();
        });
    }
}

export default new RecipeView();