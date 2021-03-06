import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import AutoComplete from "material-ui/AutoComplete";
import Chip from "material-ui/Chip";
import { GridList, GridTile } from "material-ui/GridList";
import { List, ListItem } from "material-ui/List";
import Checkbox from "material-ui/Checkbox";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentUndo from "material-ui/svg-icons/content/undo";
import RaisedButton from "material-ui/RaisedButton";

const images = [
  "/food1.jpg",
  "/food2.jpg",
  "/food3.jpg",
  "/food4.jpeg",
  "/food5.jpg",
  "/food6.jpg",
  "/food7.jpg",
  "/food8.jpg",
  "/food9.jpg",
  "/food10.jpg",
  "/food11.jpg",
  "/food12.jpg",
  "/food13.jpg",
  "/food14.jpg",
  "/food15.jpg",
  "/food16.jpg",
  "/food17.jpg",
  "/food18.jpeg",
  "/food19.jpg",
  "/food20.jpg"
]

let allImages = [];
let imageLoop = 100;
while(imageLoop){
  allImages = [...allImages,...images]
  imageLoop--; 
}


const styles = {
  chip: {
    margin: 4,
    float: "left"
  },
  gridList: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  card: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "none"
  },
  menuItem: {
    float: "left",
    display: "flex",
    width: "fit-content"
  },
  menuItemWrapper: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    boxSizing: "border-box",
    padding: "10px"
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: true,
      showSelectMoreIngredientsText: true,
      ingredientsCategories: [
        {
          name: "meats",
          ingredients: []
        },
        {
          name: "fruits",
          ingredients: []
        },
        {
          name: "vegetables",
          ingredients: []
        },
        {
          name: "dairy",
          ingredients: []
        },
        {
          name: "fish",
          ingredients: []
        },
        {
          name: "herbs",
          ingredients: []
        },
        {
          name: "spices",
          ingredients: []
        },
        {
          name: "beverages",
          ingredients: []
        },
        {
          name: "condiments",
          ingredients: []
        },
        {
          name: "other",
          ingredients: []
        }
      ],
      availableIngredients: [],
      allIngredients: [],
      recipes: [],
      recipeCols: 3,
      currentRecipe: {
        name: "",
        image: "",
        ingredientsAndQuantities: [],
        howToMake: [],
        ingredients: []
      },
      searchText: ""
    };
  }

  combineData = (ingredients, recipes) => {
    let allIngredientsCombined = [];
    for (let i = 0; i < ingredients.length; i++) {
      allIngredientsCombined = [
        ...allIngredientsCombined,
        ...ingredients[i].ingredients
      ];
    }
    this.setState({
      ingredientsCategories: ingredients,
      recipes: recipes,
      allIngredients: allIngredientsCombined
    });
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch("http://localhost:3001")
      .then(res => res.json())
      .then(({ ingredients, recipes }) =>
        this.combineData(ingredients, recipes)
      )
      .catch(err => console.log(err));
  };

  handleUpdateInput = ingredient => {
    if (this.isIngredientAvailable(ingredient)) {
      const newAllIngredients = [...this.state.allIngredients];
      newAllIngredients.splice(
        this.state.allIngredients.indexOf(ingredient),
        1
      );
      this.setState({
        availableIngredients: [...this.state.availableIngredients, ingredient],
        allIngredients: newAllIngredients,
        searchText: ""
      });
    }
  };

  handleToggle = () =>
    this.setState({
      openDrawer: !this.state.openDrawer,
      recipeCols: this.state.recipeCols === 3 ? 4 : 3
    });

  handleDeleteIngredient = ingredientIndex => {
    const ingredientToDelete = this.state.availableIngredients[ingredientIndex];
    const newAvailableIngredients = [...this.state.availableIngredients];
    newAvailableIngredients.splice(ingredientIndex, 1);

    this.setState({
      allIngredients: [...this.state.allIngredients, ingredientToDelete],
      availableIngredients: newAvailableIngredients
    });
  };

  handleCheck = ingredient => {
    if (this.state.availableIngredients.indexOf(ingredient) > -1) {
      this.handleDeleteIngredient(
        this.state.availableIngredients.indexOf(ingredient)
      );
    } else {
      this.handleUpdateInput(ingredient);
    }
  };

  handleRecipeClick = recipeName => {
    for (let i = 0; i < this.state.recipes.length; i++) {
      if (this.state.recipes[i].name === recipeName) {
        this.setState({
          currentRecipe: this.state.recipes[i]
        });
      }
    }
  };

  isIngredientAvailable = ingredient => {
    for (let i = 0; i < this.state.allIngredients.length; i++) {
      if (this.state.allIngredients[i] === ingredient) return true;
    }
    return false;
  };

  recipeHasAllIngredients = recipe => {
    for (let i = 0; i < recipe.ingredients.length; i++) {
      if (this.state.availableIngredients.indexOf(recipe.ingredients[i]) === -1)
        return false;
    }
    return true;
  };

  handleUndo = () => {
    this.setState({
      currentRecipe: {
        name: "",
        image: "",
        ingredientsAndQuantities: [],
        howToMake: [],
        ingredients: []
      }
    });
  };

  handleAutocompleteInput = text => {
    this.setState({ searchText: text });
  };

  handleRemoveAllIngredients = () => {
    this.setState({
      availableIngredients: []
    });
  };

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  renderRecipeList(recipesAvailable) {
    const children = recipesAvailable.map((recipe, index) => {
      return (
        <GridTile
          key={index}
          title={recipe.name}
          onClick={e => this.handleRecipeClick(recipe.name)}
        >
          <img
            src={
              recipe.name === "Beef with chocolate sauce"
                ? "/chocobeef.jpg"
                : allImages[index]
            }
            alt={recipe.name}
          />
        </GridTile>
      );
    });
    return (
      <GridList
        style={styles.gridList}
        cellHeight={180}
        cols={this.state.recipeCols}
        padding={15}
      >
        {children}
      </GridList>
    );
  }

  renderNoIngredientsSelected() {
    return (
      <div
        style={{
          width: "70%",
          height: "100px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "190px",
          textAlign: "center"
        }}
      >
        <h1>Tabboukh</h1>
        <h2 style={{fontSize:"23px"}}>The website that shows you what you can cook with what you find home!</h2>
        <h3>Select more Ingredients to get recipes!</h3>
      </div>
    );
  }

  renderBackButton() {
    return (
      <FloatingActionButton
        onClick={e => this.handleUndo()}
        style={{
          marginLeft: "20px",
          marginTop: "4px",
          position: "absolute"
        }}
      >
        <ContentUndo />
      </FloatingActionButton>
    );
  }

  render() {
    const paddingLeft = this.state.openDrawer ? 256 : 0;
    const recipesAvailable = this.state.recipes.filter(
      this.recipeHasAllIngredients
    );
    const hasRecipesAvailable = !!recipesAvailable.length;
    const recipeIsSelected = !!this.state.currentRecipe.howToMake.length;
    return (
      <MuiThemeProvider>
        <div className="App">
          <div
            style={{
              paddingLeft,
              transition: "padding 450ms cubic-bezier(0.23, 1, 0.32, 1)"
            }}
          >
            <AppBar
              title="Tabboukh"
              iconClassNameRight="muidocs-icon-navigation-expand-more"
              onClick={this.handleToggle}
            />
            {recipeIsSelected ? this.renderBackButton() : null}
            {recipeIsSelected
              ? null
              : hasRecipesAvailable
                ? this.renderRecipeList(recipesAvailable)
                : this.renderNoIngredientsSelected()}
            {this.state.currentRecipe.howToMake.length > 0 ? (
              <Card style={styles.card}>
                <div>
                  <CardMedia
                    style={{ width: "65%", float: "left" }}
                    overlay={
                      <CardTitle title={this.state.currentRecipe.name} />
                    }
                  >
                    <img
                      src={
                        this.state.currentRecipe.name ===
                        "Beef with chocolate sauce"
                          ? "/chocobeef.jpg"
                          : allImages[
                              recipesAvailable.indexOf(this.state.currentRecipe)
                            ]
                      }
                      alt={this.state.currentRecipe.name}
                    />
                  </CardMedia>
                  <CardTitle
                    style={{
                      width: "35%",
                      float: "right",
                      textAlign: "center"
                    }}
                    title="Ingredients:"
                  />
                  <List
                    style={{ width: "35%", float: "left", textAlign: "center" }}
                  >
                    {this.state.currentRecipe.ingredientsAndQuantities.map(
                      (ingredient, index) => (
                        <ListItem
                          disabled={true}
                          style={{ padding: "5px", lineHeight: "70%" }}
                          key={index}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline"
                            }}
                          >
                            {ingredient.quantity}
                          </span>
                          {" " + ingredient.name}
                        </ListItem>
                      )
                    )}
                  </List>
                </div>

                <div style={{ float: "left", marginLeft: "25%" }}>
                  <CardTitle
                    title="How To Make"
                    style={{ textAlign: "center" }}
                    titleStyle={{ fontSize: "30px" }}
                  />

                  <List>
                    {this.state.currentRecipe.howToMake.map((step, index) => (
                      <ListItem disabled={true}>
                        <span style={{ fontWeight: "bold" }}>{index + 1}</span>
                        {" - " + step}
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Card>
            ) : null}
          </div>

          <Drawer open={this.state.openDrawer}>
            <div>
              <List>
                <AutoComplete
                  floatingLabelText="Pick Your Ingredients"
                  dataSource={this.state.allIngredients}
                  filter={AutoComplete.caseInsensitiveFilter}
                  maxSearchResults={8}
                  onNewRequest={(ingredient, index) =>
                    this.handleUpdateInput(ingredient)}
                  fullWidth={true}
                  searchText={this.state.searchText}
                  onUpdateInput={text => this.handleAutocompleteInput(text)}
                  //style={{width:'200px'}}
                />
                {this.state.availableIngredients.length > 0 ? (
                  <RaisedButton
                    fullWidth={true}
                    label="Remove All Ingredients"
                    backgroundColor={"#bcb3b3"}
                    style={{ paddingBottom: "-10px" }}
                    onClick={e => this.handleRemoveAllIngredients()}
                  />
                ) : null}
                <div style={styles.menuItemWrapper}>
                  {this.state.availableIngredients.map((ingredient, index) => (
                    <Chip
                      key={index}
                      style={styles.chip}
                      onRequestDelete={() => this.handleDeleteIngredient(index)}
                    >
                      {ingredient}
                    </Chip>
                  ))}
                </div>
                {this.state.ingredientsCategories.map((category, index) => {
                  const nestedIngredients = category.ingredients.map(
                    (ingredient, index) => {
                      const checkbox = (
                        <Checkbox
                          checked={
                            this.state.availableIngredients.indexOf(
                              ingredient
                            ) > -1
                              ? true
                              : false
                          }
                          style={{
                            float: "left",
                            display: "block",
                            width: "auto",
                            marginLeft: "10px"
                          }}
                          label={ingredient}
                          key={index}
                          onCheck={evt => this.handleCheck(ingredient)}
                        />
                      );
                      return checkbox;
                    }
                  );
                  return (
                    <ListItem
                      primaryText={category.name}
                      key={index}
                      nestedItems={nestedIngredients}
                      style={{ clear: "both" }}
                    />
                  );
                })}
              </List>
            </div>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
