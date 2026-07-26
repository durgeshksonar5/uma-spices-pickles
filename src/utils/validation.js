/**
 * Validates checkout form details with clear simple messages
 * @param {Object} formData 
 * @returns {Object} errors object
 */
export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = "Please enter a valid mobile number.";
  } else {
    const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '');
    if (!/^\d{10,12}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid mobile number.";
    }
  }

  if (!formData.address || !formData.address.trim()) {
    errors.address = "Please enter your delivery address.";
  }

  if (!formData.city || !formData.city.trim()) {
    errors.city = "Please enter your city.";
  }

  if (!formData.pincode || !formData.pincode.trim()) {
    errors.pincode = "Please enter a valid PIN code.";
  } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
    errors.pincode = "Please enter a valid PIN code.";
  }

  return errors;
};
