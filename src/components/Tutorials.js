import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import CardItem from './CardItem';
import { fakerEN as faker } from '@faker-js/faker';

const tutorials = Array.from({ length: 3 }).map(() => ({
  title: faker.lorem.words(4),
  description: faker.lorem.sentences(2),
  image: `https://picsum.photos/300/200?random=${Math.random()}`,
  rating: (Math.random() * 1 + 4).toFixed(1),
  author: faker.internet.userName()
}));

export default function Tutorials() {
  return (
    <>
      <Header as="h2" style={{ marginTop: '2em' }}>Featured Tutorials</Header>
      <Card.Group itemsPerRow={3}>
        {tutorials.map((item, idx) => (
          <CardItem key={idx} {...item} />
        ))}
      </Card.Group>
    </>
  );
}
