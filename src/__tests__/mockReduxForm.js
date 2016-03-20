export function mockFormField(name) {
  return {
    name,
    onChange: () => {}
  };
}

export function mockFormAddress() {
  return {
    street: mockFormField('street'),
    city: mockFormField('city'),
    state: mockFormField('state'),
    zipcode: mockFormField('zipcode')
  };
}
