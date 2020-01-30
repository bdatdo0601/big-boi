import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: { position: "relative", overflow: "visible", borderRadius: "10px" },
  cardHeader: {
    display: "inline-block",
    width: "100%",
    padding: "0px",
    marginBottom: 12,
    overflow: "visible",
  },
  headerContent: {
    boxShadow:
      "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    position: "absolute",
    width: "84%",
    marginLeft: "8%",
    marginRight: "8%",
    top: -15,
    borderRadius: "10px",
    minHeight: "55px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.secondary.main});`,
  },
}));

export default useStyles;
