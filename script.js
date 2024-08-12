// script.js
const apiUrl = 'http://localhost:3000/items'; // Replace with your API endpoint

document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');
    const itemList = document.getElementById('itemList');

    let editIndex = -1;

    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemText = itemInput.value.trim();
        if (itemText === '') return;

        if (editIndex >= 0) {
            await updateItem(editIndex, itemText);
        } else {
            await addItem(itemText);
        }
        itemInput.value = '';
        itemInput.focus();
    });

    // Fetch and display items from the API
    async function fetchItems() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const items = await response.json();
            items.forEach(item => addItemToList(item));
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    // Add a new item to the API
    async function addItem(text) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newItem = await response.json();
            addItemToList(newItem);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    // Update an existing item in the API
    async function updateItem(id, newText) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedItem = await response.json();
            const li = itemList.children[editIndex];
            li.firstChild.textContent = updatedItem.text;
            editIndex = -1;
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    // Delete an item from the API
    async function deleteItem(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const index = Array.from(itemList.children).findIndex(li => li.dataset.id == id);
            if (index > -1) {
                itemList.removeChild(itemList.children[index]);
            }
            editIndex = -1;
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    // Helper function to add an item to the list
    function addItemToList(item) {
        const li = document.createElement('li');
        li.textContent = item.text;
        li.dataset.id = item.id;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';
        editButton.addEventListener('click', () => editItem(item.id, item.text));
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => deleteItem(item.id));

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        itemList.appendChild(li);
    }

    // Initialize the page with existing items
    fetchItems();

    function editItem(id, text) {
        itemInput.value = text;
        editIndex = id;
    }
});
