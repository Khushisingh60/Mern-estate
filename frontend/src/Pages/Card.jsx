import React from 'react';

const Card = ({ data }) => {
  console.log(data);

  const readMore = (url) => {
    window.open(url);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
      {data.map((curItem, index) => {
        if (!curItem.urlToImage) {
          return null;
        } else {
          return (
            <div key={index} className='bg-white shadow-lg rounded-lg overflow-hidden'>
              <img
                src={curItem.urlToImage}
                alt={curItem.title}
                className='w-full h-48 object-cover'
              />
              <div className='p-4'>
                <a
                  href={curItem.url}
                  className='text-xl font-semibold text-blue-600 hover:text-blue-800'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {curItem.title}
                </a>
                <p className='text-gray-700 mt-2'>{curItem.description}</p>
                <button
                  onClick={() => window.open(curItem.url)}
                  className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Read More
                </button>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Card;
