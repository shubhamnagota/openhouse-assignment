import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const key = "AIzaSyDmFieK97cqTENBxdM7wMR_RLZdKjY-bb0";
const searchEngineId = "018264299595958242005:dvs2adlrsca";

function App() {
    const [data, setData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("classes");
    const [message, setMessage] = useState(null);
    const [start, setStart] = useState(1);
    const [numOfPages, setNumOfPages] = useState([]);

    useEffect(() => {
        if (data === null) {
            fetch(
                `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${searchEngineId}&q=${searchTerm}&start=${start}`,
            )
                .then((response) => response.json())
                .then((response) => {
                    if (response.searchInformation) {
                        const { totalResults } = response.searchInformation;
                        const numOfPages =
                            totalResults % 10 === 0 ? parseInt(totalResults / 10) : parseInt(totalResults / 10) + 1;
                        let array = [];
                        for (let index = 0; index < numOfPages; index++) {
                            array.push(index);
                        }
                        setNumOfPages(array);
                    }
                    if (response.items) {
                        setData(response.items);
                        setMessage(null);
                    } else {
                        setMessage("Nothing Found with this query");
                    }
                })
                .catch((err) => setData(err.message));
        }
    }, [data, start, searchTerm]);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <input
                    type="text"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setData(null);
                    }}
                />
                {message && <h4>{message}</h4>}
                {data &&
                    data.map((item) => {
                        const imageSrc =
                            item.pagemap && item.pagemap.cse_thumbnail && item.pagemap.cse_thumbnail[0].src;
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "70%",
                                    margin: "50px",
                                    alignItems: "center",
                                }}>
                                <img src={imageSrc} alt="thumbnail" style={{ borderRadius: "30px" }} />
                                <div
                                    style={{
                                        marginLeft: "50px",
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        flexDirection: "column",
                                    }}>
                                    <a href={item.link}>{item.link}</a>
                                    <h2>{item.title}</h2>
                                    <p>{item.snippet}</p>
                                </div>
                            </div>
                        );
                    })}
                <div
                    style={{
                        margin: "20px 20px 100px",
                        display: "flex",
                        justifyContent: "space-around",
                        width: "35%",
                    }}>
                    {numOfPages.map((num) => {
                        return (
                            <button
                                style={{
                                    height: "50px",
                                    width: "50px",
                                    background: parseInt(start / 10) === num && "#EF5C34",
                                    color: "black",
                                    borderRadius: "15px",
                                    border: "none",
                                }}
                                key={num}
                                onClick={() => {
                                    console.log(start, num);
                                    setStart(num * 10 + 1);
                                    setData(null);
                                }}>
                                {num + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default App;
