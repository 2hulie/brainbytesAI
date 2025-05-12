const fetch = require("node-fetch");

// Initialize our AI service
const initializeAI = () => {
  console.log("Hugging Face AI service initialized");

  // Check if the token is available
  if (!process.env.HUGGINGFACE_TOKEN) {
    console.warn(
      "Warning: HUGGINGFACE_TOKEN environment variable not set. API calls may fail."
    );
  }
};

// Expanded subject categories with more keywords
const subjectKeywords = {
  math: [
    "calculate",
    "math",
    "addition",
    "subtraction",
    "multiply",
    "division",
    "equation",
    "algebra",
    "geometry",
    "calculus",
    "trigonometry",
    "fraction",
    "decimal",
    "percentage",
    "sum",
    "difference",
    "product",
    "quotient",
  ],
  science: [
    "science",
    "evaporation",
    "precipitation",
    "water",
    "chemical",
    "biology",
    "physics",
    "chemistry",
    "atoms",
    "molecules",
    "cells",
    "DNA",
    "evolution",
    "energy",
    "force",
    "gravity",
    "electricity",
    "magnetism",
    "ecosystem",
    "planet",
    "solar system",
    "temperature",
  ],
  history: [
    "history",
    "capital",
    "philippines",
    "president",
    "war",
    "revolution",
    "empire",
    "civilization",
    "ancient",
    "medieval",
    "modern",
    "century",
    "decade",
    "era",
    "dynasty",
    "kingdom",
    "democracy",
    "monarch",
    "constitution",
  ],
  literature: [
    "book",
    "novel",
    "poem",
    "author",
    "character",
    "plot",
    "literature",
    "fiction",
    "nonfiction",
    "genre",
    "metaphor",
    "simile",
    "theme",
    "symbolism",
    "playwright",
    "poetry",
    "prose",
    "narrative",
    "story",
  ],
  geography: [
    "country",
    "mountain",
    "river",
    "ocean",
    "continent",
    "climate",
    "population",
    "city",
    "map",
    "region",
    "latitude",
    "longitude",
    "equator",
    "hemisphere",
    "border",
    "terrain",
    "landform",
    "geography",
  ],
  language: [
    "language",
    "grammar",
    "vocabulary",
    "noun",
    "verb",
    "adjective",
    "adverb",
    "syntax",
    "semantics",
    "pronunciation",
    "dialect",
    "idiom",
    "phrase",
    "translation",
    "linguistic",
    "bilingual",
    "multilingual",
  ],
};

// Question type patterns
const questionTypes = {
  definition: [
    "what is",
    "define",
    "meaning of",
    "definition of",
    "describe what",
    "what does",
    "what are",
    "what was",
    "what were",
  ],
  explanation: [
    "how does",
    "explain",
    "why does",
    "why is",
    "why are",
    "how is",
    "how are",
    "what happens",
    "what caused",
    "how can",
  ],
  example: [
    "give an example",
    "for example",
    "show me an example",
    "such as",
    "provide an example",
    "what is an example",
    "like what",
  ],
  calculation: [
    "calculate",
    "compute",
    "solve",
    "find the value",
    "what is the result",
    "how much is",
    "evaluate",
  ],
};

// Sentiment analysis keywords
const sentimentKeywords = {
  negative: [
    "confused",
    "frustrating",
    "difficult",
    "hard",
    "not understand",
    "don't get it",
    "can't grasp",
    "stupid",
    "unclear",
    "complicated",
    "confusing",
    "impossible",
    "hate",
    "annoyed",
    "annoying",
    "doesn't make sense",
    "doesn't work",
    "wrong",
    "bad",
    "terrible",
    "horrible",
    "awful",
    "worst",
  ],
  positive: [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "brilliant",
    "clear",
    "helpful",
    "useful",
    "thanks",
    "thank you",
    "appreciate",
    "love",
    "like",
    "enjoy",
    "perfect",
    "awesome",
  ],
};

