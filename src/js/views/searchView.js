class SearchView{
    #parentElement = document.querySelector('.search');

    getKeyWord(){
        return this.#parentElement.querySelector('.search__field').value;
    }

    clearText(){
        this.#parentElement.querySelector('.search__field').value = '';
    }

    addHandlerEvent(handler){
        this.#parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();