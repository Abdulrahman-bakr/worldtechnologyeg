import fs from "fs";
import path from "path";

const dir = path.resolve("./"); // هيشتغل داخل نفس المجلد اللي فيه السكريبت

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
  <svg
    className={className || "w-6 h-6"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    {/* SVG content for ${name} */}
  </svg>
);
`;

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log("✅ Created:", filePath);
  } else {
    console.log("⚠️ Exists:", filePath);
  }
});

console.log("\n✅ All icon files created successfully!");
