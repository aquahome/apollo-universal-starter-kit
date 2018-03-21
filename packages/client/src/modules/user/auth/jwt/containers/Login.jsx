/* eslint-disable no-undef */
// React
import React from 'react';
import { SecureStore } from 'expo';

// Apollo
import { graphql, compose, withApollo } from 'react-apollo';

// Components
import LoginView from '../../../components/LoginView';
import log from '../../../../../../../common/log';
import { withCheckAction } from '../../../containers/AuthBase';

import CURRENT_USER_QUERY from '../../../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  render() {
    return <LoginView {...this.props} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  graphql(LOGIN, {
    props: ({ ownProps: { client, changeAction }, mutate }) => ({
      login: async ({ email, password }) => {
        try {
          const { data: { login } } = await mutate({
            variables: { input: { email, password } }
          });
          if (login && login.tokens) {
            const { accessToken, refreshToken } = login.tokens;
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
          }
          if (login.errors) {
            return { errors: login.errors };
          }
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
          await changeAction('Login');
        } catch (e) {
          log.error(e);
        }
      }
    })
  })
)(Login);

export default withCheckAction(LoginWithApollo);
