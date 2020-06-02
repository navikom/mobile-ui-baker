interface ISubscriptionPlan {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  unitPrice: number;
  limit: number;
  achievements: (string | boolean)[];
  preferred: boolean;
  getStatus: (price: number) => string;
}

export default ISubscriptionPlan;
