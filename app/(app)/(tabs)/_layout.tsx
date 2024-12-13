import { Tabs } from "expo-router";
import {
  ShoppingCart,
  ClipBoardList,
  BoxIcon,
} from "../../../components/icons/Icons";
import { useSession } from "../../ctx";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

export default function TabLayout() {
  const { session, signOut } = useSession();

  return (
    <View style={styles.container}>
      {/* Encabezado personalizado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
        <StyledPressable onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </StyledPressable>
      </View>

      {/* Tabs personalizados */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1D4ED8", // Azul oscuro
          tabBarInactiveTintColor: "#6B7280", // Gris
          tabBarStyle: styles.tabBar, // Barra personalizada
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Productos",
            tabBarIcon: ({ color }) => (
              <ClipBoardList size={22} color={color} />
            ),
            tabBarLabel: "Productos", // Etiqueta personalizada
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Carrito",
            tabBarIcon: ({ color }) => <ShoppingCart size={22} color={color} />,
            tabBarLabel: "Carrito",
          }}
        />
        <Tabs.Screen
          name="compras"
          options={{
            title: "Mis compras",
            tabBarIcon: ({ color }) => <BoxIcon size={22} color={color} />,
            tabBarLabel: "Mis compras",
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Fondo claro
  },
  header: {
    backgroundColor: "#1E3A8A", // Azul oscuro
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF", // Blanco
  },
  signOutButton: {
    backgroundColor: "#EF4444", // Rojo
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signOutText: {
    color: "#FFFFFF", // Blanco
    fontWeight: "bold",
    fontSize: 14,
  },
  tabBar: {
    backgroundColor: "#E5E7EB", // Gris claro
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB", // Gris más oscuro
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
