import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Hub } from "aws-amplify";
import { Authenticator, SignUp, Greetings } from "aws-amplify-react";
import { useSnackbar } from "notistack";

const AuthenticatorWrapper = ({ children, authState, ...props }) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    Hub.listen("auth", res => {
      const errorMsg = res.payload.data.message ? res.payload.data.message : "";
      if (errorMsg) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    });
    return () => {
      Hub.remove("auth");
    };
  }, [enqueueSnackbar]);
  return <>{authState && authState === "signedIn" ? children : null}</>;
};

AuthenticatorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  authState: PropTypes.string,
};

AuthenticatorWrapper.defaultProps = {
  authState: "",
};

const withCustomAWSAuthenticator = Component => props => {
  return (
    <Authenticator hide={[SignUp, Greetings]} includeGreetings={false}>
      <AuthenticatorWrapper {...props}>
        <Component {...props} />
      </AuthenticatorWrapper>
    </Authenticator>
  );
};

export default withCustomAWSAuthenticator;
