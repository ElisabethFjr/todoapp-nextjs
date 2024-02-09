"use client";

import { RefObject, useState } from "react";
import { nanoid } from "nanoid";
import styles from "./PaletteColor.module.scss";
import { CheckCircleFill } from "react-bootstrap-icons";

const colors = [
  { color: "#ffffff", title: "Défault" },
  { color: "#f6e2dd", title: "Corail" },
  { color: "#fff8b8", title: "Jaune" },
  { color: "#e2f6d3", title: "Menthe" },
  { color: "#d4e4ed", title: "Bleu" },
  { color: "#e6dcf8", title: "Lila" },
];

interface PaletteColorProps {
  onSelectColor: (color: string) => void;
  selectedColor: string;
  paletteColorRef: RefObject<HTMLFormElement>;
}

function PaletteColor({
  onSelectColor,
  selectedColor,
  paletteColorRef,
}: PaletteColorProps) {
  const [selected, setSelected] = useState<string>(selectedColor);

  const handleColorChange = (color: string) => {
    setSelected(color);
    onSelectColor(color);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelectColor(selectedColor);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} ref={paletteColorRef}>
      <ul className={styles.colors}>
        {colors.map((color) => (
          <li className={styles.color} key={nanoid()}>
            <input
              className={`${styles.input}
              ${color.color === "#ffffff" ? styles.default : ""}
              ${selectedColor === color.color ? styles.selected : ""}
              `}
              name="color"
              type="radio"
              value={color.color}
              onChange={() => handleColorChange(color.color)}
              style={{ backgroundColor: color.color }}
              checked={selected === color.color}
            />
            {selectedColor === color.color && (
              <CheckCircleFill
                className={styles.checked}
                color="#c4a1ff"
                size={13}
              />
            )}
          </li>
        ))}
      </ul>
      <button className={styles.submit} type="submit" />
    </form>
  );
}

export default PaletteColor;
