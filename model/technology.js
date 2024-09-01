const mongoose = require("mongoose");

const TechnologySchema = new mongoose.Schema({
  LanguagesLogo: {
    type: String,
    required: true,
  },
  LanguagesName: {
    type: String,
    required: true,
  },
  Experience: {
    type: String,
    required: true,
  },
  workTime: {
    type: String,
    required: true,
  }
});

const Technology = mongoose.model("Technology", TechnologySchema);

module.exports = Technology;