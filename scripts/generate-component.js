import fs from "fs";
import path from "path";

// This script is intended to be run from the root of the project.
// Example: node scripts/generate-component.js
// For now, it's specific to creating icon components.

const dir = path.resolve("./src/components/icons/category"); 

const files = [
  "ChargerCatIcon",
  "CableCatIcon",
  "FlashDriveCatIcon",
  "KeyboardCatIcon",
  "BluetoothHeadphonesCatIcon",
  "WiredHeadphonesCatIcon",
  "ComputerSpeakersCatIcon",
  "MobileCaseCatIcon",
  "MouseCatIcon",
  "ElectronicPaymentsCatIcon",
  "GameTopupCatIcon",
  "OtherProductsCatIcon",
];

files.forEach((name) => {
  const filePath = path.join(dir, `${name}.js`);
  const content = `import React from 'react';

export const ${name} = ({ className }) => (
  // Placeholder for SVG or img tag
  // Example: <img src="/assets/icons/your-icon.png" alt="${name}" className={className || "w-6 h-6"} />
  React.createElement("svg", {
    className: className || "w-6 h-6",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor"
  },
    React.createElement("path", { d: "M12 2 L2 22 L22 22 Z" }) // Example placeholder path
  )
);
`;

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log("✅ Created:", filePath);
  } else {
    console.log("⚠️ Exists:", filePath);
  }
});

console.log("\n✅ All icon component files checked/created successfully!");
