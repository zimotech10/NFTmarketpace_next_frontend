'use client';
import React, { useState } from 'react';
import localFont from 'next/font/local';
import Image from 'next/image';
import star from '@/public/images/gradient-star.png';
import ComingSoon from '../ComingSoon';
import useScreen from '@/hooks/useScreen';
import HomeHeroImg from '@/public/images/marketplace-hero.png';
import UpComing from './UpComing';
import Link from 'next/link';

const electronica = localFont({
  src: '../../fonts/Electronica-Display-Solid.otf',
});
const forma = localFont({
  src: '../../fonts/forma-djr-banner/FormaDJRBanner-Regular-Testing.ttf',
});

const HomeHero = () => {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useScreen();

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const heroHeight = isMobile ? '300px' : '359px';

  return (
    <>
      <div
        className='flex flex-col md:flex-row relative mx-1.5 md:justify-between md:h-[508px] h-[562px] overflow-hidden'
        id='hero'
      >
        <div className='flex md:p-0 items-center flex-row'>
          <div className='flex flex-col md:pt-20 md:pl-32'>
            <div
              className={` text-[24px] w-[400px] md:text-[40px] md:w-[600px] ${electronica.className}`}
              style={{
                lineHeight: '55.6px',
                letterSpacing: '-0.01em',
                fontWeight: '400',
              }}
            >
              <div className='flex'>
                COLLECT&nbsp;
                <div className={`${forma.className}`}>&</div>
                &nbsp;TRADE <br />
              </div>
              TOKENIZED MAGIC MOMENTS.
            </div>
            <div
              className='text-sm w-[333px] md:text-base md:w-[470px] text-neutral-500 md:mt-4 mt-3'
              style={{ color: '#DDDDDD' }}
            >
              {'Mint, Explore, Collect & Trade Magic Moments On Solana.'}
            </div>
            <div className='flex flex-row gap-5'>
              <Link
                className='flex justify-center my-4 text-black items-center font-bold text-base md:ml-0 ml-12 md:mb-12 md:mt-8 w-[160px] md:w-[280px] h-[43px]'
                style={{
                  background:
                    'linear-gradient(175deg, #FFEA7F 9.83%, #AB5706 95.76%)',
                  borderRadius: '22px',
                }}
                href='/explorer'
              >
                Explore
              </Link>
              <button
                className='flex justify-center my-4 text-white items-center font-bold text-base md:mb-12 md:mt-8 w-[160px] md:w-[280px] border-white border-[1px]'
                style={{
                  borderRadius: '22px',
                }}
                onClick={() => handleButtonClick()}
              >
                Create
              </button>
            </div>
          </div>
          <div className='flex md:hidden w-20 h-fit'>
            <Image
              src={star}
              objectFit='contain'
              alt='star'
            />
          </div>
        </div>
        <div className='pr-[50px]'>
          <Image
            src={HomeHeroImg}
            alt='heroImage'
            width={500}
          ></Image>
        </div>
      </div>
      <ComingSoon
        isOpen={showModal}
        onClose={handleCloseModal}
      />{' '}
      {/* Use the ComingSoonModal component */}
    </>
  );
};

export default HomeHero;
