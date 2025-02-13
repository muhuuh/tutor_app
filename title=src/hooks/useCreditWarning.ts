import { useState } from "react";

export function useCreditWarning() {
  const [showCreditWarning, setShowCreditWarning] = useState(false);

  const handleCreditError = (response: any) => {
    // We expect response to contain our JSON with error details
    if (response.errorType === "subscription_error") {
      console.log("Found subscription error; showing modal");
      setShowCreditWarning(true);
      return true;
    }
    return false;
  };

  return {
    showCreditWarning,
    setShowCreditWarning,
    handleCreditError,
  };
}
