import { useEffect } from "react";
import { Hub } from "@aws-amplify/core";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useSnackbar } from "notistack";
import { get } from "lodash";

export const useAuthenticateEffect = () => {
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
};

export default (Component) => withAuthenticator(Component, { hideSignUp: true });
