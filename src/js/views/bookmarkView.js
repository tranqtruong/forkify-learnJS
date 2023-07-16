import { View } from "./View";
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View{
    #parentElement = document.querySelector('.bookmarks__list');
    #errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
    #idSelected;

    get parentElement(){
        return this.#parentElement;
    }

    get idSelected(){
        return this.#idSelected;
    }

    set idSelected(id){
        this.#idSelected = id;
    }

    get errorMessage(){
        return this.#errorMessage;
    }

    #genratePreview(previewItem){

        const userIcon = `
            <div class="preview__user-generated">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
    `;

        return `
            <li class="preview">
                <a class="preview__link ${this.idSelected === previewItem.id ? 'preview__link--active': ''}" href="#${previewItem.id}">
                <figure class="preview__fig">
                    <img src="${previewItem.image_url}" alt="Image" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${previewItem.title}</h4>
                    <p class="preview__publisher">${previewItem.publisher}</p>
                    ${!!previewItem?.key ? userIcon : ''}
                </div>
                </a>
            </li>
        `;
    }

    genarateHtml(searchResult = this.getData()){
        return `
            ${searchResult.map(this.#genratePreview.bind(this)).join('')}
        `;
    }

    
}

export default new BookmarkView();