module.exports = {
  // VC type: BankLoanVerificationCredential
  // https://raw.githubusercontent.com/Vib-UX/IDThon/main/schemas/jsonld/bank-loan-credential-v1.jsonld
  BankLoanVerificationCredential: (credentialSubject) => ({
    id: 1,
    circuitId: "credentialAtomicQuerySigV2",
    query: {
      allowedIssuers: ["*"],
      type: "BankLoanVerificationCredential",
      context:
        "https://raw.githubusercontent.com/Vib-UX/IDThon/main/schemas/jsonld/bank-loan-credential-v1.jsonld",
      credentialSubject,
    },
  }),
  // See more off-chain examples
  // https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/#equals-operator-1
};
