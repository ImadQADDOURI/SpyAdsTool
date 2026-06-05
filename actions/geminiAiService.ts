// app/actions/geminiAi.ts
"use server";

import { geminiKeyManager } from "@/actions/geminiKeyManager";
import parse from "html-react-parser";

import { AdData, Media } from "@/types/ad";

export interface AdAnalysis {
  topKeywords: Array<{ word: string; count: number }>;
  longTailKeywords: Array<{ phrase: string; count: number }>;
  genderTarget: string[];
  ageTarget: string[];
  adCategories: string[];
  targetAudience: string[];
  estimatedBudget: string;
  adObjective: string[];
  marketingStrategies: string[];
  seasonTarget: string[];
  competition: number;
  cpm: number;
  cpmEurope: number; // European CPM in euros
}

export interface AdCreative {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

interface ExtractedAdText {
  titles: string[];
  bodies: string[];
  pageName: string;
  cta: string[];
  caption: string;
}

function robustJSONParse(text: string): any {
  // First, try standard JSON parsing
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("Standard JSON parsing failed, attempting robust parsing");
  }

  // If that fails, try to extract as much as possible
  const result: any = {};
  const keyValueRegex =
    /"(\w+)":\s*(?:(\[[^\]]*\])|(\{[^}]*\})|"([^"]*)"|(true|false|null|-?\d+(?:\.\d+)?)|(\{[^{]*\}))/g;
  let match;

  while ((match = keyValueRegex.exec(text)) !== null) {
    const [
      ,
      key,
      arrayValue,
      objectValue,
      stringValue,
      primitiveValue,
      nestedObjectValue,
    ] = match;
    try {
      if (arrayValue) {
        result[key] = JSON.parse(arrayValue);
      } else if (objectValue || nestedObjectValue) {
        result[key] = robustJSONParse(objectValue || nestedObjectValue);
      } else if (stringValue !== undefined) {
        result[key] = stringValue;
      } else if (primitiveValue) {
        result[key] = JSON.parse(primitiveValue);
      }
    } catch (e) {
      console.warn(`Couldn't parse value for key ${key}`);
    }
  }

  return result;
}

function parseResponse(responseText: string): AdAnalysis {
  const parsedResponse = robustJSONParse(responseText);
  console.log(
    "cpm: " + parsedResponse.cpm + "|  cpmEurope: " + parsedResponse.cpm_europe,
  );
  return {
    topKeywords: (parsedResponse.top || []).map(
      ({ w, c }: { w: string; c: number }) => ({ word: w, count: c }),
    ),
    longTailKeywords: (parsedResponse.long || []).map(
      ({ p, c }: { p: string; c: number }) => ({ phrase: p, count: c }),
    ),
    genderTarget: parsedResponse.gender_target || [],
    ageTarget: parsedResponse.age_target || [],
    adCategories: parsedResponse.ad_categories || [],
    targetAudience: parsedResponse.target_audience || [],
    estimatedBudget: parsedResponse.estimated_budget || "",
    adObjective: parsedResponse.ad_objective || [],
    marketingStrategies: parsedResponse.marketing_strategies || [],
    seasonTarget: parsedResponse.season_target || [],
    competition: parsedResponse.competition || 0,
    cpm: parsedResponse.cpm || 0,
    cpmEurope: parsedResponse.cpm_europe || 0,
  };
}

// Analyze ad text & Estimation
export async function analyzeKeywords(ad: AdData): Promise<AdAnalysis> {
  const extractedText = extractText(ad);
  const parsedText = parseText(extractedText);

  // Get next model instance from key manager
  const genAI = geminiKeyManager.getNextModel();

  const model = genAI.getGenerativeModel({
    model: process.env.GOOGLE_AI_API_MODEL || "",
  });

  const prompt = `
  Analyze Facebook ad text. Return JSON:
  {
    "top": [{"w": "word", "c": count}],
    "long": [{"p": "phrase", "c": count}],
    "gender_target": ["Men"|"Women"|"All"],
    "age_target": ["min-max"],
    "ad_categories": ["category keyword"],
    "target_audience": ["audience keyword"],
    "estimated_budget": "Low"|"Medium"|"High",
    "marketing_strategies": ["Problem-Solving"|"Prestige"|"Emotional"|"Trends"|"Holidays"],
    "season_target": ["Spring"|"Summer"|"Autumn"|"Winter"],
    "competition": 0-100,
    "cpm": estimated USD,
    "cpm_europe": estimated EUR
  }
  
  Context: Facebook Ads platform (not Google Ads)
  - Consider industry competitiveness for CPM estimation
  - Factor in targeting specificity and ad format
  - European markets typically cost more than US
  
  Rules:
  - top/long: 15 most relevant, exclude common words
  - Infer demographics from content and tone
  - competition: Facebook marketplace competitiveness (0-100)
  - cpm: realistic Facebook CPM in USD
  - cpm_europe: EU market rates in EUR
  - Base estimates on Facebook advertising costs
  - Return valid JSON only
  
  Ad: "${parsedText}"
  `;
  {
    /*
  "ad_objective": ["primary objective"],
  */
  }
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response
      .text()
      .replace(/^```json\n|\n```$/g, "")
      .trim();
    //console.log("🤖🤖🤖🤖 Raw API Response:", responseText);
    console.log(
      "\n",
      "🤖🤖🤖🤖 ~ Gemini API ~ 📊📊📊📊 Analyze Keywords",
      " ~ \n",
    );

    return parseResponse(responseText);
  } catch (error) {
    console.error("Error in keyword analysis:", error);
    return {
      topKeywords: [],
      longTailKeywords: [],
      genderTarget: [],
      ageTarget: [],
      adCategories: [],
      targetAudience: [],
      estimatedBudget: "",
      adObjective: [],
      marketingStrategies: [],
      seasonTarget: [],
      competition: 0,
      cpm: 0,
      cpmEurope: 0, // Default value for European CPM
    };
  }
}

