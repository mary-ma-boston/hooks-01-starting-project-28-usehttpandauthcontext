import React,{ useState, useCallback, useReducer, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET': 
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default: 
      throw new Error('Should not get there');
  }
};



const Ingredients = ()=> {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();

  useEffect(()=>{
    if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra });
    } else if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      dispatch({type:'ADD', ingredient: {id: data.name, ...reqExtra}});
    }

  },[data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    
    dispatch({type: 'SET', ingredients: filteredIngredient});
  }, []);

  const addIngredientsHandler = useCallback((ingredient) => {
    sendRequest(
      'https://learn-react-hook-55c4a-default-rtdb.firebaseio.com/ingredients.json', 
      'POST', 
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  },[sendRequest]);

  const removeIngredientsHandler = useCallback((id) => {
    sendRequest(`https://learn-react-hook-55c4a-default-rtdb.firebaseio.com/ingredients/${id}.json`, 
    'DELETE', 
    null, 
    id, 
    'REMOVE_INGREDIENT')  
  },[sendRequest]);



  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient = {addIngredientsHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients = {userIngredients} onRemoveItem = {removeIngredientsHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
