import {useState, useEffect} from "react";

export default function RecommendationFilter({filters,onFilterChange}){

    const [category,setCategory] = useState("");
    const [mood,setMood] = useState("");
    const [recommender,setRecommender] = useState("");

    useEffect(() => {
        setCategory(filters.category || "");
        setMood(filters.mood || "");
        setRecommender(filters.recommender || "");
    },[filters]);

    //selected filters 
    const applyFilters = () => {
        onFilterChange({
            category,
            mood,
            recommender,
        });
    };

    return(
        <div className="p-4 rounded-xl bg-base-100 shadow-md space-y-4">
            <h2 className="text-xl font-bold text-primary">Filters</h2>

            <div className="form-control">
                <label className="label">Category</label>
                <select className="select select-primary w-full"
                        value ={category}
                        onChange={(e) => setCategory(e.target.value)}
                        >
                    <option value="">All Categories</option>
                    <option value ="Book">Book</option>
                    <option value="Movie">Movie</option>
                    <option value ="TV show">TV show</option>
                    <option value="Others">Others</option>    
                </select>
            </div>

            <div className="form-control">
                <label className="label">Moods</label>
                <select className="select select-secondary w-full"
                        value = {mood}
                        onChange = {(e)=> setMood(e.target.value)}>
                    <option value="">All Moods</option>
                    <option value="1">Happy</option>
                    <option value="2">Sad</option>
                    <option value="3">Excited</option>
                    <option value="4">Calm</option>
                </select>
            </div>

            <div className="form-control">
                <label className="label">
                    Recommended By
                </label>

                <input type="text"
                 placeholder="Enter Name"
                 className="input input-accent w-full"
                 value ={recommender}
                 onChange={(e) => setRecommender(e.target.value)}
                />

            </div>

            <button className="btn btn-primary w-full" onClick={applyFilters}>
                Apply Filters
            </button>
        </div>
    );
    
}