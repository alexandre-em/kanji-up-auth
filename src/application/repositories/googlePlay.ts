export type SubscriptionVerification = {
  isActive: boolean;
  expiryTime: Date | null;
};

export type ProductVerification = {
  isPurchased: boolean;
};

export abstract class GooglePlayRepository {
  abstract verifySubscription(purchaseToken: string): Promise<SubscriptionVerification>;
  abstract verifyProduct(productId: string, purchaseToken: string): Promise<ProductVerification>;
}
