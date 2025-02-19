'use client';

import { useState, useEffect, useRef } from 'react';
import Hero from '@/components/Hero';
import TabBar from '@/components/TabBar';
import exploreImage from '@/public/images/explore-hero.png';
import SearchBar from '@/components/SearchBar';
import Filter from '@/components/Filter';
import ItemCard from '@/components/ItemCard';
import { Icon } from '@iconify-icon/react';
import PopUp from '@/components/PopUp';
import { NftApi } from '@/api/nftApi';
import { BigSpinner } from '@/components/Spinner';

// Define the NFT type
interface Nft {
  id: number;
  name: string;
  image: string;
  collection: string;
  price: string;
  mintAddress: string;
  owner: string;
  status?: string;
  symbol?: string;
}

interface Attribute {
  // Define the structure of Attribute based on your needs
  trait_type: string;
  values: string[];
}

const NftsByCollection = ({ params }: { params: { symbol: string } }) => {
  const [filter, setFilter] = useState(false);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [gridType, setGridType] = useState<Number>(0);
  const [searchParam, setSearchParam] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [orderDir, setOrderDir] = useState('desc');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(16);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [attributes, setAttribute] = useState<Attribute[]>([]);
  const [filterAttributes, setFilterAttributes] = useState<Attribute[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [imgWidth, setImgWidth] = useState(400);
  const [isFetching, setIsFetching] = useState(true);

  const totalCountRef = useRef(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchAttributes = async () => {
    try {
      const attributes = await NftApi.getNFTAttributes(params.symbol);
      setAttribute(attributes);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNfts = async () => {
    try {
      setIsFetching(true);
      const price = { min: minPrice, max: maxPrice };
      const data = await NftApi.getNftsByCollection(
        params.symbol,
        searchParam,
        orderBy,
        orderDir,
        offset,
        limit,
        price,
        filterAttributes,
        status
      );
      const nftData = data.nfts;
      totalCountRef.current = data.totalCount;
      setTotalCount(nftData.totalCount);
      setNfts((prevNfts) => {
        // Check if it's the first fetch or the offset is reset
        if (offset === 0) {
          return nftData;
        }

        // Append or prepend based on the offset
        if (offset >= prevNfts.length) {
          return [...prevNfts, ...nftData];
        } else {
          return [...nftData, ...prevNfts];
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setOffset(0); // Reset offset to 0
    setNfts([]); // Clear previous collections
  }, [searchParam, orderBy, orderDir, minPrice, maxPrice]);

  useEffect(() => {
    fetchNfts();
    fetchAttributes();
  }, [params.symbol]);

  useEffect(() => {
    fetchNfts();
  }, [
    searchParam,
    orderBy,
    orderDir,
    offset,
    limit,
    minPrice,
    maxPrice,
    status,
    filterAttributes,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        // Near the bottom of the page
        if (!isFetching && offset + limit - 1 < totalCountRef.current) {
          // Prevent fetching if all items are loaded
          setOffset((prevOffset) => prevOffset + limit);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  useEffect(() => {
    const updateImgWidth = () => {
      if (window.innerWidth < 768) setImgWidth(448);
      else setImgWidth(window.innerWidth * 0.4);
    };

    window.addEventListener('resize', updateImgWidth);
    updateImgWidth();

    return () => window.removeEventListener('resize', updateImgWidth);
  }, []);

  const handleFilledIconClick = () => {
    setGridType(1);
    setLimit(21); // Change limit to 21
    setOffset(0); // Reset offset
  };

  const handleDashboardIconClick = () => {
    setGridType(0);
    setLimit(16); // Change limit to 21
    setOffset(0); // Reset offset
  };

  const handleStatusChange = (label: string) => {
    setStatus((prevStatus) => {
      if (prevStatus.includes(label)) {
        return prevStatus.filter((status) => status !== label);
      } else {
        return [...prevStatus, label];
      }
    });
  };

  return (
    <div className='mx-[20px] md:px-20 md:pt-10 md:ml-[41px] md:mb-[40px] md:mr-[20px]'>
      <Hero
        heading='Explore Incredible Art'
        desription='Lampapuy NFT provides marketing and smart contract services to Elevate your brand by connecting it with more buyers.'
        buttonText='Create an NFT'
        image={exploreImage.src}
        imgHeight={1000}
        imgWidth={imgWidth}
      />
      <TabBar
        pathname='collections'
        onFilledIconClick={handleFilledIconClick}
        onDashboardIconClick={handleDashboardIconClick}
      />
      <SearchBar
        setSearchParam={setSearchParam}
        setOrderBy={setOrderBy}
        setOrderDir={setOrderDir}
        placeholder='Search NFT by Title'
      />
      <div className='flex flex-col md:gap-8 md:flex-row'>
        <div className='h-0 md:h-fit invisible md:visible'>
          <Filter
            attributes={attributes}
            filterAttributes={filterAttributes}
            onStatusChange={handleStatusChange}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onAttributeChange={setFilterAttributes}
          />
        </div>
        <div className='flex flex-row p-5 justify-between md:hidden relative'>
          <button
            onClick={() => setFilter(!filter)}
            className='md:w-40 w-36 flex justify-center py-2 font-semibold text-black'
            style={{
              background:
                'linear-gradient(175deg, #FFEA7F 9.83%, #AB5706 95.76%)',
              borderRadius: '40px',
            }}
            aria-label='Add filter'
          >
            Add filter
          </button>
          <button
            className='md:w-40 w-36 flex items-center gap-1 justify-center py-2 font-semibold text-white'
            style={{
              border: '1.5px solid var(--Color-Gradient-01, #F88430)',
              borderRadius: '40px',
            }}
            aria-label='Sweep'
          >
            Sweep
            <Icon icon='fluent:broom-16-regular' />
          </button>
          {filter && (
            <div className='absolute z-30 top-24'>
              <Filter
                attributes={attributes}
                filterAttributes={filterAttributes}
                onStatusChange={handleStatusChange}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onAttributeChange={setFilterAttributes}
              />
            </div>
          )}
        </div>
        {isFetching && offset === 0 ? (
          <div className='flex w-full justify-center items-center'>
            <BigSpinner />
          </div>
        ) : (
          <div className='flex h-full gap-4 md:gap-6 flex-wrap py-3 md:py-0 md:pl-[50px] pl-[20px]'>
            {nfts.length === 0 && !isFetching ? (
              <div className='text-neutral-500 text-xl'>
                No NFT Found In This Collection
              </div>
            ) : (
              nfts.map((nft, index) => (
                <ItemCard
                  key={index}
                  name={nft.name}
                  image={nft.image}
                  price={nft.price}
                  mintAddress={nft.mintAddress?.toString()}
                  gridType={gridType}
                  status={nft.status}
                  symbol={nft.symbol}
                />
              ))
            )}
            {isFetching && offset > 0 && (
              <div
                ref={loaderRef}
                className='flex justify-center items-center w-full'
              >
                <BigSpinner />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NftsByCollection;
