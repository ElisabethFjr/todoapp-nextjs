"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import styles from "./PaletteColor.module.scss";

const colors = [
  { color: "#f6e2dd", title: "Corail" },
  { color: "#fff8b8", title: "Jaune" },
  { color: "#e2f6d3", title: "Menthe" },
  { color: "#d4e4ed", title: "Bleu" },
  { color: "#d3bfdb", title: "Lila" },
];

interface PaletteColorProps {
  onSelectColor: (color: string) => void;
}

function PaletteColor({ onSelectColor }: PaletteColorProps) {
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelectColor(selectedColor);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <ul className={styles.colors}>
        {colors.map((color) => (
          <li className={styles.color} key={nanoid()}>
            <input
              className={styles.input}
              type="color"
              value={color.color}
              onChange={() => handleColorChange}
            />
          </li>
        ))}
      </ul>
      <button className={styles.submit} type="submit" />
    </form>
  );
}

export default PaletteColor;
