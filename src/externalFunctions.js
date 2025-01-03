// localStorageUtils.js

/**
 * Safely update `myDroppedItemsList` in localStorage
 * and dispatch a custom event for same-tab re-renders.
 */
export function updateMyDroppedItemsList(updatedList) {
    // 1. Write to localStorage
    localStorage.setItem("myDroppedItemsList", JSON.stringify(updatedList));
  
    // 2. Dispatch a custom event so other components can listen
    window.dispatchEvent(new Event("myDroppedItemsListUpdated"));
  }
  