
const requiredStr = "Обязательный"

function ViewModel() {
    const self = this;

    self.categories = ko.observableArray(
        categories.map(cat => {
            cat.isOpen = ko.observable(false);
            cat.isDraggable = ko.observable(false)
            return cat
        })
    );

    self.documents = ko.observableArray(
        documents.map(doc => {
            doc.isDraggable = ko.observable(false)
            return doc;
        })
    );

    this.searchValue = ko.observable("");

    this.showClearIcon = ko.computed(() => {
        return !!this.searchValue();
    }, this);

    this.isFirst = ko.pureComputed(function() {
        console.log(this)
        return true
    }, this);

    this.clearSearch = function () {
        this.searchValue("")
    }

    this.openList = function (parent){
        const isOpenNow = parent.isOpen()
        parent.isOpen(!isOpenNow)
    }

    let clone = null;
    let rowData = null;
    let rowIndex = null;
    let rowWidth = 0;
    let underLyingRow = null

    this.dragClick = function(data, e) {

        rowData = data
        rowIndex = self.documents().findIndex(a => a === data)

        const row = e.target.parentElement.parentElement
        clone = row.cloneNode(true)
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

        underLyingRow?.classList.remove('over')
        currentUnderLyingRow?.classList.add('over')
        underLyingRow = currentUnderLyingRow
    }

    function handleMouseUp(){
        window.onmousemove = null
        const fromIndex = clone.id
        clone.remove()

        if (underLyingRow) {
            const toIndex = underLyingRow.id
            self.documents.splice(toIndex, 0, self.documents.splice(fromIndex, 1)[0]);
        }
    }
}

ko.applyBindings(new ViewModel());