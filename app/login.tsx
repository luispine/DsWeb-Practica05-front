import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { styled } from "nativewind";
import { useSession } from "./ctx";
import { API_URL, AUTH_LOGIN } from "@env";
import { Redirect } from "expo-router";

const StyledPressable = styled(Pressable);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signIn, session } = useSession();

  /**
   * validateEmail
   * @param email String user's email
   * @returns bolean
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  /**
   * resetErrors
   */
  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  /**
   * handleLogin
   * @returns null
   */
  const handleLogin = () => {
    resetErrors();
    console.log(API_URL, AUTH_LOGIN);

    if (!email) {
      setEmailError("Por favor, ingresa tu correo");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("El correo debe ser @uv.mx o @estudiantes.uv.mx");
      return;
    }
    if (!password) {
      setPasswordError("Por favor, ingresa tu contraseña");
      return;
    }

    signIn(email, password);
  };

  if (session && session?.usuario != null) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 justify-center px-6">
      <View className="bg-white rounded-3xl shadow-xl p-8">
        {/* Título LOGIN DSWEB */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-semibold text-center text-blue-600">
            LOGIN DSWEB
          </Text>
        </View>

        {/* Formulario de inicio de sesión */}
        <View>
          <Text className="text-lg text-gray-600 text-center mb-4"></Text>

          {/* Campo de correo */}
          <TextInput
            className="border-2 border-gray-300 rounded-lg px-4 py-3 mb-5 text-lg"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text className="text-red-500 text-sm mb-4">{emailError}</Text>
          ) : null}

          {/* Campo de contraseña */}
          <TextInput
            className="border-2 border-gray-300 rounded-lg px-4 py-3 mb-5 text-lg"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? (
            <Text className="text-red-500 text-sm mb-4">{passwordError}</Text>
          ) : null}

          {/* Botón de login */}
          <StyledPressable
            onPress={handleLogin}
            className="bg-blue-600 p-4 rounded-lg mb-6 active:opacity-80"
          >
            <Text className="text-white text-xl text-center font-semibold">
              Iniciar sesión
            </Text>
          </StyledPressable>
        </View>
      </View>
    </View>
  );
}