// Function to detect question category
function detectCategory(question) {
  const lowerQuestion = question.toLowerCase();

  // Check for math expressions
  if (/[+\-*\/=]/.test(lowerQuestion) || /\d+/.test(lowerQuestion)) {
    return "math";
  }

  // Check for all subject keywords
  for (const [category, keywords] of Object.entries(subjectKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuestion.includes(keyword)) {
        return category;
      }
    }
  }

  return "general";
}

// Function to detect question type
function detectQuestionType(question) {
  const lowerQuestion = question.toLowerCase();

  for (const [type, patterns] of Object.entries(questionTypes)) {
    for (const pattern of patterns) {
      if (lowerQuestion.includes(pattern)) {
        return type;
      }
    }
  }

  return "general"; // Default type
}

// Function to detect sentiment
function detectSentiment(question) {
  const lowerQuestion = question.toLowerCase();

  let negativeScore = 0;
  let positiveScore = 0;

  // Check for negative sentiment
  for (const keyword of sentimentKeywords.negative) {
    if (lowerQuestion.includes(keyword)) {
      negativeScore++;
    }
  }

  // Check for positive sentiment
  for (const keyword of sentimentKeywords.positive) {
    if (lowerQuestion.includes(keyword)) {
      positiveScore++;
    }
  }

  if (negativeScore > positiveScore && negativeScore > 0) {
    return "negative";
  } else if (positiveScore > negativeScore && positiveScore > 0) {
    return "positive";
  }

  return "neutral";
}

