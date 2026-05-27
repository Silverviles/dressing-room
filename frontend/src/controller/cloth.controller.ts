import { api } from "../api/client";

export const fetchClothes = async (token) => {
  return api.getClothes(token);
};

export const createCloth = async (token, formData) => {
  return api.createCloth(token, formData);
};

export const updateCloth = async (token, id, formData) => {
  return api.updateCloth(token, id, formData);
};

export const deleteCloth = async (token, id) => {
  return api.deleteCloth(token, id);
};

export const fetchFavorites = async (token) => {
  return api.getFavorites(token);
};

export const addFavorite = async (token, clothId) => {
  return api.addFavorite(token, clothId);
};

export const removeFavorite = async (token, clothId) => {
  return api.removeFavorite(token, clothId);
};
