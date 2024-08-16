import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import solanaIcon from '@/public/images/solana-logo.png';
import walletIcon from '@/public/images/wallet_logo.png';
import alertIcon from '@/public/images/gridicons_notice-outline.png';
import { ItemSummary } from '@/components/ItemSummary';
import { offer, offerToAuction } from '@/web3/contract';
import * as anchor from '@coral-xyz/anchor';
import { BN } from '@coral-xyz/anchor';
import { connection, PROGRAM_ID, PROGRAM_INTERFACE, commitmentLevel } from '@/web3/utils';
import { web3 } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Icon } from '@iconify-icon/react/dist/iconify.js';
import PopUp from '@/components/PopUp';
import Notification from '@/components/Notification';
import useScreen from '@/hooks/useScreen';

import { NATIVE_MINT } from '@solana/spl-token';

interface BuyModalProps {
  name: string;
  image: string;
  mintAddress?: string | null;
  listStatus?: number;
  listingPrice?: string | null;
  onClose: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ name, image, mintAddress, listStatus, listingPrice, onClose }) => {
  const [offerPrice, setOfferPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string | undefined>(undefined);
  const wallet = useAnchorWallet();

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const [modalVariant, setModalVariant] = useState<'error' | 'success'>('success');
  const modalRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<{ variant: 'default' | 'success' | 'warning' | 'danger'; heading: string; content: string } | null>(null);
  const isMobile = useScreen();

  useEffect(() => {
    // Disable background scrolling when modal is open
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      // Ensure scrolling is enabled when modal is unmounted
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.addEventListener('wheel', (event) => {
        if (modalRef.current) {
          event.preventDefault();
          modalRef.current.scrollBy({
            top: event.deltaY,
            behavior: 'smooth',
          });
        }
      });
    }
  }, [modalRef]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOfferPrice(Number(event.target.value));
  };

  const handlePriceChangeByPercent = (percent: string) => {
    if (percent == 'max') {
      setOfferPrice(Number(listingPrice));
    } else if (percent == '-5%') {
      setOfferPrice(Number(listingPrice) * 0.95);
    } else if (percent == '-10%') {
      setOfferPrice(Number(listingPrice) * 0.9);
    }
  };

  const handleOffer = async () => {
    if (!wallet || !wallet.publicKey) {
      setNotification({
        variant: 'warning',
        heading: 'Connect Your Wallet',
        content: 'Please connect your wallet to proceed with the action.',
      });
      return;
    }

    if (!offerPrice) {
      setNotification({
        variant: 'warning',
        heading: 'Price Required',
        content: 'Please enter a price to continue.',
      });

      return;
    }

    setLoading(true);

    try {
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
      });

      const program = new anchor.Program(PROGRAM_INTERFACE, provider);

      const price = new BN(offerPrice * web3.LAMPORTS_PER_SOL);
      const expiry = null;

      const authority = new web3.PublicKey(process.env.NEXT_PUBLIC_AUTHORITY as string);
      const treasuryMint = NATIVE_MINT;
      const nftMint = new web3.PublicKey(mintAddress as string);

      const tx = await offer(program, wallet, authority, treasuryMint, nftMint, price, expiry);

      if (tx) {
        setModalVariant('success');
        setNotification({
          variant: 'success',
          heading: 'Offer Successful!',
          content: 'Your offer has been successfully submitted.',
        });
      } else {
        setModalVariant('error');
        setNotification({
          variant: 'danger',
          heading: 'Offer Failed!',
          content: 'There was an issue with your offer. Please try again later or contact support if the problem persists.',
        });
      }
    } catch (error) {
      console.error('Offer error:', error);
      setModalVariant('error');
      setNotification({
        variant: 'danger',
        heading: 'Error During Offer',
        content: 'An error occurred while processing your offer. Please try again later or contact support if the issue persists.',
      });
    }

    setLoading(false);
    setIsModalOpen(true);
    onClose();
  };

  const handleOfferToAuction = async () => {
    if (!wallet || !wallet.publicKey) {
      setNotification({
        variant: 'warning',
        heading: 'Connect Your Wallet',
        content: 'Please connect your wallet to proceed with this action.',
      });
      return;
    }

    if (!offerPrice) {
      setNotification({
        variant: 'warning',
        heading: 'Price Required',
        content: 'Please enter a price to proceed.',
      });
      return;
    }

    setLoading(true);

    try {
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
      });

      const program = new anchor.Program(PROGRAM_INTERFACE, provider);

      const price = new BN(offerPrice * web3.LAMPORTS_PER_SOL);

      const authority = new web3.PublicKey(process.env.NEXT_PUBLIC_AUTHORITY as string);
      const treasuryMint = NATIVE_MINT;
      const nftMint = new web3.PublicKey(mintAddress as string);

      const tx = await offerToAuction(program, wallet, authority, treasuryMint, nftMint, price);

      if (tx) {
        setModalVariant('success');
        setNotification({
          variant: 'success',
          heading: 'Offer Successful!',
          content: 'Your offer has been successfully submitted.',
        });
      } else {
        setModalVariant('error');
        setNotification({
          variant: 'danger',
          heading: 'Offer Failed!',
          content: 'Your offer could not be processed.',
        });
      }
    } catch (error) {
      setModalVariant('error');
      setNotification({
        variant: 'danger',
        heading: 'Offer Error',
        content: 'An error occurred while processing your offer.',
      });
    }

    setLoading(false);
    setIsModalOpen(true);
    onClose();
  };

  const topHeight = isMobile ? '30px' : '70px';
  return (
    <>
      <PopUp isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} message={modalMessage} variant={modalVariant} />
      <div className='fixed inset-0 flex justify-center items-center z-50 md:p-16 p-8'>
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm' onClick={onClose}></div>
        <motion.div
          className='relative bg-[#0B0A0A] p-4 md:p-16 rounded-lg shadow-lg max-w-[800px] w-full flex flex-col gap-6'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{ top: topHeight, maxHeight: '90vh', overflowY: 'hidden' }}
          ref={modalRef}
        >
          <button className='absolute top-4 right-4 text-white' onClick={onClose}>
            X
          </button>
          <h2 className='text-3xl font-bold text-white'>Buy NFT</h2>
          <p className='text-sm text-[#afafaf]'>You are Buying {name} #3578</p>

          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex flex-col gap-4 w-full'>
              <div className='flex items-center'>
                <img src={image} alt={name} className='w-20 h-20 md:w-24 md:h-24 rounded-md' />
                <div className='ml-4'>
                  <h3 className='text-lg font-bold text-white'>{name}</h3>
                  <p className='text-sm text-[#afafaf]'>#{3578}</p>
                  <p className='text-sm text-[#afafaf]'>Artist: Coco</p>
                </div>
              </div>
              <div className='flex justify-between pt-4'>
                <span className='text-[#afafaf] italic'>Quantity:</span>
                <span className='text-white font-bold'>x1</span>
              </div>

              <div className='flex flex-col gap-2 pt-2'>
                <div className='flex justify-between'>
                  <span className='text-[#afafaf]'>Price:</span>
                  <div className='flex justify-center items-center gap-1'>
                    <Image src={solanaIcon} alt='solanaIcon' style={{ width: '16px' }}></Image>
                    <div className='flex justify-center items-center'>
                      <span className='text-white'>{Number(offerPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <span className='text-[#afafaf]'>Royalty Fee:</span>
                  <div className='flex justify-center items-center gap-1'>
                    <Image src={solanaIcon} alt='solanaIcon' style={{ width: '16px' }}></Image>
                    <div className='flex justify-center items-center'>
                      <span className='text-white'>{Number(offerPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <span className='text-[#afafaf]'>Marketplace Fee;</span>
                  <div className='flex justify-center items-center gap-1'>
                    <Image src={solanaIcon} alt='solanaIcon' style={{ width: '16px' }}></Image>
                    <div className='flex justify-center items-center'>
                      <span className='text-white'>{Number(offerPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: '60%',
                  height: '0.8px',
                  left: '20%',
                  backgroundColor: '#F5F5F5',
                  opacity: 0.1,
                  position: 'absolute',
                  top: '450px', // Distance from the top of the container
                }}
              ></div>

              <button
                className='w-full px-4 py-3 md:px-10 mt-8 flex flex-row gap-2 items-center justify-center rounded-3xl'
                style={{
                  border: '2px solid #5E5E5E',
                  color: '#F5F5F5',
                }}
                onClick={listStatus == 1 ? handleOffer : handleOfferToAuction}
              >
                Buy Now for 1.56 SOL
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      {notification && (
        <div className='fixed top-4 right-4 z-50'>
          <Notification
            variant={notification.variant}
            heading={notification.heading}
            content={notification.content}
            onClose={() => setNotification(null)} // Remove notification after it disappears
          />
        </div>
      )}
    </>
  );
};