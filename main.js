document.addEventListener('DOMContentLoaded', () => {
    const mealContainer = document.getElementById('meal-container');
    mealContainer.innerHTML = '<p>Loading meals...</p>';
    // Fetch 25 meals 
    async function fetchMeals() {
        const meals = [];
        const mealPromises = [];
        // Fetch 25 random
        for (let i = 0; i < 25; i++) {
            const mealPromise = fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(response => response.json())
                .then(data => data.meals[0])
                .catch(error => console.error('Error fetching meal:', error));
            mealPromises.push(mealPromise);
        }
        // Wait for the fetching action to finish
        const mealData = await Promise.all(mealPromises);
        renderMeals(mealData);
    }
    // Render meals 
    function renderMeals(meals) {
        mealContainer.innerHTML = meals
            .map(meal => createMealCard(meal))
            .join('');
    }
    // Extract procedure and ingredients from the api 
    function getIngredients(meal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`.trim());
            }
        }
        return ingredients;
    }
    // Creates the meal card HTML
    function createMealCard(meal) {
        const { strMeal, strMealThumb, strInstructions, strCategory, strArea, strYoutube } = meal;
        const ingredients = getIngredients(meal)
            .map(ingredient => `<li>${ingredient}</li>`)
            .join('');
        return `
            <div class="meal-card">
                <img src="${strMealThumb}" alt="${strMeal}">
                <h3 class="meal-title">${strMeal}</h3>
                <p class="meal-meta">${strCategory} | ${strArea}</p>
                <h4>Ingredients:</h4>
                <ul class="meal-ingredients">${ingredients}</ul>
                <p class="meal-instructions">${strInstructions}</p>
                ${strYoutube ? `<a href="${strYoutube}" target="_blank" class="video-button">Watch Video</a>` : ''}
            </div>
        `;
    }
    fetchMeals();
});
