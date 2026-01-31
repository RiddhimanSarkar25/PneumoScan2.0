import { Classification, Stage, ScanResult } from '../types';

// Mock AI Logic Rules as requested:
// Rule 1: Double Check Logic for False Negatives based on keywords.
// Rule 2: Random Staging for Pneumonia.
// Smart Recommendations: Dictionary mapping.

export const mockAiInference = (symptoms: string): ScanResult => {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Simulate AI Classification
  const types = [Classification.Normal, Classification.Bacterial, Classification.Viral];
  // Weighted random to ensure we see enough variety
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  let classification = randomType;
  let stage = Stage.NA;
  let isFlaggedFalseNegative = false;
  
  // Rule 1 (Double Check Logic)
  // If result is Normal BUT symptoms contain "severe", "fever", or "breath"
  if (classification === Classification.Normal) {
    if (lowerSymptoms.includes('severe') || lowerSymptoms.includes('fever') || lowerSymptoms.includes('breath') || lowerSymptoms.includes('pain')) {
      isFlaggedFalseNegative = true;
    }
  }

  // Rule 2 (Staging)
  if (classification !== Classification.Normal) {
    const stages = [Stage.Congestion, Stage.RedHepatization, Stage.GrayHepatization, Stage.Resolution];
    stage = stages[Math.floor(Math.random() * stages.length)];
  }

  // Confidence Score (Random float between 0.75 and 0.99)
  const confidenceScore = 0.75 + Math.random() * 0.24;

  // Smart Recommendations (Dictionary Mapping)
  const recommendations = getRecommendations(classification, stage);

  return {
    classification,
    stage,
    confidenceScore,
    isFlaggedFalseNegative,
    recommendedMeds: recommendations.meds,
    estimatedRecovery: recommendations.recovery,
  };
};

const getRecommendations = (classification: Classification, stage: Stage): { meds: string, recovery: string } => {
  if (classification === Classification.Normal) {
    return { meds: "None required. Monitor symptoms.", recovery: "N/A" };
  }

  const key = `${classification}_${stage}`;

  // Dictionary Mapping
  const mapping: Record<string, { meds: string, recovery: string }> = {
    // Bacterial
    [`${Classification.Bacterial}_${Stage.Congestion}`]: { meds: "Oral Antibiotics (Amoxicillin), Rest", recovery: "1-2 Weeks" },
    [`${Classification.Bacterial}_${Stage.RedHepatization}`]: { meds: "IV Antibiotics (Ceftriaxone), Oxygen Therapy", recovery: "3-4 Weeks" },
    [`${Classification.Bacterial}_${Stage.GrayHepatization}`]: { meds: "Strong IV Antibiotics, Corticosteroids", recovery: "4-6 Weeks" },
    [`${Classification.Bacterial}_${Stage.Resolution}`]: { meds: "Finish Antibiotic Course, Expectorants", recovery: "1-2 Weeks" },
    
    // Viral
    [`${Classification.Viral}_${Stage.Congestion}`]: { meds: "Antivirals (Oseltamivir), Fluids", recovery: "1-3 Weeks" },
    [`${Classification.Viral}_${Stage.RedHepatization}`]: { meds: "Supportive Care, Oxygen if needed", recovery: "2-4 Weeks" },
    [`${Classification.Viral}_${Stage.GrayHepatization}`]: { meds: "High-flow Oxygen, Anti-inflammatory", recovery: "4-8 Weeks" },
    [`${Classification.Viral}_${Stage.Resolution}`]: { meds: "Hydration, Rest", recovery: "1-2 Weeks" },
  };

  return mapping[key] || { meds: "Consult Specialist", recovery: "Unknown" };
};