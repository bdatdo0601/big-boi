import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Hub } from "aws-amplify";
import { Authenticator, SignUp, Greetings } from "aws-amplify-react";
import { useSnackbar } from "notistack";
import { get } from "lodash";

const AuthenticatorWrapper = ({ children, authState }) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    Hub.listen("auth", res => {
      const errorMsg = get(res, "payload.data.message", "");
      if (errorMsg) {
        console.error(res);
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

const withCustomAWSAuthenticator = Component => props => (
  <Authenticator hide={[SignUp, Greetings]} includeGreetings={false} theme={{ formContainer: { width: "100vw" } }}>
    <AuthenticatorWrapper {...props}>
      <Component {...props} />
    </AuthenticatorWrapper>
  </Authenticator>
);

export default withCustomAWSAuthenticator;
