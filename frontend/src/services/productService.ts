const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createProduct = async (formData: FormData) => {

    const res = await fetch(`${API_URL}/products`,{
        method: "POST",
        credentials: "include",
        body: formData
    })


    const data = await res.json()

    if(!res.ok){
        throw new Error(data.message || "product creation failed")
    }
    return data;

}


export const getAllProducts = async () => {
    const res = await fetch(`${API_URL}/products`, {
        method: "GET",
        cache: "no-store"
    })

    const data = await res.json();

    if(!res.ok){
        throw new Error(data.messgae || "Failed to fetch Data from products")
    }
    return data;
}


export const getProductById = async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        cache: "no-store"
    });
    const data = await res.json();

     if (!res.ok) {
    throw new Error(data.message || "Product not found");
  }

  return data.product;

}


export const deleteProduct = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Product delete failed");
  }

  return data;
};

export const updateProduct = async (id: string, formData: FormData) => {
    const res = await fetch(`${API_URL}/products/${id}`,{
        method: "PUT",
        credentials: "include",
        body: formData,
    })

    const data = await res.json();

      if (!res.ok) {
    throw new Error(data.message || "Product update failed");

}

return data;

}