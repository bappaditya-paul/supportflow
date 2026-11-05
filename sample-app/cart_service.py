"""
Cart & Checkout Service (Demo Target)
Simulates a production e-commerce backend service.
"""

from typing import List, Dict, Optional

class CartItem:
    def __init__(self, item_id: str, name: str, price: float, quantity: int, category: str = "general"):
        self.item_id = item_id
        self.name = name
        self.price = price
        self.quantity = quantity
        self.category = category

class CheckoutService:
    def __init__(self):
        self.active_coupons = {
            "SAVE10": 0.10,
            "VIP20": 0.20,
            "FREESHIP": 0.00
        }

    def calculate_subtotal(self, items: List[CartItem]) -> float:
        return sum(item.price * item.quantity for item in items)

    def calculate_total(self, items: List[CartItem], coupon_code: Optional[str] = None, tax_rate: float = 0.08) -> Dict[str, float]:
        subtotal = self.calculate_subtotal(items)
        
        # BUG: If coupon_code is passed but not in active_coupons or coupon discount calculation
        # encounters an unrecognized coupon, KeyError or NoneType error is raised
        discount = 0.0
        if coupon_code:
            discount_pct = self.active_coupons[coupon_code]  # Raises KeyError if coupon invalid!
            discount = subtotal * discount_pct

        taxable_amount = subtotal - discount
        tax = taxable_amount * tax_rate
        total = taxable_amount + tax

        return {
            "subtotal": round(subtotal, 2),
            "discount": round(discount, 2),
            "tax": round(tax, 2),
            "total": round(total, 2)
        }

