import { Products } from "@/views/products";
import React from "react";

export default function ProductsRoot() {
  return (
    <React.Suspense fallback="Loading...">
      <Products />
    </React.Suspense>
  );
}
