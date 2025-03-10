// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

let {
    SecretsManagerClient,
    GetSecretValueCommand,
  } = require("@aws-sdk/client-secrets-manager");
  
  const secret_name = "fmcc/backend/secrets";
  
  const client = new SecretsManagerClient({
    region: "us-west-2",
  });
  
  let secrets;
  
  async function fetchSecrets() {
    if (secrets) return secrets;
    let response;
    try {
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
      // console.log(response);
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }
    secrets = response.SecretString;
    secrets = JSON.parse(secrets);
    return secrets;
  }
  
  module.exports = fetchSecrets;
  