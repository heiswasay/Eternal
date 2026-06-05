import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RotateCw, ChevronLeft, ShoppingBag } from "lucide-react";
import { useCart, formatPrice, parsePrice } from "../context/CartContext";

export const CheckoutPage: React.FC = () => {
  const { cartItems, formattedSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          navigate("/");
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate]);

  // Verification code State (Anti-Bot)
  const [captchaCode, setCaptchaCode] = useState<string>("");
  const [userCaptcha, setUserCaptcha] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "Punjab",
    notes: "",
  });

  // Generate a random 4-digit number everytime
  const generateCaptcha = () => {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(num);
    setUserCaptcha("");
    setCaptchaError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify Bot Prevention Captcha
    if (userCaptcha.trim() !== captchaCode) {
      setCaptchaError(true);
      return;
    }

    setIsSubmitting(true);

    const orderId = `ET-ORD-${100000 + Math.floor(Math.random() * 900000)}`;
    const orderSummary = {
      orderId,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      customerAddress: `${formData.address}, ${formData.city}, ${formData.province}`,
      items: cartItems.map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      totalPrice: formattedSubtotal,
      paymentMethod: "Cash on Delivery",
      notes: formData.notes,
    };

    let sheetsSyncStatus = null;
    try {
      // Fire real server-side email dispatch
      const response = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderSummary),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.sheetsSyncStatus) {
          sheetsSyncStatus = data.sheetsSyncStatus;
        }
      }
    } catch (err) {
      console.error("Error dispatching transaction emails:", err);
    } finally {
      // Commit the order summary to local persistence for visual Thank You billing card
      const completeOrderSummary = {
        ...orderSummary,
        sheetsSyncStatus
      };
      localStorage.setItem("latest_eternal_order", JSON.stringify(completeOrderSummary));
      
      // Clear cart
      clearCart();
      setIsSubmitting(false);

      // Navigate to separate Thank You page
      navigate("/thank-you");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6 pt-32">
        <div className="animate-pulse flex flex-col items-center">
          <ShoppingBag size={48} className="text-zinc-800 mb-6 font-thin" strokeWidth={1} />
          <h1 className="text-lg text-zinc-400">Loading Checkout...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Link */}
        <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm animate-fade-in"
          >
            <ChevronLeft size={16} />
            <span>Back to Store</span>
          </Link>
          <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            Secure checkout
          </div>
        </div>

        {/* Title without words overflow */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-normal text-white tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl">
            Please enter your delivery details below to order your parcel. Cash on Delivery is 100% free.
          </p>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form details (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Contact Details */}
              <div className="border border-white/10 bg-zinc-900/10 p-6 md:p-8 rounded-md space-y-4">
                <h2 className="text-lg font-medium text-white border-b border-white/5 pb-2">
                  1. Contact Information
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-zinc-300 font-medium mb-1.5 flex justify-between">
                      <span>Full Name *</span>
                      <span className="text-amber-500 text-xs font-normal">Required</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="bg-zinc-950 border border-white/10 rounded p-3 text-sm placeholder-zinc-700 outline-none focus:border-white transition-colors text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm text-zinc-300 font-medium mb-1.5 flex justify-between">
                        <span>Phone Number *</span>
                        <span className="text-amber-500 text-xs font-normal">Required</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 03001234567"
                        className="bg-zinc-950 border border-white/10 rounded p-3 text-sm placeholder-zinc-700 outline-none focus:border-white transition-colors text-white"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-zinc-300 font-medium mb-1.5 flex justify-between">
                        <span>Email Address *</span>
                        <span className="text-amber-500 text-xs font-normal">Required</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. johndoe@example.com"
                        className="bg-zinc-950 border border-white/10 rounded p-3 text-sm placeholder-zinc-700 outline-none focus:border-white transition-colors text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="border border-white/10 bg-zinc-900/10 p-6 md:p-8 rounded-md space-y-4">
                <h2 className="text-lg font-medium text-white border-b border-white/5 pb-2">
                  2. Shipping Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm text-zinc-300 font-medium mb-1.5 flex justify-between">
                        <span>City *</span>
                        <span className="text-amber-500 text-xs font-normal">Required</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Islamabad, Lahore, Karachi"
                        className="bg-zinc-950 border border-white/10 rounded p-3 text-sm placeholder-zinc-700 outline-none focus:border-white transition-colors text-white"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-zinc-300 font-medium mb-1.5">
                        Province *
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="bg-zinc-950 border border-white/10 rounded p-3 text-sm text-zinc-300 outline-none focus:border-white transition-colors cursor-pointer"
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad Capital">Islamabad Capital Territory</option>
                        <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                        <option value="Azad Kashmir">Azad Kashmir</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm text-zinc-300 font-medium mb-1.5 flex justify-between">
                      <span>Full Address *</span>
                      <span className="text-amber-500 text-xs font-normal">Required</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, house number, block, sector, or town"
                      className="bg-zinc-950 border border-white/10 rounded p-3 text-sm placeholder-zinc-700 outline-none focus:border-white transition-colors resize-none text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm text-zinc-300 font-medium mb-1.5">
                      Order Notes <span className="text-zinc-500 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional notes or instructions for delivery"
                      className="bg-zinc-950 border border-white/10 rounded p-3 text-sm placeholder-zinc-700 outline-none focus:border-white transition-colors resize-none text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Cash On Delivery & Captcha Block */}
              <div className="border border-white/10 bg-zinc-900/10 p-6 md:p-8 rounded-md space-y-4">
                <h2 className="text-lg font-medium text-white border-b border-white/5 pb-2">
                  3. Payment & Verification
                </h2>

                <div className="space-y-4">
                  {/* Simplifed COD Option Label */}
                  <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded text-sm text-zinc-300">
                    <div className="font-semibold text-amber-400 mb-1 text-sm">
                      Cash on Delivery (COD)
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Pay with cash when your package is delivered to your doorstep. Free courier shipping is included.
                    </p>
                  </div>

                  {/* Captcha Block */}
                  <div className="bg-zinc-950 border border-white/5 p-4 rounded space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-300 font-medium">Bot Prevention Code</span>
                        <span className="text-xs text-zinc-500">Please enter the identical number below to continue</span>
                      </div>
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-1 border border-white/10 px-2 rounded bg-zinc-900 cursor-pointer"
                        title="Generate a new code"
                      >
                        <RotateCw size={12} />
                        <span>Reset Code</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch gap-4">
                      {/* Captcha lock box */}
                      <div className="flex items-center justify-center bg-zinc-900 border border-dashed border-white/20 select-none p-3.5 rounded text-lg font-mono tracking-[0.4em] text-amber-400 font-bold min-w-[120px]">
                        {captchaCode}
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={userCaptcha}
                          onChange={(e) => {
                            setUserCaptcha(e.target.value.replace(/[^0-9]/g, ""));
                            setCaptchaError(false);
                          }}
                          placeholder="Type security code here"
                          className={`bg-zinc-950 border ${
                            captchaError ? "border-rose-500 font-bold" : "border-white/10 focus:border-white"
                          } rounded p-3 text-sm text-center placeholder-zinc-700 outline-none transition-all font-mono font-bold h-full`}
                        />
                      </div>
                    </div>

                    {captchaError && (
                      <p className="text-xs text-rose-500 font-medium">
                        ⚠️ Code does not match. Please type the identical 4-digit code as shown.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-4 text-sm font-semibold hover:bg-zinc-200 transition-colors rounded cursor-pointer shadow-md select-none"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
                <p className="text-center text-xs text-zinc-500 mt-3">
                  Free shipping is automatically applied. Estimated delivery in 2-4 working days.
                </p>
              </div>
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-white/10 bg-zinc-900/10 p-6 rounded-md sticky top-28 space-y-6">
              <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-300">Your Order</span>
                <span className="text-xs text-zinc-500 font-mono">{cartItems.length} item(s)</span>
              </div>

              <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-1 scrollbar-none space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`flex gap-4 pt-4 ${index === 0 ? "pt-0" : ""}`}>
                    {/* Item thumbnail */}
                    <div className="w-16 h-20 bg-zinc-950 border border-white/10 shrink-0 overflow-hidden rounded">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-sm text-zinc-100 font-medium leading-snug">
                          {item.name}
                        </h4>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-[10px] text-zinc-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono">
                            Size: EU {item.size}
                          </span>
                          <span className="text-xs text-zinc-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <span className="text-sm text-white font-medium text-right">
                        {formatPrice(parsePrice(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="flex justify-between items-end pt-1 font-bold text-base">
                  <span className="text-white">Total</span>
                  <span className="text-white text-lg">{formattedSubtotal}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
