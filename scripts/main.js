
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

        clone = e.target.parentElement.parentElement.cloneNode(true)
        clone.id+="-dragged"

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

        const rowClass = e.target?.parentElement.parentElement.classList[0]
        console.log(e.target?.parentElement.parentElement.classList)
        const currentUnderLyingRow = underlyingElements.find(
            el => ( el?.classList.contains(rowClass) && !el?.classList.contains("dragged-row") )
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
