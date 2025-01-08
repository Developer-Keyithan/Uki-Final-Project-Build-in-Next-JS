interface Address {
  no?: number;
  street?: string;
  town: string;
  division?: string;
  district: string;
  contact: string;
  type: 'home' | 'work-place' | 'other-location';
}

const addressData: Address[] = [
  {
    no: 91,
    town: 'Arasadikkulam',
    division: 'Cheddikulam',
    district: 'Vavuniya',
    contact: '77 1234 567',
    type: 'home',
  },
  {
    no: 57,
    street: '2nd Cross Street',
    town: 'Vavuniya',
    district: 'Vavuniya',
    contact: '77 1234 567',
    type: 'work-place',
  },
  {
    town: 'Nochchimottai',
    division: 'Omanthai',
    contact: '77 1234 567',
    district: 'Vavuniya',
    type: 'other-location',
  },
  {
    town: 'Pampaimadu',
    division: 'Vavuniya',
    district: 'Vavuniya',
    contact: '77 1234 567',
    type: 'other-location',
  },
];

export default addressData;
