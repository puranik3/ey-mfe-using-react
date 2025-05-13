import { Card, Button } from "react-bootstrap";

import './Item.scss';

const Item = ({ imageUrl, id, name, location, startDate, endDate }) => {
    return (
        <Card className="w-100 p-3">
            <div className="card-img-top-wrapper">
                <Card.Img variant="top" src={imageUrl} alt={name} />
            </div>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text as="div">
                    <div>
                        {location.address}, {location.city}, {location.state}
                    </div>
                    <div>
                        {startDate}
                        <span> - </span>
                        {endDate}
                    </div>
                </Card.Text>
                <Button variant="primary">Know more</Button>
            </Card.Body>
        </Card>
    );
};

export default Item;