// Generate ad creative
export async function generateAdCreative(
  ad: AdData,
  language: string = "English",
): Promise<AdCreative> {
  const extractedText = extractText(ad);

  const parsedText = parseText(extractedText);

  //console.log("🤖🤖🤖🤖 ~ ", parsedText);

  // Get next model instance from key manager
  const genAI = geminiKeyManager.getNextModel();

  const model = genAI.getGenerativeModel({
    model: process.env.GOOGLE_AI_API_MODEL || "",
  });

  const prompt = `
  Create high-converting Facebook Ad in ${language}. Return JSON:
  {
    "primaryText": "Engaging text with emojis (125 chars max)",
    "headline": "Powerful headline (5-7 words)",
    "description": "Compelling description (2-3 sentences)",
    "callToAction": "Best CTA"
  }
  Rules:
  - Use AIDA: Attention, Interest, Desire, Action
  - Incorporate urgency/scarcity
  - Highlight unique value proposition
  - Use power words and emotional triggers
  - Include social proof
  - Ensure ad stands out
  - Maintain core message
  - Strategic emoji use
  - Choose from CTAs: [Sign up, Subscribe, Learn more, Shop now, Book now, Get offer, Download, Contact us]
  - Generate all text except callToAction in ${language}
  - If ${language} is not supported, use English
  Original ad: "${parsedText}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response
      .text()
      .replace(/^```json\n|\n```$/g, "")
      .trim();
    // console.log(`🎨🎨🎨🎨 Generated Ad Creative:`, responseText);
    console.log(
      "\n",
      `🤖🤖🤖🤖 ~ Gemini API ~ 🎨🎨🎨🎨 Generated Ad Creative:`,
      " ~ \n",
    );

    const parsedResponse = robustJSONParse(responseText);
    return {
      primaryText: parsedResponse.primaryText || "",
      headline: parsedResponse.headline || "",
      description: parsedResponse.description || "",
      callToAction: parsedResponse.callToAction || "",
    };
  } catch (error) {
    console.error(`Error in ad creative generation (${language}):`, error);
    return {
      primaryText: `Error generating ad creative in ${language}`,
      headline: "Error",
      description: `An error occurred while generating the ad creative in ${language}.`,
      callToAction: "Error",
    };
  }
}

// Usage example in your component or API route
// const adCreative = await generateAdCreative(adObject, language);

function extractText(ad: AdData): ExtractedAdText {
  const { snapshot } = ad;
  const extracted: ExtractedAdText = {
    titles: [],
    bodies: [],
    pageName: ad.page_name || snapshot.page_name || "",
    cta: [],
    caption: snapshot.caption || "",
  };

  // Extract title and body from main snapshot
  if (snapshot.title) extracted.titles.push(snapshot.title);
  if (snapshot.body?.text) extracted.bodies.push(snapshot.body.text);

  // Extract CTA from main snapshot
  if (snapshot.cta_text && snapshot.cta_type) {
    extracted.cta.push(`${snapshot.cta_text} (${snapshot.cta_type})`);
  }

  // Extract from cards if available
  if (snapshot.cards && snapshot.cards.length > 0) {
    snapshot.cards.forEach((card: Media) => {
      if (card.title && !extracted.titles.includes(card.title))
        extracted.titles.push(card.title);
      if (card.body && !extracted.bodies.includes(card.body))
        extracted.bodies.push(card.body);
      if (card.cta_text && card.cta_type) {
        const ctaCombo = `${card.cta_text} (${card.cta_type})`;
        if (!extracted.cta.includes(ctaCombo)) extracted.cta.push(ctaCombo);
      }
    });
  }

  // console.log("extracted", extracted);

  return extracted;
}

function parseText(extractedText: ExtractedAdText): string {
  const cleanAndJoin = (arr: string[]) =>
    arr.map((item) => cleanHtml(item)).join(" | ");

  return `
Titles: ${cleanAndJoin(extractedText.titles)}
Bodies: ${cleanAndJoin(extractedText.bodies)}
Page Name: ${extractedText.pageName}
CTA: ${cleanAndJoin(extractedText.cta)}
Caption: ${cleanHtml(extractedText.caption)}
`.trim();
}

function cleanHtml(text: string): string {
  const parsedText = parse(text);
  const textContent =
    typeof parsedText === "string"
      ? parsedText
      : (Array.isArray(parsedText) ? parsedText : [parsedText])
          .map((child) => {
            if (typeof child === "string") return child;
            if (
              typeof child === "object" &&
              child !== null &&
              "props" in child &&
              typeof child.props.children === "string"
            )
              return child.props.children;
            return "";
          })
          .join(" ");
  return textContent.replace(/\s+/g, " ").trim();
}
