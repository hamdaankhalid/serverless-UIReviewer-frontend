const config = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-upload-hk",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis/2c3sbl8w5l/resources",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_xs1tKmKY9",
      APP_CLIENT_ID: "5hmrig9or6mh5s4ng1gr6va3hn",
      IDENTITY_POOL_ID: "us-east-1:225085b8-6baf-4697-82fa-991dd9903cbf",
    },
  };
  
  export default config;