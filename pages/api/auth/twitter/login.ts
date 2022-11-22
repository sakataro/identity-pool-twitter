import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth } from "oauth";
import { getTwitterOauth } from "../../../../src/oauth/oauth";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const oauth = getTwitterOauth();

  oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
    console.log({ results });
    if (error) {
      console.error(error);
      res.status(500).json({ message: "error occurred" });
    } else {
      res.redirect(
        "https://twitter.com/oauth/authenticate?oauth_token=" + oauthToken
      );
    }
  });
}
