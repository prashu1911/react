import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RankOrderResponse = ({ response = [] }) => {
    const [rankingItems, setRankingItems] = useState(response);

    const handleRankMove = (index, direction) => {
        const newItems = [...rankingItems];
        if (direction === "up" && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === "down" && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setRankingItems(newItems);
    };

    useEffect(() => {
        console.log("Rank Order Items", rankingItems);
    }, [rankingItems]);

    return (
        <div className="takeSUrvey">
            <div className="allOptions d-flex flex-wrap gap-2 flex-column ">
                <div className="facilitatesPrompt">
                    <ul className="list-unstyled mb-0">
                        {rankingItems.map((item, index) => (
                            <li
                                key={item.response_id}
                                className="d-flex align-items-center"
                            >
                                <div className="d-flex gap-2">
                                    {index > 0 && (
                                        <Link
                                            className="facilitatesPrompt_upBtn"
                                            onClick={() => handleRankMove(index, "up")}
                                        >
                                           
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="white"
                                                viewBox="0 0 24 24"
                                                style={{ transform: "rotate(360deg)" }}
                                            >
                                                <path d="M12 20l6-6h-4v-6h-4v6h-4l6 6z" />
                                            </svg>
                                        </Link>
                                    )}
                                    {index < rankingItems.length - 1 && (
                                        <Link
                                            className="facilitatesPrompt_downBtn"
                                            onClick={() => handleRankMove(index, "down")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="white"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 20l6-6h-4v-6h-4v6h-4l6 6z" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>


                                <span>{item.response}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default RankOrderResponse;
