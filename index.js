'use strict';

const STORE = {
  items: [
    {name: "apples", checked: false},
    {name: "oranges", checked: false},
    {name: "milk", checked: true},
    {name: "bread", checked: false}
  ],
  hideCompleted: false,
  searchName: null,
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => {
    if(STORE.hideCompleted && item.checked)
      return '';
    
    if(STORE.searchName && !item.name.toLowerCase().includes(STORE.searchName.toLowerCase()))
      return '';

    return generateItemElement(item, index);
  });
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`)

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}


function toggleHideCompletedForList() {
  console.log("Toggling hideCompleted property for list to " + !STORE.hideCompleted);
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleHideCompletedItemsClicked() {
  $('#hideCompletedItems').on('click', event => {
    console.log('`handleHideCompletedItemsClicked` ran');
    toggleHideCompletedForList();
    renderShoppingList();
  });
}

function setSearchNameForList(searchName) {
  console.log(`Changing STORE.searchName value from '${STORE.searchName} to '${searchName}'`);
  STORE.searchName = searchName;
}

function handleSearchNameClicked() {  
  $('#searchName').on('keyup', event => {
    console.log('`handleSearchNameClicked` ran');
    const searchName = event.currentTarget.value;
    setSearchNameForList(searchName);
    renderShoppingList();
  });
}

function editListItem() {
  console.log('`editListItem` ran');
}

function handleEditItemNameClicked() {
  console.log('`handleEditItemNameClicked` ran');
  editListItem();
  renderShoppingList();
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCompletedItemsClicked();
  handleSearchNameClicked();
  handleEditItemNameClicked();
}

$(handleShoppingList);