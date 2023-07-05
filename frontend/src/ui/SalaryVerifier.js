import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";

import { io } from "socket.io-client";
import { height } from "@mui/system";

const linkDownloadPolygonIDWalletApp =
  "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start";

function SalaryVerifier({
  credentialType,
  issuerOrHowToLink,
  onVerificationResult,
  publicServerURL,
  localServerURL,
}) {
  const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState();
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =
    useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);

  // serverUrl is localServerURL if not running in prod
  // Note: the verification callback will always come from the publicServerURL
  const serverUrl = window.location.href.startsWith("https")
    ? publicServerURL
    : localServerURL;

  const getQrCodeApi = (sessionId) =>
    serverUrl + `/api/get-salary-qr?sessionId=${sessionId}`;

  const socket = io(serverUrl);

  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);

      // only watch this session's events
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      return JSON.parse(data);
    };

    if (sessionId) {
      fetchQrCode().then(setQrCodeData).catch(console.error);
    }
  }, [sessionId]);

  // socket event side effects
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerfificationMessage("✅ Verified proof");
            setTimeout(() => {
              reportVerificationResult(true);
            }, "2000");
            socket.close();
          } else {
            setVerfificationMessage("❌ Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);

  // callback, send verification result back to app
  const reportVerificationResult = (result) => {
    onVerificationResult(result);
  };

  function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
  }

  return (
    <div
      style={{
        marginTop: "2rem",
      }}
    >
      {qrCodeData && (
        <div>
          Scan this QR code from your{" "}
          <a
            href={linkDownloadPolygonIDWalletApp}
            target="_blank"
            rel="noreferrer"
          >
            Polygon ID Wallet App
          </a>{" "}
          to prove access rights
          <div>
            {isHandlingVerification && (
              <div>
                <p>Authenticating...</p>
                <Spinner size={"xl"} colorScheme="purple" my={2} />
              </div>
            )}
            {verificationMessage}
            {qrCodeData &&
              !isHandlingVerification &&
              !verificationCheckComplete && (
                <Center marginBottom={1}>
                  <QRCode
                    size={400}
                    value={JSON.stringify(qrCodeData)}
                    style={{
                      backgroundColor: "white",
                      marginTop: "1rem",
                      paddingTop: "2rem",
                      borderRadius: "20px",
                      paddingBottom: "2rem",
                    }}
                  />
                </Center>
              )}

            {qrCodeData.body?.scope[0].query && (
              <p
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                Type: {qrCodeData.body?.scope[0].query.type}
              </p>
            )}

            {qrCodeData.body.message && (
              <p
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                {qrCodeData.body.message}
              </p>
            )}

            {qrCodeData.body.reason && (
              <p
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                Reason: {qrCodeData.body.reason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SalaryVerifier;