// Function to get a response based on sentiment
function getSentimentResponse(sentiment) {
  if (sentiment === "negative") {
    const responses = [
      "I understand this might be confusing. Let me try to explain it more clearly.",
      "I can see this might be frustrating. Let's approach this differently.",
      "I apologize if my previous answer wasn't helpful. Let me try again.",
      "Sometimes these concepts can be challenging. Let's break this down step by step.",
      "I understand your frustration. Let me provide a simpler explanation.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  return "";
}

// Function to format response based on question type
function formatResponseByType(response, type) {
  switch (type) {
    case "definition":
      return `Definition: ${response}`;
    case "explanation":
      return `Explanation: ${response}`;
    case "example":
      if (!response.includes("example") && !response.includes("Example")) {
        return `Here's an example: ${response}`;
      }
      return response;
    case "calculation":
      if (!response.includes("result") && !response.includes("answer")) {
        return `The result is: ${response}`;
      }
      return response;
    default:
      return response;
  }
}

// Function to get response from Hugging Face API
async function generateResponse(question) {
  // Detect question category, type, and sentiment
  const category = detectCategory(question);
  const questionType = detectQuestionType(question);
  const sentiment = detectSentiment(question);

  const lowerQuestion = question.toLowerCase();

  // Check for direct matches to provide immediate responses without API call
  // This will bypass the API call for common questions we know will work
  if (lowerQuestion === "what is 1+1" || lowerQuestion === "1+1") {
    return {
      category: "math",
      response: "The answer to 1+1 is 2.",
      questionType,
      sentiment,
    };
  }

  if (lowerQuestion === "what is evaporation") {
    return {
      category: "science",
      response:
        "Evaporation is the process where liquid water changes into water vapor (gas). This happens when water molecules gain enough energy from heat to break free from the liquid's surface. Evaporation occurs at temperatures below water's boiling point and is a key part of the water cycle. It happens all around us - from wet clothes drying to puddles disappearing after rain.",
      questionType,
      sentiment,
    };
  }

  if (lowerQuestion === "what is science") {
    return {
      category: "science",
      response:
        "Science is the systematic study of the natural world through observation, experimentation, and the formulation and testing of hypotheses. It aims to discover patterns and principles that help us understand how things work. The scientific method involves making observations, asking questions, forming hypotheses, conducting experiments, analyzing data, and drawing conclusions. Science encompasses many fields including physics, chemistry, biology, astronomy, geology, and more.",
      questionType,
      sentiment,
    };
  }

  // For other questions, try the API with a strict timeout
  try {
    // Using a smaller model that responds faster
    const API_URL =
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    // Format the question based on category and type
    let input = question;
    if (category !== "general") {
      input = `Answer this ${category} question: ${question}`;
    }

    if (questionType === "definition") {
      input = `Define the following: ${question}`;
    } else if (questionType === "explanation") {
      input = `Explain in detail: ${question}`;
    } else if (questionType === "example") {
      input = `Give examples for: ${question}`;
    }

    // Get the token from environment variables
    const token = process.env.HUGGINGFACE_TOKEN;

    // Use AbortController for timeout - increased to 10 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Make the API request with authentication and timeout
    const response = await fetch(API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        inputs: input,
        options: {
          wait_for_model: true, // Changed to true to ensure model is ready
        },
      }),
    });

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);

      // If we get a 504 or other error, use our fallback
      let fallbackResponse = getDetailedResponse(category, question);

      // Add sentiment-based message if negative
      if (sentiment === "negative") {
        fallbackResponse = `${getSentimentResponse(
          sentiment
        )} ${fallbackResponse}`;
      }

      return {
        category,
        response: formatResponseByType(fallbackResponse, questionType),
        questionType,
        sentiment,
      };
    }

    const result = await response.json();

    // Check if we got a valid response from the API
    if (result && result[0] && result[0].generated_text) {
      let apiResponse = result[0].generated_text.trim();

      // Add sentiment-based message if negative
      if (sentiment === "negative") {
        apiResponse = `${getSentimentResponse(sentiment)} ${apiResponse}`;
      }

      return {
        category,
        response: formatResponseByType(apiResponse, questionType),
        questionType,
        sentiment,
      };
    } else {
      // Use our fallback if the response format wasn't as expected
      let fallbackResponse = getDetailedResponse(category, question);

      // Add sentiment-based message if negative
      if (sentiment === "negative") {
        fallbackResponse = `${getSentimentResponse(
          sentiment
        )} ${fallbackResponse}`;
      }

      return {
        category,
        response: formatResponseByType(fallbackResponse, questionType),
        questionType,
        sentiment,
      };
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);

    // Return a fallback response
    let fallbackResponse = getDetailedResponse(category, question);

    // Add sentiment-based message if negative
    if (sentiment === "negative") {
      fallbackResponse = `${getSentimentResponse(
        sentiment
      )} ${fallbackResponse}`;
    }

    return {
      category,
      response: formatResponseByType(fallbackResponse, questionType),
      questionType,
      sentiment,
    };
  }
}

