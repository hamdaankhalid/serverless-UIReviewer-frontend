const config = {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-upload-hk",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://2c3sbl8w5l.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_xs1tKmKY9",
      APP_CLIENT_ID: "5hmrig9or6mh5s4ng1gr6va3hn",
      IDENTITY_POOL_ID: "us-east-1:4e915160-1883-4837-95cc-6f8be7507e02",
    },
  };
  
  export default config;