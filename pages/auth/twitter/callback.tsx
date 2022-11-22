import {
  AccessTokenResponse,
  accessTokenResponseBody2AccessTokenResponse,
} from "../../../src/oauth/oauth";
import { CognitoIdentityCredentials } from "aws-sdk";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

const Callback = ({
  accessTokenResponse,
}: {
  accessTokenResponse: AccessTokenResponse | null;
}) => {
  const [credentials, setCredentials] = useState<{
    expireTime: Date;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  }>({
    expireTime: new Date(0),
    accessKeyId: "",
    secretAccessKey: "",
    sessionToken: "",
  });
  useEffect(() => {
    if (!accessTokenResponse) {
      return;
    }
    const credentials = new CognitoIdentityCredentials(
      {
        IdentityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID ?? "",
        Logins: {
          "api.twitter.com": [
            accessTokenResponse.oauth_token,
            accessTokenResponse.oauth_token_secret,
          ].join(";"),
        },
      },
      { region: process.env.NEXT_PUBLIC_AWS_REGION }
    );
    credentials
      .getPromise()
      .then(() => {
        setCredentials({
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          expireTime: credentials.expireTime,
          sessionToken: credentials.sessionToken,
        });
      })
      .catch((e) => console.error(e));
  }, [accessTokenResponse]);
  return <pre>{JSON.stringify(credentials, null, 2)}</pre>;
};

export default Callback;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const oauthToken = context.query.oauth_token;
  const oauthVerifier = context.query.oauth_verifier;
  if (!oauthToken || !oauthVerifier) {
    return { props: { accessTokenResponse: null } };
  }

  const body = await (
    await fetch(
      `https://api.twitter.com/oauth/access_token?oauth_verifier=${oauthVerifier}&oauth_token=${oauthToken}`,
      { method: "POST" }
    )
  ).text();
  const accessTokenResponse = accessTokenResponseBody2AccessTokenResponse(body);
  return { props: { accessTokenResponse } };
};
