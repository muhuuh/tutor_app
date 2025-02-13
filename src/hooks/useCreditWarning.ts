import { useState } from "react";

export function useCreditWarning() {
  const [showCreditWarning, setShowCreditWarning] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);

  const handleCreditError = (response: any) => {
    // We expect response to contain our JSON with error details
    if (response.errorType === "subscription_error") {
      console.log("Found subscription error; showing modal");
      // Set the required credits from the response
      setRequiredCredits(response.requiredCredits || 0);
      setShowCreditWarning(true);
      return true;
    }
    return false;
  };

  return {
    showCreditWarning,
    setShowCreditWarning,
    requiredCredits,
    handleCreditError,
  };
}
