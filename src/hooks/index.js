import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import ProfileContext from '../contexts/ProfileContext';
import ApiContext from "../contexts/ApiContext";

const useAuth = () => useContext(AuthContext);
const useProfile = () => useContext(ProfileContext);
const useApiHost = () => useContext(ApiContext);

export { useAuth, useProfile, useApiHost };
