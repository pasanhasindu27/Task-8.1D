import React, { useState } from 'react';
import {
  Segment,
  Grid,
  Header,
  Input,
  Button,
  List,
  Message
} from 'semantic-ui-react';
import axios from 'axios';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [responseMsg, setResponseMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically use deployed API in production or localhost during development
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setResponseMsg({ type: 'error', text: '❌ Please enter a valid email address.' });
      return;
    }

    try {
      setLoading(true);
      setResponseMsg(null);

      const response = await axios.post(`${API_BASE}/subscribe`, { email });

      if (response.data.success) {
        setResponseMsg({ type: 'success', text: '✅ Welcome email sent!' });
        setEmail('');
      } else {
        setResponseMsg({ type: 'error', text: '❌ Failed to send email.' });
      }
    } catch (error) {
      console.error("🛑 Subscription failed:", error.response?.data || error.message);
      setResponseMsg({ type: 'error', text: '❌ Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment vertical style={{ padding: '3em 0em', backgroundColor: '#2b7a78', color: 'white' }}>
      <div style={{ backgroundColor: '#d3d3d3', padding: '1em', textAlign: 'center', color: 'black' }}>
        <strong>SIGN UP FOR OUR DAILY INSIDER</strong>
        <Input
          type="email"
          placeholder="Enter your email"
          style={{ margin: '0 1em' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button loading={loading} onClick={handleSubscribe}>
          Subscribe
        </Button>
        {responseMsg && (
          <Message
            compact
            style={{ marginTop: '1em' }}
            positive={responseMsg.type === 'success'}
            negative={responseMsg.type === 'error'}
            content={responseMsg.text}
          />
        )}
      </div>

      <Grid divided stackable textAlign="center" columns={3} style={{ marginTop: '2em' }}>
        <Grid.Row>
          <Grid.Column>
            <Header inverted as="h4">Explore</Header>
            <List link inverted>
              <List.Item as="a">Home</List.Item>
              <List.Item as="a">Questions</List.Item>
              <List.Item as="a">Articles</List.Item>
              <List.Item as="a">Tutorials</List.Item>
            </List>
          </Grid.Column>

          <Grid.Column>
            <Header inverted as="h4">Support</Header>
            <List link inverted>
              <List.Item as="a">FAQs</List.Item>
              <List.Item as="a">Help</List.Item>
              <List.Item as="a">Contact Us</List.Item>
            </List>
          </Grid.Column>

          <Grid.Column>
            <Header inverted as="h4">Stay connected</Header>
            <Button circular color="facebook" icon="facebook" />
            <Button circular color="twitter" icon="twitter" />
            <Button circular color="instagram" icon="instagram" />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <div style={{ textAlign: 'center', marginTop: '2em' }}>
        <p>DEV@Deakin 2022</p>
        <List horizontal divided link inverted size='small'>
          <List.Item as='a'>Privacy Policy</List.Item>
          <List.Item as='a'>Terms</List.Item>
          <List.Item as='a'>Code of Conduct</List.Item>
        </List>
      </div>
    </Segment>
  );
}
