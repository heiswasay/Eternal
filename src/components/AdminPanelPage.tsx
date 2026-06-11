import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, ArrowLeft, Image as ImageIcon, Plus, Edit, Trash2, 
  Save, X, Check, Eye, AlertCircle, Sparkles, LogOut, ChevronDown 
} from "lucide-react";
import { 
  DbProduct, ProductSpec, fetchProductsFromDb, saveProductToDb, deleteProductFromDb 
} from "../firebase";

// Fallback products used to seed the DB initially
const FALLBACK_COLLECTIONS = [
  {
    name: "Brown Oxford Leather",
    price: "PKR 5,950",
    image: "/src/images/bo1.webp",
    images: ["/src/images/bo1.webp", "/src/images/bo2.webp", "/src/images/bo3.webp", "/src/images/bo4.webp", "/src/images/bo5.webp", "/src/images/bo6.webp", "/src/images/bo7.webp", "/src/images/bo8.webp"],
    category: "Hand Made",
    slug: "brown-oxford-leather",
    description: "The height of sartorial elegance, featuring hand-burnished leather and artisanal buckle detailing.",
    specs: {
      type: "Semi-Brogue Captoe Oxford",
      leather: "Mahogany Burnished Alpine Calfskin",
      leatherDetail: "Full-grain textured French Box-Calf leather featuring a magnificent, deep mahogany burnish. Selected for its highly resilient, dense grain structure that holds up wonderfully to moist weather.",
      sole: "Double-Leather Oak Bark Outsole with Brass Pin Protection",
      soleDetail: "Ultra-durable double-thickness sole, constructed of genuine oak-bark bend leather. Reinforced with 15 hand-driven solid brass pegs on the shank and a beautiful flush gold-plated steel toe-cap protection.",
      laces: "Round-Braided Corded Egyptian Cotton Waxed Laces",
      lacesDetail: "Meticulously braided round Egyptian cotton laces, deeply impregnated with natural wax. Slides smoothly and cleanly through nickel-plated metal eyelets without binding.",
      lining: "Butter-Soft Full-Grain Tan Calf Lining",
      construction: "270-Degree Goodyear Welt"
    }
  },
  {
    name: "Monk Strap",
    price: "PKR 5,950",
    image: "/src/images/m8.webp",
    images: ["/src/images/m8.webp", "/src/images/m1.webp", "/src/images/m3.webp", "/src/images/m2.webp", "/src/images/m4.webp", "/src/images/m5.webp"],
    category: "Hand Made",
    slug: "monk-strap",
    description: "A timeless classic in a rich cognac hue, featuring a hand-welted sole for unparalleled durability.",
    specs: {
      type: "Double Monk Strap Dress Shoe",
      leather: "Aniline-Dyed Museum Calfskin (Cognac Brown Patina)",
      leatherDetail: "Individually hand-burnished aniline-dyed calfskin with a distinctive marbleized museum effect. Prepared using organic tree bark extracts and finished with countless hand-applied layers of mineral cream wax.",
      sole: "Hand-Welted Italian Oak-Bark Outsole with Stacked Specialty Heel",
      soleDetail: "Double-tanned dense oak-bark outsole that offers exceptional shock absorption and orthopedic flexibility. Hand-cut and polished edges with subtle hand-stamped decorative detailing on the waist.",
      laces: "Double Brass Buckle Straps with Hidden Elastic Anchor Guards",
      lacesDetail: "Instead of standard laces, this masterpiece is secured with two adjustable solid brass buckles individually cast in Florence, held securely by soft, heavy-grade hidden elastic segments to optimize standard flex.",
      lining: "Hand-Selected Glove-Grade Milled Sheepskin Lining",
      construction: "Rapid Blake stitch"
    }
  },
  {
    name: "Black Oxford Leather",
    price: "PKR 5,950",
    image: "/src/images/boo1.webp",
    images: ["/src/images/boo1.webp", "/src/images/boo3.webp", "/src/images/boo4.webp", "/src/images/boo5.webp", "/src/images/boo8.webp", "/src/images/boo9.webp"],
    category: "Hand Made",
    slug: "black-oxford-leather",
    description: "Our signature piece, hand-stitched over 48 hours using the finest full-grain Italian calfskin.",
    specs: {
      type: "Wholecut Bespoke Oxford",
      leather: "Ultra-Premium Full-Grain Italian Box-Calf (Tuscan Tannery)",
      leatherDetail: "Sourced from an antique artisan tannery in Tuscany, Italy. We select only the top 3% of unblemished aniline skins. Naturally supple and highly breathable, this pristine box-calf develops a beautiful deep mirror-like glaze with age.",
      sole: "Hand-Stitched Closed-Channel Goodyear Welt Outsole with Fiddleback Waist",
      soleDetail: "A multi-layered oak-bark tanned leather outsole with a traditional 270-degree hand-sewn welt. Features a hand-carved, highly defined fiddleback waist and a stacked solid leather heel for maximum stability.",
      laces: "Flat-Braided Waxed Giza Cotton Laces",
      lacesDetail: "Tightly-braided, extra-long-staple Egyptian Giza cotton fibres treated with an ultra-thin coating of natural organic beeswax for high tensile strength, fray prevention, and an enduring secure knot.",
      lining: "Hand-Dyed Glove-Grade Italian Calf-Lining",
      construction: "Handwelted Goodyear"
    }
  }
];

