// formatCurrency.js
const formatNaira = (amount) => {
    const options = { 
      style: 'currency', 
      currency: 'NGN' 
    };
    
    const formatter = new Intl.NumberFormat('en-NG', options);
    
    return formatter.format(amount);
  };
  
  // Export the function
  export default formatNaira;
  