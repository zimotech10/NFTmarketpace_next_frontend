"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import TabBar from "@/components/TabBar";
import exploreImage from "../../public/images/explore-hero.png";
import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";
import { Icon } from "@iconify-icon/react/dist/iconify.js";

const ExplorePage = () => {
  const [filter, setFilter] = useState(false);
  return (
    <div className="md:p-20">
      <Hero
        heading="Explore Incredible Art"
        desription="Lampapuy NFT provides marketing and smart contract services to Elevate your brand by connecting it with more buyers."
        buttonText="Create an NFT"
        image={exploreImage.src}
        imgHeight={1000}
        imgWidth={1000}
      />
      <TabBar pathname="items" />
      <SearchBar placeholder="Search NFT by Title" />
      <div className="flex flex-col md:flex-row">
        <div className="hidden md:block">
          <Filter />
        </div>
        <div className="flex flex-row p-5 justify-between md:hidden relative">
          <button
            onClick={() => setFilter(!filter)}
            className="w-40 flex justify-center py-2 font-semibold text-black"
            style={{
              background:
                "linear-gradient(149deg, #FFEA7F 9.83%, #AB5706 95.76%)",
              borderRadius: "40px",
            }}
          >
            Add filter
          </button>
          <button
            className="w-40 flex items-center gap-1 justify-center py-2 font-semibold text-white"
            style={{
              border: "1.5px solid var(--Color-Gradient-01, #F88430)",
              borderRadius: "40px",
            }}
          >
            Sweep
            <Icon icon="fluent:broom-16-regular" />
          </button>
          {filter && (
            <div className="absolute z-30 top-24">
              <Filter />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;