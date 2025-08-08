import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';

const NewsList = () => {
  
  const [newsData, setNewsData] = useState(null);
  

  const getData = async () => {
    const response = await fetch(
      "https://newsapi.org/v2/everything?q=real+estate&apiKey=f09ff51d010c4e5ebc29a0ef5b485f47"
    );
    const jsonData = await response.json();
    console.log(jsonData.articles);
    let dt = jsonData.articles.slice(0, 10);
    setNewsData(dt);
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
