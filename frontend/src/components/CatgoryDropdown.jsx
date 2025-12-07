import React from "react";

function CategorySelector({ label, options, name, value, onChange }) {
  return (
    <div className="form-control">
      <label
        htmlFor="category"
        className="label text-sm font-semibold text-accent m-3"
      >
        {label}
      </label>
      <select
        id="category"
        name={name}
        value={value}
        onChange={onChange}
        className="select select-bordered border-primary focus:outline-none text-base-content"
      >
        <option value="">Select a category</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelector;