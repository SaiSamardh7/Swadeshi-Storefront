// The green/red square used on menu and catering listings. Shared so the two
// pages can't drift apart on what "vegetarian" looks like.
export function VegDot({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border ${isVeg ? "border-green-600" : "border-red-600"}`}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
}
