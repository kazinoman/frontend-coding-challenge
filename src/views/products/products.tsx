"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { ProductModal } from "@/views/products/productModal/productModal";
import { BackToHome } from "@/components/backToHome/backToHome";
import { ProductList } from "@/views/products/productList/productList";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { PRODUCTS_DATA } from "@/data/productsData";
import { useRouter, useSearchParams } from "next/navigation";

export const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination({ items: PRODUCTS_DATA, itemsPerPage: 5 });
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the product-id from URL params
  const productId = searchParams.get("product-id");

  const handleOpenModal = useCallback((product: Product) => {
    router.push("/products?product-id=" + product.id);
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Set selected product if a matching product-id is found in the URL
  useEffect(() => {
    if (productId) {
      const product = PRODUCTS_DATA.find((item) => item.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productId]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
};
