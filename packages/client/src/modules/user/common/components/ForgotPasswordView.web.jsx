import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LayoutCenter } from '../../../common/components/index';
import { PageLayout } from '../../../common/components/web/index';

import ForgotPasswordForm from '../components/ForgotPasswordForm';
import settings from '../../../../../../../settings';

export default class ForgotPasswordView extends React.Component {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired
  };

  state = {
    sent: false
  };

  onSubmit = ({ forgotPassword }) => async values => {
    const result = await forgotPassword(values);
    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: 'Forgot password failed!' }
      );
    }

    this.setState({ sent: result });
  };

  render() {
    const { forgotPassword } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Forgot Password`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Forgot password page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Password Reset</h1>
          <ForgotPasswordForm onSubmit={this.onSubmit({ forgotPassword })} sent={this.state.sent} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}
