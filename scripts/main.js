
const requiredStr = "Обязательный"

function ViewModel() {
    const self = this;

    const docIndexAttr = 'document-index'
    const catIndexAttr = 'category-index'

    const overDownClass = 'over-down'
    const overUPClass = 'over-up'

    const draggedClass = 'dragged-row'

    self.categories = ko.observableArray(
        categories.map(cat => {
            cat.isOpen = ko.observable(true);
            cat.show = ko.observable(true)
            cat.documents = ko.observableArray(cat.documents.map(doc => {
                doc.show = ko.observable(true)
                return doc;
            }))
            return cat;
        })
    );

    self.documents = ko.observableArray(
        documents.map( doc => {
            doc.show = ko.observable(true)
            return doc;
        })
    );

    self.search = (data, e) => {
        const searchValue = data.searchValue()

        if(0 < searchValue.length) {
            self.documents().forEach( doc => {
                const showDocument = doc.name.toLowerCase().includes(searchValue.toLowerCase())
                doc.show(showDocument)
            })

            self.categories().forEach(cat => {
                let showCategory = false
                cat.documents().forEach( doc => {
                    const showDocument = doc.name.toLowerCase().includes(searchValue.toLowerCase())
                    doc.show(showDocument)
                    if (showDocument) showCategory = true
                })
                showCategory = showCategory || cat.name.toLowerCase().includes(searchValue.toLowerCase())
                cat.show(showCategory)
            })
        } else {
            self.documents().forEach( doc => doc.show(true) )

            self.categories().forEach( cat => {
                cat.show(true)
                cat.documents().forEach( doc => doc.show(true) )
            })
        }
    }

    self.searchValue = ko.observable("");

    self.showClearIcon = ko.computed( () => !!this.searchValue() );

    self.clearSearch = () => {
        self.documents().forEach( doc => doc.show(true) )
        self.categories().forEach(cat => {
            cat.show(true)
            cat.documents().forEach( doc => doc.show(true) )
        })
        this.searchValue("")
    }

    self.deleteDoc = (data, e) => {
        const [documentIndex, categoryIndex] = getIndexes(e.target.parentElement.parentElement)
        $(e.target.parentElement.parentElement).slideUp( 150 , () => {
            self.categories().at(categoryIndex).documents.splice(documentIndex, 1)

            if (self.categories().at(categoryIndex).documents().length === 0) {
                self.categories().at(categoryIndex).isOpen(false)
            }
        })
    }

    self.deleteNoCatDoc = (data, e) => {
        const documentIndex = getIndexes(e.target.parentElement.parentElement)[0]
        $(e.target.parentElement.parentElement).slideUp( 150 , () => {
            self.documents.splice(documentIndex, 1)
        });
    }

    self.deleteCat = (data, e) => {
        const categoryIndex = getIndexes(e.target.parentElement.parentElement)[1]
        self.categories.splice(categoryIndex, 1)
    }

    self.openList = (parent, e) => {
        const isOpenNow = parent.isOpen()
        if (isOpenNow) {
            $(e.target.parentElement.parentElement.nextElementSibling).slideUp( 150 , () => {
                parent.isOpen(!isOpenNow)
            })
        } else {
            parent.isOpen(!isOpenNow)
            $(e.target.parentElement.parentElement.nextElementSibling).slideDown( 150 )
        }
    }

    let clone;
    let underLyingRow;
    let positionCorrection = {x: null, y: null}


    self.dragClick = (data, e) => {

        const rowWidth = e.currentTarget.parentElement.parentElement.offsetWidth
        const rightMargin = Number(window.getComputedStyle(e.currentTarget.parentElement).marginRight.replace("px",""))

        positionCorrection.x = - rowWidth + rightMargin + Math.floor(e.target.offsetWidth/2)
        positionCorrection.y = - e.target.offsetHeight // todo bug

        const [documentIndex, categoryIndex] = getIndexes(e.target.parentElement.parentElement)

        clone = e.target.parentElement.parentElement.cloneNode(true)

        clone.setAttribute(catIndexAttr, categoryIndex)
        clone.setAttribute(docIndexAttr, documentIndex)

        clone.classList.add(draggedClass)
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
            el => ( el?.classList.contains(clone.classList[0]) && !el?.classList.contains(draggedClass) )
        )

        underLyingRow?.classList.remove(overDownClass, overUPClass)

        const [underLyingDocIndex, underLyingCatIndex] = getIndexes(currentUnderLyingRow)

        const cloneDocIndex = clone.getAttribute(docIndexAttr)
        const cloneCatIndex = clone.getAttribute(catIndexAttr)

        //todo bug if docs between different categories wrong border
        let cssClass

        const areCategories = cloneDocIndex < 0

        if (areCategories) {
            console.log("if", cloneDocIndex)
            cssClass = underLyingCatIndex < cloneCatIndex ? overDownClass : overUPClass // todo bug when dragging to lower positioned Cat

        } else {
            console.log("else", cloneDocIndex)
            cssClass = (underLyingDocIndex < cloneDocIndex) ? overDownClass : overUPClass
        }
        currentUnderLyingRow?.classList.add(cssClass)
        underLyingRow = currentUnderLyingRow
    }

    function handleMouseUp(){

        window.onmousemove = null
        window.onmouseup = null
        underLyingRow?.classList.remove(overDownClass, overUPClass)
        clone.remove()

        const [fromDocIndex, fromCatIndex] = getIndexes(clone)
        let toDocIndex, toCatIndex

        if (underLyingRow) {
            [toDocIndex, toCatIndex] = getIndexes(underLyingRow)
            delete underLyingRow
        } else {
            if (fromDocIndex < 0) return;
            toDocIndex = self.documents().length
            toCatIndex = -1
        }

        const areCategories = fromDocIndex < 0 && toDocIndex < 0
        const bothHasSameCategory = fromCatIndex === toCatIndex && 0 <= fromCatIndex
        const bothHasNoCategory = fromCatIndex < 0 && toCatIndex < 0
        const fromHasCategory = 0 <= fromCatIndex
        const toHasCategory = 0 <= toCatIndex
        const documentToCategory = 0 <= fromDocIndex && toDocIndex < 0

        switch (true) {
            case areCategories: self.categories.splice(toCatIndex, 0, self.categories.splice(fromCatIndex, 1)[0]); return;
            case bothHasNoCategory: self.documents.splice(toDocIndex, 0, self.documents.splice(fromDocIndex, 1)[0]); return;
            case bothHasSameCategory: {
                self.categories()[fromCatIndex]
                    .documents.splice(toDocIndex, 0, self.categories()[fromCatIndex]
                        .documents.splice(fromDocIndex, 1)[0]); return;
            }
            default: {
                let fromDocument

                if (fromHasCategory) {
                    const documents = self.categories().at(fromCatIndex).documents()
                    fromDocument = documents.splice(fromDocIndex, 1)[0]
                    self.categories().at(fromCatIndex).documents(documents)
                } else {
                    fromDocument = self.documents.splice(fromDocIndex, 1)[0]
                }

                if (documentToCategory) {
                    self.categories().at(toCatIndex).documents.push(fromDocument)
                    return;
                }

                if (toHasCategory) {
                    const documents = self.categories().at(toCatIndex).documents()
                    documents.splice(toDocIndex, 0, fromDocument)
                    self.categories().at(toCatIndex).documents(documents)
                } else {
                    self.documents.splice(toDocIndex, 0, fromDocument)
                }
            }
        }
    }

    function getIndexes(rowElement){
        const docIndex = rowElement?.getAttribute(docIndexAttr) || -1;
        const catIndex = rowElement?.getAttribute(catIndexAttr) ||
            rowElement?.parentElement?.parentElement?.getAttribute(catIndexAttr);

        return [Number(docIndex), Number(catIndex)]
    }
}

ko.applyBindings(new ViewModel());
