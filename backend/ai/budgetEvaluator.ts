export function evaluateBudget(goal: string, proposedBudget: number) {
  let finalDecidedBudget = proposedBudget;
  let category = "General";
  let status = "PENDING_APPROVAL";
  let tier = "Standard";
  let aiReasoning = "Budget is within policy limits.";

  if (goal.includes("Website Development")) {
    category = "Website Development";
    if (proposedBudget <= 40000) {
      tier = "Good";
      finalDecidedBudget = Math.max(20000, proposedBudget);
    } else if (proposedBudget <= 70000) {
      tier = "Best";
      finalDecidedBudget = proposedBudget;
    } else {
      tier = "Premium";
      finalDecidedBudget = Math.min(100000, proposedBudget);
    }
  } else if (goal.includes("Cloud Migration")) {
    category = "Cloud Migration";
    if (proposedBudget <= 150000) {
      tier = "Good";
      finalDecidedBudget = Math.max(50000, proposedBudget);
    } else if (proposedBudget <= 300000) {
      tier = "Best";
      finalDecidedBudget = proposedBudget;
    } else {
      tier = "Premium";
      finalDecidedBudget = Math.min(500000, proposedBudget);
    }
  } else if (goal.includes("Mobile App")) {
    category = "Mobile App";
    if (proposedBudget <= 150000) {
      tier = "Good";
      finalDecidedBudget = Math.max(80000, proposedBudget);
    } else if (proposedBudget <= 220000) {
      tier = "Best";
      finalDecidedBudget = proposedBudget;
    } else {
      tier = "Premium";
      finalDecidedBudget = Math.min(300000, proposedBudget);
    }
  } else if (goal.includes("Bug Fixing")) {
    category = "Bug Fixing";
    if (proposedBudget <= 10000) {
      tier = "Good";
      finalDecidedBudget = Math.max(5000, proposedBudget);
    } else if (proposedBudget <= 20000) {
      tier = "Best";
      finalDecidedBudget = proposedBudget;
    } else {
      tier = "Premium";
      finalDecidedBudget = Math.min(30000, proposedBudget);
    }
  } else {
    // Fallback logic for Custom/General requests
    if (proposedBudget <= 50000) {
      tier = "Good";
    } else if (proposedBudget <= 150000) {
      tier = "Best";
    } else {
      tier = "Premium";
    }
  }

  let pricingOptions = "";
  if (category === "Website Development") {
     pricingOptions = "Website Options: Good (₹20,000 - ₹40,000), Best (₹40,001 - ₹70,000), Premium (₹70,001 - ₹1,00,000).";
  } else if (category === "Cloud Migration") {
     pricingOptions = "Cloud Options: Good (₹50,000 - ₹1,50,000), Best (₹1,50,001 - ₹3,00,000), Premium (₹3,00,001 - ₹5,00,000).";
  } else if (category === "Mobile App") {
     pricingOptions = "App Options: Good (₹80,000 - ₹1,50,000), Best (₹1,50,001 - ₹2,20,000), Premium (₹2,20,001 - ₹3,00,000).";
  } else if (category === "Bug Fixing") {
     pricingOptions = "Bug fix Options: Good (₹5,000 - ₹10,000), Best (₹10,001 - ₹20,000), Premium (₹20,001 - ₹30,000).";
  } else {
     pricingOptions = "Custom Options: Good (up to ₹50,000), Best (₹50,001 - ₹1,50,000), Premium (above ₹1,50,000).";
  }

  if (proposedBudget !== finalDecidedBudget) {
    aiReasoning = `The proposed budget of ₹${proposedBudget} was out of bounds for the ${tier} tier. Adjusted to ₹${finalDecidedBudget}. Based on this budget, we will deliver a ${tier} tier product. ${pricingOptions}`;
  } else {
    aiReasoning = `Based on your proposed budget of ₹${proposedBudget}, we will deliver a ${tier} tier product. ${pricingOptions}`;
  }

  return { originalBudget: proposedBudget, finalDecidedBudget, aiReasoning, category, status, tier };
}
