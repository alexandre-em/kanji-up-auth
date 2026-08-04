import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleIdentityRepository, VerifiedGoogleIdentity } from 'src/application/repositories/googleIdentity';

// Verified against Google's own server-side verification docs: OAuth2Client#verifyIdToken with
// {idToken, audience}, payload read via ticket.getPayload() — sub/email/picture/name
@Injectable()
export class GoogleOAuthIdentityRepository implements GoogleIdentityRepository {
  private client = new OAuth2Client();

  async verifyIdToken(idToken: string): Promise<VerifiedGoogleIdentity> {
    const ticket = await this.client
      .verifyIdToken({ idToken, audience: process.env.GOOGLE_OAUTH_CLIENT_ID })
      .catch(() => {
        throw new UnauthorizedException('Invalid Google identity token');
      });

    const payload = ticket.getPayload();
    if (!payload?.sub) throw new UnauthorizedException('Invalid Google identity token');

    return {
      providerId: payload.sub,
      email: payload.email ?? null,
      picture: payload.picture ?? null,
      name: payload.name ?? null,
    };
  }
}
