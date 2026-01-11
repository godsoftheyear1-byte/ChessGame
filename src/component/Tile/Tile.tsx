import './Tile.css';

interface Props {
    number:number;
    image?:string;
}


export default function Tile({ number,image}: Props) {

    if (number % 2 === 0) {
        return <div className="tile black-tile">{image && <img src={image} alt="piece" className="chess-piece"/>}</div>;
    } else {
        return <div className="tile white-tile">{image && <img src={image} alt="piece" className="chess-piece"/>}</div>;
    }
}

