
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

        console.log(event)

        // event.target.toElement.style.opacity = '0.4';
        // event.target.style.border= "3px solid red";
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
        clone.remove()
    }

    // window.onmousedown=(function(e){handleMouseDown(e);});


    // function handleMouseDown(e){
    //     // tell the browser we're handling this event
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // // get mouse position
    //     startX=parseInt(e.clientX);
    //     startY=parseInt(e.clientY);
    //     console.log(startX)
    //     console.log(startY)
    //     // // Is any div under the mouse?
    //     // draggingIndex=undefined;
    //     // for(var i=0;i<divs.length;i++){
    //     //     var d=divs[i];
    //     //     var x=parseInt(d.div.style.left);
    //     //     var y=parseInt(d.div.style.top);
    //     //     if(startX>x && startX<x+d.w && startY>y && startY<y+d.h){
    //     //         draggingIndex=i;
    //     //         isDown=true;
    //     //         break;
    //     //     }
    //     // }
    // }





//     // add some divs dynamically
//     addDiv(50,50,100,75,'blue','batch1');
//     addDiv(250,50,50,38,'green','batch1');
//
// // listen to mouse events
//     window.onmousedown=(function(e){handleMouseDown(e);});
//     window.onmousemove=(function(e){handleMouseMove(e);});
//     window.onmouseup=(function(e){handleMouseUp(e);});
//
//
//     function addDiv(x,y,w,h,bk,classname){
//         var div=document.createElement('div');
//         div.style.width=w+'px';
//         div.style.height=h+'px';
//         div.className=classname;
//         div.style.position='absolute';
//         div.style.left=x+'px';
//         div.style.top=y+'px';
//         div.style.background=bk;
//         divs.push({div:div,w:w,h:h});
//         document.body.appendChild(div);
//     }
//
//
//     function handleMouseDown(e){
//         // tell the browser we're handling this event
//         e.preventDefault();
//         e.stopPropagation();
//         // get mouse position
//         startX=parseInt(e.clientX);
//         startY=parseInt(e.clientY);
//         // Is any div under the mouse?
//         draggingIndex=undefined;
//         for(var i=0;i<divs.length;i++){
//             var d=divs[i];
//             var x=parseInt(d.div.style.left);
//             var y=parseInt(d.div.style.top);
//             if(startX>x && startX<x+d.w && startY>y && startY<y+d.h){
//                 draggingIndex=i;
//                 isDown=true;
//                 break;
//             }
//         }
//     }
//
//     function handleMouseUp(e){
//         // tell the browser we're handling this event
//         e.preventDefault();
//         e.stopPropagation();
//         isDown=false;
//     }
//
//     function handleMouseMove(e){
//         if(!isDown){return;}
//         // tell the browser we're handling this event
//         e.preventDefault();
//         e.stopPropagation();
//         // get mouse position
//         mouseX=parseInt(e.clientX);
//         mouseY=parseInt(e.clientY);
//         // move the dragging div by the distance the mouse has moved
//         var dragging=divs[draggingIndex].div;
//         var dx=mouseX-startX;
//         var dy=mouseY-startY;
//         startX=mouseX;
//         startY=mouseY;
//         dragging.style.left=(parseInt(dragging.style.left)+dx)+'px';
//         dragging.style.top=(parseInt(dragging.style.top)+dy)+'px';
//     }
}

ko.applyBindings(new ReservationsViewModel());