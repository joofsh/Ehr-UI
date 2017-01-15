import { visit } from './TestHelper';

describe('Login flow', () => {
  it('allows user to login', (client) => {
    client.url('http://dcresources.org/login')
      .waitForElementVisible('body', 1000)
      .assert.urlContains('/login')
      .assert.title('Login | DC Resources')
      .assert.visible('#identifier')
      .assert.visible('#password');

    client
      .setValue('#identifier', 'joofsh')
      .setValue('#password', 'foobar')
      .click('.btn-success')
      .waitForElementVisible('.banner-title', 1000)
      .assert.title('DC Resources')
      .end();
  });
});
