
const requiredStr = "Обязательный"

function ViewModel() {
    const self = this;

    self.categories = ko.observableArray(
        categories.map(cat => {
            cat.isOpen = ko.observable(false);
            cat.documents = ko.observable(cat.documents)
            return cat
        })
    );

    self.documents = ko.observableArray(documents);

    self.searchValue = ko.observable("");

    self.showClearIcon = ko.computed(() => {
        return !!this.searchValue();
    }, this);

    self.clearSearch = () => this.searchValue("")

    self.openList = (parent) => {
        const isOpenNow = parent.isOpen()
        parent.isOpen(!isOpenNow)
    }

    let clone = null;
    let underLyingRow = null;
    let positionCorrection = {x: null, y: null}


    self.dragClick = (data, e) => {

        const rowWidth = e.currentTarget.parentElement.parentElement.offsetWidth
        const rightMargin = Number(window.getComputedStyle(e.currentTarget.parentElement).marginRight.replace("px",""))

        positionCorrection.x = - rowWidth + rightMargin + Math.floor(e.target.offsetWidth/2)
        positionCorrection.y = - e.target.offsetHeight

        const [categoryIndex, documentIndex] = getIndexes(e.target.parentElement.parentElement)

        clone = e.target.parentElement.parentElement.cloneNode(true)

        clone.setAttribute('category-index', categoryIndex)
        clone.setAttribute('document-index', documentIndex)

        clone.classList.add('dragged-row')
        clone.style.width = `${rowWidth}px`
        clone.style.left= `${e.clientX + positionCorrection.x}px`;
        clone.style.top = `${e.clientY + positionCorrection.y}px`;

        document.body.appendChild(clone);

        window.onmousemove = handleDragging;
        window.onmouseup = handleMouseUp;
    }

    function handleDragging(e){
        clone.style.left= `${e.clientX + positionCorrection.x}px`;
        clone.style.top = `${e.clientY + positionCorrection.y}px`;

        const underlyingElements = document.elementsFromPoint(e.clientX, e.clientY)

        const currentUnderLyingRow = underlyingElements.find(
            el => ( el?.classList.contains(clone.classList[0]) && !el?.classList.contains("dragged-row") )
        )

        underLyingRow?.classList.remove('over-down', 'over-up')

        const underLyingDocIndex = currentUnderLyingRow?.getAttribute("document-index")
        const underLyingCatIndex = currentUnderLyingRow?.parentElement.getAttribute("category-index")

        const cloneDocIndex = clone.getAttribute("document-index")
        const cloneCatIndex = clone.getAttribute("category-index")

        let cssClass
        if (cloneDocIndex >= 0) {
            cssClass = underLyingDocIndex < cloneDocIndex ? 'over-down' : 'over-up'
        } else {
            cssClass = underLyingCatIndex < cloneCatIndex ? 'over-down' : 'over-up'
        }
        currentUnderLyingRow?.classList.add(cssClass)
        underLyingRow = currentUnderLyingRow
    }

    function handleMouseUp() {
        window.onmousemove = null
        const documentIndex = clone.getAttribute("document-index")
        const categoryIndex = clone.getAttribute("category-index")
        clone.remove()

        const [toDocIndex, toCatIndex] = getIndexes(underLyingRow)

        if (underLyingRow && documentIndex >= -1) {
            underLyingRow.classList.remove('over-down', 'over-up')
            self.documents.splice(toDocIndex, 0, self.documents.splice(documentIndex, 1)[0]);
        }
    }

    function getIndexes(rowElement){
        const docIndex = rowElement?.getAttribute("document-index") || -1
        const catIndex = rowElement?.getAttribute("category-index") ||
            underLyingRow?.parentElement.parentElement.getAttribute('category-index');
        return [docIndex, catIndex]
    }
}

ko.applyBindings(new ViewModel());
