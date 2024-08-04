import { useAuth } from "./useAuth";
import { router } from "expo-router";
import { Text } from "react-native-web";

function PublicRoute({ children }) {
  const auth = useAuth();

  if (auth.usuario) {
    router.push("/Home");
    return null;
  }

  return children;
}

export { PublicRoute };
