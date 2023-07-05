const {
  BankLoanVerificationCredential,
} = require("../vcHelpers/BankLoanVerificationCredential.js");

// design your own customised authentication requirement here using Query Language
// https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/

const ageReason = "Age Must be less than 50yrs";

const credentialSubject = {
  //   lastYearSalaryINR: {
  //     $gt: 700000,
  //   },
  age: {
    $lt: 50,
  },
  // experience: {
  //   $gt: 2,
  // },
};

const ageRequest = BankLoanVerificationCredential(credentialSubject);

module.exports = {
  ageReason,
  ageRequest,
};
