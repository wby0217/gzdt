import React, { useState, useEffect } from "react";
import "./SwitchBtn.scss";

interface Props {
    btnData: any;
    onClick: { (id: string): void }
}

const SwitchBtn: { (props: Props): JSX.Element } = (props) => {
    const [id, setIndex] = useState(1);
    const {
        btnData,
        onClick
    } = props;

    return (
        <div className="SwitchBtn">
            <div className="SwitchBtn-btn-wrap">
                {
                    btnData.map((item) => (
                        <div
                            className={`btn ${id === item.id ? 'changeBtn' : ''}`}
                            onClick={() => {
                                setIndex(item.id);
                                onClick(item.id);
                            }}
                        >
                            {item.name}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default SwitchBtn;
