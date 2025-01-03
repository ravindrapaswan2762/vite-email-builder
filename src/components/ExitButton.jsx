import React from "react";

function ExitButton() {
  const handleExit = () => {
    // Show a confirm dialog
    const confirmExit = window.confirm(
      "Data is not saved. Are you sure you want to exit?"
    );

    if (confirmExit) {
      // Perform exit logic here.
      // Example 1: Close the tab (works if the page was opened by script)
      // window.close();

      // Example 2: Navigate away
      // window.location.href = "https://www.example.com";

      // Example 3: If using React Router, you might do something like:
      // navigate("/some-other-page");
    }
  };

  return (
    <button
    onClick={handleExit}
    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
    >
  Exit
</button>

  );
}

export default ExitButton;
