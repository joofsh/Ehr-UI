export function mockFormField(name) {
  return {
    name,
    onChange: () => {}
  };
}

export function mockFormAddress(name) {
  return {
    street: mockFormField('street'),
    city: mockFormField('city'),
    state: mockFormField('state'),
    zipcode: mockFormField('zipcode')
  }
}
