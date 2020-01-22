import React, { useContext, useEffect } from "react";
import { Typography } from "@material-ui/core";
import DataStack from "../../components/DataStack";
import MAIN_PICTURE from "../../assets/main_picture.jpg";
import LayoutContext from "../../context/layout";

const keywordListMap = ["Puns Admirer", "Tech Enthusiast", "Programmer"];

export default function Landing() {
  const { isDark, setDefaultPadding } = useContext(LayoutContext);
  useEffect(() => {
    setDefaultPadding(false);
  }, [setDefaultPadding]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 72,
        }}
      >
        <img
          src={MAIN_PICTURE}
          alt="main_picture"
          style={{
            marginBottom: 16,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `${isDark ? "#fff" : "#000"} solid 5px`,
          }}
        />
        <Typography variant="h3">Dat Do</Typography>
        <Typography variant="h4">Software Engineer @ STW</Typography>
      </div>
      <div style={{ flex: 1, width: "100%" }}>
        <DataStack
          dataList={keywordListMap.map(keyword => (
            <>
              <Typography variant="h4" style={{ fontFamily: "Pacifico", color: "black" }}>
                {keyword}
              </Typography>
            </>
          ))}
          listStyle={{
            marginTop: 120,
            paddingTop: 0,
          }}
          itemContainerStyle={{
            height: 200,
            width: 300,
            cursor: "pointer",
          }}
          itemStyle={{
            background: "url(https://www.adammcfarland.com/wp-content/uploads/2009/03/blank-index-card.jpg)",
          }}
        />
      </div>
    </div>
  );
}
