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
        <div className="collapse collapse-arrow bg-base-100 border border-primary/30 rounded-xl shadow-md">
            <input type="checkbox" aria-label="Toggle filters" /> 
            
            <div className="collapse-title text-xl font-bold text-primary flex items-center">
                Filter Recommendations
                {(category || mood || recommender) && (
                    <span className="w-2 h-2 bg-accent rounded-full ml-2 animate-pulse"></span>
                )}
            </div>

            <div className="collapse-content">
                <div className="space-y-4 pt-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="form-control">
                            <label className="label text-base text-accent">Category</label>
                            <select className="select select-bordered select-primary w-full"
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
                            <label className="label text-base text-accent">Moods</label>
                            <select className="select select-bordered select-secondary w-full"
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
                            <label className="label text-base text-accent">Recommended By</label>
                            <input type="text"
                            placeholder="Name..."
                            className="input input-bordered text-base input-accent w-full"
                            value ={recommender}
                            onChange={(e) => setRecommender(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary btn-sm w-full mt-2" onClick={applyFilters}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}