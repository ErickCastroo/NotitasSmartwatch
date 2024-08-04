import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { crearUsuarioByTokenResponse, fetchData, guardarUsuarioEnStorage, obtenerUsuarioDesdeStorage } from '../../lib/utils';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [usuarioVerificado, setUsuarioVerificado] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const login = async (correo, password) => {
    try {
      const response = await fetchData({
        url: `/notitas_auth/api/v1/auth/login`,
        method: 'POST',
        credentials: 'include',
        authRoute: true,
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const usuario = crearUsuarioByTokenResponse(response);
      await guardarUsuarioEnStorage(usuario);
      setUsuario(usuario);
      router.push('/Home');
    } catch (error) {
      console.error('Error en el login:', error);
    }
  };

  const register = async (nombre, correo, password) => {
    try {
      const response = await fetchData({
        url: `/notitas_auth/api/v1/auth/registro`,
        method: 'POST',
        credentials: 'include',
        authRoute: true,
        body: JSON.stringify({
          nombre,
          correo,
          password,
        }),
      });

      const usuario = crearUsuarioByTokenResponse(response);
      await guardarUsuarioEnStorage(usuario);
      setUsuario(usuario);
      router.push('/Home');
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  const logout = async () => {
    try {
      await fetchData({
        url: '/notitas_auth/api/v1/auth/logout',
        method: 'POST',
        credentials: 'include',
        authRoute: true,
      });

      await AsyncStorage.removeItem('usuario');
      setUsuario(null);
      router.push('/');
    } catch (error) {
      console.error('Error en el logout:', error);
    }
  };

  const auth = { usuario, setUsuario, usuarioVerificado, login, register, logout };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };