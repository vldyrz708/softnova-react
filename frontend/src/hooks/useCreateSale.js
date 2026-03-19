import { useState } from "react";

export function useCreateSale() {
  const [loading, setLoading] = useState(false);

  const createSale = async (saleData) => {
    setLoading(true);
    try {
      // Aquí va tu llamada al backend para registrar la venta
      console.log("Creando venta:", saleData);
      // Ejemplo:
      // await fetch("/api/sales", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(saleData),
      // });
    } finally {
      setLoading(false);
    }
  };

  return { createSale, loading };
}
