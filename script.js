// Class Item To Do
// Objects instantiated from this class are the items specified by the user to do.
class ItemToDo {
    static idNum = 0;
    constructor(name, desc, due, priority){
        this.name = name;
        this.desc = desc;
        this.due = due;
        this.priority = priority;
        ItemToDo.idNum = ItemToDo.idNum + 1;
        this.itemID = ItemToDo.idNum;
    }

    static limitDate() {
        document.getElementById('itemDueInput').setAttribute('min','')     
    }
}

// Class Files. Objects instantiated from this class are the files that contain the items to do.
class Files {
    constructor(fileName){
        this.fileName = fileName;
        this.fileItems = [];
    }

    // This static attribute contains all the files created.
    static filesList = []
    
    // Static Methods
    static validateFileName(fileName){
        if (Files.getFile(fileName) != undefined) {
            return 'false' // Return false if the file is not unique.
        }else{
            return 'true' // Return true if the file is unique.
        }
    }

    // This method adds a file to the static files attribute
    static addFile(file) {
        Files.filesList.push(file)
    }

    // This method will remove a file from the files static variable.
    static removeFile(file){
        for (let i = 0; i < Files.filesList.length; i++){
            if (Files.filesList[i].fileName == file){
                Files.filesList.splice(i,1);
            }else{
                continue;
            }
        }
    }
    
    // This will get a specified file from the static list of files.
    static getFile(file){
        for (let i = 0; i < Files.filesList.length; i++){
            if (Files.filesList[i].fileName == file){
                return Files.filesList[i];
            }else{
                continue;
            }
        }
    }

    static returnAllFiles(){
        return Files.filesList
    }

    // Get the files from local storage and add them to the static files.
    static getFilesStore() {
        // if(Store.getFiles().length == 0){
        //     return
        // }else{
        //     Files.filesList = Store.getFiles();
        // }
    }

    // Upload the files to local storage
    static addFilesStore(){
        // localStorage.clear()
        // Files.filesList.forEach(file => Store.addFile({file}))
        }
        
    // Dynamic Methods
    // Returns the fileName attriubte of the instance
    getFileName = () => {
        return this.fileName;
    }

    // Returns the fileItems list of the instance
    getFileItems = () => {
        return this.fileItems;
    }

    // Finds a certain item in the fileItems list.
    getItem = (item) => {
        for (let i = 0; i < this.fileItems.length; i++){
            if (this.fileItems[i].itemID == item){
                return this.fileItems[i];
            }else{
                continue
            }
        }
    }

    // Add a new item to the fileItems list
    addItem = (item) => {
        this.fileItems.push(item);
    }

    // Remove item from the fileItems list
    removeItem = (item) => {
        for (let i = 0; i < this.fileItems.length; i++){
            if (this.fileItems[i].itemID == item){
                this.fileItems.splice(i,1);
            }else{
                continue
            }       
        }
    }

}

// Storage Class
class Store {

    static addFile(file) {
        const files = Store.getFiles();

        files.push(file)

        localStorage.setItem('files', JSON.stringify(files))
    }

