import React, { useState, useEffect } from "react";
import { useSession } from "../../ctx";
import { styled } from "nativewind";
import {
  Text,
  Pressable,
  ActivityIndicator,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { get, put } from "../../../services";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "react-toastify";
import { PRODUCTS_ROUTE } from "@env";
import { Alert } from "react-native";

export default function App() {
  const { session } = useSession();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<{
    _id: string;
    descripcion: string;
    precio: number;
  }>();
  const [isLoading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad

  useEffect(() => {
    fetchProduct();
  }, []);

  /**
   * fetchContent
   * Obtiene la información del contenido
   */
  const fetchProduct = async () => {
    get(`${PRODUCTS_ROUTE}/${id}`, session?.token)
      .then((response) => {
        console.log(response);
        setProduct(response);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  /**
   * backToList
   */
  const backToList = () => {
    router.push("/");
  };

  /**
   * addToCart
   * @returns null
   */
  const addToCart = () => {
    if (quantity < 1 || quantity > 10) {
      toast.error("La cantidad debe ser entre 1 y 10.");
      return;
    }
    console.log("Producto:", product, "Cantidad:", quantity);

    const savedCart = JSON.parse(
      localStorage.getItem("cart") || '{"detalle": [], "total": 0}'
    );

    const existingProductIndex = savedCart.detalle.findIndex(
      (item: any) => item.producto._id === product?._id
    );

    const precio: number = product?.precio ?? 0.0;
    const subtotal = precio * quantity;

    if (existingProductIndex !== -1) {
      savedCart.detalle[existingProductIndex].cantidad += quantity;
      savedCart.detalle[existingProductIndex].subtotal =
        savedCart.detalle[existingProductIndex].cantidad * precio;
    } else {
      savedCart.detalle.push({
        producto: product,
        cantidad: quantity,
        subtotal: subtotal,
      });
    }

    savedCart.total = savedCart.detalle.reduce(
      (total: number, item: any) => total + item.subtotal,
      0
    );

    localStorage.setItem("cart", JSON.stringify(savedCart));

    Alert.alert(
      "Producto añadido",
      `Producto añadido al carrito con ${quantity} unidades`
    );
    toast.success(`Producto añadido al carrito con ${quantity} unidades`);
    console.log("Carrito actualizado:", localStorage.getItem("cart"));
  };

  /**
   * incrementQuantity
   */
  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  /**
   * decrementQuantity
   */
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );

  return (
    <Screen>
      <ScrollView className="flex-1 p-5 bg-indigo-100">
        <View className="bg-white p-5 rounded-xl shadow-lg border border-gray-300 mb-5">
          {/* Nombre del producto centrado */}
          <Text className="text-3xl font-semibold text-gray-800 mb-3 text-center">
            {product?.descripcion}
          </Text>

          {/* Precio centrado */}
          <Text className="text-xl text-gray-500 mb-4 text-center">
            ${product?.precio}
          </Text>

          {/* Controles de cantidad */}
          <View className="flex-row items-center justify-center mb-6">
            <Pressable
              onPress={decrementQuantity}
              className="p-3 bg-blue-500 rounded-full shadow-md mr-3"
            >
              <Text className="text-white text-lg font-bold">-</Text>
            </Pressable>
            <TextInput
              value={String(quantity)}
              onChangeText={(text) =>
                setQuantity(Math.min(10, Math.max(1, parseInt(text))))
              }
              keyboardType="numeric"
              className="w-16 text-center text-xl font-semibold bg-gray-200 p-3 rounded-md"
            />
            <Pressable
              onPress={incrementQuantity}
              className="p-3 bg-blue-500 rounded-full shadow-md ml-3"
            >
              <Text className="text-white text-lg font-bold">+</Text>
            </Pressable>
          </View>

          {/* Botón Añadir al carrito centrado */}
          <View className="w-full flex-row justify-center">
            <View className="w-48">
              <Pressable
                onPress={addToCart}
                className="p-4 bg-green-500 rounded-xl shadow-md"
              >
                <Text className="text-white text-center text-lg font-bold">
                  Añadir al carrito
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
