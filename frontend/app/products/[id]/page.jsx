"use client";
import { useEffect, useState } from "react";
import { API_URL, api } from "../../../lib/api";
import { useAuth } from "../../../components/AuthContext";
import ProductCard from "../../../components/ProductCard";

export default function ProductDetail({ params }) {
  const { id } = params;
  const { token, incrementCartCount } = useAuth();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`).then(r => r.json()).then(setP);
    // Fetch related products
    fetch(`${API_URL}/api/products`).then(r => r.json()).then(data => {
      const filtered = data.filter(product => product._id !== id).slice(0, 4);
      setRelatedProducts(filtered);
    });
  }, [id]);

  const add = async () => {
    if (!token) { setMsg("Please login first."); return; }
    try {
      await api("/api/cart/add", { method: "POST", body: { productId: id, quantity: qty }, token });
      setMsg("Added to cart!");
      incrementCartCount(qty);
    } catch (e) {
      setMsg(e.message);
    }
  };

  // Generate multiple image variations for thumbnails
  const generateImages = (baseImage) => {
    if (!baseImage) return [];
    // For demo purposes, we'll use the same image with different filters/angles
    // In a real app, you'd have multiple actual product images
    return [
      baseImage,
      baseImage,
      baseImage,
      baseImage
    ];
  };

  if (!p) return (
    <div className="container">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading product...</div>
      </div>
    </div>
  );

  const images = generateImages(p.image);

  return (
    <div className="container ">
      {/* Breadcrumbs */}
      <nav className="text-sm text-slate-600 mb-8">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="hover:text-slate-900">Home</a></li>
          <li>/</li>
          <li><a href="/products" className="hover:text-slate-900">Timepieces</a></li>
          <li>/</li>
          <li className="text-slate-900">{p.name}</li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="container grid lg:grid-cols-2 gap-12 mb-16">
        {/* Left Side - Product Images */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className=" bg-slate-100 rounded-xl overflow-hidden">
            {images[selectedImage] && (
              <img 
                src={images[selectedImage]} 
                alt={p.name} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-slate-900' 
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                {img ? (
                  <img 
                    src={img} 
                    alt={`${p.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Thumbnail {index + 1}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-8">
          {/* Product Title & Description */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{p.name}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {p.description || "A testament to classic naval chronometers, featuring a striking blue sunray dial and a polished stainless steel case."}
            </p>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-slate-900">
            ₹{(p.price || 0).toLocaleString()}
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                min="1" 
                value={qty} 
                onChange={e => setQty(parseInt(e.target.value) || 1)} 
                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <button 
                onClick={add} 
                className="flex-1 bg-slate-900 text-white py-4 px-8 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                ADD TO BAG
              </button>
            </div>
            {msg && (
              <p className={`text-sm ${msg.includes('Added') ? 'text-green-600' : 'text-red-600'}`}>
                {msg}
              </p>
            )}
          </div>

          {/* Additional Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-slate-600 hover:text-slate-900 underline">Find in Boutique</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 underline">Contact Us</a>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-4">
            {/* Product Details */}
            <div className="border-t border-slate-200 pt-4">
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="flex items-center justify-between w-full text-left py-2"
              >
                <span className="font-medium text-slate-900">PRODUCT DETAILS</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${detailsOpen ? 'rotate-45' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {detailsOpen && (
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="font-medium">Model Number:</span>
                      <span className="ml-2">AET-{p._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Case Material:</span>
                      <span className="ml-2">{p.strapMaterial || '316L Stainless Steel'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Case Diameter:</span>
                      <span className="ml-2">42 mm</span>
                    </div>
                    <div>
                      <span className="font-medium">Case Thickness:</span>
                      <span className="ml-2">11 mm</span>
                    </div>
                    <div>
                      <span className="font-medium">Crystal:</span>
                      <span className="ml-2">Scratch-Resistant Sapphire</span>
                    </div>
                    <div>
                      <span className="font-medium">Movement:</span>
                      <span className="ml-2">Swiss Automatic (Caliber 2824)</span>
                    </div>
                    <div>
                      <span className="font-medium">Power Reserve:</span>
                      <span className="ml-2">38 hours</span>
                    </div>
                    <div>
                      <span className="font-medium">Water Resistance:</span>
                      <span className="ml-2">10 ATM (100 meters)</span>
                    </div>
                    <div>
                      <span className="font-medium">Strap Material:</span>
                      <span className="ml-2">{p.strapMaterial || 'Stainless Steel Bracelet'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Clasp Type:</span>
                      <span className="ml-2">Butterfly Clasp with Push-Buttons</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border-t border-slate-200 pt-4">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="flex items-center justify-between w-full text-left py-2"
              >
                <span className="font-medium text-slate-900">SHIPPING & RETURNS</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${shippingOpen ? 'rotate-45' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {shippingOpen && (
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>Free worldwide shipping on all orders over ₹50,000. Standard delivery takes 5-7 business days.</p>
                  <p>30-day return policy. Contact our customer service team for any questions about returns or exchanges.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look Section */}
      {relatedProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Complete the Look</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} p={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
