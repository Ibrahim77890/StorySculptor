import Image from 'next/image';
import React from 'react';
import { motion } from "framer-motion";
import "./styles.css"


interface Props {
  imageUrls: {script: string, imageUrl: string}[];
}

const GPTImages = ({ imageUrls }: Props) => {
  return (
    <div className='h-fit w-full flex flex-col items-center justify-center gap-4 px-4 py-2 mb-10'>
      <div className='flex flex-wrap gap-2 items-center'>{imageUrls?.map((imageUrl, index) => {

        return <motion.a whileHover={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }} download={`image${index + 1}.png`} href={imageUrl.imageUrl} key={index}><div key={index} className='sm:md:lg:w-full h-1/2 flex flex-row'>
            <p className='text-right p-4 ubuntu-sans-normal'>{imageUrl.script}</p>
            <Image
              src={imageUrl.imageUrl}
              alt={`Image ${index + 1}`}
              width={200}
              height={200}
              className='object-cover border-white border-2 rounded-3xl'
            />
          </div></motion.a>
      })}</div>
    </div>
  );
};

export default GPTImages;
