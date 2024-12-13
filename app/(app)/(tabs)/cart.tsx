import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../ctx";
import { toast } from "react-toastify";
import { post, get } from "../../../services";
import { SALES_ROUTE, UTIL_ROUTE, UTIL_DOWNLOAD, UTIL_SEND } from "@env";
import { ShoppingCart } from "../../../components/icons/Icons";
import { router } from "expo-router";

export default function App() {
  const { session } = useSession();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0.0);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || '{"detalle": [], "total": 0}'
    );
    setCart(savedCart.detalle);
    setTotal(savedCart.total);
  }, []);

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.producto._id !== productId);
    const newCart = {
      detalle: updatedCart,
      total: calculateTotal(updatedCart),
    };
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(updatedCart);
    toast.success("Producto eliminado del carrito");
  };

  const calculateTotal = (cart: any[]) => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const handlePurchase = () => {
    if (cart.length === 0) {
      toast.warn("No tienes productos en tu carrito jejejeje");
    } else {
      let venta = {
        cliente: {
          _id: session?.usuario[0]._id,
          nombre: session?.usuario[0].nombre,
          correo: session?.usuario[0].correo,
        },
        detalle: cart,
        total: total,
      };
      console.log(venta);

      post(SALES_ROUTE, venta, session?.token)
        .then((response) => {
          console.log(response);
          localStorage.removeItem("cart");
          setCart([]);
          getSaleReport(response._id);
          downloadReport(response._id);
          toast.success("Compra realizada exitósamente!!!!!");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error);
        });
    }
  };

  const getSaleReport = (ventaID: string) => {
    console.log(ventaID);
    get(`${UTIL_ROUTE}${UTIL_SEND}${ventaID}`, session?.token)
      .then((response) => {
        console.log(response);
        toast.success("Reporte enviado");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  const downloadReport = (ventaID: string) => {
    console.log(ventaID);
    get(`${UTIL_ROUTE}${UTIL_DOWNLOAD}${ventaID}`, session?.token)
      .then((response) => {
        console.log(response);
        toast.success("Reporte descargado");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="bg-white p-6 rounded-3xl shadow-lg">
          <Text className="text-3xl font-bold text-gray-900 mb-6"></Text>

          {cart.length === 0 ? (
            <View className="flex-1 items-center">
              <View className="p-4 my-5"></View>

              <Text className="text-4xl font-semibold text-blue-600"></Text>
              <Text className="text-xl text-gray-600 mb-6"></Text>
              <Pressable
                className="bg-blue-600 p-4 rounded-full shadow-2xl"
                onPress={() => router.push("/")}
              >
                <Text
                  style={{ userSelect: "none" }}
                  className="text-white text-2xl font-semibold"
                >
                  no hay productos
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center p-4 bg-indigo-100">
              <FlatList
                data={cart}
                keyExtractor={(item) => item.producto._id}
                renderItem={({ item }) => (
                  <View className="flex flex-row justify-between p-4 bg-gray-100 rounded-xl mb-4 shadow-md">
                    <View className="w-4/6 px-2">
                      <Text className="text-xl font-semibold text-gray-800">
                        {item.producto.descripcion}
                      </Text>
                      <Text className="text-lg text-gray-700">
                        Precio: ${item.producto.precio}
                      </Text>
                      <Text className="text-lg text-gray-600">
                        Cantidad: {item.cantidad}
                      </Text>
                      <Text className="text-lg text-gray-600">
                        Subtotal: ${item.subtotal}
                      </Text>
                    </View>

                    <View className="w-auto px-2">
                      <Pressable
                        onPress={() => removeFromCart(item.producto._id)}
                        className="mt-4 p-3 bg-red-600 rounded-xl shadow-md"
                      >
                        <Text className="text-white text-center font-semibold">
                          Eliminar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                ItemSeparatorComponent={() => (
                  <View className="my-2 h-px bg-slate-200" />
                )}
              />
              <View className="w-full border-t border-t-slate-300 mt-6 pt-4">
                <View className="flex flex-row justify-between">
                  <View>
                    <Text className="text-2xl font-semibold">Total:</Text>
                    <Text className="text-lg">Artículos: {cart.length}</Text>
                  </View>
                  <Text className="text-4xl font-extrabold text-blue-600">
                    ${calculateTotal(cart).toFixed(2)}
                  </Text>
                </View>

                {/* Botón comprar más pequeño */}
                <Pressable
                  onPress={handlePurchase}
                  className="mt-6 p-3 bg-green-600 rounded-full shadow-xl"
                >
                  <Text className="text-white text-center text-lg font-bold">
                    Comprar
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
