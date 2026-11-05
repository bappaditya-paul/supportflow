import unittest
from cart_service import CartItem, CheckoutService

class TestCheckoutService(unittest.TestCase):
    def setUp(self):
        self.service = CheckoutService()
        self.sample_items = [
            CartItem(item_id="item-1", name="Wireless Mouse", price=25.00, quantity=2),
            CartItem(item_id="item-2", name="USB-C Cable", price=10.00, quantity=1)
        ]

    def test_standard_checkout(self):
        result = self.service.calculate_total(self.sample_items)
        self.assertEqual(result["subtotal"], 60.00)
        self.assertEqual(result["discount"], 0.00)
        self.assertEqual(result["tax"], 4.80)
        self.assertEqual(result["total"], 64.80)

    def test_valid_coupon(self):
        result = self.service.calculate_total(self.sample_items, coupon_code="SAVE10")
        self.assertEqual(result["discount"], 6.00)
        self.assertEqual(result["total"], 58.32)

    def test_invalid_or_expired_coupon(self):
        """
        Regression Test:
        Passing an expired or non-existent coupon should gracefully fallback to 0 discount
        instead of crashing production with a KeyError!
        """
        result = self.service.calculate_total(self.sample_items, coupon_code="EXPIRED50")
        self.assertEqual(result["discount"], 0.00)
        self.assertEqual(result["subtotal"], 60.00)

if __name__ == "__main__":
    unittest.main()

