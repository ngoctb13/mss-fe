// storeUtils.js

export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      // Log errors hoặc handle lỗi
    }
  };
  
  export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined; // Không tìm thấy state trong localStorage, trả về undefined để sử dụng initialState
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined; // Có lỗi khi parse, trả về undefined để sử dụng initialState
    }
  };
  