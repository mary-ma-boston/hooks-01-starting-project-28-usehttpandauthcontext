import React, {useState, useEffect, useRef}from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';


const Search = React.memo(props => {
  const {onLoadIngredients} = props;

  const [enteredFilter, setEnteredFilter] = useState('');
  // const inputSearchRef = useRef();
  const {isLoading, data, error, sendRequest} = useHttp();

  useEffect(()=>{
    // const timer = setTimeout(()=>{
    //   if(enteredFilter === inputSearchRef.current.value) {
    //     const query = enteredFilter.length === 0 ? '': `?orderBy="title"&equalTo="${enteredFilter}"`;
    //     sendRequest("https://learn-react-hook-55c4a-default-rtdb.firebaseio.com/ingredients.json"+query, 'GET');
    //   } 
    // },500);
    const timer = setTimeout(()=>{
      
        const query = enteredFilter.length === 0 ? '': `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest("https://learn-react-hook-55c4a-default-rtdb.firebaseio.com/ingredients.json"+query, 'GET');
      
    },500);
    return () => {
      clearTimeout(timer);
    }
  },[enteredFilter, sendRequest]);

  useEffect(()=>{
    if(!isLoading && !error && data) {
      const loadedIngredients = [];
        for(const key in data) {
          loadedIngredients.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount
          });
        }
        onLoadIngredients(loadedIngredients);
    }
  },[data, isLoading, error, onLoadIngredients])

  return (
    <section className="search">
      {/* {error & <ErrorModal onClose={clear}>{error}</ErrorModal>} */}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input 
            type="text" 
            value={enteredFilter} 
            onChange={(event)=>setEnteredFilter(event.target.value)}
            // ref = {inputSearchRef}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
