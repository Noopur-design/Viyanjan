"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/fetcher";
import { formatPrice } from "@/lib/money";
import type { Category, MenuItem, Order } from "@/types";

/**
 * Minimal admin console: create menu items, view live orders, advance status.
 * NOTE: this is intentionally unauthenticated for the showcase — gate it behind
 * real auth (NextAuth / middleware) before any production use.
 */
export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    foodColor: "#caa15a",
    spiceLevel: "0",
    isFeatured: true,
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  async function load() {
    try {
      const [cats, ords, items] = await Promise.all([
        apiGet<Category[]>("/api/categories"),
        apiGet<Order[]>("/api/orders"),
        apiGet<MenuItem[]>("/api/menu"),
      ]);
      setCategories(cats);
      setOrders(ords);
      setMenuItems(items);
      if (cats[0] && !form.categoryId)
        setForm((f) => ({ ...f, categoryId: cats[0].id }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createItem() {
    setMsg(null);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        imageUrl = json.data.url;
      }
      await apiPost<MenuItem>("/api/menu", {
        name: form.name,
        description: form.description,
        price: Math.round(parseFloat(form.price) * 100),
        categoryId: form.categoryId,
        foodColor: form.foodColor,
        spiceLevel: parseInt(form.spiceLevel),
        isFeatured: form.isFeatured,
        imageUrl,
      });
      setMsg("Item created ✓");
      setForm((f) => ({ ...f, name: "", description: "", price: "", imageUrl: "" }));
      setImageFile(null);
      setImagePreview(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Create failed");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    setMsg(null);
    try {
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
      setMsg("Item deleted ✓");
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function advance(order: Order, status: Order["status"]) {
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-28">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-gold">Admin</h1>
        <button
          onClick={logout}
          className="rounded-full border border-cream/25 px-4 py-2 text-[11px] uppercase tracking-widest text-cream/70 transition hover:border-gold hover:text-gold"
        >
          Log out
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-ember">{msg}</p>}

      <div className="mt-8 grid gap-10 md:grid-cols-2 [&>section.md\:col-span-2]:md:col-span-2">
        {/* create menu item */}
        <section>
          <h2 className="mb-4 font-display text-2xl text-cream">
            Add menu item
          </h2>
          <div className="space-y-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded border border-cream/20 bg-black/40 px-3 py-2 text-cream"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded border border-cream/20 bg-black/40 px-3 py-2 text-cream"
            />
            <input
              placeholder="Price (e.g. 249)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded border border-cream/20 bg-black/40 px-3 py-2 text-cream"
            />
            <select
              value={form.categoryId || ""}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="w-full rounded border border-cream/20 bg-black/40 px-3 py-2 text-cream"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {/* image upload */}
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Item image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setImageFile(f);
                  setImagePreview(f ? URL.createObjectURL(f) : null);
                }}
                className="w-full rounded border border-cream/20 bg-black/40 px-3 py-2 text-sm text-cream/80 file:mr-3 file:rounded-full file:border-0 file:bg-ember file:px-3 file:py-1 file:text-xs file:text-char"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-28 w-full rounded-lg object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-cream/70">Food color</label>
              <input
                type="color"
                value={form.foodColor}
                onChange={(e) =>
                  setForm({ ...form, foodColor: e.target.value })
                }
                className="h-9 w-16 rounded bg-transparent"
              />
              <select
                value={form.spiceLevel ?? "0"}
                onChange={(e) =>
                  setForm({ ...form, spiceLevel: e.target.value })
                }
                className="rounded border border-cream/20 bg-black/40 px-2 py-1.5 text-cream"
              >
                {[0, 1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    Spice {n}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-sm text-cream/70">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                />
                Featured
              </label>
            </div>
            <button
              onClick={createItem}
              disabled={!form.name || !form.price || !form.categoryId}
              className="rounded-full bg-ember px-5 py-2 font-medium text-char hover:bg-gold disabled:opacity-50"
            >
              Create item
            </button>
          </div>
        </section>

        {/* delete menu items */}
        <section className="md:col-span-2">
          <h2 className="mb-4 font-display text-2xl text-cream">Menu items</h2>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-cream/10 bg-black/30 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-cream">{item.name}</span>
                  <span className="ml-3 text-sm text-gold">
                    {formatPrice(item.price)}
                  </span>
                  <span className="ml-3 text-xs text-cream/40">
                    {categories.find((c) => c.id === item.categoryId)?.name}
                  </span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:border-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))}
            {menuItems.length === 0 && (
              <p className="text-cream/60">No menu items yet.</p>
            )}
          </div>
        </section>

        {/* live orders */}
        <section>
          <h2 className="mb-4 font-display text-2xl text-cream">Orders</h2>
          {orders.length === 0 && (
            <p className="text-cream/60">No orders yet.</p>
          )}
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-cream/10 bg-black/30 p-4"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-cream">
                    {o.customerName}{" "}
                    <span className="text-cream/40">
                      #{o.id.slice(-6)}
                    </span>
                  </span>
                  <span className="text-gold">
                    {formatPrice(o.totalAmount)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-cream/40">
                  Table for {o.guests} · {o.paymentMethod}
                  {o.tableNumber ? ` · Table ${o.tableNumber}` : ""}
                </div>
                <div className="mt-1 text-sm text-cream/60">
                  {o.items.map((i) => `${i.quantity}× ${i.nameSnapshot}`).join(", ")}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-cream/10 px-2 py-0.5 text-xs text-cream">
                    {o.status}
                  </span>
                  {(
                    [
                      "CONFIRMED",
                      "PREPARING",
                      "READY",
                      "COMPLETED",
                    ] as const
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => advance(o, s)}
                      className="rounded-full border border-cream/20 px-2 py-0.5 text-xs text-cream/70 hover:border-gold hover:text-gold"
                    >
                      {s.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </main>
  );
}

