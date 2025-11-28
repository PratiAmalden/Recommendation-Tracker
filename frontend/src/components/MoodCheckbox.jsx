import React from "react";

function MoodSelector({ label, name, value, options, onChange }) {
  return (
    <fieldset className="form-control">
      <legend className="label text-sm font-semibold text-accent mb-1">
        {label}
      </legend>
      <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
          <label
            key={opt.id}
            htmlFor={`opt-${opt.id}`}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-primary cursor-pointer hover:border-accent mt-1"
          >
            <input
              type="checkbox"
              id={`opt-${opt.id}`}
              name={name}
              value={opt.id}
              onChange={onChange}
              checked={value.includes(opt.id)}
              className="checkbox bg-base-content checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
            />
            <span className="text-sm text-accent p-1">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default MoodSelector;
