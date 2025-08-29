"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../components/AuthContext";

export default function CartPage() {
  const { token, updateCartCount } = useAuth();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const refresh = async () => {
    try {
      const c = await api("/api/cart", { token });
      setCart(c);
      // Update cart count in AuthContext
      if (c && c.products) {
        const totalItems = c.products.reduce((sum, item) => sum + item.quantity, 0);
        updateCartCount(totalItems);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { if (token) refresh(); }, [token]);

  // Also refresh cart count when component mounts
  useEffect(() => {
    if (token) {
      refresh();
    }
  }, []);

  const updateQty = async (pid, quantity) => {
    await api("/api/cart/update", { method: "PUT", body: { productId: pid, quantity }, token });
    refresh();
  };

  const remove = async (pid) => {
    await api(`/api/cart/remove/${pid}`, { method: "DELETE", token });
    refresh();
  };

  const checkout = async () => {
    await api("/api/orders", { method: "POST", token });
    refresh();
    alert("Order placed!");
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setCouponError("Invalid coupon code");
    }
  };

  if (!token) return (
    <div className="container">
      <div className="text-center py-12">
        <div className="text-slate-500">Please login to view your cart.</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container">
      <div className="text-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    </div>
  );
  
  if (!cart) return (
    <div className="container">
      <div className="text-center py-12">
        <div className="text-slate-500">Loading...</div>
      </div>
    </div>
  );

  const items = cart.products || [];
  const subtotal = items.reduce((s, it) => s + (it.productId?.price || 0) * it.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over ₹50,000
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="container">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-gray-900">Shopping Bag</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Left Column - Product Details */}
        <div>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-500 text-lg">Your bag is empty.</div>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(it => (
                <div key={it.productId?._id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {it.productId?.image && (
                        <img 
                          src={it.productId.image} 
                          alt={it.productId.name}
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-lg mb-2">
                        {it.productId?.name}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        AET-{it.productId?._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="text-lg font-medium text-gray-900 mb-4">
                        ₹{(it.productId?.price || 0).toLocaleString()}
                      </div>
                      
                      {/* Quantity and Remove */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <select
                            value={it.quantity}
                            onChange={(e) => updateQty(it.productId._id, parseInt(e.target.value))}
                            className="px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={() => remove(it.productId._id)} 
                          className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:pl-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Line Items */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="text-gray-900">₹{tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <div className="text-red-600 text-xs mt-2">{couponError}</div>
              )}
            </div>

            {/* Checkout Button */}
            <button
              disabled={items.length === 0}
              onClick={checkout}
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-md font-medium uppercase tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8 text-center">
        <p className="text-sm text-gray-500">
          ©2025 AETHER. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
