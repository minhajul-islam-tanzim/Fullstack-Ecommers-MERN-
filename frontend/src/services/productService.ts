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