"use client";

import React, { FormEvent, useState } from "react";
import { scrapeAndStoreProduct } from "../lib/actions";

const isValidAmazonProductLink = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    // check if hostname contain amazon.com or amazon.
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const isValidLink =
      isValidAmazonProductLink(searchPrompt);
    if (!isValidLink)
      return alert(
        "Please enter valid amazon product link"
      );

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(
        searchPrompt
      );
      console.log(product);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-wrap gap-4 mt-12 "
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
