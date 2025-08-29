import Link from "next/link";

export default function ProductCard({ p }) {
  return (
    <Link href={`/products/${p._id}`} className="card overflow-hidden group">
      <div className="aspect-video bg-slate-100">
        {p.image ? (<img src={p.image} alt={p.name} className="w-full h-full object-cover" />) : null}
      </div>
      <div className="p-4">
        <h3 className="font-medium">{p.name}</h3>
        <p className="text-slate-500 text-sm line-clamp-2">{p.description}</p>
        <div className="mt-3 font-semibold">₹{(p.price || 0).toLocaleString()}</div>
      </div>
    </Link>
  );
}
