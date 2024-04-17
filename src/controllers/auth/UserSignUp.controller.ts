import { UserSignUpParams } from '../../definitions';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { db } from '../../../App';
import { RowDataPacket } from 'mysql2';

export async function UserSignUpController(req: Request, res: Response) {
  let params: UserSignUpParams;

  try {
    params = await new UserSignUpParams(req.body).validate();
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Invalid request parameters \n ${err}`);
  }

  try {
    db.query('SELECT id FROM users WHERE id = ?', params.id, async (err, result) => {
      if (err) {
        console.error('Error checking email:', err.message);
        return res.status(500).send('Internal server error');
      }

      if ((result as RowDataPacket[]).length > 0) {
        return res.status(409).send('This email belongs to an existing user');
      }

      const hashedPassword = await bcrypt.hash(params.password, 10);

      db.query('INSERT INTO users SET ?', { id: params.id, password: hashedPassword }, err => {
        if (err) {
          console.error('Error inserting user:', err.message);
          return res.status(500).send('Internal server error');
        }

        return res.send('User signed up');
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
}
