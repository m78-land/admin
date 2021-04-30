import React, { useEffect, useState } from 'react';
import Form, { Item } from 'm78/form';
import Input from 'm78/input';
import Button from 'm78/button';

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
          <Item name="name1" required>
            <Input placeholder="111" />
          </Item>
        )}
        <Item name="name2" required>
          <Input placeholder="222" value="123" />
        </Item>
        <Item name="name3" required>
          <Input placeholder="333" />
        </Item>
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default Test2;
