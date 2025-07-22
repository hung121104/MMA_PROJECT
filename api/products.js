import { API_URL } from "@env";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { getToken } from "./auth";

export const getAllProducts = async () => {
  console.log(API_URL, "/product/get-all");
  const res = await axios.get(`${API_URL}/product/get-all`);
  return res.data.products;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_URL}/product/${id}`);
  return res.data.product;
};

export const createProduct = async (productData) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    console.log("Creating product with data:", {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      category: productData.category,
      hasFile: !!productData.file,
    });

    // Try JSON first (no file)
    if (!productData.file) {
      console.log("🧪 Sending JSON (no file)");

      const jsonData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || undefined,
      };

      try {
        const res = await axios.post(`${API_URL}/product/create`, jsonData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000,
        });

        console.log("✅ JSON SUCCESS:", res.data);
        return res.data;
      } catch (jsonError) {
        console.log("❌ JSON failed, using FormData...");
      }
    }

    // FormData approach - convert real image to data URI (like placeholder)
    console.log("📤 Using FormData with data URI");

    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price.toString());
    formData.append("stock", productData.stock.toString());

    if (productData.category) {
      formData.append("category", productData.category);
    }

    // Convert any image to data URI format (placeholder format works!)
    let imageDataUri;

    if (productData.file && productData.file.uri) {
      console.log("📸 Converting real image to data URI");

      if (productData.file.uri.startsWith("data:")) {
        // Already data URI
        imageDataUri = productData.file.uri;
      } else {
        // Convert file to data URI
        const base64 = await FileSystem.readAsStringAsync(
          productData.file.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        const mimeType = productData.file.type || "image/jpeg";
        imageDataUri = `data:${mimeType};base64,${base64}`;
      }

      console.log(
        "✅ Image converted to data URI, length:",
        imageDataUri.length
      );
    } else {
      console.log("📸 Using placeholder data URI");
      imageDataUri =
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
    }

    // Use same format as working placeholder
    formData.append("file", {
      uri: imageDataUri,
      type: "image/jpeg",
      name: productData.file?.name || "product.jpg",
    });

    console.log("📤 Sending FormData with data URI");

    const response = await fetch(`${API_URL}/product/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ SUCCESS:", result);
    return result;
  } catch (error) {
    console.error("❌ ERROR:", error);
    throw new Error(`Create Product Error: ${error.message}`);
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    console.log("Updating product with ID:", productId, "Data:", productData);

    const response = await axios.put(
      `${API_URL}/product/${productId}`,
      {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    console.log("✅ Update product success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update product error:", error);
    throw new Error(`Update Product Error: ${error.message}`);
  }
};

export const updateProductImage = async (productId, imageFile) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    console.log("Updating product image for ID:", productId);

    const formData = new FormData();

    // Convert image to data URI format
    let imageDataUri;

    if (imageFile && imageFile.uri) {
      if (imageFile.uri.startsWith("data:")) {
        imageDataUri = imageFile.uri;
      } else {
        const base64 = await FileSystem.readAsStringAsync(imageFile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const mimeType = imageFile.type || "image/jpeg";
        imageDataUri = `data:${mimeType};base64,${base64}`;
      }
    }

    formData.append("file", {
      uri: imageDataUri,
      type: "image/jpeg",
      name: imageFile?.name || "product.jpg",
    });

    const response = await fetch(`${API_URL}/product/image/${productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Update product image success:", result);
    return result;
  } catch (error) {
    console.error("❌ Update product image error:", error);
    throw new Error(`Update Product Image Error: ${error.message}`);
  }
};

export const deleteProductImage = async (productId, imageId) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    console.log("Deleting product image:", productId, imageId);

    const response = await axios.delete(
      `${API_URL}/product/delete-image/${productId}?id=${imageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    console.log("✅ Delete product image success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Delete product image error:", error);
    throw new Error(`Delete Product Image Error: ${error.message}`);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    console.log("Deleting product with ID:", productId);

    const response = await axios.delete(
      `${API_URL}/product/delete/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    console.log("✅ Delete product success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Delete product error:", error);
    throw new Error(`Delete Product Error: ${error.message}`);
  }
};
