import { OAuth } from "oauth";

export const getTwitterOauth = () => {
  if (
    !process.env.TWITTER_CONSUMER_KEY ||
    !process.env.TWITTER_CONSUMER_SECRET
  ) {
    throw Error("twitter consumer key or consumer secret is not set");
  }
  return new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    "1.0A",
    "http://localhost:3000/auth/twitter/callback",
    "HMAC-SHA1"
  );
};

export type AccessTokenResponse = {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
};

export const accessTokenResponseBody2AccessTokenResponse = (
  accessTokenResponse: string
): AccessTokenResponse => {
  const splitVars = accessTokenResponse.split("&");
  const ret = {} as any;
  splitVars.forEach((s) => {
    const [key, value] = s.split("=");
    ret[key] = value;
  });

  return ret as AccessTokenResponse;
};
