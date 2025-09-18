import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';

export default function CardItem({ image, title, description, rating, author }) {
  return (
    <Card>
      <Image src={image} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="star" color="yellow" />
        {rating} {author}
      </Card.Content>
    </Card>
  );
}
