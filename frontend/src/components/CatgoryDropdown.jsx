import React from "react";
import "../App.css";

function CategorySelector({label,options,name,value,onChange}){
    return(
    <>
    <label htmlFor="category">{label}: </label>
        <select id="category" name={name} value={value} onChange={onChange} required> 
            <option value="">Select A Category</option>
            {options.map((opt,index) =>(
            
                <option key={index} value={opt}>
                    {opt}
                </option>
                
            ))}
        </select>
    </>

    
    )
}
    





export default CategorySelector;