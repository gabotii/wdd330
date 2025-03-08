
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error("Error getting data from localStorage:", e);
    return [];
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  try {
    let existingData = getLocalStorage(key);

    if (Array.isArray(data)) {
      existingData = data;
    } else {
      existingData.push(data);
    }

    localStorage.setItem(key, JSON.stringify(existingData));
  } catch (e) {
    console.error("Error saving data to localStorage:", e);
  }
}

export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
