import React from "react";

import ErrorImg from "../../../assets/ErrorImg.svg";


const ErrorMsg: React.FC = () => {
    return (
        <div className="flex items-center flex-col p-3">
            <img src={ErrorImg} alt="Error"/>
            <p className="text-gray-200 ">
                Error!
            </p>
        </div>
    )
}

export default ErrorMsg;