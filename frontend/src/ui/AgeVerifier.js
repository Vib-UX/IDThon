import React from "react";
import PolygonIDVerifier from "../PolygonIDVerifier";

const AgeVerifier = ({ setIsVerified }) => {
  return (
    <PolygonIDVerifier
      publicServerURL={process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL}
      localServerURL={process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL}
      credentialType={"KYCAgeCredential"}
      issuerOrHowToLink={
        "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
      }
      onVerificationResult={setIsVerified}
    />
  );
};

export default AgeVerifier;
