// npm install ascii-art
const art = require("ascii-art");

// Function for creating ASCII Art. Render in terminal for 1550 milliseconds
const asciiArt = () => {
  art.font("Employee Tracker", "doom").then((rendered) => {
    console.log(rendered);
    setTimeout(() => {
      console.clear();
    }, 1500);
  });
};

module.exports = asciiArt