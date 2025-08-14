export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
}

export type UnregisteredUsersFields = {
  name: string;
  macAddress: string;
  isAnonymous: boolean;
  adsDeactivated: boolean;
  subscriptionPlan: SubscriptionPlan;
  credits: number;

  createdAt: Date;
  updatedAt: Date;
};

export type RegisteredUsersFields = {
  // if registered
  email: string | null;
  picture: string | null;
  providerId: string | null;
  subscribedAt: Date | null;
  subscribedUntil: Date | null;
};

export type Users = UnregisteredUsersFields & RegisteredUsersFields;