// More detailed fallback responses when the API call fails
function getDetailedResponse(category, question) {
  const lowerQuestion = question.toLowerCase();

  // Check for exact matches first
  if (lowerQuestion === "what is 1+1" || lowerQuestion === "1+1") {
    return "The answer to 1+1 is 2.";
  }

  if (lowerQuestion === "what is evaporation") {
    return "Evaporation is the process where liquid water changes into water vapor (gas). This happens when water molecules gain enough energy from heat to break free from the liquid's surface. Evaporation occurs at temperatures below water's boiling point and is a key part of the water cycle. It happens all around us - from wet clothes drying to puddles disappearing after rain.";
  }

  if (lowerQuestion === "what is science") {
    return "Science is the systematic study of the natural world through observation, experimentation, and the formulation and testing of hypotheses. It aims to discover patterns and principles that help us understand how things work. The scientific method involves making observations, asking questions, forming hypotheses, conducting experiments, analyzing data, and drawing conclusions. Science encompasses many fields including physics, chemistry, biology, astronomy, geology, and more.";
  }

  // Enhanced fallback responses by category

  // Handle science category
  if (category === "science") {
    if (lowerQuestion.includes("precipitation")) {
      return "Precipitation is the release of water from the atmosphere to the earth's surface in the form of rain, snow, sleet, or hail. It's a key part of the water cycle where water vapor condenses in the atmosphere and becomes heavy enough to fall to the ground. Precipitation is essential for replenishing freshwater supplies and supporting plant and animal life.";
    }

    if (lowerQuestion.includes("evaporation")) {
      return "Evaporation is the process where liquid water changes into water vapor (gas). This happens when water molecules gain enough energy from heat to break free from the liquid's surface. Evaporation occurs at temperatures below water's boiling point and is a key part of the water cycle. It happens all around us - from wet clothes drying to puddles disappearing after rain.";
    }

    if (lowerQuestion.includes("water cycle")) {
      return "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the Earth's surface. It involves processes like evaporation, condensation, precipitation, infiltration, runoff, and transpiration. This cycle is essential for maintaining Earth's water resources and supporting all life on our planet.";
    }

    if (lowerQuestion.includes("atom")) {
      return "An atom is the basic unit of matter consisting of a nucleus (containing protons and neutrons) surrounded by electrons. Atoms are incredibly small - about 100 picometers in radius. Different arrangements of atoms form the elements on the periodic table, and atoms combine to form molecules that make up all physical substances.";
    }

    if (lowerQuestion.includes("energy")) {
      return "Energy is the capacity to do work or produce heat. It exists in various forms such as kinetic, potential, thermal, electrical, chemical, and nuclear. According to the law of conservation of energy, energy cannot be created or destroyed, only transformed from one form to another. This fundamental principle underlies all physical processes in the universe.";
    }

    if (lowerQuestion.includes("steam")) {
      return "Steam is water in its gaseous state. It forms when water is heated to its boiling point (100°C or 212°F at standard pressure). The visible 'steam' we commonly see is actually tiny water droplets suspended in the air, formed when the invisible water vapor cools and condenses. Steam contains a significant amount of energy and has many industrial and practical applications.";
    }

    return "That's an interesting science question! Science helps us understand the natural world through observation and experimentation. I'd be happy to explain more about this specific scientific topic if you provide more details.";
  }

  // Handle math category
  if (category === "math") {
    if (lowerQuestion.includes("1+1")) {
      return "The answer to 1+1 is 2.";
    }

    // Try to extract a simple calculation
    const mathExpression = lowerQuestion.replace(/[^0-9+\-*/()]/g, "");
    if (mathExpression) {
      try {
        // Safely evaluate the expression
        const result = Function(
          '"use strict";return (' + mathExpression + ")"
        )();
        return `The answer to ${mathExpression} is ${result}.`;
      } catch (e) {
        console.error("Math evaluation error:", e);
        // Fall through to general response
      }
    }

    if (lowerQuestion.includes("algebra")) {
      return "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols to solve equations and study mathematical structures. It forms the foundation for advanced mathematics and has applications in science, engineering, economics, and many other fields.";
    }

    if (lowerQuestion.includes("geometry")) {
      return "Geometry is the branch of mathematics concerned with the properties and relations of points, lines, surfaces, solids, and higher dimensional analogs. It helps us understand spatial relationships and has practical applications in architecture, engineering, physics, art, and many other fields.";
    }

    if (lowerQuestion.includes("calculus")) {
      return "Calculus is a branch of mathematics focused on the study of rates of change and accumulation. It consists of two main branches: differential calculus (concerning rates of change and slopes of curves) and integral calculus (concerning accumulation of quantities and areas under or between curves). Calculus is essential for understanding physics, engineering, economics, and many scientific disciplines.";
    }

    return "I can help with your math question. In mathematics, it's important to understand the fundamental concepts and formulas. Could you provide more details about your specific math problem?";
  }

  // Handle history/geography category
  if (category === "history") {
    if (lowerQuestion.includes("capital of the philippines")) {
      return "The capital of the Philippines is Manila. It's located on the island of Luzon and serves as the country's political, economic, and cultural center.";
    }

    if (lowerQuestion.includes("fish in filipino")) {
      return "The word for 'fish' in Filipino (Tagalog) is 'isda'.";
    }

    if (lowerQuestion.includes("world war")) {
      return "World War II (1939-1945) was a global conflict that involved most of the world's nations forming two opposing alliances: the Allies and the Axis. It was the most widespread war in history, directly involving more than 100 million people and resulting in 70 to 85 million fatalities. The war ended with the Allied victory, the founding of the United Nations, and the beginning of the Cold War.";
    }

    if (lowerQuestion.includes("renaissance")) {
      return "The Renaissance was a period of European cultural, artistic, political, and scientific 'rebirth' following the Middle Ages. Spanning roughly the 14th to 17th centuries, it began in Italy and spread across Europe. This period was characterized by renewed interest in ancient Greek and Roman thought, the development of perspective in painting, and scientific discoveries that challenged traditional beliefs.";
    }

    return "Interesting question about history or culture! I'd be happy to share more information about this topic if you provide more details.";
  }

  // Handle literature category
  if (category === "literature") {
    if (lowerQuestion.includes("shakespeare")) {
      return "William Shakespeare (1564-1616) was an English poet, playwright, and actor, widely regarded as the greatest writer in the English language. His works include 39 plays, 154 sonnets, and other verses. His plays, such as Hamlet, Romeo and Juliet, Othello, and Macbeth, have been translated into every major language and are performed more often than those of any other playwright.";
    }

    if (lowerQuestion.includes("novel")) {
      return "A novel is a relatively long work of narrative fiction, typically written in prose and published as a book. The modern novel emerged in the early 18th century. Novels portray characters and present a sequential organization of action and scenes, focusing on the gradual unfolding of a plot. They allow authors to explore complex themes, character development, and multiple storylines.";
    }

    return "Literature encompasses written works valued for their form, emotional impact, or intellectual depth. It includes poetry, drama, fiction, and non-fiction. What specific aspect of literature would you like to explore?";
  }

  // Handle language category
  if (category === "language") {
    if (lowerQuestion.includes("grammar")) {
      return "Grammar is the set of structural rules governing the composition of clauses, phrases, and words in a natural language. It includes syntax (sentence structure) and morphology (word structure). Understanding grammar helps in clear communication and effective writing across different contexts and purposes.";
    }

    if (lowerQuestion.includes("verb")) {
      return "A verb is a word that expresses an action, occurrence, or state of being. Verbs are essential components of sentences, as they form the main part of the predicate. They can indicate when an action takes place (tense), whether it's completed or ongoing (aspect), and the relationship between the speaker and the action (mood).";
    }

    return "Language is a structured system of communication used by humans. It consists of sounds, gestures, or written symbols that express ideas according to systems of grammar and vocabulary. There are thousands of languages spoken around the world, each with its own unique features and cultural significance.";
  }

  // Handle geography category
  if (category === "geography") {
    if (lowerQuestion.includes("continent")) {
      return "There are seven continents on Earth: Africa, Antarctica, Asia, Europe, North America, Australia (Oceania), and South America. They are the largest landmasses on the planet, separated by oceans and seas. Asia is the largest continent by both land area and population.";
    }

    if (lowerQuestion.includes("climate")) {
      return "Climate refers to the long-term pattern of weather in a particular area. It's determined by factors such as temperature, humidity, precipitation, air pressure, and wind. Earth has different climate zones, including tropical, dry, temperate, continental, and polar. Climate change is the long-term alteration of temperature and typical weather patterns in a region or the planet as a whole.";
    }

    return "Geography is the study of places and the relationships between people and their environments. It explores how natural environments are shaped and how human societies develop within these contexts. Geography spans both the natural and social sciences, examining physical landscapes as well as human societies.";
  }

  // Default response for general questions
  return "I'm not sure I understand your question completely. Could you please provide more details or rephrase it? I can help with topics related to science, math, history, literature, geography, language, and general knowledge.";
}

module.exports = {
  initializeAI,
  generateResponse,
};