interface MailPreviewPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes: string;
}

function getMockCustomerEmailHtml(payload: MailPreviewPayload) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternal Order Confirmed</title>
  <style>
    body { background-color: #09090b; color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 4px; overflow: hidden; }
    .header { background-color: #09090b; padding: 40px 30px; text-align: center; border-bottom: 1px solid #18181b; }
    .logo { font-size: 11px; letter-spacing: 0.4em; color: #f59e0b; text-transform: uppercase; font-weight: 600; }
    .title { font-size: 24px; color: #ffffff; margin-top: 15px; margin-bottom: 5px; font-weight: 300; }
    .subtitle { font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.15em; }
    .content { padding: 40px 30px; }
    .card { background-color: #121214; border: 1px solid #1e1e21; padding: 24px; border-radius: 2px; margin-bottom: 30px; }
    .card-title { font-size: 11px; letter-spacing: 0.2em; color: #f59e0b; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #27272a; padding-bottom: 8px; }
    .item-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .item-table th { text-align: left; font-size: 10px; letter-spacing: 0.15em; color: #a1a1aa; text-transform: uppercase; padding-bottom: 12px; border-bottom: 1px solid #27272a; }
    .item-table td { padding: 16px 0; border-bottom: 1px solid #18181b; vertical-align: middle; }
    .item-name { font-size: 14px; color: #ffffff; font-weight: 550; text-transform: uppercase; }
    .item-meta { font-size: 11px; color: #71717a; margin-top: 4px; }
    .item-price { font-size: 14px; color: #ffffff; text-align: right; }
    .totals-section { width: 100%; margin-top: 20px; border-top: 1px solid #27272a; padding-top: 15px; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; }
    .grand-total { font-size: 18px; color: #ffffff; font-weight: 600; border-top: 1px solid #27272a; padding-top: 12px; margin-top: 6px; }
    .footer { background-color: #09090b; padding: 30px; text-align: center; border-top: 1px solid #18181b; font-size: 11px; color: #71717a; }
    .footer a { color: #f59e0b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">ETERNAL WORKSHOP ATELIER</div>
      <div class="title">Bespoke Order Acknowledged</div>
      <div class="subtitle">Order ID: ${payload.orderId}</div>
    </div>
    <div class="content">
      <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
        Dear ${payload.customerName || "Customer"}, thank you for your order. Below is your transaction overview:
      </p>
      <div class="card">
        <div class="card-title">Delivery Parameters</div>
        <div style="font-size: 13px; line-height: 1.6; color: #fafafa;">
          <strong>Consignee Name:</strong> ${payload.customerName}<br>
          <strong>Contact Number:</strong> ${payload.customerPhone}<br>
          <strong>Destination:</strong> ${payload.customerAddress}<br>
          <strong>Payment Mode:</strong> Cash on Delivery<br>
          ${payload.notes ? `<strong>Notes:</strong> ${payload.notes}` : ""}
        </div>
      </div>
      <table class="item-table">
        <thead>
          <tr>
            <th>Bespoke Item</th>
            <th style="text-align: right;">Valuation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-name">Brown Oxford Leather</div>
              <div class="item-meta">Size: EU 42 • Qty: 1</div>
            </td>
            <td class="item-price">PKR 5,950</td>
          </tr>
        </tbody>
      </table>
      <div class="totals-section">
        <div class="total-row grand-total">
          <span>Amount collectable on COD</span>
          <span>PKR 5,950</span>
        </div>
      </div>
    </div>
    <div class="footer">
      For enquiries: <a href="mailto:support@eternal.com.pk" target="_blank">support@eternal.com.pk</a>
    </div>
  </div>
</body>
</html>`;
}

function getMockAdminEmailHtml(payload: MailPreviewPayload) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #09090b; color: #fafafa; font-family: sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #27272a; padding: 30px; background: #000; }
    h1 { font-size: 20px; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 0; }
    .field { margin-bottom: 12px; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; }
    .val { color: #fff; font-size: 14px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; background-color: #1c1917; color: #a1a1aa; padding: 10px; font-size: 11px; }
    td { padding: 10px; border-bottom: 1px solid #1c1917; color: #e4e4e7; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NEW ATELIER ORDER RECEIVED</h1>
    <div class="field"><div class="label">Order ID</div><div class="val">${payload.orderId}</div></div>
    <div class="field"><div class="label">Customer Name</div><div class="val">${payload.customerName}</div></div>
    <div class="field"><div class="label">Phone</div><div class="val">${payload.customerPhone}</div></div>
    <div class="field"><div class="label">Email</div><div class="val">${payload.customerEmail}</div></div>
    <div class="field"><div class="label">Address</div><div class="val">${payload.customerAddress}</div></div>
    <div class="field"><div class="label">Notes</div><div class="val">${payload.notes || "None"}</div></div>
    <table>
      <thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        <tr>
          <td>Brown Oxford Leather</td>
          <td>EU 42</td>
          <td>1</td>
          <td>PKR 5,950</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 20px; text-align: right;">
      <strong style="color: #f59e0b; font-size: 16px;">PKR 5,950</strong>
    </div>
  </div>
</body>
</html>`;
}

export default function AdminPanelPage() {
  const navigate = useNavigate();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Product inventory states
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFormModal, setActiveFormModal] = useState<"add" | "edit" | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email template sub-workspace states
  const [adminActiveTab, setAdminActiveTab] = useState<"catalog" | "emails">("catalog");
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<"customer" | "admin">("customer");

  // Editable mail rendering payloads
  const [mockOrderId, setMockOrderId] = useState("ET-84920");
  const [mockClientName, setMockClientName] = useState("Wasey Shah");
  const [mockClientPhone, setMockClientPhone] = useState("+92 300 9876543");
  const [mockClientEmail, setMockClientEmail] = useState("wasey351@gmail.com");
  const [mockClientAddress, setMockClientAddress] = useState("DHA Phase V, Karachi, Pakistan");
  const [mockClientNotes, setMockClientNotes] = useState("Deliver with pristine boutique gift-wrap.");

  // Form Field states
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formDiscountPercent, setFormDiscountPercent] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formImagesRaw, setFormImagesRaw] = useState(""); // Comma separated
  const [formCategory, setFormCategory] = useState("Hand Made");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Detailed Specifications inputs
  const [specType, setSpecType] = useState("");
  const [specLeather, setSpecLeather] = useState("");
  const [specLeatherDetail, setSpecLeatherDetail] = useState("");
  const [specSole, setSpecSole] = useState("");
  const [specSoleDetail, setSpecSoleDetail] = useState("");
  const [specLaces, setSpecLaces] = useState("");
  const [specLacesDetail, setSpecLacesDetail] = useState("");
  const [specLining, setSpecLining] = useState("");
  const [specConstruction, setSpecConstruction] = useState("");

  // Verification of login state in session storage
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("eternal_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch products once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const items = await fetchProductsFromDb(FALLBACK_COLLECTIONS);
      setProducts(items);
    } catch (e) {
      console.error(e);
      setAlertMsg({ type: "error", text: "Failed to load product list." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError("Please enter both credentials.");
      return;
    }

    // Verify requested credentials
    if (username.trim() === "abbas" && password === "kyahuabey") {
      setIsAuthenticated(true);
      sessionStorage.setItem("eternal_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("eternal_admin_auth");
    setUsername("");
    setPassword("");
  };

  // Helper to generate dynamic slugs
  const generateSlugFromName = (nameStr: string) => {
    return nameStr
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (activeFormModal === "add") {
      setFormSlug(generateSlugFromName(val));
    }
  };

  // Open Form modal in Add Mode
  const openAddForm = () => {
    setEditingProductSlug(null);
    setFormName("");
    setFormPrice("PKR 5,950");
    setFormOriginalPrice("");
    setFormDiscountPercent("");
    setFormImage("https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800");
    setFormImagesRaw("https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800, https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800, https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=800");
    setFormCategory("Hand Made");
    setFormSlug("");
    setFormDescription("Premium artisanal masterwork handcrafted with unbending attention to classical detail.");
    
    // Specs
    setSpecType("Wholecut Bespoke Oxford");
    setSpecLeather("Ultra-Premium Full-Grain Aniline Calfskin");
    setSpecLeatherDetail("Sourced from historic European tanneries. Only top unblemished hides are dyed with organic plant oils to preserve rich micro-textures.");
    setSpecSole("Closed-Channel Goodyear Welt Outsole with Fiddleback Waist");
    setSpecSoleDetail("Sculpted with dense traditional oak-bark leather beds. Finished with stacked leather locks and brass-pegged protection waist.");
    setSpecLaces("Flat-Braided Egyptian Giza Waxed Cotton Laces");
    setSpecLacesDetail("Smooth-sliding corded Giza cotton treated with high melt-point organic beeswax to resist environmental moisture and wear.");
    setSpecLining("Full glove-grade buttery sheepskin luxury inner wrap");
    setSpecConstruction("Traditional Hand-Stitched Goodyear Welt");

    setActiveFormModal("add");
  };

  // Open Form modal in Edit Mode
  const openEditForm = (prod: DbProduct) => {
    setEditingProductSlug(prod.slug);
    setFormName(prod.name);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice || "");
    setFormDiscountPercent(prod.discountPercent || "");
    setFormImage(prod.image);
    setFormImagesRaw(prod.images ? prod.images.join(", ") : prod.image);
    setFormCategory(prod.category);
    setFormSlug(prod.slug);
    setFormDescription(prod.description);

    // Specs
    const s: any = prod.specs || {};
    setSpecType(s.type || "");
    setSpecLeather(s.leather || "");
    setSpecLeatherDetail(s.leatherDetail || "");
    setSpecSole(s.sole || "");
    setSpecSoleDetail(s.soleDetail || "");
    setSpecLaces(s.laces || "");
    setSpecLacesDetail(s.lacesDetail || "");
    setSpecLining(s.lining || "");
    setSpecConstruction(s.construction || "");

    setActiveFormModal("edit");
  };

  // Form submit handler (Add or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formSlug) {
      setAlertMsg({ type: "error", text: "Please fill out all required fields." });
      return;
    }

    // Process gallery images array
    const imageList = formImagesRaw
      .split(",")
      .map(url => url.trim())
      .filter(url => url !== "");

    const newSpecs: ProductSpec = {
      type: specType,
      leather: specLeather,
      leatherDetail: specLeatherDetail,
      sole: specSole,
      soleDetail: specSoleDetail,
      laces: specLaces,
      lacesDetail: specLacesDetail,
      lining: specLining,
      construction: specConstruction
    };

    const newProduct: DbProduct = {
      id: formSlug,
      name: formName,
      price: formPrice,
      originalPrice: formOriginalPrice,
      discountPercent: formDiscountPercent,
      image: formImage,
      images: imageList.length > 0 ? imageList : [formImage],
      category: formCategory,
      slug: formSlug,
      description: formDescription,
      specs: newSpecs
    };

    try {
      await saveProductToDb(newProduct, FALLBACK_COLLECTIONS);
      setAlertMsg({ 
        type: "success", 
        text: activeFormModal === "add" ? "Product successfully created." : "Product successfully updated." 
      });
      setActiveFormModal(null);
      loadProducts();
    } catch (error) {
      console.error(error);
      setAlertMsg({ type: "error", text: "Operation failed. Check permissions or config." });
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (slugToDelete: string) => {
    if (window.confirm("Are you absolutely sure you want to permanently delete this product from ETERNAL? This action is irreversible.")) {
      try {
        await deleteProductFromDb(slugToDelete, FALLBACK_COLLECTIONS);
        setAlertMsg({ type: "success", text: "Product successfully deleted." });
        loadProducts();
      } catch (error) {
        console.error(error);
        setAlertMsg({ type: "error", text: "Failed to delete product." });
      }
    }
  };

  // Automatically hide alerts after 4 seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => {
        setAlertMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Dynamic Feedback Banner */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-full shadow-2xl rounded px-4 py-3 border flex items-center gap-3 backdrop-blur-md ${
              alertMsg.type === "success" 
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/90 border-rose-500/30 text-rose-300"
            }`}
          >
            {alertMsg.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs uppercase tracking-wider font-semibold font-mono">{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthenticated ? (
        /* Secure authentication gate screen */
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
          {/* Subtle Ambient Decorative Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.012] blur-3xl rounded-full pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md bg-zinc-950/60 border border-white/5 p-8 sm:p-10 rounded-sm backdrop-blur-lg"
          >
            <div className="text-center mb-8">
              <span className="text-[9px] font-mono uppercase tracking-[0.6em] text-zinc-600 block mb-2">SECURE GATEWAY</span>
              <h1 className="serif text-3xl font-light tracking-wider text-white">ETERNAL CONTROL</h1>
              <div className="w-10 h-px bg-white/20 mx-auto mt-4" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-mono mb-2">ADMIN USERNAME</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-zinc-900/60 border border-white/10 p-3.5 text-xs text-white uppercase tracking-widest focus:border-white/40 focus:outline-none rounded-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-mono mb-2">ADMIN PASSWORD</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-zinc-900/60 border border-white/10 p-3.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none transition-colors"
                  />
                  <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                </div>
              </div>

              {loginError && (
                <div className="text-rose-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 pt-1">
                  <AlertCircle size={10} /> {loginError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-white text-black py-4 uppercase text-[9px] tracking-[0.4em] font-extrabold hover:bg-zinc-200 transition-colors cursor-pointer rounded-none"
              >
                Access Terminal
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-[9px] text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft size={10} /> Return to Store
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard Workspace */
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-white/5 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[9px] font-mono tracking-[0.5em] text-zinc-500 block uppercase">MANAGEMENT HQ</span>
                <span className="px-2 py-0.5 text-[7.5px] font-mono tracking-widest text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 rounded">LIVE LEDGER</span>
              </div>
              <h1 className="serif text-3xl md:text-5xl tracking-wide text-white">Bespoke Suite</h1>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={openAddForm}
                className="inline-flex items-center gap-2 border border-white/10 text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-white py-3 px-6 text-[9px] uppercase tracking-[0.3em] font-semibold transition-all rounded-sm cursor-pointer"
              >
                <Plus size={12} /> Add New Shoe
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-900 hover:border-white/10 py-3 px-5 text-[9px] uppercase tracking-[0.3em] font-semibold transition-all rounded-sm cursor-pointer"
              >
                <LogOut size={12} /> Exit HQ
              </button>
            </div>
          </header>

          {/* Catalog stats overview row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="border border-white/5 bg-zinc-950/40 p-5 rounded">
              <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Total Catalog Items</span>
              <span className="text-xl sm:text-2xl font-light text-white">{products.length} pairs</span>
            </div>
            <div className="border border-white/5 bg-zinc-950/40 p-5 rounded">
              <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Active Offers & Discounts</span>
              <span className="text-xl sm:text-2xl font-light text-zinc-400">
                {products.filter(p => !!p.discountPercent || !!p.originalPrice).length} active
              </span>
            </div>
            <div className="border border-white/5 bg-zinc-950/40 p-5 rounded">
              <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Curated Series Categories</span>
              <span className="text-xl sm:text-2xl font-light text-zinc-400">
                {Array.from(new Set(products.map(p => p.category))).join(" / ") || "Hand Made"}
              </span>
            </div>
            <div className="border border-white/5 bg-zinc-950/40 p-5 rounded">
              <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Atelier Administrator</span>
              <span className="text-xl sm:text-2xl font-light text-zinc-400">Abbas</span>
            </div>
          </div>

          {/* Sub-workspace Navigation Tabs */}
          <div className="flex border-b border-white/5 mb-10 gap-8">
            <button
              onClick={() => setAdminActiveTab("catalog")}
              className={`pb-4 text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all relative cursor-pointer outline-none ${
                adminActiveTab === "catalog" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Shoe Inventory Catalog
              {adminActiveTab === "catalog" && (
                <motion.div layoutId="adminActiveTabBar" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500" />
              )}
            </button>
            <button
              onClick={() => setAdminActiveTab("emails")}
              className={`pb-4 text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all relative cursor-pointer outline-none ${
                adminActiveTab === "emails" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Order Email Previews
              {adminActiveTab === "emails" && (
                <motion.div layoutId="adminActiveTabBar" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500" />
              )}
            </button>
          </div>

          {/* Active Product Inventory Grid */}
          {adminActiveTab === "catalog" && (
            isLoading ? (
              <div className="py-24 text-center">
                <div className="animate-spin w-8 h-8 border border-white/20 border-t-white rounded-full mx-auto mb-4" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500">Retrieving secure catalog database...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item) => (
                  <div 
                    key={item.id || item.slug}
                    className="border border-white/5 bg-zinc-950/40 p-5 hover:border-white/10 transition-all rounded-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Header: slug index */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[8px] font-mono text-zinc-500 block uppercase">
                          // {item.category}
                        </span>
                        {item.discountPercent && (
                          <span className="px-2 py-0.5 text-[8px] font-mono tracking-wider font-semibold text-amber-300 bg-amber-950/35 border border-amber-500/20 rounded">
                            {item.discountPercent} Offer
                          </span>
                        )}
                      </div>

                      {/* Image visual plate */}
                      <div className="aspect-[4/3] bg-zinc-900 border border-white/5 mb-4 overflow-hidden rounded-sm relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800";
                          }}
                        />
                      </div>

                      {/* Detail blocks */}
                      <h3 className="serif text-xl font-normal text-white mb-1">{item.name}</h3>
                      <p className="text-[10px] font-mono tracking-wider text-zinc-500 mb-3 uppercase">url slug: {item.slug}</p>
                      
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="serif text-base text-zinc-200">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-zinc-600 line-through text-[11px] font-mono">{item.originalPrice}</span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-4 uppercase tracking-wider line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-4 flex gap-4">
                      <button 
                        onClick={() => openEditForm(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white hover:bg-white hover:text-black py-2.5 text-[8.5px] uppercase tracking-[0.2em] font-bold text-white transition-all rounded-sm cursor-pointer"
                      >
                        <Edit size={10} /> Edit specs
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(item.slug)}
                        className="inline-flex items-center justify-center p-2.5 border border-rose-950/50 hover:border-rose-500 bg-rose-950/10 hover:bg-rose-950 text-rose-400 transition-all rounded-sm cursor-pointer"
                        aria-label="Delete this product"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Live System Email Previews */}
          {adminActiveTab === "emails" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Info panel */}
              <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500">Live Transactional Engines</span>
                  </div>
                  <h2 className="serif text-xl text-white font-normal">Transactional Email Templates</h2>
                  <p className="text-zinc-500 text-xs font-light max-w-2xl leading-relaxed">
                    Whenever an order is finalized on the checkout desk, our custom server dispatches two high-fidelity transactional letters using active secure SMTP parameters. Use the interactive panel below to audit, customize, and preview these drafts.
                  </p>
                </div>
                
                {/* Email Toggle */}
                <div className="flex bg-zinc-900 border border-white/10 p-1 rounded gap-1 shrink-0">
                  <button
                    onClick={() => setSelectedEmailPreview("customer")}
                    className={`px-4 py-2 text-[9px] uppercase tracking-wider font-semibold font-mono rounded transition-all cursor-pointer ${
                      selectedEmailPreview === "customer"
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Customer Receipt
                  </button>
                  <button
                    onClick={() => setSelectedEmailPreview("admin")}
                    className={`px-4 py-2 text-[9px] uppercase tracking-wider font-semibold font-mono rounded transition-all cursor-pointer ${
                      selectedEmailPreview === "admin"
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Organization Alert
                  </button>
                </div>
              </div>

              {/* Subject lines & recipients meta read-only fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950 border border-white/5 p-4 rounded-sm">
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-1">ENVELOPE FROM (SENDER)</span>
                  <span className="text-xs text-zinc-200 font-mono">"Eternal Atelier" &lt;support@eternal.com.pk&gt;</span>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-1">ENVELOPE TO (RECEIVER)</span>
                  <span className="text-xs text-zinc-200 font-mono">
                    {selectedEmailPreview === "customer" ? `"${mockClientName}" <${mockClientEmail}>` : `"Eternal Atelier Admin" <support@eternal.com.pk>`}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-1">EMAIL SUBJECT LINE</span>
                  <span className="text-xs text-amber-500 font-mono font-medium">
                    {selectedEmailPreview === "customer" 
                      ? `Order Recieved [ID: ${mockOrderId}] - Eternal Workshop`
                      : `New Order [ID: ${mockOrderId}] - COD - ${mockClientName}`}
                  </span>
                </div>
              </div>

              {/* Main Preview and Parameters Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side: interactive form parameters */}
                <div className="lg:col-span-4 space-y-5 bg-zinc-950/40 border border-white/5 p-6 rounded-sm h-fit">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Live Mock Parameters</h3>
                    <p className="text-[10px] text-zinc-500 font-light uppercase mt-1">Simulate custom field parameters live</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Simulation Order ID</label>
                      <input 
                        type="text"
                        value={mockOrderId}
                        onChange={(e) => setMockOrderId(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white uppercase focus:border-white/30 focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Consignee Full Name</label>
                      <input 
                        type="text"
                        value={mockClientName}
                        onChange={(e) => setMockClientName(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white focus:border-white/30 focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Consignee Contact Number</label>
                      <input 
                        type="text"
                        value={mockClientPhone}
                        onChange={(e) => setMockClientPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white focus:border-white/30 focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Consignee Email Address</label>
                      <input 
                        type="email"
                        value={mockClientEmail}
                        onChange={(e) => setMockClientEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white focus:border-white/30 focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Destination Shipping Address</label>
                      <textarea
                        rows={2}
                        value={mockClientAddress}
                        onChange={(e) => setMockClientAddress(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white focus:border-white/30 focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Bespoke Delivery Notes</label>
                      <textarea
                        rows={2}
                        value={mockClientNotes}
                        onChange={(e) => setMockClientNotes(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2.5 text-xs text-white focus:border-white/30 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 text-center">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block leading-relaxed">
                      💡 Need edits to colors, fonts or layout? Simply type your preferences in our chat box!
                    </span>
                  </div>
                </div>

                {/* Right side: high-fidelity rendering within full scale web browser mail mock container */}
                <div className="lg:col-span-8 flex flex-col h-[650px] border border-white/10 rounded-sm overflow-hidden bg-zinc-950">
                  {/* Browser Style Bar */}
                  <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="bg-zinc-950 text-[10px] text-zinc-500 font-mono px-5 py-1 rounded w-1/2 text-center select-none truncate">
                      {selectedEmailPreview === "customer" ? "customer-confirmation-dispatch.html" : "internal-admin-order-alert.html"}
                    </div>
                    <div className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">
                      LIVE PREVIEW
                    </div>
                  </div>

                  {/* Sandbox Frame */}
                  <div className="flex-1 bg-zinc-900/30 p-2 sm:p-4 overflow-y-auto">
                    <iframe
                      title="Letter Mockup Sandbox"
                      srcDoc={
                        selectedEmailPreview === "customer"
                          ? getMockCustomerEmailHtml({
                              orderId: mockOrderId,
                              customerName: mockClientName,
                              customerPhone: mockClientPhone,
                              customerEmail: mockClientEmail,
                              customerAddress: mockClientAddress,
                              notes: mockClientNotes,
                            })
                          : getMockAdminEmailHtml({
                              orderId: mockOrderId,
                              customerName: mockClientName,
                              customerPhone: mockClientPhone,
                              customerEmail: mockClientEmail,
                              customerAddress: mockClientAddress,
                              notes: mockClientNotes,
                            })
                      }
                      className="w-full h-full border-0 bg-[#09090b] rounded"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Comprehensive add/update modal popup */}
          <AnimatePresence>
            {activeFormModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="bg-zinc-950 border border-white/10 w-full max-w-4xl p-6 sm:p-8 rounded-sm max-h-[95dvh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center pb-6 border-b border-white/5 mb-6">
                    <div>
                      <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                        {activeFormModal === "add" ? "HQ CREATOR SYSTEM" : "HQ EDITOR SYSTEM"}
                      </span>
                      <h3 className="serif text-xl sm:text-2xl text-white font-normal leading-tight">
                        {activeFormModal === "add" ? "Register New Shoe Design" : `Edit Specifications for "${formName}"`}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveFormModal(null)}
                      className="text-zinc-400 hover:text-white p-1 bg-zinc-900 border border-white/5 rounded-full hover:border-white/15 transition-all outline-none"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Part 1: Primary identifiers & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                          Shoe Name <span className="text-zinc-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Oxford Wholecut Leather"
                          value={formName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white uppercase focus:border-white/40 focus:outline-none rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                          Unique URL Slug <span className="text-zinc-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. oxford-wholecut-leather"
                          value={formSlug}
                          onChange={(e) => setFormSlug(generateSlugFromName(e.target.value))}
                          disabled={activeFormModal === "edit"}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white focus:border-white/40 focus:outline-none rounded-none disabled:opacity-40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                          Active Selling Price <span className="text-zinc-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. PKR 5,950"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                          Original Price <span className="text-zinc-600 font-normal">(Optional for Discount)</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. PKR 6,950"
                          value={formOriginalPrice}
                          onChange={(e) => setFormOriginalPrice(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                          Discount Tag <span className="text-zinc-600 font-normal">(Optional badge)</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. 15% OFF"
                          value={formDiscountPercent}
                          onChange={(e) => setFormDiscountPercent(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white uppercase focus:border-white/40 focus:outline-none rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                          Primary Product Image URL <span className="text-zinc-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="https://..."
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-2">Curated Category</label>
                        <select 
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white uppercase focus:border-white/40 focus:outline-none rounded-none h-[42px]"
                        >
                          <option value="Hand Made">Hand Made Collection</option>
                          <option value="Bespoke">Bespoke Couture</option>
                          <option value="Classic">Classic Heritage</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                        Product Gallery Images <span className="text-zinc-600 font-normal">(Comma separated list of URLs)</span>
                      </label>
                      <textarea 
                        rows={2}
                        placeholder="URL 1, URL 2, URL 3, ..."
                        value={formImagesRaw}
                        onChange={(e) => setFormImagesRaw(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-2">Sartorial Product Description</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="Craft descriptive summary describing the design aesthetics..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-3 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                      />
                    </div>

                    {/* Part 2: Detailed Architectural Specs Accordion */}
                    <div className="border border-white/5 bg-zinc-950 p-5 rounded">
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-5 pb-2 border-b border-white/5">
                        Sartorial Specs Configuration
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Anatomy Build Type</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Classic Captoe Oxford"
                            value={specType}
                            onChange={(e) => setSpecType(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Structural Construction Method</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 270-Degree Goodyear Welt"
                            value={specConstruction}
                            onChange={(e) => setSpecConstruction(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Leather Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Mahogany Box Calf"
                            value={specLeather}
                            onChange={(e) => setSpecLeather(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Glove Lining Type</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Glove-Grade Tan Calf Lining"
                            value={specLining}
                            onChange={(e) => setSpecLining(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Detailed Leather Description</label>
                        <textarea 
                          rows={2}
                          placeholder="Select reasons and background detailing of your natural leather selection..."
                          value={specLeatherDetail}
                          onChange={(e) => setSpecLeatherDetail(e.target.value)}
                          className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Sole & Edge Trim Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Double Oak Bark Sole"
                            value={specSole}
                            onChange={(e) => setSpecSole(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Laces & Fastening System</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Hand-Waxed Egyptian Cotton Laces"
                            value={specLaces}
                            onChange={(e) => setSpecLaces(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Sole Detail Specifications</label>
                          <textarea 
                            rows={2}
                            placeholder="Detail shock absorption, brass-pegging, density, etc."
                            value={specSoleDetail}
                            onChange={(e) => setSpecSoleDetail(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Laces Detail Specifications</label>
                          <textarea 
                            rows={2}
                            placeholder="Detail braids, eyelet trims, flex and secure loops..."
                            value={specLacesDetail}
                            onChange={(e) => setSpecLacesDetail(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-white/10 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none rounded-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-white/5 pt-6 justify-end">
                      <button 
                        type="button"
                        onClick={() => setActiveFormModal(null)}
                        className="py-3 px-6 border border-white/10 hover:border-white text-[9px] uppercase tracking-[0.3em] font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="py-3 px-8 bg-white text-black hover:bg-zinc-200 text-[9px] uppercase tracking-[0.3em] font-bold transition-colors inline-flex items-center gap-2"
                      >
                        <Save size={10} /> {activeFormModal === "add" ? "Create Showcase" : "Commit Changes"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
