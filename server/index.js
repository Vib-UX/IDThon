const express = require("express");
const { auth, resolver, loaders } = require("@iden3/js-iden3-auth");
const getRawBody = require("raw-body");
const { Server } = require("socket.io");
const cors = require("cors");
const { salaryReason, salaryRequest } = require("./requests/salaryRequest");
const { ageReason, ageRequest } = require("./requests/ageRequest");
const { expReason, expRequest } = require("./requests/experienceRequest");
const axios = require("axios");
require("dotenv").config();
const moment = require("moment");
const bodyParser = require("body-parser");

// Endpoint URL and credentials for basic authentication to connect with ISSUER Node
const apiUrl = process.env.ISSUER_NODE_URL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const issuerDid =
  "did:polygonid:polygon:mumbai:2qLMGGZo1iJZWQ2fzRw8dtL8XeBmAE47f3ggbXsyJf";

// Base64 encoding for the credentials
const encodedCredentials = Buffer.from(`${username}:${password}`).toString(
  "base64"
);

// Request configuration
const config = {
  headers: {
    Authorization: `Basic ${encodedCredentials}`,
    "Content-Type": "application/json",
  },
};

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("ngrok-skip-browser-warning", "true");
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.get("/", (req, res) => {
  res.send(
    `Welcome to your backend Polygon ID verifier server! There are ${
      Object.keys(apiPath).length
    } routes available: ${Object.values(apiPath).join(" and ")}.`
  );
});

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// save auth qr requests
const authRequests = new Map();

const apiPath = {
  getAuthQr: "/api/get-auth-qr",
  handleVerification: "/api/verification-callback",
};

app.get(apiPath.getAuthQr, (req, res) => {
  getAuthQr(req, res);
});

app.post(apiPath.handleVerification, (req, res) => {
  handleVerification(req, res);
});

app.post("/api/get-vc", async (req, res) => {
  return await getVC(req, res);
});

const STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  ERROR: "ERROR",
  DONE: "DONE",
};

const socketMessage = (fn, status, data) => ({
  fn,
  status,
  data,
});

app.get("/api/get-basicAuth", (req, res) => {
  getBasicAuthQr(req.query.sessionId, res);
});

app.get("/api/get-salary-qr", (req, res) => {
  getAuthQr(req.query.sessionId, salaryReason, salaryRequest, res);
});

app.get("/api/get-age-qr", (req, res) => {
  getAuthQr(req.query.sessionId, ageReason, ageRequest, res);
});

app.get("/api/get-experience-qr", (req, res) => {
  getAuthQr(req.query.sessionId, expReason, expRequest, res);
});

async function getBasicAuthQr(sessionId, res) {
  console.log(`getBasicAuthQr for ${sessionId}`);

  io.sockets.emit(
    sessionId,
    socketMessage("getBasicAuthQr", STATUS.IN_PROGRESS, sessionId)
  );

  const messageToSign = "Bank Loan Web App wants to verify your DID";

  const uri = `${process.env.HOSTED_SERVER_URL}${apiPath.handleVerification}?sessionId=${sessionId}`;
  const authRequest = auth.createAuthorizationRequest(
    "Authenticating Polygon-DID",
    process.env.VERIFIER_DID,
    uri
  );

  authRequest.id = sessionId;
  authRequest.thid = sessionId;

  const scope = authRequest.body.scope ?? [];
  authRequest.body.scope = [...scope];

  authRequests.set(sessionId, authRequest);

  io.sockets.emit(
    sessionId,
    socketMessage("getBasicAuthQr", STATUS.DONE, authRequest)
  );

  return res.status(200).json(authRequest);
}

// GetQR returns auth request
async function getAuthQr(sessionId, reason, request, res) {
  console.log(`getAuthQr for ${sessionId}`);

  io.sockets.emit(
    sessionId,
    socketMessage("getAuthQr", STATUS.IN_PROGRESS, sessionId)
  );

  const uri = `${process.env.HOSTED_SERVER_URL}${apiPath.handleVerification}?sessionId=${sessionId}`;
  const authRequest = auth.createAuthorizationRequest(
    reason,
    process.env.VERIFIER_DID,
    uri
  );

  authRequest.id = sessionId;
  authRequest.thid = sessionId;

  const scope = authRequest.body.scope ?? [];
  authRequest.body.scope = [...scope, request];

  authRequests.set(sessionId, authRequest);

  io.sockets.emit(
    sessionId,
    socketMessage("getAuthQr", STATUS.DONE, authRequest)
  );

  return res.status(200).json(authRequest);
}

