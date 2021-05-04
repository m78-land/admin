import React, { useEffect, useState } from 'react';
import { Form } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const Test2 = () => {
  const [pass, setPass] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPass(true);
    }, 2000);
  });

  return (
    <div>
      <Form>
        {pass && (
          <Form.Item name="name1" required>
            <Input placeholder="111" />
          </Form.Item>
        )}
        <Form.Item name="name2" required>
          <Input placeholder="222" value="123" />
        </Form.Item>
        <Form.Item name="name3" required>
          <Input placeholder="333" />
        </Form.Item>
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default Test2;
