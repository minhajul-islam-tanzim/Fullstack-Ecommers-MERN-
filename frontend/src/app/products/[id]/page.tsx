
"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { deleteProduct, getProductById } from "@/services/productService";
import { getMe } from "@/services/authService";

interface ProductImage {
  url: string;
  public_id: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  gender: string;
  description: string;
  mainImage: ProductImage;
  additionalImages: ProductImage[];
  sizes: string[];
  colors: string[];
  stock: number;
}

function ProductDetailsPage() {

  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");


  const handleDelete = async () => { 
    try{ 
      const confirmDelete = window.confirm(
        " are ypu sure "
      )

      if(!confirmDelete){ 
        return 
      }

      await deleteProduct(id);
      router.push("/")
      router.refresh()

    }catch(error: any) { 
      alert(error.message)

    }

  }
  
  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const [productData, userData] = await Promise.all([
          getProductById(id),
          getMe().catch(() => null),
        ]);
        console.log("User role:", userData?.user?.role);
      console.log("Is Admin:", isAdmin);
        
        setProduct(productData);
        setIsAdmin(userData?.user?.role === "admin");
        setActiveImage(0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Product not found"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="p-10 text-center text-red-500">
      {error || "Product not found"}
    </div>;
  }

  // All product images
  const images = [
    product.mainImage,
    ...(product.additionalImages || []),
  ].filter((image) => image?.url);

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-10 md:px-10">

      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.back()}
          className="mb-8 text-[#77716A]"
        >
          ← Back
        </button>

        <div className="grid gap-10 md:grid-cols-2">

          {/* Product Images */}
          <div>
            {images.length > 0 && (
              <>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
                  <Image
                    key={images[activeImage].url}
                    src={images[activeImage].url}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.public_id || index}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                        activeImage === index
                          ? "border-[#B58A62]"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt="Product thumbnail"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <p className="mb-3 text-sm uppercase tracking-widest text-[#B58A62]">
              {product.category}
            </p>

            <h1 className="mb-4 text-3xl font-semibold text-[#292521]">
              {product.name}
            </h1>

            <p className="mb-5 text-2xl font-medium">
              ৳ {product.price}
            </p>

            <p className="mb-6 leading-7 text-[#77716A]">
              {product.description}
            </p>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold">Select Size</h3>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border px-4 py-2 ${
                        selectedSize === size
                          ? "bg-[#292521] text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold">Select Color</h3>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg border px-4 py-2 ${
                        selectedColor === color
                          ? "border-[#B58A62] bg-[#B58A62]/10"
                          : "border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p className={`mb-6 ${
              product.stock > 0 ? "text-green-700" : "text-red-500"
            }`}>
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </p>

            {/* Add to Cart */}
            <button
              disabled={
                product.stock <= 0 ||
                (product.sizes?.length > 0 && !selectedSize) ||
                (product.colors?.length > 0 && !selectedColor)
              }
              className="rounded-xl bg-[#292521] px-6 py-4 text-white disabled:opacity-40"
            >
              Add to Cart
            </button>

            {/* Admin Edit Button */}
            {isAdmin && (
              <div>
              <button
                onClick={() =>
                  router.push(`/admin/edit-product/${product._id}`)
                }
                className="mt-4 rounded-xl border border-[#292521] px-6 py-3 hover:cursor-pointer hover:bg-gray-300"
                >
                Edit Product
              </button >

              <button
              onClick={handleDelete}
                className="mt-4 rounded-xl border border-[#292521] px-6 py-3 hover:cursor-pointer hover:bg-gray-300"
              >
                 Delete Product
              </button>

                </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <ProductDetailsPage />
    </Suspense>
  );
}
