
import icons from 'url:../../img/icons.svg';

class PageView {
    #parentElement = document.querySelector('.pagination');
    #data

    get data(){
        return this.#data;
    }

    #isFirstPage(){
        return this.data.currentPage === 1 && this.data.totalPage > 1;
    }

    #isMiddlePage(){
        return this.data.currentPage > 1 && this.data.currentPage < this.data.totalPage;
    }

    #isLastPage(){
        return this.data.currentPage === this.data.totalPage && this.data.totalPage > 1;
    }

    #generateHtml(){
        const btnPreHtml = `
            <button data-goto="${this.data.currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this.data.currentPage - 1}</span>
            </button>
        `;

        const btnNextHtml = `
            <button data-goto="${this.data.currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this.data.currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;

        
        return `
            ${(this.#isFirstPage() || this.#isMiddlePage()) ? btnNextHtml : ''}
            ${(this.#isMiddlePage() || this.#isLastPage()) ? btnPreHtml : ''}
        `;

    }

    render(data){
        this.#parentElement.innerHTML = '';
        if(!data) return;
        this.#data = data;
        const html = this.#generateHtml();
        this.#parentElement.insertAdjacentHTML('afterbegin', html);
    }

    addHandlerEvent(handler){
        this.#parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const pageNumber = +btn.dataset.goto;
            handler(pageNumber);
        });
    }
}

export default new PageView();