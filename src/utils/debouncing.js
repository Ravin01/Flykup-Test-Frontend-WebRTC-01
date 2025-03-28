const debounce = (func, delay) => {
    let timeoutId;
  
    const debounced = function (...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  
    debounced.cancel = () => {
      clearTimeout(timeoutId);
    };
  
    return debounced;
  };
  
  export default debounce;
  