import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-addons-test-utils';
import { UserForm } from '../UserForm/UserForm';
import { mockFormField, mockFormAddress } from '../../__tests__/mockReduxForm';

describe('Component - UserForm', () => {
  it('works', () => {
    let fields = {
      first_name: mockFormField('first_name'),
      last_name: mockFormField('last_name'),
      gender: mockFormField('gender'),
      race: mockFormField('race'),
      birthdate: mockFormField('birthdate'),
      language: mockFormField('language'),
      mailing_address: mockFormAddress('mailing_address'),
      home_address: mockFormAddress('home_address')
    };

    let renderer = createRenderer();
    renderer.render(
      <UserForm
        fields={fields}
        submitting={false}
        isEditing={false}
        formTitle='This is my title'
        handleSubmit={() => {}}
      />);
    let result = renderer.getRenderOutput();
    expect(result.type).toBe('form');
  });
});
