
const requiredStr = "Обязательный"

function ViewModel() {
    const self = this;

    self.categories = ko.observableArray(
        categories.map(cat => {
            cat.isOpen = ko.observable(true);
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

        const [documentIndex, categoryIndex] = getIndexes(e.target.parentElement.parentElement)

        clone = e.target.parentElement.parentElement.cloneNode(true)

        clone.setAttribute('category-index', categoryIndex)
        clone.setAttribute('document-index', documentIndex) //todo makes problem

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

        const [underLyingDocIndex, underLyingCatIndex] = getIndexes(currentUnderLyingRow)

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

    function handleMouseUp(){
        window.onmousemove = null
        const [fromDocIndex, fromCatIndex] = getIndexes(clone)
        clone.remove()
        underLyingRow?.classList.remove('over-down', 'over-up')
        // debugger

        if (underLyingRow) {
            const [toDocIndex, toCatIndex] = getIndexes(underLyingRow)

            console.log()

            const areCategories = fromDocIndex < 0 && toDocIndex < 0
            const fromHasCategory = 0 <= fromCatIndex
            const toHasCategory = 0 <= toCatIndex


            console.log(fromHasCategory)
            console.log(toHasCategory)


            // debugger
            switch (true) {
                case areCategories: self.categories.splice(toCatIndex, 0, self.categories.splice(fromCatIndex, 1)[0]); return;
                case (fromHasCategory && toHasCategory): self.documents.splice(toDocIndex, 0, self.documents.splice(fromDocIndex, 1)[0]); return;
            }


            let fromDocument

            if (fromHasCategory) {
                console.log("fromHasCategory")
                const documents = self.categories().at(fromCatIndex).documents()
                fromDocument = documents.splice(fromDocIndex, 1)[0]
                self.categories().at(fromCatIndex).documents(documents)
            } else {
                console.log("fromNotHasCategory")
                fromDocument = self.documents.splice(fromDocIndex, 1)[0]
            }

            if (toHasCategory) {
                console.log("toHasCategory")
                const documents = self.categories().at(toCatIndex).documents()
                documents.splice(toDocIndex, 0, fromDocument)
                self.categories().at(fromCatIndex).documents(documents)
            } else {
                console.log("toNotHasCategory")
                self.documents.splice(toDocIndex, 0, fromDocument)
            }
        }
    }

    function getIndexes(rowElement){
        const docIndex = rowElement?.getAttribute("document-index") || -1;
        const catIndex = rowElement?.getAttribute("category-index") ||
            rowElement?.parentElement.parentElement.getAttribute('category-index');

        return [Number(docIndex), Number(catIndex)]
    }
}

ko.applyBindings(new ViewModel());
