import './card.css'
import { Link } from "react-router-dom";

export default function Card({
    link='',
    name='',
    time='',
    description='',
    category='',
    workout_type='',
    body_part='',
    element
}){
    return (
        <div className="viewItem">
            <div className="link">
                {link && <Link to={link} style={{ textDecoration: "none", color: "white" }}>
                    Watch Workout Video
                </Link>}
            </div>
            <div className="details">
                <div className="name">{name}</div>
                {workout_type&&<div className="type">{workout_type}</div>}
                {body_part&&<div className="part">{body_part}</div>}
                {description&&<div className="desc">{description}</div>}
                {time&&<div className="time">{time} minutes</div>}
                {category&&<div className="cat">{category}</div>}
            </div>
            {element}
        </div>
    )
}