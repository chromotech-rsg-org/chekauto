import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface VehicleData {
  chassi: string;
  renavam: string;
  ano: string;
  placa: string;
  estado: string;
  cidade: string;
  informacaoAdicional: string;
  notaFiscal: File | null;
}

export interface CustomerData {
  nomeCompleto: string;
  cpfCnpj: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  email: string;
  telefone: string;
}

export interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface CheckoutContextData {
  vehicle: VehicleData;
  customer: CustomerData;
  product: ProductData;
  setVehicleData: (data: VehicleData) => void;
  setCustomerData: (data: CustomerData) => void;
  setProductData: (data: ProductData) => void;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextData | undefined>(undefined);

const initialVehicleData: VehicleData = {
  chassi: '',
  renavam: '',
  ano: '',
  placa: '',
  estado: '',
  cidade: '',
  informacaoAdicional: '',
  notaFiscal: null,
};

const initialCustomerData: CustomerData = {
  nomeCompleto: '',
  cpfCnpj: '',
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  complemento: '',
  email: '',
  telefone: '',
};

const initialProductData: ProductData = {
  id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<VehicleData>(() => {
    const saved = sessionStorage.getItem('checkout-vehicle');
    return saved ? JSON.parse(saved) : initialVehicleData;
  });

  const [customer, setCustomer] = useState<CustomerData>(() => {
    const saved = sessionStorage.getItem('checkout-customer');
    return saved ? JSON.parse(saved) : initialCustomerData;
  });

  const [product, setProduct] = useState<ProductData>(() => {
    const saved = sessionStorage.getItem('checkout-product');
    return saved ? JSON.parse(saved) : initialProductData;
  });

  useEffect(() => {
    sessionStorage.setItem('checkout-vehicle', JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    sessionStorage.setItem('checkout-customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    sessionStorage.setItem('checkout-product', JSON.stringify(product));
  }, [product]);

  const setVehicleData = (data: VehicleData) => {
    setVehicle(data);
  };

  const setCustomerData = (data: CustomerData) => {
    setCustomer(data);
  };

  const setProductData = (data: ProductData) => {
    setProduct(data);
  };

  const clearCheckout = () => {
    setVehicle(initialVehicleData);
    setCustomer(initialCustomerData);
    setProduct(initialProductData);
    sessionStorage.removeItem('checkout-vehicle');
    sessionStorage.removeItem('checkout-customer');
    sessionStorage.removeItem('checkout-product');
  };

  return (
    <CheckoutContext.Provider
      value={{
        vehicle,
        customer,
        product,
        setVehicleData,
        setCustomerData,
        setProductData,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}