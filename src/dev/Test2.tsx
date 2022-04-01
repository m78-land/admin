import React, { useEffect, useState } from 'react';
import { required, useForm } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const Test2 = () => {
  const [pass, setPass] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPass(true);
    }, 2000);
  });

  const Form = useForm();

  return (
    <div>
      <div>
        {pass && (
          <Form.Field name="name1" validator={[required()]}>
            <Input placeholder="111" />
          </Form.Field>
        )}
        <Form.Field name="name2" validator={[required()]}>
          <Input placeholder="222" value="123" />
        </Form.Field>
        <Form.Field name="name3" validator={[required()]}>
          <Input placeholder="333" />
        </Form.Field>
        <Button type="submit">submit</Button>
      </div>
    </div>
  );
};

export default Test2;
