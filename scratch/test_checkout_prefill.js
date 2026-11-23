// Test phone cleaning and prefill logic for logged in user

const cleanIndianMobileNumber = (phoneStr) => {
  if (!phoneStr) return '';
  const digitsOnly = String(phoneStr).replace(/\D/g, '');
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return digitsOnly.slice(1);
  }
  if (digitsOnly.length >= 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
};

const resolveUserPrefill = (user, addresses, currentForm) => {
  if (!user) return currentForm;

  const defaultAddr = addresses?.find((a) => a.isDefault) || addresses?.[0];
  const defaultName = (user.name || user.fullName || defaultAddr?.name || '').trim();
  const rawPhone = user.mobileNumber || user.phone || user.phoneNumber || defaultAddr?.phone || '';
  const cleanedPhone = cleanIndianMobileNumber(rawPhone);

  return {
    name: currentForm.name ? currentForm.name : defaultName,
    phone: currentForm.phone ? currentForm.phone : cleanedPhone,
    address: currentForm.address
      ? currentForm.address
      : defaultAddr
      ? [defaultAddr.street, defaultAddr.city, defaultAddr.state].filter(Boolean).join(', ')
      : '',
    pincode: currentForm.pincode
      ? currentForm.pincode
      : defaultAddr?.postalCode
      ? String(defaultAddr.postalCode).replace(/\D/g, '').slice(0, 6)
      : '',
  };
};

// Case 1: Standard MongoDB user with mobileNumber
const user1 = {
  name: 'Afsal Khan',
  email: 'afsal@example.com',
  mobileNumber: '9876543210'
};
console.log('Case 1 (Standard User):', resolveUserPrefill(user1, [], { name: '', phone: '', address: '', pincode: '' }));

// Case 2: Demo user with +91 and spaces
const user2 = {
  name: 'Veyn Member',
  email: 'member@veyncore.com',
  mobileNumber: '+91 98765 43210'
};
console.log('Case 2 (Demo User):', resolveUserPrefill(user2, [], { name: '', phone: '', address: '', pincode: '' }));

// Case 3: User with saved addresses
const user3 = {
  name: 'Alex Veyn',
  email: 'alex@veyn.com',
};
const addresses3 = [
  {
    isDefault: true,
    name: 'Alex Veyn',
    street: 'Plot 42, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    phone: '+91 99887 76655'
  }
];
console.log('Case 3 (With Saved Address):', resolveUserPrefill(user3, addresses3, { name: '', phone: '', address: '', pincode: '' }));

// Case 4: Preserves user edits
console.log('Case 4 (Preserves User Edits):', resolveUserPrefill(user1, [], { name: 'Custom Name', phone: '9123456789', address: 'Custom St', pincode: '560001' }));
