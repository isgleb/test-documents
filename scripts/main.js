
const requiredStr = "Обязательный"

function ReservationsViewModel() {
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


    this.allow = function (data, event) {
        data.isDraggable(true)
        return true;
    }

    this.handleDragStart = function (data, event) {

        event.target.style.opacity = '0.4';
        const objectIndex = self.documents().findIndex(element => element === data)

        event.dataTransfer.setData('text/plain', objectIndex)
        return true;
    }

    this.stopChildPropagation = function (data,event) {
        // console.log(event.target.parentElement.classList)
        // if (event.target.parentElement.classList.contains('row')) {
        //     event.target.parentElement.classList.add('over');
        // }
        // if (event.target.parentElement.parentElement.classList.contains('row')) {
        //     event.target.parentElement.classList.add('over');
        // }
        // event.stopPropagation()
    }

    this.handleDragOver = function (data, event) {
        // function prevents default
    }

    this.handleDragEnter = function (data, event) {
        event.target.classList.add('over');
        return true
    }

    this.handleDragLeave = function (data, event) {
        event.target.classList.remove('over');
    }

    this.handleDragEnd = function (data, event) {
        event.target.style.opacity = '1';
        data.isDraggable(false)
        // event.toElement.classList.remove('over');
    }

    this.handleDrop = function(data, event) {
        event.target.classList.remove('over');

        const fromIndex = self.documents().findIndex(a=> a===data)
        const toIndex = event.dataTransfer.getData('text/plain')
        // по разному вверх и вниз, и на шаблоне как раз так, как дает функция, надо изменить отображение рамки и все

        self.documents.splice(toIndex, 0, self.documents.splice(fromIndex, 1)[0]);

        // self.documents.splice(fromIndex, 0, self.documents.splice(toIndex, 1)[0]);
        return false;
    }
}

ko.applyBindings(new ReservationsViewModel());