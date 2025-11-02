import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { gql, useMutation, useQuery, useApolloClient } from '@apollo/client';

const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();

  // Check if token exists on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        setHasToken(!!token);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setHasToken(false);
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const { data: meData, loading: meLoading } = useQuery(GET_ME, {
    skip: !hasToken,
    fetchPolicy: 'network-only', // Always fetch fresh data from server
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
    },
    onError: () => {
      setUser(null);
      setHasToken(false);
    },
  });

  const [loginMutation] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      if (data?.login?.token) {
        // Clear cache before setting new auth state
        await apolloClient.clearStore();
        await SecureStore.setItemAsync('authToken', data.login.token);
        setHasToken(true);
        setUser(data.login.user);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      throw error;
    },
  });

  const [registerMutation] = useMutation(REGISTER, {
    onCompleted: async (data) => {
      if (data?.register?.token) {
        // Clear cache before setting new auth state
        await apolloClient.clearStore();
        await SecureStore.setItemAsync('authToken', data.register.token);
        setHasToken(true);
        setUser(data.register.user);
      }
    },
    onError: (error) => {
      console.error('Register error:', error);
      throw error;
    },
  });

  const login = async (email, password) => {
    try {
      await loginMutation({
        variables: { email, password },
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      await registerMutation({
        variables: { email, password, firstName, lastName },
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear Apollo cache first
      await apolloClient.clearStore();
      // Then delete the auth token
      await SecureStore.deleteItemAsync('authToken');
      // Finally clear user state and token flag
      setHasToken(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still try to clear user state
      setHasToken(false);
      setUser(null);
    }
  };

  const value = {
    user,
    loading: loading || meLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER' || user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



