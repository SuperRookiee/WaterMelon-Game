import sb from "../assets/scss/ScoreBoard.module.scss";

const ScoreBoard = ({ score }) => {

    return (
        <section>
            <h1 id={sb.title}>수박 게임</h1>
            <p>score : {score}</p>
            <div className={sb.score}>
                {Array.from({ length: 30 }, (_, index) => (
                    <div key={index}>Score {index}</div>
                ))}
            </div>
        </section>
    );
};

export default ScoreBoard;