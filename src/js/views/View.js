import icons from 'url:../../img/icons.svg';

export class View{
    #data;

    getData(){
        return this.#data;
    }

    clear(){
        this.parentElement.innerHTML = '';
    }

    render(data, id = null){
        this.clear();
        if(!data || (Array.isArray(data) && data.length === 0)){
            this.showError();
            return;
        }

        if(!!id){
            this.idSelected = id;
        }

        this.#data = data;
        const html = this.genarateHtml();
        this.parentElement.insertAdjacentHTML('afterbegin', html);
    }

    update(data, id = null){
        if(!data || (Array.isArray(data) && data.length === 0)){
            return;
        }

        if(!!id){
            this.idSelected = id;
        }

        this.#data = data;
        const newHtml = this.genarateHtml();
        const newDOM = document.createRange().createContextualFragment(newHtml);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currentElements = Array.from(this.parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, index) => {
            const currentEl = currentElements[index];
            if(!newEl.isEqualNode(currentEl) && newEl.firstChild?.textContent.trim() !== ''){
                currentEl.textContent = newEl.textContent;
            }

            if(!newEl.isEqualNode(currentEl)){
                Array.from(newEl.attributes).forEach(attr =>
                    currentEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    showError(message = this.errorMessage){
        let errorHtml = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', errorHtml);
    }

    showSpinner(){
        let spinnerHtml = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', spinnerHtml);
        
    }

    showMessage(message = this.successMessage){
        let messageHtml =  `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', messageHtml);
    }
}