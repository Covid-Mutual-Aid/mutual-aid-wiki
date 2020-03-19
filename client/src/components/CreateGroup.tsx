import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'
import { useRequest } from '../contexts/RequestProvider';

import Location from './Location';

const CreateGroup = () => {
    const request = useRequest();
    const [valid, setValid] = useState(true);
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [location, setLocation] = useState<{ lat: string, lng: string, name: string } | null>(null);

    return (
        <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!location || !link || !name) return setValid(false);
            request(`/dev/createGroup`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    link_facebook: link,
                    location_name: location?.name,
                    location_coord: { lng: location.lng, lat: location.lat }
                })
            })
        }}>
            <Form.Group controlId="formBasicEmail">
                <Form.Control placeholder="Group name" onChange={(e: any) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Control placeholder="Facebook link" onChange={(e: any) => setLink(e.target.value)} />
            </Form.Group>
            <Location onChange={setLocation} placeholder={'Group location'} />
            <Button variant="primary" type="submit" style={{ marginTop: '2rem' }}>
                Add Group
            </Button>
        </Form >
    );
}

export default CreateGroup