// handleVerification verifies the proof after get-auth-qr callbacks
async function handleVerification(req, res) {
  const sessionId = req.query.sessionId;

  // get this session's auth request for verification
  const authRequest = authRequests.get(sessionId);

  console.log(`handleVerification for ${sessionId}`);

  io.sockets.emit(
    sessionId,
    socketMessage("handleVerification", STATUS.IN_PROGRESS, authRequest)
  );

  // get JWZ token params from the post request
  const raw = await getRawBody(req);
  const tokenStr = raw.toString().trim();

  // The CredentialAtomicQuerySigValidator contract is used to verify any credential-related zk proof
  // generated by the user using the credentialAtomicQuerySigV2OnChain circuit.
  // https://0xpolygonid.github.io/tutorials/contracts/overview/#blockchain-addresses
  const mumbaiContractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";
  const keyDIR = "./keys";

  const ethStateResolver = new resolver.EthStateResolver(
    process.env.RPC_URL_MUMBAI,
    mumbaiContractAddress
  );

  const resolvers = {
    ["polygon:mumbai"]: ethStateResolver,
  };

  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(keyDIR);
  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");
  const verifier = new auth.Verifier(verificationKeyloader, sLoader, resolvers);

  try {
    const opts = {
      AcceptedStateTransitionDelay: 5 * 60 * 1000, // up to a 5 minute delay accepted by the Verifier
    };
    authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
    const userId = authResponse.from;
    io.sockets.emit(
      sessionId,
      socketMessage("handleVerification", STATUS.DONE, authResponse)
    );
    return res
      .status(200)
      .set("Content-Type", "application/json")
      .send("User " + userId + " succesfully authenticated");
  } catch (error) {
    console.log(
      "Error handling verification: Double check the value of your RPC_URL_MUMBAI in the .env file. Are you using a valid api key for Polygon Mumbai from your RPC provider? Visit https://alchemy.com/?r=zU2MTQwNTU5Mzc2M and create a new app with Polygon Mumbai"
    );
    console.log("handleVerification error", sessionId, error);
    io.sockets.emit(
      sessionId,
      socketMessage("handleVerification", STATUS.ERROR, error)
    );
    return res.status(500).send(error);
  }
}

async function getVC(req, res) {
  try {
    const { id, age, experience, lastYearSalaryINR } = req.body;
    console.log(username, password);
    // Request BODY to Issue BankLoanCredential
    const claimReq = {
      credentialSchema:
        "https://raw.githubusercontent.com/Vib-UX/IDThon/main/schemas/json/bank-loan-credential-v1.json",
      type: "BankLoanVerificationCredential",
      credentialSubject: {
        id,
        age: +age,
        experience: +experience,
        lastUpdated: moment.utc().toDate(),
        lastYearSalaryINR: +lastYearSalaryINR,
      },
      expiration: 1903357766,
    };

    // Sending a POST request to issue vc
    const VC = await axios.post(
      `${apiUrl}/v1/${issuerDid}/claims`,
      claimReq,
      config
    );
    if (!VC.data.id) {
      return res.status(404).json({
        error: VC,
      });
    }

    console.log(VC.data);

    // Get Claims QR Code json
    const jsonQrCode = await axios.get(
      `${apiUrl}/v1/${issuerDid}/claims/${VC.data.id}/qrcode`,
      config
    );

    // Publish Identity state to the BC
    const publish = await axios.post(
      `${apiUrl}/v1/${issuerDid}/state/publish`,
      {},
      config
    );

    if (!publish.data.txID) {
      this.response.status(404).json({
        error: publish,
      });
    }
    jsonQrCode.data.body.url = `${process.env.ISSUER_NODE_URL}/v1/agent`;
    return res.status(200).json(jsonQrCode.data);
  } catch (error) {
    console.log(error.message);
    console.log(error);
    // console.log(error);
  }
}
