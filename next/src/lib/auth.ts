import { User } from "@/provider/userprovider";
import axios from "axios";

export const currentUserFetcher = async (): Promise<User | null> => {
  try {
    const rawToken = localStorage.getItem('__Pearl_Token');
    if (!rawToken) return null;

    const token = `Bearer ${rawToken}`;
    const response = await axios.get(`http://localhost:2706/api/v1/user/current-user`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      const { name, email } = response.data;

      return {
        name,
        email,
        avatar: "/placeholder.svg", 
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};






