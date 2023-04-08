
const requiredStr = "Обязательный"

function ViewModel() {
    const self = this;

    self.categories = ko.observableArray(
        categories.map(cat => {
            cat.isOpen = ko.observable(false);
            return cat
        })
    );

    self.documents = ko.observableArray(documents);

    self.searchValue = ko.observable("");

    self.showClearIcon = ko.computed(() => {
        return !!this.searchValue();
    }, this);

    self.clearSearch = function () {
        this.searchValue("")
    }

    self.openList = function (parent){
        const isOpenNow = parent.isOpen()
        parent.isOpen(!isOpenNow)
    }

    let clone = null;
    let rowWidth = 0;
    let underLyingRow = null

    self.dragClick = function(data, e) {

        const row = e.target.parentElement.parentElement
        clone = row.cloneNode(true)
        clone.id+="-dragged"
        rowWidth = e.currentTarget.parentElement.parentElement.offsetWidth

        clone.classList.add('dragged-row')
        clone.style.width = `${rowWidth}px`
        clone.style.left= `${e.clientX - rowWidth}px`;
        clone.style.top = `${e.clientY}px`;

        document.body.appendChild(clone);

        window.onmousemove = handleDragging;
        window.onmouseup = handleMouseUp;
    }

    function handleDragging(e){
        clone.style.left= `${e.clientX - rowWidth}px`;
        clone.style.top = `${e.clientY}px`;

        const underlyingElements = document.elementsFromPoint(e.clientX, e.clientY)
        const currentUnderLyingRow = underlyingElements.find(
            el => ( el.parentElement?.classList.contains("document-list") )
        )


        underLyingRow?.classList.remove('over-down', 'over-up')
        if (currentUnderLyingRow?.id < clone.id.split("-")[0]) {
            currentUnderLyingRow?.classList.add('over-down')
        } else {
            currentUnderLyingRow?.classList.add('over-up')
        }
        underLyingRow = currentUnderLyingRow
    }

    function handleMouseUp(){
        window.onmousemove = null
        const fromIndex = clone.id.split("-")[0]
        clone.remove()

        if (underLyingRow) {
            underLyingRow.classList.remove('over-down', 'over-up')
            const toIndex = underLyingRow.id
            self.documents.splice(toIndex, 0, self.documents.splice(fromIndex, 1)[0]);
        }
    }
}

ko.applyBindings(new ViewModel());