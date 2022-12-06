import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../context/useContext';

import '../css/CardRec.css';

import DrinksCardRec from '../components/DrinksCardRec';
import MealssCardRec from '../components/MealsCardRec';

export default function Recipe() {
  const history = useHistory();
  const { pathname } = history.location;
  const { fetchRecipeId } = useContext(Context);
  const [recipe, setRecipe] = useState();
  const [dataRecomendation, setDataRecomendation] = useState([]);
  const { location } = useHistory();

  useEffect(() => {
    const fetchRecipeById = async () => {
      const data = await fetchRecipeId(pathname);
      setRecipe(data);
    };
    fetchRecipeById();
  }, [setRecipe, fetchRecipeId, pathname]);

  useEffect(() => {
    const recomendations = async () => {
      if (location.pathname.includes('meal')) {
        const request = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        const json = await request.json();
        setDataRecomendation(json);
      }
      if (location.pathname.includes('drink')) {
        const request = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const json = await request.json();
        setDataRecomendation(json);
      }
    };
    recomendations();
  }, [location]);

  return (
    recipe && (
      <main>
        <img
          data-testid="recipe-photo"
          src={ recipe.strMealThumb || recipe.strDrinkThumb }
          alt=""
          width="100%"
        />
        <h1 data-testid="recipe-title">{ recipe.strMeal || recipe.strDrink }</h1>
        <h3 data-testid="recipe-category">{ recipe.strCategory }</h3>
        { recipe.strAlcoholic && (
          <p data-testid="recipe-category">{ recipe.strAlcoholic }</p>
        )}
        <h2>Ingredients</h2>
        {
          Object.entries(recipe)
            .filter((element) => (element[0].includes('Ingredient')))
            .filter((element) => (element[1] !== ''))
            .map((ingredient, index) => (
              <p
                data-testid={ `${index}-ingredient-name-and-measure` }
                key={ index }
              >
                {ingredient[1]}
              </p>
            ))
        }
        <h2>Measures</h2>
        {
          Object.entries(recipe)
            .filter((element) => (element[0].includes('Measure')))
            .filter((element) => (element[1] !== ''))
            .map((measure, index) => (
              <p
                data-testid={ `${index}-ingredient-name-and-measure` }
                key={ index }
              >
                {measure[1]}
              </p>
            ))
        }
        <h2>Instructions</h2>
        <p data-testid="instructions">{ recipe.strInstructions }</p>
        {
          recipe.strYoutube
            ? recipe.strYoutube !== null && (
              <iframe
                title="video"
                data-testid="video"
                width="100%"
                src={ `https://www.youtube.com/embed/${recipe.strYoutube.split('=')[1]}` }
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
            : recipe.strVideo !== null && (
              <iframe
                title="video"
                data-testid="video"
                width="100%"
                src={ `https://www.youtube.com/embed/${recipe.strVideo.split('=')[1]}` }
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
        }
        <div>
          { location.pathname.includes('meal')
            ? (<DrinksCardRec data={ dataRecomendation.drinks } />)
            : (<MealssCardRec data={ dataRecomendation.meals } />)}
        </div>

      </main>
    )
  );
}
