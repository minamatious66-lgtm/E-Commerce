export interface Order {
  _id: string;
  user: string;
  cartItems: {
    count: number;
    price: number;
    product: {
      title: string;
      imageCover: string;
      id: string;
    };
  }[];
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export interface OrdersResponse {
  results: number;
  data: Order[];
}
