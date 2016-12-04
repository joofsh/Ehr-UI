import reducer, { initialState } from '../session';
import expect from 'expect';

let state;

describe('Session Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  it('REQUEST_NEWSLETTER_SIGNUP', () => {
    state = reducer(state, { type: 'REQUEST_NEWSLETTER_SIGNUP' });
    expect(state.newsletterSignupSuccess).toEqual(null);
    expect(state.isSubmittingNewsletterSignup).toEqual(true);
  });

  it('RECEIVE_NEWSLETTER_SIGNUP_SUCCESS', () => {
    state = reducer(state, { type: 'RECEIVE_NEWSLETTER_SIGNUP_SUCCESS' });
    expect(state.newsletterSignupSuccess).toEqual(true);
    expect(state.isSubmittingNewsletterSignup).toEqual(false);
  });

  it('RECEIVE_NEWSLETTER_SIGNUP_ERROR', () => {
    state = reducer(state, { type: 'RECEIVE_NEWSLETTER_SIGNUP_ERROR' });
    expect(state.newsletterSignupSuccess).toEqual(false);
    expect(state.isSubmittingNewsletterSignup).toEqual(false);
  });

  it('COMPLETE_NEWSLETTER_SIGNUP_SUCCESS', () => {
    state = reducer(state, { type: 'COMPLETE_NEWSLETTER_SIGNUP_SUCCESS' });
    expect(state.newsletterSignupSuccess).toEqual(null);
    expect(state.isSubmittingNewsletterSignup).toEqual(false);
    expect(state.isModalActive).toEqual(false);
  });
});
