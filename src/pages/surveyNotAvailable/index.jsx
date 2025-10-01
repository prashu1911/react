import { Footer, ImageElement } from "components";
import { COMPANY_LOGO } from "config";
import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import WaveMeto from "../../assets/admin/images/wave_meto.png";
const SurveyNotAvailable = () => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {userData ? (
        <>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              paddingBottom: "80px",
              background: `url(${WaveMeto})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "600px",
              }}
            >
              <ImageElement
                previewSource={`${COMPANY_LOGO}/${
                  userData?.companyConfig?.logo ? userData?.companyConfig?.logo : "demo_logo.svg"
                }`}
              />
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#666",
                  lineHeight: 1.6,
                  marginTop: "2rem",
                }}
              >
{userData?.errorMessage?.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/gi, "") || ""}
</p>
            </div>
          </div>
          {/* <div
            style={{
              padding: "1rem",
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              backgroundColor: "#fff",
              zIndex: 1000,
            }}
          >
            <Footer />
          </div> */}
        </>
      ) : null}
    </div>
  );
};

export default SurveyNotAvailable;
