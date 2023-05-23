import axios from "axios";
import { useState } from "react";
import { User } from "../utils/types";
import { useHeaders } from "./useHeaders.hook";
import { useMyToast } from "./useMyToast.hook";

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const headers = useHeaders();
  const myToast = useMyToast();

  const fetchSearchResults = async (query: string) => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${query}`, headers);
      setSearchResults(data);
    } catch (err) {
      myToast(
        "Error Occured!",
        "Failed to Load the Search Results",
        "error",
        "bottom-left"
      );
    } finally {
      setLoading(false);
    }
  };

  return { fetchSearchResults, searchResults, loading };
};
