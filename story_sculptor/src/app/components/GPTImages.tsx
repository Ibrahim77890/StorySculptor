import Image from 'next/image';
import React from 'react';


interface Props {
  imageUrls: string[];
}

const GPTImages = ({ imageUrls }:Props) => {
    console.log(imageUrls)
  return (
    <div className='h-fit w-full flex flex-col items-center justify-center gap-4 px-4 py-2'>
      <div className="w-full text-right text-lg font-semibold">GPTImages</div>
      <div className='flex flex-wrap p-2'>{imageUrls?.map((imageUrl, index) => {

        return <div key={index} className='w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2'>
          <Image
            src={imageUrl}
            alt={`Image ${index + 1}`}
            width={imageUrl.includes('data')?1000:500}
            height={imageUrl.includes('data')?1000:500}
            className='object-cover rounded-lg p-2'
          />
        </div>
      })}</div>
    </div>
  );
};

export default GPTImages;
