const {
  BankLoanVerificationCredential,
} = require("./vcHelpers/BankLoanVerificationCredential.js");

// design your own customised authentication requirement here using Query Language
// https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/

const humanReadableAuthReason = "Salary must be greater than 7Lakhs";

const credentialSubject = {
  lastYearSalaryINR: {
    $gt: 700000,
  },
  // age: {
  //   $gt: 20,
  // },
  // experience: {
  //   $gt: 2,
  // },
};

const proofRequest = BankLoanVerificationCredential(credentialSubject);

module.exports = {
  humanReadableAuthReason,
  proofRequest,
};
