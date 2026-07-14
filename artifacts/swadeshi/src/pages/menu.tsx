import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FULL_MENU } from "@/data/fullmenu";
import { getMenuItemDescription, getMenuItemPhoto } from "@/data/menu-display";
import { BUSINESS } from "@/lib/business";

// Stable item id from category + name so identical dish names in different
// categories stay distinct.
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type FlatItem = {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  category: string;
  description: string;
  img: string;
};

const ALL_ITEMS: FlatItem[] = FULL_MENU.flatMap((s) =>
  s.categories.flatMap((c) =>
    c.items.map((i) => ({
      id: `${slug(c.category)}-${slug(i.name)}`,
      name: i.name,
      price: i.price,
      isVeg: i.isVeg,
      category: c.category,
      description: getMenuItemDescription({ ...i, category: c.category }),
      img: getMenuItemPhoto({ ...i, category: c.category }),
    }))
  )
);

// Popular strip: first real menu item whose name matches each food photo we
// have. Keeps prices/veg flags honest (pulled from the real menu, not invented).
const POPULAR = ([/biryani/i, /masala dosa/i, /paneer/i, /samosa/i, /lassi/i, /idl/i, /pani ?puri/i, /naan/i])
  .map((re) => {
    const item = ALL_ITEMS.find((i) => re.test(i.name));
    return item ?? null;
  })
  .filter((x): x is FlatItem => x !== null);

const SECTIONS = ["All", ...FULL_MENU.map((s) => s.section)];

function VegDot({ isVeg }: { isVeg: boolean }) {
  return (
    <div
      className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border shrink-0 ${isVeg ? "border-green-600" : "border-red-600"}`}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </div>
  );
}

export default function Menu() {
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState<"all" | "veg" | "non-veg">("all");
  const [activeSection, setActiveSection] = useState("All");

  const q = search.trim().toLowerCase();

  // Filtered menu, preserving section → category structure.
  const sections = useMemo(() => {
    return FULL_MENU.filter((s) => activeSection === "All" || s.section === activeSection)
      .map((s) => ({
        section: s.section,
        categories: s.categories
          .map((c) => ({
            category: c.category,
            items: c.items.filter((i) => {
              if (diet === "veg" && !i.isVeg) return false;
              if (diet === "non-veg" && i.isVeg) return false;
              if (q && !i.name.toLowerCase().includes(q)) return false;
              return true;
            }),
          }))
          .filter((c) => c.items.length > 0),
      }))
      .filter((s) => s.categories.length > 0);
  }, [q, diet, activeSection]);

  const resultCount = sections.reduce(
    (n, s) => n + s.categories.reduce((m, c) => m + c.items.length, 0),
    0
  );

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Hero Banner */}
      <div className="w-full h-48 md:h-64 bg-secondary flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex">
          <img src="/images/biryani.jpg" className="w-1/3 h-full object-cover opacity-60" alt="" />
          <img src="/images/dosa.jpg" className="w-1/3 h-full object-cover opacity-60" alt="" />
          <img src="/images/thali.jpg" className="w-1/3 h-full object-cover opacity-60" alt="" />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Authentic Flavors, <span className="text-primary">Cooked Fresh</span>
          </h1>
          <Button asChild size="lg" className="rounded-full px-8">
            <a href={BUSINESS.orderUrl} target="_blank" rel="noopener noreferrer">Order on Heartland</a>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Popular strip */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Popular Picks</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {POPULAR.map((item) => (
              <Card key={item.id} className="shrink-0 w-52 overflow-hidden border-none shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.img}
                    alt={`${item.name}, prepared and ready to serve`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <VegDot isVeg={item.isVeg} />
                    <h3 className="text-sm font-semibold leading-tight line-clamp-2">{item.name}</h3>
                  </div>
                  <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-2 font-bold">${item.price.toFixed(2)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Controls */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur -mx-4 px-4 py-3 border-b mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search the menu"
                placeholder="Search the full menu…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1 rounded-full border p-1 self-start" role="group" aria-label="Diet filter">
              {(["all", "veg", "non-veg"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiet(d)}
                  aria-pressed={diet === d}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                    diet === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {d === "non-veg" ? "Non-Veg" : d}
                </button>
              ))}
            </div>
          </div>
          {/* Section pills */}
          <div className="flex overflow-x-auto gap-2 mt-3 no-scrollbar">
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                aria-pressed={activeSection === sec}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeSection === sec
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground hover:bg-muted border-border"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{resultCount} items</p>

        {/* Sectioned list */}
        {sections.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No items match your search.</div>
        ) : (
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.section}>
                <h2 className="text-2xl font-bold mb-4">{s.section}</h2>
                <div className="space-y-6">
                  {s.categories.map((c) => (
                    <div key={c.category}>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        {c.category}
                      </h3>
                      <ul className="grid gap-4 lg:grid-cols-2">
                        {c.items.map((i, idx) => {
                          // The source menu repeats some names within a category,
                          // so include the source index to keep React keys unique.
                          const id = `${slug(c.category)}-${slug(i.name)}`;
                          const display = { ...i, category: c.category };
                          const description = getMenuItemDescription(display);
                          const img = getMenuItemPhoto(display);
                          return (
                            <li
                              key={`${id}-${idx}`}
                              className="group grid grid-cols-[7.5rem_1fr] items-center overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[10rem_1fr]"
                            >
                              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                                <img
                                  src={img}
                                  alt={`${i.name}, prepared and ready to serve`}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                              <div className="flex min-w-0 flex-col p-3.5 sm:p-4">
                                <div className="flex items-start gap-2">
                                  <VegDot isVeg={i.isVeg} />
                                  <h4 className="flex-1 text-sm font-semibold leading-snug sm:text-base">{i.name}</h4>
                                  <span className="shrink-0 text-sm font-bold text-primary">${i.price.toFixed(2)}</span>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-2 sm:text-sm">
                                  {description}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
