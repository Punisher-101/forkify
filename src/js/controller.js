import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Importing from other Js Files
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // Cathcing the URL hash
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update the selected recipe
    resultsView.update(model.getSearchResultPage());

    // Updating the bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Rendering the spinner
    recipeView.renderSpinner();

    // Loading the recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // Redering the Image
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(`${error}💣💣💣`);
  }
};

const controlSearchResults = async function () {
  try {
    // Displaying the spinner over the search seaction
    resultsView.renderSpinner();

    // Getting the query from Form Submission
    const query = searchView.getQuery();
    console.log(query);
    // Guard Clause
    if (!query) return;
    // loading the results by AJAX call from Model.js
    await model.loadSearchResults(query);
    model.state.search.page = 1;
    // Displaying the searches over the Search Section
    resultsView.render(model.getSearchResultPage());
    console.log(model.state.search.results);

    // Render Initial Pagination Buttons
    paginationView.render(model.state.search);

    // Throwing the Error
    if (!model.state.search.results.length) throw new Error('No recipe Found!');
  } catch (error) {
    // Handling the Error
    console.log(error);
  }
};

const controlPagination = function (gotoPage) {
  // Displaying the searches over the Search Section
  //  Render New Results
  resultsView.render(model.getSearchResultPage(gotoPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show the spinner
    addRecipeView.renderSpinner();

    // Upload the new Recipe Data
    await model.uploadRecipe(newRecipe);
    // redner recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark
    bookmarksView.render(model.state.bookmarks);

    // Change Id into URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2 * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
