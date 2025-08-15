import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';
import axios from 'axios';
import { linkWithCredential } from 'firebase/auth';

const NewsList = () => {
  
  const [newsData, setNewsData] = useState(null);
  

  const getData = async () => {
  console.log("news hits");
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/user/news`,
    { withCredentials: true }
  );
  const jsonData = response.data;
  console.log(jsonData.articles);
  setNewsData(jsonData.articles.slice(0, 10));
};


  useEffect(() => {
    getData();
  }, []);

  
  return (
    <div>
     
      <div className='text-center mt-8'>
        <p className='text-2xl font-semibold'>Stay Updated with TrendyNews</p>
      </div>

      <div className='mt-8'>
        {newsData ? <Card data={newsData} /> : null}
      </div> 
    </div>
  );
};

export default NewsList;
