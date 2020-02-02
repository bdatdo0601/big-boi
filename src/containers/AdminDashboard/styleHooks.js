import { makeStyles } from "@material-ui/core/styles";

export const useDropzoneStyles = makeStyles(theme => ({
  imageDropzone: {
    minHeight: 100,
    marginTop: 16,
    backgroundColor: theme.palette.background.default,
    padding: 16,
  },
}));

export default {
  useDropzoneStyles,
};
