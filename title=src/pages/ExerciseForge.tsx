import { useState } from "react";

const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  // ... your message logic, etc.

  try {
    console.log("Sending request to exercise-forge...");
    const { data, error } = await supabase.functions.invoke("exercise-forge", {
      body: {
        examId: selectedExam?.id || null,
        teacherId: user.id,
        message: message.trim(),
        mode: isCreatingNew ? "create" : mode,
        correctionId: correction?.id || null,
      },
    });
    console.log("Response received:", { data, error });

    // If the function returned error information in data
    if (data && data.ok === false && data.errorType === "subscription_error") {
      // Use our credit warning hook, or simply show the modal here
      handleCreditError(data);
      return;
    }

    // ... rest of success handling
  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error:", error);
  } finally {
    setIsSendingMessage(false);
  }
};
