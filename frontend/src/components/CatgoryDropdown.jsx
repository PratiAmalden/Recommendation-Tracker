import React from "react";
import "../App.css";

function CategorySelector({label,options,name,value,onChange}){
    return(
    <label>
        {label}:
        <select name={name} value={value} onChange={onChange} required> 
            <option value="">Select A Category</option>
            {options.map((opt,index) =>(
                <option key={index} value={opt}>
                    {opt}
                </option>
            ))}
        </select>

    </label>
    )
}
    





export default CategorySelector;