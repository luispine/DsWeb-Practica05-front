import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../ctx";
import { styled } from "nativewind";
import { get, post, put, del } from "../../../services";
import { PRODUCTS_ROUTE } from "@env";
import { toast } from "react-toastify";
import { router } from "expo-router";
import Modal from "react-native-modal";

const Card = styled(View);

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 64) / 4; // Ajusta el tamaño de las tarjetas para 4 columnas

export default function App() {
  const { session } = useSession();
  const userRole = session?.usuario[0].rol;
  const [products, setProducts] = useState<
    { _id: string; descripcion: string; precio: number }[]
  >([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    get(PRODUCTS_ROUTE, session?.token)
      .then((response) => {
        setProducts(response);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const seeMore = (producrID: string) => {
    router.push(`products/${producrID}`);
  };

  const createProduct = () => {
    if (description.length > 100) {
      toast.error("La descripción no puede tener más de 100 caracteres.");
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice > 10000) {
      toast.error("El precio debe ser un número y no puede exceder 10000.");
      return;
    }

    const newProduct = { descripcion: description, precio: numericPrice };

    post(PRODUCTS_ROUTE, newProduct, session?.token)
      .then(() => {
        toast.success("Producto añadido correctamente.");
        resetModal();
        fetchProducts();
      })
      .catch(() => {
        toast.error("Error al añadir el producto.");
      });
  };

  const updateProduct = () => {
    if (!editingProduct) return;

    const numericPrice = parseFloat(price);
    if (
      description.length > 100 ||
      isNaN(numericPrice) ||
      numericPrice > 10000
    ) {
      toast.error(
        "La descripción debe tener máximo 100 caracteres y el precio ser menor a 10000."
      );
      return;
    }

    const updatedProduct = { descripcion: description, precio: numericPrice };

    put(`${PRODUCTS_ROUTE}/${editingProduct}`, updatedProduct, session?.token)
      .then(() => {
        toast.success("Producto actualizado correctamente.");
        resetModal();
        fetchProducts();
      })
      .catch(() => {
        toast.error("Error al actualizar el producto.");
      });
  };

  const deleteProduct = (productID: string) => {
    del(`${PRODUCTS_ROUTE}${productID}`, session?.token)
      .then(() => {
        toast.warn("Producto eliminado.");
        fetchProducts();
      })
      .catch(() => {
        toast.error("Error al eliminar el producto.");
      });
  };

  const openEditModal = (product: {
    _id: string;
    descripcion: string;
    precio: number;
  }) => {
    setDescription(product.descripcion);
    setPrice(product.precio.toString());
    setEditingProduct(product._id);
    setModalVisible(true);
  };

  const resetModal = () => {
    setDescription("");
    setPrice("");
    setEditingProduct(null);
    setModalVisible(false);
  };

  return (
    <Screen>
      <ScrollView className="space-y-6 bg-gray-50">
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          numColumns={4} // Cambia el número de columnas a 4
          renderItem={({ item }) => (
            <Card
              className="flex flex-col bg-white shadow-lg rounded-lg p-4 m-2"
              style={{ width: CARD_WIDTH }}
            >
              <Text className="text-sm font-bold text-gray-800">
                {item.descripcion}
              </Text>
              <Text className="text-sm text-blue-600">
                Precio: ${item.precio}
              </Text>

              <Pressable
                className="bg-blue-500 px-2 py-1 rounded-full self-center mt-2"
                onPress={() => seeMore(item._id)}
              >
                <Text className="text-white font-semibold text-xs">
                  Comprar producto
                </Text>
              </Pressable>

              <Pressable
                className="bg-red-500 px-2 py-1 rounded-full self-center mt-2"
                onPress={() => deleteProduct(item._id)}
              >
                <Text className="text-white font-semibold text-xs">
                  Eliminar producto
                </Text>
              </Pressable>
            </Card>
          )}
        />
      </ScrollView>

      <Modal isVisible={isModalVisible}>
        <View className="bg-white rounded-xl p-6 shadow-xl">
          <Text className="text-2xl font-bold mb-4">
            {editingProduct ? "Editar Producto" : "Añadir Producto"}
          </Text>

          <TextInput
            className="border rounded-lg p-3 mb-4"
            placeholder="Descripción (Máximo 100 caracteres)"
            value={description}
            onChangeText={setDescription}
            maxLength={100}
          />

          <TextInput
            className="border rounded-lg p-3 mb-6"
            placeholder="Precio (Máximo 10000)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View className="flex flex-row justify-between">
            <Pressable
              onPress={resetModal}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              <Text className="text-black font-bold">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={editingProduct ? updateProduct : createProduct}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">
                {editingProduct ? "Actualizar" : "Crear"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {userRole === "admin" && (
        <Pressable
          className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold text-lg">+</Text>
        </Pressable>
      )}
    </Screen>
  );
}
