
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


        const categoryIndex =
            e.target.parentElement.parentElement.getAttribute('category-index') ||
            e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('category-index');

        const documentIndex = e.target.parentElement.parentElement.getAttribute('document-index')
        clone = e.target.parentElement.parentElement.cloneNode(true)


        console.log(categoryIndex)
        console.log(documentIndex)

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

        console.log(cloneCatIndex)

        if (cloneCatIndex) {
            if (underLyingDocIndex < cloneDocIndex) {
                currentUnderLyingRow?.classList.add('over-down')
            } else {
                currentUnderLyingRow?.classList.add('over-up')
            }
        } else {
            if (underLyingCatIndex < cloneCatIndex) {
                currentUnderLyingRow?.classList.add('over-down')
            } else {
                currentUnderLyingRow?.classList.add('over-up')
            }
        }

        underLyingRow = currentUnderLyingRow
    }

    function handleMouseUp(){
        window.onmousemove = null
        const fromIndex = clone.getAttribute("document-index")
        clone.remove()

        if (underLyingRow) {
            underLyingRow.classList.remove('over-down', 'over-up')
            const toIndex = underLyingRow.getAttribute("document-index")
            self.documents.splice(toIndex, 0, self.documents.splice(fromIndex, 1)[0]);
        }
    }
}

ko.applyBindings(new ViewModel());
