export const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer); // Clears the previous timer if it's still running
    timer = setTimeout(() => func(...args), delay); // Sets a new timer that will call the function after the delay
  };
};



