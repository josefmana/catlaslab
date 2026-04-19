const times = { // in miliseconds
  maxLearningTrialDuration: 10000,
  maxTestTrialDuratin: null,
  feedbackDuration: 1500,
  interTrialInterval: 500,
};

const texts = {
  cueText: "Tento multivitamín obsahuje:",
  promptText: "Kterým z následujících nežádoucích účinků bude pacient trpět?",
  promptInstruction: "Klikněte na obrázek vašeho výběru a poté potvrďte stisknutím OK",
  feedbackText: ["Správně", "Špatně"],
  testPromptText: "Na kolik jste si jist/a svou odpovědí?",
  confidenceText: ["Vůbec", "Velmi"],
};

const images = {
  cuePicture: "../../../common/stimuli/img/tube.jpg",
};
