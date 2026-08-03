import { Injectable } from '@nestjs/common';
import { androidpublisher_v3, google } from 'googleapis';
import { GooglePlayRepository, ProductVerification, SubscriptionVerification } from 'src/application/repositories/googlePlay';

@Injectable()
export class GooglePlayApiRepository implements GooglePlayRepository {
  private packageName = process.env.ANDROID_PACKAGE_NAME ?? 'com.kanjiup';
  private client: Promise<androidpublisher_v3.Androidpublisher> | null = null;

  // Method/field names below verified against the googleapis v174 source
  // (src/apis/androidpublisher/v3.ts): purchases.subscriptionsv2.get({packageName, token}) and
  // purchases.products.get({packageName, productId, token}) — lowercase "v2" in "subscriptionsv2",
  // matching the actual generated class name, not the REST doc's display casing.
  private getClient() {
    if (!this.client) {
      const credentials = JSON.parse(process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY ?? '{}');
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      });
      this.client = Promise.resolve(google.androidpublisher({ version: 'v3', auth }));
    }
    return this.client;
  }

  async verifySubscription(purchaseToken: string): Promise<SubscriptionVerification> {
    const client = await this.getClient();
    const { data } = await client.purchases.subscriptionsv2.get({
      packageName: this.packageName,
      token: purchaseToken,
    });

    const isActive = data.subscriptionState === 'SUBSCRIPTION_STATE_ACTIVE';
    const expiryTime = data.lineItems?.[0]?.expiryTime ? new Date(data.lineItems[0].expiryTime) : null;
    return { isActive, expiryTime };
  }

  async verifyProduct(productId: string, purchaseToken: string): Promise<ProductVerification> {
    const client = await this.getClient();
    const { data } = await client.purchases.products.get({
      packageName: this.packageName,
      productId,
      token: purchaseToken,
    });

    // purchaseState: 0 = Purchased, 1 = Canceled, 2 = Pending
    return { isPurchased: data.purchaseState === 0 };
  }
}
