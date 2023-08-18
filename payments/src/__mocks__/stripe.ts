// This is a mock stripe file to be used in testing
export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "stripe_charge_id" }),
  }
}
