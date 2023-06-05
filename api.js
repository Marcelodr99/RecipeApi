const card = document.getElementsByClassName('imgdisplay')[0];
const searchbtn = document.getElementById('mealSearch');
const recipeBtn = document.getElementById('recipeSearch');
const filter = document.getElementById('inputFilter');
const recipeFilter = document.getElementById('ingredients');
const dateId = document.getElementById('dateId');

const modalM = document.getElementById("myModal");
const modal = document.getElementById("modalInner");

const span = document.getElementsByClassName("close")[0];

const radio1 = document.getElementById('radioInput1');
const radio2 = document.getElementById('radioInput2');

const apiKey = "8a467bb55b6d41deb437264d034ba902";
//const apiKey = "cb4c49daf9ce4ec6aa853c43c1b3a6b9";


async function getFood(url) {
  const response = await fetch(url);
  const foodJSON = await response.json();

  return foodJSON;
}

searchbtn.addEventListener('click', async function(e) {
    e.preventDefault();
    let queryResults = filter.value;
    if(radio1.checked){
      const keyW = await getFood(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${queryResults}`);
      genOptions(keyW.results);
    }
    else{
      const ingredientW = await getFood(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${queryResults}`);
      genOptions(ingredientW);
    }
  
});

document.addEventListener('click', async function(e) {
  // e.preventDefault();
    const clickedElement = e.target;
    
    
    if (clickedElement.tagName === 'IMG') {
      const imageId = clickedElement.id;
        
        modalM.style.display = "block";
      
      const recInfo = await getFood(`https://api.spoonacular.com/recipes/${imageId}/ingredientWidget.json?apiKey=${apiKey}`);
      recipeInfo(recInfo.ingredients);
      
     
      document.addEventListener('click', async function(e) {
        e.preventDefault();
        if(e.target.id === 'instructions'){
          const recInfo = await getFood(`https://api.spoonacular.com/recipes/${imageId}/analyzedInstructions?apiKey=${apiKey}`);
          instructionInfo(recInfo[0].steps);
            }
        
        });
    }   
  });

  window.onclick = function(event) {
    if (event.target == modalM) {
      modalM.style.display = "none";
    }
  }



function genOptions(data) {
    const options = '<h1> Click any image to see ingredients and instructions.</h2><br>' +  data.map(item => `
   <div class = "innerCard"> <img id = '${item.id}' class = 'mealImage' src = "${item.image}"><br> <p class = "foodTitle"> ${item.title}</p> </div><br>`).join('');
        card.innerHTML = options;

}

function recipeInfo(data) {
    const info = '<h2>Ingredients</h2>' + data.map(item => `
     ${item.amount.us.value} ${item.amount.us.unit} ${item.name}<br>
    `).join('') + '<br> <button class = "order-button" id = "instructions">Instructions</button>';  
     modal.innerHTML =  info; 
}

function instructionInfo(data) {
  const steps = '<h2>Recipe Instructions</h2>' + data.map(item => `
  ${item.step}<br><br>`).join('');
  modal.innerHTML = steps;
}