    static removeFile() {
        const files = Store.getFiles();

        files.forEach((file,index) => {
            if(file.fileName === file) {
                files.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeAllFiles() {
        localStorage.clear()
    }


    static getFiles() {
        let files;
        if (localStorage.getItem('files') === null){
            files = [];
        }else {
            files = JSON.parse(localStorage.getItem('files'));
        }
        return files
    }    
}


// UI class
class UI {
    // Add File UI
    static clearFileFields() {
        document.getElementById('fileName').value = '';
    }

    // Display the add File form
    static displayAddFile() {
        document.querySelector(".editFolderWrapper").classList.add('editFolderWrapperActive');
        document.querySelector(".editFolder").classList.add('editFolderActive');
    }

    // Hide the add file form
    static hideAddFile() {
        document.querySelector(".editFolderWrapper").classList.remove('editFolderWrapperActive');
        document.querySelector(".editFolder").classList.remove('editFolderActive');
        UI.clearFileFields()
    }

    // Submit the file form
    static submitFileForm(e) {
        e.preventDefault()
        
        const fileName = document.getElementById('fileName').value;

        if (Files.validateFileName(fileName) == 'true'){
            const fl = new Files(fileName);
            Files.addFile(fl);
            let li = document.createElement('li');
            li.textContent = `${fileName}`
            li.classList.add('fileItem')

            let deleteIcon = document.createElement('i')
            deleteIcon.classList.add('fas','fa-minus-circle');
            deleteIcon.addEventListener('click', (e)=>{UI.deleteFile(e.target)})

            li.appendChild(deleteIcon);
            li.addEventListener('click',(e) => {UI.displayItemsToDo(e)})
            document.querySelector('.filesList').appendChild(li)
            // update the local storage
            Files.addFilesStore()
        }else{
            alert('file name is not unique')
        }

        UI.hideAddFile()
    }

    // Display the files under the file section
    static displayFilesColumn() {
        // Gets the files from the local storage
        Files.getFilesStore()

        let listOfFiles = Files.returnAllFiles()

        if (listOfFiles.length == 0) {
            return;
        }

        listOfFiles.forEach(file => {
            let li = document.createElement('li');
            li.textContent = `${file.fileName}`
            li.classList.add('fileItem')

            let deleteIcon = document.createElement('i')
            deleteIcon.classList.add('fas','fa-minus-circle');
            deleteIcon.addEventListener('click', (e)=>{UI.deleteFile(e.target)})

            li.appendChild(deleteIcon);

            li.addEventListener('click',(e) => {UI.displayItemsToDo(e)})

            document.querySelector('.filesList').appendChild(li);
        });
    }

    // Delete functionality for file
    static deleteFile (el) {
        if(el.parentElement.classList.contains('fileItemActive')){
            let childsLi = document.getElementById('itemList');
        
            while (childsLi.lastChild) {
                childsLi.removeChild(childsLi.lastChild);            
            }
        }
        el.parentElement.remove();
        Files.removeFile(el.parentElement.textContent);
        // update the local storage
        Files.addFilesStore()
    }

    // Displays the Add Item Form
    static displayAddItem() {
        if (document.querySelector('.fileItemActive') == undefined){
            console.log("Please choose a file")
            return
        ;}
        document.querySelector('.inputWrapper').classList.add('inputWrapperActive');
    }

    // Hides the Add Item Form
    static hideAddItem() {
        document.querySelector('.inputWrapper').classList.remove('inputWrapperActive');
        UI.clearItemForm()
    }

    static clearItemForm() {
        document.getElementById('itemNameInput').value = '';
        document.getElementById('itemDescInput').value = '';
        document.getElementById('itemDueInput').value = '';
        document.getElementById('itemPriorityInput').value = '';
    }

    // Takes all the inputs found on the item form, creates an object representing the info and creates a visualization for the item.
    static submitItemForm(e) {
        // Prevents the form from acutally submitting
        e.preventDefault()

        // Takes all the data found inside the inputs in the form.
        const itemName = document.getElementById('itemNameInput').value;
        const itemDesc = document.getElementById('itemDescInput').value;
        const itemDate = document.getElementById('itemDueInput').value;
        const itemPriority = document.getElementById('itemPriorityInput').value;

        // Retrieves the File name that is active.
        const fileName = document.querySelector('.fileItemActive').textContent;


        // Create the item object
        let itemToDo = new ItemToDo(itemName, itemDesc, itemDate, itemPriority);

        // Retrieve the file
        let fileM = Files.getFile(fileName);

        // Add item to file
        fileM.addItem(itemToDo);

        // Hides the form
        UI.hideAddItem()

        // Clears the Form
        UI.clearItemForm()

        // Creates the DOM visualization for the item.
        UI.createToDoDOM(itemToDo)

        // update the local storage
        Files.addFilesStore()
    }

    // Creates the DOM visualization for the item.
    static createToDoDOM(item) {   // The item parameter is a ToDoList instance 
        // Takes the item name
        const itemName = item.name;

        // Create a list item
        let li = document.createElement('li');

        // Adds a left border with a color depending the priority level. 
        switch(item.priority){
            case '0':
                li.classList.add('itemLow');    //Green
                break;
            case '50':
                li.classList.add('itemMed');    //Yellow
                break;
            case '100':
                li.classList.add('itemHigh')    //Red
                break;
        } 

        // Add the custom ID of the item to the HTML
        li.setAttribute('data-ID', `${item.itemID}`)

        // Insert inside the list item the items name
        li.textContent = itemName;

        // Append the list item to the second column.
        document.getElementById('itemList').appendChild(li);

        // Add an event listener for when the item is clicked to display it on the third column.
        li.addEventListener('click', (e) => {UI.displayItem(e)})
    }

    // Loops through all the items found in a certain file and create a visualization for the item.
    static displayItemsToDo(e) {
        // Clears the item information tabe (3rd column);
        UI.clearItemDisplay()
        // Becuase the File item in the files section has two envents listenrers(one for the delete and one for the active file) we want to check if the file is deleted, if yes then this function will stop.
        if(Files.getFile(e.target.textContent) == undefined){
            return;
        }

        // Removes any file element with the class of fileItemActive.
        document.querySelectorAll('.fileItemActive').forEach(item => {item.classList.remove('fileItemActive')})
        
        // Add a fileItemActive class to th active element.
        e.target.classList.add('fileItemActive');

        // Clear the display from old items in the second column.
        let childsLi = document.getElementById('itemList');
        
        while (childsLi.lastChild) {
            childsLi.removeChild(childsLi.lastChild);            
        }

        // The active file name is retrieved
        let activeFile = e.target.textContent;

        // Get the file from the static file list
        let fileItems = Files.getFile(activeFile).getFileItems();

        // Add each item to do in the file to the second column'
        fileItems.forEach(item => {
            UI.createToDoDOM(item)
        })
    }
    
    static clearItemDisplay (){
        document.getElementById('itemNameMini').textContent = '';
        document.getElementById('itemDescMini').textContent = '';
        document.getElementById('itemMiniDue').textContent = '';
        document.getElementById('itemMiniPrio').textContent = '';
    }

    static displayItem(e) {
        // Removes any class from any element containing the activeItem class.
        if (document.querySelector('.activeItem') != undefined){
            document.querySelector('.activeItem').classList.remove('activeItem');
        }

        // Add an class to show item is active
        e.target.classList.add('activeItem')

        // Clears the UI
        UI.clearItemDisplay()

        // Assign the item ID specified in the HTML to the itemU variable.
        let itemU = e.target.getAttribute('data-ID');

        // Retrieves the file currently active in the UI
        let activeFile = document.querySelector('.fileItemActive').textContent;

        // Search for the item by using the item ID found in the HTML and comparing them to the items found in the current active file.
        let itemObj = Files.getFile(activeFile).getItem(itemU);

        // Assign each field in the HTML with the info specified.
        document.getElementById('itemNameMini').textContent = itemObj.name;
        document.getElementById('itemDescMini').textContent = itemObj.desc;
        document.getElementById('itemMiniDue').textContent = itemObj.due;
        let prio = document.getElementById('itemMiniPrio')  
        
        // Depending on the item priority level a class will be added to the element.
        switch (itemObj.priority) {
            case '0':
                prio.textContent = 'Low';
                prio.classList.add('.itemPrioLow')
                break;
            case '50':
                prio.textContent = 'Meduim';
                prio.classList.add('.itemPrioMed')
                break;
            case '100':
                prio.textContent = 'High';
                prio.classList.add('.itemPrioHigh')
                break;
        }
    }

    static deleteItem(){
        // Checks if an item is active.
        if (document.querySelector('.activeItem') == undefined){
            console.log("Please choose a item to edit")
            return;
        }
        // Get the items file.
        let itemsFile = document.querySelector('.fileItemActive').textContent;
        itemsFile = Files.getFile(itemsFile);

        // Get the code of the item active
        let itemCode = document.querySelector('.activeItem').getAttribute('data-ID');

        // Delete the item from the file.
        itemsFile.removeItem(itemCode);

        // Clear the third column UI.
        UI.clearItemDisplay();

        // Remove the item from the middle column
        document.querySelector('.activeItem').remove()

        // update the local storage
        Files.addFilesStore()
    }

    static editItems(){
        // Checks if an item is active.
        if (document.querySelector('.activeItem') == undefined){
            console.log("Please choose a item to delete")
            return;
        }
        // Change the title to Edit tiem
        document.getElementById('itemHeader').textContent = 'EDIT ITEM';

        // Displays the edit form 
        UI.displayAddItem();

        //  Remove all event listenrs and add the new ones
        let old_element_Confirm = document.getElementById('confirmForm');
        let new_element_Confirm = old_element_Confirm.cloneNode(true);
        old_element_Confirm.parentNode.replaceChild(new_element_Confirm, old_element_Confirm);


        let old_element_Cancel = document.getElementById('cancelForm');
        let new_element_Cancel = old_element_Cancel.cloneNode(true);
        old_element_Cancel.parentNode.replaceChild(new_element_Cancel, old_element_Cancel);

        new_element_Cancel.addEventListener('click', UI.cancelEditItem)
        new_element_Confirm.addEventListener('click', UI.submitEditItem)

        // Get the active item ID number and the active file name
        let idNum = document.querySelector('.activeItem').getAttribute('data-ID');
        let fileName = document.querySelector('.fileItemActive').textContent;

        // Get the item object
        let itemObj = Files.getFile(fileName).getItem(idNum);
        
        // Insert the data of the item inside the form.
        document.getElementById('itemNameInput').value = itemObj.name;
        document.getElementById('itemDescInput').value = itemObj.desc;
        document.getElementById('itemDueInput').value = itemObj.due;
        document.getElementById('itemPriorityInput').value = itemObj.priority;

        // update the local storage
        Files.addFilesStore()
    }

    static submitEditItem() {
        // Get the active item ID number and the active file name
        let idNum = document.querySelector('.activeItem').getAttribute('data-ID');
        let fileName = document.querySelector('.fileItemActive').textContent;

        // Get the item object
        let itemObj = Files.getFile(fileName).getItem(idNum);

        // ADd the new values to the object
        itemObj.name = document.getElementById('itemNameInput').value;
        itemObj.desc = document.getElementById('itemDescInput').value;
        itemObj.due = document.getElementById('itemDueInput').value;
        itemObj.priority = document.getElementById('itemPriorityInput').value;

        // Change the the text name of the item inside the middle column
        document.querySelector('.activeItem').textContent = itemObj.name;

        // Change the left border of the item accroding to the priority and the priority tab under the item information
        let priorityStat = document.querySelector('.activeItem')

        let prio = document.getElementById('itemMiniPrio') 

        priorityStat.classList.remove('itemLow', 'itemMed', 'itemHigh');

        switch (itemObj.priority) {
            case '0':
                priorityStat.classList.add('itemLow')
                prio.textContent = 'Low'
                break;
            case '50':
                priorityStat.classList.add('itemMed')
                prio.textContent = 'Meduim'
                break;
            case '100':
                priorityStat.classList.add('itemHigh')
                prio.textContent = 'High'
                break;
        }

        // update the local storage
        Files.addFilesStore()

        // Clear the UI and return everything to normal
        UI.cancelEditItem()

        // Update the item information display.
        document.getElementById('itemNameMini').textContent = itemObj.name;
        document.getElementById('itemDescMini').textContent = itemObj.desc;
        document.getElementById('itemMiniDue').textContent = itemObj.due;
        
    }

    static cancelEditItem() {
        // Return the column name to original
        document.getElementById('itemHeader').textContent = 'ITEM INFORMATION';

        // Hide the form
        UI.hideAddItem()

        // Clear the form
        UI.clearItemForm()

        // Return the normal event listeners to the form
        let old_element_Confirm = document.getElementById('confirmForm');
        let new_element_Confirm = old_element_Confirm.cloneNode(true);
        old_element_Confirm.parentNode.replaceChild(new_element_Confirm, old_element_Confirm);

        let old_element_Cancel = document.getElementById('cancelForm');
        let new_element_Cancel = old_element_Cancel.cloneNode(true);
        old_element_Cancel.parentNode.replaceChild(new_element_Cancel, old_element_Cancel);

        new_element_Cancel.addEventListener('click', UI.hideAddItem)
        new_element_Confirm.addEventListener('click', (e) => {UI.submitItemForm(e)})
    }
}   

// Eventlisteners
(() => {
    // Get the files saved in the local storage

    // Eventlistener for when the DOM is loaded to display the Files saved inside the local storage.
    // document.addEventListener('DOMContentLoaded', UI.displayFilesColumn);

    // Eventlistener for the button found beside the File title to display the add file form
    document.getElementById('addFile').addEventListener('click', UI.displayAddFile);

    // This event listener is on the submit button in the file form to add a file
    document.querySelector('.editFolder').addEventListener('submit', (e) => {UI.submitFileForm(e)})

    // This event listener is found on the cancel button found in the file form which will hide the add form
    document.querySelector('.fileCancel').addEventListener('click', UI.hideAddFile)

    // This event listener is found on the second column '+' which will add display the form to add a new item.
    document.querySelector('.addButton').addEventListener('click', UI.displayAddItem)

    // Eventlistener for the submit button on the Item form
    document.getElementById('confirmForm').addEventListener('click', (e) => {UI.submitItemForm(e)})

    // Eventlistener for the cancel button on the item form
    document.getElementById('cancelForm').addEventListener('click', UI.hideAddItem)

    // Eventlistener for the delete button of the item
    document.getElementById('deleteItem').addEventListener('click', UI.deleteItem);

    // Eventlistener for the edit button
    document.getElementById('editItem').addEventListener('click', UI.editItems)
  })();
  



