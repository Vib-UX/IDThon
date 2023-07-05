const {
  BankLoanVerificationCredential,
} = require("../vcHelpers/BankLoanVerificationCredential.js");

// design your own customised authentication requirement here using Query Language
// https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/

const expReason = "Full Time Experience should be > 2yrs";

const credentialSubject = {
  //   lastYearSalaryINR: {
  //     $gt: 700000,
  //   },
  //   age: {
  //     $gt: 20,
  //   },
  experience: {
    $gt: 2,
  },
};

const expRequest = BankLoanVerificationCredential(credentialSubject);

module.exports = {
  expReason,
  expRequest,
};
