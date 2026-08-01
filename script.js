var myForm = document.getElementById('myForm');
var myInput = document.getElementById('myInput');
var myItem = document.getElementById('myItem');

myForm.addEventListener('submit', function(event) {
    event.preventDefault();
    createItem(myInput.value);
});

function createItem(inputItems) {
    var items = `<li>${inputItems}
    <button onclick="deleteItem(this)">Delete</button></li>`;
    myItem.insertAdjacentHTML('before end', items);
    myInput.value = ""
    myInput.focus()
}

function deleteItem(button) {
    ElementToDelete.parentElement.remove();
}